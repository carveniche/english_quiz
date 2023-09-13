import { useEffect, useRef, useState } from "react";
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
import html2canvas from "html2canvas";
import PreviewModal from "./PreviewModal";
import LoadingIndicatorModal from "../LoadingIndicatorModal";
import HtmlParser from "react-html-parser";
const CheckOutAffirmationActivity = ({ identity, listOfAffirmation }) => {
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
    setIndicatorText("Image is capturing...");
    let element = document.querySelector("#videoStudentElement");
    setLoading(true);
    if (!element) {
      alert("Please wait for student joining");
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

  const takeScreenShot2 = (id: string) => {
    html2canvas(document.querySelector(id), {
      scale: 1,
      useCORS: true,
      logging: true,
    })
      .then(async (canvas) => {
        var img = canvas.toDataURL("image/png");
        console.log(img);
      })
      .catch((err) => {
        console.log("Screen shot failed", err);
        setLoading(false);
      });
  };
  const handleConfirm = () => {
    takeScreenShot2("#badgesWithImages");
  };
  return !otherData?.checkInOutImageUrl ? (
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
              src={newListOfAffirmation[0].image}
              style={{ maxWidth: 250 }}
            />
          </div>
          <div style={{ textAlign: "center" }}>{instruction.instruction6}</div>
          <div style={{ textAlign: "center" }}>
            {HtmlParser(instruction.instruction7)}
          </div>
        </div>
      ) : (
        <div
          className="flex flex flex-col items-center"
          style={{ gap: "0.5rem" }}
        >
          <div style={{ textAlign: "center" }}>
            <img
              src={newListOfAffirmation[0].image}
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
          checkIn={CICO.checkIn}
          micRef={null}
        />
      </div>
      <div
        style={{
          display: "flex",
          gap: "0.1rem",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "1rem",
        }}
      >
        <div
          style={{
            fontSize: "16px",
          }}
        >
          {instruction?.instruction2}
        </div>
        <div style={{ fontSize: "16px" }}>{instruction?.instruction3}</div>
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
      </div>
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
  checkOutData,
}) {
  console.log(checkOutData);
  const dispatch = useDispatch();
  const { otherData } = useSelector(
    (state: RootState) => state.ComponentLevelDataReducer
  );

  let instruction =
    activityType === CICO.checkIn
      ? TeacherCheckInInstruction()
      : TeacherCheckOutInstruction();
  console.log(instruction);
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
      {isCheckInActivity ? (
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
      ) : (
        <div>
          <ActivityTimerEndButton
            isShowCornerImage={false}
            activityType={activityType}
            isBadgesVisible={false}
            selectedItem={listOfAffirmation[0]}
            currentTime={Date.now()}
            timerRef={timerRef}
            instruction={
              otherData?.isCheckOutSaveResponse
                ? ""
                : `${instruction?.instruction1?.replace(
                    "{}",
                    checkOutData?.selected_checkin_name
                  )}`
            }
            showEndButton={true}
            showNextButton={false}
            text={
              isCheckInActivity
                ? otherData?.isCheckInShowNextButton
                  ? "Read a story"
                  : null
                : null
            }
          />
          <CheckOutAffirmationActivity
            identity={"tutor"}
            listOfAffirmation={[checkOutData]}
          />
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
  const fetchCheckOutResponse = () => {
    let checkOutData = apiData?.student_activity_data || [];
    checkOutData = checkOutData[0];

    if (checkOutData) {
      setCheckOutData(checkOutData);
    }
  };
  useEffect(() => {
    if (activityType === CICO.checkOut) fetchCheckOutResponse();
  }, []);
  return (
    <>
      <div style={{ position: "relative" }}>
        {identity === "tutor" ? (
          <AffirmationTeacherScreen
            apiData={apiData}
            listOfAffirmation={listOfAffirmation}
            activityType={activityType}
            handleDataTrack={handleDataTrack}
            checkOutData={checkOutData}
          />
        ) : (
          <>
            <AffirmationStudentScreen
              apiData={apiData}
              listOfAffirmation={listOfAffirmation}
              activityType={activityType}
              handleDataTrack={handleDataTrack}
              checkOutData={checkOutData}
            />
          </>
        )}
      </div>
    </>
  );
}
