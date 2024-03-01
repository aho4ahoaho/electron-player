import { Table } from "antd";
import { MusicData } from "@prisma/client";
import { formatTime } from "../../../utils/time";
import { formatDataSize } from "../../../utils/dataSize";
import style from "./style.module.scss";
import { concatClassName } from "@renderer/utils/className";

type Props = {
    musicData: MusicData[];
    selectTrack?: (record: MusicData, index: number) => void;
    nowPlaying?: MusicData;
};

const { Column } = Table;

export const TrackList = ({ musicData, selectTrack, nowPlaying }: Props) => {
    return (
        <Table
            dataSource={musicData.map((d) => ({ ...d, key: d.id }))}
            onRow={(record, index) => {
                const isNowPlaying = nowPlaying?.id === record.id;
                return {
                    className: concatClassName(style.row, isNowPlaying && style.nowPlaying),
                    onClick: () => {
                        selectTrack?.(record, index ?? 0);
                    },
                };
            }}
        >
            <Column
                title="No"
                dataIndex="trackNo"
                key="trackNo"
                render={(value) => <span className={style.center}>{value}</span>}
            />
            <Column title="Title" dataIndex="title" key="title" />
            <Column title="Artist" dataIndex="artist" key="artist" />
            <Column title="Album" dataIndex="album" key="album" />
            <Column title="Year" dataIndex="year" key="year" />
            <Column
                title="Duration"
                dataIndex="duration"
                key="duration"
                render={(value) => <span>{formatTime(value)}</span>}
            />
            <Column<MusicData>
                title="Format"
                dataIndex="codec"
                key="codec"
                render={(value, record) => (
                    <span>
                        {value} {formatDataSize(record.bitrate ?? 0, 0)}bps
                    </span>
                )}
            />
        </Table>
    );
};
