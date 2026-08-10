# Gamemaker ER

Independent Solana Blitz V7 submission for real-time social duel proof with MagicBlock ER.

## Demo Flow

1. Connect a Solana devnet wallet.
2. Create a duel with two public players.
3. Commit a move hash through MagicBlock ER.
4. Log a transparent referee verdict hash through MagicBlock ER.
5. Settle the final match hash on Solana devnet.

## MagicBlock Use

- ER endpoint: `https://devnet.magicblock.app`
- Solana devnet endpoint: `https://api.devnet.solana.com`
- Proof format: signed memo transactions for the MVP.

## Local Development

```bash
npm install
npm run dev
```

## Reference

Inspired by Gamemaker's public ETHGlobal showcase and source architecture. This is a new Solana/MagicBlock implementation with new product framing and assets.
