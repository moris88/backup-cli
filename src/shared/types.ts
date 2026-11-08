/** Elemento selezionabile nella cartella di origine. */
export interface FolderEntry {
  name: string;
  isDirectory: boolean;
}

export interface CompressRequest {
  sourceDir: string;
  items: string[];
  outputPath: string;
  /** Id delle categorie di DEV_FILTERS da escludere. */
  excludedFilters: string[];
}

export interface CompressResult {
  outputPath: string;
  password: string;
  sizeBytes: number;
}

export interface ExtractRequest {
  zipPath: string;
  destinationDir: string;
  password: string;
}

export interface ExtractResult {
  extractedTo: string;
}

export interface ProgressInfo {
  processedBytes: number;
  totalBytes: number;
}

/** Esito uniforme delle chiamate IPC. */
export type IpcResult<T> = { ok: true; data: T } | { ok: false; error: string };

/** API esposta dal preload al renderer. */
export interface BackupApi {
  selectFolder: () => Promise<string | null>;
  selectZip: () => Promise<string | null>;
  selectSaveZip: (defaultPath: string) => Promise<string | null>;
  listFolder: (dir: string) => Promise<IpcResult<FolderEntry[]>>;
  compress: (req: CompressRequest) => Promise<IpcResult<CompressResult>>;
  extract: (req: ExtractRequest) => Promise<IpcResult<ExtractResult>>;
  onProgress: (cb: (info: ProgressInfo) => void) => () => void;
}
