/// <reference types="vite/client" />
import type { BackupApi } from "../../shared/types";

declare global {
  interface Window {
    backupApi: BackupApi;
  }

  // Variabili iniettate in fase di build dal workflow di release.
  interface ImportMetaEnv {
    readonly VITE_APP?: string;
    readonly VITE_RELEASE?: string;
    readonly VITE_DATA_RELEASE?: string;
  }
}
