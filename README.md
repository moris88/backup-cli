# Backup Script CLI

[English version](#english) | [Versione Italiana](#italiano)

---

<a name="english"></a>

# Backup Script CLI (English)

A TypeScript command-line utility (CLI) to quickly create ZIP backup archives of your project, allowing granular selection of files and folders.

## 🚀 Features

- **Interactive Selection**: Choose which files and folders from the root to include in the archive.
- **Automatic Encryption**: Generates a secure 14-character password to protect the ZIP archive.
- **Smart Exclusions**: Automatically excludes heavy or unnecessary folders like `node_modules`, `dist`, `.git`, and other existing backup files.
- **Optimized Compression**: Uses `archiver` with compression level 9 (Zlib).
- **Customizable Naming**: Suggests a name based on today's date (`backup_YYYY-MM-DD.zip`), but allows customization.
- **Overwrite Protection**: Asks for confirmation before overwriting an existing file.
- **Real-time Feedback**: Displays progress percentage and the size of processed data.
- **Code Quality**: Linting with ESLint and formatting with Prettier.
- **Automated Testing**: Test suite with Jest to ensure logic correctness.
- **Continuous Integration**: GitHub Actions configured for automatic lint, build, and test on every push.

## 🛠️ Requirements

- [Node.js](https://nodejs.org/) (recommended version: 22 or higher)
- pnpm (recommended), npm, or yarn

## 📦 Installation

### As a local package

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd backup-script
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

### As a global CLI

You can install the tool globally to use it in any project:

```bash
npm install -g backup-script-cli
```

After installation, you can use the command:

```bash
backup-cli
```

## 🎮 Usage

### Development

To run the script directly from TypeScript sources:

```bash
npm run dev
```

### Build and Production

To compile the script into an optimized bundle (using esbuild):

```bash
npm run build
```

After the build, you can run the standard version:

```bash
npm start
```

Or the minified version:

```bash
npm run start:minify
```

### Quality and Testing

To lint the code:

```bash
npm run lint
```

To automatically format the code:

```bash
npm run format
```

To run the test suite with Jest:

```bash
npm test
```

## 🏗️ Project Structure

- `src/main.ts`: Main entry point of the script.
- `src/utils/utils.ts`: Utility functions extracted for testability.
- `tests/`: Automated test suite.
- `dist/`: Contains bundles generated after the build.
- `package.json`: Project configuration and npm scripts.
- `.github/workflows/`: Configuration for GitHub Actions.
- `eslint.config.js` & `.prettierrc`: Configurations for code quality.

## 🧰 Main Dependencies

- [archiver](https://www.npmjs.com/package/archiver): ZIP archive generation.
- [archiver-zip-encryptable](https://www.npmjs.com/package/archiver-zip-encryptable): Password encryption support.
- [inquirer](https://www.npmjs.com/package/inquirer): Interactive CLI interface.
- [glob](https://www.npmjs.com/package/glob): Pattern matching for files.
- [esbuild](https://esbuild.github.io/): Ultra-fast bundler for compilation.
- [Jest](https://jestjs.io/): Testing framework.
- [ESLint](https://eslint.org/): Linting tool.
- [Prettier](https://prettier.io/): Code formatter.

## 👨‍💻 Author

**Maurizio Tolomeo**

- Website: [https://www.mauriziotolomeo.it](https://www.mauriziotolomeo.it)
- Email: [maurizio.tolomeo@outlook.it](mailto:maurizio.tolomeo@outlook.it)

---

<a name="italiano"></a>

# Backup Script CLI (Italiano)

Un'utilità a riga di comando (CLI) in TypeScript per creare rapidamente archivi ZIP di backup del progetto, permettendo la selezione granulare dei file e delle cartelle.

## 🚀 Caratteristiche

- **Selezione Interattiva**: Scegli quali file e cartelle della root includere nell'archivio.
- **Cifratura Automatica**: Genera una password sicura a 14 caratteri per proteggere l'archivio ZIP.
- **Esclusioni Intelligenti**: Esclude automaticamente cartelle pesanti o inutili come `node_modules`, `dist`, `.git` e altri file di backup esistenti.
- **Compressione Ottimizzata**: Utilizza `archiver` con livello di compressione 9 (Zlib).
- **Naming Personalizzabile**: Suggerisce un nome basato sulla data odierna (`backup_YYYY-MM-DD.zip`), ma permette la personalizzazione.
- **Protezione Sovrascrittura**: Chiede conferma prima di sovrascrivere un file esistente.
- **Feedback in Tempo Reale**: Mostra la percentuale di avanzamento e la dimensione dei dati processati.
- **Qualità del Codice**: Linting con ESLint e formattazione con Prettier.
- **Test Automatizzati**: Suite di test con Jest per garantire la correttezza della logica.
- **Continuous Integration**: GitHub Actions configurate per lint, build e test automatici ad ogni push.

## 🛠️ Requisiti

- [Node.js](https://nodejs.org/) (versione consigliata: 22 o superiore)
- pnpm (consigliato), npm o yarn

## 📦 Installazione

### Come pacchetto locale

1. Clona la repository:

   ```bash
   git clone <repository-url>
   cd backup-script
   ```

2. Installa le dipendenze:

   ```bash
   pnpm install
   ```

### Come CLI globale

Puoi installare lo strumento globalmente per usarlo in qualsiasi progetto:

```bash
npm install -g backup-script-cli
```

Dopo l'installazione, potrai usare il comando:

```bash
backup-cli
```

## 🎮 Utilizzo

### Sviluppo

Per eseguire lo script direttamente dai sorgenti TypeScript:

```bash
npm run dev
```

### Build e Produzione

Per compilare lo script in un bundle ottimizzato (utilizzando esbuild):

```bash
npm run build
```

Dopo la build, puoi eseguire la versione standard:

```bash
npm start
```

Oppure la versione minificata:

```bash
npm run start:minify
```

### Qualità e Test

Per eseguire il linting del codice:

```bash
npm run lint
```

Per formattare automaticamente il codice:

```bash
npm run format
```

Per eseguire la suite di test con Jest:

```bash
npm test
```

## 🏗️ Struttura del Progetto

- `src/main.ts`: Punto di ingresso principale dello script.
- `src/utils/utils.ts`: Funzioni di utilità estratte per testabilità.
- `tests/`: Suite di test automatizzati.
- `dist/`: Contiene i bundle generati dopo la build.
- `package.json`: Configurazione del progetto e script npm.
- `.github/workflows/`: Configurazione per GitHub Actions.
- `eslint.config.js` & `.prettierrc`: Configurazioni per la qualità del codice.

## 🧰 Dipendenze Principali

- [archiver](https://www.npmjs.com/package/archiver): Generazione di archivi ZIP.
- [archiver-zip-encryptable](https://www.npmjs.com/package/archiver-zip-encryptable): Supporto alla cifratura con password.
- [inquirer](https://www.npmjs.com/package/inquirer): Interfaccia interattiva CLI.
- [glob](https://www.npmjs.com/package/glob): Corrispondenza di pattern per i file.
- [esbuild](https://esbuild.github.io/): Bundler ultra-veloce per la compilazione.
- [Jest](https://jestjs.io/): Framework di testing.
- [ESLint](https://eslint.org/): Strumento di linting.
- [Prettier](https://prettier.io/): Formattatore di codice.

## 👨‍💻 Autore

**Maurizio Tolomeo**

- Website: [https://www.mauriziotolomeo.it](https://www.mauriziotolomeo.it)
- Email: [maurizio.tolomeo@outlook.it](mailto:maurizio.tolomeo@outlook.it)

---

_Created to simplify local backup management during development. / Creato per semplificare la gestione dei backup locali durante lo sviluppo._
