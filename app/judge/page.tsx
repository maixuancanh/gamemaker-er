import Link from "next/link";
import { Swords } from "lucide-react";

export default function JudgePage() {
  return (
    <main className="min-h-screen bg-[#0d1018] px-5 py-8 text-white">
      <section className="mx-auto max-w-5xl rounded-xl border border-white/10 bg-[#111521] p-6">
        <Link href="/" className="text-sm text-slate-400 hover:text-white">Back to arena</Link>
        <p className="mt-8 inline-flex items-center gap-2 rounded-full bg-red-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-red-100"><Swords className="h-4 w-4" /> Judge mode</p>
        <h1 className="mt-5 text-4xl font-semibold">Gamemaker ER Proof Board</h1>
        <p className="mt-4 max-w-3xl leading-7 text-slate-300">An independent MagicBlock/Solana adaptation of social duel games. Moves and transparent referee verdict hashes route through ER; final match state settles on devnet.</p>
        <div className="mt-8 grid gap-3">{[
          ["Eligibility", "MagicBlock ER is used for fast duel move and verdict proof transactions."],
          ["Creativity", "Turns social competition into a public, auditable Solana arena."],
          ["Technical depth", "Separates move hash, verdict hash, and final settlement hash."],
          ["Showcase", "The live arena creates wallet-signed explorer links for every phase."],
        ].map(([label, detail]) => <div key={label} className="grid gap-2 rounded-lg border border-white/10 bg-black/20 p-4 sm:grid-cols-[180px_1fr]"><p className="font-semibold text-red-200">{label}</p><p className="text-slate-300">{detail}</p></div>)}</div>
      </section>
    </main>
  );
}
