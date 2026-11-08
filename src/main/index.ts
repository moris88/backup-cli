import path from "node:path";
import { app, BrowserWindow, dialog, ipcMain } from "electron";
import type {
  CompressRequest,
  ExtractRequest,
  IpcResult,
} from "../shared/types";
import { compress, extract, listFolder } from "./backupService";

/** Esegue un handler e normalizza l'esito in IpcResult. */
async function wrap<T>(fn: () => T | Promise<T>): Promise<IpcResult<T>> {
  try {
    return { ok: true, data: await fn() };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

function createWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width: 960,
    height: 720,
    minWidth: 720,
    minHeight: 560,
    title: "Backup",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  const devUrl = process.env.ELECTRON_RENDERER_URL;
  if (!app.isPackaged && devUrl) {
    win.loadURL(devUrl);
  } else {
    win.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
  return win;
}

function registerIpc(): void {
  ipcMain.handle("dialog:selectFolder", async () => {
    const res = await dialog.showOpenDialog({ properties: ["openDirectory"] });
    return res.canceled ? null : (res.filePaths[0] ?? null);
  });

  ipcMain.handle("dialog:selectZip", async () => {
    const res = await dialog.showOpenDialog({
      properties: ["openFile"],
      filters: [{ name: "Archivi ZIP", extensions: ["zip"] }],
    });
    return res.canceled ? null : (res.filePaths[0] ?? null);
  });

  ipcMain.handle("dialog:selectSaveZip", async (_e, defaultPath: string) => {
    const res = await dialog.showSaveDialog({
      defaultPath,
      filters: [{ name: "Archivi ZIP", extensions: ["zip"] }],
    });
    return res.canceled ? null : (res.filePath ?? null);
  });

  ipcMain.handle("fs:listFolder", (_e, dir: string) =>
    wrap(() => listFolder(dir)),
  );

  ipcMain.handle("backup:compress", (e, req: CompressRequest) =>
    wrap(() => compress(req, (info) => e.sender.send("backup:progress", info))),
  );

  ipcMain.handle("backup:extract", (_e, req: ExtractRequest) =>
    wrap(() => extract(req)),
  );
}

app.whenReady().then(() => {
  registerIpc();
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
