# Specify

## What are we building?
A demo-only **Escrow dApp** on **Base chain**, enabling safe in-person swaps between cash (JPY) and crypto (ETH, USDC, USDT).  
Users create escrows in multiples of ¥1,000 with a cap equivalent to $5,000 USD.  

## Why are we building this?
- Current P2P swaps rely on trust or custodial middlemen.  
- We want to **showcase a decentralized escrow flow** that works entirely on-chain with no backend.  
- This is designed for **hackathon demo purposes only**, not for production or real financial use.  

## Constraints
- **Oracle-only pricing** (Chainlink ETH/USD, USDC/USD, USD/JPY).  
- **Multiples of ¥1,000** only.  
- **Cap = $5,000 USD equivalent**.  
- **Maker-only release**, refund only after deadline.  
- **Mobile vertical UI** (1-column, bottom CTA buttons).  
- **No backend** (frontend + smart contracts only).  

## Flow
1. Maker opens `/new` page → inputs JPY amount (must be multiple of ¥1,000) and selects asset (ETH/USDC/USDT).  
2. Frontend generates a **one-time OTC code** (random string or QR) for the session.  
   - OTC code is created locally by the **Maker’s frontend** at escrow creation time.  
   - The OTC hash (not plaintext) is stored on-chain.  
   - The plaintext OTC is only shown to Maker for offline/in-person sharing with Taker.  
3. Frontend fetches latest oracle prices → calculates required asset amount.  
4. Maker confirms → Escrow is created and funds locked.  
5. In-person meeting: Maker and Taker settle cash.  
6. Maker inputs the OTC code (to prove physical meeting took place) and calls `release`.  
7. If deadline passes without release, Maker can call `refund`.  

## Security Considerations
- Allowed tokens only: ETH, USDC, USDT on Base.  
- CEI pattern + ReentrancyGuard.  
- Salt/OTC hashing to prevent replay attacks.  
- Events indexed for off-chain tracking.  
- Maker retains full control: only Maker can release or refund.  
