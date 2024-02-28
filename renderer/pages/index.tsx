import { Button } from "antd";
import { useCallback, useEffect, useState } from "react";
import { Directory } from "../../main/components/file/dir";

const HomePage = () => {
  const [dirData, setDirData] = useState<Directory[]>([]);

  useEffect(() => {
    window.ipc.on("getDirs", (msg: Directory[]) => {
      setDirData(msg);
    });
  }, []);

  const onGet = useCallback(() => {
    window.ipc.send("getDirs", ["~/Music"]);
  }, []);

  return (
    <div>
      <h1>Home</h1>
      <Button onClick={onGet}>Get</Button>
      {dirData.map((d) => (
        <div key={d.currentPath}>{d.currentPath}</div>
      ))}
    </div>
  );
};
export default HomePage;
