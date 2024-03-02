import { prisma } from "../database";

export type PlayerState = "playing" | "paused" | "stopped";
export class MusicPlayer {
    readonly fileIds: number[];
    private index: number = 0;
    state: PlayerState = "stopped";

    constructor(fileIds: number[]) {
        this.fileIds = fileIds;
    }

    async getTrack() {
        if (this.index < 0 || this.index >= this.fileIds.length) {
            return null;
        }
        const nowTrackFileId = this.fileIds[this.index];
        const data = await prisma.file.findFirst({
            where: {
                id: nowTrackFileId,
            },
            include: {
                metadata: true,
            },
        });
        return data;
    }

    play() {
        this.state = "playing";
    }

    pause() {
        this.state = "paused";
    }

    stop() {
        this.state = "stopped";
    }

    next() {
        this.index += 1;
    }

    prev() {
        this.index--;
    }
}
