import { AlbumData } from "@renderer/components/templates/MainPage";
import { Flex } from "antd";
import style from "./style.module.scss";
import { useEffect, useState } from "react";

type Props = {
    albumData: AlbumData[];
    selectAlbum: (album?: string) => void;
};
type CoverArt = { fileId: number; cover: Buffer; blob: string };
export const AlbumList = ({ albumData, selectAlbum }: Props) => {
    const [coverArt, setCoverArt] = useState<CoverArt[]>([]);

    useEffect(() => {
        window.ipc.on<CoverArt[]>("data.getCoverArt", (data) => {
            const knownArt = [];
            const newArt = [];

            for (const d of data) {
                if (coverArt.some((c) => c.fileId === d.fileId)) {
                    knownArt.push(d);
                } else {
                    newArt.push(d);
                }
            }
            setCoverArt([
                ...knownArt,
                ...newArt.map((d) => ({ ...d, blob: URL.createObjectURL(new Blob([d.cover])) })),
            ]);

            const unusedArt = coverArt.filter((c) => !data.some((d) => d.fileId === c.fileId));
            unusedArt.forEach((d) => {
                URL.revokeObjectURL(d.blob);
            });
        });
        return () => {
            coverArt.forEach((d) => {
                URL.revokeObjectURL(d.blob);
            });
        };
    }, [coverArt]);

    useEffect(() => {
        window.ipc.send("data.getCoverArt", { fileIds: albumData.map((d) => d.fileId) });
    }, [albumData]);

    return (
        <Flex className={style.container}>
            <div
                className={style.items}
                onClick={() => {
                    selectAlbum(undefined);
                }}
            >
                <img className={style.album_art} src="https://via.placeholder.com/128" alt="" />
                <span className={style.title}>全ての楽曲</span>
            </div>
            {albumData.map(({ album, fileId }) => {
                const albumName = album == "" ? "無名のアルバム" : album;
                const cover = coverArt.find((d) => d.fileId === fileId)?.blob ?? "https://via.placeholder.com/128";
                return (
                    <div
                        key={album}
                        className={style.items}
                        onClick={() => {
                            selectAlbum(album);
                        }}
                    >
                        <img className={style.album_art} src={cover} alt="" />
                        <span className={style.title}>{albumName}</span>
                    </div>
                );
            })}
        </Flex>
    );
};
