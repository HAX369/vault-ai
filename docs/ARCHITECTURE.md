# Vault AI Architecture

## System Overview

Vault AI is built on a **local-first, privacy-by-design** architecture where all data processing happens on the user's device.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    USER INTERFACE                       │
│              (Electron + React + TypeScript)            │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                 APPLICATION LAYER                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Privacy    │  │  Encryption  │  │   Database   │  │
│  │   Monitor    │  │   Service    │  │   Service    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                  LOCAL AI LAYER                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │    Ollama    │  │  LLM Models  │  │  Embeddings  │  │
│  │   Runtime    │  │ (Llama/Phi)  │  │   (Local)    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                  STORAGE LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  SQLCipher   │  │  Vector DB   │  │  File System │  │
│  │  (Encrypted) │  │   (Local)    │  │  (Encrypted) │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Encryption Service
- **Purpose:** Handle all encryption/decryption operations
- **Algorithm:** AES-256-GCM
- **Key Derivation:** PBKDF2 with 100,000 iterations
- **Privacy Guarantee:** All data encrypted before storage

### 2. LLM Service
- **Purpose:** Interface with local language models
- **Runtime:** Ollama
- **Models:** Llama 3.2, Phi-3, Mistral
- **Privacy Guarantee:** All inference happens locally

### 3. Database Service
- **Purpose:** Manage encrypted data storage
- **Technology:** SQLCipher (encrypted SQLite)
- **Privacy Guarantee:** Data encrypted at rest

### 4. Privacy Service
- **Purpose:** Monitor and enforce privacy policies
- **Features:** Network monitoring, privacy scoring
- **Privacy Guarantee:** Blocks all external data transmission

## Data Flow

### Conversation Flow
```
User Input
    ↓
[Encrypt] → Store in SQLCipher
    ↓
[Local LLM Processing] → Ollama
    ↓
[Encrypt Response] → Store in SQLCipher
    ↓
[Decrypt for Display] → User Interface
```

### Document Processing Flow
```
File Upload
    ↓
[Extract Text Locally] → pdf.js/mammoth
    ↓
[Generate Embeddings] → Local embedding model
    ↓
[Encrypt Everything] → AES-256-GCM
    ↓
[Store] → SQLCipher + Vector DB
```

## Security Layers

### Layer 1: Application Security
- Passphrase-based authentication
- Key derivation (PBKDF2)
- Memory protection

### Layer 2: Data Security
- AES-256-GCM encryption
- Encrypted database (SQLCipher)
- Secure key storage

### Layer 3: Network Security
- Network monitoring
- External call blocking
- Privacy verification

## Privacy Guarantees

✅ **No External Data Transmission**
- All processing happens locally
- Network monitor blocks external calls
- Verifiable through logs

✅ **Encrypted at Rest**
- SQLCipher database encryption
- AES-256-GCM for all data
- Secure key management

✅ **Zero-Knowledge Architecture**
- Optional cloud backups are double-encrypted
- Server cannot decrypt user data
- User controls encryption keys

## Technology Stack

### Frontend
- **Framework:** Electron (desktop), React Native (mobile)
- **UI:** React + TypeScript + Tailwind CSS
- **State:** Zustand/Jotai

### Backend (Local)
- **Runtime:** Node.js
- **Database:** SQLCipher
- **Vector DB:** LanceDB/Chroma

### AI/ML
- **LLM Runtime:** Ollama
- **Models:** Llama 3.2, Phi-3, Mistral
- **Embeddings:** all-MiniLM-L6-v2

### Security
- **Encryption:** Web Crypto API
- **Key Derivation:** PBKDF2
- **Database:** SQLCipher

## Scalability

### Local Performance
- Optimized for consumer hardware
- Model selection based on device capabilities
- Efficient caching and indexing

### Storage Management
- Conversation summarization
- Document compression
- Optional cloud backup (encrypted)

## Future Enhancements

### Phase 2
- Multi-device sync (encrypted)
- Mobile applications
- Browser extension
- Advanced RAG capabilities

### Phase 3
- Enterprise deployment
- Custom model training
- Compliance certifications
- Team collaboration features