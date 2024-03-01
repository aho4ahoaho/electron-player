import { Layout } from "antd";
import { Header } from "../../molecules/Header";
import { Player } from "../../molecules/Player";
type Props = {
    children?: React.ReactNode;
};
export const BaseLayout = ({ children }: Props) => {
    return (
        <Layout>
            <Header />
            {children}
            <Player />
        </Layout>
    );
};
