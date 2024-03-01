import { IpcMain } from "electron";
import { getMusicTable } from "./music";
import { MusicPlayer } from "./music/player";
import { readFile } from "fs/promises";
import { type BrowserWindow } from "electron";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/*eslint-disable @typescript-eslint/no-unused-vars*/
/*eslint-disable @typescript-eslint/no-explicit-any*/

export const setupIpc = (ipc: IpcMain) => {
    ipc.on("data.getMusicTable", async (event, arg: { targetDirPath: string[]; search: any }) => {
        const data = await getMusicTable(arg.targetDirPath, { search: arg.search });
        event.reply("data.getMusicTable", data, arg.search);
    });

    ipc.on("data.getAlbumTable", async (event) => {
        const data = await prisma.$queryRaw`SELECT album,fileId FROM MusicData WHERE album IS NOT NULL GROUP BY album;`;
        event.reply("data.getAlbumTable", data);
    });
};

export const setupIpcDefer = (ipc: IpcMain, { mainWindow }: { mainWindow: BrowserWindow }) => {
    let musicPlayer: MusicPlayer = new MusicPlayer([]);

    const setFile = async () => {
        const track = await musicPlayer.getTrack();
        if (!track) {
            return;
        }
        const trackBin = await readFile(track.currentPath);
        mainWindow.webContents.send("player.metadata", track.metadata);
        mainWindow.webContents.send("player.setFile", trackBin);
    };

    ipc.on("player.setQueue", async (event, arg: { fileIds: number[]; play: boolean }) => {
        const { fileIds, play } = arg;
        if (fileIds && fileIds.length > 0) {
            musicPlayer = new MusicPlayer(fileIds);
        }
        await setFile();
        await new Promise((resolve) => setTimeout(resolve, 100));
        if (play) {
            mainWindow.webContents.send("player.play");
        }
    });

    const skipTrack = async (prev = false) => {
        if (prev) {
            musicPlayer.prev();
        } else {
            musicPlayer.next();
        }
        const data = await musicPlayer.getTrack();

        if (!data) {
            mainWindow.webContents.send("player.stop");
            return;
        }
        await setFile();
        await new Promise((resolve) => setTimeout(resolve, 100));
        mainWindow.webContents.send("player.play");
    };

    ipc.on("player.next", async () => {
        await skipTrack();
        await setFile();
    });
    ipc.on("player.prev", async () => {
        await skipTrack(true);
        await setFile();
    });
};
/*eslint-enable @typescript-eslint/no-unused-vars*/
/*eslint-enable @typescript-eslint/no-explicit-any*/
