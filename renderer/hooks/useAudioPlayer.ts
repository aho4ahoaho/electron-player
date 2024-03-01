import { PlayerState } from "@main/components/music/player";
import { MusicData } from "@prisma/client";
import { useEffect, useRef, useState } from "react";

export type AudioController = {
    play: () => void;
    pause: () => void;
    next: () => void;
    prev: () => void;
    setQueue: (fileIds: number[], play: boolean) => void;
    seek: (value: number) => void;
};

export const useAudioPlayer = () => {
    const [state, setState] = useState<PlayerState>("paused");
    const [musicData, setMusicData] = useState<MusicData>();
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(100);

    const audioElmRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        window.ipc.on<MusicData>("player.metadata", (data) => {
            setMusicData(data);
        });
    }, []);

    useEffect(() => {
        const audioElement = audioElmRef.current;
        if (!audioElement) return;
        audioElement.volume = volume / 100;
    }, [volume]);

    const prevSeekTimeRef = useRef<NodeJS.Timeout>();
    const controller: AudioController = {
        ...staticController,
        play: () => {
            audioElmRef.current?.play();
            setState("playing");
        },
        pause: () => {
            audioElmRef.current?.pause();
            setState("paused");
        },
        seek: (time: number) => {
            if (!audioElmRef.current) return;
            clearTimeout(prevSeekTimeRef.current);
            audioElmRef.current?.pause();
            audioElmRef.current.currentTime = time;
            prevSeekTimeRef.current = setTimeout(() => {
                audioElmRef.current?.play();
            }, 200);
        },
    };

    useEffect(() => {
        const audioElement = audioElmRef.current;
        if (!audioElement) return;

        window.ipc.on<Buffer>("player.setFile", (buffer) => {
            audioElement.pause();
            if (audioElement.src) {
                URL.revokeObjectURL(audioElement.src);
            }
            const blob = new Blob([buffer]);
            const url = URL.createObjectURL(blob);
            audioElement.src = url;
        });

        window.ipc.on("player.stop", () => {
            if (!audioElement.src) return;
            audioElement.pause();
            URL.revokeObjectURL(audioElement.src);
            audioElement.src = "";
        });

        window.ipc.on("player.play", () => {
            audioElement.addEventListener(
                "loadedmetadata",
                () => {
                    controller.play();
                },
                { once: true }
            );
        });

        const onEnded = () => {
            window.ipc.send("player.end", null);
        };
        audioElement.addEventListener("ended", onEnded);
        const onTimeUpdate = () => {
            setCurrentTime(audioElement.currentTime);
        };
        audioElement.addEventListener("timeupdate", onTimeUpdate);

        return () => {
            audioElement.removeEventListener("ended", onEnded);
            audioElement.removeEventListener("timeupdate", onTimeUpdate);
        };
    }, [audioElmRef, controller]);

    return {
        currentTime,
        musicData,
        state,
        audioElmRef,
        controller,
        volume,
        setVolume,
    };
};

export const staticController = {
    next: () => {
        window.ipc.send("player.next", null);
    },
    prev: () => {
        window.ipc.send("player.prev", null);
    },
    setQueue: (fileIds: number[], play: boolean) => {
        window.ipc.send("player.setQueue", { fileIds, play });
    },
};
