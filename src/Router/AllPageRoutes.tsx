import { Route, Routes } from "react-router";
import routerConfig from "./RouterConfig";
export default function AllPageRoutes() {
  return (
    <>
      <Routes>
        {routerConfig?.map((item) => (
          <Route
            path={item.path.toString()}
            Component={item.component}
            key={item.key.toString()}
          ></Route>
        ))}
      </Routes>
    </>
  );
}
