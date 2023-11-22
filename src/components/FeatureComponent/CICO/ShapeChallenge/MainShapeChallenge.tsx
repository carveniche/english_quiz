import React, { useEffect, useRef, useState } from "react";
import { isStudentName, isTutor } from "../../../../utils/participantIdentity";
import { CICO, SHAPECHALLENGE } from "../../../../constants";
import ActivityTimerEndButton from "../ActivityTimerEndButton";
import {
  StudentCheckInInstruction,
  TeacherCheckInInstruction,
} from "./Instruction/CheckInInstruction";
import {
  StudentCheckOutInstruction,
  TeacherCheckOutInstruction,
} from "./Instruction/CheckoutInstruction";
import HelperWhiteBoard from "../../../WhiteBoardHelper/HelperWhiteBoard";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import StudentActivityTimer from "../StudentActivityTimer";
import b64toBlob from "../b64toBlob";
import {
  StudentActivityResponseSave,
  StudentActivityTeacherResponseSave,
  getStudentActivityResponse,
  imageUrl,
  updateStatusofCicoActivity,
} from "../../../../api";
import BalloonLottie from "../../../LottieTransformation/BalloonLottie";
import { useDispatch } from "react-redux";
import { cicoComponentLevelDataTrack } from "../../../../redux/features/ComponentLevelDataReducer";
import useSpeakerViewParticipants from "../../../../hooks/useSpeakerViewParticipants/useSpeakerViewParticipants";
import { allExcludedParticipants } from "../../../../utils/excludeParticipant";
const ShowScreenShotData = ({ img1, img2, identity1, identity2 }) => {
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
            <div style={{ border: "2px solid indigo" }}>
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
            <div style={{ border: "2px solid indigo" }}>
              <img src={imageUrl + img2} alt={`${identity2} screenshot`} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
const StudentScreen = ({
  apiData,
  activityType,
  checkInImg,
  checkOutImg,
  tutorName,
  studentName,
  userId,
  liveClassId,
}) => {
  const { otherData } = useSelector(
    (state: RootState) => state.ComponentLevelDataReducer
  );
  const { currentSelectedRouter, currentSelectedKey } = useSelector(
    (state: RootState) => state.activeTabReducer
  );
  const timerRef = useRef({ count: 0, id: 0 });
  const [mounted, setMounted] = useState(false);
  const instruction =
    activityType === CICO.checkIn
      ? StudentCheckInInstruction()
      : StudentCheckOutInstruction();
  const [balloonLottie, setBalloonLottie] = useState(false);
  const savedAnswerRef = useRef(false);
  const whiteBoardRef = useRef(null);
  const handleSubmit = () => {
    if (savedAnswerRef.current || checkInImg) return;
    savedAnswerRef.current = true;
    const uri = whiteBoardRef.current.toDataURL();
    setBalloonLottie(true);
    const data = b64toBlob(uri.split(";base64,")[1], "image/png");
    handleApiCall(data);
  };
  const animationRef = useRef();
  const handleApiCall = async (data) => {
    let formData = new FormData();
    let checkin_ativity_id = apiData?.activity_id;
    formData.append("student_id", userId);
    formData.append("live_class_id", liveClassId);
    formData.append("checkin_ativity_id", checkin_ativity_id);
    formData.append("response", data, "image.png");
    formData.append("duration", timerRef?.current.count);

    animationRef.current = setTimeout(() => {
      setBalloonLottie(false);
      clearTimeout(animationRef.current);
    }, 5000);
    await StudentActivityResponseSave(formData);
  };
  const heightRef = useRef();
  useEffect(() => {
    if (CICO.checkIn) return;
    if (otherData?.endCheckInResponse) {
      clearTimeout(animationRef.current);
      handleSubmit();
    }
    return () => clearTimeout(animationRef.current);
  }, [otherData?.endCheckInResponse]);
  useEffect(() => {
    if (CICO.checkIn) {
      if (otherData?.endCheckInResponse && mounted) {
        handleSubmit();
      }
      setMounted(true);
    }
  }, [otherData?.endCheckInResponse]);
  return (
    <>
      {balloonLottie && <BalloonLottie mission={true} applyStyles={true} />}
      <div className="w-full h-full">
        <>
          {activityType === CICO.checkIn ? (
            <>
              <div ref={heightRef}>
                <StudentActivityTimer
                  instruction={
                    otherData?.endCheckInResponse
                      ? ""
                      : instruction.instruction1
                  }
                  timerRef={timerRef}
                  showEndButton={true}
                  isClosed={
                    otherData.endCheckInResponse ||
                    checkInImg ||
                    savedAnswerRef.current
                      ? true
                      : false
                  }
                  activityType={activityType}
                  isBadgesVisible={false}
                  handleSubmit={
                    otherData?.endCheckInResponse ||
                    checkInImg ||
                    savedAnswerRef.current
                      ? () => {}
                      : handleSubmit
                  }
                />
              </div>
              {checkInImg ? (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      width: "90%",
                      margin: "auto",
                      maxHeight: "calc(100% - 200px)",
                      height: "calc(100% - 200px)",
                      border: "2px solid indigo",
                    }}
                  >
                    <img
                      src={imageUrl + checkInImg}
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                </>
              ) : (
                <div className="w-full" style={{ height: `calc(100%)` }}>
                  <HelperWhiteBoard
                    dataTrackKey={
                      SHAPECHALLENGE.shapeChallengeCheckInWhiteBoard
                    }
                    isWritingDisabled={
                      otherData?.endCheckInResponse || savedAnswerRef.current
                    }
                    isCico={true}
                    images={
                      apiData?.activity_data?.map((item) => item.image) || []
                    }
                    pathName={currentSelectedRouter}
                    key={currentSelectedKey}
                    whiteBoardRef={whiteBoardRef}
                  />
                </div>
              )}
            </>
          ) : (
            <>
              <div ref={heightRef}>
                <StudentActivityTimer
                  instruction={instruction.instruction1}
                  timerRef={timerRef}
                  showEndButton={
                    otherData?.endCheckInResponse ||
                    checkInImg ||
                    savedAnswerRef.current
                      ? false
                      : true
                  }
                  activityType={activityType}
                  isBadgesVisible={false}
                  handleSubmit={
                    otherData?.endCheckInResponse ||
                    checkInImg ||
                    savedAnswerRef.current
                      ? () => {}
                      : handleSubmit
                  }
                />
              </div>
              {otherData.isHideNextButton ? (
                <>
                  {otherData?.endCheckOutResponse && checkOutImg ? (
                    <>
                      <>
                        <ShowScreenShotData
                          img1={checkInImg}
                          img2={checkOutImg}
                          identity1={studentName}
                          identity2={tutorName}
                        />
                      </>
                    </>
                  ) : (
                    <div className="w-full" style={{ height: `calc(100%)` }}>
                      <HelperWhiteBoard
                        dataTrackKey={
                          SHAPECHALLENGE.shapeChallengeCheckOutWhiteBoard
                        }
                        isWritingDisabled={true}
                        isCico={true}
                        images={
                          apiData?.activity_data?.map((item) => item.image) ||
                          []
                        }
                        pathName={currentSelectedRouter}
                        key={currentSelectedKey}
                        whiteBoardRef={whiteBoardRef}
                      />
                    </div>
                  )}
                </>
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
                    src={imageUrl + checkInImg}
                    style={{ objectFit: "contain" }}
                  />
                </div>
              )}
            </>
          )}
        </>
      </div>
    </>
  );
};
const TeacherScreen = ({
  activityType,
  apiData,
  handleDataTrack,
  checkInImg,
  checkOutImg,
  tutorName,
  studentName,
  userId,
  liveClassId,
  students,
}) => {
  const dispatch = useDispatch();
  const { otherData } = useSelector(
    (state: RootState) => state.ComponentLevelDataReducer
  );
  const heightRef = useRef();
  const [currentHeight, setCurrentHeight] = useState(0);
  const { currentSelectedRouter, currentSelectedKey } = useSelector(
    (state: RootState) => state.activeTabReducer
  );
  const timerCountRef = useRef();
  const timerRef = useRef();
  const instruction =
    activityType === CICO.checkIn
      ? TeacherCheckInInstruction()
      : TeacherCheckOutInstruction();
  useEffect(() => {
    setCurrentHeight(heightRef.current.clientHeight || 2);
  }, []);
  const [submitAnswer, setSubmitAnswer] = useState(false);
  const handleEndCheckInActivity = () => {
    if (submitAnswer) return;
    setSubmitAnswer(true);
    dispatch(cicoComponentLevelDataTrack({ showAnimation: true }));
    handleDataTrack({
      data: {
        endCheckInResponse: true,
        showAnimation: true,
      },
      key: CICO.checkIn,
    });
    handleEndApiCall();
  };

  const handleEndApiCall = async () => {
    updateStatusofCicoActivity(
      liveClassId,
      apiData?.activity_id,
      timerCountRef.current
    );
  };
  const handleClickNext = () => {
    dispatch(cicoComponentLevelDataTrack({ isHideNextButton: true }));
    handleDataTrack({
      data: {
        isHideNextButton: true,
      },
      key: CICO.checkOut,
    });
  };
  const handleApiCall = async (data) => {
    let formData = new FormData();
    let studentId = students[0]?.id || "";
    formData.append("student_id", studentId);
    formData.append("teacher_id", userId);
    formData.append("checkin_activity_id", apiData?.activity_id);
    formData.append("live_class_id", liveClassId);
    formData.append("duration", timerCountRef.current);
    formData.append("response", data, "image.png");
    await StudentActivityTeacherResponseSave(formData);
    dispatch(
      cicoComponentLevelDataTrack({
        endCheckOutResponse: true,
        showAnimation: true,
      })
    );
    handleDataTrack({
      data: {
        endCheckOutResponse: true,
        showAnimation: true,
      },
      key: CICO.checkOut,
    });
  };
  const handleCheckOutActivity = async () => {
    if (submitAnswer || otherData?.endCheckOutResponse) return;
    setSubmitAnswer(true);
    const uri = whiteBoardContainerRef.current.toDataURL();

    const data = b64toBlob(uri.split(";base64,")[1], "image/png");
    handleApiCall(data);
  };
  const whiteBoardContainerRef = useRef();
  return (
    <>
      <div className="w-full h-full">
        <>
          {activityType === CICO.checkIn ? (
            <>
              <div ref={heightRef}>
                <ActivityTimerEndButton
                  instruction={instruction.instruction1}
                  timerCountRef={timerCountRef}
                  timerRef={timerRef}
                  showEndButton={true}
                  handleEndActivity={
                    otherData?.endCheckInResponse || submitAnswer
                      ? () => {}
                      : handleEndCheckInActivity
                  }
                  enabledEndButton={
                    otherData?.endCheckInResponse || submitAnswer ? false : true
                  }
                />
              </div>
              {currentHeight &&
                (checkInImg ? (
                  <>
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
                        src={imageUrl + checkInImg}
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                  </>
                ) : (
                  <div
                    className="w-full"
                    style={{
                      height: `calc(100% - ${currentHeight / 2 + 20}px)`,
                    }}
                  >
                    <HelperWhiteBoard
                      dataTrackKey={
                        SHAPECHALLENGE.shapeChallengeCheckInWhiteBoard
                      }
                      isWritingDisabled={true}
                      isCico={true}
                      images={
                        apiData?.activity_data?.map((item) => item.image) || []
                      }
                      pathName={currentSelectedRouter}
                      key={currentSelectedKey}
                    />
                  </div>
                ))}
            </>
          ) : (
            <>
              <div ref={heightRef}>
                <ActivityTimerEndButton
                  instruction={
                    !otherData?.isHideNextButton
                      ? instruction.instruction1
                      : checkOutImg
                      ? instruction.instruction2
                      : ""
                  }
                  timerCountRef={timerCountRef}
                  timerRef={timerRef}
                  showEndButton={otherData.isHideNextButton ? true : false}
                  handleEndActivity={
                    !otherData.isHideNextButton
                      ? () => {}
                      : otherData?.endCheckOutResponse || submitAnswer
                      ? () => {}
                      : handleCheckOutActivity
                  }
                  enabledEndButton={
                    otherData?.endCheckOutResponse || submitAnswer
                      ? false
                      : true
                  }
                  showNextButton={otherData.isHideNextButton ? false : true}
                  text={otherData.isHideNextButton ? "" : "Next"}
                  handleClickNext={handleClickNext}
                />
                {otherData.isHideNextButton ? (
                  <>
                    {otherData.endCheckOutResponse && checkOutImg ? (
                      <>
                        <ShowScreenShotData
                          img1={checkOutImg}
                          img2={checkInImg}
                          identity1={tutorName}
                          identity2={studentName}
                        />
                      </>
                    ) : (
                      <>
                        <div
                          className="w-full"
                          style={{
                            height: `calc(100% - ${currentHeight / 2 + 20}px)`,
                          }}
                        >
                          <HelperWhiteBoard
                            isWritingDisabled={otherData?.endCheckOutResponse}
                            dataTrackKey={
                              SHAPECHALLENGE.shapeChallengeCheckOutWhiteBoard
                            }
                            isCico={true}
                            images={
                              apiData?.activity_data?.map(
                                (item) => item.image
                              ) || []
                            }
                            pathName={currentSelectedRouter}
                            key={currentSelectedKey}
                            whiteBoardRef={whiteBoardContainerRef}
                          />
                        </div>
                      </>
                    )}
                  </>
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
                      src={imageUrl + checkInImg}
                      style={{
                        objectFit: "contain",
                        border: "2px solid indigo",
                      }}
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </>
      </div>
    </>
  );
};
export default function MainShapeChallenge({
  identity,
  apiData,
  userId,
  students,
  liveClassId,
  activityType,
  handleDataTrack,
}) {
  const [checkInImg, setCheckInImg] = useState("");
  const [checkOutImg, setCheckOutImg] = useState("");
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { otherData } = useSelector(
    (state: RootState) => state.ComponentLevelDataReducer
  );
  const fetchResponse = async () => {
    if (CICO.checkIn === activityType && checkInImg) return;
    else if (CICO.checkOut === activityType && checkOutImg) return;
    let liveClassID = liveClassId;
    let student_id = userId;
    if (identity === "tutor") student_id = students[0]?.id || "";
    let { data } = await getStudentActivityResponse(student_id, liveClassID);
    if (data.status) {
      let img = data?.checkin_responses?.student[0]?.response || "";
      let img2 = data?.checkout_responses?.teacher[0]?.response || "";
      console.log({ img2 });
      setCheckInImg(img);
      setCheckOutImg(img2);
      if (img) {
        dispatch(
          cicoComponentLevelDataTrack({
            endCheckInResponse: true,
          })
        );
      }
      if (img2) {
        dispatch(
          cicoComponentLevelDataTrack({
            endCheckOutResponse: true,
          })
        );
      }
    }
    setLoading(false);
  };
  useEffect(() => {
    console.log("working", otherData?.endCheckOutResponse);
    fetchResponse();
  }, [otherData?.endCheckOutResponse]);
  useEffect(() => {
    let id;
    if (otherData?.showAnimation) {
      id = setTimeout(() => {
        dispatch(cicoComponentLevelDataTrack({ showAnimation: false }));
      }, 5000);
      return () => {
        console.log("demounted");
        clearTimeout(id);
        dispatch(cicoComponentLevelDataTrack({ showAnimation: false }));
      };
    }
  }, [otherData?.showAnimation]);
  const { role_name, teacher_name } = useSelector(
    (state: RootState) => state.videoCallTokenData
  );
  const [studentName, setStudentName] = useState("");
  useEffect(() => {
    if (isTutor({ identity })) {
      setStudentName(students[0]?.name || "");
    } else setStudentName(isStudentName({ identity: `${role_name}` }));
  }, []);

  return (
    <>
      {loading ? (
        <>
          <h1>Loading....</h1>
        </>
      ) : (
          CICO.checkOut === activityType ? (checkInImg ? true : false) : true
        ) ? (
        <div className="w-full h-full relative">
          {otherData?.endCheckOutResponse && otherData?.isHideNextButton && (
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
          {otherData?.showAnimation && <BalloonLottie />}
          {isTutor({ identity: identity }) ? (
            <TeacherScreen
              activityType={activityType}
              apiData={apiData}
              checkInImg={checkInImg}
              checkOutImg={checkOutImg}
              handleDataTrack={handleDataTrack}
              tutorName={teacher_name}
              studentName={studentName}
              liveClassId={liveClassId}
              userId={userId}
              students={students}
            />
          ) : (
            <StudentScreen
              activityType={activityType}
              apiData={apiData}
              checkInImg={checkInImg}
              checkOutImg={checkOutImg}
              tutorName={teacher_name}
              studentName={studentName}
              liveClassId={liveClassId}
              userId={userId}
            />
          )}
        </div>
      ) : (
        <div style={{ width: "95%", margin: "auto" }}>
          <h1>
            Look like you did'nt submit checkin response, without submitting
            check-in response you cannot go checkout activity so please complete
            checkin activity first.
          </h1>
        </div>
      )}
    </>
  );
}
