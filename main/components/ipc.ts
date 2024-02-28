import { IpcMain } from "electron";
import { resolveHomeDir, scanDirectories } from "./file";
import Store from "electron-store";
import { Directory } from "./file/dir";

const store = new Store();

const getDirs = async (arg, { forceScan }: { forceScan?: boolean } = {}) => {
  const dirPaths = arg
    .filter((d) => typeof d === "string")
    .filter((d) => d.length > 0)
    .map((d) => resolveHomeDir(d));
  const knownDirs = store.get("dirData") as Directory[] | undefined;
  if (knownDirs || forceScan) {
    const count = knownDirs.reduce((acc, cur) => {
      if (dirPaths.includes(cur.currentPath)) {
        return acc + 1;
      }
      return acc;
    }, 0);
    console.log("count", count, dirPaths.length);
    if (count === dirPaths.length) {
      return knownDirs;
    }
  }
  const dirs = await scanDirectories(dirPaths);
  store.set("dirData", dirs);
  return dirs;
};

/*eslint-disable @typescript-eslint/no-unused-vars*/
export const setupIpc = (ipc: IpcMain) => {
  ipc.on("scanDirs", async (event, arg: string[]) => {
    const dirs = await getDirs(arg, { forceScan: true });
    event.reply("scanDirs", dirs);
  });

  ipc.on("getDirs", async (event, arg: string[]) => {
    const dirs = await getDirs(arg);
    event.reply("getDirs", dirs);
  });
};
/*eslint-enable @typescript-eslint/no-unused-vars*/
