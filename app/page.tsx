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
    setBusy("connect");
    setError("");
    try {
      setWallet(await connectWallet());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wallet connection failed");
    } finally {
      setBusy("");
    }
  }

  async function proof(label: string, route: Proof["route"], memo: string) {
    setBusy(label);
    setError("");
    try {
      const signature = await sendMemoProof(route, memo);
      setProofs((items) => [{ label, route, signature }, ...items]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Proof transaction failed");
    } finally {
      setBusy("");
    }
  }

  return (
    <main className="arena-shell min-h-screen bg-[#090c14] text-white">
      <header className="scoreboard mx-auto grid max-w-7xl grid-cols-1 items-center gap-4 px-5 py-5 lg:grid-cols-[1fr_auto_1fr]">
        <div className="flex items-center gap-3">
          <Image src="/brand-logo.png" alt="Gamemaker ER logo" width={58} height={58} className="team-logo h-[58px] w-[58px] rounded-xl object-cover" priority />
          <div>
            <p className="arena-type text-3xl uppercase text-red-200">Gamemaker ER</p>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-slate-400">real-time duel arena</p>
          </div>
        </div>
        <div className="match-clock rounded-full border border-red-300/20 bg-red-400/10 px-5 py-3 font-mono text-xs uppercase tracking-[0.24em] text-red-100">
          {duel} / {proofs.length} tx
        </div>
        <div className="flex items-center justify-start gap-2 lg:justify-end">
          <a href="/judge" className="rounded-full border border-white/10 px-4 py-3 text-sm font-bold hover:bg-white/10">Judge</a>
          <button onClick={onConnect} className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-5 text-sm font-black uppercase text-black hover:bg-red-200">
            {busy === "connect" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4" />}
            {wallet ? shortKey(wallet) : "Connect"}
          </button>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 pb-7 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="arena-floor min-h-[720px] rounded-[32px] border border-white/10 bg-[#101726] p-5 shadow-2xl shadow-black/40">
          <div className="grid gap-4 lg:grid-cols-[1fr_180px_1fr]">
            <label className="fighter-panel">
              <span className="font-mono text-xs uppercase tracking-[0.24em] text-red-200/70">Player A</span>
              <input value={playerA} onChange={(e) => setPlayerA(e.target.value)} className="mt-3 w-full bg-transparent text-3xl font-black uppercase outline-none" />
            </label>
            <div className="vs-badge">
              <Swords className="h-8 w-8" />
              <span>VS</span>
            </div>
            <label className="fighter-panel text-right">
              <span className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-200/70">Player B</span>
              <input value={playerB} onChange={(e) => setPlayerB(e.target.value)} className="mt-3 w-full bg-transparent text-right text-3xl font-black uppercase outline-none" />
            </label>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_1fr]">
            <label className="arena-card red-corner">
              <span className="font-mono text-xs uppercase tracking-[0.24em] text-red-200/70">Player move</span>
              <textarea value={move} onChange={(e) => setMove(e.target.value)} className="mt-4 min-h-44 w-full resize-none bg-transparent text-2xl font-bold leading-9 outline-none" />
            </label>
            <label className="arena-card blue-corner">
              <span className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-200/70">Referee verdict</span>
              <textarea value={verdict} onChange={(e) => setVerdict(e.target.value)} className="mt-4 min-h-44 w-full resize-none bg-transparent text-2xl font-bold leading-9 outline-none" />
            </label>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
            <label className="duel-id">
              <span className="font-mono text-xs uppercase tracking-[0.24em] text-slate-400">Duel ID</span>
              <input value={duel} onChange={(e) => setDuel(e.target.value)} className="mt-3 h-12 w-full rounded-md border border-white/10 bg-black/25 px-3 font-mono outline-none focus:border-red-300" />
            </label>
            <div className="referee-board">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">Move hash</p>
                <p className="mt-2 break-all font-mono text-xs text-red-200">{moveHash}</p>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">Verdict hash</p>
                <p className="mt-2 break-all font-mono text-xs text-cyan-200">{verdictHash}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <button disabled={!wallet || Boolean(busy)} onClick={() => proof("Commit move", "MagicBlock ER", `GAMEMAKER_ER_MOVE:${moveHash}`)} className="arena-button bg-red-500 text-white disabled:opacity-40">
              Commit ER
            </button>
            <button disabled={!wallet || Boolean(busy)} onClick={() => proof("Log verdict", "MagicBlock ER", `GAMEMAKER_ER_VERDICT:${verdictHash}`)} className="arena-button border border-white/15 bg-white/5 disabled:opacity-40">
              Log Verdict
            </button>
            <button disabled={!wallet || Boolean(busy)} onClick={() => proof("Settle match", "Solana Devnet", `GAMEMAKER_ER_SETTLE:${duel}:${verdictHash}`)} className="arena-button bg-cyan-200 text-black disabled:opacity-40">
              Settle L1
            </button>
          </div>
          {error ? <p className="mt-4 rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-100">{error}</p> : null}
        </section>

        <aside className="caster-feed rounded-[32px] border border-white/10 bg-[#0d111c] p-5 shadow-xl shadow-black/30">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <p className="arena-type text-2xl uppercase">Match Feed</p>
              <p className="text-sm text-slate-500">ER and devnet proof stream</p>
            </div>
            <Trophy className="h-6 w-6 text-red-300" />
          </div>
          <div className="mt-4 grid gap-3">
            {proofs.length === 0 ? (
              <p className="rounded-xl border border-white/10 p-6 text-center text-sm text-slate-500">No proof yet.</p>
            ) : proofs.map((p) => (
              <a key={p.signature} href={explorerTx(p.signature)} target="_blank" rel="noreferrer" className="feed-item rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <span className="flex items-center justify-between gap-3 text-sm font-black uppercase">{p.label}<ExternalLink className="h-4 w-4 text-red-300" /></span>
                <span className="mt-1 block text-xs text-slate-500">{p.route}</span>
                <span className="mt-3 block break-all font-mono text-xs text-red-200">{p.signature}</span>
              </a>
            ))}
          </div>
          <div className="mt-5 rounded-xl border border-red-300/20 bg-red-400/10 p-4">
            <Flame className="mb-3 h-5 w-5 text-red-300" />
            <p className="text-sm font-bold">Moves route through MagicBlock ER. Final verdict hash settles on Solana devnet.</p>
          </div>
        </aside>
      </section>
    </main>
  );
}
