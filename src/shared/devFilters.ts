/** Categoria di file da sviluppatore che si può includere o escludere dal backup. */
export interface DevFilter {
  id: string;
  label: string;
  description: string;
  /** Pattern glob ignorati quando la categoria è esclusa. */
  patterns: string[];
  /** Se true la categoria è inclusa di default. */
  defaultIncluded: boolean;
}

export const DEV_FILTERS: DevFilter[] = [
  {
    id: "env",
    label: "File .env",
    description: ".env, .env.local, .env.production…",
    patterns: ["**/.env", "**/.env.*"],
    defaultIncluded: true,
  },
  {
    id: "keys",
    label: "Chiavi e certificati",
    description: ".pem, .key, .p12, .pfx, .crt",
    patterns: ["**/*.pem", "**/*.key", "**/*.p12", "**/*.pfx", "**/*.crt"],
    defaultIncluded: true,
  },
  {
    id: "ai",
    label: "File di AI",
    description:
      "CLAUDE.md, .claude, AGENTS.md, GEMINI.md, .cursor, .windsurf, copilot-instructions…",
    patterns: [
      "**/CLAUDE.md",
      "**/CLAUDE.local.md",
      "**/.claude/**",
      "**/AGENTS.md",
      "**/GEMINI.md",
      "**/.gemini/**",
      "**/.cursor/**",
      "**/.cursorrules",
      "**/.windsurf/**",
      "**/.windsurfrules",
      "**/.codex/**",
      "**/.aider*",
      "**/.continue/**",
      "**/.github/copilot-instructions.md",
    ],
    defaultIncluded: true,
  },
  {
    id: "github",
    label: "GitHub",
    description: ".github: workflow Actions, template issue/PR, dependabot…",
    patterns: ["**/.github/**"],
    defaultIncluded: true,
  },
  {
    id: "docker",
    label: "Docker",
    description: "Dockerfile, docker-compose, .dockerignore",
    patterns: [
      "**/Dockerfile",
      "**/Dockerfile.*",
      "**/docker-compose*.yml",
      "**/docker-compose*.yaml",
      "**/compose*.yml",
      "**/compose*.yaml",
      "**/.dockerignore",
    ],
    defaultIncluded: true,
  },
  {
    id: "ide",
    label: "Impostazioni editor",
    description: ".vscode, .idea",
    patterns: ["**/.vscode/**", "**/.idea/**"],
    defaultIncluded: true,
  },
  {
    id: "git",
    label: "Repository Git",
    description: "Cartella .git (storico completo)",
    patterns: ["**/.git/**"],
    defaultIncluded: false,
  },
  {
    id: "next",
    label: "Cache Next.js",
    description: "Cartella .next",
    patterns: ["**/.next/**"],
    defaultIncluded: false,
  },
  {
    id: "nodeModules",
    label: "node_modules",
    description: "Dipendenze installate",
    patterns: ["**/node_modules/**"],
    defaultIncluded: false,
  },
  {
    id: "build",
    label: "Output di build",
    description: "dist, build, out",
    patterns: ["**/dist/**", "**/build/**", "**/out/**"],
    defaultIncluded: false,
  },
  {
    id: "logs",
    label: "Log",
    description: "File *.log",
    patterns: ["**/*.log"],
    defaultIncluded: false,
  },
];

/** Id delle categorie escluse di default. */
export const DEFAULT_EXCLUDED = DEV_FILTERS.filter(
  (f) => !f.defaultIncluded,
).map((f) => f.id);

/** Restituisce i pattern glob da ignorare per le categorie escluse. */
export function ignorePatternsFor(excludedIds: string[]): string[] {
  return DEV_FILTERS.filter((f) => excludedIds.includes(f.id)).flatMap(
    (f) => f.patterns,
  );
}
