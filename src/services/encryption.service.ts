/**
 * Encryption Service
 * Handles all encryption/decryption operations using AES-256-GCM
 * Privacy-critical: All user data must pass through this service
 */

export class EncryptionService {
  private encryptionKey: CryptoKey | null = null;

  /**
   * Derive encryption key from user passphrase
   * Uses PBKDF2 with 100,000 iterations for security
   */
  async deriveKeyFromPassphrase(passphrase: string, salt?: Uint8Array): Promise<{ key: CryptoKey; salt: Uint8Array }> {
    const encoder = new TextEncoder();
    const passphraseBuffer = encoder.encode(passphrase);
    
    // Generate or use provided salt
    const keySalt = salt || crypto.getRandomValues(new Uint8Array(16));
    
    // Import passphrase as key material
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      passphraseBuffer,
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );
    
    // Derive AES-256 key
    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: keySalt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
    
    this.encryptionKey = key;
    return { key, salt: keySalt };
  }

  /**
   * Encrypt data using AES-256-GCM
   * Returns base64-encoded string with IV prepended
   */
  async encrypt(data: string): Promise<string> {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not initialized. Call deriveKeyFromPassphrase first.');
    }

    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    
    // Generate random IV (12 bytes for GCM)
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // Encrypt data
    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      this.encryptionKey,
      dataBuffer
    );
    
    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encryptedBuffer), iv.length);
    
    // Convert to base64
    return this.bufferToBase64(combined);
  }

  /**
   * Decrypt data using AES-256-GCM
   * Expects base64-encoded string with IV prepended
   */
  async decrypt(encryptedData: string): Promise<string> {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not initialized. Call deriveKeyFromPassphrase first.');
    }

    // Decode from base64
    const combined = this.base64ToBuffer(encryptedData);
    
    // Extract IV and encrypted data
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);
    
    // Decrypt data
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      this.encryptionKey,
      data
    );
    
    // Convert to string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  }

  /**
   * Convert buffer to base64 string
   */
  private bufferToBase64(buffer: Uint8Array): string {
    const binary = String.fromCharCode(...buffer);
    return btoa(binary);
  }

  /**
   * Convert base64 string to buffer
   */
  private base64ToBuffer(base64: string): Uint8Array {
    const binary = atob(base64);
    const buffer = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      buffer[i] = binary.charCodeAt(i);
    }
    return buffer;
  }

  /**
   * Clear encryption key from memory
   * Call this when user logs out
   */
  clearKey(): void {
    this.encryptionKey = null;
  }
}

export default new EncryptionService();