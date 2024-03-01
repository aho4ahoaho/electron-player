import { AlbumData } from "@renderer/components/templates/MainPage";
import { Flex } from "antd";
import style from "./style.module.scss";

type Props = {
    albumData: AlbumData[];
    selectAlbum: (album?: string) => void;
};

export const AlbumList = ({ albumData, selectAlbum }: Props) => {
    return (
        <Flex className={style.container}>
            <div
                className={style.items}
                onClick={() => {
                    selectAlbum(undefined);
                }}
            >
                <img className={style.album_art} src="https://via.placeholder.com/128" alt="" />
                <span className={style.title}>全ての楽曲</span>
            </div>
            {albumData.map(({ album }) => {
                const albumName = album == "" ? "無名のアルバム" : album;
                return (
                    <div
                        key={album}
                        className={style.items}
                        onClick={() => {
                            selectAlbum(album);
                        }}
                    >
                        <img className={style.album_art} src="https://via.placeholder.com/128" alt="" />
                        <span className={style.title}>{albumName}</span>
                    </div>
                );
            })}
        </Flex>
    );
};
