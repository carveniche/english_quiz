import html2canvas from "html2canvas";
import React, { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import BalloonLottie from "../../../components/LottieTransformation/BalloonLottie";
import RocketLottie from "../../../components/LottieTransformation/RocketLottie";
import ActivityTimerAndEndButton from "../../ActivityTimerAndEndButton";
import b64toBlob from "../../b64toBlob";
import EndActivityModal from "../../EndActivityModal";
import AffirmationBadges, { AffirmationBadges2 } from "./AffirmationBadges";
import AffirmationSelection from "./AffirmationSelection";
import AnimatedAnimationStories from "./AnimatedAnimationStories";
import PreviewStudentPicture from "./PreviewStudentPicture";
import styles2 from "../../StudentActivity.module.css";
import {
  baseURL,
  getStudentActivityResponse,
  imageUrl,
  StudentActivityResponseSave,
  StudentActivityTeacherResponseSave,
  updateStatusofCicoActivity,
} from "../../../../../api";
import Button from "../../Button";
import ActivityTimerCalculator from "../../ActivityTimerCalculator";
import LoadingModal from "../LoadingModal";
import {
  StudentCheckInInstruction,
  TeacherCheckInInstruction,
} from "../../InstructionPageConfig/SelfAffirmation/CheckInIntruction";
import {
  StudentCheckOutInstruction,
  TeacherCheckOutInstruction,
} from "../../InstructionPageConfig/SelfAffirmation/CheckOutInstruction";
import HtmlParser from "react-html-parser";
import { excludeParticipant } from "../../ExcludeParticipant";

const StoriesToShow = ({
  url,
  selectedAffirmation,
  identity,
  storyBookPageNumber,
  handleChangePageNumber,
  storyBook,
  isStudentActivityEnd = { isStudentActivityEnd },
}) => {
  return (
    <>
      <div
        style={{
          float: "left",
        }}
      ></div>
      {isStudentActivityEnd?.isStudentActivityEnd ? (
        <h1 style={{ clear: "both", textAlign: "center" }}>
          Activity is Completed
        </h1>
      ) : (
        <AnimatedAnimationStories
          identity={identity}
          storyBookPageNumber={storyBookPageNumber}
          handleChangePageNumber={handleChangePageNumber}
          storyBook={storyBook || []}
          isStudentActivityEnd={
            isStudentActivityEnd?.isStudentActivityEnd || false
          }
        />
      )}
    </>
  );
};

const CheckOutAffirmationActivity = ({
  listOfAffirmation,
  currentIndex = 0,
  identity,
  micRef,
  remoteParticipants,
  checkInActivityId,
  isAffirmationPreviewImage,
  handleShowPreviewImageAffrimation,
  apiData,
  teacherTimerRef,
  setLoading,
  setDisabledTopHeadingStudentSide,
  instruction1,
  instruction2,
  instruction3,
  instruction4,
  setHideCornerBadges,
}) => {
  const [url2, setUrl2] = useState("");
  const [image, setImage] = useState("");
  const [showPreviewButton, setShowPreviewButton] = useState(false);
  const [visiblity, setVisibility] = useState(false);
  const [showInstruction, setShowInstruction] = useState(false);

  const [previewImageUrl, setPreviewImageUrl] = useState("");
  const [imageConfirmation, setImageConfirmation] = useState(false);
  const [blob, setBlob] = useState("");
  const [screenShotCapture, setScreenShotCapture] = useState(false);
  const [date, setDate] = useState(Date.now());
  const takeScreenShot = () => {
    setLoading(true);
    html2canvas(document.querySelector("#ActivityCaptureParticipant"), {
      scale: 1,
    })
      .then((canvas) => {
        var img = canvas.toDataURL("image/png");
        setImage(img);
        setShowPreviewButton(true);
        let audio = new Audio("/static/media/Audio/camera.mp3");
        // audio.play()
        setVisibility(true);
      })
      .catch((err) => {
        console.log("Screen shot failed", err);
        alert("Please wait for student joining");
        setLoading(false);
      });
  };
  const takeScreenShot2 = () => {
    html2canvas(document.querySelector("#badgesWithImages"), {
      scale: 1,
      useCORS: true,
      logging: true,
    })
      .then(async (canvas) => {
        var img = canvas.toDataURL("image/png");
        remoteParticipants = remoteParticipants?.filter(
          (item) => !excludeParticipant?.includes(item)
        );
        setVisibility(false);
        setPreviewImageUrl(img);
        img = b64toBlob(img.split(";base64,")[1], "image/png");
        setBlob(img);
        setImageConfirmation(true);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Screen shot failed", err);
        setLoading(false);
      });
  };
  const [showConfirmationButton, setShowConfirmationButton] = useState(true);
  const uploadToServer = async () => {
    try {
      setShowConfirmationButton(false);
      setRetakeBtn(false);
      let student_id = String(remoteParticipants[0])?.split("-")[0];
      let search = window.location.search;
      let urlParams = new URLSearchParams(search);
      let user_id = urlParams.get("userID");
      let liveClassID = urlParams.get("liveClassID");
      let formData = new FormData();

      formData.append("student_id", student_id);
      formData.append("teacher_id", user_id);
      formData.append("checkin_activity_id", checkInActivityId);
      formData.append("live_class_id", liveClassID);
      formData.append("duration", teacherTimerRef?.current);
      formData.append("response", blob, "image.png");
      await StudentActivityTeacherResponseSave(formData);
      setScreenShotCapture(true);
      findResponse();
      setImageConfirmation(false);
      handlePreviewImage();
    } catch (e) {
      console.log(e);
    }
  };
  const handlePreviewImage = () => {
    handleShowPreviewImageAffrimation(true);
  };
  const handleClosePreviewImage = () => {
    handleShowPreviewImageAffrimation(false);
  };
  useEffect(() => {
    let id = setTimeout(() => {
      setShowInstruction((prev) => prev + 1);
      clearTimeout(id);
      return () => {
        clearTimeout(id);
      };
    }, 7000);
  }, []);
  useEffect(() => {
    if (visiblity) takeScreenShot2();
  }, [visiblity]);
  const [count, setCount] = useState(1);
  const [disableCount, setDisabledCount] = useState(true);
  const [retakeBtn, setRetakeBtn] = useState(true);
  const ref = useRef();
  useEffect(() => {
    ref.current = setInterval(() => {
      setCount((prev) => {
        prev++;
        if (prev > 3) {
          setDisabledCount(false);
          clearInterval(ref.current);
        }
        return prev;
      });
    }, 2000);
    return () => clearInterval(ref.current);
  }, []);

  useEffect(() => {
    findResponse();
  }, [isAffirmationPreviewImage]);
  const findResponse = async () => {
    try {
      let search = window.location.search;
      let urlParams = new URLSearchParams(search);
      let liveClassID = urlParams.get("liveClassID");
      remoteParticipants = Array.isArray(remoteParticipants)
        ? remoteParticipants
        : [];
      let student_id = String(remoteParticipants[0])?.split("-")[0];
      if (identity != "tutor") student_id = urlParams.get("userID");
      let { data } = await getStudentActivityResponse(student_id, liveClassID);
      setShowConfirmationButton(true);
      if (data.status) {
        let img = data?.checkout_responses?.teacher[0]?.response;

        if (img) {
          setUrl2(img);
          setShowPreviewButton(true);
          handleShowAffirmation();
          typeof setHideCornerBadges === "function" &&
            setHideCornerBadges(true);
        }
      } else {
      }
    } catch (e) {}
  };

  let url = imageUrl + url2 + "?dummy=" + date;
  const handleRetake = () => {
    setImageConfirmation(false);
  };

  const refTimer = useRef(null);
  const [showAffirmation, setShowAffirmation] = useState(true);
  const [showLastLine, setShowLastLine] = useState(false);
  let timerRef2 = useRef(null);
  const handleLastLine = (time) => {
    timerRef2 = setInterval(() => {
      let diff = Date.now() - time;
      if (diff > 4000) {
        clearInterval(timerRef2.current);
        setShowLastLine(true);
      }
    }, 1000);
  };
  const handleShowAffirmation = () => {
    clearInterval(refTimer.current);
    refTimer.current = setInterval(() => {
      clearInterval(refTimer.current);
      typeof setDisabledTopHeadingStudentSide === "function" &&
        setDisabledTopHeadingStudentSide(false);
      setShowAffirmation(false);
      handleLastLine(Date.now());
    }, 0);
  };
  useEffect(() => {
    return () => {
      clearInterval(refTimer.current);
      clearInterval(timerRef2.current);
    };
  }, []);
  return (
    <>
      {showAffirmation ? (
        <div>
          {
            <PreviewStudentPicture
              preview={imageConfirmation}
              onClick={uploadToServer}
              currentIndex={currentIndex}
              image={previewImageUrl}
              listOfAffirmation={listOfAffirmation}
              identity={identity}
              buttonText1={showConfirmationButton && "Confirm"}
              buttonText2={"Close"}
              handleRetake={handleRetake}
            />
          }

          <div
            style={{
              display: "flex",
              margin: "0 auto",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              clear: "both",
              gap: 9,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 38,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {disableCount && (
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                  }}
                >
                  Say it aloud
                  <div
                    style={{
                      width: 35,
                      height: 35,
                      borderRadius: "50%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      border: "2px solid indigo",
                    }}
                  >
                    {count}
                  </div>
                </div>
              )}

              <AffirmationSelection
                affirmation={[listOfAffirmation] || []}
                currentIndex={currentIndex}
                className={"container2"}
                checkIn={false}
                micRef={micRef}
              />
            </div>
            {identity === "tutor" && showInstruction && !url2 && (
              <div
                style={{
                  fontFamily: "Montserrat",
                }}
              >
                <div
                  style={{
                    textAlign: "center",

                    fontWeight: "bold",
                  }}
                >
                  {HtmlParser(instruction1 ?? "")}
                  {/* { Let me click a picture of yours so that I can put up for your
              picture and the self-affirmation together, for you! <br />Say cheese!} */}
                </div>
              </div>
            )}
            {!url2 && (
              <>
                {" "}
                {identity === "tutor" &&
                  showInstruction &&
                  (!showPreviewButton ? (
                    <button
                      onClick={takeScreenShot}
                      style={{
                        padding: 5,

                        color: "white",
                        borderRadius: 5,
                        display: "block",
                      }}
                    >
                      <img
                        src="/static/media/camera1.png"
                        style={{
                          width: "60px",
                        }}
                      />
                    </button>
                  ) : retakeBtn ? (
                    <button
                      onClick={takeScreenShot}
                      style={{
                        padding: 5,
                        background: "lightgreen",
                        color: "black",
                        borderRadius: 5,
                        display: "block",
                      }}
                    >
                      Retake
                    </button>
                  ) : null)}
              </>
            )}
          </div>

          {identity === "tutor" && (
            <div
              id="badgesWithImages"
              style={{
                position: "absolute",

                top: -30000,
                width: 338,
                height: 250,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  top: 0,
                  position: "absolute",
                  width: 246,

                  width: "fit-content",
                  height: "191px",
                }}
              >
                <img
                  src={image}
                  style={{
                    height: 191,
                    objectFit: "fill",
                    minHeight: 191,
                    maxHeight: 191,
                    minWidth: 244,
                    width: 244,
                    maxWidth: 244,
                  }}
                />
                <AffirmationBadges2 item={listOfAffirmation} />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          style={{
            clear: "both",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {identity === "tutor" &&
            showPreviewButton &&
            showInstruction &&
            Boolean(url2) && (
              <div
                style={{
                  fontFamily: "Montserrat",
                  fontWeight: "bold",
                  maxWidth: 650,
                }}
              >
                <div
                  style={{
                    textAlign: "center",
                  }}
                >
                  {instruction2}{" "}
                  {/* Fantastic!<br/> Thank you for the picture.<br/>  */}
                </div>
              </div>
            )}
          <div
            style={{
              fontFamily: "Montserrat",
              fontWeight: "bold",

              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                textAlign: "center",
                marginBottom: "1rem",
              }}
            >
              {instruction3}{" "}
              {/* Here is your picture
              along with your self-affirmation badge. */}
            </div>
          </div>
          <div>
            <img src={url} />
          </div>
          {showLastLine && (
            <div
              style={{
                fontFamily: "Montserrat",
                fontWeight: "bold",
                maxWidth: 650,
              }}
            >
              <div
                style={{
                  textAlign: "center",
                }}
              >
                {HtmlParser(instruction4 ?? "")}
                {/* Please do repeat this
              statement as many times as possible, during the day, till we pick
              another positive thought. Happy self-affirming!! */}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
const AffirmationStudentScreen = ({
  identity,
  listOfAffirmation,
  sendSelectedAffirmationValue,
  showAffirmationStories,
  isCheckInActivity,
  storyBookPageNumber,
  checkInActivityId,
  showAffirmationNextButton,
  micRef,
  isAffirmationPreviewImage,
  apiData,
  isStudentActivityEnd,
  saveResponse,
  setSaveResponse,
  showCheckoutAffirmationNextBtn,
  setShowCloseButton,
  showCloseButton,
}) => {
  let [currentSelectAffirmation, setCurrentSelectAffirmation] = useState("");
  const [selectAffirmation, setSelectAffirmation] = useState("");
  const [disabledTopHeadingStudentSide, setDisabledTopHeadingStudentSide] =
    useState(true);
  const [hideCornerBadges, setHideCornerBadges] = useState(false);
  const [endActivity, setEndActiivty] = useState(false);
  let studentTimer = useRef();
  const handleAffirmationSelect = (val) => {
    if (saveResponse) return;
    setCurrentSelectAffirmation(val);
  };
  const [showLottie, setShowLottie] = useState(false);

  const handleSubmit = async (val) => {
    console.log("calling");
    if (saveResponse || endActivity) return;
    if (val) {
      currentSelectAffirmation = currentSelectAffirmation
        ? currentSelectAffirmation
        : 0;
    }
    if (currentSelectAffirmation === "") {
      alert("please choose one of the affirmation");
      return;
    }
    let categoryId = listOfAffirmation[currentSelectAffirmation]?.category_id;

    if (!val) {
      setShowLottie(true);
      let id = setTimeout(() => {
        setShowLottie(false);
      }, 5000);
    }
    let search = window.location.search;
    let urlParams = new URLSearchParams(search);
    let user_id = urlParams.get("userID");
    let formData = new FormData();
    let liveClassID = urlParams.get("liveClassID");
    formData.append("student_id", user_id);
    formData.append("checkin_ativity_id", checkInActivityId);
    formData.append("live_class_id", liveClassID);
    formData.append("duration", studentTimer?.current);
    formData.append("checkin_out_activity_category_id", categoryId);
    setShowCloseButton(false);
    setEndActiivty(true);
    await StudentActivityResponseSave(formData);
    setSaveResponse(true);
    sendSelectedAffirmationValue(currentSelectAffirmation);
  };
  useEffect(() => {
    if (!showAffirmationNextButton && isCheckInActivity) {
      console.log("calling");
      if (isStudentActivityEnd) handleSubmit("celebration");
    }
  }, [isStudentActivityEnd]);
  const instruction = isCheckInActivity
    ? StudentCheckInInstruction()
    : StudentCheckOutInstruction();

  return (
    <>
      <ActivityTimerCalculator
        participant={"student"}
        checkIn={isCheckInActivity}
        activityName={"selfaffirmation"}
        teacherTimerRef={studentTimer}
      />
      {showLottie && <BalloonLottie />}
      <ActivityTimerAndEndButton
        identity={identity}
        showAffirmationStories={showAffirmationStories}
        checkIn={isCheckInActivity}
        selectedItem={listOfAffirmation[0]}
        hideCornerBadges={isCheckInActivity ? false : hideCornerBadges}
      />
      {!isCheckInActivity && Boolean(!showCheckoutAffirmationNextBtn?.val) && (
        <div
          style={{
            width: "calc(95% - 250px)",
            marginLeft: "200px",
            textAlign: "center",
          }}
          className={styles2.whiteboardContainerInstruction}
        >
          <div className={styles2.instructionHeading}>
            {HtmlParser(instruction?.instruction1 ?? "")}
          </div>
        </div>
      )}
      {!isCheckInActivity &&
        Boolean(showCheckoutAffirmationNextBtn?.val) &&
        disabledTopHeadingStudentSide && (
          <div
            style={{
              color: "#233584",
              fontSize: "20px",
              fontWeight: "bold",
              fontFamily: "Montserrat",
            }}
            className={styles2.whiteboardContainerInstruction}
          >
            <div
              style={{
                textAlign: "center",
              }}
            >
              {HtmlParser(instruction?.instruction1 ?? "")}
            </div>
          </div>
        )}
      {listOfAffirmation?.length > 0 &&
        showCloseButton &&
        isCheckInActivity && (
          <div style={{ float: "right" }}>
            <button
              style={{
                marginLeft: 5,
                padding: 5,

                color: "white",
                borderRadius: 5,
              }}
              onClick={() => !showAffirmationNextButton && handleSubmit()}
            >
              <img
                src={`/static/media/Closedicon/${
                  listOfAffirmation?.length > 1 ? "close1" : "close2"
                }.png`}
                style={{ width: 80 }}
              />
            </button>
          </div>
        )}
      <>
        {!isCheckInActivity &&
          Boolean(!showCheckoutAffirmationNextBtn?.val) && (
            <AffirmationSelection
              affirmation={listOfAffirmation?.map((item) =>
                item === selectAffirmation ? false : item
              )}
              currentIndex={currentSelectAffirmation}
              onClick={handleAffirmationSelect}
              className={"container"}
              checkIn={true}
              micRef={micRef}
            />
          )}
      </>
      {isCheckInActivity ? (
        <div>
          <div
            style={{
              padding: 5,
              display: "flex",
              gap: "2rem",
              width: "calc(99% - 195px)",
              marginLeft: "110px",
              marginRight: "85px",
              textAlign: "center",
              paddingRight: "1%",
              marginBottom: "1rem",
              alignItems: "center",
            }}
          >
            <div
              className={styles2.whiteboardContainerInstruction}
              style={{ textAlign: "center", width: "100%" }}
            >
              {!showAffirmationStories && (
                <div
                  className={styles2.instructionHeading}
                  style={{ textAlign: "center" }}
                >
                  {listOfAffirmation?.length > 1
                    ? HtmlParser(instruction?.instruction1 ?? "")
                    : ""}
                </div>
              )}
            </div>
          </div>

          {!showAffirmationStories ? (
            <>
              <AffirmationSelection
                affirmation={listOfAffirmation?.map((item) =>
                  item === selectAffirmation ? false : item
                )}
                currentIndex={currentSelectAffirmation}
                onClick={handleAffirmationSelect}
                className={"container"}
                checkIn={isCheckInActivity}
                micRef={micRef}
              />
            </>
          ) : (
            <StoriesToShow
              isStudentActivityEnd={{
                isStudentActivityEnd: isStudentActivityEnd,
              }}
              storyBook={listOfAffirmation[0]?.story_question_data || []}
              url={
                "https://www.begalileo.com/system/whiteboard_lessons/Grade4/T1_IV_MAT0205/01_IV_MAT0205/1.jpg"
              }
              selectedAffirmation={listOfAffirmation[currentSelectAffirmation]}
              storyBookPageNumber={storyBookPageNumber}
            />
          )}
        </div>
      ) : showCheckoutAffirmationNextBtn?.val ? (
        <div>
          <CheckOutAffirmationActivity
            listOfAffirmation={listOfAffirmation[0]}
            identity={identity}
            currentIndex={0}
            micRef={micRef}
            isAffirmationPreviewImage={isAffirmationPreviewImage}
            apiData={apiData}
            showAffirmationNextButton={showAffirmationNextButton}
            teacherTimerRef={studentTimer}
            setDisabledTopHeadingStudentSide={setDisabledTopHeadingStudentSide}
            setHideCornerBadges={setHideCornerBadges}
            /*  { instruction1}{/* { Let me click a picture of yours so that I can put up for your */
            /*  {instruction2}  {/* Fantastic!<br/> Thank you for the picture.<br/>  }  */
            /*   {instruction3} {/* Here is your picture
          along with your self-affirmation badge. }  */
            /*      {instruction4}{/* Please do repeat this
            statement as many times as possible, during the day, till we pick
            another positive thought. Happy self-affirming!!  */
          />
        </div>
      ) : (
        ""
      )}
    </>
  );
};
//  Teacher Screen

const AffirmationTeacherScreen = ({
  identity,
  handleCloseActivity,
  isCheckInActivity,
  listOfAffirmation,
  studentResponse,
  storyBookPageNumber,
  onSendStoriesToStudent,
  handleChangePageNumber,
  showAffirmationStories,
  showAffirmationNextButton,
  micRef,
  remoteParticipants,
  checkInActivityId,
  isAffirmationPreviewImage,
  handleShowPreviewImageAffrimation,
  apiData,
  isStudentActivityEnd,
  showCheckoutAffirmationNextBtn,
  onAffirmationCheckoutNextButton,
  handleEndCheckInActivity,
  handleEndCheckOutActivity,
}) => {
  const teacherTimerRef = useRef();
  const [activityEnd, setActivityEnd] = useState(false);
  const [loading, setLoading] = useState(false);
  const timerCountRef = useRef(0);
  let currentIndex = Object.values(studentResponse)?.length - 1;
  const [showModal, setShowModal] = useState(false);
  const [showStories, setShowStories] = useState(false);
  const timerRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(Date.now());
  let search = window.location.search;
  let urlParams = new URLSearchParams(search);
  let liveClassID = urlParams.get("liveClassID");
  const [closedActivity, setClosedActivity] = useState(false);
  const [hideCornerBadges, setHideCornerBadges] = useState(false);
  liveClassID = liveClassID?.trim();
  let keys =
    "AffirmationActivityTimer" +
    (isCheckInActivity ? "Check-in" : "Check-out") +
    liveClassID;
  const handleShowStories = async () => {
    console.log("dkdk");
    setShowStories(true);
    onSendStoriesToStudent(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  const handleEndActivity = () => {
    console.log("end activity");
    setShowModal(true);
  };
  const handleActivityStatus = async (i) => {
    console.log("kdkd");
    if (i === 0) {
      closeModal();
      return;
    }
    setClosedActivity(true);
    clearTimeout(timerRef.current);
    closeModal();

    if (isCheckInActivity) {
      console.log("lllld");
      handleCloseActivity();
      handleEndCheckInActivity();
    } else {
      handleEndCheckOutActivity();
    }
    setActivityEnd(true);
    clearInterval(timerRef.current);
    await updateStatusofCicoActivity(
      liveClassID,
      apiData?.activity_id,
      timerCountRef.current
    );
  };
  let instruction = isCheckInActivity
    ? TeacherCheckInInstruction()
    : TeacherCheckOutInstruction();
  const handleCheckOutNextButton = () => {
    console.log("ankdk");
    onAffirmationCheckoutNextButton(showCheckoutAffirmationNextBtn?.val);
  };
  console.log(showModal, loading);
  return (
    <>
      {loading && <LoadingModal />}
      <div>
        <EndActivityModal
          showModal={showModal}
          closeModal={closeModal}
          handleActivityStatus={handleActivityStatus}
        />
        <ActivityTimerAndEndButton
          keys={keys}
          toolBox={
            isCheckInActivity
              ? showAffirmationNextButton
              : !Boolean(showCheckoutAffirmationNextBtn?.val)
          }
          teacherTimerRef={teacherTimerRef}
          checkIn={isCheckInActivity}
          timerRef={timerRef}
          currentTime={currentTime}
          handleEndActivity={handleEndActivity}
          text={isCheckInActivity ? "Read a Story" : "NEXT"}
          onClick={
            isCheckInActivity ? handleShowStories : handleCheckOutNextButton
          }
          showAffirmationStories={showAffirmationStories}
          showClosed={closedActivity}
          instruction={
            listOfAffirmation?.length === 1 && isCheckInActivity
              ? ""
              : showCheckoutAffirmationNextBtn?.val
              ? ""
              : (isCheckInActivity
                  ? instruction?.instruction1
                  : instruction?.instruction1?.replace(
                      "{}",
                      `"${listOfAffirmation[0]?.name ?? ""}"`
                    )) +
                (isCheckInActivity ? `<br/>${instruction?.instruction2}` : "")
          }
          disabledEndActivityButton={
            isCheckInActivity
              ? !isCheckInActivity
              : !Boolean(showCheckoutAffirmationNextBtn?.val)
          }
          isStudentActivityEnd={activityEnd}
          selectedItem={listOfAffirmation[0]}
          hideCornerBadges={isCheckInActivity ? false : hideCornerBadges}
          timerCountRef={timerCountRef}
        />
        {isCheckInActivity ? (
          <>
            {!showAffirmationStories ? (
              <>
                <div
                  style={{
                    color: "black",
                    fontSize: "22px",
                    fontWeight: "bold",
                  }}
                ></div>
                <AffirmationSelection
                  affirmation={listOfAffirmation}
                  currentIndex={currentIndex}
                  className={"container"}
                  checkIn={isCheckInActivity}
                  micRef={micRef}
                />
              </>
            ) : (
              <StoriesToShow
                storyBook={listOfAffirmation[0]?.story_question_data || []}
                url="https://www.begalileo.com/system/whiteboard_lessons/Grade4/T1_IV_MAT0205/01_IV_MAT0205/1.jpg"
                selectedAffirmation={listOfAffirmation[0]}
                identity={identity}
                handleChangePageNumber={handleChangePageNumber}
                storyBookPageNumber={storyBookPageNumber}
                isStudentActivityEnd={{ isStudentActivityEnd: closedActivity }}
              />
            )}
          </>
        ) : showCheckoutAffirmationNextBtn?.val ? (
          <CheckOutAffirmationActivity
            listOfAffirmation={listOfAffirmation[0]}
            currentIndex={0}
            identity={identity}
            micRef={micRef}
            remoteParticipants={remoteParticipants}
            checkInActivityId={checkInActivityId}
            handleShowPreviewImageAffrimation={
              handleShowPreviewImageAffrimation
            }
            isAffirmationPreviewImage={isAffirmationPreviewImage}
            apiData={apiData}
            teacherTimerRef={teacherTimerRef}
            setHideCornerBadges={setHideCornerBadges}
            setLoading={setLoading}
            instruction1={
              instruction?.instruction2 +
              `<div>${instruction?.instruction3}</div>`
            } /*  { instruction1}{/* { Let me click a picture of yours so that I can put up for your */
            instruction2={
              instruction.instruction4
            } /*  {instruction2}  {/* Fantastic!<br/> Thank you for the picture.<br/>  }  */
            instruction3={
              instruction.instruction5
            } /*   {instruction3} {/* Here is your picture
          along with your self-affirmation badge. }  */
            instruction4={
              instruction?.instruction6 + "<br />" + instruction?.instruction7
            } /*      {instruction4}{/* Please do repeat this
            statement as many times as possible, during the day, till we pick
            another positive thought. Happy self-affirming!!  */
          />
        ) : (
          ""
        )}
      </div>
    </>
  );
};
export default function AffirmationActivity({
  identity,
  handleCloseActivity,
  isCheckInActivity,
  sendSelectedAffirmationValue,
  studentResponse,
  onSendStoriesToStudent,
  showAffirmationStories,
  handleChangePageNumber,
  storyBookPageNumber,
  showEndActivityAnimation,
  apiData,
  checkInActivityId,
  showAffirmationNextButton,
  participantMuted,
  tutorMuteStatus,
  remoteParticipants,
  handleShowPreviewImageAffrimation,
  isAffirmationPreviewImage,
  isStudentActivityEnd,
  onAffirmationCheckoutNextButton,
  showCheckoutAffirmationNextBtn,
  handleEndCheckInActivity,
  handleEndCheckOutActivity,
}) {
  const [listOfAffirmation, setListOfAffirmation] = useState([]);
  const [noCheckInResponseFound, setNoCheckoutResponseFound] = useState(false);
  const [showStories, setShowStories] = useState(showAffirmationStories);
  const [showCloseButton, setShowCloseButton] = useState(true);
  const [isCheckInActivityCompleted, setIsCheckInActivityCompleted] =
    useState(false);
  remoteParticipants = remoteParticipants?.filter(
    (item) => !excludeParticipant?.includes(item)
  );
  let mediaStream = useRef("");
  let microphone = useRef("");
  let analyser = useRef("");
  let scriptProcessor2 = useRef("");
  const [storiesData, setStoriesData] = useState([]);
  const [saveResponse, setSaveResponse] = useState(false);
  const [showNextButton, setShowNextButton] = useState();
  useEffect(() => {
    if (!isCheckInActivity) return;
    fetchCheckInResponse();
  }, [studentResponse]);

  useEffect(() => {}, [showAffirmationNextButton]);

  const fetchCheckInResponse = async () => {
    let activity_data = apiData?.activity_data || [];
    try {
      let search = window.location.search;
      let urlParams = new URLSearchParams(search);
      let liveClassID = urlParams.get("liveClassID");
      remoteParticipants = Array.isArray(remoteParticipants)
        ? remoteParticipants
        : [];
      let student_id = String(remoteParticipants[0])?.split("-")[0];
      if (identity != "tutor") student_id = urlParams.get("userID");

      const { data } = await getStudentActivityResponse(
        student_id,
        liveClassID
      );
      setShowCloseButton(true);
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
        (item, i) => item?.category_id === id
      );

      if (activity_data2?.length < 1) {
        setListOfAffirmation([...activity_data]);
        return;
      } else {
        setListOfAffirmation([...activity_data2]);
        setSaveResponse(true);
        setShowNextButton(true);
      }
    } catch (e) {
      setListOfAffirmation([...activity_data]);
      console.log(e);
    }
  };
  //checkout
  useEffect(() => {
    if (isCheckInActivity) return;
    let activity_data = apiData?.student_activity_data || [];
    activity_data = activity_data?.map((item) => {
      let obj = { ...item };
      obj.name = item?.selected_checkin_name || "";
      obj.image = item?.selected_checkin_path || "";
      if (obj.name && obj.image) {
        setIsCheckInActivityCompleted(true);
      }
      return { ...obj };
    });
    setListOfAffirmation([...activity_data]);
  }, []);

  useEffect(() => {
    console.log(
      "story show",
      typeof storyBookPageNumber,
      storyBookPageNumber,
      typeof showAffirmationStories
    );
    if (identity !== "tutor")
      if (storyBookPageNumber) {
        console.log("hekk");
        setShowStories(true);
      }
    setShowNextButton(false);
  }, [storyBookPageNumber]);
  const [micRef, setMicRef] = useState(false);

  if (typeof mediaStream.current === "object") {
    mediaStream.current.getAudioTracks()[0].enabled =
      !Boolean(participantMuted);
  }
  useEffect(() => {
    try {
      if (isCheckInActivity) return;
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
        })
        .then(function (stream) {
          const audioContext = new AudioContext();
          mediaStream.current = stream;
          let analyser = audioContext.createAnalyser();
          var biquadFilter = audioContext.createBiquadFilter();
          biquadFilter.type = "highshelf";
          biquadFilter.frequency.value = 1000;
          biquadFilter.gain.value = 0.7;
          let microphone = audioContext.createMediaStreamSource(stream);
          let scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);
          analyser.smoothingTimeConstant = 0.8;
          analyser.fftSize = 1024;
          microphone.connect(analyser);
          analyser.connect(scriptProcessor);
          scriptProcessor.connect(audioContext.destination);
          scriptProcessor.onaudioprocess = function () {
            const array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            const arraySum = array.reduce((a, value) => a + value, 0);
            const average = arraySum / array.length;
            if (average >= 14) setMicRef(true);
            else setMicRef(false);

            scriptProcessor2.current = scriptProcessor;

            // colorPids(average);
          };
        })
        .catch(function (err) {
          /* handle the error */
          console.error(err);
        });
    } catch (e) {}
    return () => {
      typeof scriptProcessor2?.current?.disconnect === "function" &&
        scriptProcessor2?.current?.disconnect();
    };
  }, []);
  console.log(micRef);
  return (
    <>
      <div
        style={{
          marginTop: "0.4rem",
          fontSize: 18,
          fontWeight: "bold",
          color: "indigo",
        }}
      >
        CICO:&nbsp;&nbsp; Self-Affirmation
      </div>
      <div
        className={styles2.shapeChallengeInnerContainer2}
        style={{ position: "relative" }}
      >
        {showEndActivityAnimation && (
          <BalloonLottie mission={true} applyStyles={true} />
        )}
        {!isCheckInActivityCompleted && !isCheckInActivity ? (
          <div style={{ width: "95%", margin: "auto" }}>
            <h1>
              Look like you did'nt submit checkin response, without submitting
              check-in response you cannot go checkout activity so please
              complete checkin activity first.
            </h1>
          </div>
        ) : identity !== "tutor" ? (
          <AffirmationStudentScreen
            identity={identity}
            isCheckInActivity={isCheckInActivity}
            listOfAffirmation={listOfAffirmation}
            sendSelectedAffirmationValue={sendSelectedAffirmationValue}
            showAffirmationStories={showStories || showAffirmationStories}
            storyBookPageNumber={storyBookPageNumber}
            handleChangePageNumber={handleChangePageNumber}
            studentResponse={studentResponse}
            checkInActivityId={checkInActivityId}
            showAffirmationNextButton={
              showAffirmationNextButton == false ||
              showAffirmationNextButton === true
                ? showAffirmationNextButton
                : showNextButton
            }
            micRef={micRef}
            remoteParticipants={remoteParticipants}
            isAffirmationPreviewImage={isAffirmationPreviewImage}
            apiData={apiData}
            isStudentActivityEnd={isStudentActivityEnd}
            saveResponse={saveResponse}
            setSaveResponse={setSaveResponse}
            onAffirmationCheckoutNextButton={onAffirmationCheckoutNextButton}
            showCheckoutAffirmationNextBtn={showCheckoutAffirmationNextBtn}
            setShowCloseButton={setShowCloseButton}
            showCloseButton={showCloseButton}
          />
        ) : (
          <AffirmationTeacherScreen
            identity={identity}
            handleCloseActivity={handleCloseActivity}
            isCheckInActivity={isCheckInActivity}
            showAffirmationStories={showAffirmationStories}
            listOfAffirmation={listOfAffirmation}
            studentResponse={studentResponse}
            onSendStoriesToStudent={onSendStoriesToStudent}
            storyBookPageNumber={storyBookPageNumber}
            handleChangePageNumber={handleChangePageNumber}
            checkInActivityId={checkInActivityId}
            showAffirmationNextButton={
              showAffirmationNextButton == false ||
              showAffirmationNextButton === true
                ? showAffirmationNextButton
                : showNextButton
            }
            micRef={micRef}
            remoteParticipants={remoteParticipants}
            handleShowPreviewImageAffrimation={
              handleShowPreviewImageAffrimation
            }
            isAffirmationPreviewImage={isAffirmationPreviewImage}
            isStudentActivityEnd={isStudentActivityEnd}
            apiData={apiData}
            onAffirmationCheckoutNextButton={onAffirmationCheckoutNextButton}
            showCheckoutAffirmationNextBtn={showCheckoutAffirmationNextBtn}
            handleEndCheckInActivity={handleEndCheckInActivity}
            handleEndCheckOutActivity={handleEndCheckOutActivity}
          />
        )}
      </div>
    </>
  );
}
