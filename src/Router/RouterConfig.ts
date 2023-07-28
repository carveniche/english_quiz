import Whiteboard from "../components/FeatureComponent/Whiteboard/Whiteboard";
import AllScreen from "../components/FeatureComponent/AllScreen/AllScreen";
import Coding from "../components/FeatureComponent/Coding/Coding";
import Lesson from "../components/FeatureComponent/Lesson/Lesson";
import Mathzone from "../components/FeatureComponent/Mathzone/Mathzone";
import MyScreen from "../components/FeatureComponent/MyScreen/MyScreen";
import React from "react";
import { ROUTERKEYCONST } from "../constants";
interface routerConfig {
  path: String;
  key: String;
  exact: Boolean;
  component: React.ComponentType;
  name: String;
  icon:String
}
const routerConfig: routerConfig[] = [
  {
    path: ROUTERKEYCONST.allScreen,
    key: ROUTERKEYCONST.allScreen,
    exact: true,
    component: AllScreen,
    name: "All Screen",
    icon:"/menu-icon/Whiteboard.svg"
  },
  {
    path: "/myscreen",
    key: ROUTERKEYCONST.myScreen,
    exact: true,
    component: MyScreen,
    name: "My Screen",
    icon:"/menu-icon/Whiteboard.svg"
  },
  {
    path: ROUTERKEYCONST.coding,
    key: ROUTERKEYCONST.coding,
    exact: true,
    component: Coding,
    name: "Coding",
    icon:"/menu-icon/Whiteboard.svg"
  },
  {
    path:ROUTERKEYCONST.mathzone,
    key: ROUTERKEYCONST.mathzone,
    exact: true,
    component: Mathzone,
    name: "Mathzone",
    icon:"/menu-icon/Whiteboard.svg"
  },
  {
    path: ROUTERKEYCONST.whiteboard,
    key: ROUTERKEYCONST.whiteboard,
    exact: true,
    component: Whiteboard,
    name: "Whiteboard",
    icon:"/menu-icon/Whiteboard.svg"
  },
  {
    path: ROUTERKEYCONST.lesson,
    key: ROUTERKEYCONST.lesson,
    exact: true,
    component: Lesson,
    name: "Lesson",
    icon:"/menu-icon/Whiteboard.svg"
  },
];
export default routerConfig;
