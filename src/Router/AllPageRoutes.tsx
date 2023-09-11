import { Navigate, Route, Routes, useLocation } from "react-router";
import { getQueryParams } from "../utils/getQueryParams";
import routerConfig from "./RouterConfig";
import { CICO, ROUTERKEYCONST } from "../constants";
export default function AllPageRoutes() {
  const params = getQueryParams();
  const { pathname } = useLocation();
  let y = `${ROUTERKEYCONST.mathzone}/:concept/:tag/:level`;
  const cicoDynamicRoute = `${CICO.path}/:cico_type`;
  return (
    <>
      {pathname === "/" && <Navigate to={`/allscreen?${params}`} />}
      <Routes>
        {routerConfig.map((item) =>
          item.key === "/mathzone" ? (
            <Route path={y} Component={item.component} key={item.key}></Route>
          ) : item.hasSubRoute ? (
            <Route key={item.key} path={item.path}>
              {item?.subRoute?.map((subRouteItem) => (
                <Route
                  key={`${subRouteItem?.key}`}
                  path={`${item.path}/${subRouteItem?.path}`}
                  Component={subRouteItem?.component}
                ></Route>
              ))}
            </Route>
          ) : item.key === CICO.key ? (
            <Route
              path={cicoDynamicRoute}
              Component={item.component}
              key={item.key}
            ></Route>
          ) : (
            <Route
              path={item.path}
              Component={item.component}
              key={item.key.toString()}
            ></Route>
          )
        )}
      </Routes>
    </>
  );
}
