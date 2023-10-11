import Coding from "../components/FeatureComponent/Coding/Coding";
import Lesson from "../components/FeatureComponent/Lesson/Lesson";
import Mathzone from "../components/FeatureComponent/Mathzone/mathzone";
import MyScreen from "../components/FeatureComponent/MyScreen/MyScreen";
import MathVideoLesson from "../components/FeatureComponent/MathVideoLesson/MathVideoLesson";
import React from "react";
import { CICO, ROUTERKEYCONST } from "../constants";
import defaultRouter from "./defaultRouter";
import FlagQuestionMenu from "../components/FeatureComponent/FlagQuestion/FlagQuestionMenu";
import HomeWork from "../components/FeatureComponent/HomeWork/HomeWork";
import SpeedMath from "../components/FeatureComponent/SpeedMath/SpeedMathHome";
import MainCico from "../components/FeatureComponent/CICO/MainCico";

import Whiteboard from "../components/FeatureComponent/Whiteboard/Whiteboard";
import UploadResources from "../components/UploadResources/UploadResources";
interface routerConfig {
  path: string;
  key: string;
  exact: Boolean;
  component: React.ComponentType | null;
  name: string;
  icon: string;
  hasChildren: Boolean | null;
  hasSubRoute: Boolean | null;
  subRoute: Object | null;
}
const routerConfig: routerConfig[] = [
  {
    path: ROUTERKEYCONST.whiteboard.path,
    key: ROUTERKEYCONST.whiteboard.key,
    name: "Whiteboard",
    component: Whiteboard,
    exact: true,
    icon: "/menu-icon/Whiteboard.svg",
    hasChildren: false,
    hasSubRoute: false,
    subRoute: null,
  },
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
    path: ROUTERKEYCONST.lesson,
    key: ROUTERKEYCONST.lesson,
    exact: true,
    component: Lesson,
    name: "Math Lesson",
    icon: "/menu-icon/MathLessons.svg",
    hasChildren: false,
    hasSubRoute: false,
    subRoute: null,
  },

  {
    path: "/mathvideolesson",
    key: ROUTERKEYCONST.mathvideolesson,
    exact: true,
    component: MathVideoLesson,
    name: "Math videos",
    icon: "/menu-icon/MathVideoLessons.svg",
    hasChildren: false,
    hasSubRoute: false,
    subRoute: null,
  },

  {
    path: "/speedmath",
    key: ROUTERKEYCONST.speedmath,
    exact: true,
    component: SpeedMath,
    name: "Speed Math",
    icon: "/menu-icon/SpeedMathIcon.svg",
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
    icon: "/menu-icon/MathQuiz.svg",
    hasChildren: true,
    hasSubRoute: false,
    subRoute: null,
  },

  {
    path: ROUTERKEYCONST.coding,
    key: ROUTERKEYCONST.coding,
    exact: true,
    component: Coding,
    name: "Coding",
    icon: "/menu-icon/CodingIcon.svg",
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
        name: "Flagged Question",
        path: ROUTERKEYCONST.miscellaneous.subRoute.flagQuestion.route,
        exact: true,
        icon: "/menu-icon/Whiteboard.svg",
        hasChildren: false,
        component: FlagQuestionMenu,
      },

      {
        key: ROUTERKEYCONST.miscellaneous.subRoute.homework.keys,
        name: "HomeWork",
        path: ROUTERKEYCONST.miscellaneous.subRoute.homework.route,
        exact: true,
        icon: "/menu-icon/Whiteboard.svg",
        hasChildren: false,
        component: HomeWork,
      },
    ],
  },
  {
    path: CICO.path,
    key: CICO.key,
    exact: true,
    component: MainCico,
    name: "CICO",
    icon: "/menu-icon/Whiteboard.svg",
    hasChildren: false,
    hasSubRoute: false,
    subRoute: null,
  },
];
export default routerConfig;
