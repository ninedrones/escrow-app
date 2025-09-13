# Tasks

## Project Setup
- [ ] Create repo (`base-escrow-dapp`), add `.gitignore`, `.env.example`.
- [ ] Initialize pnpm + Next.js + TypeScript.
- [ ] Install wagmi, viem, OnchainKit, OpenZeppelin, Hardhat.
- [ ] Add Spec Kit (`specs/`), docs/ folder, lint/format config.

## Smart Contract (Escrow.sol)
- [ ] Implement skeleton: `createEscrow`, `release`, `refund`.
- [ ] Restrict to allowed tokens (ETH, USDC, USDT).
- [ ] Enforce multiples of ¥1,000 and cap = $5,000 USD.
- [ ] Store OTC hash, never store plaintext.
- [ ] Add events (indexed: id, maker, taker, asset, jpyAmount, priceRefTag).
- [ ] Add deadline logic: default 30 minutes, max up to 24h.
- [ ] Write unit tests:
  - [ ] Normal flow: create → release.
  - [ ] Refund flow: create → wait deadline → refund.
  - [ ] Validation: reject non-¥1,000 multiples.
  - [ ] Validation: reject cap > $5,000 USD.
  - [ ] Validation: double release/refund prohibited.
  - [ ] Deadline boundary test: refund not possible before expiry.
  - [ ] OTC hash verification test.
  - [ ] Oracle failure test: revert on stale/invalid feed.
- [ ] Deploy to Base Sepolia.

## Frontend
### `/new`
- [ ] Form: JPY amount (validation: multiple of 1000, ≤ $5,000 cap).
- [ ] Asset selector (ETH, USDC, USDT).
- [ ] Oracle integration (Chainlink feeds).
- [ ] Auto-refresh prices (every 60s, on window focus).
- [ ] Show “Updated Xs ago”.
- [ ] Drift alert (±1%).
- [ ] Confirm Modal: snapshot locked → user signs → create escrow tx.
- [ ] Generate OTC code → show plaintext to Maker, store hash on-chain.

### `/session/[id]`
- [ ] Show escrow status.
- [ ] QR code + share link.
- [ ] OTC input field (only Maker can use).
- [ ] Countdown timer for refund availability.
- [ ] Buttons: Release (maker-only), Refund (deadline only).

## Design
- [ ] Mobile vertical layout.
- [ ] Full-width CTA buttons.
- [ ] Countdown displayed in minutes/seconds.
- [ ] Toast notifications (success/error/warning).

## Testing & Demo
- [ ] Unit tests (Hardhat/Foundry).
- [ ] E2E test: Maker creates escrow, Maker releases with OTC after in-person meeting.
- [ ] Refund test after deadline.
- [ ] Oracle failure handling (UI disables create, contract reverts).
- [ ] Drift alert confirmation (±1%).
- [ ] Demo video recording (mobile flow).
- [ ] Update README + pitch one-pager.
