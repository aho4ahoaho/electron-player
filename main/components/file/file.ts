import path from "path";
import { MusicData } from "./musicData";

//https://www.chromium.org/audio-video/
const SupportAudioExt = [".mp3", ".flac", ".wav", ".ogg", ".m4a", ".aac", ".opus"];

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
        if (!SupportAudioExt.includes(this.ext)) return null;
        if (this.metadata) return this.metadata;
        this.metadata = await new MusicData(this.currentPath).scanData();
        return this.metadata;
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
