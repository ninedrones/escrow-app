# Plan

## Stack
- **Smart Contracts**: Solidity 0.8.24+, OpenZeppelin (SafeERC20, Ownable, ReentrancyGuard).
- **Frontend**: Next.js 15 + TypeScript + wagmi + viem + OnchainKit.
- **Oracles**: Chainlink price feeds (ETH/USD, USDC/USD, USD/JPY).
- **RPC**: Base / Base Sepolia via All That Node (fallback to Alchemy/Infura).
- **Testing**: Hardhat or Foundry (unit tests + E2E).

## Architecture
- **No backend**: all logic on-chain, frontend interacts directly.  
- **Escrow.sol** stores:  
  - `id`, `maker`, `asset`, `amount`, `jpyAmount`, `deadline`, `hashOTC`.  
- Events with `indexed` fields for efficient querying.  

## Deadline Policy
- Deadline is defined at `createEscrow`.  
- Default: **30 minutes from creation** (configurable in contract).  
- Maker can optionally specify a longer duration (e.g. up to 24h) via frontend form.  
- Refund is only possible after deadline expiration.  

## Frontend Pages
- `/new`:  
  - Input: JPY amount (¥1,000 multiples).  
  - Asset selector (ETH, USDC, USDT).  
  - Oracle fetch (auto-refresh every 60s, revalidate on focus).  
  - Show “Updated Xs ago”.  
  - Show ±1% drift alert if background price shifts.  
  - Confirm Modal: snapshot locked → user signs → create escrow tx.  
  - Generate OTC code → display plaintext to Maker, store hash on-chain.  

- `/session/[id]`:  
  - Show status: Funded / Released / Refunded.  
  - QR link + OTC input field (only Maker can input).  
  - Countdown timer: “Refund available in X min Y sec”.  
  - Release/Refund buttons with Maker-only guards.  

## Error Handling
- **Oracle failure**:  
  - If any required price feed is stale, missing, or reverts, frontend disables “Create Escrow” button.  
  - User sees: “⚠️ Price feed unavailable, please retry later.”  
  - On-chain `createEscrow` reverts if oracle returns 0 or stale data.  
- **Drift detection**:  
  - If price shifts >1% between calculation and confirm, frontend prompts user to refresh before proceeding.  
- **Transaction failure**:  
  - Clear error message in toast notification.  
- **Timeout**:  
  - Countdown UI for refund availability.  

## UX Constraints
- Mobile-first vertical layout.  
- Full-width CTA buttons.  
- Toast notifications (success/error/warning).  
- Countdown display for refunds.  

## Security
- Maker-only release (ownership enforced).  
- Refund available only after deadline.  
- Prevent double release/refund.  
- Oracle failure blocks transaction.  
- Salt/OTC hashed on-chain, plaintext never stored.  
