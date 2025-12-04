# Privacy Policy & Guarantees

## Our Privacy Commitment

**Vault AI is built on a simple principle: Your data belongs to you, and only you.**

## What Makes Vault AI Different

### Traditional AI Assistants
```
Your Question → Company Servers → AI Processing → Response
              ↑
         Your data is:
         • Transmitted externally
         • Stored on company servers
         • Potentially analyzed
         • Subject to subpoenas
         • Shared with third parties
```

### Vault AI
```
Your Question → Your Device → Local AI → Response
              ↑
         Your data:
         • Never leaves your device
         • Encrypted at rest
         • Completely private
         • Cannot be subpoenaed from us
         • Never shared (we can't access it)
```

## Privacy Guarantees

### ✅ 1. Local-First Processing

**Guarantee:** All AI inference happens on your device.

**How We Ensure This:**
- Ollama runs locally on your machine
- No external API calls for AI processing
- Network monitor blocks external data transmission
- Open source code (verify yourself)

**Verification:**
```bash
# Monitor network traffic
sudo tcpdump -i any port not 11434

# Should see ZERO traffic when using Vault AI
```

### ✅ 2. End-to-End Encryption

**Guarantee:** All your data is encrypted before storage.

**Technical Details:**
- **Algorithm:** AES-256-GCM
- **Key Derivation:** PBKDF2 (100,000 iterations)
- **Database:** SQLCipher (encrypted SQLite)
- **Master Key:** Derived from your passphrase, never stored

**What's Encrypted:**
- All conversations
- All documents
- All user context
- All metadata

### ✅ 3. Zero-Knowledge Architecture

**Guarantee:** Even if you use cloud backup, we cannot read your data.

**How It Works:**
```
Your Data (already encrypted locally)
    ↓
Second layer of encryption (your public key)
    ↓
Upload to cloud
    ↓
We store encrypted blob
    ↓
We CANNOT decrypt (need your private key)
    ↓
Your private key NEVER leaves your device
```

### ✅ 4. No Data Collection

**We Do NOT Collect:**
- ❌ Your conversations
- ❌ Your documents
- ❌ Your queries
- ❌ Your personal information
- ❌ Usage analytics (unless you opt-in)
- ❌ Telemetry data
- ❌ Crash reports with personal data

**We MAY Collect (Optional, Anonymous):**
- ✅ App version (for updates)
- ✅ Error logs (anonymized, no personal data)
- ✅ Feature usage (anonymous, aggregated)

**You Control:** All analytics are opt-in and can be disabled.

### ✅ 5. Verifiable Privacy

**Guarantee:** Don't trust us—verify our claims.

**How to Verify:**

1. **Open Source Code**
   ```bash
   # Review the code yourself
   git clone https://github.com/HAX369/vault-ai.git
   # Check encryption implementation
   cat src/services/encryption.service.ts
   ```

2. **Network Monitoring**
   - Built-in Privacy Dashboard
   - Real-time network activity log
   - Shows all blocked external calls

3. **Database Inspection**
   ```bash
   # Try to read the database
   cat vault-ai.db
   # You'll see encrypted gibberish
   ```

4. **Independent Audits**
   - Open to security researchers
   - Bug bounty program (coming soon)
   - Third-party security audits

## Privacy Dashboard

Real-time monitoring of your privacy:

```
┌────────────────────────────────────────┐
│  Privacy Status: ✅ MAXIMUM PROTECTION │
├────────────────────────────────────────┤
│  Network Activity:                     │
│  • External calls:        0 ✅         │
│  • Data uploaded:         0 bytes ✅   │
│  • Encrypted backups:     2 (today)    │
│                                        │
│  Data Location:                        │
│  • On your device:        1,247 items  │
│  • External servers:      0 items ✅   │
│                                        │
│  Privacy Score:           100/100 ✅   │
└────────────────────────────────────────┘
```

## Compliance

### GDPR Compliance

**Right to Access:** You have full access to all your data  
**Right to Erasure:** Delete all data with one click  
**Right to Portability:** Export all data anytime  
**Data Minimization:** We collect zero personal data  
**Privacy by Design:** Architecture prevents data leakage  

### HIPAA Compatibility

Vault AI's architecture is compatible with HIPAA requirements:
- ✅ Data encrypted at rest and in transit
- ✅ Access controls (passphrase)
- ✅ Audit logs (privacy dashboard)
- ✅ No third-party data sharing
- ✅ Local processing (no external PHI transmission)

**Note:** For HIPAA compliance, use enterprise version with additional safeguards.

## Threat Model

### What We Protect Against

✅ **Corporate Surveillance**
- Your data never reaches our servers
- We cannot analyze your usage patterns

✅ **Government Subpoenas**
- We don't have your data to hand over
- Zero-knowledge architecture

✅ **Data Breaches**
- No central database to breach
- Your data stays on your device

✅ **Third-Party Access**
- No integrations that leak data
- No analytics that track you

### What We Don't Protect Against

❌ **Physical Device Access**
- If someone has your device and passphrase, they can access data
- **Mitigation:** Use strong passphrase, enable device encryption

❌ **Keyloggers/Malware**
- Malware on your device can capture data
- **Mitigation:** Keep OS updated, use antivirus

❌ **Shoulder Surfing**
- Someone looking at your screen
- **Mitigation:** Privacy screen, auto-lock

## Privacy Score Comparison

| Feature | ChatGPT | Claude | Gemini | **Vault AI** |
|---------|---------|--------|--------|--------------|
| Data Location | Cloud | Cloud | Cloud | **Local** |
| Encryption | Transit | Transit | Transit | **Everything** |
| Company Access | Full | Full | Full | **Zero** |
| Open Source | No | No | No | **Yes** |
| Offline Mode | No | No | No | **Yes** |
| **Privacy Score** | 20/100 | 25/100 | 15/100 | **100/100** |

## Your Rights

### You Have the Right To:

1. **Know What Data Exists**
   - Privacy Dashboard shows everything
   - Export all data anytime

2. **Delete Your Data**
   - One-click deletion
   - Permanent and immediate

3. **Control Your Data**
   - Choose what to store
   - Choose what to backup
   - Choose what to share (nothing by default)

4. **Verify Our Claims**
   - Open source code
   - Network monitoring
   - Independent audits

## Questions?

### "Can you see my conversations?"
**No.** They're encrypted on your device. We never receive them.

### "What if I forget my passphrase?"
**Your data is unrecoverable.** This is by design—if we could recover it, so could others.

### "Do you use my data to train AI?"
**No.** Your data never leaves your device. We have no access to it.

### "Can law enforcement access my data?"
**Not from us.** We don't have your data. They'd need your physical device and passphrase.

### "Is this really private?"
**Yes, and you can verify it.** Check the code, monitor network traffic, inspect the database.

## Contact

Privacy concerns or questions:
- **Email:** gjharshitha369@gmail.com
- **GitHub Issues:** [Report Privacy Concerns](https://github.com/HAX369/vault-ai/issues)

---

**Last Updated:** December 2025  
**Version:** 1.0

*Vault AI - Because privacy is a right, not a feature.*