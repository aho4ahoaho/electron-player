import { IpcMain } from "electron";
import { scanDir } from "./file";
/*eslint-disable @typescript-eslint/no-unused-vars*/
export const setupIpc = (ipc: IpcMain) => {
  ipc.on("scan", async (event, arg) => {
    const dirs = await scanDir("D:\\Music");
    event.reply("scan", dirs);
  });
};
/*eslint-enable @typescript-eslint/no-unused-vars*/
