import { contextBridge, ipcRenderer } from "electron";
import type { BackupApi, ProgressInfo } from "../shared/types";

const api: BackupApi = {
  selectFolder: () => ipcRenderer.invoke("dialog:selectFolder"),
  selectZip: () => ipcRenderer.invoke("dialog:selectZip"),
  selectSaveZip: (defaultPath) =>
    ipcRenderer.invoke("dialog:selectSaveZip", defaultPath),
  listFolder: (dir) => ipcRenderer.invoke("fs:listFolder", dir),
  compress: (req) => ipcRenderer.invoke("backup:compress", req),
  extract: (req) => ipcRenderer.invoke("backup:extract", req),
  onProgress: (cb) => {
    const listener = (_e: Electron.IpcRendererEvent, info: ProgressInfo) =>
      cb(info);
    ipcRenderer.on("backup:progress", listener);
    return () => ipcRenderer.removeListener("backup:progress", listener);
  },
};

contextBridge.exposeInMainWorld("backupApi", api);
