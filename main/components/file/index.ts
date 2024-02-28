import { Directory } from "./dir";

export const scanDirectories = async (dirPaths: string[]) => {
  console.log("scanDirectories", dirPaths);
  const dirs = await Promise.all(
    dirPaths.map(async (d) => {
      const dirs = await scanSignleDir(d).catch((e) => {
        console.error(e);
        return [];
      });
      return dirs;
    })
  );
  return dirs;
};

export const scanSignleDir = async (dirPath: string) => {
  dirPath = resolveHomeDir(dirPath);
  const dir = new Directory(dirPath, { recursive: false });
  await dir.scanAsync();
  return dir.toJSON();
};

export const resolveHomeDir = (dirPath: string) => {
  if (dirPath.startsWith("~")) {
    const home = process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"];
    dirPath = dirPath.replace("~", home);
  }
  return dirPath;
};
