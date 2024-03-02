import { MusicData } from "@prisma/client";
import { QueueView, Props as QueueViewProps } from "@renderer/components/molecules/QueueView";
import { TrackView } from "@renderer/components/molecules/TrackInfo";
import { Flex } from "antd";

type Props = {
    nowPlaying: MusicData | null;
} & QueueViewProps;

export const NowPlaying = (props: Props) => {
    const { nowPlaying } = props;
    return (
        <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
            <Flex style={{ flex: 1, height: "100%" }}>
                <QueueView {...props} />
            </Flex>
            <Flex style={{ flex: 2 }}>
                <TrackView musicData={nowPlaying ?? undefined} />
            </Flex>
        </div>
    );
};
