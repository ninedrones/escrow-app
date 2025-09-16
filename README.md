# Base Escrow dApp

A secure, decentralized escrow application for safe in-person swaps between Japanese Yen (JPY) and cryptocurrency on Base blockchain.

## Project Description

Base Escrow dApp is a demo-only application designed for hackathon purposes that enables secure peer-to-peer transactions between cash (JPY) and cryptocurrency. The platform provides a trustless escrow service where users can safely exchange physical cash for digital assets without the need for a trusted third party.

### Key Features

- **Secure Escrow System**: Smart contract-based escrow with automatic refund capabilities
- **Multi-Asset Support**: ETH, USDC, and USDT support
- **Real-time Price Feeds**: CoinMarketCap API integration for accurate JPY-to-crypto conversions
- **One-Time Code (OTC) System**: Secure verification mechanism for in-person transactions
- **Mobile-First Design**: Optimized for mobile devices with intuitive UX
- **Farcaster Integration**: Mini App support for seamless social interactions

### How It Works

1. **Maker** creates an escrow by depositing cryptocurrency and specifying JPY amount
2. **Taker** receives a QR code with OTC for the transaction
3. **In-person exchange**: Physical cash is exchanged for the OTC code
4. **Release**: Maker releases funds using the OTC code
5. **Automatic Refund**: If not released within deadline, funds are automatically returned

## Technologies Used

### Smart Contracts
- **Solidity 0.8.24**: Smart contract development
- **Hardhat**: Development environment and testing framework
- **OpenZeppelin**: Security-focused smart contract libraries
  - ReentrancyGuard for protection against reentrancy attacks
  - Ownable for access control
  - SafeERC20 for secure token operations

### Frontend
- **Next.js 15.5.3**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Wagmi + Viem**: Ethereum wallet integration
- **OnchainKit**: Coinbase wallet integration
- **React Hot Toast**: User notifications

### Blockchain & APIs
- **Base Sepolia**: Test network for development
- **CoinMarketCap API**: Real-time cryptocurrency price data
- **ERC-20 Tokens**: USDC and USDT support

### Development Tools
- **Playwright**: End-to-end testing
- **ESLint**: Code linting
- **Vercel**: Deployment platform

## Basic Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Smart         │    │   External      │
│   (Next.js)     │    │   Contract      │    │   Services      │
│                 │    │   (Escrow.sol)  │    │                 │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ • Wallet Connect│◄──►│ • Escrow Logic  │    │ • CoinMarketCap │
│ • Price Display │    │ • OTC System    │    │   API           │
│ • QR Code Gen   │    │ • Auto Refund   │    │ • Base Network  │
│ • Mobile UI     │    │ • Multi-token   │    │ • Farcaster     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Smart Contract Architecture

The `Escrow.sol` contract implements:

- **Escrow Management**: Create, release, and refund operations
- **Security Features**: Reentrancy protection, access controls
- **Multi-Token Support**: ETH, USDC, USDT with proper ERC-20 handling
- **OTC Verification**: Cryptographic verification of one-time codes
- **Deadline Management**: Automatic refund after expiration

### Frontend Architecture

- **Pages**: Home, New Escrow, Session Management, Logs
- **Components**: Modular UI components for reusability
- **Hooks**: Custom React hooks for blockchain interactions
- **API Routes**: CoinMarketCap proxy for CORS handling

## Source Code

- **Repository**: [GitHub Repository](https://github.com/your-username/base-escrow-dapp)
- **License**: MIT License (Open Source)
- **Smart Contract**: `contracts/Escrow.sol`
- **Frontend**: `src/` directory with Next.js structure

## Deployment

### Demo Deployment
- **Live Demo**: [https://escrow-app-seven.vercel.app](https://escrow-app-seven.vercel.app)
- **Farcaster Mini App**: Available on Farcaster platform
- **Network**: Base Sepolia Testnet

### Contract Addresses
- **Escrow Contract**: `0xA755f4c3e56c5ea2815c0013843fe9cf6d1762D4`
- **USDC**: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`
- **USDT**: `0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb`

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/base-escrow-dapp.git
   cd base-escrow-dapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API keys and contract addresses
   ```

4. **Compile smart contracts**
   ```bash
   npx hardhat compile
   ```

5. **Deploy contracts**
   ```bash
   npx hardhat run scripts/deploy.cjs --network baseSepolia
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

### Testing

- **Smart Contract Tests**: `npx hardhat test`
- **E2E Tests**: `npx playwright test`
- **Coverage**: `npx hardhat coverage`

## Security Considerations

- **Demo Only**: This application is designed for hackathon demonstration purposes
- **Testnet Only**: Currently deployed on Base Sepolia testnet
- **Price Oracle**: Uses CoinMarketCap API (not decentralized)
- **OTC System**: One-time codes provide basic security for in-person transactions

## Future Enhancements

- **Chainlink Integration**: Decentralized price feeds
- **Multi-chain Support**: Expand to other EVM-compatible chains
- **Advanced Security**: Multi-signature requirements
- **Mobile App**: Native mobile application
- **Analytics**: Transaction analytics and reporting

## Contributing

This is a hackathon project. For production use, additional security audits and testing would be required.

## License

MIT License - see LICENSE file for details.