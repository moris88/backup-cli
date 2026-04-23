const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const { glob } = require("glob");
const inquirer = require("inquirer");
const AdmZip = require("adm-zip");
const {
  formatFileName,
  validateSelection,
  filterRootContent,
  generatePassword,
  formatProgress,
  prepareChoices,
  filterZipFiles,
} = require("./utils/utils");

// Registra il formato zip-encryptable per archiver
archiver.registerFormat("zip-encryptable", require("archiver-zip-encryptable"));

/**
 * Crea un file zip di backup di tutti i file nella directory root del progetto.
 */
async function createBackup(projectRoot: string): Promise<void> {
  console.log("\n--- Modalità Compressione ---");

  const rootContent = fs.readdirSync(projectRoot);
  const excludeList = ["node_modules", "dist", ".next", ".git", "tsconfig.json"];

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

  const today: string = new Date().toISOString().slice(0, 10);
  const defaultFileName: string = `backup_${today}.zip`;

  const nameAnswer = await inquirer.prompt([
    {
      type: "input",
      name: "fileName",
      message: "Inserisci il nome del file di backup (premi Invio per il default):",
      default: defaultFileName,
      filter: formatFileName,
    },
  ]);

  const outputFileName: string = nameAnswer.fileName;
  const outputFilePath: string = path.join(projectRoot, outputFileName);

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
      console.log("Operazione annullata: il file esistente non verrà sovrascritto.");
      return;
    }
  }

  console.log(`\nInizio del processo di backup: ${outputFileName}`);

  const password = generatePassword();
  const output = fs.createWriteStream(outputFilePath);
  const archive = archiver("zip-encryptable", {
    zlib: { level: 9 },
    password: password,
  });

  archive.on("error", (err: Error) => {
    throw err;
  });

  archive.pipe(output);

  archive.on("progress", (progress: { fs: { processedBytes: number; totalBytes: number } }) => {
    process.stdout.write(formatProgress(progress.fs.processedBytes, progress.fs.totalBytes));
  });

  console.log("Scansione dei file in corso...");

  for (const item of selectedItems) {
    const fullPath = path.join(projectRoot, item);
    const isDirectory = fs.statSync(fullPath).isDirectory();

    if (isDirectory) {
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
      archive.file(fullPath, { name: item });
    }
  }

  const closePromise = new Promise<void>((resolve, reject) => {
    output.on("close", () => {
      process.stdout.write("\n");
      console.log(`Backup completato. Creato il file: ${outputFileName}`);
      console.log(`Dimensione finale: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
      console.log("\n========================================");
      console.log("PASSWORD ZIP GENERATA:");
      console.log(password);
      console.log("========================================\n");
      console.log("IMPORTANTE: Salva questa password in un posto sicuro. Non verrà salvata altrove.");
      resolve();
    });
    output.on("error", reject);
  });

  await archive.finalize();
  await closePromise;
}

/**
 * Decomprime un file zip selezionato.
 */
async function extractBackup(projectRoot: string): Promise<void> {
  console.log("\n--- Modalità Decompressione ---");

  const rootContent = fs.readdirSync(projectRoot);
  const zipFiles = filterZipFiles(rootContent);

  if (zipFiles.length === 0) {
    console.log("Nessun file .zip trovato nella cartella corrente.");
    return;
  }

  const selectionAnswer = await inquirer.prompt([
    {
      type: "list",
      name: "selectedZip",
      message: "Seleziona il file .zip da decomprimere:",
      choices: zipFiles,
    },
  ]);

  const selectedZip = selectionAnswer.selectedZip;
  const zipPath = path.join(projectRoot, selectedZip);

  const passwordAnswer = await inquirer.prompt([
    {
      type: "input",
      name: "password",
      message: "Inserisci la password per il file zip:",
    },
  ]);

  const password = passwordAnswer.password;

  const folderName = `extracted_${selectedZip.replace(".zip", "")}_${Date.now()}`;
  const extractPath = path.join(projectRoot, folderName);

  console.log(`\nInizio estrazione in: ${folderName}...`);

  try {
    const zip = new AdmZip(zipPath);
    // Nota: extractAllTo richiede la password se i file sono cifrati
    zip.extractAllTo(extractPath, true, false, password);
    console.log("Estrazione completata con successo!");
  } catch (err: any) {
    console.error("\nErrore durante l'estrazione:", err.message || err);
    if (fs.existsSync(extractPath) && fs.readdirSync(extractPath).length === 0) {
      fs.rmdirSync(extractPath);
    }
  }
}

/**
 * Funzione principale che gestisce il menu iniziale.
 */
async function main(): Promise<void> {
  console.log("=== Backup Script CLI ===");

  // Utilizziamo process.cwd() per operare nella cartella dove viene lanciato il comando
  const projectRoot: string = process.cwd();

  const modeAnswer = await inquirer.prompt([
    {
      type: "list",
      name: "mode",
      message: "Cosa desideri fare?",
      choices: [
        { name: "Comprimere (Crea un backup ZIP)", value: "compress" },
        { name: "Decomprimere (Estrai un backup ZIP)", value: "decompress" },
      ],
    },
  ]);

  if (modeAnswer.mode === "compress") {
    await createBackup(projectRoot);
  } else {
    await extractBackup(projectRoot);
  }
}

if (require.main === module) {
  main().catch((err: Error) => {
    console.error("Errore fatale:", err);
  });
}
