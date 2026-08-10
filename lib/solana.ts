import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex } from "@noble/hashes/utils.js";
import { Connection, PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";
import { Buffer } from "buffer";

const DEVNET_RPC = "https://api.devnet.solana.com";
const MAGICBLOCK_ER_RPC = "https://devnet.magicblock.app";
const MEMO_PROGRAM_ID = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");

type SolanaProvider = { publicKey?: PublicKey; connect: () => Promise<{ publicKey: PublicKey }>; signAndSendTransaction: (transaction: Transaction) => Promise<{ signature: string }> };
declare global { interface Window { solana?: SolanaProvider } }
export const shortKey = (key: string) => `${key.slice(0, 4)}...${key.slice(-4)}`;
export const explorerTx = (signature: string) => `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
export const hashPayload = (payload: string) => bytesToHex(sha256(new TextEncoder().encode(payload)));
export async function connectWallet() { if (!window.solana) throw new Error("No Solana wallet found. Install Phantom or Backpack and switch to devnet."); return (await window.solana.connect()).publicKey.toBase58(); }
export async function sendMemoProof(route: "MagicBlock ER" | "Solana Devnet", memo: string) {
  if (!window.solana?.publicKey) throw new Error("Wallet is not connected");
  const connection = new Connection(route === "MagicBlock ER" ? MAGICBLOCK_ER_RPC : DEVNET_RPC, "confirmed");
  const tx = new Transaction().add(new TransactionInstruction({ keys: [], programId: MEMO_PROGRAM_ID, data: Buffer.from(memo, "utf8") }));
  tx.feePayer = window.solana.publicKey;
  tx.recentBlockhash = (await connection.getLatestBlockhash("confirmed")).blockhash;
  const { signature } = await window.solana.signAndSendTransaction(tx);
  await connection.confirmTransaction(signature, "confirmed");
  return signature;
}
