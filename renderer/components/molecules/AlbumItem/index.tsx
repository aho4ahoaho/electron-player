import { useEffect, useState } from "react";
import style from "./style.module.scss";

type Props = {
    albumName: string;
    onClick: () => void;
    coverArt: string | Buffer;
};
export const AlbumItem = ({ albumName, onClick, coverArt }: Props) => {
    const [coverSrc, setCoverSrc] = useState<string>("https://via.placeholder.com/128");

    useEffect(() => {
        if (typeof coverArt === "string") {
            setCoverSrc(coverArt);
        } else {
            setCoverSrc(URL.createObjectURL(new Blob([coverArt])));
        }
        const nowCoverSrc = coverArt;
        return () => {
            if (typeof nowCoverSrc === "string") {
                URL.revokeObjectURL(nowCoverSrc);
            }
        };
    }, [coverArt]);

    return (
        <div className={style.items} onClick={onClick}>
            <img className={style.album_art} src={coverSrc} alt="" />
            <span className={style.title}>{albumName}</span>
        </div>
    );
};
