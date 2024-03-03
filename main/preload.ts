import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";
import log from "electron-log/main";
log.initialize();

const handler = {
    send<T>(channel: string, value: T) {
        log.debug(`Sending ${channel}`);
        ipcRenderer.send(channel, value);
    },
    on<T>(channel: string, callback: (...args: T[]) => void) {
        const subscription = (_event: IpcRendererEvent, ...args: T[]) => callback(...args);
        ipcRenderer.on(channel, subscription);
        log.debug(`Subscribed to ${channel}`);

        return () => {
            ipcRenderer.removeListener(channel, subscription);
        };
    },
};

contextBridge.exposeInMainWorld("ipc", handler);

export type IpcHandler = typeof handler;
