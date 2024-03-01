import { Button, ButtonProps, Flex, Slider } from "antd";
import { CaretRightFilled, PauseOutlined, StepBackwardOutlined, StepForwardOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import style from "./style.module.scss";
import { concatClassName } from "@renderer/utils/className";
import { formatTime } from "@renderer/utils/time";
import { PlayerState } from "@main/components/music/player";
import { debounce } from "@renderer/utils/debounce";

import type { MusicData } from "@prisma/client";

export const Player = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [state, setState] = useState<PlayerState>("stopped");
    const [musicData, setMusicData] = useState<MusicData>();
    const [currentTime, setCurrentTime] = useState(0);
    const seekDebounce = useMemo(
        () =>
            debounce<number>((value) => {
                window.ipc.send("player.setTime", value);
            }, 50),
        []
    );

    useEffect(() => {
        window.ipc.on<MusicData>("player.metadata", (data) => {
            console.log("player.metadata", data);
            setMusicData(data);
        });
        window.ipc.on("player.play", () => {
            setState("playing");
        });
        window.ipc.on("player.pause", () => {
            setState("paused");
        });
        window.ipc.on("player.end", () => {
            setState("stopped");
        });
        window.ipc.on<number>("player.timeUpdate", (time) => {
            setCurrentTime(time);
        });
    }, []);

    const onSeek = useCallback(
        (value: number) => {
            seekDebounce(value);
        },
        [seekDebounce]
    );

    return (
        <Flex className={style.playerContainer}>
            <PrevBtn />
            <CtrlBtn
                state={state}
                style={{ fontSize: 32, width: 48, height: 48 }}
                onClick={() => {
                    if (state === "playing") {
                        window.ipc.send("player.pause", null);
                    } else {
                        window.ipc.send("player.play", null);
                    }
                }}
            />
            <NextBtn />
            <Flex vertical style={{ flex: 1 }}>
                <Flex justify="space-between">
                    <span>{musicData?.title ?? "再生中の楽曲はありません"}</span>
                    <span>
                        {formatTime(currentTime)} / {formatTime(musicData?.duration)}
                    </span>
                </Flex>
                <Slider min={0} max={musicData?.duration} style={{ flex: 1 }} value={currentTime} onChange={onSeek} />
            </Flex>
        </Flex>
    );
};

const CtrlBtn = (props: { state: PlayerState } & ButtonProps) => {
    const { state, className } = props;
    const btn = useMemo(() => {
        switch (state) {
            case "playing":
                return <PauseOutlined />;
            default:
                return <CaretRightFilled />;
        }
    }, [state]);
    return (
        <Button {...props} type="default" shape="circle" className={concatClassName(className, style.large)}>
            {btn}
        </Button>
    );
};

const PrevBtn = (props: ButtonProps) => {
    return (
        <Button {...props} type="default" shape="circle">
            <StepBackwardOutlined />
        </Button>
    );
};

const NextBtn = (props: ButtonProps) => {
    return (
        <Button {...props} type="default" shape="circle">
            <StepForwardOutlined />
        </Button>
    );
};
