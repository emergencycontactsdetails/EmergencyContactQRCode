# 🛡️ TagSafe — Smart QR Identity & Emergency Card

A 100% static web app that lets users create a privacy-first QR code. 
Scanning the QR opens a public page showing only the info the user 
**chose to share** via toggles.

## ✨ Features
- 🔴 Only 2 required fields (Name + 1 Emergency Contact)
- 🟢 6 sections of optional fields — each behind a toggle
- 📱 QR generation with **lz-string** compression (small, scannable codes)
- 🎴 Download printable ID card (html2canvas)
- 🌗 Dark/Light theme with auto-detect
- 📡 PWA-ready (works offline)
- 🔒 Zero backend — all data lives inside the QR URL
- 💾 Auto-saves draft in LocalStorage

## 🚀 Run Locally
```bash
# any static server works
npx serve .
# or
python3 -m http.server 8080