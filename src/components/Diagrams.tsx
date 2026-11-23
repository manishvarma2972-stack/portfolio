/**
 * Project visuals. None of the repositories include screenshots, so each project is shown
 * as a drawn diagram of how it actually works (taken from its README and source).
 */
import type { Project } from "@/content/profile";

const mono = { fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.02em" } as const;

function Node({ x, y, w, label, sub, accent = false }: { x: number; y: number; w: number; label: string; sub?: string; accent?: boolean }) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={sub ? 46 : 34}
        rx="6"
        fill={accent ? "var(--accent)" : "var(--paper)"}
        stroke={accent ? "var(--accent)" : "var(--rule)"}
      />
      <text x={x + 12} y={y + 21} style={{ ...mono, fontSize: 12 }} fill={accent ? "var(--accent-ink)" : "var(--ink)"}>
        {label}
      </text>
      {sub && (
        <text x={x + 12} y={y + 37} style={{ ...mono, fontSize: 10 }} fill={accent ? "var(--accent-ink)" : "var(--ink-3)"}>
          {sub}
        </text>
      )}
    </g>
  );
}

function Flow({ d }: { d: string }) {
  return (
    <>
      <path d={d} fill="none" stroke="var(--rule)" strokeWidth="1.5" />
      <path d={d} fill="none" stroke="var(--accent)" strokeWidth="1.5" className="flow" />
    </>
  );
}

function CallMate() {
  return (
    <svg viewBox="0 0 420 270" className="h-full w-full" role="img" aria-label="CallMate AI flow: caller audio passes an HMAC-checked WebSocket into the audio bridge, streams to Gemini Live, which replies with audio and calls the take_message tool">
      <Node x={16} y={22} w={120} label="Caller" sub="speaks EN / TE" />
      <Node x={16} y={110} w={120} label="WebSocket" sub="HMAC token" />
      <Node x={168} y={110} w={130} label="AudioBridge" sub="20 ms frames" />
      <Node x={168} y={204} w={130} label="take_message" sub="atomic write" />
      <Node x={318} y={110} w={90} label="Gemini" sub="Live API" accent />
      <Flow d="M76 68 V110" />
      <Flow d="M136 133 H168" />
      <Flow d="M298 125 H318" />
      <Flow d="M318 145 H298" />
      <Flow d="M363 156 V227 H298" />
      <text x={262} y={100} style={mono} fill="var(--ink-3)">16 kHz in</text>
      <text x={232} y={176} style={mono} fill="var(--ink-3)">24 kHz out</text>
      <text x={16} y={204} style={mono} fill="var(--ink-3)">barge-in →</text>
      <text x={16} y={220} style={mono} fill="var(--ink-3)">flush queue</text>
    </svg>
  );
}

function EduMind() {
  return (
    <svg viewBox="0 0 420 270" className="h-full w-full" role="img" aria-label="EduMind AI retrieval: a student question runs keyword full-text search and semantic pgvector search, results are merged with Reciprocal Rank Fusion, and only approved, cited explanations are returned">
      <Node x={130} y={14} w={160} label="Student question" sub="any of 6 languages" />
      <Node x={16} y={104} w={170} label="Keyword search" sub="PostgreSQL full-text" />
      <Node x={234} y={104} w={170} label="Semantic search" sub="pgvector · bge-m3" />
      <Node x={130} y={190} w={160} label="Rank fusion" sub="RRF, k = 60" accent />
      <Flow d="M170 60 V82 H101 V104" />
      <Flow d="M250 60 V82 H319 V104" />
      <Flow d="M101 150 V170 H170 V190" />
      <Flow d="M319 150 V170 H250 V190" />
      <text x={210} y={256} textAnchor="middle" style={mono} fill="var(--ink-3)">only approved, cited explanations</text>
    </svg>
  );
}

function MedGuard() {
  const rows = [
    { label: "Batch · expired", note: "blocked", state: "blocked" },
    { label: "Batch · expires first", note: "dispense", state: "pick" },
    { label: "Batch · later", note: "next", state: "" },
    { label: "Batch · latest", note: "", state: "" },
  ];
  return (
    <svg viewBox="0 0 420 270" className="h-full w-full" role="img" aria-label="MedGuard FEFO: batches sorted by expiry; the expired batch is blocked and the earliest non-expired batch is dispensed">
      <text x={16} y={26} style={mono} fill="var(--ink-3)">FEFO · first expired, first out</text>
      {rows.map((r, i) => {
        const y = 44 + i * 52;
        const pick = r.state === "pick";
        const blocked = r.state === "blocked";
        return (
          <g key={r.label} opacity={blocked ? 0.55 : 1}>
            <rect x={16} y={y} width={300} height={40} rx="6" fill={pick ? "var(--accent)" : "var(--paper)"} stroke={pick ? "var(--accent)" : "var(--rule)"} />
            <text x={30} y={y + 25} style={{ ...mono, fontSize: 12 }} fill={pick ? "var(--accent-ink)" : "var(--ink)"}>
              {r.label}
            </text>
            {blocked && <line x1={30} x2={170} y1={y + 21} y2={y + 21} stroke="var(--ink)" strokeWidth="1" />}
            {r.note && (
              <text x={336} y={y + 25} style={mono} fill={pick ? "var(--accent)" : "var(--ink-3)"}>
                {pick ? "← " : ""}
                {r.note}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function MediRoutine() {
  return (
    <svg viewBox="0 0 420 270" className="h-full w-full" role="img" aria-label="MediRoutine example: Dose A is scheduled at 8:00 but taken at 8:20, so Dose B, due 30 minutes after Dose A, moves to 8:50 instead of 8:30">
      <text x={16} y={26} style={mono} fill="var(--ink-3)">Example · Dose B = 30 min after Dose A</text>
      <line x1={30} x2={390} y1={140} y2={140} stroke="var(--rule)" strokeWidth="1.5" />
      {[
        { x: 60, t: "8:00" },
        { x: 150, t: "8:20" },
        { x: 240, t: "8:30" },
        { x: 330, t: "8:50" },
      ].map((m) => (
        <g key={m.t}>
          <line x1={m.x} x2={m.x} y1={134} y2={146} stroke="var(--ink-3)" />
          <text x={m.x} y={166} textAnchor="middle" style={mono} fill="var(--ink-3)">{m.t}</text>
        </g>
      ))}
      <circle cx={60} cy={140} r={5} fill="none" stroke="var(--ink-3)" />
      <text x={60} y={112} textAnchor="middle" style={mono} fill="var(--ink-3)">A due</text>
      <circle cx={150} cy={140} r={7} fill="var(--ink)" />
      <text x={150} y={112} textAnchor="middle" style={{ ...mono, fontSize: 12 }} fill="var(--ink)">A taken</text>
      <circle cx={240} cy={140} r={5} fill="none" stroke="var(--ink-3)" strokeDasharray="2 2" />
      <text x={240} y={196} textAnchor="middle" style={mono} fill="var(--ink-3)">fixed clock</text>
      <line x1={222} x2={258} y1={186} y2={186} stroke="var(--ink-3)" />
      <circle cx={330} cy={140} r={7} fill="var(--accent)" />
      <text x={330} y={112} textAnchor="middle" style={{ ...mono, fontSize: 12 }} fill="var(--accent)">B due</text>
      <path d="M150 124 Q240 70 324 124" fill="none" stroke="var(--accent)" strokeWidth="1.5" className="flow" />
      <text x={240} y={74} textAnchor="middle" style={mono} fill="var(--accent)">+30 min from taken</text>
      <text x={16} y={244} style={mono} fill="var(--ink-3)">Stored in Drift · survives reboot</text>
    </svg>
  );
}

export function ProjectDiagram({ id }: { id: Project["id"] }) {
  switch (id) {
    case "callmate":
      return <CallMate />;
    case "edumind":
      return <EduMind />;
    case "medguard":
      return <MedGuard />;
    case "mediroutine":
      return <MediRoutine />;
  }
}
