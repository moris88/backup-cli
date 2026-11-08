import { useState } from "react";
import { DEV_FILTERS } from "../../../shared/devFilters";

interface DevFiltersPanelProps {
  excluded: Set<string>;
  onToggle: (id: string) => void;
}

/** Spunte per scegliere quali file da sviluppatore includere nel backup. */
export default function DevFiltersPanel({
  excluded,
  onToggle,
}: DevFiltersPanelProps) {
  const [open, setOpen] = useState(false);
  const includedCount = DEV_FILTERS.length - excluded.size;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm"
      >
        <span className="font-medium text-slate-300">
          Opzioni per sviluppatori
        </span>
        <span className="text-slate-500">
          {includedCount}/{DEV_FILTERS.length} incluse {open ? "▲" : "▼"}
        </span>
      </button>
      {open && (
        <ul className="grid gap-1 border-t border-slate-800 p-2 sm:grid-cols-2">
          {DEV_FILTERS.map((f) => (
            <li key={f.id}>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2 hover:bg-slate-800">
                <input
                  type="checkbox"
                  checked={!excluded.has(f.id)}
                  onChange={() => onToggle(f.id)}
                  className="mt-1 accent-indigo-500"
                />
                <span>
                  <span className="block text-sm">{f.label}</span>
                  <span className="block text-xs text-slate-500">
                    {f.description}
                  </span>
                </span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
