import { useEffect, useState } from "react";
import { DEFAULT_EXCLUDED } from "../../../shared/devFilters";
import type { CompressResult, FolderEntry } from "../../../shared/types";
import { formatBytes } from "../utils/formatBytes";
import DevFiltersPanel from "./DevFiltersPanel";
import OperationSteps, { type Step } from "./OperationSteps";
import PasswordModal from "./PasswordModal";
import PathPicker from "./PathPicker";

const COMPRESS_STEPS: Step[] = [
  {
    title: "Generazione password",
    description:
      "Genera una password casuale di 14 caratteri (lettere, numeri e simboli) che non viene salvata da nessuna parte.",
  },
  {
    title: "Scansione dei file",
    description:
      "Percorre gli elementi selezionati applicando le opzioni per sviluppatori ed escludendo sempre gli altri file .zip.",
  },
  {
    title: "Compressione e cifratura",
    description:
      "Comprime ogni file al livello massimo e lo cifra con la password generata.",
  },
  {
    title: "Salvataggio",
    description:
      "Scrive l'archivio nel percorso scelto e mostra la password una sola volta.",
  },
];

/** Ricava la fase in corso dalla percentuale di avanzamento. */
function activeStep(busy: boolean, progress: number): number | null {
  if (!busy) return null;
  if (progress <= 0) return 1;
  return progress >= 100 ? 3 : 2;
}

interface CompressPanelProps {
  onBusyChange: (busy: boolean) => void;
}

export default function CompressPanel({ onBusyChange }: CompressPanelProps) {
  const [sourceDir, setSourceDir] = useState<string | null>(null);
  const [entries, setEntries] = useState<FolderEntry[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CompressResult | null>(null);
  const [excluded, setExcluded] = useState<Set<string>>(
    () => new Set(DEFAULT_EXCLUDED),
  );

  const toggleFilter = (id: string) =>
    setExcluded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  useEffect(
    () =>
      window.backupApi.onProgress(({ processedBytes, totalBytes }) =>
        setProgress(totalBytes > 0 ? (processedBytes / totalBytes) * 100 : 0),
      ),
    [],
  );

  const setBusyState = (value: boolean) => {
    setBusy(value);
    onBusyChange(value);
  };

  const chooseFolder = async () => {
    const dir = await window.backupApi.selectFolder();
    if (!dir) return;
    const res = await window.backupApi.listFolder(dir);
    setError(res.ok ? null : res.error);
    setSourceDir(dir);
    setEntries(res.ok ? res.data : []);
    setSelected(new Set());
  };

  const toggle = (name: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });

  const allSelected = entries.length > 0 && selected.size === entries.length;
  const toggleAll = () =>
    setSelected(allSelected ? new Set() : new Set(entries.map((e) => e.name)));

  const startBackup = async () => {
    if (!sourceDir || busy) return;
    const today = new Date().toISOString().slice(0, 10);
    const outputPath = await window.backupApi.selectSaveZip(
      `${sourceDir}/backup_${today}.zip`,
    );
    if (!outputPath) return;

    setBusyState(true);
    setProgress(0);
    setError(null);
    const res = await window.backupApi.compress({
      sourceDir,
      items: [...selected],
      outputPath,
      excludedFilters: [...excluded],
    });
    setBusyState(false);
    if (res.ok) setResult(res.data);
    else setError(res.error);
  };

  return (
    <section className="mx-auto flex max-w-3xl flex-col gap-5">
      <fieldset
        disabled={busy}
        className="flex flex-col gap-5 disabled:opacity-60"
      >
        <PathPicker
          label="Cartella da archiviare"
          value={sourceDir}
          buttonLabel="Seleziona cartella"
          onPick={chooseFolder}
        />

        {sourceDir && (
          <div className="rounded-xl border border-slate-800 bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2 text-sm">
              <span className="text-slate-400">
                {selected.size} di {entries.length} selezionati
              </span>
              <button
                type="button"
                onClick={toggleAll}
                className="text-indigo-400 hover:text-indigo-300 disabled:cursor-not-allowed"
              >
                {allSelected ? "Deseleziona tutto" : "Seleziona tutto"}
              </button>
            </div>
            <ul className="max-h-80 overflow-auto p-2">
              {entries.map((e) => (
                <li key={e.name}>
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-1.5 hover:bg-slate-800">
                    <input
                      type="checkbox"
                      checked={selected.has(e.name)}
                      onChange={() => toggle(e.name)}
                      className="accent-indigo-500"
                    />
                    <span>{e.isDirectory ? "📁" : "📄"}</span>
                    <span className="truncate">{e.name}</span>
                  </label>
                </li>
              ))}
              {entries.length === 0 && (
                <li className="px-3 py-2 text-sm text-slate-500">
                  Nessun elemento disponibile.
                </li>
              )}
            </ul>
          </div>
        )}

        <DevFiltersPanel excluded={excluded} onToggle={toggleFilter} />

        <button
          type="button"
          onClick={startBackup}
          disabled={selected.size === 0}
          className="self-start rounded-lg bg-indigo-600 px-5 py-2.5 font-medium hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {busy ? `Compressione… ${progress.toFixed(0)}%` : "Crea backup"}
        </button>
      </fieldset>

      {busy && (
        <div className="h-2 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full bg-indigo-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}

      <OperationSteps
        title="Cosa succede durante la compressione"
        steps={COMPRESS_STEPS}
        activeIndex={activeStep(busy, progress)}
      />

      {result && (
        <PasswordModal
          password={result.password}
          details={`${result.outputPath} · ${formatBytes(result.sizeBytes)}`}
          onClose={() => setResult(null)}
        />
      )}
    </section>
  );
}
