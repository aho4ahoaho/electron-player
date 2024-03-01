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
    "trackNo" INTEGER NOT NULL,
    "album" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "codec" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "lossless" BOOLEAN NOT NULL,
    "bitrate" INTEGER NOT NULL,
    "fileId" INTEGER NOT NULL,
    CONSTRAINT "MusicData_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Directory_currentPath_key" ON "Directory"("currentPath");

-- CreateIndex
CREATE UNIQUE INDEX "MusicData_fileId_key" ON "MusicData"("fileId");
