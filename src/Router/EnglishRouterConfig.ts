import Lesson from "../components/FeatureComponent/Lesson/Lesson";
import MyScreen from "../components/FeatureComponent/MyScreen/MyScreen";
import React from "react";
import { ROUTERKEYCONSTENGLISH } from "../constants";
import defaultRouter from "./defaultRouter";
import FlagQuestionMenu from "../components/FeatureComponent/FlagQuestion/FlagQuestionMenu";
import HomeWork from "../components/FeatureComponent/HomeWork/HomeWork";
import MainWhiteboard from "../components/FeatureComponent/Whiteboard/MainWhiteboard";
import EnglishQuiz from "../components/FeatureComponent/EnglishQuizZone/EnglishQuizZone";

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
const englishRouterConfig: routerConfig[] = [
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
    key: ROUTERKEYCONSTENGLISH.myScreen,
    exact: true,
    component: MyScreen,
    name: "My Screen",
    icon: "/menu-icon/Whiteboard.svg",
    hasChildren: false,
    hasSubRoute: false,
    subRoute: null,
  },

  {
    path: ROUTERKEYCONSTENGLISH.whiteboard.path,
    key: ROUTERKEYCONSTENGLISH.whiteboard.key,
    name: "Whiteboard",
    component: MainWhiteboard,
    exact: true,
    icon: "/menu-icon/Whiteboard.svg",
    hasChildren: false,
    hasSubRoute: false,
    subRoute: null,
  },
  {
    path: ROUTERKEYCONSTENGLISH.englishlesson,
    key: ROUTERKEYCONSTENGLISH.englishlesson,
    exact: true,
    component: Lesson,
    name: "English Lesson",
    icon: "/menu-icon/MathLessons.svg",
    hasChildren: false,
    hasSubRoute: false,
    subRoute: null,
  },
  {
    path: `${ROUTERKEYCONSTENGLISH.englishquizzone}`,
    key: ROUTERKEYCONSTENGLISH.englishquizzone,
    exact: true,
    component: EnglishQuiz,
    name: "English Zone",
    icon: "/menu-icon/MathQuiz.svg",
    hasChildren: true,
    hasSubRoute: false,
    subRoute: null,
  },

  // {
  //   path: "/miscellenous",
  //   component: null,
  //   key: ROUTERKEYCONSTENGLISH.miscellaneous.key,
  //   exact: true,
  //   name: "Miscellaneous",
  //   icon: "/menu-icon/Whiteboard.svg",
  //   hasChildren: false,
  //   hasSubRoute: true,
  //   subRoute: [
  //     {
  //       key: ROUTERKEYCONSTENGLISH.miscellaneous.subRoute.flagQuestion.keys,
  //       name: "Flagged Questions",
  //       path: ROUTERKEYCONSTENGLISH.miscellaneous.subRoute.flagQuestion.route,
  //       exact: true,
  //       icon: "/menu-icon/Whiteboard.svg",
  //       hasChildren: false,
  //       component: FlagQuestionMenu,
  //     },

  //     {
  //       key: ROUTERKEYCONSTENGLISH.miscellaneous.subRoute.homework.keys,
  //       name: "Homework",
  //       path: ROUTERKEYCONSTENGLISH.miscellaneous.subRoute.homework.route,
  //       exact: true,
  //       icon: "/menu-icon/Whiteboard.svg",
  //       hasChildren: false,
  //       component: HomeWork,
  //     },
  //   ],
  // },
];

export default englishRouterConfig;
