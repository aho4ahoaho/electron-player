import { getDirs } from "../file";
import { Prisma } from "@prisma/client";
import { prisma } from "../database";

export type MusicTableSearchOption = Prisma.MusicDataWhereInput;
export const getMusicTable = async (
    targetDirPath: string[],
    { forceScan, search }: { forceScan?: boolean; search?: MusicTableSearchOption } = {}
) => {
    await getDirs(targetDirPath, { forceScan });
    const data = await prisma.musicData.findMany({
        where: search,
        orderBy: [
            {
                artist: "asc",
            },
            {
                album: "asc",
            },
            {
                trackNo: "asc",
            },
            {
                title: "asc",
            },
        ],
    });
    return data;
};
