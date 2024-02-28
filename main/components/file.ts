import fs from "fs/promises";
import path from "path";
class Directory {
  path: string;
  subDirs: string[] = [];
  constructor(path: string) {
    this.path = path;
  }

  async scanDir() {
    const dirs = await fs.readdir(this.path);
    return dirs;
  }
  toJSON() {
    return {
      path: this.path,
      subDirs: this.subDirs,
    };
  }
}

export const scanDir = async (dir: string) => {
  const dirs = await fs.readdir(dir);
  return dirs.map((d) => path.join(dir, d)).map((d) => new Directory(d));
};
