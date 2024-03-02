import { MusicData } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import style from "./style.module.scss";

type Props = {
    musicData?: MusicData;
};
type CoverArt = { fileId: number; cover: Buffer };
const defaultCoverArt = "https://via.placeholder.com/500";
export const TrackView = ({ musicData }: Props) => {
    const [coverArt, setCoverArt] = useState<string>();
    const { artist, fileId, title, album } = musicData ?? {};

    const titleRef = useRef<HTMLDivElement>(null);
    const titleContextRef = useRef<HTMLSpanElement>(null);
    useEffect(() => {
        window.ipc.on<CoverArt[]>("data.getCoverArt", (data) => {
            const cover = data?.[0].cover; //見つからないと空配列が返ってくるためOptionalにする
            if (!cover) {
                setCoverArt(defaultCoverArt);
                return;
            }
            const blob = new Blob([cover]);
            const src = URL.createObjectURL(blob);
            setCoverArt(src);
        });
    }, [coverArt]);

    useEffect(() => {
        if (musicData == null) return;
        window.ipc.send("data.getCoverArt", { fileIds: [fileId] });
    }, [musicData]);

    useEffect(() => {
        const title = titleRef.current;
        const titleContext = titleContextRef.current;
        if (title == null || titleContext == null) return;

        const titleWidth = title.offsetWidth;
        const titleContextWidth = titleContext.offsetWidth;
        if (titleWidth < titleContextWidth) {
            titleContext.classList.add(style.marquee);
        } else {
            titleContext.classList.remove(style.marquee);
        }
    }, [musicData?.title]);

    return (
        <div className={style.container}>
            <span className={style.cover} style={{ backgroundImage: `url(${coverArt})` }} />
            <div className={style.infoWrapper}>
                <div className={style.titleWrapper}>
                    <div className={style.title} ref={titleRef}>
                        <span className={style.titleContext} ref={titleContextRef}>
                            {title}
                        </span>
                    </div>
                </div>
                <div className={style.artist}>{artist ? artist : "アーティスト情報はありません"}</div>
                <div className={style.album}>{album ? album : "アルバム情報はありません"}</div>
            </div>
        </div>
    );
};
