import { useState } from "react";
import CompressPanel from "./components/CompressPanel";
import ExtractPanel from "./components/ExtractPanel";

type Tab = "compress" | "extract";

const TABS: { id: Tab; label: string }[] = [
  { id: "compress", label: "Comprimi" },
  { id: "extract", label: "Decomprimi" },
];

// Valorizzate dal workflow di release; in sviluppo mostra "dev".
const RELEASE = import.meta.env.VITE_RELEASE ?? "dev";
const RELEASE_DATE = import.meta.env.VITE_DATA_RELEASE;

export default function App() {
  const [tab, setTab] = useState<Tab>("compress");
  const [busy, setBusy] = useState(false);

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-start justify-between border-b border-slate-800 px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold">Backup</h1>
          <p className="text-sm text-slate-400">
            Archivi ZIP cifrati con password
          </p>
        </div>
        <p className="text-right text-xs text-slate-500">
          {RELEASE}
          {RELEASE_DATE && <span className="block">{RELEASE_DATE}</span>}
        </p>
      </header>
      <nav className="flex gap-2 px-6 pt-4">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            disabled={busy}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
              tab === t.id
                ? "bg-indigo-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>
      <main className="flex-1 overflow-auto p-6">
        {tab === "compress" ? (
          <CompressPanel onBusyChange={setBusy} />
        ) : (
          <ExtractPanel onBusyChange={setBusy} />
        )}
      </main>
    </div>
  );
}
