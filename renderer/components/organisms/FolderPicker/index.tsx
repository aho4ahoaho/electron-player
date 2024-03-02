import { DeleteFilled, FolderOpenOutlined, PlusCircleFilled } from "@ant-design/icons";
import { getSystemType } from "@renderer/utils/system";
import { Button, Flex, Input } from "antd";
import { useCallback, useEffect, useState } from "react";

type Props = {
    onChange?: (path: string[]) => void;
};
export const FolderPicker = ({ onChange }: Props) => {
    const [folderPath, setFolderPath] = useState<string[]>([]);

    useEffect(() => {
        const paths = getTargetDirPath();
        setFolderPath(paths);
    }, []);

    const addPathHandler = useCallback((newPath: string) => {
        setFolderPath((prev) => {
            const newFolders = Array.from(new Set([...prev, newPath]));
            localStorage.setItem("targetDirPath", JSON.stringify(newFolders));
            return newFolders;
        });
    }, []);

    useEffect(() => {
        onChange?.(folderPath);
    }, [folderPath, onChange]);

    return (
        <Flex vertical style={{ width: "100%" }}>
            <h3 style={{ margin: 0 }}>追加済み</h3>
            {folderPath.map((path, i) => (
                <Flex key={i} style={{ width: "100%" }}>
                    <Input value={path} readOnly style={{ flex: 1, cursor: "default" }} />
                    <Button
                        danger
                        type="primary"
                        icon={<DeleteFilled />}
                        onClick={() => {
                            setFolderPath((prev) => prev.filter((_, j) => i !== j));
                        }}
                    >
                        削除
                    </Button>
                </Flex>
            ))}
            <div style={{ height: 8 }} />
            <h3 style={{ margin: 0 }}>新しいフォルダ</h3>
            <NewFolderSelect onAdd={addPathHandler} />
        </Flex>
    );
};

const NewFolderSelect = ({ onAdd }: { onAdd: (path: string) => void }) => {
    const [newFolderPath, setNewFolderPath] = useState<string>("");

    const addPathHandler = useCallback(async () => {
        const newPath = await folderSelect();
        setNewFolderPath(newPath);
    }, []);

    return (
        <>
            <Input
                value={newFolderPath}
                onChange={(e) => setNewFolderPath(e.currentTarget.value)}
                style={{ flex: 1 }}
            />
            <Flex>
                <Button icon={<FolderOpenOutlined />} onClick={addPathHandler} style={{ flex: 1 }}>
                    参照
                </Button>
                <Button
                    icon={<PlusCircleFilled />}
                    type="primary"
                    onClick={() => {
                        onAdd(newFolderPath);
                        setNewFolderPath("");
                    }}
                    style={{ flex: 1 }}
                >
                    追加
                </Button>
            </Flex>
        </>
    );
};

export const getTargetDirPath = (): string[] => {
    const targetDirPath = localStorage.getItem("targetDirPath");
    if (!targetDirPath) return [];
    const paths = JSON.parse(targetDirPath);
    if (!Array.isArray(paths)) return [];
    if (!paths.every((path) => typeof path === "string")) return [];
    return paths;
};

const folderSelect = () => {
    return new Promise<string>((resolve, reject) => {
        const input = document.createElement("input");
        input.type = "file";
        input.setAttribute("webkitdirectory", "");
        input.setAttribute("directory", "");
        const onChange = () => {
            const files = input.files;
            if (!files || files.length === 0) {
                reject("フォルダが選択されていません");
                return;
            }
            //Windowsのみ区切り文字を変える
            const splitMark = getSystemType() === "Windows" ? "\\" : "/";

            //絶対パス
            const absolutePath = files[0].path;
            //相対パスから最上位のフォルダ名を消したもの
            const relativePath = files[0].webkitRelativePath.split(splitMark).splice(1).join(splitMark);

            //絶対パスから相対パスを消すことで親フォルダの絶対パスを取得
            const newPath = absolutePath.replace(relativePath, "");
            resolve(newPath);

            //後始末
            input.removeEventListener("change", onChange);
            input.remove();
        };
        input.addEventListener("change", onChange);
        input.click();
    });
};
