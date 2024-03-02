import { MusicData } from "@prisma/client";
import { concatClassName } from "@renderer/utils/className";
import { Table } from "antd";
import style from "./style.module.scss";
import { formatTime } from "@renderer/utils/time";

export type Props = {
    playlist: MusicData[];
    nowPlaying: MusicData | null;
    selectTrack: (record: MusicData, index: number) => void;
};

const { Column } = Table;

export const QueueView = ({ playlist, nowPlaying, selectTrack }: Props) => {
    return (
        <Table
            dataSource={playlist.map((d) => ({ ...d, key: d.id }))}
            onRow={(record, index) => {
                const isNowPlaying = nowPlaying?.id === record.id;
                return {
                    className: concatClassName(style.row, isNowPlaying && style.nowPlaying),
                    onClick: () => {
                        selectTrack?.(record, index ?? 0);
                    },
                };
            }}
            style={{ width: "100%", height: "100%", overflow: "auto" }}
            pagination={false}
        >
            <Column title="No" dataIndex="trackNo" key="trackNo" className={style.center} />
            <Column title="Title" dataIndex="title" key="title" />
            <Column
                title="Duration"
                dataIndex="duration"
                key="duration"
                render={(value) => <span>{formatTime(value)}</span>}
            />
        </Table>
    );
};
