import React, { useEffect, useRef, useState } from "react";
import { allExcludedParticipants } from "../../../../utils/excludeParticipant";
import {
  StudentActivityResponseSave,
  getStudentActivityResponse,
  submitErrorLog,
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
const StoriesToShow = ({ apiData, identity, handleDataTrack }) => {
  const { otherData }: { otherData: any } = useSelector(
    (state: RootState) => state.ComponentLevelDataReducer
  );
  const [storiesData, setStoriesData] = useState([]);
  useEffect(() => {
    console.log(apiData);
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
    formData.append("student_id", "");
    formData.append("checkin_ativity_id", "");
    formData.append("live_class_id", "");
    formData.append("duration", `${timerRef.current.count}`);
    formData.append("checkin_out_activity_category_id", "");
    try {
      const { data } = await StudentActivityResponseSave(formData);
      if (!data.status) await submitErrorLog("", "", "", "", "0");

      dispatch(
        cicoComponentLevelDataTrack({
          isCheckForResponse: !otherData.isCheckForResponse,
        })
      );
    } catch (e) {
      alert("something went wrong please try again letter");
      await submitErrorLog("", "", "", "", "0");
    }
  };
  console.log(otherData?.isCheckInSaveResponse);
  return (
    <>
      <div>
        <StudentActivityTimer
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
            otherData?.isCheckInActivity && otherData.isCheckInSaveResponse
              ? handleSubmitCheckInResponse
              : null
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
              activityType === CICO.checkIn && !otherData?.isCheckInSaveResponse
                ? handleAffirmationSelect
                : null
            }
          />
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
}) {
  const dispatch = useDispatch();
  const { otherData } = useSelector(
    (state: RootState) => state.ComponentLevelDataReducer
  );
  console.log(listOfAffirmation);
  let instruction =
    activityType === CICO.checkIn
      ? TeacherCheckInInstruction()
      : TeacherCheckOutInstruction();

  const handleStopTiming = () => {
    clearInterval(timerRef.current);
  };
  useEffect(() => {
    if (otherData?.isCheckInSaveResponse && activityType === CICO.checkIn) {
      handleStopTiming();
    }
  }, [otherData?.isCheckInSaveResponse]);
  const timerRef = useRef();
  let isCheckInActivity = CICO.checkIn === activityType;
  const handleEndCheckInActivity = () => {};
  const handleCheckOutActivity = () => {};
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
  return (
    <>
      <div>
        <ActivityTimerEndButton
          isShowCornerImage={otherData?.isShowStories ? true : false}
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
            isCheckInActivity
              ? !otherData.isCheckInShowNextButton
                ? handleEndCheckInActivity
                : () => {}
              : handleCheckOutActivity
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
  const [showStories, setShowStories] = useState();
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
      console.log(activity_data2);
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
    console.log(apiData);
    if (activityType === CICO.checkIn) {
      fetchCheckInResponse();
    }
  }, [otherData?.isCheckForResponse]);
  return (
    <>
      <div style={{ position: "relative" }}>
        {identity === "tutor" ? (
          <AffirmationTeacherScreen
            apiData={apiData}
            listOfAffirmation={listOfAffirmation}
            activityType={activityType}
            handleDataTrack={handleDataTrack}
          />
        ) : (
          <>
            <AffirmationStudentScreen
              apiData={apiData}
              listOfAffirmation={listOfAffirmation}
              activityType={activityType}
              handleDataTrack={handleDataTrack}
            />
          </>
        )}
      </div>
    </>
  );
}
