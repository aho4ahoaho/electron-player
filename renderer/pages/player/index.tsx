import { useEffect, useRef } from "react";

const Player = () => {
    const audioElmRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const audioElement = audioElmRef.current;
        if (!audioElement) return;
        console.log("Player mounted");
        window.ipc.on<Buffer>("player.setFile", (buffer) => {
            audioElement.pause();
            if (audioElement.src) {
                URL.revokeObjectURL(audioElement.src);
            }
            const blob = new Blob([buffer], { type: "audio/mpeg" });
            const url = URL.createObjectURL(blob);
            audioElement.src = url;
        });

        window.ipc.on("player.play", () => {
            if (!audioElement.src) return;
            audioElement.play();
        });

        window.ipc.on("player.pause", () => {
            if (!audioElement.src) return;
            audioElement.pause();
        });

        window.ipc.on("player.end", () => {
            if (!audioElement.src) return;
            audioElement.pause();
            URL.revokeObjectURL(audioElement.src);
            audioElement.src = "";
        });

        window.ipc.on<number>("player.setTime", (time) => {
            if (!audioElement.src || !Number.isFinite(time)) return;
            console.log("setTime", time);
            audioElement.currentTime = time;
        });

        const onEnded = () => {
            window.ipc.send("player.end", null);
        };
        audioElement.addEventListener("ended", onEnded);
        const onTimeUpdate = () => {
            window.ipc.send("player.timeUpdate", audioElement.currentTime);
        };
        audioElement.addEventListener("timeupdate", onTimeUpdate);
    }, []);
    return (
        <div>
            <p>Player</p>
            <audio controls ref={audioElmRef} />
        </div>
    );
};

export default Player;
