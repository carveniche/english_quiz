import React, { useEffect, useRef, useState } from "react";
import { allExcludedParticipants } from "../../../../utils/excludeParticipant";
import { getStudentActivityResponse } from "../../../../api";
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
function AffirmationStudentScreen({
  apiData,
  listOfAffirmation,
  activityType,
}) {
  const [currentSelectAffirmation, setCurrentSelectAffirmation] = useState(-1);
  const timerRef = useRef();
  let instruction =
    activityType === CICO.checkIn
      ? StudentCheckInInstruction()
      : StudentCheckOutInstruction();
  const handleAffirmationSelect = (val: number) => {
    setCurrentSelectAffirmation(val);
  };
  return (
    <>
      <div>
        <StudentActivityTimer
          currentTime={Date.now()}
          timerRef={timerRef}
          instruction={`${instruction?.instruction1}`}
        />
        <AffirmationSelection
          affirmation={listOfAffirmation}
          currentIndex={currentSelectAffirmation}
          className={"container"}
          checkIn={CICO.checkIn}
          micRef={null}
        />
      </div>
    </>
  );
}
function AffirmationTeacherScreen({
  apiData,
  listOfAffirmation,
  activityType,
}) {
  const { otherData } = useSelector(
    (state: RootState) => state.ComponentLevelDataReducer
  );
  let instruction =
    activityType === CICO.checkIn
      ? TeacherCheckInInstruction()
      : TeacherCheckOutInstruction();
  const handleCheckOutNextButton = () => {
    console.log("ankdk");
    // onAffirmationCheckoutNextButton(showCheckoutAffirmationNextBtn?.val);
  };
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
  const handleClickNextBtn = () => {};
  return (
    <>
      <div>
        <ActivityTimerEndButton
          currentTime={Date.now()}
          timerRef={timerRef}
          instruction={
            isCheckInActivity
              ? otherData?.isCheckInSaveResponse
                ? ""
                : `${instruction?.instruction1} <br/>${instruction?.instruction2}`
              : ""
          }
          showEndButton={isCheckInActivity ? true : false}
          showNextButton={isCheckInActivity ? true : false}
          handleEndActivity={
            isCheckInActivity
              ? handleEndCheckInActivity
              : handleCheckOutActivity
          }
          handleClickNext={handleClickNextBtn}
          text={
            isCheckInActivity
              ? otherData?.isCheckInShowNextButton
                ? "Next"
                : null
              : null
          }
        />
        <AffirmationSelection
          affirmation={listOfAffirmation}
          currentIndex={-1}
          className={"container"}
          checkIn={CICO.checkIn}
          micRef={null}
        />
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

      if (activity_data2?.length < 1) {
        setListOfAffirmation([...activity_data]);
        return;
      } else {
        setListOfAffirmation([...activity_data2]);
        let obj: any = {
          isCheckInSaveResponse: true,
          isCheckInShowNextButton: true,
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
    if (!activityType) return;
    fetchCheckInResponse();
  }, []);
  return (
    <>
      <div style={{ position: "relative" }}>
        {identity === "tutor" ? (
          <AffirmationTeacherScreen
            apiData={apiData}
            listOfAffirmation={listOfAffirmation}
            activityType={activityType}
          />
        ) : (
          <>
            {" "}
            <AffirmationStudentScreen
              apiData={apiData}
              listOfAffirmation={listOfAffirmation}
              activityType={activityType}
            />
          </>
        )}
      </div>
    </>
  );
}
