import Whiteboard from "../components/FeatureComponent/Whiteboard/Whiteboard";
import Coding from "../components/FeatureComponent/Coding/Coding";
import Lesson from "../components/FeatureComponent/Lesson/Lesson";
import Mathzone from "../components/FeatureComponent/Mathzone/mathzone";
import MyScreen from "../components/FeatureComponent/MyScreen/MyScreen";
import MathVideoLesson from "../components/FeatureComponent/MathVideoLesson/MathVideoLesson";
import React from "react";
import { ROUTERKEYCONST } from "../constants";
import defaultRouter from "./defaultRouter";
import FlagQuestionMenu from "../components/FeatureComponent/FlagQuestion/FlagQuestionMenu";
interface routerConfig {
  path: string;
  key: string;
  exact: Boolean;
  component: React.ComponentType | null;
  name: String;
  icon: String;
  hasChildren: Boolean | null;
  hasSubRoute: Boolean | null;
  subRoute: Object | null;
}
const routerConfig: routerConfig[] = [
  {
    path: defaultRouter.path,
    key: defaultRouter.key,
    exact: true,
    component: () => "",
    name: "All Screen",
    icon: "/menu-icon/Whiteboard.svg",
    hasChildren: false,
    hasSubRoute: false,
    subRoute: null,
  },
  {
    path: "/myscreen",
    key: ROUTERKEYCONST.myScreen,
    exact: true,
    component: MyScreen,
    name: "My Screen",
    icon: "/menu-icon/Whiteboard.svg",
    hasChildren: false,
    hasSubRoute: false,
    subRoute: null,
  },

  {
    path: "/mathvideolesson",
    key: ROUTERKEYCONST.mathvideolesson,
    exact: true,
    component: MathVideoLesson,
    name: "Play Video",
    icon: "/menu-icon/Whiteboard.svg",
    hasChildren: false,
    hasSubRoute: false,
    subRoute: null,
  },
  {
    path: ROUTERKEYCONST.coding,
    key: ROUTERKEYCONST.coding,
    exact: true,
    component: Coding,
    name: "Coding",
    icon: "/menu-icon/Whiteboard.svg",
    hasChildren: false,
    hasSubRoute: false,
    subRoute: null,
  },
  {
    path: `${ROUTERKEYCONST.mathzone}`,
    key: ROUTERKEYCONST.mathzone,
    exact: true,
    component: Mathzone,
    name: "Mathzone",
    icon: "/menu-icon/Whiteboard.svg",
    hasChildren: true,
    hasSubRoute: false,
    subRoute: null,
  },
  {
    path: ROUTERKEYCONST.whiteboard,
    key: ROUTERKEYCONST.whiteboard,
    exact: true,
    component: Whiteboard,
    name: "Whiteboard",
    icon: "/menu-icon/Whiteboard.svg",
    hasChildren: false,
    hasSubRoute: false,
    subRoute: null,
  },
  {
    path: ROUTERKEYCONST.lesson,
    key: ROUTERKEYCONST.lesson,
    exact: true,
    component: Lesson,
    name: "Lesson",
    icon: "/menu-icon/Whiteboard.svg",
    hasChildren: false,
    hasSubRoute: false,
    subRoute: null,
  },
  {
    path: "/miscellenous",
    component: null,
    key: ROUTERKEYCONST.miscellaneous.key,
    exact: true,
    name: "Miscellenous",
    icon: "/menu-icon/Whiteboard.svg",
    hasChildren: false,
    hasSubRoute: true,
    subRoute: [
      {
        key: ROUTERKEYCONST.miscellaneous.subRoute.flagQuestion.keys,
        name: "Flag Question",
        path: ROUTERKEYCONST.miscellaneous.subRoute.flagQuestion.route,
        exact: true,
        icon: "/menu-icon/Whiteboard.svg",
        hasChildren: false,
        component: FlagQuestionMenu,
      },
    ],
  },
];
export default routerConfig;
