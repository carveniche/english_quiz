import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import {
  ActiveTabParams,
  addToActiveTab,
} from "../../redux/features/addActiveTabLink";

import routerConfig from "../../Router/RouterConfig";
import useVideoContext from "../../hooks/useVideoContext/useVideoContext";
import { getQueryParams } from "../../utils/getQueryParams";
import TabIcon from "./TabIcon";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { CICO, LESSON, IFRAMENEWCODING, ROUTERKEYCONST } from "../../constants";
import MathzoneNavbar from "./MathzoneNavbarMenu";
import MathVideoLessonNavbar from "./MathVideoNavbarMenu";
import MathLessonNavbarMenu from "./MathLessonNavbarMenu";
import SpeedMathNavbarMenu from "./SpeedMathNavbarMenu";
import { useEffect, useState } from "react";
import MiscelleneousNavbar from "./MiscelleneousNavbar";
import CicoNavbar from "./CicoNavbar";
import {
  old_ClassType,
  math_ClassType,
  coding_ClassType,
  mathCoding_ClassType,
} from "../../utils/classTypesMenus";
import { resetWhiteBoardData } from "../../redux/features/ComponentLevelDataReducer";
import { isGradeAllowed } from "../../utils/isGradeAllowed";

export default function Navbar({ onClick }: { onClick: Function }) {
  const { allConceptsDetails } = useSelector(
    (state: RootState) => state.liveClassConceptDetails
  );
  const { class_type, demo, group_class, grade } = useSelector(
    (state: RootState) => state.videoCallTokenData
  );

  const [currentSelectedMenuIndex, setCurrentSelectedMenuIndex] = useState(-1);
  const [mathzoneKeys, setMathzoneKeys] = useState(0);
  const queryParams = getQueryParams();
  const { room } = useVideoContext();
  const dispatch = useDispatch();

  useEffect(() => {
    if (routerConfig.length > 0) {
      filterMenuByClassType();
    }
  }, []);

  const filterMenuByClassType = () => {
    let finalArr = [];

    for (let i = 0; i < routerConfig.length; i++) {
      if (class_type === "math_coding") {
        if (mathCoding_ClassType.includes(routerConfig[i].key)) {
          finalArr.push(routerConfig[i]);
        }
      } else if (class_type === "coding") {
        if (coding_ClassType.includes(routerConfig[i].key)) {
          finalArr.push(routerConfig[i]);
        }
      } else if (class_type === "math") {
        if (math_ClassType.includes(routerConfig[i].key)) {
          finalArr.push(routerConfig[i]);
        }
      } else {
        if (old_ClassType.includes(routerConfig[i].key)) {
          finalArr.push(routerConfig[i]);
        }
      }
    }
    let isCicoAllowed = isGradeAllowed(grade.toString());
    if (demo || group_class || !isCicoAllowed) {
      finalArr = finalArr.filter((item) => item.key !== CICO.key);
    }
    if (demo) {
      finalArr = finalArr.filter(
        (item) => item.key !== ROUTERKEYCONST.miscellaneous.key
      );
    }
    return finalArr;
  };

  const filterRouterConfig = filterMenuByClassType();

  const handleClickMathVideoLesson = ({
    path,
    key,
    name,
    icon,
    extraParams,
  }: ActiveTabParams) => {
    dispatch(addToActiveTab({ path, key, name, icon, extraParams }));
    typeof onClick === "function" && onClick();
    const [localDataTrackPublication] = [
      ...room!.localParticipant.dataTracks.values(),
    ];
    let DataTrackObj = {
      pathName: path,
      key,
      name,
      icon,
      extraParams,
      value: {
        datatrackName: "PlayVideo",
        identity: null,
      },
    };

    console.log("Data message send");
    localDataTrackPublication.track.send(JSON.stringify(DataTrackObj));
  };

  const handleClickSpeedMath = ({
    path,
    key,
    name,
    icon,
    extraParams,
  }: ActiveTabParams) => {
    dispatch(addToActiveTab({ path, key, name, icon, extraParams }));
    typeof onClick === "function" && onClick();
    const [localDataTrackPublication] = [
      ...room!.localParticipant.dataTracks.values(),
    ];
    let DataTrackObj = {
      pathName: path,
      key,
      name,
      icon,
      extraParams,
      value: {
        datatrackName: "SpeedMath",
        identity: null,
      },
    };

    console.log("Data message send");
    localDataTrackPublication.track.send(JSON.stringify(DataTrackObj));
  };

  const handleClickMathLesson = ({
    path,
    key,
    name,
    icon,
    extraParams,
  }: ActiveTabParams) => {
    dispatch(
      resetWhiteBoardData({ dataTrackKey: LESSON.lessonWhiteBoardData })
    );
    dispatch(addToActiveTab({ path, key, name, icon, extraParams }));

    typeof onClick === "function" && onClick();
    const [localDataTrackPublication] = [
      ...room!.localParticipant.dataTracks.values(),
    ];
    let DataTrackObj = {
      pathName: path,
      key,
      name,
      icon,
      extraParams,
      value: {
        datatrackName: "MathLesson",
        identity: null,
        dataTrackKey: LESSON.lessonWhiteBoardData,
        isReset: true,
      },
    };

    console.log("Data message send");
    localDataTrackPublication.track.send(JSON.stringify(DataTrackObj));
  };

  const handleClick = ({
    path,
    key,
    name,
    icon,
    extraParams,
  }: ActiveTabParams) => {
    dispatch(addToActiveTab({ path, key, name, icon, extraParams }));
    typeof onClick === "function" && onClick();
    const [localDataTrackPublication] = [
      ...room!.localParticipant.dataTracks.values(),
    ];
    if (key === IFRAMENEWCODING.key) {
      return;
    }
    let DataTrackObj = {
      pathName: path,
      key,
      name,
      icon,
      extraParams,

      value: {
        type: "addFromActiveTab",
        identity: null,
      },
    };

    console.log("Data message send");
    localDataTrackPublication.track.send(JSON.stringify(DataTrackObj));

    //send datatrack
  };

  const handleOpenSubMenu = (index: number) => {
    if (index === 3 && currentSelectedMenuIndex === 3) {
      setMathzoneKeys(Number(!mathzoneKeys));
    }
    setCurrentSelectedMenuIndex(index);
  };
  return (
    <>
      <ul
        className="bg-header-black text-white transform group-hover:scale-100 absolute 
      transition duration-150 ease-in-out origin-top flex min-w-[260px] flex-col min-h-[48px] items-center"
      >
        {true &&
          filterRouterConfig.map((item, index) => {
            return item.key === ROUTERKEYCONST.mathzone ? (
              <li
                className="rounded-sm px-3 pl-6 pr-3 py-3 hover:bg-black w-full flex gap-2 relative bg-red"
                onClick={() => handleOpenSubMenu(index)}
                style={{ cursor: "pointer" }}
                key={index}
              >
                <div className={"w-48"} style={{ display: "block" }}>
                  <div className="flex gap-2">
                    <TabIcon src={item.icon} />
                    <div> {item.name}</div>
                  </div>
                </div>
                <TabIcon src={"/menu-icon/chevron.svg"} />
                {index === currentSelectedMenuIndex && (
                  <MathzoneNavbar
                    allConceptsDetails={allConceptsDetails}
                    item={{ ...item, extraParams: {} }}
                    key={`mathzone-${mathzoneKeys}`}
                    handleClick={handleClick}
                    queryParams={queryParams}
                    calcWidth={44.01}
                    elementPosition={index + 1}
                    handleOpenSubMenu={handleOpenSubMenu}
                    currentSelectedMenuIndex={currentSelectedMenuIndex}
                  />
                )}
              </li>
            ) : item.key === CICO.key ? (
              <li
                className="rounded-sm px-3 pl-6 pr-3 py-3 hover:bg-black w-full flex gap-2 relative bg-red"
                onClick={() => handleOpenSubMenu(index)}
                style={{ cursor: "pointer" }}
                key={index}
              >
                <div className={"w-48"} style={{ display: "block" }}>
                  <div className="flex gap-2">
                    <TabIcon src={item.icon} />
                    <div> {item.name}</div>
                  </div>
                </div>
                <TabIcon src={"/menu-icon/chevron.svg"} />
                {index === currentSelectedMenuIndex && (
                  <CicoNavbar
                    allConceptsDetails={allConceptsDetails}
                    item={{ ...item, extraParams: {} }}
                    key={`cico-${mathzoneKeys}`}
                    handleClick={handleClick}
                    queryParams={queryParams}
                    calcWidth={44.01}
                    elementPosition={index + 1}
                    handleOpenSubMenu={handleOpenSubMenu}
                    currentSelectedMenuIndex={currentSelectedMenuIndex}
                  />
                )}
              </li>
            ) : item.key === ROUTERKEYCONST.miscellaneous.key ? (
              <li
                className="rounded-sm px-3 pl-6 pr-3 py-3 hover:bg-black w-full flex gap-2 relative bg-red"
                onClick={() => handleOpenSubMenu(index)}
                style={{ cursor: "pointer" }}
                key={index}
              >
                <div className={"w-48"} style={{ display: "block" }}>
                  <div className="flex gap-2">
                    <TabIcon src={item.icon} />
                    <div> {item.name}</div>
                  </div>
                </div>
                <TabIcon src={"/menu-icon/chevron.svg"} />
                {index === currentSelectedMenuIndex && (
                  <MiscelleneousNavbar
                    handleClick={handleClick}
                    handleOpenSubMenu={handleOpenSubMenu}
                    item={item}
                    index={index}
                    queryParams={queryParams}
                    calcWidth={44.01}
                    elementPosition={index + 1}
                    key={`miscellaneous-${index}`}
                  />
                )}
              </li>
            ) : item.key === ROUTERKEYCONST.mathvideolesson ? (
              <li
                className="rounded-sm px-3 pl-6 pr-3 py-3 hover:bg-black w-full flex gap-2 relative bg-red"
                onClick={() => handleOpenSubMenu(index)}
                style={{ cursor: "pointer" }}
                key={index}
              >
                <div className={"w-48"} style={{ display: "block" }}>
                  <div className="flex gap-2">
                    <TabIcon src={item.icon} />
                    <div> {item.name}</div>
                  </div>
                </div>
                <TabIcon src={"/menu-icon/chevron.svg"} />
                {index === currentSelectedMenuIndex && (
                  <MathVideoLessonNavbar
                    allConceptsDetails={allConceptsDetails}
                    item={{ ...item, extraParams: {} }}
                    key={`mathvideolesson-${mathzoneKeys}`}
                    handleClickMathVideoLesson={handleClickMathVideoLesson}
                    queryParams={queryParams}
                    calcWidth={44.01}
                    elementPosition={index + 1}
                    handleOpenSubMenu={handleOpenSubMenu}
                    currentSelectedMenuIndex={currentSelectedMenuIndex}
                  />
                )}
              </li>
            ) : item.key === ROUTERKEYCONST.speedmath ? (
              <li
                className="rounded-sm px-3 pl-6 pr-3 py-3 hover:bg-black w-full flex gap-2 relative bg-red"
                onClick={() => handleOpenSubMenu(index)}
                style={{ cursor: "pointer" }}
                key={index}
              >
                <div className={"w-48"} style={{ display: "block" }}>
                  <div className="flex gap-2">
                    <TabIcon src={item.icon} />
                    <div> {item.name}</div>
                  </div>
                </div>
                <TabIcon src={"/menu-icon/chevron.svg"} />
                {index === currentSelectedMenuIndex && (
                  <SpeedMathNavbarMenu
                    item={{ ...item, extraParams: {} }}
                    key={`speedmath-${mathzoneKeys}`}
                    handleClickSpeedMath={handleClickSpeedMath}
                    queryParams={queryParams}
                    calcWidth={44.01}
                    elementPosition={index + 1}
                    handleOpenSubMenu={handleOpenSubMenu}
                    currentSelectedMenuIndex={currentSelectedMenuIndex}
                  />
                )}
              </li>
            ) : item.key === ROUTERKEYCONST.lesson ? (
              <li
                className="rounded-sm px-3 pl-6 pr-3 py-3 hover:bg-black w-full flex gap-2 relative bg-red"
                onClick={() => handleOpenSubMenu(index)}
                style={{ cursor: "pointer" }}
                key={index}
              >
                <div className={"w-48"} style={{ display: "block" }}>
                  <div className="flex gap-2">
                    <TabIcon src={item.icon} />
                    <div> {item.name}</div>
                  </div>
                </div>
                <TabIcon src={"/menu-icon/chevron.svg"} />
                {index === currentSelectedMenuIndex && (
                  <MathLessonNavbarMenu
                    allConceptsDetails={allConceptsDetails}
                    item={{ ...item, extraParams: {} }}
                    key={`mathlesson-${index}`}
                    handleClickMathLesson={handleClickMathLesson}
                    queryParams={queryParams}
                    calcWidth={44.01}
                    elementPosition={index + 1}
                    handleOpenSubMenu={handleOpenSubMenu}
                    currentSelectedMenuIndex={currentSelectedMenuIndex}
                  />
                )}
              </li>
            ) : (
              <li
                key={index}
                className="rounded-sm px-3 pl-6 pr-3 py-3 hover:bg-black w-full flex gap-2"
                onClick={() => handleOpenSubMenu(index)}
              >
                <NavLink
                  to={`${item.path}?${queryParams}`}
                  onClick={() =>
                    handleClick({
                      path: item.path,
                      key: item.key,
                      name: item.name,
                      icon: item.icon,
                      extraParams: {},
                    })
                  }
                  className={"w-48"}
                  style={{ display: "block" }}
                  key={index}
                >
                  <div className="flex gap-2">
                    <TabIcon src={item.icon} />
                    <div> {item.name}</div>
                  </div>
                </NavLink>
                {/* <TabIcon src={"/menu-icon/chevron.svg"} /> */}
              </li>
            );
          })}
      </ul>
    </>
  );
}
