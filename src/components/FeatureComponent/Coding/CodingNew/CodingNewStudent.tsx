import ScratchLogo from "./assets/images/Scratchlogo.png";
import PythonLogo from "./assets/images/PythonImage.png";
import ThunkableLogo from "./assets/images/ThunkableLogo.png";

import { useEffect, useState } from "react";

import { RootState } from "../../../../redux/store";
import { useSelector } from "react-redux";

import {
  getThunkableLinks,
  showScratchTeacher,
  storeCodingLogNewCurriculam,
} from "../../../../api";
import {
  ActiveTabParams,
  addToActiveTab,
} from "../../../../redux/features/addActiveTabLink";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { getQueryParams } from "../../../../utils/getQueryParams";
import { IFRAMENEWCODING } from "../../../../constants";

interface CodingNewStudentProps {
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

export default function CodingNewStudent({ env }: CodingNewStudentProps) {
  const [thunkableLink, setThunkableLink] = useState("");
  const [newCodingData, setNewCodingData] = useState([]);
  const dispatch = useDispatch();

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
                url: `https://www.coding.begalileo.com/?user_id=${userId}&project_id=${coding_learning_outcome_id}&student_activity_id=${item.student_activity_id}&coding_learning_outcome_id=${coding_learning_outcome_id}&env=${env}`,
                coding_learning_outcome_id: coding_learning_outcome_id,
              },
            })
          }
          key={`scratch-${index}`}
        >
          <img className="flex w-[100%] h-[100%]" src={ScratchLogo} />
        </NavLink>
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
        <NavLink
          to={`/iframeCoding?${getQueryParams()}`}
          onClick={() =>
            handleClick({
              path: IFRAMENEWCODING.path,
              key: IFRAMENEWCODING.key,
              name: IFRAMENEWCODING.name,
              icon: IFRAMENEWCODING.icon,
              extraParams: {
                url: `https://www.python.begalileo.com/?user_id=${userId}&coding_activity_id=${coding_activity_id}&student_activity_id=${item.student_activity_id}&coding_learning_outcome_id=${coding_learning_outcome_id}&env=${env}`,
                coding_learning_outcome_id: coding_learning_outcome_id,
              },
            })
          }
          className="flex justify-center items-center"
          key={`python-${index}`}
        >
          <img className="flex w-[100%] h-[100%]" src={PythonLogo} />
        </NavLink>
      );
    });
  };
  const showThukableProject = () => {
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
              className="flex w-[98%] h-[28%] justify-center items-center border border-gray-300 p-1 rounded"
              key={index}
            >
              <div className="flex w-[10%] h-full justify-center items-center">
                <div className="flex w-16 h-16 justify-center items-center bg-white border rounded-full">
                  <p className="text-speedMathTextColor font-semibold text-2xl">
                    {item.day}
                  </p>
                </div>
              </div>

              <div className="flex flex-col w-[70%] h-full justify-center items-center ">
                <div className="flex w-full h-[50%] justify-center items-center flex-wrap overflow-auto ">
                  <p className="text-speedMathTextColor font-semibold text-lg">
                    {item.class_title}
                  </p>
                </div>
                <div className="flex w-full h-[50%] justify-center items-center flex-wrap overflow-auto">
                  <p className="text-speedMathTextColor font-semibold text-lg">
                    {item.learning_outcome}
                  </p>
                </div>
              </div>
              <div className="flex flex-col w-[20%] h-full justify-center items-center">
                <div className="flex w-full h-[100%] justify-center items-center">
                  {item.project_type === "scratch" ? (
                    <div className="flex flex-row w-full h-full justify-center items-center">
                      {showScratchProject(
                        item,
                        item.coding_learning_outcome_id
                      )}
                    </div>
                  ) : item.project_type === "python" ? (
                    <div className="flex flex-row w-full h-full justify-center items-center">
                      {showPythonProject(
                        item,
                        item.coding_activity_id,
                        item.coding_learning_outcome_id
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-row w-full h-full justify-center items-center ">
                      {showThukableProject()}
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
