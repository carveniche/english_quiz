import { Navigate, Route, Routes, useLocation } from "react-router";
import { getQueryParams } from "../utils/getQueryParams";
import routerConfig from "./RouterConfig";
export default function AllPageRoutes() {
  const params = getQueryParams();
  const { pathname } = useLocation();
  return (
    <>
      {pathname === "/" && <Navigate to={`/allScreen?${params}`} />}
      <Routes>
        {routerConfig.map((item) => (
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
