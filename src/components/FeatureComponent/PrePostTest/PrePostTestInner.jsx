import React, { useEffect, useRef, useState } from "react";
import styles from "../Mathzone/component/OnlineQuiz.module.css";
import styles2 from "../Mathzone/outerPage.module.css";
import {
  RenderingQuizPage,
  ValidationContextProvider,
} from "../Mathzone/MainOnlineQuiz/MainOnlineQuizPage";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { ViewStatusContext } from "../Mathzone/mathzone";
import { handleUpdateNextQuestion, startPrePostTest } from "../../../api";
import useSpeakerViewParticipants from "../../../hooks/useSpeakerViewParticipants/useSpeakerViewParticipants";
import {
  allExcludedParticipants,
  excludeParticipant,
} from "../../../utils/excludeParticipant";
import useVideoContext from "../../../hooks/useVideoContext/useVideoContext";
import { isTutorTechBoth } from "../../../utils/participantIdentity";
import { MATHZONEDATAKEY } from "../../../constants";
import OnlineQuizPagination from "../Mathzone/Teacher/OnlineQuizPagination";
import StudentsTitle from "../Mathzone/Student/StudentsTitle";
import handleResizeWidth from "../Mathzone/handleResizeWidth";
import ViewQuestionAtMiddle from "../Mathzone/Teacher/ViewQuestionAtMiddle";
import QuizPageLayout from "../Mathzone/QuizPageLayout/QuizPageLayout";
import QuizWhitePage from "../Mathzone/QuizPageLayout/QuizWhitepage";
import QuizCompleted from "./QuizCompleted";
import TeachersTitle from "./Teacher/TeachersTitle";
export default function PrePostTestInner() {
  const [loading, setLoading] = useState(true);
  const [keys, setKeys] = useState(0);
  const [obj, setObj] = useState({});
  const { concept, tag, level } = useParams();
  const [showErrorMsg, setShowErrorMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [currentHeight, setCurrentHeight] = useState(0);
  const {
    totalQuestion,
    totalReviewResult,
    reviewResultStatus,
    currentQuestionReview,
    questionStatus,
  } = React.useContext(ViewStatusContext);
  const speakerViewParticipants = useSpeakerViewParticipants();
  const { room } = useVideoContext();
  const localParticipant = room?.localParticipant?.identity;
  const remoteParticipant = speakerViewParticipants.filter((item) => {
    return !allExcludedParticipants.includes(item.identity);
  });
  const { mathzone } = useSelector((state) => state.ComponentLevelDataReducer);
  const heightRef = useRef(null);
  const [practiceId, setPracticeId] = useState();
  const [key, setKey] = useState(0);
  const { liveClassId, userId } = useSelector(
    (state) => state.liveClassDetails
  );
  const {
    currentSelectedRouter,
    currentSelectedIndex,
    currentSelectedKey,
    activeTabArray,
  } = useSelector((state) => state.activeTabReducer);
  let { students } = useSelector((state) => state.videoCallTokenData);
  students = students || [];

  const handleDataTrack = (data, identity) => {
    const [localDataTrackPublication] = [
      ...room.localParticipant.dataTracks.values(),
    ];
    let activeTabData = activeTabArray[currentSelectedIndex];
    let DataTrackObj = {
      pathName: currentSelectedRouter,
      key: currentSelectedKey,
      value: {
        type: MATHZONEDATAKEY.mathzoneQuestionData,
        identity: null,
        mathzoneData: {
          questionData: data?.data ?? {},
          status: true,
          errorMsg: "",
          isError: false,
        },
        activeTabData,
      },
    };

    localDataTrackPublication.track.send(JSON.stringify(DataTrackObj));
  };
  const startPracticeQuestion = async (
    live_class_id,
    concept,
    tag,
    level,
    identity,
    user_id
  ) => {
    let isAuthorizedUser = isTutorTechBoth({ identity });

    let { data } = await startPrePostTest({
      live_class_id: live_class_id,
      sub_concept_id: concept,
      test_type: tag,
      student_id: user_id,
    });
    if (data?.status) {
      setLoading(false);
      setObj({ ...data });
      setPracticeId(data?.pre_post_test_id || "");
      handleDataTrack({ data }, identity);
    }
  };
  const handleNextQuestion = async (
    live_class_practice_id,
    tag_id,
    level,
    live_class_id,
    identity
  ) => {
    let isAuthorizedUser = isTutorTechBoth({ identity });
    if (!isAuthorizedUser) {
      return;
    }
    setLoading(true);
    let { data } = await handleUpdateNextQuestion({
      live_class_practice_id,
      tag_id,
      level,
      live_class_id,
    });
    if (data?.status) {
      console.log(data);
      setObj({ ...data });
      setLoading(false);
      handleDataTrack({ data }, identity);
      setKey(key + 1);
    }
  };
  React.useEffect(() => {
    setLoading(true);
    let user_id = userId;

    if (allExcludedParticipants.includes(localParticipant)) {
      user_id = students[0]?.id || userId;
    }
    startPracticeQuestion(
      liveClassId,
      concept,
      tag,
      level,
      localParticipant,
      user_id
    );
  }, []);
  React.useEffect(() => {
    console.log(mathzone);
    if (localParticipant !== "tutor") checkStudentData(mathzone);
  }, [JSON.stringify(mathzone)]);
  const checkStudentData = () => {
    if (mathzone?.status) {
      if (
        typeof mathzone?.questionData === "object" &&
        Object.keys(mathzone.questionData).length
      ) {
        setObj(mathzone.questionData);
        setLoading(false);
        setKey(key + 1);
      }
    }
  };
  useEffect(() => {
    window.addEventListener("resize", () => {
      setTimeout(() => {
        handleResizeWidth(heightRef.current, setCurrentHeight);
      }, 500);
    });
    return () => {
      window.removeEventListener("resize", () => {
        setTimeout(() => {
          handleResizeWidth(heightRef.current, setCurrentHeight);
        }, 500);
      });
    };
  }, []);
  useEffect(() => {
    if (!loading)
      setTimeout(() => {
        handleResizeWidth(heightRef.current, setCurrentHeight);
      }, 500);
  }, [obj?.quiz_completed, loading]);

  return (
    <>
      {!loading ? (
        <div
          className={`${styles.mainPage} h-full w-full m-0`}
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
          >
            {localParticipant === "tutor" &&
              reviewResultStatus &&
              obj?.quiz_completed &&
              totalReviewResult > 1 && (
                <div className={styles.paginationContainer}>
                  <OnlineQuizPagination />
                </div>
              )}
            {localParticipant === "tutor" ? (
              <TeachersTitle
                remoteParticipant={remoteParticipant}
                isQuizCompleted={obj?.quiz_completed}
                onClick={() =>
                  handleNextQuestion(
                    practiceId,
                    tag,
                    level,
                    liveClassId,
                    localParticipant
                  )
                }
                currentQuestion={
                  obj?.quiz_completed
                    ? currentQuestionReview + 1
                    : obj?.question_no
                }
                totalQuestion={
                  obj?.quiz_completed ? totalReviewResult : obj?.total
                }
                pre_post_test_id={practiceId}
                liveClassId={liveClassId}
              />
            ) : (
              <StudentsTitle
                isQuizCompleted={obj?.quiz_completed}
                currentQuestion={obj?.question_no}
                totalQuestion={obj?.total}
                obj={obj}
              />
            )}
          </div>
          <QuizPageLayout key={key} height={currentHeight}>
            <div
              style={{
                position: "relative",
                margin: "0 auto",
                width: "calc(100% - 160px)",
                maxHeight: `calc(100% - ${
                  !obj?.quiz_completed && localParticipant !== "tutor" ? 78 : 58
                }px)`,
                minHeight: `calc(100% - ${
                  !obj?.quiz_completed && localParticipant !== "tutor" ? 78 : 58
                }px)`,
              }}
            >
              {!obj?.quiz_completed && localParticipant !== "tutor" && (
                <div style={{ width: "100%", height: 58 }}></div>
              )}
              <QuizWhitePage>
                {obj?.quiz_completed ? (
                  <QuizCompleted
                    identity={localParticipant}
                    liveClassPracticeId={
                      practiceId || obj?.live_class_practice_id
                    }
                    reportsData={obj?.report_data || []}
                    userId={userId}
                    student={students[0]}
                  />
                ) : questionStatus ? (
                  <ValidationContextProvider>
                    <ViewQuestionAtMiddle />
                  </ValidationContextProvider>
                ) : (
                  <RenderingQuizPage obj={obj} identity={localParticipant} />
                )}
              </QuizWhitePage>
            </div>
          </QuizPageLayout>
        </div>
      ) : (
        <h1>Loading...</h1>
      )}
    </>
  );
}
