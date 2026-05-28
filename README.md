# Cryptocurrency Project

Proyek untuk membuat cryptocurrency token sendiri dengan smart contracts.

## 📋 Struktur Project

```
.
├── contracts/              # Smart contracts
│   ├── MyToken.sol        # Token utama (ERC-20)
│   └── Staking.sol        # Staking contract (opsional)
├── scripts/               # Script deployment dan testing
│   ├── deploy.js          # Deploy smart contracts
│   └── interact.js        # Interaksi dengan contract
├── test/                  # Unit tests
│   └── MyToken.test.js    # Test untuk token
├── .env.example           # Environment variables template
├── hardhat.config.js      # Konfigurasi Hardhat
├── package.json           # Dependencies
└── README.md              # Dokumentasi

```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
# Edit .env dengan konfigurasi Anda
```

### 3. Compile Smart Contracts
```bash
npx hardhat compile
```

### 4. Run Tests
```bash
npx hardhat test
```

### 5. Deploy
```bash
npx hardhat run scripts/deploy.js --network [network-name]
```

## 📝 Fitur

- ✅ ERC-20 Token Standard
- ✅ Burnable tokens
- ✅ Pausable tokens
- ✅ Ownable contracts
- ✅ Staking mechanism (opsional)

## 🔗 Resources

- [Hardhat Documentation](https://hardhat.org/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Solidity Docs](https://docs.soliditylang.org/)

## 📄 License

MIT