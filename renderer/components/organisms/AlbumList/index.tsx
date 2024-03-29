import { AlbumData } from "@renderer/components/templates/MainPage";
import style from "./style.module.scss";
import { useEffect, useState } from "react";
import { AlbumItem } from "@renderer/components/molecules/AlbumItem";
import { defaultCoverArt } from "@renderer/utils/image";

type Props = {
    albumData: AlbumData[];
    selectAlbum: (album?: string) => void;
};
type CoverArt = { fileId: number; cover: Buffer };
export const AlbumList = ({ albumData, selectAlbum }: Props) => {
    const [coverArt, setCoverArt] = useState<CoverArt[]>([]);

    useEffect(() => {
        window.ipc.on<CoverArt[]>("data.getCoverArt", (data) => {
            setCoverArt(data);
        });
    }, [coverArt]);

    useEffect(() => {
        window.ipc.send("data.getCoverArt", { fileIds: albumData.map((d) => d.fileId) });
    }, [albumData]);

    return (
        <div className={style.container}>
            <AlbumItem albumName="全ての楽曲" onClick={() => selectAlbum(undefined)} coverArt={defaultCoverArt} />
            {albumData.map(({ album, fileId }) => {
                const albumName = album == "" ? "無名のアルバム" : album;
                const cover = coverArt.find((d) => d.fileId === fileId)?.cover ?? defaultCoverArt;
                return (
                    <AlbumItem key={album} albumName={albumName} onClick={() => selectAlbum(album)} coverArt={cover} />
                );
            })}
        </div>
    );
};
