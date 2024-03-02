import { useEffect, useState } from "react";
import type { MusicData } from "@prisma/client";
import { TrackList } from "@renderer/components/organisms/TrackList";
import { AlbumList } from "@renderer/components/organisms/AlbumList";
import { Flex } from "antd";
import { staticController } from "@renderer/hooks/useAudioPlayer";
import { NowPlaying } from "@renderer/components/organisms/NowPlaying";
import { DummyPlayerController } from "@renderer/components/organisms/PlayerController/dummy";
import { HeaderTab } from "@renderer/components/molecules/Header";
import { getTargetDirPath } from "@renderer/components/organisms/FolderPicker";

type Props = {
    musicData: MusicData[];
    albumData: AlbumData[];
    tab: HeaderTab;
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
export const MainPage = ({ musicData, albumData, tab, setTab, playlist, setPlaylist, nowPlaying }: Props) => {
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

    const selectAlbum = (album?: string) => {
        const targetDirPath = getTargetDirPath();
        window.ipc.send("data.getMusicTable", { targetDirPath: targetDirPath, search: { album } });
        setTab("Track");
    };

    return (
        <>
            {tab === "NowPlaying" && (
                <Flex style={{ display: "flex", height: "calc(100vh - 64px)" }} vertical>
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

export type MainPageTab = "Track" | "Album" | "NowPlaying";
export const useMainPage = (): Omit<Props, "tab" | "setTab"> => {
    const [musicData, setMusicData] = useState<MusicData[]>([]);
    const [albumData, setAlbumData] = useState<AlbumData[]>([]);
    const [playlist, setPlaylist] = useState<MusicData[]>([]);
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

    return { musicData, albumData, playlist, setPlaylist, nowPlaying, setNowPlaying };
};
