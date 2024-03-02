import { Layout, Menu, ConfigProvider } from "antd";
import { ItemType, MenuItemType } from "antd/es/menu/hooks/useItems";
import style from "./style.module.scss";
import { Page } from "@renderer/utils/pageState";
import { MainPageTab } from "@renderer/components/templates/MainPage";

const { Header: AntdHeader } = Layout;
export type HeaderTab = Page | MainPageTab;
type Props = {
    page: HeaderTab;
    setPage: (page: HeaderTab) => void;
    disabledItem?: {
        [key in HeaderTab]?: boolean;
    };
};
export const Header = ({ page, setPage, disabledItem }: Props) => {
    const items: Array<
        ItemType<MenuItemType> & {
            key: HeaderTab;
        }
    > = [
        {
            key: "Album",
            label: "Album",
            onClick: () => setPage("Album"),
            disabled: disabledItem?.Album,
        },
        {
            key: "Track",
            label: "Track",
            onClick: () => setPage("Track"),
            disabled: disabledItem?.Track,
        },
        {
            key: "NowPlaying",
            label: "NowPlaying",
            onClick: () => setPage("NowPlaying"),
            disabled: disabledItem?.NowPlaying,
        },
        {
            key: "Settings",
            label: "Settings",
            onClick: () => setPage("Settings"),
            disabled: disabledItem?.Settings,
        },
        {
            key: "About",
            label: "About",
            onClick: () => setPage("About"),
            disabled: disabledItem?.About,
        },
    ];

    return (
        <ConfigProvider>
            <AntdHeader className={style.header}>
                <img src="/images/logo.png" alt="logo" className={style.logo} />
                <Menu theme="dark" mode="horizontal" className={style.menu} selectedKeys={[page]} items={items}></Menu>
            </AntdHeader>
        </ConfigProvider>
    );
};
