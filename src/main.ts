const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const { glob } = require("glob");
const inquirer = require("inquirer");
const {
  formatFileName,
  validateSelection,
  filterRootContent,
  generatePassword,
  formatProgress,
  prepareChoices,
} = require("./utils/utils");

// Registra il formato zip-encryptable per archiver
archiver.registerFormat("zip-encryptable", require("archiver-zip-encryptable"));

/**
 * Crea un file zip di backup di tutti i file nella directory genitore della cartella src,
 * escludendo le cartelle node_modules, dist e altri file di backup.
 */
async function createBackup(): Promise<void> {
  console.log("=== Backup Script CLI ===");
  console.log("Questo strumento creerà un archivio ZIP del progetto.");
  console.log("Puoi scegliere quali file e cartelle della root includere.\n");

  // 1. Identifica la root del progetto (genitore di src)
  const projectRoot: string = path.join(__dirname, "..");

  // 2. Legge il contenuto della root per permettere la selezione
  const rootContent = fs.readdirSync(projectRoot);
  const excludeList = [
    "node_modules",
    "dist",
    ".next",
    ".git",
    "tsconfig.json",
  ];

  const filteredContent = filterRootContent(rootContent, excludeList);

  const choices = prepareChoices(filteredContent, (item: string) =>
    fs.statSync(path.join(projectRoot, item)).isDirectory(),
  );

  const selectionAnswer = await inquirer.prompt([
    {
      type: "checkbox",
      name: "selectedItems",
      message: "Seleziona i file e le cartelle da includere nel backup:",
      choices: choices,
      validate: validateSelection,
    },
  ]);

  const selectedItems = selectionAnswer.selectedItems;

  // 3. Genera il nome di default del file di backup
  const today: string = new Date().toISOString().slice(0, 10); // Formato YYYY-MM-DD
  const defaultFileName: string = `backup_${today}.zip`;

  // 4. Chiede all'utente il nome del file
  const nameAnswer = await inquirer.prompt([
    {
      type: "input",
      name: "fileName",
      message:
        "Inserisci il nome del file di backup (premi Invio per il default):",
      default: defaultFileName,
      filter: formatFileName,
    },
  ]);

  const outputFileName: string = nameAnswer.fileName;
  const outputFilePath: string = path.join(projectRoot, outputFileName);

  // 5. Gestione conferme
  if (fs.existsSync(outputFilePath)) {
    const overwriteAnswer = await inquirer.prompt([
      {
        type: "confirm",
        name: "overwrite",
        message: `Il file '${outputFileName}' esiste già. Vuoi sovrascriverlo?`,
        default: false,
      },
    ]);

    if (!overwriteAnswer.overwrite) {
      console.log(
        "Operazione annullata: il file esistente non verrà sovrascritto.",
      );
      return;
    }
  } else {
    const confirmAnswer = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirm",
        message: `Confermi l'esecuzione del backup come '${outputFileName}'?`,
        default: true,
      },
    ]);

    if (!confirmAnswer.confirm) {
      console.log("Operazione annullata dall'utente.");
      return;
    }
  }

  console.log(`\nInizio del processo di backup: ${outputFileName}`);

  const password = generatePassword();
  const output = fs.createWriteStream(outputFilePath);
  const archive = archiver("zip-encryptable", {
    zlib: { level: 9 }, // Imposta il livello di compressione
    password: password,
  });

  archive.on("error", (err: Error) => {
    throw err;
  });

  archive.pipe(output);

  archive.on(
    "progress",
    (progress: { fs: { processedBytes: number; totalBytes: number } }) => {
      process.stdout.write(
        formatProgress(progress.fs.processedBytes, progress.fs.totalBytes),
      );
    },
  );

  // 6. Trova i file basandosi sulla selezione dell'utente
  console.log("Scansione dei file in corso...");

  for (const item of selectedItems) {
    const fullPath = path.join(projectRoot, item);
    const isDirectory = fs.statSync(fullPath).isDirectory();

    if (isDirectory) {
      // Se è una cartella, usa glob per trovare tutti i file al suo interno
      const files: string[] = await glob(`${item}/**/*`, {
        cwd: projectRoot,
        nodir: true,
        dot: true,
        ignore: ["**/node_modules/**", "**/dist/**", "**/.next/**"],
      });

      files.forEach((file: string) => {
        archive.file(path.join(projectRoot, file), { name: file });
      });
    } else {
      // Se è un file singolo
      archive.file(fullPath, { name: item });
    }
  }

  const closePromise = new Promise<void>((resolve, reject) => {
    output.on("close", () => {
      process.stdout.write("\n");
      console.log(`Backup completato. Creato il file: ${outputFileName}`);
      console.log(
        `Dimensione finale: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`,
      );
      console.log("\n========================================");
      console.log("PASSWORD ZIP GENERATA:");
      console.log(password);
      console.log("========================================\n");
      console.log(
        "IMPORTANTE: Salva questa password in un posto sicuro. Non verrà salvata altrove.",
      );
      resolve();
    });
    output.on("error", reject);
  });

  await archive.finalize();
  await closePromise;
}

if (require.main === module) {
  createBackup().catch((err: Error) => {
    console.error("Errore durante la creazione del backup:", err);
  });
}
