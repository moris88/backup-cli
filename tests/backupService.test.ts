import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import AdmZip from "adm-zip";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { compress, extract, listFolder } from "../src/main/backupService";
import { DEFAULT_EXCLUDED } from "../src/shared/devFilters";

let tmp: string;
let project: string;

/** Crea un file con contenuto fittizio, incluse le cartelle intermedie. */
function touch(relPath: string): void {
  const full = path.join(project, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, `contenuto di ${relPath}`);
}

function zipEntries(zipPath: string): string[] {
  return new AdmZip(zipPath)
    .getEntries()
    .map((e) => e.entryName)
    .sort();
}

beforeEach(() => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), "backup-test-"));
  project = path.join(tmp, "project");
  for (const f of [
    "src/index.ts",
    "src/app.log",
    ".env",
    "certs/key.pem",
    "CLAUDE.md",
    ".github/workflows/ci.yml",
    ".git/HEAD",
    "node_modules/pkg/index.js",
    "README.md",
    "old.zip",
    "backup_2024.zip",
  ]) {
    touch(f);
  }
});

afterEach(() => {
  fs.rmSync(tmp, { recursive: true, force: true });
});

describe("listFolder", () => {
  test("elenca cartelle prima dei file ed esclude gli zip", () => {
    const entries = listFolder(project);
    const names = entries.map((e) => e.name);

    expect(names).not.toContain("old.zip");
    expect(names).not.toContain("backup_2024.zip");
    expect(names).toContain("node_modules");

    const firstFile = entries.findIndex((e) => !e.isDirectory);
    expect(entries.slice(firstFile).every((e) => !e.isDirectory)).toBe(true);
    expect(entries.slice(0, firstFile).every((e) => e.isDirectory)).toBe(true);
  });
});

describe("compress", () => {
  test("rifiuta una selezione vuota", async () => {
    await expect(
      compress(
        {
          sourceDir: project,
          items: [],
          outputPath: path.join(tmp, "out.zip"),
          excludedFilters: [],
        },
        () => {},
      ),
    ).rejects.toThrow("Seleziona almeno un elemento.");
  });

  test("applica le esclusioni predefinite e riporta il progresso", async () => {
    const outputPath = path.join(tmp, "out.zip");
    const onProgress = vi.fn();
    const items = listFolder(project).map((e) => e.name);

    const result = await compress(
      {
        sourceDir: project,
        items,
        outputPath,
        excludedFilters: DEFAULT_EXCLUDED,
      },
      onProgress,
    );

    expect(result.password).toHaveLength(14);
    expect(result.sizeBytes).toBeGreaterThan(0);
    expect(onProgress).toHaveBeenCalled();
    expect(zipEntries(outputPath)).toEqual([
      ".env",
      ".github/workflows/ci.yml",
      "CLAUDE.md",
      "README.md",
      "certs/key.pem",
      "src/index.ts",
    ]);
  });

  test("esclude anche file in radice e categorie scelte", async () => {
    const outputPath = path.join(tmp, "out.zip");
    await compress(
      {
        sourceDir: project,
        items: [".env", "CLAUDE.md", "src", ".github"],
        outputPath,
        excludedFilters: ["env", "ai", "github", "logs"],
      },
      () => {},
    );

    expect(zipEntries(outputPath)).toEqual(["src/index.ts"]);
  });
});

describe("extract", () => {
  async function createZip(): Promise<{ zipPath: string; password: string }> {
    const zipPath = path.join(tmp, "backup.zip");
    const { password } = await compress(
      {
        sourceDir: project,
        items: ["src", "README.md"],
        outputPath: zipPath,
        excludedFilters: [],
      },
      () => {},
    );
    return { zipPath, password };
  }

  test("estrae in una nuova cartella con la password corretta", async () => {
    const { zipPath, password } = await createZip();
    const dest = path.join(tmp, "dest");
    fs.mkdirSync(dest);

    const { extractedTo } = extract({
      zipPath,
      destinationDir: dest,
      password,
    });

    expect(path.basename(extractedTo)).toMatch(/^extracted_backup_\d+$/);
    expect(fs.readFileSync(path.join(extractedTo, "README.md"), "utf8")).toBe(
      "contenuto di README.md",
    );
    expect(fs.existsSync(path.join(extractedTo, "src/app.log"))).toBe(true);
  });

  test("con password errata fallisce e non lascia cartelle", async () => {
    const { zipPath } = await createZip();
    const dest = path.join(tmp, "dest");
    fs.mkdirSync(dest);

    expect(() =>
      extract({ zipPath, destinationDir: dest, password: "sbagliata" }),
    ).toThrow(/Estrazione fallita/);
    expect(fs.readdirSync(dest)).toEqual([]);
  });

  test("segnala un archivio inesistente", () => {
    expect(() =>
      extract({
        zipPath: path.join(tmp, "manca.zip"),
        destinationDir: tmp,
        password: "x",
      }),
    ).toThrow(/Estrazione fallita/);
  });
});
