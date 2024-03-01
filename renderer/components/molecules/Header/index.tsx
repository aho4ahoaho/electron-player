import { Layout, Menu, ConfigProvider } from "antd";
import { ItemType, MenuItemType } from "antd/es/menu/hooks/useItems";
import style from "./style.module.scss";
import { Page } from "@renderer/utils/pageState";

const { Header: AntdHeader } = Layout;

type Props = {
    page: Page;
    setPage: (page: Page) => void;
};
export const Header = ({ page, setPage }: Props) => {
    const items: Array<
        ItemType<MenuItemType> & {
            key: Page;
        }
    > = [
        {
            key: "Home",
            label: "Home",
            onClick: () => setPage("Home"),
        },
        {
            key: "Settings",
            label: "Settings",
            onClick: () => setPage("Settings"),
        },
        {
            key: "About",
            label: "About",
            onClick: () => setPage("About"),
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
