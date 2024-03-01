import { Button, ButtonProps, Flex, Slider } from "antd";
import { CaretRightFilled, PauseOutlined, StepBackwardOutlined, StepForwardOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import style from "./style.module.scss";
import { concatClassName } from "../../../utils/className";
import { formatTime } from "../../../utils/time";

import type { MusicData } from "@prisma/client";

export enum PlayerState {
    Playing,
    Paused,
}
export const Player = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [state, setState] = useState<PlayerState>(PlayerState.Paused);
    const [musicData, setMusicData] = useState<MusicData>();
    const [currentTime, setCurrentTime] = useState(0);

    useEffect(() => {
        window.ipc.on<MusicData>("player.metadata", (data) => {
            setMusicData(data);
        });
        window.ipc.on("player.play", () => {
            setState(PlayerState.Playing);
        });
        window.ipc.on("player.pause", () => {
            setState(PlayerState.Paused);
        });
        window.ipc.on("player.end", () => {
            setState(PlayerState.Paused);
        });
        window.ipc.on<number>("player.timeUpdate", (time) => {
            setCurrentTime(time);
        });
    }, []);

    const onSeek = useCallback((value: number) => {
        window.ipc.send("player.setTime", value);
    }, []);

    return (
        <Flex className={style.playerContainer}>
            <PrevBtn />
            <CtrlBtn
                state={state}
                style={{ fontSize: 32, width: 48, height: 48 }}
                onClick={() => {
                    window.ipc.send("player.toggle", PlayerState.Playing === state ? "pause" : "play");
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
                <Slider min={0} max={musicData?.duration} style={{ flex: 1 }} onChangeComplete={onSeek} />
            </Flex>
        </Flex>
    );
};

const CtrlBtn = (props: { state: PlayerState } & ButtonProps) => {
    const { state, className } = props;
    const btn = useMemo(() => {
        switch (state) {
            case PlayerState.Paused:
                return <CaretRightFilled />;
            default:
                return <PauseOutlined />;
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
