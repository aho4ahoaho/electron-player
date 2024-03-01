import { useEffect, useState } from "react";
import type { MusicData } from "@prisma/client";
import { TrackList } from "@renderer/components/organisms/TrackList";
import { AlbumList } from "@renderer/components/organisms/AlbumList";
import { Menu } from "antd";
import { ItemType, MenuItemType } from "antd/es/menu/hooks/useItems";
import { staticController } from "@renderer/hooks/useAudioPlayer";

type Props = {
    musicData: MusicData[];
    albumData: AlbumData[];
    selectAlbum: (album?: string) => void;
    tab: MainPageTab;
    setTab: (tab: MainPageTab) => void;
    playlists: MusicData[];
    setPlaylists: (playlists: MusicData[]) => void;
    nowPlaying: MusicData | null;
    setNowPlaying: (nowPlaying: MusicData | null) => void;
};

export type AlbumData = {
    album: string;
    fileId: number;
};
export const MainPage = ({
    musicData,
    albumData,
    selectAlbum,
    tab,
    setTab,
    playlists,
    setPlaylists,
    nowPlaying,
}: Props) => {
    const items: Array<
        ItemType<MenuItemType> & {
            key: MainPageTab;
        }
    > = [
        {
            key: "Playlist",
            label: "Playlist",
            onClick: () => setTab("Playlist"),
        },
        {
            key: "Album",
            label: "Album",
            onClick: () => setTab("Album"),
        },
        {
            key: "Track",
            label: "Track",
            onClick: () => setTab("Track"),
        },
    ];

    return (
        <>
            <Menu items={items} selectedKeys={[tab]} mode="horizontal" style={{ width: "100%" }} />
            {tab === "Playlist" && <TrackList musicData={playlists} nowPlaying={nowPlaying ?? undefined} />}
            {tab === "Track" && (
                <TrackList
                    musicData={musicData}
                    selectTrack={(_, index) => {
                        const fileIds = musicData.map((d) => d.fileId);
                        fileIds.splice(0, index ?? 0);
                        staticController.setQueue(fileIds, true);
                        setPlaylists([...musicData]);
                        setTab("Playlist");
                    }}
                />
            )}
            {tab === "Album" && <AlbumList albumData={albumData} selectAlbum={selectAlbum} />}
        </>
    );
};

type MainPageTab = "Track" | "Album" | "Playlist";
export const useMainPage = (): Props => {
    const [tab, setTab] = useState<MainPageTab>("Album");
    const [musicData, setMusicData] = useState<MusicData[]>([]);
    const [albumData, setAlbumData] = useState<AlbumData[]>([]);
    const [playlists, setPlaylists] = useState<MusicData[]>([]);
    const [nowPlaying, setNowPlaying] = useState<MusicData | null>(null);

    useEffect(() => {
        window.ipc.on<MusicData[]>("data.getMusicTable", (msg) => {
            setMusicData(msg);
        });

        window.ipc.on<AlbumData[]>("data.getAlbumTable", (msg) => {
            setAlbumData(msg);
        });

        window.ipc.send("data.getAlbumTable", null);
    }, []);

    const selectAlbum = (album?: string) => {
        window.ipc.send("data.getMusicTable", { targetDirPath: ["~/Music"], search: { album } });
        setTab("Track");
    };

    return { musicData, albumData, selectAlbum, tab, setTab, playlists, setPlaylists, nowPlaying, setNowPlaying };
};
