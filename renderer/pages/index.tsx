import { Button } from "antd";
import { useCallback, useEffect, useState } from "react";
import type { Directory, MusicData } from "@prisma/client";

const HomePage = () => {
  const [dirData, setDirData] = useState<Directory[]>([]);
  const [musicData, setMusicData] = useState<MusicData[]>([]);

  useEffect(() => {
    window.ipc.on<Directory[]>("getDirs", (msg) => {
      setDirData(msg);
    });

    window.ipc.on<MusicData[]>("getMusicTable", (msg) => {
      console.log(msg);
      setMusicData(msg);
    });
  }, []);

  const onGet = useCallback(() => {
    window.ipc.send("getDirs", ["~/Music"]);
    window.ipc.send("getMusicTable", { targetDirPath: ["~/Music"], search: {} });
  }, []);

  return (
    <div>
      <h1>Home</h1>
      <Button onClick={onGet}>Get</Button>
      {dirData.map((d) => (
        <div key={d.currentPath}>{d.currentPath}</div>
      ))}
      {musicData.map((m) => (
        <div key={m.id}>{m.title}</div>
      ))}
    </div>
  );
};
export default HomePage;
