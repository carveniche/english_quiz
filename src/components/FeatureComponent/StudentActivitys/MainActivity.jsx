import React, { useEffect, useRef, useState } from "react";

import AffirmationActivity from "./Activities/AffirmationActivity/AffirmationActivity";
import MainFeelingChart from "./Activities/FeelingChart/FeelingChartCheckIn";
import ShapeChallengeCheckInActivity from "./Activities/ShapeChallengeActivity/ShapeChallengeCheckInActivity";
import { excludeParticipant } from "./ExcludeParticipant";
import LoadingIndicator from "./Loading/LoadingIndicator";
import styles from "./StudentActivity.module.css";
import styles2 from "../Mathzone/component/OnlineQuiz.module.css";
import { studentCheckInGetData, studentCheckOutGetData } from "../../../api";
import "../CICO/index.css";
import QuizPageLayout from "../Mathzone/QuizPageLayout/QuizPageLayout";
import QuizWhitePage from "../Mathzone/QuizPageLayout/QuizWhitepage";
const ipad = /Macintosh/.test(navigator.userAgent) && "ontouchend" in document;
export default function MainActivity(props) {
  let {
    identity,
    isCheckInActivity,
    showActivityNotification,
    handleShowActivityNotification,
    remoteParticipants,
    handleCloseActivity,
    sendShapeChallengeImage,
    shapeActivityStudentResponse,
    sendActiveWhiteBoardData,
    shapesActivityTutorsWhiteBoardPoint,
    renderShapeChallenge,
    IpadState,
    onStudentIpadState,
    sendSelectedAffirmationValue,
    affirmationActivityStudentResponse,
    onSendStoriesToStudent,
    showAffirmationStories,
    storyBookPageNumber,
    handleChangePageNumber,
    showEndActivityAnimation,
    tutorName,
    teacherActivityResponseSaved,
    handleSendTeacherActivityResponse,
    showAffirmationNextButton,
    participantMuted,
    tutorMuteStatus,
    FeelingChartSelectedImg,
    onSendSelectedFeelingImg,
    onSendOpenDropBox,
    feelingChartDropBox,
    FeelingChartSelectedImgCheckout,
    handleShowPreviewImageAffrimation,
    isAffirmationPreviewImage,
    isStudentActivityEnd,
    isActivityScreenShotCapture,
    showCheckoutAffirmationNextBtn,
    onAffirmationCheckoutNextButton,
    isStudentShapeChallengeResponseSaved,
    handleShapeChallengeStudentResponseSaved,
    handleEndCheckOutActivity,
    handleEndCheckInActivity,
    sendCicoDataToStudent,
    cicoApiData,
  } = props;
  const [modal, setModal] = useState(true);
  const handleModal = () => {
    setModal(false);
    setShowActivity(true);
    handleShowActivityNotification();
  };
  const [showShapeChallengeScreenShot, setShowShapeChallengeScreenShot] =
    useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [apiData, setApiData] = useState({});
  const [selectedCheckInFeeling, setSelectedCheckInFeeling] = useState({});
  const [errorMsg, seterrorMsg] = useState("");
  const [checkInActivityId, setCheckinActivityId] = useState("");
  useEffect(() => {
    setShowShapeChallengeScreenShot(teacherActivityResponseSaved);
  }, [teacherActivityResponseSaved]);
  useEffect(() => {
    setModal(showActivityNotification);
    setShowActivity(!showActivityNotification);
  }, [showActivityNotification]);
  const [studentsIds, setStudentIds] = useState([]);
  const activityList = {
    Shape: (
      <ShapeChallengeCheckInActivity
        identity={identity}
        isCheckInActivity={isCheckInActivity}
        notification={showActivityNotification}
        handleShowActivityNotification={handleShowActivityNotification}
        remoteParticipants={studentsIds}
        handleCloseActivity={handleCloseActivity}
        sendShapeChallengeImage={sendShapeChallengeImage}
        shapeActivityStudentResponse={shapeActivityStudentResponse}
        remoteSendData={sendActiveWhiteBoardData}
        whiteBoardPoints={shapesActivityTutorsWhiteBoardPoint}
        renderShapeChallenge={renderShapeChallenge}
        IpadState={IpadState}
        onStudentIpadState={onStudentIpadState}
        apiData={apiData}
        showEndActivityAnimation={showEndActivityAnimation}
        tutorName={tutorName}
        checkInActivityId={checkInActivityId}
        teacherActivityResponseSaved={showShapeChallengeScreenShot}
        handleSendTeacherActivityResponse={handleSendTeacherActivityResponse}
        showAffirmationNextButton={showAffirmationNextButton}
        tutorMuteStatus={tutorMuteStatus}
        isStudentActivityEnd={isStudentActivityEnd}
        isActivityScreenShotCapture={isActivityScreenShotCapture}
        onSendStoriesToStudent={onSendStoriesToStudent}
        showAffirmationStories={showAffirmationStories}
        isStudentShapeChallengeResponseSaved={
          isStudentShapeChallengeResponseSaved
        }
        handleShapeChallengeStudentResponseSaved={
          handleShapeChallengeStudentResponseSaved
        }
        handleEndCheckOutActivity={handleEndCheckOutActivity}
        handleEndCheckInActivity={handleEndCheckInActivity}
      />
    ),
    Affirmation: (
      <AffirmationActivity
        identity={identity}
        isCheckInActivity={isCheckInActivity}
        remoteParticipants={studentsIds}
        handleCloseActivity={handleCloseActivity}
        sendSelectedAffirmationValue={sendSelectedAffirmationValue}
        studentResponse={affirmationActivityStudentResponse}
        onSendStoriesToStudent={onSendStoriesToStudent}
        showAffirmationStories={showAffirmationStories}
        storyBookPageNumber={storyBookPageNumber}
        handleChangePageNumber={handleChangePageNumber}
        apiData={apiData}
        showEndActivityAnimation={showEndActivityAnimation}
        tutorName={tutorName}
        checkInActivityId={checkInActivityId}
        teacherActivityResponseSaved={teacherActivityResponseSaved}
        handleSendTeacherActivityResponse={handleSendTeacherActivityResponse}
        showAffirmationNextButton={showAffirmationNextButton}
        participantMuted={participantMuted}
        tutorMuteStatus={tutorMuteStatus}
        handleShowPreviewImageAffrimation={handleShowPreviewImageAffrimation}
        isAffirmationPreviewImage={isAffirmationPreviewImage}
        isStudentActivityEnd={isStudentActivityEnd}
        showCheckoutAffirmationNextBtn={showCheckoutAffirmationNextBtn}
        onAffirmationCheckoutNextButton={onAffirmationCheckoutNextButton}
        handleEndCheckInActivity={handleEndCheckInActivity}
        handleEndCheckOutActivity={handleEndCheckOutActivity}
      />
    ),
    Feeling: (
      <MainFeelingChart
        identity={identity}
        selectedImg={FeelingChartSelectedImg}
        onSendSelectedFeelingImg={onSendSelectedFeelingImg}
        onSendOpenDropBox={onSendOpenDropBox}
        isCheckInActivity={isCheckInActivity}
        feelingChartDropBox={feelingChartDropBox}
        FeelingChartSelectedImgCheckout={FeelingChartSelectedImgCheckout}
        selectedImgId={FeelingChartSelectedImg}
        onSendStoriesToStudent={onSendStoriesToStudent}
        showAffirmationStories={showAffirmationStories}
        showAffirmationNextButton={showAffirmationNextButton}
        apiData={apiData}
        selectedCheckInFeeling={selectedCheckInFeeling}
        checkInActivityId={checkInActivityId}
        remoteParticipants={studentsIds}
        handleCloseActivity={handleCloseActivity}
        isStudentActivityEnd={isStudentActivityEnd}
        showEndActivityAnimation={showEndActivityAnimation}
        handleEndCheckInActivity={handleEndCheckInActivity}
        handleEndCheckOutActivity={handleEndCheckOutActivity}
      />
    ),
  };
  const [noStudentFound, setNoStudentFound] = useState(false);
  useEffect(() => {
    console.log(loading || noStudentFound, remoteParticipants);
    if ((loading || noStudentFound) && identity === "tutor") fetchActivityApi();
  }, [remoteParticipants.length]);
  useEffect(() => {
    if (identity === "tutor" || excludeParticipant.includes(identity)) return;
    if (Object.keys(cicoApiData).length) {
      if (isCheckInActivity) {
        setCheckinActivityId(cicoApiData?.activity_id);
      } else {
        setCheckinActivityId(cicoApiData?.activity_id);
        setSelectedCheckInFeeling(cicoApiData?.student_activity_data[0] || {});
      }
      setApiData({ ...cicoApiData });
      setLoading(false);
    }
  }, [Object.keys(cicoApiData)?.length]);
  const fetchActivityApi = async () => {
    console.log(remoteParticipants);
    remoteParticipants = remoteParticipants?.filter(
      (item) => !excludeParticipant?.includes(String(item)?.trim())
    );

    console.log(remoteParticipants);
    try {
      setLoading(true);
      let search = window.location.search;
      let params = new URLSearchParams(search);
      let liveClassID = params.get("liveClassID");
      let student_id = String(identity)?.split("-")[0];
      setStudentIds([...remoteParticipants]);
      if (identity === "tutor") {
        student_id = String(remoteParticipants[0])?.split("-")[0];
        student_id = student_id === "undefined" ? "" : student_id;
      }
      console.log(student_id);
      if (!student_id) {
        setLoading(false);
        setNoStudentFound(true);
        setError(false);
        if (isCheckInActivity) {
          handleEndCheckInActivity();
        } else {
          handleEndCheckOutActivity();
        }
        return;
      }
      if (!isCheckInActivity) {
        fecthCheckoutApiData({ liveClassID, student_id });
        return;
      }
      const { data } = await studentCheckInGetData(student_id, liveClassID);
      if (data?.status) {
        setLoading(false);
        setCheckinActivityId(data?.activity_id);
        setApiData(data);
        setError(false);
        setNoStudentFound(false);

        sendCicoDataToStudent({
          data,
          type: "Check In",
          isCheckInActivity: true,
        });
      } else {
        console.log("loading6");
        setLoading(false);
        setNoStudentFound(false);
        setError(true);
        handleEndCheckInActivity();
        seterrorMsg(data?.message ?? "");
      }
    } catch (e) {
      console.log("loading5");
      setLoading(false);
      setNoStudentFound(false);
      setError(true);
    }
  };
  const fecthCheckoutApiData = async ({ liveClassID, student_id }) => {
    try {
      let obj = {
        student_id: student_id,
        live_class_id: liveClassID,
      };
      const { data } = await studentCheckOutGetData(obj);
      if (data?.status) {
        setLoading(false);
        console.log(data?.activity_id);
        setCheckinActivityId(data?.activity_id);
        setSelectedCheckInFeeling(data?.student_activity_data[0] || {});
        setApiData(data);
        setError(false);
        setNoStudentFound(false);
        sendCicoDataToStudent({
          data,
          type: "Check Out",
          isCheckInActivity: false,
        });
      } else {
        console.log("loading2");
        setLoading(false);
        setNoStudentFound(false);
        setError(true);
        handleEndCheckOutActivity();
        seterrorMsg(data?.message ?? "");
      }
    } catch (e) {
      console.log("loading3", e);
      setLoading(false);
      setNoStudentFound(false);
      setError(true);
    }
  };
  useEffect(() => {
    // handleResize();
    // window.addEventListener("resize", handleResize);
    // return () => window.removeEventListener("resize", handleResize);
  }, []);
  const handleResize = () => {
    let upperBoxElem = document?.getElementById("mainActivityOuterBox");
    let mainElement = document?.getElementById("innerContainerMainActivity");
    let removeHeight = upperBoxElem?.getBoundingClientRect()?.bottom;
    if (ipad) removeHeight += 35;
    mainElement.style = `min-height:calc(100vh - ${removeHeight}px);height:calc(100vh - ${removeHeight}px);max-height:calc(100vh - ${removeHeight}px) `;
    0;
  };
  const heightRef = useRef();

  return (
    <>
      <div
        className={`${styles2.mainPage} h-full w-full m-0`}
        style={{ margin: 0, padding: 0, width: "100%" }}
      >
        <div
          style={{
            width: "100%",
            padding: 0,
            margin: 0,
            height: "fit-content",
          }}
          ref={heightRef}
        ></div>
        <QuizPageLayout height={0}>
          {(loading || noStudentFound) && (
            <LoadingIndicator
              msg={
                loading
                  ? "Loading"
                  : "Check-in/Check-out activity can be started after the student has joined in"
              }
            />
          )}
          <div>
            {error && (
              <h1>{errorMsg || "No Activity Assigned to this batch..."}</h1>
            )}
          </div>

          {!loading && (
            <>
              {activityList[apiData?.name] && (
                <div
                  style={{
                    position: "relative",
                    margin: "0 auto",
                    width: "calc(100% - 160px)",
                    maxHeight: `calc(100% - ${false ? 78 : 20}px)`,
                    minHeight: `calc(100% - ${false ? 78 : 20}px)`,
                  }}
                >
                  <QuizWhitePage>{activityList[apiData?.name]}</QuizWhitePage>
                </div>
              )}
            </>
          )}
          {/* <AffirmationActivity
        identity={identity}
        isCheckInActivity={isCheckInActivity}
        remoteParticipants={remoteParticipants}
        handleCloseActivity={handleCloseActivity}
        sendSelectedAffirmationValue={sendSelectedAffirmationValue}
        studentResponse={affirmationActivityStudentResponse}
        onSendStoriesToStudent={onSendStoriesToStudent}
        showAffirmationStories={showAffirmationStories}
        storyBookPageNumber={storyBookPageNumber}
        handleChangePageNumber={handleChangePageNumber}
        apiData={apiData}
        showEndActivityAnimation={showEndActivityAnimation}
        showAffirmationNextButton={showAffirmationNextButton}
        participantMuted={participantMuted}
        tutorMuteStatus={tutorMuteStatus}
      /> */}
          {/* <ShapeChallengeCheckInActivity
        identity={identity}
        isCheckInActivity={isCheckInActivity}
        notification={showActivityNotification}
        handleShowActivityNotification={handleShowActivityNotification}
        remoteParticipants={remoteParticipants}
        handleCloseActivity={handleCloseActivity}
        sendShapeChallengeImage={sendShapeChallengeImage}
        shapeActivityStudentResponse={shapeActivityStudentResponse}
        remoteSendData={sendActiveWhiteBoardData}
        whiteBoardPoints={shapesActivityTutorsWhiteBoardPoint}
        renderShapeChallenge={renderShapeChallenge}
        IpadState={IpadState}
        onStudentIpadState={onStudentIpadState}
        apiData={apiData}
        showEndActivityAnimation={showEndActivityAnimation}
        tutorName={tutorName}
        checkInActivityId={checkInActivityId}
        teacherActivityResponseSaved={teacherActivityResponseSaved}
        handleSendTeacherActivityResponse={handleSendTeacherActivityResponse}
        participantMuted={participantMuted}
      /> */}
          {/* <MainFeelingChart 
       identity={identity}
       selectedImg={FeelingChartSelectedImg}
       onSendSelectedFeelingImg={onSendSelectedFeelingImg}
       onSendOpenDropBox={onSendOpenDropBox}
       isCheckInActivity={isCheckInActivity}
       feelingChartDropBox={feelingChartDropBox}
       FeelingChartSelectedImgCheckout={FeelingChartSelectedImgCheckout}
       selectedImgId={FeelingChartSelectedImg}
       onSendStoriesToStudent={onSendStoriesToStudent}
       showAffirmationStories={showAffirmationStories}
       showAffirmationNextButton={showAffirmationNextButton}

      /> */}
        </QuizPageLayout>
      </div>
    </>
  );
}
