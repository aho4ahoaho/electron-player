import { Directory } from "./dir";
import { Directory as DirectoryRow, Prisma } from "@prisma/client";

import { prisma } from "../database";

export const getDirs = async (
    targetDirPath: string[],
    { forceScan }: { forceScan?: boolean } = {}
): Promise<DirectoryRow[]> => {
    const dirPaths = targetDirPath
        .filter((d) => typeof d === "string")
        .filter((d) => d.length > 0)
        .map((d) => resolveHomeDir(d));
    const knownDirs = await prisma.directory.findMany({
        where: {
            currentPath: {
                in: dirPaths,
            },
        },
    });
    if (knownDirs.length == dirPaths.length && !forceScan) {
        return await prisma.directory.findMany({});
    }

    const data = await generateDirTable(dirPaths);
    return data;
};

const generateDirTable = async (dirPaths: string[]): Promise<DirectoryRow[]> => {
    const flattenDirs = (dir: Directory): Directory[] => {
        const subdir = dir.getSubDirs().reduce((acc, d) => {
            return [...acc, ...flattenDirs(d)];
        }, [] as Directory[]);
        return [dir, ...subdir];
    };

    const dirs = await scanDirectories(dirPaths).then((dirs) => {
        return dirs.flatMap(flattenDirs);
    });

    const data = await prisma.$transaction(async (prisma) => {
        const upserts = await Promise.all(
            dirs.map(async (d) => {
                const files: Prisma.FileCreateInput[] = d.getFiles().map((f) => {
                    const metadata = f.getMetadata();
                    return {
                        currentPath: f.currentPath,
                        name: f.name,
                        ext: f.ext,
                        metadata: metadata
                            ? {
                                  create: {
                                      title: metadata.title,
                                      album: metadata.album,
                                      artist: metadata.artist,
                                      year: metadata.year,
                                      trackNo: metadata.trackNo,
                                      duration: metadata.duration,
                                      codec: metadata.codec,
                                      lossless: metadata.lossless,
                                      bitrate: metadata.bitrate,
                                  },
                              }
                            : undefined,
                    };
                });

                //一度メタデータはすべて削除する
                await prisma.musicData.deleteMany({
                    where: {
                        file: {
                            currentPath: {
                                in: files.map((f) => f.currentPath),
                            },
                        },
                    },
                });

                return await prisma.directory.upsert({
                    where: {
                        currentPath: d.currentPath,
                    },
                    update: {
                        currentPath: d.currentPath,
                        files: {
                            deleteMany: {},
                            create: files,
                        },
                    },
                    create: {
                        currentPath: d.currentPath,
                        files: {
                            create: files,
                        },
                    },
                });
            })
        ).catch((e) => {
            console.error(e);
            throw e;
        });
        return upserts;
    });
    return data;
};

export const scanDirectories = async (dirPaths: string[]): Promise<Directory[]> => {
    const dirs = (await Promise.all(
        dirPaths
            .map(async (d) => {
                const dirs: Directory | null = await scanSignleDir(d).catch((e) => {
                    console.error(e);
                    return null;
                });
                return dirs;
            })
            .filter((d) => d)
    )) as Directory[]; //filterしているのでアサーションしてしまう
    return dirs;
};

export const scanSignleDir = async (dirPath: string): Promise<Directory> => {
    dirPath = resolveHomeDir(dirPath);
    const dir = new Directory(dirPath, { recursive: false });
    await dir.scanAsync();
    return dir;
};

export const resolveHomeDir = (dirPath: string) => {
    if (dirPath.startsWith("~")) {
        const home = process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"];
        if (!home) return dirPath;
        dirPath = dirPath.replace("~", home);
    }
    return dirPath;
};
