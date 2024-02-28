import { Button } from "antd";
import { useRouter } from "next/router";

const HomePage = () => {
  const router = useRouter();
  return (
    <div>
      <h1>Home</h1>
      <Button
        onClick={() => {
          router.push("/settings");
        }}
      >
        Setting
      </Button>
      <Button
        onClick={() => {
          router.push("/about");
        }}
      >
        About
      </Button>
    </div>
  );
};
export default HomePage;
