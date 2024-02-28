import path from "path";
import { MusicData } from "./musicData";

export class File {
  readonly currentPath: string;
  private metadata: MusicData | null = null;
  constructor(path: string) {
    this.currentPath = path;
  }
  async scanData() {
    if (this.metadata) return this.metadata;
    this.metadata = await new MusicData(this.currentPath).scanData();
  }
  getExt() {
    return path.extname(this.currentPath);
  }
  toJSON() {
    return {
      path: this.currentPath,
      ext: this.getExt(),
      metadata: this.metadata?.toJSON(),
    };
  }
}
