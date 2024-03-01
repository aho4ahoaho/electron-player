import { IpcMain } from "electron";
import { getMusicTable } from "./music";
import { MusicPlayer } from "./music/player";
import { readFile } from "fs/promises";
import { type BrowserWindow } from "electron";
import { PrismaClient } from "@prisma/client";
import { MusicData } from "./file/musicData";

const prisma = new PrismaClient();

/*eslint-disable @typescript-eslint/no-unused-vars*/
/*eslint-disable @typescript-eslint/no-explicit-any*/

export const setupIpc = (ipc: IpcMain) => {
    ipc.on("data.getMusicTable", async (event, arg: { targetDirPath: string[]; search: any }) => {
        if (!Array.isArray(arg.targetDirPath)) {
            console.error("Invalid targetDirPath", arg.targetDirPath);
            return [];
        }
        const data = await getMusicTable(arg.targetDirPath, { search: arg.search });
        event.reply("data.getMusicTable", data, arg.search);
    });

    ipc.on("data.rescanMusicTable", async (event, arg: { targetDirPath: string[] }) => {
        if (!Array.isArray(arg.targetDirPath)) {
            console.error("Invalid targetDirPath", arg.targetDirPath);
            return [];
        }
        const data = await getMusicTable(arg.targetDirPath, { forceScan: true });
        event.reply("data.rescanData", data);
    });

    ipc.on("data.getAlbumTable", async (event) => {
        const data =
            await prisma.$queryRaw`SELECT artist,album,fileId FROM MusicData WHERE album IS NOT NULL GROUP BY album ORDER BY artist ASC, album ASC`;
        event.reply("data.getAlbumTable", data);
    });

    ipc.on("data.getArtistTable", async (event) => {
        const data =
            await prisma.$queryRaw`SELECT artist,fileId FROM MusicData WHERE artist IS NOT NULL GROUP BY artist ORDER BY artist ASC`;
        event.reply("data.getArtistTable", data);
    });

    ipc.on("data.getCoverArt", async (event, { fileIds }: { fileIds: number[] }) => {
        if (!fileIds?.length) return [];
        const data = await prisma.file.findMany({
            where: {
                id: {
                    in: fileIds,
                },
            },
            select: {
                id: true,
                currentPath: true,
            },
        });
        if (!data) return [];

        const coverArtData = (
            await Promise.allSettled(
                data.map(async (d) => {
                    const musicData = new MusicData(d.currentPath);
                    const cover = await musicData.getCover();
                    return { fileId: d.id, cover };
                })
            )
        )
            .map((d) => d.status === "fulfilled" && d.value.cover && d.value)
            .filter(Boolean);
        event.reply("data.getCoverArt", coverArtData);
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
