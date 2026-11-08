import { useState } from "react";

interface PasswordModalProps {
  password: string;
  details: string;
  onClose: () => void;
}

/**
 * Mostra la password generata una sola volta.
 * Alla chiusura la password viene scartata e non è più recuperabile.
 */
export default function PasswordModal({
  password,
  details,
  onClose,
}: PasswordModalProps) {
  const [copied, setCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(password);
    setCopied(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <h2 className="text-lg font-semibold text-emerald-400">
          Backup completato
        </h2>
        <p className="mt-1 break-all text-xs text-slate-400">{details}</p>

        <div className="mt-5 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-200">
          Questa password viene mostrata <strong>una sola volta</strong> e non
          viene salvata da nessuna parte. Conservala in un luogo sicuro.
        </div>

        <div className="mt-4 flex items-center gap-2">
          <code className="flex-1 select-all break-all rounded-lg bg-slate-950 px-4 py-3 font-mono text-lg tracking-wider">
            {password}
          </code>
          <button
            type="button"
            onClick={copy}
            className="rounded-lg bg-slate-800 px-4 py-3 text-sm hover:bg-slate-700"
          >
            {copied ? "Copiata!" : "Copia"}
          </button>
        </div>

        <label className="mt-5 flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="accent-indigo-500"
          />
          Ho salvato la password
        </label>

        <button
          type="button"
          onClick={onClose}
          disabled={!confirmed}
          className="mt-4 w-full rounded-lg bg-indigo-600 py-2.5 font-medium hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Chiudi
        </button>
      </div>
    </div>
  );
}
