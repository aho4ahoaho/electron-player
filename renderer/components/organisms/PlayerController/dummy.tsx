import { CSSProperties } from "react";
import style from "./style.module.scss";

type Props = {
    style?: CSSProperties;
};
export const DummyPlayerController = ({ style: inlineStyle }: Props) => {
    return <div className={style.playerContainer} style={{ ...inlineStyle, position: "initial" }}></div>;
};
