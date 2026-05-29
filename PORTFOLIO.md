# 🚀 My Projects Portfolio

Welcome to my projects portfolio! This repository contains three amazing projects:

## 📚 Projects

### 1. 💰 **Cryptocurrency Project** (Solidity + Hardhat)
- ERC-20 Token Smart Contract
- Staking Mechanism with 10% APY
- 7-Day Lock Period
- Reward Distribution System
- Full Test Coverage (20+ tests)

**Location:** `/contracts` and `/test`

**Quick Start:**
```bash
npm install
npm test
npm run deploy:sepolia
```

---

### 2. ⏰ **Digital World Clock** (HTML5 + CSS3 + JavaScript)
- Display multiple timezones simultaneously
- Real-time clock updates
- 🔔 Advanced Alarm System
  - Set alarms with custom labels
  - Audio notifications + vibration
  - Toggle on/off
  - Browser notifications
- Search 400+ timezones
- Dark/Light mode
- Auto-save to localStorage

**Location:** `/clock`

**Access:**
- Main Clock: `/clock/index.html`
- Alarm Manager: `/clock/alarm.html`

---

### 3. 🌦️ **Weather Dashboard** (REST API + JavaScript)
- Real-time weather from OpenWeatherMap API
- 5-Day forecast
- 24-Hour hourly forecast
- Air Quality Index (AQI)
- 🌡️ Temperature Converter (C ↔ F ↔ K)
- Geolocation support
- City search with autocomplete
- Dark/Light mode

**Location:** `/weather`

**Access:**
- Weather Dashboard: `/weather/index.html`
- Temperature Converter: `/weather/converter.html`

---

## 🛠️ Technologies Used

**Blockchain & Smart Contracts:**
- Solidity ^0.8.20
- Hardhat
- OpenZeppelin Contracts
- Chai (Testing)

**Frontend:**
- HTML5
- CSS3 (Grid, Flexbox, Animations)
- Vanilla JavaScript (No frameworks)
- Font Awesome Icons

**APIs:**
- OpenWeatherMap API (Weather & Air Quality)
- Browser Geolocation API
- Native Intl API (Timezones)

---

## 📂 Project Structure

```
.
├── index.html              # Landing page with project links
├── contracts/              # Smart contracts
│   ├── MyToken.sol        # ERC-20 Token Contract
│   └── Staking.sol        # Staking Contract
├── scripts/                # Deployment & interaction scripts
│   ├── deploy.js          # Deploy token
│   ├── deploy-staking.js  # Deploy staking
│   └── interact.js        # Interact with contracts
├── test/                   # Test files
│   ├── MyToken.test.js    # Token tests (14 tests)
│   └── Staking.test.js    # Staking tests (13 tests)
├── clock/                  # World Clock Project
│   ├── index.html         # Main clock page
│   ├── alarm.html         # Alarm manager
│   ├── styles.css         # Styling
│   ├── script.js          # Clock logic
│   ├── alarm.js           # Alarm logic
│   └── README.md          # Clock documentation
├── weather/                # Weather Dashboard Project
│   ├── index.html         # Main weather page
│   ├── converter.html     # Temperature converter
│   ├── styles.css         # Styling
│   ├── script.js          # Weather logic
│   └── README.md          # Weather documentation
├── package.json           # Node dependencies
├── hardhat.config.js      # Hardhat configuration
├── .env.example           # Environment variables template
└── README.md              # This file
```

---

## 🚀 Features Summary

| Feature | Status | Project |
|---------|--------|----------|
| ERC-20 Token | ✅ | Cryptocurrency |
| Staking Mechanism | ✅ | Cryptocurrency |
| Reward Distribution | ✅ | Cryptocurrency |
| Multi-timezone Clock | ✅ | Clock |
| Alarm System | ✅ | Clock |
| Temperature Converter | ✅ | Weather |
| Real-time Weather | ✅ | Weather |
| 5-Day Forecast | ✅ | Weather |
| Air Quality Index | ✅ | Weather |
| Dark/Light Mode | ✅ | All |
| Responsive Design | ✅ | All |
| LocalStorage Sync | ✅ | All |

---

## 🌐 Live Demo

**Visit the live projects:**
- 🏠 [Landing Page](https://username.github.io/repo/)
- ⏰ [World Clock](https://username.github.io/repo/clock/)
- ⏰ [Alarm Manager](https://username.github.io/repo/clock/alarm.html)
- 🌦️ [Weather Dashboard](https://username.github.io/repo/weather/)
- 🌡️ [Temperature Converter](https://username.github.io/repo/weather/converter.html)

---

## 💻 Getting Started

### For Cryptocurrency Project:
```bash
# Install dependencies
npm install

# Run tests
npm test

# Compile contracts
npx hardhat compile

# Deploy
npx hardhat run scripts/deploy.js --network sepolia
```

### For Clock & Weather Projects:
Just open the HTML files in your browser!
```bash
# Option 1: Direct file
open clock/index.html
open weather/index.html

# Option 2: Local server
python -m http.server 8000
# Visit http://localhost:8000
```

---

## 📊 Statistics

- **3 Projects** in one portfolio
- **20+ Features** implemented
- **27+ Test Cases** for smart contracts
- **100% Responsive** design
- **Open Source** on GitHub

---

## 🔐 API Keys

**OpenWeatherMap API** (Free tier):
- Already included in the project
- For production, replace with your own key in `weather/script.js`

---

## 📝 Environment Setup

Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```

Configure:
- `SEPOLIA_RPC_URL` - Sepolia testnet RPC
- `PRIVATE_KEY` - Your wallet private key
- `ETHERSCAN_API_KEY` - For contract verification

---

## 🔗 Links

- 📖 [GitHub Repository](https://github.com/rizkyhadinatasitorus1-lang/https-ap.wps.com-l-cbPaeabUy5yEvf0P)
- 🌐 [Portfolio Website](https://username.github.io/repo/)
- 👤 [GitHub Profile](https://github.com/rizkyhadinatasitorus1-lang)
- 📧 Contact: rizkyhadinatasitorus1@gmail.com

---

## 📄 License

MIT License - Feel free to use and modify

---

## 🤝 Contributing

Contributions are welcome! Please feel free to:
- Report issues
- Submit pull requests
- Suggest improvements

---

**Built with ❤️ using modern technologies**

✨ Last Updated: May 2026 ✨
