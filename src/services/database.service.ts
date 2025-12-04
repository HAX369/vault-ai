/**
 * Database Service
 * Handles all database operations with SQLCipher encryption
 * Privacy: All data encrypted at rest
 */

import Database from 'better-sqlite3';
import { createId } from '@paralleldrive/cuid2';
import encryptionService from './encryption.service';

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  lastModified: number;
}

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export class DatabaseService {
  private db: Database.Database | null = null;
  private dbPath: string;

  constructor(dbPath: string = './vault-ai.db') {
    this.dbPath = dbPath;
  }

  /**
   * Initialize database with encryption
   * Must be called after user authentication
   */
  async initialize(passphrase: string): Promise<void> {
    // Derive encryption key
    await encryptionService.deriveKeyFromPassphrase(passphrase);
    
    // Open database
    this.db = new Database(this.dbPath);
    
    // Enable SQLCipher encryption
    this.db.pragma(`key = '${passphrase}'`);
    
    // Create tables
    this.createTables();
  }

  /**
   * Create database schema
   */
  private createTables(): void {
    if (!this.db) throw new Error('Database not initialized');

    // Conversations table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS conversations (
        id TEXT PRIMARY KEY,
        encrypted_title BLOB NOT NULL,
        encrypted_messages BLOB NOT NULL,
        created_at INTEGER NOT NULL,
        last_modified INTEGER NOT NULL,
        encryption_version INTEGER DEFAULT 1
      )
    `);

    // Documents table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        encrypted_content BLOB NOT NULL,
        encrypted_metadata BLOB NOT NULL,
        file_hash TEXT,
        created_at INTEGER NOT NULL
      )
    `);

    // User context table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS user_context (
        id TEXT PRIMARY KEY,
        encrypted_data BLOB NOT NULL,
        context_type TEXT NOT NULL,
        created_at INTEGER NOT NULL
      )
    `);

    // Create indexes
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_conversations_modified 
      ON conversations(last_modified DESC)
    `);
  }

  /**
   * Store a new conversation
   */
  async storeConversation(conversation: Omit<Conversation, 'id' | 'createdAt' | 'lastModified'>): Promise<string> {
    if (!this.db) throw new Error('Database not initialized');

    const id = createId();
    const now = Date.now();
    
    // Encrypt data
    const encryptedTitle = await encryptionService.encrypt(conversation.title);
    const encryptedMessages = await encryptionService.encrypt(
      JSON.stringify(conversation.messages)
    );

    const stmt = this.db.prepare(`
      INSERT INTO conversations (id, encrypted_title, encrypted_messages, created_at, last_modified)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(id, encryptedTitle, encryptedMessages, now, now);
    
    return id;
  }

  /**
   * Get conversation by ID
   */
  async getConversation(id: string): Promise<Conversation | null> {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare(`
      SELECT * FROM conversations WHERE id = ?
    `);

    const row = stmt.get(id) as any;
    if (!row) return null;

    // Decrypt data
    const title = await encryptionService.decrypt(row.encrypted_title);
    const messages = JSON.parse(
      await encryptionService.decrypt(row.encrypted_messages)
    );

    return {
      id: row.id,
      title,
      messages,
      createdAt: row.created_at,
      lastModified: row.last_modified
    };
  }

  /**
   * List all conversations
   */
  async listConversations(): Promise<Array<Omit<Conversation, 'messages'>>> {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare(`
      SELECT id, encrypted_title, created_at, last_modified
      FROM conversations
      ORDER BY last_modified DESC
    `);

    const rows = stmt.all() as any[];
    
    return Promise.all(
      rows.map(async (row) => ({
        id: row.id,
        title: await encryptionService.decrypt(row.encrypted_title),
        createdAt: row.created_at,
        lastModified: row.last_modified
      }))
    );
  }

  /**
   * Update conversation
   */
  async updateConversation(id: string, messages: Message[]): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const encryptedMessages = await encryptionService.encrypt(
      JSON.stringify(messages)
    );

    const stmt = this.db.prepare(`
      UPDATE conversations
      SET encrypted_messages = ?, last_modified = ?
      WHERE id = ?
    `);

    stmt.run(encryptedMessages, Date.now(), id);
  }

  /**
   * Delete conversation
   */
  deleteConversation(id: string): void {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare(`
      DELETE FROM conversations WHERE id = ?
    `);

    stmt.run(id);
  }

  /**
   * Get database statistics
   */
  getStats(): { conversations: number; documents: number; totalSize: number } {
    if (!this.db) throw new Error('Database not initialized');

    const conversations = this.db.prepare('SELECT COUNT(*) as count FROM conversations').get() as any;
    const documents = this.db.prepare('SELECT COUNT(*) as count FROM documents').get() as any;
    
    return {
      conversations: conversations.count,
      documents: documents.count,
      totalSize: 0 // TODO: Calculate actual size
    };
  }

  /**
   * Close database connection
   */
  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
    encryptionService.clearKey();
  }
}

export default new DatabaseService();