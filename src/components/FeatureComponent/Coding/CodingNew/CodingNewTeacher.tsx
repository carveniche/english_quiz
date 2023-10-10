import todayClassFlag from "./assets/images/todayClassIconGreen.png";
import ScratchLogo from "./assets/images/Scratchlogo.png";
import PythonLogo from "./assets/images/PythonImage.png";
import ThunkableLogo from "./assets/images/ThunkableLogo.png";

import { RootState } from "../../../../redux/store";
import { useSelector } from "react-redux";
import {
  getThunkableLinks,
  showScratchTeacher,
  storeCodingLogNewCurriculam,
} from "../../../../api";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import useVideoContext from "../../../../hooks/useVideoContext/useVideoContext";
import { IFRAMENEWCODING, ROUTERKEYCONST } from "../../../../constants";
import { openClosedScratchWhiteBoard } from "../../../../redux/features/ComponentLevelDataReducer";
import { NavLink } from "react-router-dom";
import { getQueryParams } from "../../../../utils/getQueryParams";
import {
  ActiveTabParams,
  addToActiveTab,
} from "../../../../redux/features/addActiveTabLink";

const activeProjectBgCss = "bg-gradient-to-r from-[#3bd7b1] to-[#a4ec9e]";
const unactiveProjectBgCss = "bg-gradient-to-r from-[#eb3349] to-[#f45c43]";

interface CodingNewTeacherProps {
  env: string;
}

interface newCodingData {
  today_class: boolean;
  day: number;
  coding_learning_outcome_id: number;
  coding_activity_id: number;
  class_title: string;
  name: string;
  learning_outcome: string;
  project_type: string;
  lesson_data: [];
  students: {
    student_id: number;
    name: string;
    student_activity_id: number;
    status: string;
  }[];
}

interface studentSpecificData {
  student_id: number;
  name: string;
  student_activity_id: number;
  status: string;
}

export default function CodingNewTeacher({ env }: CodingNewTeacherProps) {
  const [thunkableLink, setThunkableLink] = useState("");
  const [newCodingData, setNewCodingData] = useState([]);
  const dispatch = useDispatch();
  const { room } = useVideoContext();
  const [localDataTrackPublication] = [
    ...room!.localParticipant.dataTracks.values(),
  ];
  const { userId, liveClassId } = useSelector(
    (state: RootState) => state.liveClassDetails
  );

  useEffect(() => {
    fetchCodingData();
    fetchThukableUrl();
  }, []);

  const fetchCodingData = () => {
    showScratchTeacher(liveClassId, userId)
      .then((res) => {
        if (res.data.status) {
          setNewCodingData(res.data.activities);
        }
      })
      .catch((err) => {
        console.log("Error", err.message);
      });
  };

  const crypt = (salt: string, text: string) => {
    const textToChars = (text: string) =>
      text.split("").map((c) => c.charCodeAt(0));
    const byteHex = (n: any) => ("0" + Number(n).toString(16)).substr(-2);
    const applySaltToChar = (code: any) =>
      textToChars(salt).reduce((a, b) => a ^ b, code);

    return text
      .split("")
      .map(textToChars)
      .map(applySaltToChar)
      .map(byteHex)
      .join("");
  };

  const fetchThukableUrl = () => {
    getThunkableLinks(liveClassId)
      .then((res) => {
        setThunkableLink(res.data.url);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const callCodingLogsApi = (coding_learning_outcome_id: number) => {
    storeCodingLogNewCurriculam(liveClassId, coding_learning_outcome_id);
  };
  const handleClick = ({
    path,
    key,
    name,
    icon,
    extraParams,
  }: ActiveTabParams) => {
    dispatch(addToActiveTab({ path, key, name, icon, extraParams }));
    callCodingLogsApi(extraParams?.coding_learning_outcome_id);
  };
  const showScratchProject = (
    item: newCodingData,
    coding_learning_outcome_id: number
  ) => {
    return item.students.map((item: studentSpecificData, index) => {
      return (
        <div
          className={`flex w-full h-[80%] justify-center items-center border border-gray-200 rounded-full ${
            item.status === "active" || item.status === "In progress"
              ? activeProjectBgCss
              : unactiveProjectBgCss
          }`}
          key={`scratch-${index}`}
        >
          {item.status === "active" || item.status === "In progress" ? (
            <NavLink
              to={`/iframeCoding?${getQueryParams()}`}
              onClick={() =>
                handleClick({
                  path: IFRAMENEWCODING.path,
                  key: IFRAMENEWCODING.key,
                  name: IFRAMENEWCODING.name,
                  icon: IFRAMENEWCODING.icon,
                  extraParams: {
                    url: `https://www.coding.begalileo.com/?user_id=${userId}&project_id=${coding_learning_outcome_id}&student_activity_id=${item.student_activity_id}&coding_learning_outcome_id=${coding_learning_outcome_id}&env=${env}`,
                    coding_learning_outcome_id: coding_learning_outcome_id,
                  },
                })
              }
            >
              <p className="text-white font-semibold text-sm">{item.name}</p>
            </NavLink>
          ) : (
            <NavLink
              to={`/iframeCoding?${getQueryParams()}`}
              onClick={() =>
                handleClick({
                  path: IFRAMENEWCODING.path,
                  key: IFRAMENEWCODING.key,
                  name: IFRAMENEWCODING.name,
                  icon: IFRAMENEWCODING.icon,
                  extraParams: {
                    url: `https://www.coding.begalileo.com/?user_id=${userId}&project_i&env=${env}`,
                    coding_learning_outcome_id: coding_learning_outcome_id,
                  },
                })
              }
            >
              <p className="text-white font-semibold text-sm">{item.name}</p>
            </NavLink>
          )}
        </div>
      );
    });
  };

  const showPythonProject = (
    item: newCodingData,
    coding_activity_id: number,
    coding_learning_outcome_id: number
  ) => {
    return item.students.map((item: studentSpecificData, index) => {
      return (
        <div
          className={`flex w-full h-[80%] justify-center items-center border border-gray-200 rounded-full ${
            item.status === "active" || item.status === "In progress"
              ? activeProjectBgCss
              : unactiveProjectBgCss
          }`}
          key={`python-${index}`}
        >
          {item.status === "active" || item.status === "In progress" ? (
            <NavLink
              to={`/iframeCoding?${getQueryParams()}`}
              onClick={() =>
                handleClick({
                  path: IFRAMENEWCODING.path,
                  key: IFRAMENEWCODING.key,
                  name: IFRAMENEWCODING.name,
                  icon: IFRAMENEWCODING.icon,
                  extraParams: {
                    url: `https://www.python.begalileo.com/?user_id=${userId}&coding_activity_id=${coding_activity_id}&student_activity_id=${item.student_activity_id}&coding_learning_outcome_id=${coding_learning_outcome_id}&share=true&env=${env}`,
                    coding_learning_outcome_id: coding_learning_outcome_id,
                  },
                })
              }
            >
              <p className="text-white font-semibold text-sm">{item.name}</p>
            </NavLink>
          ) : (
            <NavLink
              to={`/iframeCoding?${getQueryParams()}`}
              onClick={() =>
                handleClick({
                  path: IFRAMENEWCODING.path,
                  key: IFRAMENEWCODING.key,
                  name: IFRAMENEWCODING.name,
                  icon: IFRAMENEWCODING.icon,
                  extraParams: {
                    url: `https://www.python.begalileo.com/?user_id=${crypt(
                      "saltsssds lagejfgjlaregjlfdgfajdglajadgljsdhgljggfdj lg",
                      item.student_id.toString()
                    )}&project_i&env=${env}`,
                    coding_learning_outcome_id: coding_learning_outcome_id,
                  },
                })
              }
            >
              <p className="text-white font-semibold text-sm">{item.name}</p>
            </NavLink>
          )}
        </div>
      );
    });
  };

  const showScratchProjectTeacher = (coding_learning_outcome_id: number) => {
    return (
      <NavLink
        className="flex justify-center items-center"
        to={`/iframeCoding?${getQueryParams()}`}
        onClick={() =>
          handleClick({
            path: IFRAMENEWCODING.path,
            key: IFRAMENEWCODING.key,
            name: IFRAMENEWCODING.name,
            icon: IFRAMENEWCODING.icon,
            extraParams: {
              url: `https://www.coding.begalileo.com/?user_id=${userId}&project_id=${coding_learning_outcome_id}&env=${env}&teacher_copy=yes`,
              coding_learning_outcome_id: coding_learning_outcome_id,
            },
          })
        }
      >
        <img className="flex w-[100%] h-[100%]" src={ScratchLogo} />
      </NavLink>
    );
  };

  const showPythonProjectTeacher = (coding_learning_outcome_id: number) => {
    return (
      <NavLink
        className="flex justify-center items-center"
        to={`/iframeCoding?${getQueryParams()}`}
        onClick={() =>
          handleClick({
            path: IFRAMENEWCODING.path,
            key: IFRAMENEWCODING.key,
            name: IFRAMENEWCODING.name,
            icon: IFRAMENEWCODING.icon,
            extraParams: {
              url: `https://www.python.begalileo.com/?user_id=${userId}&coding_learning_outcome_id=${coding_learning_outcome_id}&env=${env}&teacher_copy=yes`,
              coding_learning_outcome_id: coding_learning_outcome_id,
            },
          })
        }
      >
        <img className="flex w-[100%] h-[100%]" src={PythonLogo} />
      </NavLink>
    );
  };

  const showThukableProjectTeacher = () => {
    return (
      <NavLink
        className="flex justify-center items-center"
        to={`/iframeCoding?${getQueryParams()}`}
        onClick={() =>
          handleClick({
            path: IFRAMENEWCODING.path,
            key: IFRAMENEWCODING.key,
            name: IFRAMENEWCODING.name,
            icon: IFRAMENEWCODING.icon,
            extraParams: {
              url: { thunkableLink },
            },
          })
        }
      >
        <img className="flex w-[100%] h-[100%]" src={ThunkableLogo} />
      </NavLink>
    );
  };

  const openScratchLesson = (item: []) => {
    let DataTrackObj = {
      pathName: ROUTERKEYCONST.coding,
      key: ROUTERKEYCONST.coding,
      value: {
        status: true,
        datatrackName: "openCloseScratchWhiteBoard",
        images: item,
      },
    };
    localDataTrackPublication.track.send(JSON.stringify(DataTrackObj));
    dispatch(openClosedScratchWhiteBoard({ status: true, images: item }));
  };

  return (
    <div className="flex flex-col gap-5 w-[98%] h-[98%] items-center border border-gray-300 p-5 rounded">
      {newCodingData.length === 0 && (
        <div>
          <p className="text-black font-semibold text-2xl">
            There is no coding activity for this class. Please check the day
            wise plan for the next coding activity
          </p>
        </div>
      )}
      {newCodingData.length > 0 &&
        newCodingData.map((item: newCodingData, index) => {
          return (
            <div
              className="flex w-[98%] h-[38%] justify-center items-center border border-gray-300 p-1 rounded"
              key={index}
            >
              <div className="flex w-[10%] h-full justify-center items-center">
                <div className="flex w-16 h-16 justify-center items-center bg-white border rounded-full">
                  <p className="text-speedMathTextColor font-semibold text-2xl">
                    {item.day}
                  </p>
                </div>
              </div>
              <div className="flex w-[10%] h-full justify-center items-center">
                {item.today_class && (
                  <img className="flex w-[50%] h-[50%]" src={todayClassFlag} />
                )}
              </div>
              <div className="flex w-[10%] h-full justify-center items-center">
                <a
                  onClick={() => openScratchLesson(item.lesson_data.pdfs)}
                  className="text-blue-500 hover:text-blue-700 cursor-pointer"
                >
                  <p className="text-speedMathTextColor font-semibold text-lg">
                    {item.lesson_data.length > 0 &&
                    item.lesson_data.pdfs.length > 0
                      ? "View Lesson"
                      : "No Lesson"}
                  </p>
                </a>
              </div>
              <div className="flex flex-col w-[20%] h-full justify-center items-center gap-1 ">
                <div className="flex w-full  justify-center items-center flex-wrap ">
                  <p className="text-speedMathTextColor font-semibold text-lg text-center">
                    {item.class_title}
                  </p>
                </div>
                <div className="flex w-full  justify-center items-center flex-wrap ">
                  <p className="text-speedMathTextColor font-semibold text-lg text-center">
                    {item.learning_outcome}
                  </p>
                </div>
              </div>
              <div className="flex flex-col w-[25%] h-full justify-center items-center ml-[2.5%] mr-[2.5%]">
                <div className="flex w-full h-[50%] justify-center items-center">
                  <p className="text-speedMathTextColor font-semibold text-lg">
                    Student Project
                  </p>
                </div>
                <div className="flex w-full h-[50%] justify-center items-center">
                  {item.project_type === "scratch" ? (
                    <div className="flex flex-row w-full h-full justify-between items-center gap-2">
                      {showScratchProject(
                        item,
                        item.coding_learning_outcome_id
                      )}
                    </div>
                  ) : item.project_type === "python" ? (
                    <div className="flex flex-row w-full h-full justify-between items-center gap-2">
                      {showPythonProject(
                        item,
                        item.coding_activity_id,
                        item.coding_learning_outcome_id
                      )}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="flex flex-col w-[20%] h-full justify-center items-center">
                <div className="flex w-full h-[50%] justify-center items-center">
                  <p className="text-speedMathTextColor font-semibold text-lg text-center">
                    Teacher Project
                  </p>
                </div>
                <div className="flex w-full h-[50%] justify-center items-center">
                  {item.project_type === "scratch" ? (
                    <div className="flex flex-row w-full h-full justify-center items-center">
                      {showScratchProjectTeacher(
                        item.coding_learning_outcome_id
                      )}
                    </div>
                  ) : item.project_type === "python" ? (
                    <div className="flex flex-row w-full h-full justify-center items-center">
                      {showPythonProjectTeacher(
                        item.coding_learning_outcome_id
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-row w-full h-full justify-center items-center ">
                      {showThukableProjectTeacher()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}
