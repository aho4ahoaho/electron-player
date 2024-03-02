import { useState } from "react";
import { MainPage, MainPageTab, useMainPage } from "@renderer/components/templates/MainPage";
import { Layout } from "antd";
import { Header, HeaderTab } from "@renderer/components/molecules/Header";
import { PlayerController } from "@renderer/components/organisms/PlayerController";
import { SettingsPage } from "@renderer/components/templates/Settings";
const MainPageKey: Array<MainPageTab | string> = ["NowPlaying", "Album", "Track"];
const HomePage = () => {
    const [page, setPage] = useState<HeaderTab>("Album");

    const mainPageProps = useMainPage();
    const { setNowPlaying, playlist, musicData } = mainPageProps;

    return (
        <Layout>
            <Header
                page={page}
                setPage={setPage}
                disabledItem={{
                    NowPlaying: playlist.length === 0,
                    Track: musicData.length === 0,
                }}
            />
            {MainPageKey.includes(page) && <MainPage {...mainPageProps} tab={page} setTab={setPage} />}
            {page === "Settings" && <SettingsPage />}
            <PlayerController setNowPlaying={setNowPlaying} />
        </Layout>
    );
};
export default HomePage;
