"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ExternalLink, Flame, Loader2, Swords, Trophy, Wallet } from "lucide-react";
import { connectWallet, explorerTx, hashPayload, sendMemoProof, shortKey } from "@/lib/solana";

type Proof = { label: string; route: "MagicBlock ER" | "Solana Devnet"; signature: string };

export default function Home() {
  const [wallet, setWallet] = useState("");
  const [duel, setDuel] = useState("arena-77");
  const [playerA, setPlayerA] = useState("@builder_alpha");
  const [playerB, setPlayerB] = useState("@builder_beta");
  const [move, setMove] = useState("Argue with speed, proof, and product clarity.");
  const [verdict, setVerdict] = useState("Alpha wins by producing a clearer on-chain proof trail.");
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [proofs, setProofs] = useState<Proof[]>([]);

  const moveHash = useMemo(() => hashPayload(`${duel}:${playerA}:${move}`), [duel, playerA, move]);
  const verdictHash = useMemo(() => hashPayload(`${duel}:${playerA}:${playerB}:${verdict}`), [duel, playerA, playerB, verdict]);

  async function onConnect() {
    setBusy("connect"); setError("");
    try { setWallet(await connectWallet()); }
    catch (err) { setError(err instanceof Error ? err.message : "Wallet connection failed"); }
    finally { setBusy(""); }
  }

  async function proof(label: string, route: Proof["route"], memo: string) {
    setBusy(label); setError("");
    try {
      const signature = await sendMemoProof(route, memo);
      setProofs((items) => [{ label, route, signature }, ...items]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Proof transaction failed");
    } finally { setBusy(""); }
  }

  return (
    <main className="min-h-screen bg-[#0d1018] text-white">
      <section className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 gap-6 px-5 py-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="flex flex-col justify-between rounded-xl border border-white/10 bg-[#151a28] p-6">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image src="/brand-logo.png" alt="Gamemaker ER logo" width={48} height={48} className="h-12 w-12 rounded-lg object-cover" priority />
              <div><p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-200">Gamemaker ER</p><p className="text-xs text-slate-400">Real-time duel arena</p></div>
            </div>
            <a href="/judge" className="text-sm text-slate-300 hover:text-white">Judge</a>
          </nav>
          <div className="max-w-xl py-16">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-300/30 bg-red-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-red-100"><Swords className="h-4 w-4" /> Social duel proof</p>
            <h1 className="text-5xl font-semibold leading-[1.02]">Make every duel fast, public, and auditable.</h1>
            <p className="mt-5 text-lg leading-8 text-slate-300">Gamemaker ER adapts social AI duels into a Solana arena where moves route through MagicBlock ER and final verdict hashes settle on devnet.</p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-sm">{["Move hash", "Referee hash", "Result proof"].map((x) => <div key={x} className="rounded-lg border border-white/10 bg-white/[0.05] p-4"><Flame className="mb-3 h-5 w-5 text-red-300" /><p>{x}</p></div>)}</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#111521] p-5 shadow-xl shadow-black/20">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div><h2 className="text-2xl font-semibold">Duel Arena</h2><p className="text-sm text-slate-400">Commit a move, log a transparent verdict, and settle the match.</p></div>
            <button onClick={onConnect} className="inline-flex h-11 items-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-black hover:bg-red-200">{busy === "connect" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4" />}{wallet ? shortKey(wallet) : "Connect Wallet"}</button>
          </div>
          <div className="grid gap-5 py-5">
            <label className="grid gap-2"><span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Duel ID</span><input value={duel} onChange={(e) => setDuel(e.target.value)} className="h-12 rounded-lg border border-white/10 bg-black/20 px-4 outline-none focus:border-red-300" /></label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-2"><span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Player A</span><input value={playerA} onChange={(e) => setPlayerA(e.target.value)} className="h-12 rounded-lg border border-white/10 bg-black/20 px-4 outline-none focus:border-red-300" /></label>
              <label className="grid gap-2"><span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Player B</span><input value={playerB} onChange={(e) => setPlayerB(e.target.value)} className="h-12 rounded-lg border border-white/10 bg-black/20 px-4 outline-none focus:border-red-300" /></label>
            </div>
            <label className="grid gap-2"><span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Player move</span><textarea value={move} onChange={(e) => setMove(e.target.value)} className="min-h-24 rounded-lg border border-white/10 bg-black/20 p-4 outline-none focus:border-red-300" /></label>
            <label className="grid gap-2"><span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Referee verdict</span><textarea value={verdict} onChange={(e) => setVerdict(e.target.value)} className="min-h-24 rounded-lg border border-white/10 bg-black/20 p-4 outline-none focus:border-red-300" /></label>
            <div className="grid gap-3 rounded-lg border border-white/10 bg-black/20 p-4 sm:grid-cols-2"><div><p className="text-xs uppercase tracking-[0.18em] text-slate-500">Move hash</p><p className="mt-2 break-all font-mono text-xs text-red-200">{moveHash}</p></div><div><p className="text-xs uppercase tracking-[0.18em] text-slate-500">Verdict hash</p><p className="mt-2 break-all font-mono text-xs text-red-200">{verdictHash}</p></div></div>
            <div className="grid gap-3 sm:grid-cols-3">
              <button disabled={!wallet || Boolean(busy)} onClick={() => proof("Commit move", "MagicBlock ER", `GAMEMAKER_ER_MOVE:${moveHash}`)} className="h-12 rounded-lg bg-red-500 font-semibold disabled:opacity-40">Commit ER</button>
              <button disabled={!wallet || Boolean(busy)} onClick={() => proof("Log verdict", "MagicBlock ER", `GAMEMAKER_ER_VERDICT:${verdictHash}`)} className="h-12 rounded-lg border border-white/10 font-semibold disabled:opacity-40">Log Verdict</button>
              <button disabled={!wallet || Boolean(busy)} onClick={() => proof("Settle match", "Solana Devnet", `GAMEMAKER_ER_SETTLE:${duel}:${verdictHash}`)} className="h-12 rounded-lg bg-white font-semibold text-black disabled:opacity-40">Settle L1</button>
            </div>
            <div className="rounded-lg border border-white/10"><div className="flex items-center justify-between border-b border-white/10 px-4 py-3"><p className="font-semibold">Proof timeline</p><Trophy className="h-4 w-4 text-red-300" /></div><div className="grid gap-2 p-3">{proofs.length === 0 ? <p className="py-6 text-center text-sm text-slate-500">No proof yet.</p> : proofs.map((p) => <a key={p.signature} href={explorerTx(p.signature)} target="_blank" rel="noreferrer" className="rounded-lg bg-black/20 p-3 hover:bg-black/30"><span className="flex items-center justify-between text-sm font-semibold">{p.label}<ExternalLink className="h-4 w-4" /></span><span className="mt-1 block text-xs text-slate-500">{p.route}</span><span className="mt-2 block break-all font-mono text-xs text-red-200">{p.signature}</span></a>)}</div></div>
            {error ? <p className="rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-100">{error}</p> : null}
          </div>
        </div>
      </section>
    </main>
  );
}
