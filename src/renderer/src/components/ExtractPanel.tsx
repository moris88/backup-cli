import { useState } from "react";
import OperationSteps, { type Step } from "./OperationSteps";
import PathPicker from "./PathPicker";

const EXTRACT_STEPS: Step[] = [
  {
    title: "Lettura dell'archivio",
    description: "Apre il file ZIP selezionato e ne legge l'elenco dei file.",
  },
  {
    title: "Creazione cartella",
    description:
      "Crea nella destinazione una nuova cartella extracted_<nome>_<timestamp>, così nessun file esistente viene sovrascritto.",
  },
  {
    title: "Decifratura ed estrazione",
    description:
      "Decifra ogni file con la password inserita e lo scrive su disco mantenendo la struttura delle cartelle. Se la password è errata, la cartella creata viene eliminata.",
  },
];

interface ExtractPanelProps {
  onBusyChange: (busy: boolean) => void;
}

export default function ExtractPanel({ onBusyChange }: ExtractPanelProps) {
  const [zipPath, setZipPath] = useState<string | null>(null);
  const [destination, setDestination] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const setBusyState = (value: boolean) => {
    setBusy(value);
    onBusyChange(value);
  };

  const pickZip = async () => {
    const p = await window.backupApi.selectZip();
    if (p) setZipPath(p);
  };

  const pickDestination = async () => {
    const p = await window.backupApi.selectFolder();
    if (p) setDestination(p);
  };

  const canExtract = !!zipPath && !!destination && password.length > 0;

  const startExtract = async () => {
    if (!zipPath || !destination || busy) return;
    setBusyState(true);
    setError(null);
    setSuccess(null);
    const res = await window.backupApi.extract({
      zipPath,
      destinationDir: destination,
      password,
    });
    setBusyState(false);
    if (res.ok) {
      setSuccess(res.data.extractedTo);
      setPassword("");
    } else {
      setError(res.error);
    }
  };

  return (
    <section className="mx-auto flex max-w-3xl flex-col gap-5">
      <fieldset
        disabled={busy}
        className="flex flex-col gap-5 disabled:opacity-60"
      >
        <PathPicker
          label="Archivio ZIP"
          value={zipPath}
          buttonLabel="Scegli ZIP"
          onPick={pickZip}
        />
        <PathPicker
          label="Cartella di destinazione"
          value={destination}
          buttonLabel="Scegli cartella"
          onPick={pickDestination}
        />

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="zip-password"
            className="text-sm font-medium text-slate-300"
          >
            Password
          </label>
          <div className="flex gap-2">
            <input
              id="zip-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && canExtract && startExtract()
              }
              autoComplete="off"
              className="flex-1 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 font-mono outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="rounded-lg bg-slate-800 px-4 py-2 text-sm hover:bg-slate-700"
            >
              {showPassword ? "Nascondi" : "Mostra"}
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={startExtract}
          disabled={!canExtract}
          className="self-start rounded-lg bg-indigo-600 px-5 py-2.5 font-medium hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {busy ? "Estrazione in corso…" : "Decomprimi"}
        </button>
      </fieldset>

      {error && <p className="text-sm text-red-400">{error}</p>}
      {success && (
        <p className="break-all text-sm text-emerald-400">
          Estrazione completata in: {success}
        </p>
      )}

      <OperationSteps
        title="Cosa succede durante la decompressione"
        steps={EXTRACT_STEPS}
        activeIndex={busy ? 2 : null}
      />
    </section>
  );
}
