import React, { useEffect, useRef, useState } from "react";

import {
  StudentCheckInInstruction,
  TeacherCheckInInstruction,
} from "./Instruction/CheckInstruction";
import ActivityTimerEndButton from "../ActivityTimerEndButton";
import Draggable from "react-draggable";
import styles from "./feelingchart.module.css";
import { dragdropPointCordinate } from "../../CommonFunction/dragdropPointCordinate";
import { relative } from "path";
import StudentActivityTimer from "../StudentActivityTimer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { getStudentActivityResponse } from "../../../../api";
import { CICO } from "../../../../constants";
import { cicoComponentLevelDataTrack } from "../../../../redux/features/ComponentLevelDataReducer";
import HtmlParser from "react-html-parser";
const RenderedFeelingOptions = ({
  isEnabled,
  handleStop,
  identity,
  index,
  element,
}) => {
  const handleStopDraggable = (e: any, index: number) => {
    typeof handleStop === "function" && handleStop(e, index);
  };
  return isEnabled ? (
    <Draggable
      onStop={(e: any) => handleStopDraggable(e, index)}
      disabled={identity === "tutor"}
    >
      <div
        key={index}
        style={{
          width: "150px",
          height: "150px",
          position: "relative",
          zIndex: 0,
        }}
      >
        <img src={element?.image} alt={element?.name} draggable={false} />
      </div>
    </Draggable>
  ) : null;
};
const SelectedBox = ({
  selectedBox,
  handleSubmit,
  identity,
  showSubmitButton,
}) => {
  return (
    <div className={styles.outerContainer}>
      <div className={styles.container}>
        <div id="main-drop-box" style={{ display: "flex" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              id="student-drop-box"
              className={styles.dropBox}
              style={{
                backgroundImage: "url(/static/media/Border/Border.png)",
              }}
            >
              {
                <img
                  src={selectedBox?.image || ""}
                  alt={selectedBox?.name || ""}
                  style={{ maxWidth: 200 }}
                />
              }
            </div>
            {showSubmitButton && (
              <button className={styles.studentBtn} onClick={handleSubmit}>
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
const EndAcitivityGif = ({ gif1, gif2 }) => {
  return (
    <div className="flex justify-center gap-1">
      {gif1 && (
        <div style={{ maxWidth: 300 }}>
          <img src={gif1} alt={"gif1"} style={{ maxWidth: "100%" }} />
        </div>
      )}
      {gif2 && (
        <div style={{ maxWidth: 300 }}>
          <img src={gif2} alt={"gif1"} style={{ maxWidth: "100%" }} />
        </div>
      )}
    </div>
  );
};
const DisplayAllFeelings = ({
  identity,
  feelingArray,
  selectedImg,
  dropRef,
  selectedIndex,
  handleSubmit,
  handleStop,
}) => {
  return (
    <>
      <div className={styles.outerContainer}>
        <div className={styles.container}>
          {feelingArray?.map((element, index) => {
            if (index < Math.floor(feelingArray.length / 2))
              return (
                <RenderedFeelingOptions
                  key={index}
                  isEnabled={true}
                  handleStop={handleStop}
                  identity={identity}
                  index={index}
                  element={element}
                />
              );
          })}
        </div>
        <div id="main-drop-box" style={{ display: "flex" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              id="student-drop-box"
              className={styles.dropBox}
              ref={dropRef}
              style={{
                backgroundImage: "url(/static/media/Border/Border.png)",
              }}
            >
              {selectedImg && (
                <img
                  src={selectedImg?.image || ""}
                  alt={selectedImg?.name || ""}
                />
              )}
            </div>
          </div>
        </div>
        <div className={styles.container}>
          {feelingArray.map((element, index) => {
            if (index >= Math.floor(feelingArray.length / 2))
              return (
                <RenderedFeelingOptions
                  key={index}
                  isEnabled={true}
                  handleStop={handleStop}
                  identity={identity}
                  element={element}
                  index={index}
                />
              );
          })}
        </div>
      </div>
    </>
  );
};
const QuestionBox = ({ apiData, questionBox }) => {
  const [currentIndex, setSelectedIndex] = useState(0);
  const [checkInData, setCheckInData] = useState(
    questionBox.map((item: object) => ({ ...item }))
  );
  const handleChange = (e: Event): string => {
    checkInData[currentIndex].answer = e?.target?.value || "";
    setCheckInData([...checkInData]);
    return "";
  };
  return (
    <>
      <div className="flex flex-col gap-4 items-center">
        <div className={styles.questionContainer}>
          <div className={styles.questionName}>
            {HtmlParser(checkInData[currentIndex]?.question ?? "")}
          </div>
          <div>
            <textarea
              style={{
                resize: "none",
                border: "1px solid black",
                borderRadius: "20px",
                minWidth: "300px",
                height: "60px",
                padding: 5,
              }}
              type="text"
              value={checkInData[currentIndex]?.answer ?? ""}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
      </div>
    </>
  );
};
const StudentScreen = ({ apiData, identity }) => {
  const instruction = StudentCheckInInstruction();
  const timerRef = useRef({ count: 0, id: 0 });
  const [feelingArray, setFeelingArray] = useState([]);
  const [selectedCheckInImg, setCheckInSelectedImg] = useState("");
  const [selectedCheckInImgIndex, setSelectedCheckInImgIndex] = useState(-1);
  const [checkInDisplayImageKey, setCheckInDisplayKey] = useState(0);
  const [isCheckInResponseSaved, setIsCheckInResponseSave] = useState(false);
  useEffect(() => {
    setFeelingArray(apiData?.activity_data || []);
  }, []);
  const dropRef = useRef();
  const handleCheckInStop = (e, i) => {
    let elements = dropRef.current;
    let elementPosition = elements.getBoundingClientRect();
    let elemTop = elementPosition.top;
    let elemBottom = elementPosition.bottom;
    let elemLeft = elementPosition.left;
    let elemRight = elementPosition.right;
    let [mouseX, mouseY] = dragdropPointCordinate(e);
    setCheckInDisplayKey(Number(!checkInDisplayImageKey));
    if (mouseX > elemLeft && mouseX < elemRight) {
      if (mouseY > elemTop && mouseY < elemBottom) {
        setCheckInSelectedImg(feelingArray[i]);
        setSelectedCheckInImgIndex(i);

        return;
      }
    }
  };
  const handleCheckInSubmitResponse = () => {
    setIsCheckInResponseSave(true);
  };
  return (
    <div>
      <StudentActivityTimer
        instruction={
          isCheckInResponseSaved ? "" : `${instruction?.instruction1}<br/>`
        }
        timerRef={timerRef}
      />
      {selectedCheckInImgIndex === -1 ? (
        <DisplayAllFeelings
          key={checkInDisplayImageKey}
          feelingArray={feelingArray}
          identity={identity}
          handleSubmit={handleCheckInSubmitResponse}
          handleStop={handleCheckInStop}
          dropRef={dropRef}
        />
      ) : isCheckInResponseSaved ? (
        <>
          <EndAcitivityGif
            gif1={selectedCheckInImg.gif_image}
            gif2={selectedCheckInImg.gif_image}
          />
        </>
      ) : (
        <SelectedBox
          identity={"student"}
          selectedBox={selectedCheckInImg}
          handleSubmit={handleCheckInSubmitResponse}
          showSubmitButton={!isCheckInResponseSaved}
        />
      )}
    </div>
  );
};
const TeacherScreen = ({ apiData, identity }) => {
  const instruction = TeacherCheckInInstruction();
  const timerRef = useRef();
  const timerCountRef = useRef();
  const [feelingArray, setFeelingArray] = useState([]);
  const [questionInput, setQuestionInput] = useState([]);
  const { otherData } = useSelector(
    (state: RootState) => state.ComponentLevelDataReducer
  );
  useEffect(() => {
    setFeelingArray(apiData?.activity_data || []);
  }, []);
  useEffect(() => {
    if (!otherData?.isStudentCheckInActivitySaveResponse) return;
    let { activity_data } = apiData;
    activity_data = activity_data || [];
    setQuestionInput(
      activity_data[otherData?.selectedCheckInIndex]?.story_question_data || []
    );
  }, [otherData?.isStudentCheckInActivitySaveResponse]);
  console.log(questionInput);
  return (
    <div>
      <ActivityTimerEndButton
        instruction={
          otherData?.isStudentCheckInActivitySaveResponse
            ? ""
            : `${instruction?.instruction1}<br/><br/>${instruction?.instruction2}`
        }
        timerCountRef={timerCountRef}
        timerRef={timerRef}
      />
      {otherData?.isStudentCheckInActivitySaveResponse ? (
        <>
          <EndAcitivityGif gif1={feelingArray[0]?.gif_image} gif2="" />
          <QuestionBox
            key={questionInput.length || 0}
            questionBox={questionInput}
            apiData={apiData}
            count={timerCountRef.current?.count || 0}
          />
        </>
      ) : (
        <DisplayAllFeelings feelingArray={feelingArray} identity={identity} />
      )}
    </div>
  );
};
export default function FeelingChart({
  identity,
  apiData,
  userId,
  students,
  liveClassId,
  activityType,
  handleDataTrack,
}: {
  identity: string | undefined;
}) {
  const { otherData } = useSelector(
    (state: RootState) => state.ComponentLevelDataReducer
  );
  const [isCheckInResponseChecked, setIsCheckInResponseChecked] =
    useState(false);
  const dispatch = useDispatch();
  const findSelctedCheckInResponseData = (data) => {
    let checkin_activity_category_details = data?.checkin_responses || {};
    checkin_activity_category_details =
      checkin_activity_category_details?.student || [];
    checkin_activity_category_details =
      checkin_activity_category_details[0] || {};
    checkin_activity_category_details =
      checkin_activity_category_details?.checkin_activity_category_details ||
      [];
    checkin_activity_category_details =
      checkin_activity_category_details[0] || {};
    let id = checkin_activity_category_details?.id || "";
    let activity_data = apiData?.activity_data || [];
    for (let i = 0; i < activity_data?.length; i++) {
      if (activity_data[i]?.category_id === id) {
        dispatch(
          cicoComponentLevelDataTrack({
            isStudentCheckInActivitySaveResponse: true,
            selectedCheckInIndex: i,
          })
        );

        setIsCheckInResponseChecked(true);
        return;
      }
    }
  };
  const fetchCheckInResponse = async () => {
    try {
      let id = userId;
      if (identity === "tutor") {
        id = students[0]?.id || "";
      }
      const { data } = await getStudentActivityResponse(id, liveClassId);
      if (data.status) {
        findSelctedCheckInResponseData(data);
      }
    } catch (e) {}
  };
  useEffect(() => {
    if (activityType === CICO.checkIn && !isCheckInResponseChecked)
      fetchCheckInResponse();
  }, [otherData?.isStudentCheckInActivitySaveResponse]);
  return (
    <>
      {identity === "tutor" ? (
        <TeacherScreen apiData={apiData} identity={identity} />
      ) : (
        <StudentScreen apiData={apiData} identity={identity} />
      )}
    </>
  );
}
