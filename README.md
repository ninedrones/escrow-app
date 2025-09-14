# Base Escrow dApp

A demo-only **Escrow dApp** on **Base chain**, enabling safe in-person swaps between cash (JPY) and crypto (ETH, USDC, USDT).

## 🚀 Features

- **Safe P2P Swaps**: Create escrows for in-person crypto-to-cash exchanges
- **Oracle-Powered Pricing**: Real-time Chainlink price feeds for accurate conversions
- **Mobile-First Design**: Optimized for mobile vertical layout
- **No Backend Required**: Fully on-chain with frontend-only architecture
- **Security First**: Maker-only release, deadline-based refunds, OTC verification

## 📋 Requirements

- **JPY Amount**: Must be multiples of ¥1,000
- **Cap**: Maximum $5,000 USD equivalent
- **Supported Assets**: ETH, USDC, USDT on Base
- **Deadline**: Default 30 minutes (configurable up to 24h)

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Web3**: wagmi + viem + OnchainKit
- **Smart Contracts**: Solidity 0.8.24+ + OpenZeppelin
- **Oracles**: Chainlink price feeds
- **Testing**: Hardhat + Playwright

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm 8+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd escrow-app
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Smart Contract Development

1. **Compile contracts**
   ```bash
   pnpm compile
   ```

2. **Run tests**
   ```bash
   pnpm test
   ```

3. **Deploy to Base Sepolia**
   ```bash
   pnpm deploy:sepolia
   ```

## 📱 Usage Flow

1. **Create Escrow**: Maker inputs JPY amount and selects crypto asset
2. **Generate OTC Code**: System creates one-time code for verification
3. **In-Person Meeting**: Maker and Taker exchange cash and OTC code
4. **Release Funds**: Maker inputs OTC code to release crypto to Taker
5. **Refund Option**: If deadline passes, Maker can refund their crypto

## 🔒 Security Features

- **Maker-Only Control**: Only escrow creator can release or refund
- **Deadline Protection**: Refunds only available after deadline
- **OTC Verification**: One-time codes prevent replay attacks
- **Oracle Validation**: Real-time price verification prevents manipulation
- **No Plaintext Storage**: OTC codes are hashed on-chain

## 🧪 Testing

- **Unit Tests**: `pnpm test`
- **E2E Tests**: `pnpm e2e`
- **Coverage**: `pnpm test:coverage`

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This application is for **demo purposes only**. Do not use for actual financial transactions. This is a hackathon project and should not be considered production-ready.
