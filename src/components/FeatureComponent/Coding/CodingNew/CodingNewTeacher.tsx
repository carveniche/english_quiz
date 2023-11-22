import todayClassFlag from "./assets/images/todayClassIconGreen.png";

import CircularProgress from "@material-ui/core/CircularProgress";

import { RootState } from "../../../../redux/store";
import { useSelector } from "react-redux";
import {
  getThunkableLinks,
  showScratchTeacher,
  storeCodingLogNewCurriculam,
} from "../../../../api";
import React, { useEffect, useRef, useState } from "react";
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
import { maxHeightCalculate } from "../Utility/maxHeightCalculate";

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
  const [loading, setLoading] = useState(false);
  const [minHeight, setMinHeight] = useState("initial");

  const containerRef = useRef([]);
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
    setLoading(true);
    showScratchTeacher(liveClassId, userId)
      .then((res) => {
        if (res.data.status) {
          setLoading(false);
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
          className={`border border-gray-200 rounded-full ${
            item.status === "active" || item.status === "In progress"
              ? activeProjectBgCss
              : unactiveProjectBgCss
          } p-1`}
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
          className={`border border-gray-200 rounded-full ${
            item.status === "active" || item.status === "In progress"
              ? activeProjectBgCss
              : unactiveProjectBgCss
          } p-1`}
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

  const showScratchProjectTeacher = (
    coding_learning_outcome_id: number,
    studentName: string
  ) => {
    return (
      <div
        className={`border border-gray-200 rounded-full active p-1 bg-gradient-to-r bg-[#33eb3c] relative`}
      >
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
          <p className="text-white font-semibold text-sm invisible">
            {studentName}
          </p>
          <p className="text-white font-semibold text-sm absolute">Teacher</p>
        </NavLink>
      </div>
    );
  };

  const showPythonProjectTeacher = (
    coding_learning_outcome_id: number,
    studentName: string
  ) => {
    return (
      <div
        className={`border border-gray-200 rounded-full active p-1 bg-gradient-to-r bg-[#33eb3c]`}
      >
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
          <p className="text-white font-semibold text-sm invisible">
            {studentName}
          </p>
          <p className="text-white font-semibold text-sm absolute">Teacher</p>
        </NavLink>
      </div>
    );
  };

  const showThukableProjectTeacher = (studentName: string) => {
    return (
      <div
        className={`border border-gray-200 rounded-full active p-1 bg-gradient-to-r bg-[#33eb3c]`}
      >
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
          <p className="text-white font-semibold text-sm invisible">
            {studentName}
          </p>
          <p className="text-white font-semibold text-sm absolute">Teacher</p>
        </NavLink>
      </div>
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
  useEffect(() => {
    if (!newCodingData.length) return;

    let height = maxHeightCalculate(containerRef.current || []);
    console.log(height);
    // setMinHeight(height);
  }, [newCodingData.length]);

  return (
    <div className="flex flex-col gap-5 w-[98%] h-[98%] items-center border border-gray-300 p-5 rounded overflow-auto">
      <>
        {loading ? (
          <div>
            <CircularProgress variant="indeterminate" />
          </div>
        ) : (
          <>
            {newCodingData.length === 0 && (
              <div>
                <p className="text-black font-semibold text-2xl">
                  There is no coding activity for this class. Please check the
                  day wise plan for the next coding activity
                </p>
              </div>
            )}
            {newCodingData.length > 0 &&
              newCodingData.map((item: newCodingData, index) => {
                return (
                  <React.Fragment key={index}>
                    <div
                      ref={(el) => (containerRef.current[index] = el)}
                      className="coding-content-inner relative"
                      style={{
                        marginTop: index === 0 ? 38 : 36,
                        minHeight: minHeight,
                      }}
                    >
                      <div
                        className="flex flex-col"
                        style={{ maxWidth: "700px" }}
                      >
                        <div
                          className="absolute -top-1/2 left-1/2 translate-x-1/2 translate-y-1/2 bg-white aspect-square p-2 font-bold flex items-center justify-center
                "
                          style={{
                            borderRadius: "50%",
                            boxShadow: "5px 5px 5px 0px rgba(0,0,0,0.2)",
                            fontSize: 18,
                          }}
                        >
                          Day-{item?.day}
                        </div>
                        {item.today_class ? (
                          <div>
                            <img
                              style={{ maxHeight: 40 }}
                              src={todayClassFlag}
                            />
                          </div>
                        ) : (
                          <div className="invisible">
                            <img
                              style={{ maxHeight: 40 }}
                              src={todayClassFlag}
                            />
                          </div>
                        )}

                        <div className="flex flex-row justify-between">
                          <h4 className="coding-heading-title">
                            {item.class_title}
                          </h4>
                          <div
                            title="Teacher Project"
                            style={{ minWidth: 221, maxWidth: 221 }}
                            className="flex justify-end"
                          >
                            {item.project_type === "scratch" ? (
                              <>
                                {showScratchProjectTeacher(
                                  item.coding_learning_outcome_id,
                                  item?.students[0]?.name
                                )}
                              </>
                            ) : item.project_type === "python" ? (
                              <>
                                {showPythonProjectTeacher(
                                  item.coding_learning_outcome_id,
                                  item?.students[0]?.name
                                )}
                              </>
                            ) : (
                              <>
                                {showThukableProjectTeacher(
                                  item?.students[0]?.name
                                )}
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-row justify-between mt-2 gap-1">
                          <p className="text-speedMathTextColor font-semibold text-lg text-left">
                            {item.learning_outcome}
                          </p>
                          <div
                            className="flex flex-row gap-4 flex-wrap justify-end"
                            style={{ minWidth: 221, maxWidth: 221 }}
                          >
                            {item?.lesson_data?.pdfs?.length > 0 && (
                              <div>
                                <div>
                                  <a
                                    onClick={() =>
                                      openScratchLesson(item?.lesson_data?.pdfs)
                                    }
                                    className="text-blue-500 hover:text-blue-700 cursor-pointer"
                                  >
                                    <p className="text-speedMathTextColor font-semibold text-lg">
                                      {item?.lesson_data?.pdfs?.length > 0
                                        ? "View Lesson"
                                        : "No Lesson"}
                                    </p>
                                  </a>
                                </div>
                              </div>
                            )}
                            <div title="Student Project">
                              {item.project_type === "scratch"
                                ? showScratchProject(
                                    item,
                                    item.coding_learning_outcome_id
                                  )
                                : item.project_type === "python"
                                ? showPythonProject(
                                    item,
                                    item.coding_activity_id,
                                    item.coding_learning_outcome_id
                                  )
                                : ""}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-row justify-between mt-2">
                          <p
                            style={{
                              fontSize: 10,
                              fontFamily: "Montserrat",
                              color: "black",
                            }}
                          >
                            {item?.project_type?.toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
          </>
        )}
      </>
    </div>
  );
}
