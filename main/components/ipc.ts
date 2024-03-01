import { IpcMain } from "electron";
import { getMusicTable } from "./music";
import { MusicPlayer } from "./music/player";
import { readFile } from "fs/promises";
import { type BrowserWindow } from "electron";

/*eslint-disable @typescript-eslint/no-unused-vars*/
/*eslint-disable @typescript-eslint/no-explicit-any*/

export const setupIpc = (ipc: IpcMain) => {
    ipc.on("data.getMusicTable", async (event, arg: { targetDirPath: string[]; search: any }) => {
        const data = await getMusicTable(arg.targetDirPath, { search: arg.search });
        event.reply("data.getMusicTable", data);
    });
};

export const setupIpcDefer = (
    ipc: IpcMain,
    { mainWindow, playerWindow }: { mainWindow: BrowserWindow; playerWindow: BrowserWindow }
) => {
    let musicPlayer: MusicPlayer = new MusicPlayer([]);

    const setFile = async () => {
        const track = await musicPlayer.getTrack();
        if (!track) {
            return;
        }
        const trackBin = await readFile(track.currentPath);
        playerWindow.webContents.send("player.setFile", trackBin);
        mainWindow.webContents.send("player.metadata", track.metadata);
    };
    ipc.on("player.setQueue", async (event, arg: { fileIds: number[]; play: boolean }) => {
        const { fileIds, play } = arg;
        if (fileIds && fileIds.length > 0) {
            musicPlayer = new MusicPlayer(fileIds);
        }
        await setFile();
        await new Promise((resolve) => setTimeout(resolve, 100));
        if (play) {
            playerWindow.webContents.send("player.play");
            mainWindow.webContents.send("player.play");
        }
    });

    //再生操作
    ipc.on("player.play", (event, arg: any) => {
        playerWindow.webContents.send("player.play");
        mainWindow.webContents.send("player.play");
    });

    ipc.on("player.pause", (event, arg: any) => {
        playerWindow.webContents.send("player.pause");
        mainWindow.webContents.send("player.pause");
    });

    ipc.on("player.stop", (event, arg: any) => {
        playerWindow.webContents.send("player.stop");
        mainWindow.webContents.send("player.stop");
    });

    const skipTrack = async (prev = true) => {
        playerWindow.webContents.send("player.next");
        mainWindow.webContents.send("player.next");
        if (prev) {
            musicPlayer.prev();
        } else {
            musicPlayer.next();
        }
        const data = await musicPlayer.getTrack();
        if (!data) {
            mainWindow.webContents.send("player.stop");
            playerWindow.webContents.send("player.stop");
            return;
        }
        await setFile();
        await new Promise((resolve) => setTimeout(resolve, 100));
        playerWindow.webContents.send("player.play");
        mainWindow.webContents.send("player.play");
    };

    ipc.on("player.end", () => {
        skipTrack();
    });
    ipc.on("player.next", () => {
        skipTrack();
    });
    ipc.on("player.prev", () => {
        skipTrack(true);
    });

    //シーク周り
    ipc.on("player.timeUpdate", (event, arg: number) => {
        mainWindow.webContents.send("player.timeUpdate", arg);
    });

    ipc.on("player.setTime", (event, arg: number) => {
        playerWindow.webContents.send("player.setTime", arg);
        mainWindow.webContents.send("player.setTime", arg);
    });
};
/*eslint-enable @typescript-eslint/no-unused-vars*/
/*eslint-enable @typescript-eslint/no-explicit-any*/
