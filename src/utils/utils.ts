/**
 * Formatta il nome del file assicurandosi che abbia l'estensione .zip
 */
function formatFileName(input: string): string {
  return input.endsWith(".zip") ? input : `${input}.zip`;
}

/**
 * Valida che l'utente abbia selezionato almeno un elemento.
 */
function validateSelection(answer: string[]): boolean | string {
  if (answer.length < 1) {
    return "Devi selezionare almeno un elemento.";
  }
  return true;
}

/**
 * Genera la lista delle scelte filtrando gli elementi esclusi.
 */
function filterRootContent(
  rootContent: string[],
  excludeList: string[],
): string[] {
  return rootContent.filter(
    (item: string) =>
      !excludeList.includes(item) && !item.startsWith("backup_"),
  );
}

/**
 * Genera una password casuale di 14 caratteri con alfanumerici e caratteri speciali.
 */
function generatePassword(): string {
  const length = 14;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

/**
 * Formatta il messaggio di progresso della compressione.
 */
function formatProgress(processedBytes: number, totalBytes: number): string {
  const processedMB = (processedBytes / 1024 / 1024).toFixed(2);
  const totalMB = (totalBytes / 1024 / 1024).toFixed(2);
  const percentage =
    totalBytes > 0 ? ((processedBytes / totalBytes) * 100).toFixed(2) : "0.00";

  return `\rZippando: ${percentage}% (${processedMB} MB / ${totalMB} MB)...`;
}

/**
 * Prepara gli oggetti Choice per Inquirer con le etichette corrette.
 */
function prepareChoices(
  items: string[],
  isDirCallback: (item: string) => boolean,
) {
  return items
    .map((item) => {
      const isDirectory = isDirCallback(item);
      return {
        name: isDirectory ? `[DIR]  ${item}` : `[FILE] ${item}`,
        value: item,
        short: item,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

module.exports = {
  formatFileName,
  validateSelection,
  filterRootContent,
  generatePassword,
  formatProgress,
  prepareChoices,
};
