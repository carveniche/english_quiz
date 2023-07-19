import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router";
import { Route, Routes } from "react-router";
import { addToActiveTab } from "../redux/features/addActiveTabLink";
import routerConfig from "./RouterConfig";
export default function AllPageRoutes() {
  return (
    <>
      <Routes>
        {routerConfig?.map((item) => (
        
            <Route path={item.path.toString()} Component={item.component} key={item.key.toString()}></Route>
          
        ))}
      </Routes>
    </>
  );
}
