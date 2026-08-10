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
    <main className="broadcast-arena min-h-dvh overflow-hidden bg-black text-white">
      <Image src="/hero-bg.png" alt="" fill priority className="object-cover" />
      <div className="broadcast-shade" />

      <header className="broadcast-top">
        <div className="brand-slab"><Image src="/brand-logo.png" alt="Gamemaker ER logo" width={46} height={46} className="size-[46px] rounded-lg object-cover" /><span>Gamemaker ER</span></div>
        <div className="score-pill"><input value={duel} onChange={(e) => setDuel(e.target.value)} /></div>
        <div className="flex gap-2"><a href="/judge">Judge</a><button onClick={onConnect}>{busy === "connect" ? <Loader2 className="size-4 animate-spin" /> : <Wallet className="size-4" />}{wallet ? shortKey(wallet) : "Connect"}</button></div>
      </header>

      <section className="versus-overlay">
        <label className="player-red"><span>Red Side</span><input value={playerA} onChange={(e) => setPlayerA(e.target.value)} /></label>
        <div className="giant-vs"><Swords className="size-10" />VS</div>
        <label className="player-blue"><span>Blue Side</span><input value={playerB} onChange={(e) => setPlayerB(e.target.value)} /></label>
      </section>

      <section className="lower-third">
        <label><span>Move</span><textarea value={move} onChange={(e) => setMove(e.target.value)} /></label>
        <label><span>Verdict</span><textarea value={verdict} onChange={(e) => setVerdict(e.target.value)} /></label>
        <div className="hash-stack"><code>{moveHash}</code><code>{verdictHash}</code></div>
      </section>

      <section className="broadcast-actions">
        <button disabled={!wallet || Boolean(busy)} onClick={() => proof("Commit move", "MagicBlock ER", `GAMEMAKER_ER_MOVE:${moveHash}`)}>Commit ER</button>
        <button disabled={!wallet || Boolean(busy)} onClick={() => proof("Log verdict", "MagicBlock ER", `GAMEMAKER_ER_VERDICT:${verdictHash}`)}>Log Verdict</button>
        <button disabled={!wallet || Boolean(busy)} onClick={() => proof("Settle match", "Solana Devnet", `GAMEMAKER_ER_SETTLE:${duel}:${verdictHash}`)}>Settle L1</button>
      </section>
      {error ? <p className="broadcast-error">{error}</p> : null}

      <aside className="killfeed">
        <div className="flex items-center justify-between"><b>Match Feed</b><Trophy className="size-4" /></div>
        {proofs.length === 0 ? <p><Flame className="size-4" /> No proof yet.</p> : proofs.map((p) => (
          <a key={p.signature} href={explorerTx(p.signature)} target="_blank" rel="noreferrer">{p.label}<ExternalLink className="size-3" /></a>
        ))}
      </aside>
    </main>
  );
}
