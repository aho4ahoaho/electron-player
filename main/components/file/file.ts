import path from "path";
import { MusicData } from "./musicData";

export class File {
    readonly currentPath: string;
    private metadata: MusicData | null = null;
    readonly name: string;
    readonly ext: string;
    constructor(filePath: string) {
        this.currentPath = filePath;
        this.name = path.basename(this.currentPath);
        this.ext = path.extname(this.currentPath);
    }
    async scanData() {
        if (this.metadata) return this.metadata;
        this.metadata = await new MusicData(this.currentPath).scanData();
    }
    getMetadata() {
        return this.metadata;
    }
    toJSON() {
        return {
            path: this.currentPath,
            name: this.name,
            ext: this.ext,
            metadata: this.metadata?.toJSON(),
        };
    }
}
