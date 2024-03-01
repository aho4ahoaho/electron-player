import { Button, Flex, Slider } from "antd";
import { CaretRightFilled, PauseOutlined } from "@ant-design/icons";
import { useMemo, useState } from "react";
import style from "./style.module.scss";
export enum PlayerState {
    Playing,
    Paused,
}
export const Player = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [state, setState] = useState<PlayerState>(PlayerState.Playing);

    const CtrlBtn = useMemo(
        () => () => {
            switch (state) {
                case PlayerState.Paused:
                    return (
                        <Button type="default" shape="circle">
                            <PauseOutlined />
                        </Button>
                    );
                default:
                    return (
                        <Button type="default" shape="circle">
                            <CaretRightFilled />
                        </Button>
                    );
            }
        },
        [state]
    );

    return (
        <Flex className={style.playerContainer}>
            <CtrlBtn />
            <Flex style={{ alignItems: "center", flex: 1 }}>
                <Slider style={{ width: "100%" }} />
            </Flex>
        </Flex>
    );
};
