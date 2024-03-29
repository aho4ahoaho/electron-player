type MigrateSQL = {
    id: string;
    sql: string;
};
//手動でマイグレーションファイルをコピペしていく
export const migrations: MigrateSQL[] = [
    {
        id: "20240302053532_init",
        sql: `
-- CreateTable
CREATE TABLE "Directory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "currentPath" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "File" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "currentPath" TEXT NOT NULL,
    "ext" TEXT NOT NULL,
    "directoryCurrentPath" TEXT,
    CONSTRAINT "File_directoryCurrentPath_fkey" FOREIGN KEY ("directoryCurrentPath") REFERENCES "Directory" ("currentPath") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MusicData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "codec" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "trackNo" INTEGER,
    "album" TEXT,
    "artist" TEXT,
    "year" INTEGER,
    "lossless" BOOLEAN,
    "bitrate" INTEGER,
    "fileId" INTEGER NOT NULL,
    CONSTRAINT "MusicData_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Directory_currentPath_key" ON "Directory"("currentPath");

-- CreateIndex
CREATE UNIQUE INDEX "MusicData_fileId_key" ON "MusicData"("fileId");
`,
    },
    {
        id: "20240303074343_set_cascade",
        sql: `
        -- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_File" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "currentPath" TEXT NOT NULL,
    "ext" TEXT NOT NULL,
    "directoryCurrentPath" TEXT,
    CONSTRAINT "File_directoryCurrentPath_fkey" FOREIGN KEY ("directoryCurrentPath") REFERENCES "Directory" ("currentPath") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_File" ("currentPath", "directoryCurrentPath", "ext", "id", "name") SELECT "currentPath", "directoryCurrentPath", "ext", "id", "name" FROM "File";
DROP TABLE "File";
ALTER TABLE "new_File" RENAME TO "File";
CREATE TABLE "new_MusicData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "codec" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "trackNo" INTEGER,
    "album" TEXT,
    "artist" TEXT,
    "year" INTEGER,
    "lossless" BOOLEAN,
    "bitrate" INTEGER,
    "fileId" INTEGER NOT NULL,
    CONSTRAINT "MusicData_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_MusicData" ("album", "artist", "bitrate", "codec", "duration", "fileId", "id", "lossless", "title", "trackNo", "year") SELECT "album", "artist", "bitrate", "codec", "duration", "fileId", "id", "lossless", "title", "trackNo", "year" FROM "MusicData";
DROP TABLE "MusicData";
ALTER TABLE "new_MusicData" RENAME TO "MusicData";
CREATE UNIQUE INDEX "MusicData_fileId_key" ON "MusicData"("fileId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
        `,
    },
];
