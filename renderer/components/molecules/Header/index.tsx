import { Layout, Menu, ConfigProvider } from "antd";
import { ItemType, MenuItemType } from "antd/es/menu/hooks/useItems";
import Link from "next/link";
import { useEffect, useState } from "react";
import style from "./style.module.scss";

const { Header: AntdHeader } = Layout;
const items: ItemType<MenuItemType>[] = [
    {
        key: "home",
        label: <Link href="/">Home</Link>,
    },
    {
        key: "settings",
        label: <Link href="/settings">Settings</Link>,
    },
    {
        key: "about",
        label: <Link href="/about">About</Link>,
    },
];
export const Header = () => {
    const [current, setCurrent] = useState<string>();

    useEffect(() => {
        const path = window.location.pathname;
        const key = path === "/" ? "home" : path.replaceAll("/", "");
        setCurrent(key);
    }, []);

    return (
        <ConfigProvider>
            <AntdHeader className={style.header}>
                <img src="/images/logo.png" alt="logo" className={style.logo} />
                <Menu
                    theme="dark"
                    mode="horizontal"
                    className={style.menu}
                    selectedKeys={current ? [current] : undefined}
                    items={items}
                ></Menu>
            </AntdHeader>
        </ConfigProvider>
    );
};
