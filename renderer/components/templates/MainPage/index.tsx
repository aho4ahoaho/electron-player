import { useEffect, useState } from "react";
import type { MusicData } from "@prisma/client";
import { TrackList } from "@renderer/components/organisms/TrackList";
import { AlbumList } from "@renderer/components/organisms/AlbumList";
import { Flex, Menu } from "antd";
import { ItemType, MenuItemType } from "antd/es/menu/hooks/useItems";
import { staticController } from "@renderer/hooks/useAudioPlayer";
import { NowPlaying } from "@renderer/components/organisms/NowPlaying";
import { DummyPlayerController } from "@renderer/components/organisms/PlayerController/dummy";

type Props = {
    musicData: MusicData[];
    albumData: AlbumData[];
    selectAlbum: (album?: string) => void;
    tab: MainPageTab;
    setTab: (tab: MainPageTab) => void;
    playlist: MusicData[];
    setPlaylist: (playlist: MusicData[]) => void;
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
    playlist,
    setPlaylist,
    nowPlaying,
}: Props) => {
    const items: Array<
        ItemType<MenuItemType> & {
            key: MainPageTab;
        }
    > = [
        {
            key: "NowPlaying",
            label: "NowPlaying",
            onClick: () => setTab("NowPlaying"),
            disabled: playlist.length === 0,
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
            disabled: musicData.length === 0,
        },
    ];

    const selectTrack = (record: MusicData, index: number) => {
        const fileIds = musicData.map((d) => d.fileId);
        fileIds.splice(0, index);
        staticController.setQueue(fileIds);
        setPlaylist([...musicData]);
        setTab("NowPlaying");
    };

    const selectPlaylistTrack = (_record: MusicData, index: number) => {
        const fileIds = playlist.map((d) => d.fileId);
        fileIds.splice(0, index);
        staticController.setQueue(fileIds);
    };

    return (
        <>
            <Menu items={items} selectedKeys={[tab]} mode="horizontal" style={{ width: "100%" }} />
            {tab === "NowPlaying" && (
                <Flex style={{ display: "flex", height: "calc(100vh - 64px - 46px)" }} vertical>
                    <NowPlaying playlist={playlist} nowPlaying={nowPlaying} selectTrack={selectPlaylistTrack} />
                    <DummyPlayerController style={{ flexShrink: 0, flexGrow: 0 }} />
                </Flex>
            )}
            {tab === "Track" && (
                <>
                    <TrackList musicData={musicData} selectTrack={selectTrack} />
                    <DummyPlayerController />
                </>
            )}
            {tab === "Album" && (
                <>
                    <AlbumList albumData={albumData} selectAlbum={selectAlbum} />
                    <DummyPlayerController />
                </>
            )}
        </>
    );
};

type MainPageTab = "Track" | "Album" | "NowPlaying";
export const useMainPage = (): Props => {
    const [tab, setTab] = useState<MainPageTab>("Album");
    const [musicData, setMusicData] = useState<MusicData[]>([]);
    const [albumData, setAlbumData] = useState<AlbumData[]>([]);
    const [playlist, setPlaylist] = useState<MusicData[]>([]);
    const [nowPlaying, setNowPlaying] = useState<MusicData | null>(null);

    useEffect(() => {
        window.ipc.on<MusicData[]>("data.getMusicTable", (msg) => {
            setMusicData(msg);
        });

        window.ipc.on<MusicData[]>("data.rescanMusicTable", (msg) => {
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

    return { musicData, albumData, selectAlbum, tab, setTab, playlist, setPlaylist, nowPlaying, setNowPlaying };
};
