# Vault AI Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18 or higher
- **npm** or **yarn**
- **Ollama** (for local LLM)
- **Git**

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/HAX369/vault-ai.git
cd vault-ai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Install Ollama

#### macOS/Linux
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

#### Windows
Download from [ollama.com](https://ollama.com/download)

### 4. Download AI Models

```bash
# Default model (recommended)
ollama pull llama3.2:3b

# Optional: Faster model
ollama pull phi-3-mini

# Optional: Better quality (requires more RAM)
ollama pull llama3.2:7b
```

### 5. Start Ollama Server

```bash
ollama serve
```

Keep this running in a separate terminal.

### 6. Start Vault AI

```bash
npm start
```

## Configuration

### Model Selection

Edit `src/services/llm.service.ts` to change the default model:

```typescript
private defaultModel: string = 'llama3.2:3b'; // Change this
```

### Database Location

Edit `src/services/database.service.ts` to change database path:

```typescript
constructor(dbPath: string = './vault-ai.db') { // Change this
  this.dbPath = dbPath;
}
```

## First Run

1. **Launch Application**
   ```bash
   npm start
   ```

2. **Create Passphrase**
   - Choose a strong passphrase (12+ characters)
   - This encrypts all your data
   - **IMPORTANT:** Cannot be recovered if forgotten

3. **Verify Privacy**
   - Open Privacy Dashboard
   - Check that "External Calls" shows 0
   - Verify encryption is active

## Troubleshooting

### Ollama Not Running

**Error:** `Ollama is not running`

**Solution:**
```bash
# Start Ollama
ollama serve

# Verify it's running
curl http://localhost:11434/api/tags
```

### Model Not Found

**Error:** `Model not found`

**Solution:**
```bash
# List installed models
ollama list

# Pull missing model
ollama pull llama3.2:3b
```

### Database Locked

**Error:** `Database is locked`

**Solution:**
- Close all instances of Vault AI
- Delete `vault-ai.db-shm` and `vault-ai.db-wal` files
- Restart application

### Out of Memory

**Error:** `JavaScript heap out of memory`

**Solution:**
```bash
# Use smaller model
ollama pull llama3.2:1b

# Or increase Node memory
export NODE_OPTIONS="--max-old-space-size=4096"
npm start
```

## Development Setup

### Install Dev Dependencies

```bash
npm install --save-dev
```

### Run in Development Mode

```bash
npm run dev
```

### Run Tests

```bash
npm test
```

### Build for Production

```bash
npm run build
```

## Privacy Verification

### Check Network Activity

1. Open Privacy Dashboard
2. View Network Log
3. Verify all external calls are blocked

### Inspect Database

```bash
# Database is encrypted - should see gibberish
cat vault-ai.db
```

### Monitor Network Traffic

```bash
# macOS/Linux
sudo tcpdump -i any port 11434

# Should only see localhost traffic
```

## System Requirements

### Minimum
- **CPU:** 4 cores
- **RAM:** 8 GB
- **Storage:** 10 GB free
- **OS:** Windows 10, macOS 11, Ubuntu 20.04

### Recommended
- **CPU:** 8 cores
- **RAM:** 16 GB
- **Storage:** 20 GB free
- **GPU:** Optional (for faster inference)

## Next Steps

- Read [ARCHITECTURE.md](ARCHITECTURE.md) for technical details
- Check [CONTRIBUTING.md](../CONTRIBUTING.md) to contribute
- Join our community discussions

## Support

- **Issues:** [GitHub Issues](https://github.com/HAX369/vault-ai/issues)
- **Email:** gjharshitha369@gmail.com
- **Docs:** [docs/](./)