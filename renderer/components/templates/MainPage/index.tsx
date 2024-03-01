import { useEffect, useState } from "react";
import type { MusicData } from "@prisma/client";
import { TrackList } from "@renderer/components/organisms/TrackList";

type Props = {
    musicData: MusicData[];
};
export const MainPage = ({ musicData }: Props) => {
    return <TrackList musicData={musicData} />;
};

export const useMainPage = (): Props => {
    const [musicData, setMusicData] = useState<MusicData[]>([]);

    useEffect(() => {
        window.ipc.on<MusicData[]>("data.getMusicTable", (msg) => {
            setMusicData(msg);
        });

        window.ipc.send("data.getMusicTable", { targetDirPath: ["~/Music"], search: {} });
    }, []);
    return { musicData };
};
