interface PathPickerProps {
  label: string;
  value: string | null;
  buttonLabel: string;
  onPick: () => void;
  disabled?: boolean;
}

/** Campo di sola lettura con pulsante per scegliere un percorso. */
export default function PathPicker({
  label,
  value,
  buttonLabel,
  onPick,
  disabled = false,
}: PathPickerProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-slate-300">{label}</span>
      <div className="flex gap-2">
        <div className="flex-1 truncate rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-300">
          {value ?? <span className="text-slate-500">Nessuna selezione</span>}
        </div>
        <button
          type="button"
          onClick={onPick}
          disabled={disabled}
          className="rounded-lg bg-slate-800 px-4 py-2 text-sm hover:bg-slate-700 disabled:opacity-40"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
