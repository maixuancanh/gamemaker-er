import Link from "next/link";
import { Swords } from "lucide-react";

const programId = "41ZSUWJzg7KHxUeNkaZBDQBQSU3xhnwmiEy2k7WMLTYr";
const deployTx = "rhrXaAMTxMonhfRV8p9UN8gFVFpf7i5xfCLECG94Zv162kMMQ4ZRL5GgtXwUrZZf7gMu4er6s3sazoT343KWe1m";

export default function JudgePage() {
  return (
    <main className="min-h-screen bg-[#0d1018] px-5 py-8 text-white">
      <section className="mx-auto max-w-5xl rounded-xl border border-white/10 bg-[#111521] p-6">
        <Link href="/" className="text-sm text-slate-400 hover:text-white">Back to arena</Link>
        <p className="mt-8 inline-flex items-center gap-2 rounded-full bg-red-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-red-100"><Swords className="h-4 w-4" /> Judge mode</p>
        <h1 className="mt-5 text-4xl font-semibold">Gamemaker ER Proof Board</h1>
        <p className="mt-4 max-w-3xl leading-7 text-slate-300">An independent MagicBlock/Solana adaptation of social duel games. Moves and transparent referee verdict hashes route through ER; final match state settles on devnet.</p>
        <div className="mt-8 grid gap-3">{[
          ["Eligibility", "MagicBlock ER is used for fast duel move and verdict proof transactions against a deployed custom Solana program."],
          ["Creativity", "Turns social competition into a public, auditable Solana arena."],
          ["Technical depth", "Separates move hash, verdict hash, final settlement hash, and custom program instruction logs."],
          ["Showcase", "The live arena creates wallet-signed explorer links for every phase."],
        ].map(([label, detail]) => <div key={label} className="grid gap-2 rounded-lg border border-white/10 bg-black/20 p-4 sm:grid-cols-[180px_1fr]"><p className="font-semibold text-red-200">{label}</p><p className="text-slate-300">{detail}</p></div>)}</div>
        <div className="mt-8 rounded-lg border border-white/10 bg-black/20 p-4">
          <p className="font-semibold text-red-200">Onchain deployment</p>
          <a className="mt-3 block break-all text-sm text-red-100" href={`https://explorer.solana.com/address/${programId}?cluster=devnet`} target="_blank" rel="noreferrer">Program ID: {programId}</a>
          <a className="mt-2 block break-all text-sm text-red-100" href={`https://explorer.solana.com/tx/${deployTx}?cluster=devnet`} target="_blank" rel="noreferrer">Deploy tx: {deployTx}</a>
        </div>
      </section>
    </main>
  );
}
