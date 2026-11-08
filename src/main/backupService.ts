import fs from "node:fs";
import path from "node:path";
import AdmZip from "adm-zip";
import archiver from "archiver";
import zipEncryptable from "archiver-zip-encryptable";
import { glob } from "glob";
import { ignorePatternsFor } from "../shared/devFilters";
import type {
  CompressRequest,
  CompressResult,
  ExtractRequest,
  ExtractResult,
  FolderEntry,
  ProgressInfo,
} from "../shared/types";
import { filterRootContent, generatePassword } from "../utils/utils";

// Gli zip vengono sempre esclusi per non includere backup precedenti.
const ALWAYS_IGNORE = ["**/*.zip"];

archiver.registerFormat("zip-encryptable", zipEncryptable);

/** Elenca il contenuto della cartella, escludendo le voci non utili al backup. */
export function listFolder(dir: string): FolderEntry[] {
  const content = filterRootContent(fs.readdirSync(dir), []).filter(
    (name) => !name.toLowerCase().endsWith(".zip"),
  );
  return content
    .map((name) => ({
      name,
      isDirectory: fs.statSync(path.join(dir, name)).isDirectory(),
    }))
    .sort((a, b) =>
      a.isDirectory === b.isDirectory
        ? a.name.localeCompare(b.name)
        : a.isDirectory
          ? -1
          : 1,
    );
}

/** Crea uno zip cifrato con password generata casualmente. */
export async function compress(
  req: CompressRequest,
  onProgress: (info: ProgressInfo) => void,
): Promise<CompressResult> {
  if (req.items.length === 0) {
    throw new Error("Seleziona almeno un elemento.");
  }

  const password = generatePassword();
  const output = fs.createWriteStream(req.outputPath);
  const archive = archiver.create("zip-encryptable", {
    zlib: { level: 9 },
    password,
  });

  const done = new Promise<void>((resolve, reject) => {
    output.on("close", () => resolve());
    output.on("error", reject);
    archive.on("error", reject);
  });

  archive.on("progress", (p) =>
    onProgress({
      processedBytes: p.fs.processedBytes,
      totalBytes: p.fs.totalBytes,
    }),
  );
  archive.pipe(output);

  const ignore = [...ALWAYS_IGNORE, ...ignorePatternsFor(req.excludedFilters)];
  for (const item of req.items) {
    // Il glob del solo nome copre i file in radice, "/**/*" il contenuto delle cartelle;
    // in entrambi i casi i filtri escludono le categorie non volute.
    const files = await glob([item, `${item}/**/*`], {
      cwd: req.sourceDir,
      nodir: true,
      dot: true,
      ignore,
      posix: true,
    });
    for (const file of files) {
      archive.file(path.join(req.sourceDir, file), { name: file });
    }
  }

  await archive.finalize();
  await done;

  return {
    outputPath: req.outputPath,
    password,
    sizeBytes: archive.pointer(),
  };
}

/** Estrae lo zip nella cartella di destinazione usando la password fornita. */
export function extract(req: ExtractRequest): ExtractResult {
  const base = path.basename(req.zipPath, path.extname(req.zipPath));
  const extractPath = path.join(
    req.destinationDir,
    `extracted_${base}_${Date.now()}`,
  );
  try {
    const zip = new AdmZip(req.zipPath);
    zip.extractAllTo(extractPath, true, false, req.password);
    return { extractedTo: extractPath };
  } catch (err) {
    if (fs.existsSync(extractPath)) {
      fs.rmSync(extractPath, { recursive: true, force: true });
    }
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Estrazione fallita (password errata?): ${message}`);
  }
}
