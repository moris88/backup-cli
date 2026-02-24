# Backup Script CLI

Un'utilità a riga di comando (CLI) in TypeScript per creare rapidamente archivi ZIP di backup del progetto, permettendo la selezione granulare dei file e delle cartelle.

## 🚀 Caratteristiche

- **Selezione Interattiva**: Scegli quali file e cartelle della root includere nell'archivio.
- **Cifratura Automatica**: Genera una password sicura a 14 caratteri per proteggere l'archivio ZIP.
- **Esclusioni Intelligenti**: Esclude automaticamente cartelle pesanti o inutili come `node_modules`, `dist`, `.git` e altri file di backup esistenti.
- **Compressione Ottimizzata**: Utilizza `archiver` con livello di compressione 9 (Zlib).
- **Naming Personalizzabile**: Suggerisce un nome basato sulla data odierna (`backup_YYYY-MM-DD.zip`), ma permette la personalizzazione.
- **Protezione Sovrascrittura**: Chiede conferma prima di sovrascrivere un file esistente.
- **Feedback in Tempo Reale**: Mostra la percentuale di avanzamento e la dimensione dei dati processati.

## 🛠️ Requisiti

- [Node.js](https://nodejs.org/) (versione consigliata: 22 o superiore)
- npm o yarn

## 📦 Installazione

1. Clona la repository:

   ```bash
   git clone <repository-url>
   cd backup-script
   ```

2. Installa le dipendenze:

   ```bash
   npm install
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

## 🏗️ Struttura del Progetto

- `src/main.ts`: Punto di ingresso principale dello script.
- `dist/`: Contiene i bundle generati dopo la build.
- `package.json`: Configurazione del progetto e script npm.

## 🧰 Dipendenze Principali

- [archiver](https://www.npmjs.com/package/archiver): Generazione di archivi ZIP.
- [archiver-zip-encryptable](https://www.npmjs.com/package/archiver-zip-encryptable): Supporto alla cifratura con password.
- [inquirer](https://www.npmjs.com/package/inquirer): Interfaccia interattiva CLI.
- [glob](https://www.npmjs.com/package/glob): Corrispondenza di pattern per i file.
- [esbuild](https://esbuild.github.io/): Bundler ultra-veloce per la compilazione.

## 👨‍💻 Autore

**Maurizio Tolomeo**

- Website: [https://www.mauriziotolomeo.it](https://www.mauriziotolomeo.it)
- Email: [maurizio.tolomeo@outlook.it](mailto:maurizio.tolomeo@outlook.it)

---
*Creato per semplificare la gestione dei backup locali durante lo sviluppo.*
