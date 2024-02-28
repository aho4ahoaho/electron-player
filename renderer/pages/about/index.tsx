import { version as antdVersion } from "antd";
const AboutPage = () => {
  return (
    <div>
      <h1>About Page</h1>
      <p>This application is using Electron {process.versions.electron}</p>
      <p>Chrome version: {process.versions.chrome}</p>
      <p>Ant Design version: {antdVersion}</p>
    </div>
  );
};

export default AboutPage;
