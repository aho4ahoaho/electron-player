import path from "path";
import { app, ipcMain } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import { setupIpc, setupIpcDefer } from "./components/ipc";

const isProd = process.env.NODE_ENV === "production";

if (isProd) {
    serve({ directory: "app" });
} else {
    app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
    await app.whenReady();

    const mainWindow = createWindow("main", {
        width: 1000,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
        titleBarStyle: "hidden",
    });

    mainWindow.on("closed", () => {
        app.quit();
    });

    if (isProd) {
        await mainWindow.loadURL("app://./index.html");
    } else {
        const port = process.argv[2];
        await mainWindow.loadURL(`http://localhost:${port}/`);
        //mainWindow.webContents.openDevTools({ mode: "detach", activate: false });
    }
    setupIpcDefer(ipcMain, { mainWindow });
})();

setupIpc(ipcMain);
