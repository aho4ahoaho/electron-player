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
