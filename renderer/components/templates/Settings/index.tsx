import { Button, Flex } from "antd";
import { useCallback } from "react";
import style from "./style.module.scss";
import { FolderPicker, getTargetDirPath } from "@renderer/components/organisms/FolderPicker";

export const SettingsPage: React.FC = () => {
    const rescanData = useCallback(async () => {
        const targetDirPath = getTargetDirPath();
        window.ipc.send("data.rescanMusicTable", { targetDirPath: targetDirPath });
    }, []);

    return (
        <div className={style.container}>
            <Flex justify="center" vertical style={{ width: "min(600px , 100%)" }}>
                <h2>ライブラリ管理</h2>
                <FolderPicker />
            </Flex>
            <Flex justify="center" vertical style={{ width: "min(600px , 100%)" }}>
                <Button
                    onClick={() => {
                        if (confirm("時間がかかる場合があります。\nフォルダの再スキャンを行いますか?")) {
                            rescanData();
                        }
                    }}
                    type="primary"
                    style={{ backgroundColor: "rgb(255, 193, 7)", color: "black" }}
                >
                    フォルダの再スキャン
                </Button>
            </Flex>
        </div>
    );
};
