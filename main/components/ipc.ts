import { IpcMain } from "electron";
import { getDirs } from "./file";
import { getMusicTable } from "./music";

/*eslint-disable @typescript-eslint/no-unused-vars*/
/*eslint-disable @typescript-eslint/no-explicit-any*/
export const setupIpc = (ipc: IpcMain) => {
  ipc.on("scanDirs", async (event, arg: string[]) => {
    const dirs = await getDirs(arg, { forceScan: true });
    event.reply("scanDirs", dirs);
  });

  ipc.on("getDirs", async (event, arg: string[]) => {
    const dirs = await getDirs(arg);
    event.reply("getDirs", dirs);
  });

  ipc.on("getMusicTable", async (event, arg: { targetDirPath: string[]; search: any }) => {
    const data = await getMusicTable(arg.targetDirPath, { search: arg.search });
    event.reply("getMusicTable", data);
  });
};
/*eslint-enable @typescript-eslint/no-unused-vars*/
/*eslint-enable @typescript-eslint/no-explicit-any*/
