import { useState } from "react";
import { MainPage, useMainPage } from "@renderer/components/templates/MainPage";
import { Layout } from "antd";
import { Page } from "@renderer/utils/pageState";
import { Header } from "@renderer/components/molecules/Header";
import { PlayerController } from "@renderer/components/organisms/PlayerController";
import { SettingsPage } from "@renderer/components/templates/Settings";

const HomePage = () => {
    const [page, setPage] = useState<Page>("Home");

    const mainPageProps = useMainPage();
    return (
        <Layout>
            <Header page={page} setPage={setPage} />
            {page === "Home" && <MainPage {...mainPageProps} />}
            {page === "Settings" && <SettingsPage />}
            <PlayerController />
        </Layout>
    );
};
export default HomePage;
