import { Button } from "antd";
import { useCallback } from "react";

export const SettingsPage: React.FC = () => {
    const rescanData = useCallback(async () => {
        window.ipc.send("data.rescanMusicTable", { targetDirPath: ["~/Music"] });
    }, []);

    return (
        <>
            <Button onClick={rescanData}>Rescan Data</Button>
        </>
    );
};
