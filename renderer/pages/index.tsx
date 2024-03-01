import { useEffect, useState } from "react";
import type { MusicData } from "@prisma/client";
import { BaseLayout } from "../components/templates/BaseLayout";
import { TrackList } from "../components/organisms/TrackList";

const HomePage = () => {
    const [musicData, setMusicData] = useState<MusicData[]>([]);

    useEffect(() => {
        window.ipc.on<MusicData[]>("getMusicTable", (msg) => {
            console.log(msg);
            setMusicData(msg);
        });

        window.ipc.send("getMusicTable", { targetDirPath: ["~/Music"], search: {} });
    }, []);

    return (
        <BaseLayout>
            <TrackList musicData={musicData} />
        </BaseLayout>
    );
};
export default HomePage;
