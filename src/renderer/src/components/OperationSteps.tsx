export interface Step {
  title: string;
  description: string;
}

interface OperationStepsProps {
  title: string;
  steps: Step[];
  /** Indice della fase in corso; null se nessuna operazione è attiva. */
  activeIndex: number | null;
}

/** Descrive le fasi di un'operazione ed evidenzia quella in corso. */
export default function OperationSteps({
  title,
  steps,
  activeIndex,
}: OperationStepsProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <h3 className="mb-3 text-sm font-semibold text-slate-300">{title}</h3>
      <ol className="flex flex-col gap-2">
        {steps.map((s, i) => {
          const isActive = activeIndex === i;
          const isDone = activeIndex !== null && i < activeIndex;
          return (
            <li key={s.title} className="flex gap-3 text-sm">
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  isActive
                    ? "animate-pulse bg-indigo-500 text-white"
                    : isDone
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-800 text-slate-400"
                }`}
              >
                {isDone ? "✓" : i + 1}
              </span>
              <div>
                <p
                  className={
                    isActive ? "font-medium text-indigo-300" : "text-slate-200"
                  }
                >
                  {s.title}
                </p>
                <p className="text-slate-500">{s.description}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
