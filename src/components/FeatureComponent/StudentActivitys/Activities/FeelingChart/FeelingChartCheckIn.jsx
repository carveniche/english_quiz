import React from "react";
import happy from "./feelingchart/Haapy.png";
import Draggable from "react-draggable";
import styles from "./feelingchart.module.css";
import styles2 from "../../StudentActivity.module.css";
import FeelingChart from "../../../components/LottieComponents/FeelingChartLottie.jsx";
import {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Button } from "react-bootstrap";
import ActivityTimerAndEndButton from "../../ActivityTimerAndEndButton";
import {
  getStudentActivityResponse,
  StudentActivityResponseSave,
  StudentActivityTeacherResponseSave,
  updateStatusofCicoActivity,
} from "../../../../../api";
import ActivityTimerCalculator from "../../ActivityTimerCalculator";
import HtmlParser from "react-html-parser";
import EndActivityModal from "../../EndActivityModal";
import {
  StudentCheckInInstruction,
  TeacherCheckInInstruction,
} from "../../InstructionPageConfig/FeelingChart/CheckInIntruction";
import {
  StudentCheckOutInstruction,
  TeacherCheckOutInstruction,
} from "../../InstructionPageConfig/FeelingChart/CheckOutInstruction";
import { excludeParticipant } from "../../ExcludeParticipant";
import { dragdropPointCordinate } from "../../../CommonFunction/dragdropPointCordinate";
const renderedFeelingOptions = (
  element,
  index,
  startIndex,
  length,
  handleStop,
  identity
) => {
  return index >= startIndex && index < length ? (
    <Draggable
      onStop={(e) => handleStop(e, index)}
      disabled={identity === "tutor"}
    >
      <div
        key={index}
        style={{
          width: "150px",
          height: "150px",
        }}
      >
        <img src={element?.image} alt={element?.name} />
      </div>
    </Draggable>
  ) : null;
};
const FeelingChartCheckOut = forwardRef(
  (
    {
      identity,
      onSendSelectedFeelingImg,
      className,
      onClick,
      onAnimationStart,
      selectedCheckoutImgId,
      showAffirmationNextButton,
      apiData,
      selectedCheckInFeeling,
      studentTimer,
    },
    ref
  ) => {
    useImperativeHandle(ref, () => ({
      handleSubmit() {
        if (selectedIndex > -1) {
          onSendSelectedFeelingImg(selectedIndex);
          return selectedIndex;
        }
      },
    }));
    const [feelingsArray, setFeelingArray] = useState([]);
    const [mounting, setMounting] = useState(true);
    const [selectedImg, setSelectedImg] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [check, setCheck] = useState(false);
    const dropRef = useRef();

    const handleSubmit = (selectedIndex) => {
      if (selectedIndex < 0) return;
      setCheck(true);
      typeof onClick === "function" && onClick(selectedIndex);

      sendFeelingChartCheckIn(
        feelingsArray[selectedIndex],
        identity,
        apiData,
        studentTimer?.current || 0
      );
    };
    useEffect(() => {
      setFeelingArray(apiData?.activity_data || []);
    }, []);

    const handleStop = (e, i) => {
      let elements = dropRef.current;
      let elementPosition = elements.getBoundingClientRect();
      let elemTop = elementPosition.top;
      let elemBottom = elementPosition.bottom;
      let elemLeft = elementPosition.left;
      let elemRight = elementPosition.right;
      let [mouseX, mouseY] = dragdropPointCordinate(e);
      if (mouseX > elemLeft && mouseX < elemRight) {
        if (mouseY > elemTop && mouseY < elemBottom) {
          setSelectedImg(feelingsArray[i]);
          setSelectedIndex(i);

          setMounting(false);
          return;
        }
      }

      setMounting(false);
      setTimeout(() => {
        setMounting(true);
      }, 0);
    };

    useEffect(() => {
      // selectedImgId = value

      if (selectedCheckoutImgId) {
        setSelectedIndex(selectedCheckoutImgId - 1);
        setMounting(false);
        setSelectedImg(feelingsArray[selectedCheckoutImgId - 1]);
        if (identity !== "tutor") {
          onAnimationStart(selectedCheckoutImgId - 1);
          setCheck(true);
        }
      }
    }, [selectedCheckoutImgId, feelingsArray?.length]);

    return (
      <>
        <div className={styles.outerContainer}>
          {mounting && showAffirmationNextButton === false && (
            <div className={className ?? styles.container}>
              {mounting &&
                showAffirmationNextButton === false &&
                feelingsArray.map((element, index) => {
                  return renderedFeelingOptions(
                    element,
                    index,
                    0,
                    Math.floor(feelingsArray?.length / 2),
                    handleStop,
                    identity
                  );
                })}
            </div>
          )}
          {check ? (
            <></>
          ) : (
            <div id="main-drop-box" style={{ display: "flex" }}>
              {showAffirmationNextButton !== false && (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div
                    className={styles.dropBox}
                    style={{
                      backgroundImage: "url(/static/media/Border/Border.png)",
                    }}
                  >
                    {
                      <img
                        src={
                          selectedCheckInFeeling?.selected_checkin_path || ""
                        }
                        alt={
                          selectedCheckInFeeling?.selected_checkin_name || ""
                        }
                      />
                    }
                  </div>
                </div>
              )}

              {showAffirmationNextButton === false && (
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

                  {identity !== "tutor" && (
                    <Button
                      className={styles.studentBtn}
                      onClick={() => handleSubmit(selectedIndex)}
                    >
                      Submit
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
          {mounting && showAffirmationNextButton === false && (
            <div className={className ?? styles.container}>
              {mounting &&
                showAffirmationNextButton === false &&
                feelingsArray.map((element, index) => {
                  return renderedFeelingOptions(
                    element,
                    index,
                    Math.floor(feelingsArray?.length / 2),
                    feelingsArray?.length,
                    handleStop,
                    identity
                  );
                })}
            </div>
          )}
        </div>
      </>
    );
  }
);
const FeelingChartCheckIn = forwardRef(
  (
    {
      draggableDisabled,
      selectedImgId,
      identity,
      onSendSelectedFeelingImg,
      onSendOpenDropBox,
      className,
      isCheckInActivity,
      onClick,
      feelingChartDropBox,
      onAnimationStart,
      selectedCheckoutImgId,
      apiData,
      studentTimer,
    },
    ref
  ) => {
    useImperativeHandle(ref, () => ({
      handleSubmit() {
        if (selectedIndex > -1) {
          onSendSelectedFeelingImg(selectedIndex);
          return selectedIndex;
        }
      },
    }));
    const [feelingsArray, setFeelingArray] = useState([]);
    useEffect(() => {
      setFeelingArray(apiData?.activity_data || []);
    }, []);
    const [mounting, setMounting] = useState(true);
    const [selectedImg, setSelectedImg] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [check, setCheck] = useState(false);
    const [openDropBox, setOpenDropBox] = useState(false);

    const dropRef = useRef();

    const handleSubmit = (selectedIndex) => {
      if (selectedIndex < 0) return;
      setCheck(true);
      typeof onClick === "function" && onClick(selectedIndex);

      sendFeelingChartCheckIn(
        feelingsArray[selectedIndex],
        identity,
        apiData,
        studentTimer?.current || 0
      );
    };
    // alert(localStorage.getItem(key))
    const handleStop = (e, i) => {
      let elements = dropRef.current;
      let elementPosition = elements.getBoundingClientRect();
      let elemTop = elementPosition.top;
      let elemBottom = elementPosition.bottom;
      let elemLeft = elementPosition.left;
      let elemRight = elementPosition.right;
      let [mouseX, mouseY] = dragdropPointCordinate(e);
      if (mouseX > elemLeft && mouseX < elemRight) {
        if (mouseY > elemTop && mouseY < elemBottom) {
          setSelectedImg(feelingsArray[i]);
          setSelectedIndex(i);

          setMounting(false);
          return;
        }
      }

      setMounting(false);
      setTimeout(() => {
        setMounting(true);
      }, 0);
    };
    const openDragBox = () => {
      setOpenDropBox(!openDropBox);

      onSendOpenDropBox(openDropBox);
    };

    useEffect(() => {
      if (isCheckInActivity)
        // if activity is not checkin (opposite value)
        return;

      // selectedImgId = value

      if (selectedImgId) {
        setSelectedIndex(selectedImgId - 1);
        setSelectedImg(feelingsArray[selectedImgId - 1]);
        setMounting(false);
        if (identity !== "tutor") {
          onAnimationStart(selectedImgId - 1);
          setCheck(true);
        }
      }
    }, [selectedImgId, feelingsArray.length]);

    return (
      <>
        <div
          className={
            selectedImgId && identity === "tutor"
              ? styles.outerContainer2
              : styles.outerContainer
          }
        >
          {mounting && (
            <div className={className ?? styles.container}>
              {mounting &&
                feelingsArray.map((element, index) => {
                  return renderedFeelingOptions(
                    element,
                    index,
                    0,
                    Math.floor(feelingsArray.length / 2),
                    handleStop,
                    identity
                  );
                })}
            </div>
          )}
          {check ? (
            <></>
          ) : (
            <div id="main-drop-box" style={{ display: "flex" }}>
              {!isCheckInActivity && feelingChartDropBox && (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div
                    className={styles.dropBox}
                    style={{
                      backgroundImage: "url(/static/media/Border/Border.png)",
                    }}
                  >
                    {<img src={happy} />}
                  </div>
                  {identity === "tutor" && (
                    <Button
                      style={{ width: "fit-content", margin: "0 auto" }}
                      onClick={openDragBox}
                    >
                      Next
                    </Button>
                  )}
                </div>
              )}

              {isCheckInActivity ||
                (true && (
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
                        <img src={selectedImg?.image} alt={selectedImg?.name} />
                      )}
                    </div>

                    {identity !== "tutor" && (
                      <Button
                        className={styles.studentBtn}
                        onClick={() => handleSubmit(selectedIndex)}
                      >
                        Submit
                      </Button>
                    )}
                  </div>
                ))}
            </div>
          )}
          {mounting && (
            <div className={className ?? styles.container}>
              {mounting &&
                feelingsArray.map((element, index) => {
                  return renderedFeelingOptions(
                    element,
                    index,
                    Math.floor(feelingsArray.length / 2),
                    feelingsArray.length,
                    handleStop,
                    identity
                  );
                })}
            </div>
          )}
        </div>
      </>
    );
  }
);

async function sendFeelingChartCheckIn(data, identity, apiData, duration) {
  let search = window.location.search;
  let urlParams = new URLSearchParams(search);
  let liveClassID = urlParams.get("liveClassID");
  var FormData = require("form-data");
  let formData = new FormData();
  let studentId = String(identity)?.split("-")[0];
  let checkin_ativity_id = apiData?.activity_id;
  formData.append("student_id", studentId);
  formData.append("live_class_id", liveClassID);
  formData.append("checkin_ativity_id", checkin_ativity_id);
  formData.append("checkin_out_activity_category_id", data?.category_id || "");
  formData.append("duration", duration);
  await StudentActivityResponseSave(formData);
}
function TeacherScreen({
  selectedImgId,
  identity,
  isCheckInActivity,
  onSendOpenDropBox,
  feelingChartDropBox,
  onSendStoriesToStudent,
  showAffirmationStories,
  showAffirmationNextButton,
  selectedCheckoutImgId,
  apiData,
  selectedCheckInFeeling,
  checkInActivityId,
  remoteParticipants,
  handleCloseActivity,
  checkInAnswerResponse,
  showEndActivityAnimation,
  handleEndCheckOutActivity,
  handleEndCheckInActivity,
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [inputValue, setInputValue] = useState(checkInAnswerResponse);

  useEffect(() => {
    if (isCheckInActivity) {
      setInputValue({ ...checkInAnswerResponse });
    }
  }, [Object.keys(checkInAnswerResponse)?.length]);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [closedActivity, setClosedActivity] = useState(false);
  const timerRef = useRef(null);
  const [checkInQuestionData, setCheckInQuestionData] = useState([]);
  const [categoryId, setCategoryId] = useState();
  const teacherTimerRef = useRef(null);
  const instruction = isCheckInActivity
    ? TeacherCheckInInstruction()
    : TeacherCheckOutInstruction();
  const handleChange = (e) => {
    let value = e.target.value;
    let id = checkInQuestionData[currentQuestionIndex]?.activity_data_id;
    setInputValue({ ...inputValue, [id]: value });
  };
  const handlePrevslide = async () => {
    // handleSaveResponse(currentQuestionIndex);
    setSaveButton(false);
    setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  const handleNextslide = () => {
    handleSaveResponse(currentQuestionIndex);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const handleSaveResponse = async (index) => {
    let student_id = String(remoteParticipants[0])?.split("-")[0];
    let search = window.location.search;
    let urlParams = new URLSearchParams(search);
    let user_id = urlParams.get("userID");
    let formData = new FormData();

    let checkoutActivityCategoryId = categoryId;
    if (!isCheckInActivity)
      checkoutActivityCategoryId =
        checkInQuestionData[0]?.checkin_out_activity_category_id;
    let checkin_ativity_id = apiData?.activity_id;
    formData.append("student_id", student_id);
    formData.append("teacher_id", user_id);
    formData.append("checkin_activity_id", checkin_ativity_id);
    formData.append("live_class_id", liveClassID);
    formData.append("duration", teacherTimerRef?.current || 0);
    formData.append(
      "checkin_out_activity_category_id",
      checkoutActivityCategoryId
    );
    formData.append(
      "answer",
      inputValue[checkInQuestionData[index]?.activity_data_id]
    );
    formData.append(
      "checkin_out_activity_data_id",
      checkInQuestionData[index]?.activity_data_id
    );
    await StudentActivityTeacherResponseSave(formData);
  };

  let key2 = "TeacherSelectedFeelingIndex";

  useEffect(() => {
    if (isCheckInActivity) {
      if (selectedImgId) {
        let selectedFeeling = Array.isArray(apiData?.activity_data)
          ? apiData?.activity_data[selectedImgId - 1]
          : {};
        setCategoryId(selectedFeeling?.category_id);
        let story_data = selectedFeeling?.story_question_data || [];

        setCheckInQuestionData(story_data || []);
      }
    }
  }, [selectedImgId]);
  useEffect(() => {
    if (!isCheckInActivity) {
      fetchRespones();
    }
  }, [selectedCheckoutImgId]);
  const fetchRespones = async () => {
    try {
      let urlParams = new URLSearchParams(search);
      let liveClassID = urlParams.get("liveClassID");
      let student_id = String(remoteParticipants[0])?.split("-")[0];
      let { data } = await getStudentActivityResponse(student_id, liveClassID);

      let checkOutQuestion = [];
      if (data?.status) {
        let questionData = data?.checkout_responses?.teacher || [];

        // setCheckInQuestionData(questionData);
        checkOutQuestion = data?.checkin_responses?.teacher;
        checkOutQuestion = Array.isArray(checkOutQuestion)
          ? checkOutQuestion
          : [];
        checkOutQuestion = checkOutQuestion[0]?.checkout_questions || [];

        checkOutQuestion = checkOutQuestion.map((item) => {
          let obj = { ...item, activity_data_id: item?.id };

          return obj;
        });
        questionData = questionData[0]?.teacher_checkout_response_data || [];
        let temp = {};
        for (let item of questionData) {
          temp[item?.question_id] = item?.response || "";
        }
        setInputValue({ ...temp });
        setCheckInQuestionData([...checkOutQuestion]);
      }
    } catch (e) {}
  };
  const [checkInCloseActvity, setCheckInCloseActivity] = useState(false);
  let buttonNextButtonDisabled =
    currentQuestionIndex >= checkInQuestionData?.length - 1;

  let search = window.location.search;
  let urlParams = new URLSearchParams(search);
  let liveClassID = urlParams.get("liveClassID");
  const timerCountRef = useRef(0);
  liveClassID = liveClassID?.trim();
  let temp = "Name of feeling";
  let feelingsArray = apiData?.student_activity_data;
  feelingsArray = Array.isArray(feelingsArray) ? feelingsArray : [];

  let keys =
    "FeelingChartActivityTimer" +
    (isCheckInActivity ? "Check-in" : "Check-out") +
    liveClassID;
  let text = isCheckInActivity
    ? apiData?.teacher_instruction
    : showAffirmationNextButton === false
    ? apiData?.teacher_instruction1
    : `${apiData?.instruction} `;
  const handleShowStories = () => {
    onSendStoriesToStudent(true);
  };
  const [saveButton, setSaveButton] = useState(false);
  const [gifImage, setGifImage] = useState({});
  useEffect(() => {
    let gifImage = "";
    let activity_data = apiData?.activity_data || [];
    if (selectedImgId && isCheckInActivity) {
      gifImage = activity_data[selectedImgId - 1];
      setGifImage(apiData?.activity_data[gifImage]);
    }
    if (selectedCheckoutImgId && !isCheckInActivity) {
      gifImage = activity_data[selectedCheckoutImgId - 1];
    }

    setGifImage(gifImage);
  }, [selectedCheckoutImgId, selectedImgId]);
  const handleEndActivity = async (val) => {
    setShowModal(false);
    if (val === 0) {
      return;
    }

    isCheckInActivity
      ? setCheckInCloseActivity(true)
      : handleCloseActivity("feelingchart");
    if (isCheckInActivity) {
      handleEndCheckInActivity();
    } else {
      handleEndCheckOutActivity();
    }
    clearInterval(timerRef.current);
    await updateStatusofCicoActivity(
      liveClassID,
      apiData?.activity_id,
      timerCountRef.current
    );
  };
  const [showModal, setShowModal] = useState();
  const [checkInstruction, setCheckInstruction] = useState(
    instruction?.instruction1 ?? ""
  );
  const handleConfirmationModal = () => {
    setShowModal(true);
  };
  useEffect(() => {
    if (isCheckInActivity) {
      setTimeout(() => {
        setCheckInstruction(
          (prev) =>
            instruction?.instruction1 +
            `<br /><br />` +
            instruction?.instruction2
        );
      }, 3500);
    }
  }, []);
  return (
    <>
      <EndActivityModal
        showModal={showModal}
        handleActivityStatus={handleEndActivity}
      />
      <div>
        <ActivityTimerAndEndButton
          keys={keys}
          toolBox={
            isCheckInActivity
              ? false
              : showAffirmationNextButton === undefined
              ? !showAffirmationNextButton
              : showAffirmationNextButton
          }
          checkIn={!isCheckInActivity}
          timerRef={timerRef}
          currentTime={currentTime}
          handleEndActivity={handleConfirmationModal}
          isStudentActivityEnd={
            isCheckInActivity
              ? checkInCloseActvity
              : showEndActivityAnimation === "feelingchart"
          }
          text={"NEXT"}
          feelingChart={
            isCheckInActivity ? !selectedImgId : !selectedCheckoutImgId
          }
          showClosed={closedActivity}
          instruction={
            isCheckInActivity
              ? checkInCloseActvity
                ? instruction?.instruction3
                : selectedImgId
                ? ""
                : checkInstruction
              : selectedCheckoutImgId
              ? showEndActivityAnimation === "feelingchart"
                ? ""
                : "" //:instruction?.instruction2
              : showAffirmationNextButton === undefined
              ? instruction?.instruction1 +
                `&nbsp;${selectedCheckInFeeling?.selected_checkin_name}`
              : instruction?.instruction2 + "<br />" + instruction?.instruction3
          }
          onClick={handleShowStories}
          teacherTimerRef={teacherTimerRef}
          timerCountRef={timerCountRef}
        />

        {isCheckInActivity ? (
          <div
            style={{
              display: `${selectedImgId ? "flex" : "block"}`,
              justifyContent: `${selectedImgId ? "center" : "initial"}`,
            }}
          >
            {!selectedImgId && (
              <FeelingChartCheckIn
                draggableDisabled={true}
                selectedImgId={selectedImgId}
                identity={identity}
                className={styles.container}
                isCheckInActivity={!isCheckInActivity}
                onSendOpenDropBox={onSendOpenDropBox}
                feelingChartDropBox={feelingChartDropBox}
                selectedCheckoutImgId={selectedCheckoutImgId}
                apiData={apiData}
              />
            )}
            {selectedImgId && (
              <FeelingChart
                selectedIndex={selectedImgId}
                gifImage={gifImage?.gif_image || ""}
                alt={gifImage?.name}
                identity="tutor"
                isCheckIn={isCheckInActivity}
              />
            )}
          </div>
        ) : (
          <div
            style={{
              display: `${selectedCheckoutImgId ? "flex" : "block"}`,
              justifyContent: `${selectedCheckoutImgId ? "center" : "initial"}`,
            }}
          >
            {!selectedCheckoutImgId && (
              <FeelingChartCheckOut
                draggableDisabled={false}
                onSendOpenDropBox={onSendOpenDropBox}
                isCheckInActivity={
                  !(
                    !isCheckInActivity &&
                    showEndActivityAnimation === "feelingchart"
                  )
                }
                feelingChartDropBox={feelingChartDropBox}
                selectedImgId={selectedImgId}
                showAffirmationNextButton={showAffirmationNextButton}
                identity={identity}
                selectedCheckoutImgId={selectedCheckoutImgId}
                apiData={apiData}
                selectedCheckInFeeling={selectedCheckInFeeling}
              />
            )}
            {selectedCheckoutImgId && (
              <FeelingChart
                gifImage={selectedCheckInFeeling?.gif_image}
                alt={selectedCheckInFeeling?.selected_checkin_name}
                selectedIndex2={selectedImgId}
                gifImage2={gifImage?.gif_image || ""}
                alt2={gifImage?.name}
                identity="tutor"
                isCheckIn={isCheckInActivity}
                showCheckIn={showEndActivityAnimation === "feelingchart"}
              />
            )}
          </div>
        )}
        {(isCheckInActivity
          ? !checkInCloseActvity
          : !(showEndActivityAnimation == "feelingchart")) && (
          <>
            {" "}
            {(selectedImgId || selectedCheckoutImgId) &&
              checkInQuestionData?.length > 0 && (
                <div className={styles.questionContainer}>
                  <div className={styles.questionName}>
                    {isCheckInActivity
                      ? HtmlParser(
                          checkInQuestionData[currentQuestionIndex]?.question ??
                            ""
                        )
                      : HtmlParser(
                          checkInQuestionData[currentQuestionIndex]?.question ??
                            ""
                        )}
                  </div>

                  <textarea
                    type="text"
                    onChange={handleChange}
                    value={
                      inputValue[
                        checkInQuestionData[currentQuestionIndex]
                          ?.activity_data_id
                      ] ?? ""
                    }
                  ></textarea>
                </div>
              )}
            {(selectedImgId || selectedCheckoutImgId) &&
              checkInQuestionData?.length > 0 && (
                <div className={styles.buttonGroup}>
                  <Button
                    className="mx-2"
                    onClick={handlePrevslide}
                    disabled={currentQuestionIndex === 0}
                  >
                    Prev
                  </Button>
                  {!buttonNextButtonDisabled ? (
                    <Button
                      className="mx-2"
                      onClick={handleNextslide}
                      disabled={buttonNextButtonDisabled}
                    >
                      Next
                    </Button>
                  ) : (
                    !saveButton && (
                      <Button
                        className="mx-2"
                        onClick={() => {
                          setSaveButton(true);
                          handleSaveResponse(currentQuestionIndex);
                        }}
                      >
                        Save
                      </Button>
                    )
                  )}
                </div>
              )}
          </>
        )}
      </div>
    </>
  );
}

function StudentScreen({
  onSendSelectedFeelingImg,
  isCheckInActivity,
  onSendOpenDropBox,
  feelingChartDropBox,
  selectedImgId,
  showAffirmationNextButton,
  identity,
  selectedCheckoutImgId,
  apiData,
  selectedCheckInFeeling,
  showEndActivityAnimation,
}) {
  const [image, setImage] = useState();
  const [showFeelingBox, setShowFeeelingBox] = useState(true);

  const ref = useRef("dkkd");
  const [lottieAnimationIndex, setLottieAnimationIndex] = useState(-1);
  const handleClick = () => {
    let val = ref.current.handleSubmit();

    setLottieAnimationIndex(val);
  };
  const [gifImage, setGifImage] = useState({});
  useEffect(() => {
    let gifImage = "";
    let activity_data = apiData?.activity_data || [];
    if (selectedImgId && isCheckInActivity) {
      gifImage = activity_data[selectedImgId - 1];
      setGifImage(apiData?.activity_data[gifImage]);
    }
    if (selectedCheckoutImgId && !isCheckInActivity) {
      gifImage = activity_data[selectedCheckoutImgId - 1];
    }

    setGifImage(gifImage);
  }, [selectedCheckoutImgId, selectedImgId]);
  const studentTimer = useRef();
  const instruction = isCheckInActivity
    ? StudentCheckInInstruction()
    : StudentCheckOutInstruction();

  return (
    <>
      <ActivityTimerCalculator
        teacherTimerRef={studentTimer}
        participant={"student"}
        checkIn={isCheckInActivity}
        activityName={"feelingChart"}
      />

      <div>
        <div>
          <div
            className={styles2.whiteboardContainerInstruction}
            style={{ width: "94%", marginRight: "6%", padding: 0 }}
          >
            {isCheckInActivity ? (
              <div
                className={styles2.instructionHeading}
                style={{ textAlign: "center" }}
              >
                {!selectedImgId && instruction?.instruction1}
              </div>
            ) : (
              <div
                className={styles2.instructionHeading}
                style={{ textAlign: "center" }}
              >
                {showAffirmationNextButton === false
                  ? !selectedCheckoutImgId &&
                    HtmlParser(
                      instruction?.instruction2 +
                        "<br/>" +
                        instruction?.instruction3
                    )
                  : instruction?.instruction1}
              </div>
            )}
            <div
              className={styles2.instructionHeading}
              style={{ textAlign: "center" }}
            >
              {/* <h5>Instructions</h5> */}

              {isCheckInActivity
                ? !selectedImgId
                  ? ""
                  : ""
                : showAffirmationNextButton === false
                ? !selectedCheckoutImgId
                  ? ""
                  : showEndActivityAnimation === "feelingchart"
                  ? ""
                  : "" //:instruction?.instruction2
                : ""}
            </div>
          </div>
          {isCheckInActivity ? (
            <FeelingChartCheckIn
              draggableDisabled={false}
              onSendSelectedFeelingImg={onSendSelectedFeelingImg}
              onSendOpenDropBox={onSendOpenDropBox}
              ref={ref}
              onClick={handleClick}
              isCheckInActivity={!isCheckInActivity}
              feelingChartDropBox={feelingChartDropBox}
              onAnimationStart={setLottieAnimationIndex}
              selectedImgId={selectedImgId}
              apiData={apiData}
              identity={identity}
              studentTimer={studentTimer}
            />
          ) : (
            <FeelingChartCheckOut
              draggableDisabled={false}
              onSendSelectedFeelingImg={onSendSelectedFeelingImg}
              onSendOpenDropBox={onSendOpenDropBox}
              ref={ref}
              onClick={handleClick}
              isCheckInActivity={!isCheckInActivity}
              feelingChartDropBox={feelingChartDropBox}
              onAnimationStart={setLottieAnimationIndex}
              selectedImgId={selectedImgId}
              showAffirmationNextButton={showAffirmationNextButton}
              identity={identity}
              selectedCheckoutImgId={selectedCheckoutImgId}
              apiData={apiData}
              selectedCheckInFeeling={selectedCheckInFeeling}
              studentTimer={studentTimer}
            />
          )}

          <div style={{ height: "60%" }}></div>
        </div>
      </div>
      {isCheckInActivity ? (
        selectedImgId ? (
          <FeelingChart
            selectedIndex={lottieAnimationIndex}
            gifImage={gifImage?.gif_image || ""}
            alt={gifImage?.name}
            isCheckIn={isCheckInActivity}
          />
        ) : (
          ""
        )
      ) : selectedCheckoutImgId ? (
        <FeelingChart
          selectedIndex={lottieAnimationIndex}
          gifImage={selectedCheckInFeeling?.gif_image}
          alt={selectedCheckInFeeling?.selected_checkin_name}
          selectedIndex2={lottieAnimationIndex}
          gifImage2={gifImage?.gif_image}
          alt2={gifImage?.name}
          isCheckIn={isCheckInActivity}
          showCheckIn={showEndActivityAnimation === "feelingchart"}
        />
      ) : (
        ""
      )}
    </>
  );
}

function MainFeelingChart({
  identity,
  selectedImg,
  onSendSelectedFeelingImg,
  onSendOpenDropBox,
  isCheckInActivity,
  feelingChartDropBox,
  FeelingChartSelectedImgCheckout,
  selectedImgId,
  onSendStoriesToStudent,
  showAffirmationStories,
  showAffirmationNextButton,
  apiData,
  selectedCheckInFeeling,
  checkInActivityId,
  remoteParticipants,
  handleCloseActivity,
  showEndActivityAnimation,
  handleEndCheckInActivity,
  handleEndCheckOutActivity,
}) {
  let search = window.location.search;
  const [loading, setIsLoading] = useState(true);
  const [showNextButton, setShowNextButton] = useState();
  const [isCheckInActivityCompleted, setIsCheckInActivityCompleted] =
    useState(false);
  remoteParticipants = remoteParticipants?.filter(
    (item) => !excludeParticipant?.includes(item)
  );
  let params = new URLSearchParams(search);
  const [checkInSelectedData, setCheckInSelectedData] = useState({});
  const [selectedCheckInIndex, setSelectedCheckInIndex] =
    useState(selectedImgId);
  const [selectedCheckOutIndex, setSelectedCheckOutIndex] = useState(
    FeelingChartSelectedImgCheckout
  );
  useEffect(() => {
    fetchCheckoutData();
  }, []);
  const fetchCheckoutData = async () => {
    try {
      let student_id = String(remoteParticipants)?.split("-")[0];
      let search = window.location.search;
      let params = new URLSearchParams(search);
      let liveClassID = params.get("liveClassID");
      if (identity !== "tutor") student_id = params.get("userID");

      let { data } = await getStudentActivityResponse(student_id, liveClassID);
      setIsLoading(false);
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
          if ((identity === "tutor") & isCheckInActivity) {
            questionResponse(activity_data[i]?.story_question_data);
          }
          setSelectedCheckInIndex(i + 1);
          return;
        }
      }
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };
  const questionResponse = (data) => {
    let obj = {};
    for (let item of data) {
      obj[item?.answer?.checkin_out_activity_datum_id] = item?.answer?.response;
    }

    setCheckInSelectedData({ ...obj });
  };
  useEffect(() => {
    if (isCheckInActivity) return;

    if (
      selectedCheckInFeeling?.selected_checkin_name &&
      selectedCheckInFeeling?.selected_checkin_path
    )
      setIsCheckInActivityCompleted(true);
    fetchCheckoutResponseApi();
  }, []);
  const fetchCheckoutResponseApi = async () => {
    try {
      let student_id = String(remoteParticipants)?.split("-")[0];
      let search = window.location.search;
      let params = new URLSearchParams(search);
      let liveClassID = params.get("liveClassID");
      if (identity !== "tutor") student_id = params.get("userID");
      let { data } = await getStudentActivityResponse(student_id, liveClassID);
      setIsLoading(false);
      let checkout_activity_details = data?.checkout_responses || {};

      checkout_activity_details = checkout_activity_details?.student || [];

      checkout_activity_details =
        checkout_activity_details[0]?.checkout_activity_category_details || [];

      let id = checkout_activity_details[0]?.id || "";

      let activity_data = apiData?.activity_data || [];
      for (let i = 0; i < activity_data?.length; i++) {
        if (activity_data[i]?.category_id === id) {
          if ((identity === "tutor") & isCheckInActivity) {
            questionResponse(activity_data[i]?.story_question_data);
          }
          setSelectedCheckOutIndex(i + 1);
          setShowNextButton(false);
          return;
        }
      }
    } catch (e) {
      setIsLoading(false);
    }
  };

  return loading ? (
    <h1>Loading...</h1>
  ) : (
    <>
      <div
        style={{
          marginTop: "0.4rem",
          fontSize: 18,
          fontWeight: "bold",
          color: "indigo",
        }}
      >
        CICO:&nbsp;&nbsp; Feeling-Chart
      </div>

      <div
        className={styles2.shapeChallengeInnerContainer2}
        style={{ position: "relative", overflowX: "hidden" }}
      >
        {!isCheckInActivityCompleted && !isCheckInActivity ? (
          <div style={{ width: "95%", margin: "auto" }}>
            <h1>
              Look like you did'nt submit checkin response, without submitting
              check-in response you cannot go checkout activity so please
              complete checkin activity first.
            </h1>
          </div>
        ) : identity === "tutor" ? (
          <TeacherScreen
            selectedImgId={selectedImgId ?? selectedCheckInIndex}
            identity={identity}
            isCheckInActivity={isCheckInActivity}
            onSendOpenDropBox={onSendOpenDropBox}
            feelingChartDropBox={feelingChartDropBox}
            selectedCheckoutImgId={
              FeelingChartSelectedImgCheckout ?? selectedCheckOutIndex
            }
            onSendStoriesToStudent={onSendStoriesToStudent}
            showAffirmationStories={true}
            showAffirmationNextButton={
              showAffirmationNextButton === undefined
                ? showNextButton
                : showAffirmationNextButton
            }
            apiData={apiData}
            selectedCheckInFeeling={selectedCheckInFeeling}
            checkInActivityId={checkInActivityId}
            remoteParticipants={remoteParticipants}
            handleCloseActivity={handleCloseActivity}
            checkInAnswerResponse={checkInSelectedData}
            showEndActivityAnimation={showEndActivityAnimation}
            handleEndCheckOutActivity={handleEndCheckOutActivity}
            handleEndCheckInActivity={handleEndCheckInActivity}
          />
        ) : (
          <StudentScreen
            onSendSelectedFeelingImg={onSendSelectedFeelingImg}
            onSendOpenDropBox={onSendOpenDropBox}
            isCheckInActivity={isCheckInActivity}
            feelingChartDropBox={feelingChartDropBox}
            selectedCheckoutImgId={
              FeelingChartSelectedImgCheckout ?? selectedCheckOutIndex
            }
            selectedImgId={selectedImgId ?? selectedCheckInIndex}
            showAffirmationStories={showAffirmationStories}
            showAffirmationNextButton={
              showAffirmationNextButton === undefined
                ? showNextButton
                : showAffirmationNextButton
            }
            apiData={apiData}
            identity={identity}
            selectedCheckInFeeling={selectedCheckInFeeling}
            checkInActivityId={checkInActivityId}
            showEndActivityAnimation={showEndActivityAnimation}
          />
        )}
      </div>
    </>
  );
}

export default MainFeelingChart;
