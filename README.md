# Backup Desktop

Desktop app (Electron + React + TypeScript + Vite + Tailwind) to create and extract password-protected ZIP backups of your projects.

## 🚀 Features

- **Compress**: pick a folder, choose which files and folders to include, and save an encrypted ZIP.
- **One-time password**: a random 14-character password is generated and shown **only once**; it is never stored.
- **Developer options**: checkboxes to include or exclude `.env` files, keys/certificates, AI files (`CLAUDE.md`, `.claude`, `AGENTS.md`, `.cursor`…), GitHub (`.github` workflows), Docker, editor settings, `.git`, `.next`, `node_modules`, build output and logs.
- **Extract**: pick a ZIP, a destination folder and enter the password; files are extracted into a new `extracted_<name>_<timestamp>` folder.
- **Progress and steps**: progress bar and a description of each phase; the UI is locked while an operation runs.

## 🛠️ Requirements

- [Node.js](https://nodejs.org/) 22 or higher
- pnpm

## 🎮 Usage

```bash
pnpm install
pnpm dev        # start the app in development mode
pnpm build      # build main, preload and renderer into out/
pnpm dist       # build the Windows installer into release/
pnpm typecheck  # TypeScript check
pnpm lint       # Biome
pnpm test       # Vitest
pnpm coverage   # Vitest + coverage (80% thresholds)
```

## 🏗️ Project Structure

- `src/main/`: Electron main process (window, IPC, compression/extraction service).
- `src/preload/`: secure bridge exposing `window.backupApi` to the UI.
- `src/renderer/`: React UI with Tailwind.
- `src/shared/`: types and developer filters shared between processes.
- `src/utils/`: password generation and helpers.
- `tests/`: Vitest test suite (coverage thresholds 80%).

## 🧰 Main Dependencies

- [Electron](https://www.electronjs.org/), [electron-vite](https://electron-vite.org/), [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/)
- [archiver](https://www.npmjs.com/package/archiver) + [archiver-zip-encryptable](https://www.npmjs.com/package/archiver-zip-encryptable): encrypted ZIP creation.
- [adm-zip](https://www.npmjs.com/package/adm-zip): password-protected extraction.
- [glob](https://www.npmjs.com/package/glob): file matching and filters.
- [Vitest](https://vitest.dev/), [Biome](https://biomejs.dev/)

## 👨‍💻 Author

- Name: [Maurizio Tolomeo](https://github.com/moris88)
- Website: [https://www.mauriziotolomeo.it](https://www.mauriziotolomeo.it)
- Email: [maurizio.tolomeo@outlook.it](mailto:maurizio.tolomeo@outlook.it)
