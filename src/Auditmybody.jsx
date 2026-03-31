import React, { useState, useEffect, useRef } from "react";

/* ─── DESIGN SYSTEM ───────────────────────────────────────────── */
const C = {
    bg: "#03080f",
    card: "#070f1c",
    card2: "#0a1525",
    border: "rgba(99,179,237,0.12)",
    borderBright: "rgba(99,179,237,0.28)",
    green: "#4ade80", greenDim: "#052e16", greenGlow: "rgba(74,222,128,0.15)",
    amber: "#fcd34d", amberDim: "#1c1400", amberGlow: "rgba(252,211,77,0.15)",
    red: "#f87171", redDim: "#1c0707", redGlow: "rgba(248,113,113,0.2)",
    purple: "#e879f9", purpleDim: "#1a0520", purpleGlow: "rgba(232,121,249,0.2)",
    blue: "#60a5fa", blueDim: "#071428",
    dim: "#1e3a5f", muted: "#4a7a9b", text: "#8ec8e8", bright: "#dff0ff",
};
const GRADE_COL = { A: "#4ade80", B: "#a3e635", C: "#fcd34d", D: "#fb923c", F: "#f87171" };
const SEV = { CRITICAL: "#e879f9", HIGH: "#f87171", MEDIUM: "#fcd34d", LOW: "#4ade80" };
const SEVBG = { CRITICAL: "#1a0520", HIGH: "#1c0707", MEDIUM: "#1c1400", LOW: "#052e16" };
const tc = (v, inv = false) => { const n = inv ? 100 - v : v; return n >= 70 ? C.green : n >= 45 ? C.amber : C.red; };
const cl = (v, a, b) => Math.max(a, Math.min(b, v));
const mono = "'Courier New', monospace";
const sans = "system-ui, -apple-system, 'Segoe UI', sans-serif";

/* ─── GRADE SYSTEM ────────────────────────────────────────────── */
function getGrade(score) {
    if (score >= 80) return "A";
    if (score >= 65) return "B";
    if (score >= 50) return "C";
    if (score >= 35) return "D";
    return "F";
}

/* ─── SCAN SCRIPT ─────────────────────────────────────────────── */
const SCAN = [
    { t: "> audit_my_body v2.1 initializing...", c: C.blue },
    { t: "> ─────────────────────────────────────", c: C.dim },
    { t: "> Loading behavioral telemetry...", c: C.text },
    { t: "> Querying Sunlight Oracle status...", c: C.text },
    { t: "> Validating Proof of Walk...", c: C.text },
    { t: "> ─── INVARIANT CHECK ──────────────────", c: C.dim },
    { t: "> sleep >= 7h ............. scanning", c: C.text },
    { t: "> sitting <= 8h ........... scanning", c: C.text },
    { t: "> grass_interaction(today) . scanning", c: C.text },
    { t: "> social_layer != discord .. scanning", c: C.text },
    { t: "> ─── EXPLOIT SCANNER ──────────────────", c: C.dim },
    { t: "> Doomscroll Reentrancy .... scanning", c: C.text },
    { t: "> Sedentary Drain .......... scanning", c: C.text },
    { t: "> Sunlight Oracle .......... scanning", c: C.text },
    { t: "> Sleep Debt accumulation .. scanning", c: C.text },
    { t: "> ─── COMPUTING METRICS ────────────────", c: C.dim },
    { t: "> Touch Grass Debt.......... computing", c: C.text },
    { t: "> Degeneracy Score.......... computing", c: C.text },
    { t: "> Liquidation Risk.......... computing", c: C.text },
    { t: "> ─────────────────────────────────────", c: C.dim },
];

/* ─── COMPUTE ENGINE (PRESERVED) ─────────────────────────────── */
function compute(f) {
    const sl = +f.sleep, si = +f.sitting, dO = +f.daysOut, st = +f.steps;
    const gy = +f.gym, sc = +f.screen, br = +f.breaks, oc = +f.onChain;
    const so = +f.social, sk = +f.sleepCon;

    const energy = Math.round(cl(sl * 9.5 + st / 145 + gy * 8 - Math.max(0, si - 6) * 7 + br * 4 - Math.max(0, dO - 1) * 5, 0, 100));
    const liqRisk = Math.round(cl(Math.max(0, si - 6) * 7 + dO * 12 + Math.max(0, 6 - sl) * 14 + Math.max(0, oc - 10) * 3 + (so === 0 ? 10 : 0), 0, 97));
    const burnout = Math.round(cl(Math.max(0, si - 6) * 5.5 + dO * 4 + Math.max(0, 6 - sl) * 10 + (3 - so) * 8 + Math.max(0, oc - 8) * 4, 0, 97));
    const revert = Math.round(cl(Math.max(0, 6 - sl) * 12 + Math.max(0, si - 6) * 6 + (4 - br) * 5 + dO * 2.5, 0, 97));
    const cogAlpha = Math.round(cl(sl / 8 * 36 + st / 10000 * 22 + br / 4 * 20 + (Math.max(0, 3 - dO) / 3) * 14 + gy / 4 * 8, 0, 100));
    const cortisol = Math.round(cl(Math.max(0, 6 - sl) * 10 + Math.max(0, si - 5) * 4 + dO * 5.5 + Math.max(0, sc - 6) * 3 + (4 - br) * 3 + (3 - so) * 3, 0, 100));
    const execQ = Math.round(cl(cogAlpha * 0.6 + (100 - cortisol) * 0.4, 0, 100));
    const latency = Math.max(50, Math.round(600 - sl * 50 - st / 250));
    const uptime = Math.round(cl(65 + sk * 11, 0, 99));
    const missedB = Math.max(0, Math.round((100 - energy) / 20));
    const ss = Math.round((cogAlpha + (100 - liqRisk) + energy) / 3);
    const pState = ss >= 75 ? "OPTIMAL" : ss >= 55 ? "DEGRADING" : ss >= 35 ? "CRITICAL" : "LIQUIDATED";
    const stateIdx = ["OPTIMAL", "DEGRADING", "CRITICAL", "LIQUIDATED"].indexOf(pState);
    const leverage = Math.round((Math.max(1, oc + Math.max(0, sc - 4)) / Math.max(0.5, sl + (gy > 0 ? gy * 1.5 : 0) + (br > 1 ? br * 0.5 : 0))) * 10) / 10;
    const entropy = Math.round(cl((4 - sk) * 25 + (4 - br) * 15 + (so === 0 ? 20 : 0) + (dO > 3 ? 15 : 0), 0, 100));
    const yearRisk = Math.round(cl(Math.max(0, si - 6) * 3.5 + dO * 2.4 + Math.max(0, 6 - sl) * 5 + (gy === 0 ? 4 : 0), 0, 48));
    const offChain = Math.max(0, Math.round(24 - oc - sl - 2));
    const onChainRatio = Math.round(cl((oc / Math.max(1, 24 - sl)) * 100, 0, 100));
    const mental = cogAlpha >= 75 ? { label: "CLEAR", col: C.green } : cogAlpha >= 55 ? { label: "FOGGY", col: C.amber } : cogAlpha >= 35 ? { label: "DEGRADING", col: C.red } : { label: "DEGENERATE", col: C.purple };

    const grassDebt = Math.round(cl(dO * 20 + Math.max(0, 5000 - st) / 100 + Math.max(0, si - 6) * 5 + (gy === 0 ? 15 : 0), 0, 480));
    const grassReserves = Math.round(cl((st / 10000) * 40 + (dO === 0 ? 30 : 0) + (gy > 0 ? 20 : 0) + (so > 0 ? 10 : 0), 0, 100));
    const copeIndex = Math.round(cl(Math.max(0, sc - 6) * 8 + Math.max(0, oc - 8) * 6 + (br === 0 ? 20 : 0) + Math.max(0, 6 - sl) * 10, 0, 100));
    const doomscroll = Math.round(cl(Math.max(0, sc - 4) * 10 + Math.max(0, oc - 6) * 8, 0, 100));
    const degenScore = Math.round(cl(liqRisk * 0.3 + burnout * 0.2 + copeIndex * 0.2 + doomscroll * 0.15 + (100 - grassReserves) * 0.15, 0, 100));
    const overallScore = Math.round(cl(100 - degenScore * 0.4 - liqRisk * 0.3 - burnout * 0.15 - (grassDebt / 4.8) * 0.15, 0, 100));
    const grade = getGrade(overallScore);
    const pow = st >= 7500 ? "VERIFIED" : st >= 5000 ? "WEAK_PROOF" : st >= 2000 ? "UNVERIFIED" : "NOT_SUBMITTED";
    const sunOracle = dO === 0 ? "ONLINE" : dO <= 2 ? `DEGRADED (${dO}d)` : `OFFLINE (${dO}d)`;
    const socialLayer = so === 0 ? "OFFLINE" : so === 1 ? "LOW_LIQUIDITY" : so === 2 ? "ACTIVE" : "HIGHLY_LIQUID";

    const invariants = [
        { id: "INV-001", desc: "Proof of Rest", label: "sleep >= 7h", ok: sl >= 7, actual: `${sl}h`, expected: "≥7h" },
        { id: "INV-002", desc: "Sedentary Ceiling", label: "sitting ≤ 8h", ok: si <= 8, actual: `${si}h`, expected: "≤8h" },
        { id: "INV-003", desc: "Sunlight Oracle", label: "sunlight daily", ok: dO === 0, actual: dO === 0 ? "today" : `${dO}d ago`, expected: "daily" },
        { id: "INV-004", desc: "Proof of Walk", label: "steps ≥ 5000", ok: st >= 5000, actual: st.toLocaleString(), expected: "≥5000" },
        { id: "INV-005", desc: "IRL Interaction", label: "social layer", ok: so >= 1, actual: ["offline", "low", "mod", "good"][so], expected: "≥low" },
    ];
    const brokenInvs = invariants.filter(i => !i.ok).length;

    const exploits = [
        si > 8 && { id: "EXP-001", name: "Sedentary Drain Exploit", sev: "HIGH", dur: `${si}h active`, impact: "Continuous energy bleed. Metabolic cascade in progress.", note: "Discord does not count as movement." },
        sc > 10 && { id: "EXP-002", name: "Doomscroll Reentrancy", sev: "MEDIUM", dur: `${sc}h loop`, impact: "Infinite scroll detected. Dopamine pool critically low.", note: "Subject may believe scrolling is recovery." },
        dO > 2 && { id: "EXP-003", name: "Sunlight Oracle Offline", sev: dO > 5 ? "HIGH" : "MEDIUM", dur: `${dO}d offline`, impact: "Circadian drift confirmed. Serotonin at critical low.", note: "Vitamin D is not an on-chain asset." },
        sl < 6 && { id: "EXP-004", name: "Sleep Debt Accumulation", sev: "CRITICAL", dur: `${sl}h/night`, impact: "3x compounding deficit. Cognitive performance collapsing.", note: "Sleep is not optional. It is not yield." },
        so === 0 && { id: "EXP-005", name: "Social Layer: Offline", sev: "HIGH", dur: "Active", impact: "+26% all-cause mortality risk. IRL frens: 0.", note: "Twitter replies do not count as socializing." },
        oc > 12 && { id: "EXP-006", name: "Work Position Overleveraged", sev: "MEDIUM", dur: `${oc}h today`, impact: "Executive function depleting. Decision quality: LOW.", note: "No meaningful grass interaction detected." },
    ].filter(Boolean);

    const findings = [];
    const push = (sev, code, msg, ref) => findings.push({ sev, code, msg, ref });
    if (si > 12) push("CRITICAL", "SIT-001", `${si}h sitting. Subject has achieved furniture status.`, "WHO 2020 · Biswas et al.");
    else if (si > 8) push("HIGH", "SIT-002", `${si}h/day sitting. Cardiometabolic risk accumulating like gas fees.`, "Biswas et al. 2015");
    if (dO > 5) push("HIGH", "OUT-001", `${dO} days no sunlight. Circadian rhythm fully rugged.`, "Blume et al. 2019");
    else if (dO > 2) push("MEDIUM", "OUT-002", `${dO} days since sunlight. Vitamin D is not a stablecoin.`, "CDC Vitamin D guidelines");
    if (sl < 6) push("HIGH", "SLP-001", `${sl}h sleep. Error rate: significantly elevated.`, "Van Dongen et al. 2003");
    else if (sl < 7) push("MEDIUM", "SLP-002", `${sl}h sleep. Below minimum viable rest.`, "NIH Sleep Health 2022");
    if (st < 3000) push("HIGH", "STP-001", `${st.toLocaleString()} steps. Proof of Walk: NOT SUBMITTED.`, "Tudor-Locke & Bassett 2004");
    else if (st < 5000) push("MEDIUM", "STP-002", `${st.toLocaleString()} steps. Sedentary risk zone.`, "Paluch et al. JAMA 2021");
    if (gy === 0) push("MEDIUM", "GYM-001", "Zero gym sessions. Resistance training: not found in wallet.", "WHO Guidelines 2020");
    if (so === 0) push("HIGH", "SOC-001", "Social layer offline. +26% elevated all-cause mortality risk.", "Holt-Lunstad 2015");
    if (burnout >= 70) push("HIGH", "BRN-001", `Burnout at ${burnout}%. You are rugging yourself.`, "Maslach Burnout Inventory");
    if (leverage > 4) push("HIGH", "LEV-001", `Leverage ${leverage}x. Work/recovery ratio unsustainable.`, "Overtraining syndrome");

    const recoveryTx = [
        { action: "touch_grass(30min)", emoji: "🌿", effect: [{ k: "liq_risk", v: `-${Math.round(liqRisk * 0.15)}%` }, { k: "energy", v: `+${Math.round(energy * 0.15 + 5)}%` }], active: liqRisk > 30 || dO > 0 },
        { action: "sunlight(15min)", emoji: "☀️", effect: [{ k: "sunlight_oracle", v: "BACK ONLINE" }, { k: "INV-003", v: "FIXED" }], active: dO > 0 },
        { action: "sleep(8h)", emoji: "🌙", effect: [{ k: "gas_level", v: `+${Math.round((100 - energy) * 0.6)}%` }, { k: "revert_risk", v: `-${Math.round(revert * 0.55)}%` }], active: sl < 8 },
        { action: "gym(45min)", emoji: "🏋️", effect: [{ k: "burnout", v: `-${Math.round(burnout * 0.12)}%` }, { k: "energy", v: "+22%" }], active: gy < 2 },
        { action: "close_twitter(now)", emoji: "📵", effect: [{ k: "cope_index", v: "-35%" }, { k: "doomscroll", v: "CLEARED" }], active: sc > 8 || oc > 10 },
        { action: "irl_interaction(30m)", emoji: "🤝", effect: [{ k: "social_layer", v: "ONLINE" }, { k: "INV-005", v: "FIXED" }], active: so === 0 },
    ].filter(r => r.active);

    const txHistory = [
        { id: 1019 + Math.abs(Math.round(sl * 3)), op: `sleep(${sl}h)`, status: sl >= 7 ? "RECOVERY" : "PARTIAL", delta: sl >= 7 ? "+34% energy" : `+${Math.round(sl / 7 * 34)}% energy` },
        { id: 1019 + Math.abs(Math.round(si * 2)), op: `sit(${si}h)`, status: si > 8 ? "STATE_DEGRADED" : "OK", delta: si > 8 ? `-${Math.round((si - 6) * 7)}% energy` : "nominal" },
        { id: 1019 + Math.abs(Math.round(sc)), op: `doomscroll(${sc}h)`, status: sc > 10 ? "REENTRANCY" : "OK", delta: sc > 10 ? "-sleep quality" : "nominal" },
        { id: 1019 + Math.abs(Math.round(dO * 5)), op: `sunlight(${dO === 0 ? "today" : "none·" + dO + "d"})`, status: dO === 0 ? "OK" : "ORACLE_OFFLINE", delta: dO === 0 ? "aligned" : `-${dO * 5}% circadian` },
        { id: 1019 + Math.abs(Math.round(st / 100)), op: `steps(${st.toLocaleString()})`, status: st > 5000 ? "PROOF_VERIFIED" : "PROOF_MISSING", delta: st > 5000 ? "+recovery" : "deficit" },
        { id: 1019 + Math.abs(Math.round(oc * 2)), op: `chain(${oc}h)`, status: oc > 12 ? "OVEREXPOSED" : "OK", delta: oc > 12 ? "-exec quality" : "nominal" },
    ].sort((a, b) => b.id - a.id);

    const sims = [
        { label: "touch_grass(30min)", delta: { energy: Math.round(energy * 0.15 + 6), liqRisk: -Math.round(liqRisk * 0.14), grassDebt: -25 } },
        { label: "sleep(+1h)", delta: { energy: 10, revert: -Math.round(revert * 0.18), cogAlpha: 10 } },
        { label: "gym(45min)", delta: { energy: 15, burnout: -Math.round(burnout * 0.12), liqRisk: -8 } },
        { label: "close_twitter(now)", delta: { copeIndex: -25, doomscroll: -30, revert: -8 } },
    ];

    const diag = buildDiag(pState, energy, cogAlpha, liqRisk, grassDebt, pow, dO, sl, degenScore, grade);

    return {
        energy, liqRisk, burnout, revert, cogAlpha, cortisol, execQ, latency,
        uptime, missedB, pState, stateIdx, leverage, entropy, yearRisk,
        offChain, onChain: oc, sleep: sl, sitting: si, daysOut: dO, steps: st,
        social: so, sleepCon: sk, breaks: br,
        mental, grassDebt, grassReserves, copeIndex, doomscroll, degenScore,
        overallScore, grade, pow, sunOracle, socialLayer, onChainRatio,
        invariants, brokenInvs, exploits, findings, recoveryTx, txHistory, sims, diag,
    };
}

function buildDiag(pState, energy, cogAlpha, liqRisk, grassDebt, pow, dO, sl, degen, grade) {
    const lines = [];
    if (pState === "LIQUIDATED" || pState === "CRITICAL") {
        lines.push(`Protocol grade: ${grade}. System in ${pState} state. This is not a dip. This is protocol failure.`);
        lines.push(`Touch Grass Debt: ${grassDebt} minutes. This compounds daily like a bad CDP position.`);
        if (dO > 3) lines.push(`Sunlight oracle offline ${dO} days. Vitamin D is not an on-chain asset. Go outside.`);
        if (sl < 6) lines.push(`${sl}h sleep. Running below minimum viable rest. Do not ship critical code today.`);
        lines.push(`Proof of Walk: ${pow}. Discord does not count. Twitter spaces do not count. Touch grass.`);
        lines.push(`Degeneracy score: ${degen}%. The protocol is rugging itself. Immediate intervention required.`);
    } else if (pState === "DEGRADING") {
        lines.push(`Protocol grade: ${grade}. System degrading. Gas at ${energy}%. Not in crisis — yet.`);
        lines.push(`Touch Grass Debt: ${grassDebt} min. Left uncleared, this compounds. Clear before EOD.`);
        if (dO > 0) lines.push(`Sunlight oracle offline ${dO}d. Circadian drift in progress. Go outside today.`);
        lines.push(`Cognitive alpha: ${cogAlpha}%. Shipping below capacity. The output quality matches.`);
        lines.push(`Recommended: execute touch_grass(30min) before end of day. Proof of Walk: ${pow}.`);
    } else {
        lines.push(`Protocol grade: ${grade}. System healthy. Gas: ${energy}%. Liq risk: ${liqRisk}%. Rare W.`);
        lines.push(`Touch Grass Debt: ${grassDebt}min — manageable. Maintain current protocol.`);
        lines.push(`Cognitive alpha: ${cogAlpha}%. High-gas operations approved. Proof of Walk: ${pow}.`);
        lines.push(`You are in the top tier of on-chain operators who also have a body. Keep going.`);
    }
    lines.push(`— Audit My Body | Human Protocol Monitor v2.1 | No blockchain calls made. Your mitochondria, however, are real.`);
    return lines.join("\n\n");
}

/* ─── GLOBAL CSS ──────────────────────────────────────────────── */
const CSS = `
  * { box-sizing: border-box; }
  @keyframes fadeIn   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
  @keyframes fadeUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
  @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:.35} }
  @keyframes spin     { to{transform:rotate(360deg)} }
  @keyframes scanln   { from{top:-2px} to{top:100%} }
  @keyframes blink    { 0%,49%{opacity:1} 50%,100%{opacity:0} }
  @keyframes glow     { 0%,100%{opacity:.6} 50%{opacity:1} }
  @keyframes countUp  { from{transform:scale(.9);opacity:0} to{transform:scale(1);opacity:1} }
  @keyframes slideIn  { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:none} }
  .stagger-1{animation-delay:.05s} .stagger-2{animation-delay:.10s}
  .stagger-3{animation-delay:.15s} .stagger-4{animation-delay:.20s}
  .stagger-5{animation-delay:.25s} .stagger-6{animation-delay:.30s}
  button:active{transform:scale(.97)}
  ::-webkit-scrollbar{width:4px}
  ::-webkit-scrollbar-thumb{background:#1e3a5f;border-radius:4px}
  a{transition:color .2s}
  a:hover{color:#dff0ff !important}
`;

/* ─── MICRO COMPONENTS ────────────────────────────────────────── */
function Tag({ children, col, bg }) {
    return (
        <span style={{
            fontFamily: mono, fontSize: 9, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase",
            color: col || "#000", background: bg || C.green, padding: "2px 7px", borderRadius: 3
        }}>
            {children}
        </span>
    );
}

function SevTag({ sev }) {
    return <Tag col="#000" bg={SEV[sev]}>{sev}</Tag>;
}

function CountUp({ to, dur }) {
    const [v, setV] = useState(0);
    const raf = useRef(null);
    useEffect(() => {
        let s = null; const d = dur || 900;
        const run = (ts) => { if (!s) s = ts; const p = Math.min((ts - s) / d, 1); setV(Math.round((1 - Math.pow(1 - p, 3)) * to)); if (p < 1) raf.current = requestAnimationFrame(run); };
        setV(0); raf.current = requestAnimationFrame(run);
        return () => { if (raf.current) cancelAnimationFrame(raf.current); };
    }, [to]);
    return <>{v}</>;
}

function Bar({ value, col, h, bg }) {
    const safe = Math.max(0, Math.min(100, value || 0));
    const [w, setW] = useState(0);
    const t = useRef(null);
    useEffect(() => { t.current = setTimeout(() => setW(safe), 80); return () => clearTimeout(t.current); }, [safe]);
    return (
        <div style={{ background: bg || "rgba(99,179,237,0.08)", borderRadius: 99, height: h || 5, overflow: "hidden" }}>
            <div style={{
                height: "100%", width: `${w}%`, background: col, borderRadius: 99,
                transition: "width 1.1s cubic-bezier(.34,1.56,.64,1)", boxShadow: `0 0 8px ${col}66`
            }} />
        </div>
    );
}

function Ring({ value, col, size, stroke }) {
    const sz = size || 80, sw = stroke || 8;
    const r = (sz - sw) / 2, circ = 2 * Math.PI * r;
    const [dash, setDash] = useState(circ);
    const t = useRef(null);
    useEffect(() => { t.current = setTimeout(() => setDash(circ - (value / 100) * circ), 80); return () => clearTimeout(t.current); }, [value, circ]);
    return (
        <svg width={sz} height={sz} style={{ transform: "rotate(-90deg)" }}>
            <circle cx={sz / 2} cy={sz / 2} r={r} fill="none" stroke="rgba(99,179,237,0.08)" strokeWidth={sw} />
            <circle cx={sz / 2} cy={sz / 2} r={r} fill="none" stroke={col} strokeWidth={sw}
                strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={dash}
                style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(.34,1.56,.64,1)", filter: `drop-shadow(0 0 6px ${col}aa)` }} />
        </svg>
    );
}

/* ─── INPUT COMPONENTS ────────────────────────────────────────── */
function Stepper({ label, value, onChange, min, max, step, unit, status }) {
    const s = step || 1;
    const statusCol = status === "good" ? C.green : status === "warn" ? C.amber : status === "bad" ? C.red : C.muted;
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 0", borderBottom: `1px solid ${C.border}` }}>
            <div style={{ flex: 1 }}>
                <div style={{ fontFamily: mono, fontSize: 10, color: C.muted, letterSpacing: "0.5px", marginBottom: 2 }}>{label}</div>
                <Bar value={((value - min) / (max - min)) * 100} col={statusCol} h={3} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <button onClick={() => onChange(Math.max(min, value - s))}
                    style={{
                        width: 26, height: 26, background: "rgba(99,179,237,0.08)", border: `1px solid ${C.border}`, borderRadius: 6,
                        color: C.text, cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: mono
                    }}>−</button>
                <div style={{
                    width: 68, textAlign: "center", background: "rgba(99,179,237,0.05)", border: `1px solid ${statusCol}44`,
                    borderRadius: 6, padding: "4px 8px", fontFamily: mono, fontSize: 13, fontWeight: 700, color: statusCol
                }}>
                    {value}<span style={{ fontSize: 10, fontWeight: 400, color: C.muted, marginLeft: 2 }}>{unit}</span>
                </div>
                <button onClick={() => onChange(Math.min(max, value + s))}
                    style={{
                        width: 26, height: 26, background: "rgba(99,179,237,0.08)", border: `1px solid ${C.border}`, borderRadius: 6,
                        color: C.text, cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: mono
                    }}>+</button>
            </div>
        </div>
    );
}

function Chips({ label, value, onChange, options }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 0", borderBottom: `1px solid ${C.border}`, flexWrap: "wrap" }}>
            <div style={{ fontFamily: mono, fontSize: 10, color: C.muted, minWidth: 130, letterSpacing: "0.5px" }}>{label}</div>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                {options.map((o, i) => (
                    <button key={i} onClick={() => onChange(i)} style={{
                        padding: "4px 10px", borderRadius: 5, fontFamily: mono, fontSize: 9, cursor: "pointer", letterSpacing: "0.5px",
                        border: `1px solid ${value === i ? C.blue + "99" : C.border}`,
                        background: value === i ? "rgba(96,165,250,0.15)" : "transparent",
                        color: value === i ? C.blue : C.muted, transition: "all .15s"
                    }}>{o}</button>
                ))}
            </div>
        </div>
    );
}

/* ─── SHARE CARD ──────────────────────────────────────────────── */
function ShareCard({ d, onCopy, copied }) {
    const pCol = d.pState === "OPTIMAL" ? C.green : d.pState === "DEGRADING" ? C.amber : d.pState === "CRITICAL" ? C.red : C.purple;
    const gradeCol = GRADE_COL[d.grade] || C.red;
    const quote = d.pState === "LIQUIDATED" ? "Protocol sunset imminent. You are the rug." :
        d.pState === "CRITICAL" ? "System degradation detected. This is not a temporary bug." :
            d.pState === "DEGRADING" ? "The market does not care about your feelings. Touch grass." :
                "Healthy validator. Rare W. Don't get complacent.";

    return (
        <div style={{
            background: `linear-gradient(135deg, #070f1c 0%, #0d1a2e 100%)`,
            border: `1px solid ${pCol}44`, borderRadius: 14, overflow: "hidden",
            boxShadow: `0 0 60px ${pCol}18, 0 0 0 1px ${pCol}22`, marginBottom: 16
        }}>

            {/* Top accent bar */}
            <div style={{ height: 3, background: `linear-gradient(90deg, ${pCol}, ${pCol}88, transparent)` }} />

            <div style={{ padding: "24px 24px 20px" }}>
                {/* Header row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                    <div>
                        <div style={{ fontFamily: mono, fontSize: 9, color: C.muted, letterSpacing: "3px", textTransform: "uppercase", marginBottom: 6 }}>
                            🔬 AUDIT MY BODY — HUMAN PROTOCOL MONITOR v2.1
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <span style={{ fontFamily: sans, fontSize: 22, fontWeight: 900, color: pCol, letterSpacing: "-0.5px" }}>{d.pState}</span>
                            <div style={{ padding: "3px 10px", background: `${pCol}22`, border: `1px solid ${pCol}55`, borderRadius: 5 }}>
                                <span style={{ fontFamily: mono, fontSize: 10, color: pCol, fontWeight: 700 }}>Grade: {d.grade}</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onCopy} style={{
                        background: copied ? "rgba(74,222,128,0.15)" : "rgba(99,179,237,0.08)",
                        border: `1px solid ${copied ? C.green + "66" : C.border}`,
                        borderRadius: 8, padding: "8px 16px", fontFamily: mono, fontSize: 10,
                        color: copied ? C.green : C.muted, cursor: "pointer", letterSpacing: "1px",
                        textTransform: "uppercase", transition: "all .2s"
                    }}>{copied ? "✓ COPIED" : "📋 COPY"}</button>
                </div>

                {/* Grade ring + key stats */}
                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 20, marginBottom: 20, alignItems: "center" }}>
                    <div style={{ position: "relative", width: 90, height: 90, flexShrink: 0 }}>
                        <Ring value={d.overallScore} col={gradeCol} size={90} stroke={9} />
                        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                            <span style={{ fontFamily: sans, fontSize: 28, fontWeight: 900, color: gradeCol, lineHeight: 1 }}>{d.grade}</span>
                            <span style={{ fontFamily: mono, fontSize: 8, color: C.muted, marginTop: 2 }}>{d.overallScore}pts</span>
                        </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                        {[
                            { l: "Gas Level", v: `${d.energy}%`, c: tc(d.energy) },
                            { l: "Grass Debt", v: `${d.grassDebt}m`, c: d.grassDebt > 180 ? C.red : d.grassDebt > 60 ? C.amber : C.green },
                            { l: "Liq Risk", v: `${d.liqRisk}%`, c: tc(d.liqRisk, true) },
                            { l: "Exploits", v: `${d.exploits.length}`, c: d.exploits.length > 3 ? C.red : d.exploits.length > 1 ? C.amber : C.green },
                            { l: "Proof of Walk", v: d.pow.replace(/_/g, " ").split(" ")[0], c: d.pow === "VERIFIED" ? C.green : d.pow === "WEAK_PROOF" ? C.amber : C.red },
                            { l: "Degen Score", v: `${d.degenScore}%`, c: tc(d.degenScore, true) },
                        ].map((m, i) => (
                            <div key={i} style={{ background: "rgba(99,179,237,0.05)", borderRadius: 8, padding: "8px 10px", border: `1px solid ${C.border}` }}>
                                <div style={{ fontFamily: mono, fontSize: 8, color: C.muted, marginBottom: 3, letterSpacing: "0.5px" }}>{m.l}</div>
                                <div style={{ fontFamily: mono, fontSize: 13, fontWeight: 700, color: m.c }}>{m.v}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Status badges */}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                    {[
                        { l: `☀ ${d.sunOracle}`, ok: d.daysOut === 0 },
                        { l: `🤝 ${d.socialLayer}`, ok: d.social > 0 },
                        { l: `🌿 Reserves: ${d.grassReserves}%`, ok: d.grassReserves > 50 },
                        { l: `🧠 Cope: ${d.copeIndex}%`, ok: d.copeIndex < 30 },
                    ].map((b, i) => (
                        <span key={i} style={{
                            fontFamily: mono, fontSize: 9, padding: "4px 10px", borderRadius: 99,
                            border: `1px solid ${b.ok ? C.green + "44" : C.red + "44"}`,
                            background: b.ok ? "rgba(74,222,128,0.08)" : "rgba(248,113,113,0.08)",
                            color: b.ok ? C.green : C.red
                        }}>{b.l}</span>
                    ))}
                </div>

                {/* Quote */}
                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
                    <div style={{ fontFamily: sans, fontSize: 12, color: pCol, fontStyle: "italic", fontWeight: 500, lineHeight: 1.5, marginBottom: 8 }}>
                        "{quote}"
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontFamily: mono, fontSize: 9, color: C.dim }}>auditmybody.com</span>
                        <span style={{ fontFamily: mono, fontSize: 9, color: C.dim }}>
                            𝕏 <a href="https://twitter.com/Merulez99" target="_blank" rel="noreferrer" style={{ color: C.muted, textDecoration: "none" }}>@Merulez99</a>
                            {" | "}
                            <a href="https://twitter.com/ValvesSec" target="_blank" rel="noreferrer" style={{ color: C.muted, textDecoration: "none" }}>@ValvesSec</a>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─── RESULTS ─────────────────────────────────────────────────── */
function Results({ d, onReset, onShare, copied }) {
    const [advOpen, setAdvOpen] = useState(false);
    const [simIdx, setSimIdx] = useState(null);
    const pCol = d.pState === "OPTIMAL" ? C.green : d.pState === "DEGRADING" ? C.amber : d.pState === "CRITICAL" ? C.red : C.purple;
    const pGlow = d.pState === "OPTIMAL" ? C.greenGlow : d.pState === "DEGRADING" ? C.amberGlow : d.pState === "CRITICAL" ? C.redGlow : C.purpleGlow;
    const gradeCol = GRADE_COL[d.grade] || C.red;
    const sim = simIdx !== null ? d.sims[simIdx] : null;

    return (
        <div style={{ animation: "fadeIn .5s ease" }}>

            {/* ── STICKY BAR ── */}
            <div style={{
                position: "sticky", top: 0, zIndex: 50, background: `${C.bg}ee`, backdropFilter: "blur(12px)",
                borderBottom: `1px solid ${pCol}33`, padding: "10px 0", marginBottom: 24
            }}>
                <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
                    <span style={{
                        width: 8, height: 8, borderRadius: "50%", background: pCol, boxShadow: `0 0 12px ${pCol}`,
                        display: "inline-block", animation: "pulse 1.5s ease infinite", marginRight: 4
                    }} />
                    <span style={{ fontFamily: sans, fontSize: 13, fontWeight: 800, color: pCol, letterSpacing: "1px" }}>{d.pState}</span>
                    <span style={{ fontFamily: mono, fontSize: 10, color: pCol, background: `${pCol}22`, padding: "1px 8px", borderRadius: 3, marginRight: 4 }}>Grade {d.grade}</span>
                    <div style={{ width: 1, height: 14, background: C.dim, flexShrink: 0 }} />
                    {[{ l: "GAS", v: `${d.energy}%`, c: tc(d.energy) }, { l: "DEBT", v: `${d.grassDebt}m`, c: d.grassDebt > 120 ? C.red : d.grassDebt > 60 ? C.amber : C.green }, { l: "LIQ", v: `${d.liqRisk}%`, c: tc(d.liqRisk, true) }, { l: "EXPL", v: `${d.exploits.length}`, c: d.exploits.length > 2 ? C.red : d.exploits.length > 0 ? C.amber : C.green }].map((m, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, padding: "0 8px", borderLeft: `1px solid ${C.dim}` }}>
                            <span style={{ fontFamily: mono, fontSize: 8, color: C.muted, letterSpacing: "1px" }}>{m.l}</span>
                            <span style={{ fontFamily: mono, fontSize: 11, fontWeight: 700, color: m.c }}>{m.v}</span>
                        </div>
                    ))}
                    <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
                        <button onClick={onShare} style={{ background: copied ? "rgba(74,222,128,0.1)" : "transparent", border: `1px solid ${copied ? C.green + "66" : C.dim}`, borderRadius: 5, padding: "5px 12px", fontFamily: mono, fontSize: 9, color: copied ? C.green : C.muted, cursor: "pointer", letterSpacing: "1px" }}>{copied ? "✓ COPIED" : "SHARE"}</button>
                        <button onClick={onReset} style={{ background: "transparent", border: `1px solid ${C.dim}`, borderRadius: 5, padding: "5px 12px", fontFamily: mono, fontSize: 9, color: C.muted, cursor: "pointer", letterSpacing: "1px" }}>RE-AUDIT</button>
                    </div>
                </div>
            </div>

            {/* ── HERO VERDICT ── */}
            <div style={{ textAlign: "center", padding: "32px 0 40px", position: "relative" }}>
                {/* Background glow */}
                <div style={{
                    position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
                    width: 300, height: 300, borderRadius: "50%", background: pGlow, pointerEvents: "none", filter: "blur(40px)"
                }} />
                <div style={{ position: "relative" }}>
                    <div style={{ fontFamily: mono, fontSize: 10, color: C.muted, letterSpacing: "3px", textTransform: "uppercase", marginBottom: 16 }}>
                        🔬 AUDIT MY BODY — HUMAN PROTOCOL MONITOR v2.1
                    </div>
                    {/* Grade circle */}
                    <div style={{ display: "inline-flex", position: "relative", marginBottom: 20 }}>
                        <Ring value={d.overallScore} col={gradeCol} size={140} stroke={12} />
                        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                            <span style={{ fontFamily: sans, fontSize: 52, fontWeight: 900, color: gradeCol, lineHeight: 1 }}>{d.grade}</span>
                            <span style={{ fontFamily: mono, fontSize: 10, color: C.muted }}>{d.overallScore}pts</span>
                        </div>
                    </div>
                    <div>
                        <div style={{ fontFamily: sans, fontSize: 32, fontWeight: 900, color: pCol, letterSpacing: "-1px", marginBottom: 8 }}>{d.pState}</div>
                        <div style={{ fontFamily: sans, fontSize: 13, color: C.muted, fontStyle: "italic", maxWidth: 480, margin: "0 auto" }}>
                            {d.pState === "OPTIMAL" ? "System healthy. Rare W. Don't get complacent." :
                                d.pState === "DEGRADING" ? "System degrading. This is a warning. Touch grass before EOD." :
                                    d.pState === "CRITICAL" ? "System degradation detected. This is not a temporary bug." :
                                        "Protocol sunset imminent. You are rugging yourself."}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── HERO METRICS ROW ── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 12 }}>
                {[
                    { label: "GAS LEVEL", tag: "Energy Pool", val: d.energy, inv: false, sub: d.energy < 30 ? "CRITICAL" : d.energy < 55 ? "LOW" : "NOMINAL" },
                    { label: "LIQ RISK", tag: "Liquidation", val: d.liqRisk, inv: true, sub: d.liqRisk > 70 ? "MARGIN CALL" : d.liqRisk > 45 ? "ELEVATED" : "SAFE" },
                    { label: "COG ALPHA", tag: "Brain Gas", val: d.cogAlpha, inv: false, sub: d.mental.label },
                ].map((m, i) => {
                    const col = tc(m.val, m.inv);
                    return (
                        <div key={i} style={{
                            background: C.card, border: `1px solid ${col}33`, borderRadius: 12,
                            padding: "20px 16px", textAlign: "center", boxShadow: `0 0 20px ${col}12`
                        }}>
                            <div style={{ fontFamily: mono, fontSize: 9, color: C.muted, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 12 }}>{m.label}</div>
                            <div style={{ position: "relative", display: "inline-block", marginBottom: 10 }}>
                                <Ring value={m.val} col={col} size={80} stroke={7} />
                                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <span style={{ fontFamily: mono, fontSize: 18, fontWeight: 700, color: col }}><CountUp to={m.val} />%</span>
                                </div>
                            </div>
                            <div style={{ fontFamily: mono, fontSize: 9, color: col }}>{m.sub}</div>
                            <div style={{ fontFamily: mono, fontSize: 8, color: C.dim, marginTop: 2 }}>{m.tag}</div>
                        </div>
                    );
                })}
            </div>

            {/* ── TOUCH GRASS DEBT ── */}
            <div style={{
                background: C.card, border: `2px solid ${d.grassDebt > 180 ? C.red : d.grassDebt > 60 ? C.amber : C.green}44`,
                borderRadius: 12, padding: "22px 24px", marginBottom: 12,
                boxShadow: `0 0 30px ${d.grassDebt > 180 ? C.redGlow : d.grassDebt > 60 ? C.amberGlow : C.greenGlow}`
            }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 16, alignItems: "start" }}>
                    <div>
                        <div style={{ fontFamily: mono, fontSize: 9, color: C.muted, letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: 6 }}>🌿 Touch Grass Debt</div>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 10 }}>
                            <span style={{ fontFamily: sans, fontSize: 56, fontWeight: 900, color: d.grassDebt > 180 ? C.red : d.grassDebt > 60 ? C.amber : C.green, lineHeight: 1 }}>
                                <CountUp to={d.grassDebt} dur={1200} />
                            </span>
                            <span style={{ fontFamily: mono, fontSize: 14, color: C.muted }}>minutes</span>
                        </div>
                        <div style={{ marginBottom: 12 }}>
                            <Bar value={Math.min(d.grassDebt / 4.8, 100)} col={d.grassDebt > 180 ? C.red : d.grassDebt > 60 ? C.amber : C.green} h={6} />
                        </div>
                        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                            {[{ l: "Proof of Walk", v: d.pow.replace(/_/g, " "), c: d.pow === "VERIFIED" ? C.green : d.pow === "WEAK_PROOF" ? C.amber : C.red },
                            { l: "Sunlight Oracle", v: d.sunOracle, c: d.daysOut === 0 ? C.green : d.daysOut <= 2 ? C.amber : C.red },
                            { l: "Social Layer", v: d.socialLayer.replace(/_/g, " "), c: d.social > 0 ? C.green : C.red }].map((b, i) => (
                                <div key={i}><div style={{ fontFamily: mono, fontSize: 8, color: C.dim, marginBottom: 2 }}>{b.l}</div><div style={{ fontFamily: mono, fontSize: 10, fontWeight: 700, color: b.c }}>{b.v}</div></div>
                            ))}
                        </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, minWidth: 160 }}>
                        {[{ l: "Degen Score", v: `${d.degenScore}%`, c: tc(d.degenScore, true) }, { l: "Cope Index", v: `${d.copeIndex}%`, c: tc(d.copeIndex, true) },
                        { l: "Grass Reserves", v: `${d.grassReserves}%`, c: tc(d.grassReserves) }, { l: "Burnout", v: `${d.burnout}%`, c: tc(d.burnout, true) }].map((m, i) => (
                            <div key={i} style={{ background: "rgba(99,179,237,0.05)", borderRadius: 8, padding: "8px 10px", border: `1px solid ${C.border}`, textAlign: "center" }}>
                                <div style={{ fontFamily: mono, fontSize: 8, color: C.dim, marginBottom: 3 }}>{m.l}</div>
                                <div style={{ fontFamily: mono, fontSize: 14, fontWeight: 700, color: m.c }}><CountUp to={parseInt(m.v)} />{m.v.includes("%") ? "%" : ""}</div>
                            </div>
                        ))}
                    </div>
                </div>
                {d.grassDebt > 60 && (
                    <div style={{ marginTop: 14, padding: "10px 14px", background: `rgba(248,113,113,0.08)`, border: `1px solid ${C.red}33`, borderRadius: 8 }}>
                        <span style={{ fontFamily: mono, fontSize: 10, color: C.red }}>
                            {d.grassDebt > 240 ? "⚠ Max grass debt reached. System is dangerously disconnected from physical reality." :
                                d.grassDebt > 120 ? "⚠ Significant grass debt. Compounds daily like a bad CDP position." :
                                    "⚠ Moderate grass debt. Clear before EOD. Non-negotiable."}
                        </span>
                    </div>
                )}
            </div>

            {/* ── INVARIANTS ── */}
            <div style={{ background: C.card, border: `1px solid ${d.brokenInvs > 2 ? C.red + "44" : d.brokenInvs > 0 ? C.amber + "44" : C.border}`, borderRadius: 12, padding: "20px", marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <span style={{ fontFamily: mono, fontSize: 9, color: C.muted, letterSpacing: "2px", textTransform: "uppercase" }}>System Invariants</span>
                    <span style={{ fontFamily: mono, fontSize: 9, color: d.brokenInvs > 0 ? C.red : C.green }}>{d.brokenInvs}/5 VIOLATED</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {d.invariants.map((inv, i) => (
                        <div key={i} style={{
                            display: "flex", gap: 10, padding: "10px 12px", borderRadius: 8,
                            background: inv.ok ? "rgba(74,222,128,0.06)" : "rgba(248,113,113,0.06)",
                            border: `1px solid ${inv.ok ? C.green + "33" : C.red + "33"}`
                        }}>
                            <span style={{ fontSize: 16 }}>{inv.ok ? "✅" : "❌"}</span>
                            <div>
                                <div style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: inv.ok ? C.green : C.red, marginBottom: 2 }}>{inv.desc}</div>
                                <div style={{ fontFamily: mono, fontSize: 9, color: C.muted }}>{inv.label} · actual: {inv.actual}</div>
                            </div>
                        </div>
                    ))}
                </div>
                {d.brokenInvs > 2 && (
                    <div style={{ marginTop: 10, padding: "10px 14px", background: "rgba(248,113,113,0.08)", border: `1px solid ${C.red}33`, borderRadius: 8 }}>
                        <span style={{ fontFamily: mono, fontSize: 10, color: C.red }}>⚠ {d.brokenInvs} invariants violated. System unstable. You are the rug pull.</span>
                    </div>
                )}
            </div>

            {/* ── EXPLOITS ── */}
            {d.exploits.length > 0 && (
                <div style={{ background: C.card, border: `1px solid ${C.red}44`, borderRadius: 12, padding: "20px", marginBottom: 12, boxShadow: C.redGlow }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                        <span style={{ fontFamily: mono, fontSize: 9, color: C.muted, letterSpacing: "2px", textTransform: "uppercase" }}>Active Exploits</span>
                        <span style={{ fontFamily: mono, fontSize: 9, color: C.red }}>{d.exploits.length} RUNNING</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: d.exploits.length > 2 ? "1fr 1fr" : "1fr", gap: 8 }}>
                        {d.exploits.map((ex, i) => (
                            <div key={i} style={{
                                padding: "12px 14px", borderRadius: 8, background: SEVBG[ex.sev], border: `1px solid ${SEV[ex.sev]}44`,
                                boxShadow: `0 0 14px ${SEV[ex.sev]}12`
                            }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                                    <SevTag sev={ex.sev} />
                                    <span style={{ fontFamily: mono, fontSize: 9, color: C.dim }}>{ex.id} · {ex.dur}</span>
                                </div>
                                <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: SEV[ex.sev], marginBottom: 4 }}>{ex.name}</div>
                                <div style={{ fontFamily: sans, fontSize: 11, color: C.text, marginBottom: 6, lineHeight: 1.4 }}>{ex.impact}</div>
                                <div style={{
                                    fontFamily: mono, fontSize: 9, color: C.muted, fontStyle: "italic", padding: "6px 8px",
                                    background: "rgba(0,0,0,0.25)", borderRadius: 5, borderLeft: `2px solid ${SEV[ex.sev]}55`
                                }}>{ex.note}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── AUDIT FINDINGS ── */}
            <div style={{ background: C.card, border: `1px solid ${d.findings.some(f => f.sev === "HIGH" || f.sev === "CRITICAL") ? C.red + "44" : C.border}`, borderRadius: 12, padding: "20px", marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <span style={{ fontFamily: mono, fontSize: 9, color: C.muted, letterSpacing: "2px", textTransform: "uppercase" }}>Audit Findings</span>
                    <span style={{ fontFamily: mono, fontSize: 9, color: C.muted }}>{d.findings.length} TOTAL</span>
                </div>
                <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 8, padding: "14px 16px", border: `1px solid ${C.border}`, fontFamily: mono }}>
                    <div style={{ fontSize: 10, color: C.muted, marginBottom: 10 }}>&gt; audit_my_body --audit --verbose</div>
                    {d.findings.length === 0
                        ? <div style={{ fontSize: 11, color: C.green }}>✓ No findings. Screenshot this. Incredibly rare.</div>
                        : d.findings.map((f, i) => (
                            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-start" }}>
                                <span style={{ color: SEV[f.sev], fontSize: 9, fontWeight: 700, whiteSpace: "nowrap", marginTop: 1 }}>[{f.sev}]</span>
                                <div>
                                    <div style={{ fontSize: 11, color: C.bright, lineHeight: 1.4 }}>{f.msg}</div>
                                    <div style={{ fontSize: 9, color: C.dim, marginTop: 2 }}>{f.code} · {f.ref}</div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            {/* ── RECOVERY TRANSACTIONS ── */}
            {d.recoveryTx.length > 0 && (
                <div style={{ background: C.card, border: `1px solid ${C.green}33`, borderRadius: 12, padding: "20px", marginBottom: 12 }}>
                    <div style={{ fontFamily: mono, fontSize: 9, color: C.muted, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 14 }}>Recovery Transactions</div>
                    {d.recoveryTx.map((r, i) => (
                        <div key={i} style={{
                            display: "flex", gap: 12, padding: "11px 14px", background: "rgba(74,222,128,0.04)",
                            border: `1px solid ${C.green}22`, borderRadius: 8, marginBottom: 8, alignItems: "flex-start"
                        }}>
                            <span style={{ fontSize: 18, flexShrink: 0 }}>{r.emoji}</span>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontFamily: mono, fontSize: 11, fontWeight: 700, color: C.green, marginBottom: 4 }}>{r.action}</div>
                                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                                    {r.effect.map((e, j) => <span key={j} style={{ fontFamily: mono, fontSize: 9 }}><span style={{ color: C.muted }}>{e.k}: </span><span style={{ color: C.green }}>{e.v}</span></span>)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── SHARE CARD ── */}
            <ShareCard d={d} onCopy={onShare} copied={copied} />

            {/* ── DIAGNOSTIC ── */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px", position: "relative", marginBottom: 12 }}>
                <div style={{
                    position: "absolute", top: -9, left: 18, background: C.bg, padding: "0 10px",
                    fontFamily: mono, fontSize: 9, color: C.blue, letterSpacing: "2px", textTransform: "uppercase"
                }}>System Diagnostic</div>
                <div style={{ fontFamily: mono, fontSize: 11, color: C.text, lineHeight: "2", whiteSpace: "pre-wrap" }}>{d.diag}</div>
            </div>

            {/* ── ADVANCED TELEMETRY ── */}
            <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", marginBottom: 12 }}>
                <button onClick={() => setAdvOpen(o => !o)} style={{
                    width: "100%", padding: "14px 18px", background: C.card, border: "none",
                    cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontFamily: mono, fontSize: 9, color: C.muted, letterSpacing: "2px", textTransform: "uppercase" }}>Advanced Telemetry</span>
                        <span style={{ fontFamily: mono, fontSize: 9, color: C.dim }}>TX history · sim · node health · incidents</span>
                    </div>
                    <span style={{ fontFamily: mono, fontSize: 13, color: C.muted }}>{advOpen ? "▲" : "▼"}</span>
                </button>
                {advOpen && (
                    <div style={{ padding: "0 18px 18px", background: C.card, borderTop: `1px solid ${C.border}` }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16, marginBottom: 12 }}>
                            <div>
                                <div style={{ fontFamily: mono, fontSize: 9, color: C.muted, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 10 }}>Recent Transactions</div>
                                {d.txHistory.slice(0, 5).map((tx, i) => (
                                    <div key={i} style={{ display: "flex", gap: 8, padding: "7px 0", borderBottom: `1px solid ${C.border}` }}>
                                        <span style={{ fontFamily: mono, fontSize: 9, color: C.dim, flexShrink: 0 }}>#{tx.id}</span>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontFamily: mono, fontSize: 10, color: C.blue }}>{tx.op}</div>
                                            <div style={{ fontFamily: mono, fontSize: 9 }}>
                                                <span style={{ color: tx.status === "OK" || tx.status === "RECOVERY" || tx.status === "PROOF_VERIFIED" ? C.green : C.red }}>→ {tx.status}</span>
                                                <span style={{ color: C.dim }}> · {tx.delta}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <div style={{ fontFamily: mono, fontSize: 9, color: C.muted, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 10 }}>What-If Simulation</div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 8 }}>
                                    {d.sims.map((s, i) => (
                                        <button key={i} onClick={() => setSimIdx(simIdx === i ? null : i)} style={{
                                            padding: "7px 10px", borderRadius: 6,
                                            textAlign: "left", cursor: "pointer",
                                            background: simIdx === i ? "rgba(96,165,250,0.12)" : "rgba(99,179,237,0.05)",
                                            border: `1px solid ${simIdx === i ? C.blue + "66" : C.border}`,
                                            color: simIdx === i ? C.blue : C.muted, fontFamily: mono, fontSize: 10
                                        }}>simulate: {s.label}</button>
                                    ))}
                                </div>
                                {sim && (
                                    <div style={{ padding: "10px 12px", background: "rgba(96,165,250,0.08)", border: `1px solid ${C.blue}33`, borderRadius: 8 }}>
                                        <div style={{ fontFamily: mono, fontSize: 9, color: C.blue, marginBottom: 5 }}>&gt; output:</div>
                                        {Object.entries(sim.delta).map(([k, v], i) => {
                                            const isNum = typeof v === "number";
                                            return <div key={i} style={{ fontFamily: mono, fontSize: 10, color: isNum ? (v > 0 ? C.green : C.red) : C.blue }}>{k}: {isNum ? (v > 0 ? "+" : "") + v + "%" : v}</div>;
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            <div>
                                <div style={{ fontFamily: mono, fontSize: 9, color: C.muted, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 10 }}>Validator Node</div>
                                {[{ l: "uptime", v: `${d.uptime}%`, bar: d.uptime }, { l: "latency", v: `${d.latency}ms`, bar: Math.max(0, 100 - d.latency / 6) }, { l: "missed_blocks", v: `${d.missedB}/day`, bar: Math.max(0, 100 - d.missedB * 22) }].map((m, i) => (
                                    <div key={i} style={{ marginBottom: 8 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                            <span style={{ fontFamily: mono, fontSize: 9, color: C.muted }}>{m.l}</span>
                                            <span style={{ fontFamily: mono, fontSize: 9, color: tc(m.bar), fontWeight: 700 }}>{m.v}</span>
                                        </div>
                                        <Bar value={m.bar} col={tc(m.bar)} h={3} />
                                    </div>
                                ))}
                            </div>
                            <div>
                                <div style={{ fontFamily: mono, fontSize: 9, color: C.muted, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 10 }}>On-chain vs Off-chain</div>
                                {[{ l: "on_chain", h: d.onChain, col: d.onChain > d.offChain + 4 ? C.red : C.amber }, { l: "off_chain", h: d.offChain, col: C.green }, { l: "sleep", h: d.sleep, col: C.blue }].map((b, i) => (
                                    <div key={i} style={{ marginBottom: 8 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                            <span style={{ fontFamily: mono, fontSize: 9, color: C.muted }}>{b.l}</span>
                                            <span style={{ fontFamily: mono, fontSize: 9, color: b.col, fontWeight: 700 }}>{b.h}h</span>
                                        </div>
                                        <Bar value={Math.round(b.h / 18 * 100)} col={b.col} h={4} />
                                    </div>
                                ))}
                                <div style={{ fontFamily: mono, fontSize: 9, color: C.dim, marginTop: 4 }}>On-chain ratio: {d.onChainRatio}% of waking hours</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div style={{ padding: "14px 0", borderTop: `1px solid ${C.border}`, textAlign: "center" }}>
                <div style={{ fontFamily: mono, fontSize: 9, color: C.dim, marginBottom: 4 }}>auditmybody.com · Not a medical device · No data stored · References are real</div>
                <div style={{ fontFamily: mono, fontSize: 9, color: C.dim }}>
                    𝕏 <a href="https://twitter.com/Merulez99" target="_blank" rel="noreferrer" style={{ color: C.muted, textDecoration: "none" }}>@Merulez99</a>
                    {" | "}
                    <a href="https://twitter.com/ValvesSec" target="_blank" rel="noreferrer" style={{ color: C.muted, textDecoration: "none" }}>@ValvesSec</a>
                </div>
            </div>
        </div>
    );
}

/* ─── ROOT ────────────────────────────────────────────────────── */
export default function AuditMyBody() {
    const [view, setView] = useState("input");
    const [form, setForm] = useState({ sleep: 6, sitting: 9, daysOut: 3, steps: 3500, gym: 1, screen: 10, breaks: 1, onChain: 10, social: 1, sleepCon: 1 });
    const [data, setData] = useState(null);
    const [lines, setLines] = useState([]);
    const [copied, setCopied] = useState(false);
    const ivRef = useRef(null);

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    function runAudit() {
        const result = compute(form);
        setData(result);
        setLines([]);
        setView("scan");
    }

    useEffect(() => {
        if (view !== "scan" || !data) return;
        setLines([]);
        let idx = 0;
        ivRef.current = setInterval(() => {
            if (idx < SCAN.length) {
                const item = SCAN[idx]; idx++;
                setLines(prev => [...prev, item]);
            } else {
                clearInterval(ivRef.current);
                const hc = data.findings.filter(f => f.sev === "HIGH" || f.sev === "CRITICAL").length;
                const summary = [
                    { t: `> AUDIT COMPLETE — ${data.findings.length} findings (${hc} critical/high)`, c: hc > 0 ? C.red : C.green },
                    { t: `> Protocol grade: ${data.grade} · State: ${data.pState}`, c: data.pState === "OPTIMAL" ? C.green : data.pState === "DEGRADING" ? C.amber : C.red },
                    { t: `> Touch Grass Debt: ${data.grassDebt}min · Liq Risk: ${data.liqRisk}%`, c: C.amber },
                    { t: `> Proof of Walk: ${data.pow}`, c: data.pow === "VERIFIED" ? C.green : C.red },
                    { t: `> Invariants broken: ${data.brokenInvs}/5 · Exploits: ${data.exploits.length}`, c: data.brokenInvs > 2 ? C.red : C.amber },
                    { t: "> Rendering dashboard...", c: C.blue },
                ];
                setLines(prev => [...prev, ...summary]);
                setTimeout(() => setView("results"), 1000);
            }
        }, 155);
        return () => clearInterval(ivRef.current);
    }, [view]);

    function share() {
        if (!data) return;
        const text = [
            "🔬 AUDIT MY BODY — AUDIT REPORT", "",
            `Protocol Grade: ${data.grade} (${data.overallScore}pts)`,
            `State: ${data.pState}`,
            `Gas Level: ${data.energy}%`,
            `Touch Grass Debt: ${data.grassDebt} min`,
            `Liquidation Risk: ${data.liqRisk}%`,
            `Active Exploits: ${data.exploits.length}`,
            `Proof of Walk: ${data.pow.replace(/_/g, " ")}`,
            `Sunlight Oracle: ${data.sunOracle}`,
            `Social Layer: ${data.socialLayer.replace(/_/g, " ")}`,
            `Grass Reserves: ${data.grassReserves}%`,
            `Cope Index: ${data.copeIndex}%`,
            `Degeneracy Score: ${data.degenScore}%`, "",
            data.pState === "LIQUIDATED" ? '"Protocol sunset imminent. You are the rug."' :
                data.pState === "CRITICAL" ? '"System degradation detected. This is not a temporary bug."' :
                    data.pState === "DEGRADING" ? '"The market does not care about your feelings. Touch grass."' :
                        '"Healthy validator. Rare W. Don\'t get complacent."', "",
            "auditmybody.com · by @Merulez99 | @ValvesSec",
            "No blockchain calls were made. Your mitochondria, however, are real.",
        ].join("\n");
        try {
            if (navigator.clipboard) navigator.clipboard.writeText(text).then(() => setCopied(true)).catch(() => fb(text));
            else fb(text);
        } catch (e) { fb(text); }
        setTimeout(() => setCopied(false), 2500);
    }

    function fb(text) {
        try {
            const el = document.createElement("textarea"); el.value = text;
            el.style.position = "fixed"; el.style.opacity = "0";
            document.body.appendChild(el); el.select();
            document.execCommand("copy"); document.body.removeChild(el);
            setCopied(true);
        } catch (e) { }
    }

    const inputStatus = (k) => {
        const v = form[k];
        if (k === "sleep") return v >= 7 ? "good" : v >= 6 ? "warn" : "bad";
        if (k === "sitting") return v <= 6 ? "good" : v <= 8 ? "warn" : "bad";
        if (k === "daysOut") return v === 0 ? "good" : v <= 2 ? "warn" : "bad";
        if (k === "steps") return v >= 7500 ? "good" : v >= 5000 ? "warn" : "bad";
        if (k === "screen") return v <= 6 ? "good" : v <= 9 ? "warn" : "bad";
        if (k === "onChain") return v <= 8 ? "good" : v <= 12 ? "warn" : "bad";
        if (k === "gym") return v >= 2 ? "good" : v >= 1 ? "warn" : "bad";
        return "neutral";
    };

    return (
        <div style={{ minHeight: "100vh", background: C.bg, color: C.bright, overflowX: "hidden", fontFamily: sans }}>
            <style>{CSS}</style>

            {/* Background grid */}
            <div style={{
                position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
                backgroundImage: "linear-gradient(rgba(96,165,250,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(96,165,250,0.04) 1px,transparent 1px)",
                backgroundSize: "44px 44px"
            }} />

            <div style={{ position: "relative", zIndex: 1, maxWidth: 800, margin: "0 auto", padding: "0 18px 80px" }}>

                {/* ── INPUT ── */}
                {view === "input" && (
                    <div style={{ animation: "fadeIn .5s ease" }}>
                        {/* Header */}
                        <div style={{ padding: "36px 0 28px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                                <div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                                        <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.green, display: "inline-block", boxShadow: `0 0 10px ${C.green}`, animation: "pulse 2s ease infinite" }} />
                                        <span style={{ fontFamily: mono, fontSize: 9, color: C.green, letterSpacing: "3px", textTransform: "uppercase" }}>Audit My Body · Human Protocol Monitor v2.1</span>
                                    </div>
                                    <h1 style={{ fontSize: "clamp(32px,6vw,52px)", fontWeight: 900, letterSpacing: "-2px", lineHeight: 1, margin: "0 0 8px", color: C.bright }}>
                                        Audit<br /><span style={{ color: C.green }}>My Body</span>
                                    </h1>
                                    <p style={{ fontFamily: mono, fontSize: 11, color: C.muted, lineHeight: "1.7", margin: 0, maxWidth: 420 }}>
                                        A security-grade body audit for on-chain operators who forgot they have a body.
                                        <br /><span style={{ color: C.text }}>Powered by Human Protocol Monitor v2.1</span>
                                    </p>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <div style={{ fontFamily: mono, fontSize: 9, color: C.dim, marginBottom: 4 }}>
                                        𝕏 <a href="https://twitter.com/Merulez99" target="_blank" rel="noreferrer" style={{ color: C.muted, textDecoration: "none" }}>@Merulez99</a>
                                        {" | "}
                                        <a href="https://twitter.com/ValvesSec" target="_blank" rel="noreferrer" style={{ color: C.muted, textDecoration: "none" }}>@ValvesSec</a>
                                    </div>
                                    {/* Grade preview dots */}
                                    <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                                        {["A", "B", "C", "D", "F"].map(g => (
                                            <div key={g} style={{
                                                width: 24, height: 24, borderRadius: "50%", background: `${GRADE_COL[g]}22`,
                                                border: `1px solid ${GRADE_COL[g]}55`, display: "flex", alignItems: "center", justifyContent: "center"
                                            }}>
                                                <span style={{ fontFamily: mono, fontSize: 8, color: GRADE_COL[g], fontWeight: 700 }}>{g}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Input card */}
                        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "24px 26px", boxShadow: "0 0 40px rgba(96,165,250,0.04)" }}>
                            <div style={{ fontFamily: mono, fontSize: 10, color: C.muted, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 16 }}>
                                &gt; Protocol State Inputs — Be honest. The protocol doesn't lie.
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 28px" }}>
                                <div>
                                    <Stepper label="sleep_hours" value={form.sleep} onChange={v => set("sleep", v)} min={3} max={12} unit="h" status={inputStatus("sleep")} />
                                    <Stepper label="sitting_hours" value={form.sitting} onChange={v => set("sitting", v)} min={0} max={16} unit="h" status={inputStatus("sitting")} />
                                    <Stepper label="days_no_sunlight" value={form.daysOut} onChange={v => set("daysOut", v)} min={0} max={21} unit="d" status={inputStatus("daysOut")} />
                                    <Stepper label="avg_steps" value={form.steps} onChange={v => set("steps", v)} min={0} max={20000} unit="steps" status={inputStatus("steps")} step={500} />
                                </div>
                                <div>
                                    <Stepper label="screen_time" value={form.screen} onChange={v => set("screen", v)} min={0} max={18} unit="h" status={inputStatus("screen")} />
                                    <Stepper label="on_chain_hours" value={form.onChain} onChange={v => set("onChain", v)} min={0} max={18} unit="h" status={inputStatus("onChain")} />
                                    <Stepper label="gym_sessions_wk" value={form.gym} onChange={v => set("gym", v)} min={0} max={7} unit="x" status={inputStatus("gym")} />
                                    <div style={{ padding: "11px 0", borderBottom: `1px solid ${C.border}` }}>
                                        <div style={{ fontFamily: mono, fontSize: 10, color: C.muted, marginBottom: 6 }}>break_frequency</div>
                                        <div style={{ display: "flex", gap: 5 }}>
                                            {["never", "rarely", "sometimes", "often", "always"].map((o, i) => (
                                                <button key={i} onClick={() => set("breaks", i)} style={{
                                                    padding: "4px 9px", borderRadius: 5, fontFamily: mono, fontSize: 9, cursor: "pointer",
                                                    border: `1px solid ${form.breaks === i ? C.blue + "88" : C.border}`,
                                                    background: form.breaks === i ? "rgba(96,165,250,0.12)" : "transparent",
                                                    color: form.breaks === i ? C.blue : C.muted
                                                }}>{o}</button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 28px", marginTop: 4 }}>
                                <Chips label="sleep_schedule" value={form.sleepCon} onChange={v => set("sleepCon", v)} options={["chaotic", "inconsistent", "mostly_ok", "consistent"]} />
                                <Chips label="social_layer" value={form.social} onChange={v => set("social", v)} options={["offline", "low", "moderate", "active"]} />
                            </div>

                            <button onClick={runAudit} style={{
                                width: "100%", marginTop: 20,
                                background: "linear-gradient(135deg, rgba(74,222,128,0.15) 0%, rgba(74,222,128,0.08) 100%)",
                                border: `1px solid ${C.green}66`, borderRadius: 10, padding: "15px",
                                color: C.green, fontFamily: mono, fontSize: 12, fontWeight: 700,
                                letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer",
                                boxShadow: `0 0 20px ${C.greenGlow}`, transition: "all .2s"
                            }}>
                                🔬 AUDIT MY BODY — SUBMIT PROOF OF EXISTENCE
                            </button>

                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
                                <span style={{ fontFamily: mono, fontSize: 9, color: C.dim }}>No data stored · No blockchain calls</span>
                                <span style={{ fontFamily: mono, fontSize: 9, color: C.dim }}>Discord does not count as socializing.</span>
                            </div>
                        </div>

                        {/* Fun stats */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginTop: 12 }}>
                            {[
                                { emoji: "🌿", label: "Most Common Grade", val: "D", sub: "avg degen, probably" },
                                { emoji: "☀️", label: "Sunlight Oracle", val: "OFFLINE", sub: "you know who you are" },
                                { emoji: "💀", label: "Liquidated Protocols", val: "many", sub: "this is a free tool" },
                            ].map((s, i) => (
                                <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
                                    <div style={{ fontSize: 20, marginBottom: 6 }}>{s.emoji}</div>
                                    <div style={{ fontFamily: mono, fontSize: 9, color: C.dim, marginBottom: 3 }}>{s.label}</div>
                                    <div style={{ fontFamily: sans, fontSize: 14, fontWeight: 800, color: C.text }}>{s.val}</div>
                                    <div style={{ fontFamily: mono, fontSize: 8, color: C.dim, marginTop: 2 }}>{s.sub}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── SCAN ── */}
                {view === "scan" && (
                    <div style={{ paddingTop: 44, animation: "fadeIn .4s ease" }}>
                        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "26px", position: "relative", overflow: "hidden" }}>
                            <div style={{
                                position: "absolute", left: 0, right: 0, height: "1px",
                                background: `linear-gradient(90deg,transparent,${C.green},transparent)`,
                                animation: "scanln 2.5s linear infinite", boxShadow: `0 0 12px ${C.green}`
                            }} />
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
                                <div style={{
                                    width: 13, height: 13, border: `2px solid ${C.green}`, borderTop: `2px solid transparent`,
                                    borderRadius: "50%", animation: "spin .7s linear infinite", flexShrink: 0
                                }} />
                                <span style={{ fontFamily: mono, fontSize: 10, color: C.green, letterSpacing: "2px" }}>AUDIT IN PROGRESS — audit_my_body v2.1</span>
                            </div>
                            <div style={{ fontFamily: mono, fontSize: 11, lineHeight: "2", minHeight: 240 }}>
                                {lines.map((l, i) => <div key={i} style={{ color: l.c }}>{l.t}</div>)}
                                <span style={{ color: C.blue, animation: "blink 1s step-end infinite" }}>_</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── RESULTS ── */}
                {view === "results" && data && (
                    <Results d={data} onReset={() => { setView("input"); setData(null); }} onShare={share} copied={copied} />
                )}
            </div>
        </div>
    );
}