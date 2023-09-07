import React, { useRef } from "react";
import { useState } from "react";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import ActivityWhiteBoard from "./ActivityWhiteBoard/ActivityWhiteBoard";
import styles2 from "../../StudentActivity.module.css";
import { useEffect } from "react";
import BalloonLottie from "../../../components/LottieTransformation/BalloonLottie";
import RocketLottie from "../../../components/LottieTransformation/RocketLottie";
import b64toBlob from "../../b64toBlob";
import ActivityButton from "../../Button";
import {
  baseURL2,
  getStudentActivityResponse,
  imageUrl,
  StudentActivityResponseSave,
  StudentActivityTeacherResponseSave,
  updateStatusofCicoActivity,
} from "../../../../../api";
import ActivityTimerCalculator from "../../ActivityTimerCalculator";
import {
  StudentCheckInInstruction,
  TeacherCheckInInstruction,
} from "../../InstructionPageConfig/ShapeChallenge/CheckInIntruction";
import HtmlParser from "react-html-parser";
import { TeacherCheckOutInstruction } from "../../InstructionPageConfig/ShapeChallenge/CheckOutInstruction";
import { excludeParticipant } from "../../ExcludeParticipant";
export const deadlineForActvity = 1 * 60 * 60 * 1000;
const ShowScreenShotData = ({
  img1,
  img2,
  identity1,
  identity2,
  apiData,
  identity,
  instruction,
}) => {
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          clear: "both",
        }}
      >
        <div
          className={styles2.whiteboardContainerInstruction}
          style={{
            width: "94%",
            margin: "auto",
            marginTop: identity === "tutor" ? "5rem" : "1rem",
          }}
        >
          <div
            className={styles2.instructionHeading}
            style={{
              display: identity === "tutor" ? "block" : "none",
              textAlign: "center",
            }}
          >
            {identity === "tutor" && HtmlParser(instruction ?? "")}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "0.8rem",
            marginTop: "1rem",
            flex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontSize: "22px",
              fontWeight: "bold",
              flex: 1,
            }}
          >
            <div>{identity1}</div>
            <div>
              <img src={imageUrl + img1} alt={`${identity1} screenshot`} />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontSize: "22px",
              fontWeight: "bold",
              flex: 1,
            }}
          >
            <div>{identity2}</div>
            <div>
              <img src={imageUrl + img2} alt={`${identity2} screenshot`} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
const TeacherScreen = ({
  checkIn,
  identity,
  remoteParticipants,
  handleCloseActivity,
  shapeActivityStudentResponse,
  whiteBoardPoints,
  remoteSendData,
  IpadState,
  onStudentIpadState,
  renderShapeChallenge,

  tutorName,
  checkInActivityId,
  teacherActivityResponseSaved,
  handleSendTeacherActivityResponse,
  teacherCheckoutResponse,
  studentCheckInResponse,
  apiData,
  showAffirmationNextButton,
  onSendStoriesToStudent,
  setShowEndButton,
  showEndButton,
  studentResponseSaved,
  handleEndCheckInActivity,
  handleEndCheckOutActivity,
}) => {
  let [currentTime, setCurrentTime] = useState(Date.now());
  const [endButton, setEndButton] = useState(false);
  const timerRef = useRef(null);
  const [count, setCount] = useState(0);
  let toolBox = Boolean(checkIn ^ (identity == "tutor"));

  const whiteBoardRef = useRef();
  let search = window.location.search;
  let urlParams = new URLSearchParams(search);
  let liveClassID = urlParams.get("liveClassID");
  const [img, setImg] = useState("");

  const showScreenShot = teacherActivityResponseSaved && !checkIn;
  liveClassID = liveClassID?.trim();
  let keys =
    "activityTimer" + (checkIn ? "Check-In" : "Check-Out") + liveClassID;
  const takeScreenShots = async () => {
    setShowEndButton(false);

    let data = await whiteBoardRef.current.takeScreenShots();
    setImg(data);
    data = b64toBlob(data.split(";base64,")[1], "image/png");
    let student_id = String(remoteParticipants[0])?.split("-")[0];
    let search = window.location.search;
    let urlParams = new URLSearchParams(search);
    let user_id = urlParams.get("userID");
    let formData = new FormData();
    formData.append("student_id", student_id);
    formData.append("teacher_id", user_id);
    formData.append("checkin_activity_id", checkInActivityId);
    formData.append("live_class_id", liveClassID);
    formData.append("duration", count);
    formData.append("response", data, "image.png");
    setEndButton(true);
    await StudentActivityTeacherResponseSave(formData);
    handleEndCheckOutActivity();
    handleSendTeacherActivityResponse();
    clearInterval(timerRef.current);
    await updateStatusofCicoActivity(liveClassID, apiData?.activity_id, count);
  };

  remoteParticipants = remoteParticipants?.filter(
    (item) => !excludeParticipant?.includes(item)
  );
  const [selectedStudent, setSelectedStudent] = useState(0);
  const instruction = checkIn
    ? TeacherCheckInInstruction()
    : TeacherCheckOutInstruction();
  useEffect(() => {
    let value = 0;
    let startTimeUpdate = Date.now();
    try {
      let obj = JSON.parse(localStorage.getItem(keys));

      if (obj) {
        let startTime = obj?.startTime || 0;
        let diff = Date.now() - startTime;
        if (diff >= deadlineForActvity) {
          localStorage.setItem(
            keys,
            JSON.stringify({ startTime: Date.now(), value: 0 })
          );
          value = 0;
        } else {
          value = Number(obj?.value) || 0;
          startTimeUpdate = obj?.startTime;
        }
      } else {
        localStorage.setItem(
          keys,
          JSON.stringify({ startTime: Date.now(), value: 0 })
        );
      }
    } catch (e) {
      localStorage.setItem(
        keys,
        JSON.stringify({ startTime: Date.now(), value: 0 })
      );
    }

    timerRef.current = setInterval(() => {
      setCount((prev) => {
        let value1 = value;

        let timer = Math.floor((Date.now() - currentTime) / 1000);
        timer += value;
        localStorage.setItem(
          keys,
          JSON.stringify({ startTime: startTimeUpdate, value: timer })
        );
        return timer;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);
  const handleClick = (i) => {
    setSelectedStudent(i);
  };
  const [showModal, setShowModal] = useState(false);
  const [showEndActivityLottie, setShowEndActivityLottie] = useState(false);
  const closeModal = () => {
    setShowModal(false);
  };
  const [closedActivity, setClosedActivity] = useState(false);
  const handleEndActivity = () => {
    if (closedActivity) return;
    setShowModal(true);
  };

  const handleActivityStatus = async (i) => {
    if (i) {
      setClosedActivity(true);
      console.log("activity completed api");
      setShowModal(false);
      setShowEndActivityLottie(true);
      handleCloseActivity();
      if (checkIn) {
        handleEndCheckInActivity();
      } else {
        console.log("checkout");
      }
      clearInterval(timerRef.current);
      await updateStatusofCicoActivity(
        liveClassID,
        apiData?.activity_id,
        count
      );
    } else {
      console.log("abborted");
      handleCloseActivity();
      setClosedActivity(true);
      clearTimeout(timerRef.current);
    }
  };
  const [deltaHeight, setDeltaHeight] = useState(0);
  const instructionRef = useRef(null);
  const handleResize = () => {
    if (typeof instructionRef.current === "object") {
      let deltaHeight = instructionRef?.current?.clientHeight;
      setDeltaHeight(deltaHeight);
    }
  };
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const handleClickNextButton = () => {
    onSendStoriesToStudent(true);
  };

  return (
    <>
      {!showAffirmationNextButton &&
        !checkIn &&
        !teacherActivityResponseSaved && (
          <div style={{ position: "absolute", zIndex: 1, right: 0 }}>
            <ActivityButton text={"NEXT"} onClick={handleClickNextButton} />
          </div>
        )}
      {!checkIn &&
        showEndButton &&
        (showAffirmationNextButton || teacherActivityResponseSaved) && (
          <div title={teacherActivityResponseSaved ? "" : "I am Done"}>
            <button
              style={{
                marginLeft: 5,
                padding: 5,

                color: "white",
                borderRadius: 5,
                float: "right",
                position: "absolute",
                zIndex: 1,
                right: 0,
              }}
              onClick={() => {
                !teacherActivityResponseSaved &&
                  !endButton &&
                  takeScreenShots();
              }}
            >
              <img
                src={`/static/media/Closedicon/${
                  teacherActivityResponseSaved || endButton
                    ? "close2"
                    : "close1"
                }.png`}
                style={{ width: 80 }}
              />
            </button>
          </div>
        )}

      {checkIn && (
        <div>
          <button
            style={{
              marginLeft: 5,
              padding: 5,
              position: "absolute",
              right: 0,
              zIndex: 1,
              color: "white",
              borderRadius: 5,
              float: "right",
            }}
            onClick={handleEndActivity}
          >
            <img
              src={`/static/media/Closedicon/${
                closedActivity ? "close2" : "close1"
              }.png`}
              style={{ width: 80 }}
            />
          </button>
        </div>
      )}
      <Modal show={showModal}>
        <Modal.Body>
          <Container>
            <h4>Do you want to complete the activity</h4>
            <Row className="justify-content-center" style={{ gap: "10px" }}>
              <Button
                onClick={() => handleActivityStatus(1)}
                className="primary-button"
                style={{ background: "blue" }}
              >
                Yes : Complete Now
              </Button>
            </Row>
            <Row>
              <Col md={12} className="text-center">
                <Button onClick={closeModal} className="primary-button">
                  Close
                </Button>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>

      <div
        style={{
          padding: 5,

          gap: "2rem",
          alignItems: "center",
        }}
        ref={instructionRef}
      >
        <div
          style={{
            display: "flex",
            gap: "2rem",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            width: "100%",
          }}
        >
          <div>
            <div>
              <div style={{ display: "flex" }}>
                {(() => {
                  let mm1 = Math.floor(count / 60);
                  let ss1 = count % 60;
                  let ss = [Math.floor(ss1 / 10), ss1 % 10];
                  let mm = [Math.floor(mm1 / 10), mm1 % 10];

                  return (
                    <>
                      <div className="ledScreen">
                        <img
                          src={`/static/media/ledNumber/${Number(mm[0]) || 0}_${
                            mm[0] === 1 ? 1 : 2
                          }@1x.png`}
                        />
                      </div>
                      <div className="ledScreen">
                        <img
                          src={`/static/media/ledNumber/${Number(mm[1]) || 0}_${
                            mm[0] === 1 ? 1 : 2
                          }@1x.png`}
                        />
                      </div>
                      <div className="ledScreen">
                        <img src="/static/media/ledNumber/dot_2@1x.png" />
                      </div>
                      <div className="ledScreen">
                        <img
                          src={`/static/media/ledNumber/${Number(ss[0]) || 0}_${
                            mm[0] === 1 ? 1 : 2
                          }@1x.png`}
                        />
                      </div>

                      <div className="ledScreen">
                        <img
                          src={`/static/media/ledNumber/${Number(ss[1]) || 0}_${
                            mm[0] === 1 ? 1 : 2
                          }@1x.png`}
                        />
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
          <div style={{ display: "flex" }}></div>
        </div>
        {(!teacherActivityResponseSaved || checkIn) && (
          <div
            className={styles2.whiteboardContainerInstruction}
            style={{ width: "80%", margin: "1.2rem auto", marginTop: 70 }}
          >
            {checkIn ? (
              <div
                className={styles2.instructionHeading}
                style={{ textAlign: "center", fontSize: 16 }}
              >
                {studentResponseSaved
                  ? HtmlParser(instruction?.instruction2)
                  : HtmlParser(instruction?.instruction1 ?? "")}
              </div>
            ) : (
              <div
                className={styles2.instructionHeading}
                style={{ textAlign: "center", fontSize: 16 }}
              >
                {!showAffirmationNextButton &&
                  (HtmlParser(instruction?.instruction1) ?? "")}
              </div>
            )}
          </div>
        )}
      </div>

      {!showScreenShot ? (
        checkIn ? (
          <ActivityWhiteBoard
            activity={true}
            SelectedCurrentState={3}
            identity={identity}
            ref={whiteBoardRef}
            toolBox={toolBox}
            currentTime={Date.now()}
            remoteSendData={remoteSendData}
            whiteBoardPoints={whiteBoardPoints}
            IpadState={IpadState}
            onStudentIpadState={onStudentIpadState}
            checkIn={checkIn}
            renderShapeChallenge={renderShapeChallenge}
            deltaHeight={deltaHeight}
            apiData={apiData}
          />
        ) : (
          <>
            {showAffirmationNextButton ? (
              <ActivityWhiteBoard
                activity={true}
                SelectedCurrentState={3}
                identity={identity}
                ref={whiteBoardRef}
                toolBox={toolBox}
                currentTime={Date.now()}
                remoteSendData={remoteSendData}
                whiteBoardPoints={whiteBoardPoints}
                IpadState={IpadState}
                onStudentIpadState={onStudentIpadState}
                checkIn={checkIn}
                renderShapeChallenge={renderShapeChallenge}
                deltaHeight={deltaHeight}
                apiData={apiData}
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "90%",
                  margin: "auto",
                  maxHeight: "calc(100% - 200px)",
                  height: "calc(100% - 200px)",
                }}
              >
                <img
                  src={imageUrl + studentCheckInResponse}
                  style={{ objectFit: "contain" }}
                />
              </div>
            )}
          </>
        )
      ) : (
        <ShowScreenShotData
          identity1={String(remoteParticipants[0])?.split("-")[1]}
          identity2={tutorName}
          img1={studentCheckInResponse}
          img2={teacherCheckoutResponse}
          apiData={apiData}
          identity={identity}
          instruction={instruction?.instruction2}
        />
      )}
    </>
  );
};
const StudentScreen = ({
  checkIn,
  identity,
  sendShapeChallengeImage,
  remoteSendData,
  whiteBoardPoints,
  renderShapeChallenge,
  IpadState,
  onStudentIpadState,
  apiData,
  teacherActivityResponseSaved,
  tutorName,
  studentCheckInResponse,
  teacherCheckoutResponse,
  isActivityScreenShotCapture,
  isStudentActivityEnd,
  showAffirmationNextButton,
  isStudentShapeChallengeResponseSaved,
  handleShapeChallengeStudentResponseSaved,
}) => {
  const [balloonLottie, setShowballoonLottie] = useState(false);
  const [savedResponse, setSavedResponse] = useState(false);
  const [endActivity, setEndActivity] = useState(false);
  let toolBox = Boolean(checkIn && !isActivityScreenShotCapture);
  const showScreenShot = !checkIn && teacherActivityResponseSaved;
  const studentTimer = useRef();
  const whiteBoardRef = useRef();
  const instruction = checkIn ? StudentCheckInInstruction() : {};
  const [showEndButton, setShowEndButton] = useState(true);
  const takeScreenShots = async (val) => {
    console.log(endActivity);
    if (endActivity || !showEndButton) return;
    setShowEndButton(false);
    setEndActivity(true);
    let data = await whiteBoardRef.current.takeScreenShots();

    data = b64toBlob(data.split(";base64,")[1], "image/png");
    if (!val) {
      setShowballoonLottie(true);
      let id = setTimeout(() => {
        // setImg(data);
        setShowballoonLottie(false);
        clearTimeout(id);
      }, 3000);
    }
    let search = window.location.search;
    let urlParams = new URLSearchParams(search);
    let liveClassID = urlParams.get("liveClassID");

    let formData = new FormData();
    let studentId = String(identity)?.split("-")[0];
    let checkin_ativity_id = apiData?.activity_id;

    formData.append("student_id", studentId);
    formData.append("live_class_id", liveClassID);
    formData.append("checkin_ativity_id", checkin_ativity_id);
    formData.append("response", data, "image.png");
    formData.append("duration", studentTimer?.current);

    await StudentActivityResponseSave(formData);
    setShowEndButton(true);
    handleShapeChallengeStudentResponseSaved();
    sendShapeChallengeImage(data);
    setSavedResponse(true);
  };
  const [deltaHeight, setDeltaHeight] = useState(0);
  const instructionRef = useRef(null);
  const handleResize = () => {
    if (typeof instructionRef.current === "object") {
      let deltaHeight = instructionRef?.current?.clientHeight;
      setDeltaHeight(deltaHeight);
    }
  };
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    if ((isStudentActivityEnd || endActivity) && !isActivityScreenShotCapture)
      takeScreenShots(true);
  }, [isStudentActivityEnd]);

  return (
    <>
      <ActivityTimerCalculator
        participant={"student"}
        checkIn={checkIn}
        activityName={"shapechallenge"}
        teacherTimerRef={studentTimer}
      />
      {balloonLottie && <BalloonLottie mission={true} applyStyles={true} />}
      {checkIn && showEndButton && (
        <div>
          <button
            style={{
              marginLeft: 5,
              padding: 5,

              color: "white",
              borderRadius: 5,
              float: "right",
            }}
            onClick={() => {
              !isActivityScreenShotCapture && !endActivity && takeScreenShots();
            }}
          >
            <img
              src={`/static/media/Closedicon/${
                isActivityScreenShotCapture || endActivity ? "close2" : "close1"
              }.png`}
              style={{ width: 80 }}
            />
          </button>
        </div>
      )}
      <div
        style={{
          display: "flex",

          marginBottom: "0.2rem",
          justifyContent: "center",
          alignItems: "center",
          marginLeft: checkIn ? "60px" : "95px",
          marginRight: checkIn ? 0 : "95px",
        }}
        ref={instructionRef}
      >
        {(checkIn || !showScreenShot) && (
          <div
            className={styles2.whiteboardContainerInstruction}
            style={{ width: "94%", marginRight: "4% ", marginLeft: "2%" }}
          >
            <div
              className={styles2.instructionHeading}
              style={{ display: "none" }}
            >
              Instruction
            </div>
            <div
              className={styles2.instructionHeading}
              style={{ textAlign: "center" }}
            >
              {checkIn && !isActivityScreenShotCapture ? (
                HtmlParser(instruction?.instruction1 ?? "")
              ) : (
                <div
                  style={{
                    visibility: isActivityScreenShotCapture
                      ? "hidden"
                      : "visible",
                  }}
                >
                  {HtmlParser(instruction?.instruction1 ?? "")}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {!showScreenShot ? (
        checkIn ? (
          <ActivityWhiteBoard
            activity={true}
            SelectedCurrentState={3}
            identity={identity}
            ref={whiteBoardRef}
            toolBox={toolBox}
            currentTime={Date.now()}
            remoteSendData={remoteSendData}
            whiteBoardPoints={whiteBoardPoints}
            renderShapeChallenge={renderShapeChallenge}
            IpadState={IpadState}
            onStudentIpadState={onStudentIpadState}
            checkIn={checkIn}
            rocketLottie={balloonLottie}
            deltaHeight={deltaHeight}
            apiData={apiData}
          />
        ) : (
          <>
            {showAffirmationNextButton ? (
              <ActivityWhiteBoard
                activity={true}
                SelectedCurrentState={3}
                identity={identity}
                ref={whiteBoardRef}
                toolBox={toolBox}
                currentTime={Date.now()}
                remoteSendData={remoteSendData}
                whiteBoardPoints={whiteBoardPoints}
                renderShapeChallenge={renderShapeChallenge}
                IpadState={IpadState}
                onStudentIpadState={onStudentIpadState}
                checkIn={checkIn}
                rocketLottie={balloonLottie}
                deltaHeight={deltaHeight}
                apiData={apiData}
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "90%",
                  margin: "auto",
                  maxHeight: "100%",
                }}
              >
                <img
                  src={imageUrl + studentCheckInResponse}
                  style={{ objectFit: "contain" }}
                />
              </div>
            )}
          </>
        )
      ) : (
        <ShowScreenShotData
          img2={teacherCheckoutResponse}
          img1={studentCheckInResponse}
          identity2={tutorName}
          identity1={String(identity)?.split("-")[1]}
          apiData={apiData}
          identity={identity}
        />
      )}
    </>
  );
};
export default function ShapeChallengeCheckInActivity({
  identity,
  drawingComplete,
  url,
  isCheckInActivity,
  remoteParticipants,
  notification,
  handleShowActivityNotification,
  handleCloseActivity,
  sendShapeChallengeImage,
  shapeActivityStudentResponse,
  remoteSendData,
  whiteBoardPoints,
  renderShapeChallenge,
  IpadState,
  onStudentIpadState,
  apiData,
  checkInActivityId,
  tutorName,
  teacherActivityResponseSaved,
  handleSendTeacherActivityResponse,
  showEndActivityAnimation,
  isActivityScreenShotCapture,
  isStudentActivityEnd,
  showAffirmationNextButton,
  showAffirmationStories,
  onSendStoriesToStudent,
  handleShapeChallengeStudentResponseSaved,
  isStudentShapeChallengeResponseSaved,
  handleEndCheckInActivity,
  handleEndCheckOutActivity,
}) {
  const [showModal, setShowModal] = useState(false);
  const [isCheckInActivityCompleted, setIsCheckInActivityCompleted] =
    useState(false);
  const [isStudentResponseCapture, setIsStudentResponseCapture] = useState(
    isActivityScreenShotCapture
  );
  const [showNextButton, setShowNextButton] = useState();
  const [showEndButton, setShowEndButton] = useState(true);
  const [studentResponseSaved, setStudentResponseSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  let checkin = isCheckInActivity;

  const [teacherCheckoutResponse, setTeacherCheckoutResponse] = useState("");
  const [studentCheckInResponse, setStudentCheckInResponse] = useState("");
  const [isTeacherResponseSaved, setIsTeacherResponseSaved] = useState(
    teacherActivityResponseSaved
  );
  console.log(isCheckInActivity);
  const findResponse = async () => {
    try {
      let search = window.location.search;
      let urlParams = new URLSearchParams(search);
      let liveClassID = urlParams.get("liveClassID");
      let student_id = urlParams.get("userID");
      if (identity === "tutor")
        student_id = String(remoteParticipants[0])?.split("-")[0];
      let { data } = await getStudentActivityResponse(student_id, liveClassID);

      setShowEndButton(true);
      if (data.status) {
        let img = data?.checkout_responses?.teacher[0]?.response;
        let img2 = data?.checkin_responses?.student[0]?.response;

        if (Boolean(img2)) {
          setStudentCheckInResponse(img2);
          setStudentResponseSaved(true);
          setIsStudentResponseCapture(true);
          setIsCheckInActivityCompleted(true);
        }
        if (Boolean(img)) {
          setIsTeacherResponseSaved(true);
          setShowNextButton(true);
          setTeacherCheckoutResponse(img);
        }
      } else {
      }
    } catch (e) {}
  };
  useEffect(() => {
    findResponse();
  }, [teacherActivityResponseSaved, isActivityScreenShotCapture]);
  useEffect(() => {
    console.log("calling");
    console.log(isStudentShapeChallengeResponseSaved);
    if (isStudentShapeChallengeResponseSaved) {
      console.log("calling2");
      findResponse();
    }
  }, [isStudentShapeChallengeResponseSaved]);
  return (
    <>
      {(!showModal || !isCheckInActivity) && (
        <div>
          {!isCheckInActivity && isTeacherResponseSaved && (
            <div
              style={{
                position: "absolute",
                bottom: "-40px",
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <img
                src="/static/media/GifImages/character.gif"
                style={{ maxHeight: "100%", width: 400, display: "block" }}
              />
            </div>
          )}
          {showEndActivityAnimation && <BalloonLottie />}
          {loading ? (
            <h1>Loading....</h1>
          ) : !isCheckInActivityCompleted && !isCheckInActivity ? (
            <div style={{ width: "95%", margin: "auto" }}>
              <h1>
                Look like you did'nt submit checkin response, without submitting
                check-in response you cannot go checkout activity so please
                complete checkin activity first.
              </h1>
            </div>
          ) : identity == "tutor" ? (
            <TeacherScreen
              checkIn={checkin}
              identity={identity}
              remoteParticipants={remoteParticipants}
              handleCloseActivity={handleCloseActivity}
              sendShapeChallengeImage={sendShapeChallengeImage}
              shapeActivityStudentResponse={shapeActivityStudentResponse}
              remoteSendData={remoteSendData}
              whiteBoardPoints={whiteBoardPoints}
              IpadState={IpadState}
              onStudentIpadState={onStudentIpadState}
              renderShapeChallenge={renderShapeChallenge}
              apiData={apiData}
              checkInActivityId={checkInActivityId}
              tutorName={tutorName}
              teacherActivityResponseSaved={isTeacherResponseSaved}
              handleSendTeacherActivityResponse={
                handleSendTeacherActivityResponse
              }
              teacherCheckoutResponse={teacherCheckoutResponse}
              studentCheckInResponse={studentCheckInResponse}
              isActivityScreenShotCapture={isStudentResponseCapture}
              isStudentActivityEnd={isStudentActivityEnd}
              showAffirmationNextButton={
                showAffirmationStories || showNextButton
              }
              onSendStoriesToStudent={onSendStoriesToStudent}
              setShowEndButton={setShowEndButton}
              showEndButton={showEndButton}
              isStudentShapeChallengeResponseSaved={
                isStudentShapeChallengeResponseSaved
              }
              studentResponseSaved={studentResponseSaved}
              handleEndCheckOutActivity={handleEndCheckOutActivity}
              handleEndCheckInActivity={handleEndCheckInActivity}
            />
          ) : (
            <StudentScreen
              checkIn={checkin}
              identity={identity}
              sendShapeChallengeImage={sendShapeChallengeImage}
              remoteSendData={remoteSendData}
              whiteBoardPoints={whiteBoardPoints}
              renderShapeChallenge={renderShapeChallenge}
              IpadState={IpadState}
              onStudentIpadState={onStudentIpadState}
              apiData={apiData}
              checkInActivityId={checkInActivityId}
              tutorName={tutorName}
              teacherActivityResponseSaved={isTeacherResponseSaved}
              teacherCheckoutResponse={teacherCheckoutResponse}
              isActivityScreenShotCapture={isStudentResponseCapture}
              studentCheckInResponse={studentCheckInResponse}
              isStudentActivityEnd={isStudentActivityEnd}
              showAffirmationNextButton={
                showAffirmationStories || showNextButton
              }
              handleShapeChallengeStudentResponseSaved={
                handleShapeChallengeStudentResponseSaved
              }
              isStudentShapeChallengeResponseSaved={
                isStudentShapeChallengeResponseSaved
              }
            />
          )}
        </div>
      )}
    </>
  );
}
