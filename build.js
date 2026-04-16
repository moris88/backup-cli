const fs = require('node:fs');
const path = require('node:path');

const src = path.join(__dirname, 'dist', 'index.min.js');
const dest = path.join(__dirname, 'dist', 'backup.js');

try {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log('✅ File copiato con successo: dist/index.min.js -> dist/backup.js');
  } else {
    console.error('❌ Errore: Il file sorgente dist/index.min.js non esiste.');
    process.exit(1);
  }
} catch (err) {
  console.error('❌ Errore durante la copia del file:', err);
  process.exit(1);
}
