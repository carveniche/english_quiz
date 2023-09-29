import { useEffect, useRef, useState } from "react";
import { allExcludedParticipants } from "../../../../utils/excludeParticipant";
import {
  StudentActivityResponseSave,
  baseURL,
  getStudentActivityResponse,
  submitErrorLog,
  updateStatusofCicoActivity,
} from "../../../../api";
import { CICO } from "../../../../constants";
import AffirmationSelection from "./AffirmationSelection";
import {
  StudentCheckInInstruction,
  TeacherCheckInInstruction,
} from "./CheckInIntruction";
import {
  StudentCheckOutInstruction,
  TeacherCheckOutInstruction,
} from "./CheckOutInstruction";
import ActivityTimerEndButton from "../ActivityTimerEndButton";
import StudentActivityTimer from "../StudentActivityTimer";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { useDispatch } from "react-redux";
import { cicoComponentLevelDataTrack } from "../../../../redux/features/ComponentLevelDataReducer";
import AnimatedAnimationStories from "./AnimatedAnimationStories";
import html2canvas from "html2canvas";
import PreviewModal from "./PreviewModal";
import LoadingIndicatorModal from "../LoadingIndicatorModal";
import HtmlParser from "react-html-parser";
import AudioAnaylyzer from "./AudioAnalyzer/AudioAnaylyzer";
import EndActivityShowModal from "../ConfirmationModal/EndActivityShowModal";
import b64toBlob from "../b64toBlob";
import BalloonLottie from "../../../LottieTransformation/BalloonLottie";
const CheckOutAffirmationActivity = ({
  identity,
  listOfAffirmation,
  micRef,
  handleDataTrack,
  userId,
  liveClassId,
  student,
  timerCountRef,
  apiData,
}) => {
  let newListOfAffirmation = listOfAffirmation.map((item) => ({
    ...item,
    image: item?.selected_checkin_path,
    name: item.selected_checkin_name,
  }));
  const { otherData } = useSelector(
    (state: RootState) => state.ComponentLevelDataReducer
  );
  const [count, setCount] = useState(1);
  const [disableCount, setDisableCount] = useState(false);
  const [retake, setRetake] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [indicatorText, setIndicatorText] = useState("");
  const [img, setImg] = useState("");
  useEffect(() => {
    let id = setInterval(() => {
      setCount((prev: number) => {
        let newValue = prev + 1;
        if (newValue > 3) {
          clearTimeout(id);
          setDisableCount(true);
        }

        return newValue;
      });
    }, 1000);

    return () => clearInterval(id);
  }, []);
  let instruction = TeacherCheckOutInstruction();

  const takeScreenShot = () => {
    setLoading(true);
    setIndicatorText("Image is capturing...");
    let element = document.querySelector("#videoStudentElement");

    if (!element) {
      alert("Please wait for student joining");
      setLoading(false);
      return;
    }

    html2canvas(element || document.createElement("div"), {
      scale: 1,
    })
      .then((canvas) => {
        var img = canvas.toDataURL("image/png");
        setShowPreview(true);
        setImg(img);
        let audio = new Audio("/static/media/Audio/camera.mp3");
        // audio.play();
        setLoading(false);
        setIndicatorText("");
      })
      .catch((err) => {
        console.log("Screen shot failed", err);
        alert("Please wait for student joining");
        setLoading(false);
        setIndicatorText("");
      });
  };
  const handleClosePreviewModal = () => {
    setShowPreview(false);
    setRetake(true);
    setImg("");
  };
  const dispatch = useDispatch();
  const takeScreenShot2 = (id: string) => {
    setShowPreview(false);
    html2canvas(document.querySelector(id), {
      scale: 1,
      useCORS: true,
      logging: true,
    })
      .then(async (canvas) => {
        var img = canvas.toDataURL("image/png");

        handleDataTrack({
          data: {
            isCheckoutTeacherResponseSaved: true,
            isHideCheckOutButton: true,
          },
          key: CICO.checkOut,
        });
        let formData = new FormData();
        let blob = b64toBlob(img.split(";base64,")[1], "image/png");
        formData.append("student_id", student[0].id);
        formData.append("teacher_id", userId);
        formData.append("checkin_activity_id", apiData?.activity_id);
        formData.append("live_class_id", liveClassId);
        formData.append("duration", timerCountRef.current);
        formData.append("response", blob, "image.png");
        StudentActivityResponseSave(formData)
          .then((res) => {
            dispatch(
              cicoComponentLevelDataTrack({
                isCheckoutTeacherResponseSaved: true,
              })
            );
            handleDataTrack({
              data: {
                isCheckoutTeacherResponseSaved: true,
                isHideCheckOutButton: true,
              },
              key: CICO.checkOut,
            });
          })
          .catch((e) => {
            submitErrorLog(
              userId,
              liveClassId,
              e?.message || `not able to saved teacher response ${apiData?.id}`,
              apiData?.id,
              "0"
            );
          });
      })
      .catch((err) => {
        console.log("Screen shot failed", err);
        setLoading(false);
      });
  };
  const handleConfirm = () => {
    takeScreenShot2("#badgesWithImages");
  };
  if (otherData.isEndCheckOutActivity)
    return (
      <>
        <h1 style={{ clear: "both", textAlign: "center" }}>
          Activity is Completed
        </h1>
      </>
    );
  return otherData?.checkInOutImageUrl ? (
    <>
      {identity === "tutor" ? (
        <div
          className="flex flex flex-col items-center"
          style={{ gap: "0.5rem" }}
        >
          <div style={{ textAlign: "center" }}>{instruction.instruction4}</div>
          <div style={{ textAlign: "center" }}>{instruction.instruction5}</div>
          <div style={{ textAlign: "center" }}>
            <img
              src={baseURL + otherData?.checkInOutImageUrl}
              style={{ maxWidth: 250 }}
            />
          </div>
          <div style={{ textAlign: "center" }}>{instruction.instruction6}</div>
          <div style={{ textAlign: "center" }}>
            {HtmlParser(instruction.instruction7)}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center" style={{ gap: "0.5rem" }}>
          <div style={{ textAlign: "center" }}>
            <img
              src={baseURL + otherData?.checkInOutImageUrl}
              style={{ maxWidth: 250 }}
            />
          </div>
        </div>
      )}
    </>
  ) : (
    <>
      {loading && <LoadingIndicatorModal text={indicatorText} />}
      {showPreview && (
        <PreviewModal
          img={img}
          onClose={handleClosePreviewModal}
          onConfirm={handleConfirm}
          badges={newListOfAffirmation[0]?.image}
        />
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "2rem",
        }}
      >
        {!disableCount && (
          <div>
            <h3 style={{ fontSize: 23, fontWeight: "bold" }}>
              Say it loud {count}
            </h3>
          </div>
        )}
        <AffirmationSelection
          affirmation={newListOfAffirmation}
          currentIndex={0}
          className={"container"}
          checkIn={false}
          micRef={micRef}
        />
      </div>
      {disableCount && (
        <div
          style={{
            display: "flex",
            gap: "0.1rem",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "1rem",
          }}
        >
          {identity === "tutor" && (
            <>
              <div
                style={{
                  fontSize: "16px",
                }}
              >
                {instruction?.instruction2}
              </div>
              <div style={{ fontSize: "16px" }}>
                {instruction?.instruction3}
              </div>
              <button
                onClick={takeScreenShot}
                style={{
                  padding: 5,

                  color: "white",
                  borderRadius: 5,
                  display: "block",
                }}
              >
                {retake ? (
                  <button
                    style={{
                      padding: 5,
                      borderRadius: 10,
                      background: "yellowgreen",
                      fontWeight: "normal",
                      color: "black",
                    }}
                  >
                    Retake
                  </button>
                ) : (
                  <img
                    src="/static/media/camera1.png"
                    style={{
                      width: "60px",
                    }}
                  />
                )}
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
};
const StoriesToShow = ({ apiData, identity, handleDataTrack }) => {
  const { otherData }: { otherData: any } = useSelector(
    (state: RootState) => state.ComponentLevelDataReducer
  );
  const [storiesData, setStoriesData] = useState([]);
  useEffect(() => {
    let data = apiData || [];
    data = data[0];
    setStoriesData(data?.story_question_data || []);
  }, [apiData?.length]);
  return (
    <>
      <div
        style={{
          float: "left",
        }}
      ></div>
      {otherData?.isTeacherEndCheckInActivity ? (
        <h1 style={{ clear: "both", textAlign: "center" }}>
          Activity is Completed
        </h1>
      ) : (
        <AnimatedAnimationStories
          identity={identity || ""}
          stories={storiesData}
          currentPage={otherData?.currentPage || 0}
          isTeacherEndCheckInActivity={
            otherData.isTeacherEndCheckInActivity || false
          }
          handleDataTrack={handleDataTrack}
        />
      )}
    </>
  );
};
function AffirmationStudentScreen({
  apiData,
  listOfAffirmation,
  activityType,
  handleDataTrack,
  checkOutData,
  micRef,
  userId,
  liveClassId,
}) {
  const [currentSelectAffirmation, setCurrentSelectAffirmation] = useState(-1);
  const dispatch = useDispatch();
  const isResponseSavedRef = useRef(false);
  const { otherData } = useSelector(
    (state: RootState) => state.ComponentLevelDataReducer
  );
  useEffect(() => {
    isResponseSavedRef.current = false;
  }, [otherData.isCheckForResponse]);
  const timerRef = useRef({ id: null, count: 0 });
  let instruction =
    activityType === CICO.checkIn
      ? StudentCheckInInstruction()
      : StudentCheckOutInstruction();
  const handleAffirmationSelect = (val: number) => {
    setCurrentSelectAffirmation(val);
  };
  const handleSubmitCheckInResponse = async (from: string) => {
    if (otherData?.isCheckInSaveResponse || isResponseSavedRef.current) {
      return;
    }
    let val = currentSelectAffirmation;
    if (from === "tutor" && val == -1) {
      val = 0;
    }
    if (val === -1) {
      alert("please choose one of the affirmation");
      return;
    }
    isResponseSavedRef.current = true;
    let formData = new FormData();
    formData.append("student_id", userId);
    formData.append("checkin_ativity_id", apiData.activity_id);
    formData.append("live_class_id", liveClassId);
    formData.append("duration", `${timerRef.current.count}`);
    formData.append(
      "checkin_out_activity_category_id",
      listOfAffirmation[val].category_id
    );
    try {
      const { data } = await StudentActivityResponseSave(formData);
      if (!data.status) await submitErrorLog("", "", "", "", "0");

      dispatch(
        cicoComponentLevelDataTrack({
          isCheckForResponse: !otherData.isCheckForResponse,
          showCheckInAnimation: true,
        })
      );
      handleDataTrack({
        data: {
          isCheckForResponse: !otherData.isCheckForResponse,
        },
        key: CICO.checkIn,
      });
    } catch (e) {
      alert("something went wrong please try again letter");
      await submitErrorLog("", "", "", "", "0");
    }
  };

  return (
    <>
      <div>
        {activityType === CICO.checkIn ? (
          <>
            <StudentActivityTimer
              showEndButton={true}
              isShowCornerImage={otherData?.isShowStories ? true : false}
              activityType={activityType}
              isBadgesVisible={otherData?.isShowStories ? true : false}
              selectedItem={listOfAffirmation[0]}
              currentTime={Date.now()}
              timerRef={timerRef}
              instruction={
                activityType == CICO.checkIn
                  ? otherData?.isCheckInSaveResponse
                    ? ""
                    : `${instruction?.instruction1}`
                  : ""
              }
              handleSubmit={
                otherData.isCheckInSaveResponse
                  ? () => {}
                  : handleSubmitCheckInResponse
              }
              isClosed={otherData.isCheckInSaveResponse}
            />
            {otherData?.isShowStories ? (
              <StoriesToShow
                identity={"student"}
                handleDataTrack={() => {}}
                apiData={listOfAffirmation}
              />
            ) : (
              <AffirmationSelection
                affirmation={listOfAffirmation}
                currentIndex={currentSelectAffirmation}
                className={"container"}
                checkIn={CICO.checkIn}
                micRef={null}
                onClick={
                  activityType === CICO.checkIn &&
                  !otherData?.isCheckInSaveResponse
                    ? handleAffirmationSelect
                    : null
                }
              />
            )}
          </>
        ) : (
          <>
            <StudentActivityTimer
              showEndButton={false}
              isShowCornerImage={true}
              activityType={activityType}
              isBadgesVisible={true}
              selectedItem={checkOutData}
              currentTime={Date.now()}
              timerRef={timerRef}
              instruction={
                otherData?.isCheckoutTeacherResponseSaved
                  ? ""
                  : `${instruction?.instruction1}`
              }
              handleSubmit={() => {}}
              isClosed={false}
            />
            {otherData?.isHideCheckOutButton ? (
              <CheckOutAffirmationActivity
                identity={"student"}
                listOfAffirmation={[checkOutData]}
                micRef={micRef}
                handleDataTrack={handleDataTrack}
                userId={userId}
                liveClassId={liveClassId}
              />
            ) : (
              <AffirmationSelection
                affirmation={[
                  {
                    ...checkOutData,
                    name: checkOutData.selected_checkin_name,
                    image: checkOutData.selected_checkin_path,
                  },
                ]}
                currentIndex={0}
                className={"container"}
                checkIn={false}
                micRef={null}
                onClick={null}
              />
            )}
          </>
        )}
      </div>
    </>
  );
}
function AffirmationTeacherScreen({
  apiData,
  listOfAffirmation,
  activityType,
  handleDataTrack,
  checkOutData,
  userId,
  micRef,
  students,
  liveClassId,
}) {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const { otherData } = useSelector(
    (state: RootState) => state.ComponentLevelDataReducer
  );
  let liveClassID = liveClassId;
  let instruction =
    activityType === CICO.checkIn
      ? TeacherCheckInInstruction()
      : TeacherCheckOutInstruction();
  const handleStopTiming = () => {
    clearInterval(timerRef.current);
  };
  useEffect(() => {
    if (
      otherData?.isTeacherEndCheckInActivity &&
      activityType === CICO.checkIn
    ) {
      handleStopTiming();
    }
  }, [otherData?.isTeacherEndCheckInActivity]);
  useEffect(() => {
    if (otherData?.isEndCheckOutActivity && activityType === CICO.checkOut) {
      handleStopTiming();
    }
  }, [otherData?.isEndCheckOutActivity]);
  const timerRef = useRef();
  const timerCountRef = useRef(0);
  let isCheckInActivity = CICO.checkIn === activityType;
  const handleEndCheckInActivity = () => {
    setShowModal(false);
    dispatch(
      cicoComponentLevelDataTrack({
        isTeacherEndCheckInActivity: true,
        showCheckOutAnimation: true,
      })
    );
    updateStatusofCicoActivity(
      liveClassID,
      apiData.activity_id,
      timerCountRef.current
    ).then((res) => {
      if (res.status) {
        handleDataTrack({
          data: apiData,
          isTeacherEndCheckInActivity: true,
          showCheckOutAnimation: true,
        });
      }
    });
  };
  const handleCheckOutActivity = () => {
    if (otherData.isEndCheckOutActivity) return;
    clearInterval(timerRef.current);
    dispatch(cicoComponentLevelDataTrack({ isEndCheckOutActivity: true }));

    updateStatusofCicoActivity(
      liveClassID,
      apiData.activity_id,
      timerCountRef.current
    );
  };
  const handleClickNextBtn = () => {
    handleDataTrack({
      data: {
        apiData,
        isCheckInSaveResponse: true,
        isShowStories: true,
        isCheckInShowNextButton: false,
        currentPage: 0,
      },
      key: CICO.checkIn,
    });
    let obj: any = {
      isShowStories: true,
      isCheckInShowNextButton: false,
      currentPage: 0,
    };
    dispatch(cicoComponentLevelDataTrack(obj));
  };
  const handleClickNextCheckOutBtn = () => {
    handleDataTrack({
      data: {
        apiData,
        isHideCheckOutButton: true,
      },
      key: CICO.checkIn,
    });

    dispatch(cicoComponentLevelDataTrack({ isHideCheckOutButton: true }));
  };
  const handleEndCheckOutActivity = () => {
    setShowModal(false);
    handleCheckOutActivity();
  };
  const handleShowModal = () => {
    setShowModal(true);
  };
  console.log(liveClassID);
  return (
    <>
      {showModal && (
        <EndActivityShowModal
          handleClose={() => setShowModal(false)}
          handleComplete={
            activityType === CICO.checkOut
              ? handleEndCheckOutActivity
              : handleEndCheckInActivity
          }
        />
      )}
      {isCheckInActivity ? (
        <div>
          <ActivityTimerEndButton
            isShowCornerImage={otherData?.isShowStories ? true : false}
            timerCountRef={timerCountRef}
            activityType={activityType}
            isBadgesVisible={otherData?.isShowStories ? true : false}
            selectedItem={listOfAffirmation[0]}
            currentTime={Date.now()}
            timerRef={timerRef}
            instruction={
              isCheckInActivity
                ? otherData?.isCheckInSaveResponse
                  ? ""
                  : `${instruction?.instruction1} <br/>${instruction?.instruction2}`
                : ""
            }
            enabledEndButton={!otherData.isTeacherEndCheckInActivity}
            showEndButton={
              isCheckInActivity
                ? otherData?.isCheckInShowNextButton
                  ? false
                  : true
                : false
            }
            showNextButton={
              isCheckInActivity
                ? otherData?.isCheckInShowNextButton
                  ? true
                  : false
                : false
            }
            handleEndActivity={
              !otherData.isCheckInShowNextButton ? handleShowModal : () => {}
            }
            handleClickNext={handleClickNextBtn}
            text={
              isCheckInActivity
                ? otherData?.isCheckInShowNextButton
                  ? "Read a story"
                  : null
                : null
            }
          />
          {otherData.isShowStories ? (
            <StoriesToShow
              handleDataTrack={handleDataTrack}
              identity="tutor"
              apiData={listOfAffirmation}
            />
          ) : (
            <AffirmationSelection
              affirmation={listOfAffirmation}
              currentIndex={-1}
              className={"container"}
              checkIn={CICO.checkIn}
              micRef={null}
            />
          )}
        </div>
      ) : (
        <div>
          <ActivityTimerEndButton
            isShowCornerImage={true}
            activityType={activityType}
            isBadgesVisible={true}
            selectedItem={checkOutData}
            currentTime={Date.now()}
            timerRef={timerRef}
            timerCountRef={timerCountRef}
            enabledEndButton={!otherData.isEndCheckOutActivity}
            handleClickNext={handleClickNextCheckOutBtn}
            instruction={
              otherData?.isCheckOutSaveResponse
                ? ""
                : otherData?.isHideCheckOutButton
                ? ""
                : `${instruction?.instruction1?.replace(
                    "{}",
                    checkOutData?.selected_checkin_name
                  )}`
            }
            showEndButton={otherData?.isHideCheckOutButton ? true : false}
            showNextButton={
              otherData?.isEndCheckOutActivity
                ? !otherData?.isHideCheckOutButton
                : false
            }
            text={!otherData?.isHideCheckOutButton ? "Next" : ""}
            handleEndActivity={
              otherData?.isHideCheckOutButton ? handleShowModal : () => {}
            }
          />
          {otherData?.isHideCheckOutButton && (
            <CheckOutAffirmationActivity
              identity={"tutor"}
              listOfAffirmation={[checkOutData]}
              micRef={micRef}
              handleDataTrack={handleDataTrack}
              userId={userId}
              liveClassId={liveClassID}
              apiData={apiData}
              timerCountRef={timerCountRef}
              student={students}
            />
          )}
        </div>
      )}
    </>
  );
}

export default function Affirmation({
  apiData,
  identity,
  userId,
  liveClassID,
  students,
  activityType,
  handleDataTrack,
}: any) {
  const [listOfAffirmation, setListOfAffirmation] = useState([]);
  const [checkOutData, setCheckOutData] = useState({});
  const dispatch = useDispatch();
  const { otherData } = useSelector(
    (state: RootState) => state.ComponentLevelDataReducer
  );
  const fetchCheckInResponse = async () => {
    let activity_data: [] = apiData?.activity_data || [];
    try {
      let student_id = students[0]?.id || "";
      if (!allExcludedParticipants.includes(identity)) student_id = userId;

      const { data } = await getStudentActivityResponse(
        student_id,
        liveClassID
      );
      //   setShowCloseButton(true);
      let checkin_activity_category_details = data?.checkin_responses || {};
      checkin_activity_category_details =
        checkin_activity_category_details?.student || [];

      checkin_activity_category_details =
        checkin_activity_category_details[0]
          ?.checkin_activity_category_details || [];
      checkin_activity_category_details =
        checkin_activity_category_details[0] || {};
      let id = checkin_activity_category_details?.id || "";

      let activity_data2 = [];
      activity_data2 = activity_data?.filter(
        (item: any, i) => item?.category_id === id
      );

      if (activity_data2?.length < 1) {
        setListOfAffirmation([...activity_data]);
        return;
      } else {
        setListOfAffirmation([...activity_data2]);
        let obj: any = {
          isCheckInSaveResponse: true,
          isCheckInShowNextButton: true,
          isShowStories: false,
        };
        dispatch(cicoComponentLevelDataTrack(obj));
        handleDataTrack({ key: activityType, data: { ...obj } });
      }
    } catch (e) {
      setListOfAffirmation([...activity_data]);
      console.log(e);
    }
  };
  useEffect(() => {
    if (activityType === CICO.checkIn) {
      fetchCheckInResponse();
    }
  }, [otherData?.isCheckForResponse]);
  const fetchCheckOutResponse = async () => {
    let checkOutData = apiData?.student_activity_data || [];
    console.log(apiData);
    let student_id = students[0]?.id || "";
    if (!allExcludedParticipants.includes(identity)) student_id = userId;
    const { data } = await getStudentActivityResponse(student_id, liveClassID);
    let checkOutResponse = data?.checkout_responses?.teacher || [];
    checkOutResponse = checkOutResponse[0]?.response || "";
    dispatch(
      cicoComponentLevelDataTrack({
        isCheckoutTeacherResponseSaved: Boolean(checkOutResponse),
        checkInOutImageUrl: checkOutResponse,
      })
    );

    checkOutData = checkOutData[0];

    if (checkOutData) {
      setCheckOutData(checkOutData);
    }
  };
  useEffect(() => {
    if (activityType === CICO.checkOut) fetchCheckOutResponse();
  }, [otherData.isCheckoutTeacherResponseSaved]);
  const [micRef, setMicRef] = useState(false);
  useEffect(() => {
    let id = "";
    if (otherData?.showCheckInAnimation) {
      id = setTimeout(() => {
        dispatch(cicoComponentLevelDataTrack({ showCheckInAnimation: false }));
      }, 5000);
    }
    return () => clearTimeout(id);
  }, [otherData?.showCheckInAnimation]);
  useEffect(() => {
    let id = "";
    if (otherData?.showCheckOutAnimation) {
      id = setTimeout(() => {
        dispatch(cicoComponentLevelDataTrack({ showCheckOutAnimation: false }));
      }, 5000);
    }
    return () => {
      clearTimeout(id);
    };
  }, [otherData?.showCheckOutAnimation]);
  console.log(liveClassID);
  return (
    <>
      {otherData?.showCheckInAnimation && (
        <BalloonLottie mission={false} applyStyles={true} />
      )}
      {otherData?.showCheckOutAnimation && (
        <BalloonLottie mission={true} applyStyles={true} />
      )}
      {activityType === CICO.checkOut && (
        <AudioAnaylyzer setMicRef={setMicRef} />
      )}
      <div style={{ position: "relative" }}>
        {identity === "tutor" ? (
          <AffirmationTeacherScreen
            apiData={apiData}
            listOfAffirmation={listOfAffirmation}
            activityType={activityType}
            handleDataTrack={handleDataTrack}
            checkOutData={checkOutData}
            micRef={micRef}
            userId={userId}
            liveClassId={liveClassID}
            students={students}
          />
        ) : (
          <>
            <AffirmationStudentScreen
              apiData={apiData}
              listOfAffirmation={listOfAffirmation}
              activityType={activityType}
              handleDataTrack={handleDataTrack}
              checkOutData={checkOutData}
              micRef={micRef}
              userId={userId}
              liveClassId={liveClassID}
            />
          </>
        )}
      </div>
    </>
  );
}
