import { PlayerState } from "@main/components/music/player";
import { MusicData } from "@prisma/client";
import { debounce } from "@renderer/utils/debounce";
import { useEffect, useMemo, useRef, useState } from "react";

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
    const audioElmRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        window.ipc.on<MusicData>("player.metadata", (data) => {
            console.log("player.metadata", data);
            setMusicData(data);
        });
    }, []);

    useEffect(() => {
        const audioElement = audioElmRef.current;
        if (!audioElement) return;

        window.ipc.on<Buffer>("player.setFile", (buffer) => {
            console.log("player.setFile", buffer.length);
            audioElement.pause();
            if (audioElement.src) {
                URL.revokeObjectURL(audioElement.src);
            }
            const blob = new Blob([buffer], { type: "audio/mpeg" });
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
            controller.play();
        });

        const onEnded = () => {
            window.ipc.send("player.end", null);
        };
        audioElement.addEventListener("ended", onEnded);
        const onTimeUpdate = () => {
            setCurrentTime(audioElement.currentTime);
        };
        audioElement.addEventListener("timeupdate", onTimeUpdate);
    }, [audioElmRef]);

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
        seek: useMemo(() => {
            return debounce<number>((value) => {
                if (!audioElmRef.current) return;
                audioElmRef.current.currentTime = value;
            }, 50);
        }, [audioElmRef]),
    };

    return {
        currentTime,
        musicData,
        state,
        audioElmRef,
        controller,
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
