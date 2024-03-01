import { Button, ButtonProps, Flex, Slider } from "antd";
import { CaretRightFilled, PauseOutlined, StepBackwardOutlined, StepForwardOutlined } from "@ant-design/icons";
import { useMemo } from "react";
import style from "./style.module.scss";
import { concatClassName } from "@renderer/utils/className";
import { formatTime } from "@renderer/utils/time";
import { PlayerState } from "@main/components/music/player";

import { useAudioPlayer } from "@renderer/hooks/useAudioPlayer";

export const PlayerController = () => {
    const { state, currentTime, musicData, audioElmRef, controller } = useAudioPlayer();

    return (
        <>
            <Flex className={style.playerContainer}>
                <PrevBtn />
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
                <NextBtn />
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
                    />
                </Flex>
            </Flex>
            <div style={{ position: "fixed", right: 0, bottom: 0, opacity: 0.5, backgroundColor: "lightblue" }}>
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
