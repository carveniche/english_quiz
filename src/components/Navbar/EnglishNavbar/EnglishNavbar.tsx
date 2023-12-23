import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import {
  ActiveTabParams,
  addToActiveTab,
} from "../../../redux/features/addActiveTabLink";
import englishRouterConfig from "../../../Router/EnglishRouterConfig";
import useVideoContext from "../../../hooks/useVideoContext/useVideoContext";
import { getQueryParams } from "../../../utils/getQueryParams";
import TabIcon from "../NavbarIcons/TabIcon";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { LESSON, ROUTERKEYCONSTENGLISH } from "../../../constants";
import EnglishLessonNavbar from "./EnglishLessonNavbar";
import EnglishMiscelleneousNavbar from "./EnglishMiscelleneousNavbar";
import { useState } from "react";
import { resetWhiteBoardData } from "../../../redux/features/ComponentLevelDataReducer";
import EnglishQuizZoneNavbar from "./EnglishQuizZoneNavbar";

export default function EnglishNavbar({ onClick }: { onClick: Function }) {
  const { allConceptsDetails } = useSelector(
    (state: RootState) => state.liveClassConceptDetails
  );

  const [currentSelectedMenuIndex, setCurrentSelectedMenuIndex] = useState(-1);
  const [mathzoneKeys, setMathzoneKeys] = useState(0);
  const queryParams = getQueryParams();
  const { room } = useVideoContext();

  const dispatch = useDispatch();

  const handleClick = (
    { path, key, name, icon, extraParams }: ActiveTabParams,
    e
  ) => {
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
        type: "addFromActiveTab",
        identity: null,
      },
    };

    // Additional logic for English Lesson
    if (path === ROUTERKEYCONSTENGLISH.englishlesson) {
      dispatch(
        resetWhiteBoardData({ dataTrackKey: LESSON.lessonWhiteBoardData })
      );

      DataTrackObj = {
        pathName: path,
        key,
        name,
        icon,
        extraParams,
        value: {
          datatrackName: "EnglishLesson",
          identity: null,
          dataTrackKey: LESSON.lessonWhiteBoardData,
          isReset: true,
        },
      };
    }

    localDataTrackPublication.track.send(JSON.stringify(DataTrackObj));
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
          englishRouterConfig.map((item, index) => {
            return item.key === ROUTERKEYCONSTENGLISH.englishquizzone ? (
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
                  <EnglishQuizZoneNavbar
                    allConceptsDetails={allConceptsDetails}
                    item={{ ...item, extraParams: {} }}
                    key={`english-${mathzoneKeys}`}
                    handleClick={handleClick}
                    queryParams={queryParams}
                    calcWidth={44.01}
                    elementPosition={index + 1}
                    handleOpenSubMenu={handleOpenSubMenu}
                    currentSelectedMenuIndex={currentSelectedMenuIndex}
                  />
                )}
              </li>
            ) : item.key === ROUTERKEYCONSTENGLISH.miscellaneous.key ? (
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
                  <EnglishMiscelleneousNavbar
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
            ) : item.key === ROUTERKEYCONSTENGLISH.englishlesson ? (
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
                  <EnglishLessonNavbar
                    allConceptsDetails={allConceptsDetails}
                    item={{ ...item, extraParams: {} }}
                    key={`englishlesson-${index}`}
                    handleClick={handleClick}
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
                  onClick={(e) =>
                    handleClick(
                      {
                        path: item.path,
                        key: item.key,
                        name: item.name,
                        icon: item.icon,
                        extraParams: {},
                      },
                      e
                    )
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
              </li>
            );
          })}
      </ul>
    </>
  );
}
