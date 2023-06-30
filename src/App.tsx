import { useEffect } from "react";
import "./index.css";

import { getDeviceInfo } from "./utils/permission";

function App() {
  useEffect(() => {
    initialPermissionsTaking();
  }, []);

  const initialPermissionsTaking = async () => {
    let permission = await getDeviceInfo().catch((err) => {
      console.log("error", err);
    });

    console.log("permission", permission);
  };

  return <div></div>;
}

export default App;
