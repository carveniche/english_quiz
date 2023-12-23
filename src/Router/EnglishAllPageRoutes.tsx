import { Navigate, Route, Routes, useLocation } from "react-router";
import { getQueryParams } from "../utils/getQueryParams";
import Geogebra from "../components/FeatureComponent/Lesson/GeogebraLesson/Geogebra";
import { GGB, IFRAMENEWCODING, ROUTERKEYCONSTENGLISH } from "../constants";
import CodingNewIframe from "../components/FeatureComponent/Coding/CodingNew/CodingNewIframe";
import englishRouterConfig from "./EnglishRouterConfig";
export default function EnglishAllPageRoutes() {
  const params = getQueryParams();
  const { pathname } = useLocation();
  let y = `${ROUTERKEYCONSTENGLISH.englishmathzone}/:concept/:tag/:level`;

  return (
    <>
      {pathname === "/" && <Navigate to={`/allscreen?${params}`} />}
      <Routes>
        {englishRouterConfig.map((item) =>
          item.key === ROUTERKEYCONSTENGLISH.englishmathzone ? (
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
          ) : (
            <Route
              path={item.path}
              Component={item.component}
              key={item.key.toString()}
            ></Route>
          )
        )}
        <Route key={GGB.key} path={GGB.path} Component={Geogebra}></Route>
        <Route
          path={IFRAMENEWCODING.path}
          Component={CodingNewIframe}
          key={IFRAMENEWCODING.key}
        ></Route>
      </Routes>
    </>
  );
}
