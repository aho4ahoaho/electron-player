import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class MusicPlayer {
    readonly fileIds: number[];
    index: number = 0;
    constructor(fileIds: number[]) {
        this.fileIds = fileIds;
    }

    async getTrack() {
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

    next() {
        this.index++;
    }

    prev() {
        this.index--;
    }
}
