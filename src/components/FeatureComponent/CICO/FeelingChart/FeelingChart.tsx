import React, { useEffect, useRef, useState } from "react";

import {
  StudentCheckInInstruction,
  TeacherCheckInInstruction,
} from "./Instruction/CheckInstruction";
import ActivityTimerEndButton from "../ActivityTimerEndButton";
import Draggable from "react-draggable";
import styles from "./feelingchart.module.css";
import { dragdropPointCordinate } from "../../CommonFunction/dragdropPointCordinate";
import StudentActivityTimer from "../StudentActivityTimer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import {
  StudentActivityResponseSave,
  StudentActivityTeacherResponseSave,
  getStudentActivityResponse,
  submitErrorLog,
  updateStatusofCicoActivity,
} from "../../../../api";
import { CICO } from "../../../../constants";
import { cicoComponentLevelDataTrack } from "../../../../redux/features/ComponentLevelDataReducer";
import HtmlParser from "react-html-parser";
import { Button } from "@mui/material";
import {
  StudentCheckOutInstruction,
  TeacherCheckOutInstruction,
} from "./Instruction/CheckOutInstruction";
import EndActivityShowModal from "../ConfirmationModal/EndActivityShowModal";
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
const QuestionBox = ({
  apiData,
  questionBox,
  activityType,
  count,
  liveClassId,
  userId,
  students,
  handleSaveResponse,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [enabledSaveButton, setEnabledSaveButton] = useState(true);
  const [checkInData, setCheckInData] = useState(
    questionBox.map((item: object) => ({ ...item }))
  );
  const handleChange = (e: Event): string => {
    checkInData[currentIndex].answer = e?.target?.value || "";
    setCheckInData([...checkInData]);
    return "";
  };
  const handleNextslide = () => {
    setEnabledSaveButton(true);
    handleSaveResponse(currentIndex, checkInData[currentIndex]?.answer);

    setCurrentIndex(currentIndex + 1);
  };
  const handlePrevslide = async () => {
    // handleSaveResponse(currentQuestionIndex);
    setEnabledSaveButton(true);
    setCurrentIndex(currentIndex - 1);
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
        <div className="flex gap-2 justify-center">
          {currentIndex > 0 && (
            <Button variant="contained" onClick={handlePrevslide}>
              Prev
            </Button>
          )}
          {currentIndex < checkInData.length - 1 && (
            <Button variant="contained" onClick={handleNextslide}>
              Next
            </Button>
          )}
          {currentIndex === checkInData.length - 1 && enabledSaveButton && (
            <Button
              variant="contained"
              onClick={() => {
                setEnabledSaveButton(false);
                handleSaveResponse(
                  currentIndex,
                  checkInData[currentIndex]?.answer
                );
              }}
            >
              Save
            </Button>
          )}
        </div>
      </div>
    </>
  );
};
const StudentScreen = ({
  apiData,
  identity,
  students,
  handleDataTrack,
  liveClassId,
  userId,
  activityType,
  selectedCheckInResponse,
}) => {
  const instruction =
    activityType === CICO.checkIn
      ? StudentCheckInInstruction()
      : StudentCheckOutInstruction();
  const timerRef = useRef({ count: 0, id: 0 });
  const [feelingArray, setFeelingArray] = useState([]);
  const [selectedCheckInImg, setCheckInSelectedImg] = useState("");
  const [selectedCheckInImgIndex, setSelectedCheckInImgIndex] = useState(-1);
  const [selectedCheckOutImgIndex, setSelectedCheckOutImgIndex] = useState(-1);
  const [checkInDisplayImageKey, setCheckInDisplayKey] = useState(0);
  const [isCheckInResponseSaved, setIsCheckInResponseSave] = useState(false);
  const dispatch = useDispatch();
  const { otherData } = useSelector(
    (state: RootState) => state.ComponentLevelDataReducer
  );
  useEffect(() => {
    setFeelingArray(apiData?.activity_data || []);
  }, []);
  const dropRef = useRef();
  const handleCheckInStop = (e, i) => {
    console.log(i);
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
    let obj: any = {
      isStudentCheckInActivitySaveResponse: true,
      selectedCheckInIndex: selectedCheckInImgIndex,
    };
    let formData = new FormData();
    formData.append("student_id", userId);
    formData.append("live_class_id", liveClassId);
    formData.append("checkin_ativity_id", apiData?.activity_id);
    formData.append(
      "checkin_out_activity_category_id",
      feelingArray[selectedCheckInImgIndex]?.category_id || ""
    );
    formData.append("duration", timerRef.current.count);
    StudentActivityResponseSave(formData)
      .then((res) => {
        if (!res?.status) {
          submitErrorLog(
            userId,
            liveClassId,
            res?.message || "unable to save checkin response",
            apiData.activity_id,
            "0"
          );
        }
        dispatch(cicoComponentLevelDataTrack(obj));
        handleDataTrack({
          data: {
            isStudentCheckInActivitySaveResponse: true,
            selectedCheckInIndex: selectedCheckInImgIndex,
          },
          key: CICO.checkIn,
        });
      })
      .catch((e) => {
        submitErrorLog(
          userId,
          liveClassId,
          e?.message || "unable to save checkin response",
          apiData.activity_id,
          "0"
        );
      });
  };
  const handleCheckOutSubmitResponse = () => {
    let obj: any = {
      isStudentCheckOutActivitySaveResponse: true,
      selectedCheckOutIndex: selectedCheckInImgIndex,
    };
    dispatch(cicoComponentLevelDataTrack(obj));
    let formData = new FormData();
    formData.append("student_id", userId);
    formData.append("live_class_id", liveClassId);
    formData.append("checkin_ativity_id", apiData?.activity_id);
    formData.append(
      "checkin_out_activity_category_id",
      feelingArray[selectedCheckInImgIndex]?.category_id || ""
    );
    formData.append("duration", timerRef.current.count);
    StudentActivityResponseSave(formData)
      .then((res) => {
        if (!res?.status) {
          submitErrorLog(
            userId,
            liveClassId,
            res?.message || "unable to save checkin response",
            apiData.activity_id,
            "0"
          );
        }
        handleDataTrack({
          data: {
            isStudentCheckOutActivitySaveResponse: true,
            selectedCheckOutIndex: selectedCheckInImgIndex,
          },
          key: CICO.checkIn,
        });
      })
      .catch((e) => {
        submitErrorLog(
          userId,
          liveClassId,
          e?.message || "unable to save checkin response",
          apiData.activity_id,
          "0"
        );
      });
  };
  useEffect(() => {
    if (activityType === CICO.checkIn) {
      if (otherData?.isStudentCheckInActivitySaveResponse) {
        setCheckInSelectedImg(
          apiData.activity_data[otherData?.selectedCheckInIndex]
        );
        setSelectedCheckInImgIndex(otherData?.selectedCheckInIndex);
        setIsCheckInResponseSave(
          otherData?.isStudentCheckInActivitySaveResponse
        );
      }
    }
  }, [
    otherData?.isStudentCheckInActivitySaveResponse,
    otherData?.selectedCheckInIndex,
  ]);
  return (
    <div>
      {activityType === CICO.checkIn ? (
        <>
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
              <EndAcitivityGif gif1={selectedCheckInImg.gif_image} gif2={""} />
            </>
          ) : (
            <SelectedBox
              identity={"student"}
              selectedBox={selectedCheckInImg}
              handleSubmit={handleCheckInSubmitResponse}
              showSubmitButton={!isCheckInResponseSaved}
            />
          )}
        </>
      ) : (
        <>
          <StudentActivityTimer
            instruction={
              otherData.isStudentCheckOutActivitySaveResponse
                ? ""
                : otherData?.hideNextButton
                ? `${instruction.instruction2}<br/>${instruction.instruction3}`
                : `${instruction?.instruction1}<br/>`
            }
            timerRef={timerRef}
          />
          {otherData.hideNextButton ||
          otherData.isStudentCheckOutActivitySaveResponse ||
          otherData.isEndCheckOutActivity ? (
            <>
              {selectedCheckInImgIndex === -1 ? (
                <DisplayAllFeelings
                  key={checkInDisplayImageKey}
                  feelingArray={feelingArray}
                  identity={identity}
                  handleSubmit={handleCheckOutSubmitResponse}
                  handleStop={handleCheckInStop}
                  dropRef={dropRef}
                />
              ) : otherData?.isStudentCheckOutActivitySaveResponse ? (
                <>
                  {otherData.endCheckOutResponse ? (
                    <EndAcitivityGif
                      gif2={
                        feelingArray[otherData?.selectedCheckOutIndex]
                          ?.gif_image
                      }
                      gif1={selectedCheckInResponse?.gif_image}
                    />
                  ) : (
                    <EndAcitivityGif
                      gif1={
                        feelingArray[otherData?.selectedCheckOutIndex]
                          ?.gif_image
                      }
                      gif2=""
                    />
                  )}
                </>
              ) : (
                <SelectedBox
                  identity={"student"}
                  selectedBox={selectedCheckInImg}
                  handleSubmit={handleCheckOutSubmitResponse}
                  showSubmitButton={!isCheckInResponseSaved}
                />
              )}
            </>
          ) : (
            <>
              <SelectedBox
                identity={"student"}
                selectedBox={selectedCheckInResponse}
                handleSubmit={() => {}}
                showSubmitButton={false}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};
const TeacherScreen = ({
  apiData,
  identity,
  handleDataTrack,
  userId,
  activityType,
  liveClassId,
  students,
  selectedCheckInResponse,
}) => {
  const instruction =
    activityType === CICO.checkIn
      ? TeacherCheckInInstruction()
      : TeacherCheckOutInstruction();
  const timerRef = useRef();
  const [checkInCategoryId, setCheckInCategoryId] = useState("");
  const [checkOutCategoryId, setCheckOutCategoryId] = useState("0");
  const timerCountRef = useRef();
  const dispatch = useDispatch();
  const [feelingArray, setFeelingArray] = useState([]);
  const [questionInput, setQuestionInput] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const { otherData } = useSelector(
    (state: RootState) => state.ComponentLevelDataReducer
  );
  useEffect(() => {
    setFeelingArray(apiData?.activity_data || []);
  }, []);
  useEffect(() => {
    if (activityType === CICO.checkOut) return;
    if (!otherData?.isStudentCheckInActivitySaveResponse) return;
    let { activity_data } = apiData;
    activity_data = activity_data || [];
    setQuestionInput(
      activity_data[otherData?.selectedCheckInIndex]?.story_question_data || []
    );
  }, [otherData?.isStudentCheckInActivitySaveResponse]);
  useEffect(() => {
    if (activityType === CICO.checkIn) return;
    if (!otherData?.isStudentCheckOutActivitySaveResponse) return;
    let { activity_data } = apiData;
    activity_data = activity_data || [];
    setQuestionInput(
      activity_data[otherData?.selectedCheckOutIndex]?.story_question_data || []
    );
  }, [otherData?.isStudentCheckOutActivitySaveResponse]);
  useEffect(() => {
    if (activityType === CICO.checkIn) return;
  }, [otherData?.isStudentCheckOutActivitySaveResponse]);
  const handleSaveCheckInResponse = async (index, answer) => {
    console.log(index, answer);
    let categoryId = apiData?.activity_data || [];
    categoryId = categoryId[otherData?.selectedCheckInIndex]?.category_id;
    let formData = new FormData();
    let checkoutActivityCategoryId = categoryId;
    let checkin_ativity_id = apiData?.activity_id;
    formData.append("student_id", students[0]?.id || "");
    formData.append("teacher_id", userId);
    formData.append("checkin_activity_id", checkin_ativity_id);
    formData.append("live_class_id", liveClassId);
    console.log(timerCountRef);
    formData.append("duration", timerCountRef.current || 0);
    formData.append(
      "checkin_out_activity_category_id",
      checkoutActivityCategoryId
    );
    formData.append("answer", answer);
    formData.append(
      "checkin_out_activity_data_id",
      questionInput[index]?.activity_data_id
    );
    await StudentActivityTeacherResponseSave(formData);
  };
  const handleSaveCheckOutResponse = async (index, answer) => {
    console.log(index, answer);
    let categoryId = apiData?.activity_data || [];
    categoryId = categoryId[otherData?.selectedCheckInIndex]?.category_id;
    let formData = new FormData();
    let checkoutActivityCategoryId = categoryId;
    let checkin_ativity_id = apiData?.activity_id;
    formData.append("student_id", students[0]?.id || "");
    formData.append("teacher_id", userId);
    formData.append("checkin_activity_id", checkin_ativity_id);
    formData.append("live_class_id", liveClassId);
    console.log(timerCountRef);
    formData.append("duration", timerCountRef.current || 0);
    formData.append(
      "checkin_out_activity_category_id",
      checkoutActivityCategoryId
    );
    formData.append("answer", answer);
    formData.append(
      "checkin_out_activity_data_id",
      questionInput[index]?.activity_data_id
    );
    await StudentActivityTeacherResponseSave(formData);
  };
  const [endCheckInResponse, setEndCheckInResponse] = useState(false);
  const [endCheckOutResponse, setEndCheckOutResponse] = useState(false);
  const handleEndCheckInActivity = () => {
    setEndCheckInResponse(true);
    setShowModal(false);
    updateStatusofCicoActivity(
      liveClassId,
      apiData?.activity_id,
      timerCountRef.current
    )
      .then((res) => {})
      .catch((e) => {
        setEndCheckInResponse(false);
        submitErrorLog(
          userId,
          liveClassId,
          e?.message || "unable to change checkIn response",
          apiData.activity_id,
          ""
        );
      });
  };
  const handleEndCheckOutActivity = () => {
    setEndCheckOutResponse(true);
    setShowModal(false);
    dispatch(cicoComponentLevelDataTrack({ endCheckOutResponse: true }));
    updateStatusofCicoActivity(
      liveClassId,
      apiData?.activity_id,
      timerCountRef.current
    )
      .then((res) => {
        dispatch(cicoComponentLevelDataTrack({ endCheckOutResponse: true }));
        handleDataTrack({
          data: {
            endCheckOutResponse: true,
          },
          key: CICO.checkOut,
        });
      })
      .catch((e) => {
        setEndCheckOutResponse(false);
        submitErrorLog(
          userId,
          liveClassId,
          e?.message || "unable to change checkIn response",
          apiData.activity_id,
          ""
        );
      });
  };
  const handleClickNext = () => {
    dispatch(
      cicoComponentLevelDataTrack({
        hideNextButton: true,
      })
    );
    handleDataTrack({
      data: {
        hideNextButton: true,
      },
      key: CICO.checkOut,
    });
  };
  const handleShowModal = () => {
    setShowModal(true);
  };
  const handleStopTiming = () => clearInterval(timerRef.current);
  useEffect(() => {
    if (CICO.checkIn && endCheckInResponse) {
      handleStopTiming();
    } else if (CICO.checkIn && otherData?.endCheckOutResponse) {
      handleStopTiming();
    }
  }, [endCheckInResponse, otherData?.endCheckOutResponse]);
  return (
    <div>
      {showModal && (
        <EndActivityShowModal
          handleClose={() => setShowModal(false)}
          handleComplete={
            activityType === CICO.checkIn
              ? handleEndCheckInActivity
              : handleEndCheckOutActivity
          }
        />
      )}
      {activityType === CICO.checkIn ? (
        <>
          <ActivityTimerEndButton
            instruction={
              otherData?.isStudentCheckInActivitySaveResponse
                ? ""
                : `${instruction?.instruction1}<br/><br/>${instruction?.instruction2}`
            }
            timerCountRef={timerCountRef}
            timerRef={timerRef}
            showEndButton={otherData?.isStudentCheckInActivitySaveResponse}
            handleEndActivity={endCheckInResponse ? () => {} : handleShowModal}
            enabledEndButton={endCheckInResponse ? false : true}
          />
          {otherData?.isStudentCheckInActivitySaveResponse ? (
            <>
              <EndAcitivityGif
                gif1={feelingArray[otherData?.selectedCheckInIndex]?.gif_image}
                gif2=""
              />
              {endCheckInResponse ? (
                ""
              ) : (
                <QuestionBox
                  key={questionInput.length || 0}
                  questionBox={questionInput}
                  apiData={apiData}
                  count={timerCountRef.current || 0}
                  userId={userId}
                  activityType={activityType}
                  liveClassId={liveClassId}
                  students={students}
                  handleSaveResponse={handleSaveCheckOutResponse}
                />
              )}
            </>
          ) : (
            <DisplayAllFeelings
              feelingArray={feelingArray}
              identity={identity}
            />
          )}
        </>
      ) : (
        <>
          <ActivityTimerEndButton
            instruction={
              otherData?.isStudentCheckOutActivitySaveResponse
                ? ""
                : otherData?.hideNextButton
                ? `${instruction?.instruction2}<br/>${instruction?.instruction3}`
                : `${instruction?.instruction1} ${
                    selectedCheckInResponse?.name || ""
                  }`
            }
            timerCountRef={timerCountRef}
            timerRef={timerRef}
            showEndButton={otherData?.isStudentCheckOutActivitySaveResponse}
            handleEndActivity={endCheckOutResponse ? () => {} : handleShowModal}
            enabledEndButton={endCheckOutResponse ? false : true}
            showNextButton={
              otherData?.isStudentCheckOutActivitySaveResponse
                ? false
                : otherData?.hideNextButton
            }
            text={
              otherData?.isStudentCheckOutActivitySaveResponse
                ? ""
                : otherData?.hideNextButton
                ? ""
                : "Next"
            }
            handleClickNext={handleClickNext}
          />
          {otherData?.isStudentCheckOutActivitySaveResponse ? (
            <>
              {otherData.endCheckOutResponse ? (
                <EndAcitivityGif
                  gif2={
                    feelingArray[otherData?.selectedCheckOutIndex]?.gif_image
                  }
                  gif1={selectedCheckInResponse?.gif_image}
                />
              ) : (
                <EndAcitivityGif
                  gif1={
                    feelingArray[otherData?.selectedCheckOutIndex]?.gif_image
                  }
                  gif2=""
                />
              )}
              {otherData?.endCheckOutResponse ? (
                ""
              ) : (
                <QuestionBox
                  key={questionInput.length || 0}
                  questionBox={questionInput.map((item) => {
                    let answer1 = { ...item.answer };
                    return { ...item, answer: answer1.response, answer1 };
                  })}
                  apiData={apiData}
                  count={timerCountRef.current || 0}
                  userId={userId}
                  activityType={activityType}
                  liveClassId={liveClassId}
                  students={students}
                  handleSaveResponse={handleSaveCheckInResponse}
                />
              )}
            </>
          ) : (
            <>
              {otherData?.hideNextButton ? (
                <DisplayAllFeelings
                  feelingArray={feelingArray}
                  identity={identity}
                />
              ) : (
                <SelectedBox
                  identity={"tutor"}
                  selectedBox={selectedCheckInResponse}
                  handleSubmit={() => {}}
                  showSubmitButton={false}
                />
              )}
            </>
          )}
        </>
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
  const [checkInStudentResponse, setCheckInStudentResponse] = useState({});
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
  const findSelectedCheckOutResponseData = (data) => {
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
    console.log(checkin_activity_category_details);
    setCheckInStudentResponse(checkin_activity_category_details);
    let checkOutResponse = data?.checkout_responses || {};
    checkOutResponse = checkOutResponse?.student || [];
    checkOutResponse = checkOutResponse[0] || {};
    checkOutResponse =
      checkOutResponse?.checkout_activity_category_details || [];
    checkOutResponse = checkOutResponse[0] || {};
    let id = checkOutResponse?.id || "";
    let activity_data = apiData?.activity_data || [];
    for (let i = 0; i < activity_data?.length; i++) {
      if (activity_data[i]?.category_id === id) {
        dispatch(
          cicoComponentLevelDataTrack({
            isStudentCheckOutActivitySaveResponse: true,
            selectedCheckOutIndex: i,
          })
        );

        setIsCheckInResponseChecked(true);
        return;
      }
    }
  };
  const fetchCResponse = async () => {
    try {
      let id = userId;
      if (identity === "tutor") {
        id = students[0]?.id || "";
      }
      const { data } = await getStudentActivityResponse(id, liveClassId);
      if (data.status) {
        if (activityType === CICO.checkIn) findSelctedCheckInResponseData(data);
        else {
          findSelectedCheckOutResponseData(data);
        }
      }
    } catch (e) {}
  };
  useEffect(() => {
    if (!isCheckInResponseChecked) fetchCResponse();
  }, [
    otherData?.isStudentCheckInActivitySaveResponse,
    otherData?.isStudentCheckOutActivitySaveResponse,
  ]);
  return (
    <>
      {identity === "tutor" ? (
        <TeacherScreen
          apiData={apiData}
          identity={identity}
          liveClassId={liveClassId}
          activityType={activityType}
          userId={userId}
          handleDataTrack={handleDataTrack}
          students={students}
          selectedCheckInResponse={checkInStudentResponse}
        />
      ) : (
        <StudentScreen
          apiData={apiData}
          identity={identity}
          students={students}
          handleDataTrack={handleDataTrack}
          userId={userId}
          liveClassId={liveClassId}
          activityType={activityType}
          selectedCheckInResponse={checkInStudentResponse}
        />
      )}
    </>
  );
}
