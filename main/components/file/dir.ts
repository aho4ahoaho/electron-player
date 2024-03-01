import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import { File } from "./file";

type Options = {
    recursive?: boolean;
};

export class Directory {
    readonly currentPath: string;
    private subDirs: Directory[] = [];
    private files: File[] = [];
    recursive: boolean;
    constructor(path: string, options: Options = { recursive: true }) {
        this.currentPath = path;
        if (options.recursive) {
            this.scan();
        }
    }

    scan(recursive = true) {
        this.files = [];
        this.subDirs = [];
        const dirs = fs.readdirSync(this.currentPath).map((d) => path.join(this.currentPath, d));
        for (const path of dirs) {
            const stats = fs.statSync(path);
            if (stats.isDirectory()) {
                this.subDirs.push(new Directory(path, { recursive }));
            } else {
                this.files.push(new File(path));
            }
        }
        console.log("scan", this);
    }

    async scanAsync(recursive = true) {
        const newFiles: File[] = [];
        const newDirs: Directory[] = [];
        const dirs = (await fsPromises.readdir(this.currentPath)).map((d) => path.join(this.currentPath, d));
        await Promise.all(
            dirs.map(async (path) => {
                const stats = await fsPromises.stat(path);
                if (stats.isDirectory()) {
                    const dir = new Directory(path, { recursive: false });
                    if (recursive) {
                        await dir.scanAsync();
                    }
                    newDirs.push(dir);
                } else {
                    const file = new File(path);
                    await file.scanData();
                    newFiles.push(file);
                }
            })
        );
        this.files = newFiles;
        this.subDirs = newDirs;
    }

    getFiles() {
        return this.files;
    }

    getSubDirs() {
        return this.subDirs;
    }

    toJSON() {
        return {
            currentPath: this.currentPath,
            subDirs: this.subDirs,
            files: this.files.map((f) => f.toJSON()),
        };
    }
}
