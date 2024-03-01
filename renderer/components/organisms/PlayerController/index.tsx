import { Button, ButtonProps, Dropdown, Flex, MenuProps, Slider } from "antd";
import {
    CaretRightFilled,
    MutedFilled,
    PauseOutlined,
    StepBackwardOutlined,
    StepForwardOutlined,
} from "@ant-design/icons";
import { useEffect, useMemo } from "react";
import style from "./style.module.scss";
import { concatClassName } from "@renderer/utils/className";
import { formatTime } from "@renderer/utils/time";
import { PlayerState } from "@main/components/music/player";

import { useAudioPlayer } from "@renderer/hooks/useAudioPlayer";
import { MusicData } from "@prisma/client";

type Props = {
    setNowPlaying?: (nowPlaying: MusicData | null) => void;
};
export const PlayerController = ({ setNowPlaying }: Props) => {
    const { state, currentTime, musicData, audioElmRef, controller, volume, setVolume } = useAudioPlayer();

    useEffect(() => {
        setNowPlaying?.(musicData ?? null);
    }, [musicData]);

    return (
        <>
            <Flex className={style.playerContainer}>
                <PrevBtn onClick={controller.prev} />
                <CtrlBtn
                    state={state}
                    style={{ fontSize: 32, width: 48, height: 48 }}
                    onClick={() => {
                        if (state === "playing") {
                            controller.pause();
                        } else {
                            controller.play();
                        }
                    }}
                />
                <NextBtn onClick={controller.next} />
                <Flex vertical style={{ flex: 1 }}>
                    <Flex justify="space-between">
                        <span>{musicData?.title ?? "再生中の楽曲はありません"}</span>
                        <span>
                            {formatTime(currentTime)} / {formatTime(musicData?.duration)}
                        </span>
                    </Flex>
                    <Slider
                        min={0}
                        max={musicData?.duration}
                        style={{ flex: 1 }}
                        value={currentTime}
                        onChange={controller.seek}
                        tooltip={{ formatter: (value) => formatTime(value) }}
                    />
                </Flex>
                <VolumeSlider volume={volume} setVolume={setVolume} />
            </Flex>

            <div
                style={{
                    position: "fixed",
                    right: 0,
                    bottom: 0,
                    opacity: 0.5,
                    backgroundColor: "lightblue",
                    display: "none",
                }}
            >
                <p>Player</p>
                <audio controls ref={audioElmRef} />
            </div>
        </>
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

const VolumeSlider = ({ volume, setVolume }: { volume: number; setVolume: (vol: number) => void }) => {
    const items: MenuProps["items"] = [
        {
            key: "1",
            label: <Slider style={{ width: 128 }} onChange={setVolume} value={volume} />,
        },
    ];
    return (
        <Dropdown menu={{ items }}>
            <MutedFilled />
        </Dropdown>
    );
};
