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
import {
  handleUpdateNextPrePostQuestion,
  handleUpdateNextQuestion,
  startPrePostTest,
} from "../../../api";
import useSpeakerViewParticipants from "../../../hooks/useSpeakerViewParticipants/useSpeakerViewParticipants";
import { allExcludedParticipants } from "../../../utils/excludeParticipant";
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
import SkippedQuestionModal from "./Modal/SkippedQuestionModal";
import MathzoneWhiteBoard from "../Mathzone/MathzoneWhiteBoard";
export default function PrePostTestInner() {
  const [showSkippedQuestionReviewModal, setShowSkippedQuestionReviewModal] =
    useState(false);
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
  const lastCallBackRef = useRef(null);
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
      handleDataTrack({ data }, localParticipant);
    }
  };
  const handleNextQuestion = async (skipped_review, pre_post_test_id) => {
    setLoading(true);
    let { data } = await handleUpdateNextPrePostQuestion({
      skipped_review,
      pre_post_test_id,
    });
    if (data?.status) {
      setObj({ ...data });
      setLoading(false);
      handleDataTrack({ data }, localParticipant);
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
    if (localParticipant === "tutor") checkStudentData(mathzone);
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

  const handleCheckLastQuestionBeforeSkipping = (
    isUpdatedQuestion,
    cb,
    data
  ) => {
    if (isUpdatedQuestion) {
      setObj({ ...data });
      handleDataTrack({ data }, localParticipant);
      setKey(key + 1);
      return;
    }
    if (
      obj?.question_no == obj?.total &&
      obj?.skipped_questions_present &&
      obj?.questions_from != "skipped"
    ) {
      setShowSkippedQuestionReviewModal(true);
      if (typeof cb === "function") lastCallBackRef.current = cb;
    } else if (obj?.questions_from == "skipped") {
      console.log("not same but questions_from is skipped");
      handleNextQuestion(true, practiceId);
    } else {
      console.log("not same");
      if (typeof cb === "function") {
        cb(false);
      } else handleNextQuestion(false, practiceId);
    }
  };
  const handleCheckSkippedQuestion = async (value) => {
    let skipped_review;
    if (value === "true") {
      skipped_review = true;
    } else {
      skipped_review = false;
    }
    if (typeof lastCallBackRef.current === "function") {
      lastCallBackRef.current(skipped_review);
      lastCallBackRef.current = null;
    } else handleNextQuestion(skipped_review, practiceId);
    setShowSkippedQuestionReviewModal(false);
  };
  const handleCloseModal = (value) => {
    handleCheckSkippedQuestion(value ? "true" : "false");
    setShowSkippedQuestionReviewModal(false);
  };
  return (
    <>
      {showSkippedQuestionReviewModal && localParticipant !== "tutor" && (
        <SkippedQuestionModal checkSkippedQuestion={handleCloseModal} />
      )}
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
                onClick={() => handleCheckLastQuestionBeforeSkipping()}
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
                isPrepostTest={true}
                onClick={handleCheckLastQuestionBeforeSkipping}
              />
            )}
          </div>

          <QuizPageLayout key={key} height={currentHeight}>
            {!obj?.quiz_completed && (
              <MathzoneWhiteBoard
                currentSelectedRouter={currentSelectedRouter}
                currentSelectedKey={currentSelectedKey}
              />
            )}
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
                  <RenderingQuizPage
                    obj={obj}
                    identity={localParticipant}
                    isPrePostTest={true}
                    handleCheckLastQuestionBeforeSkipping={
                      handleCheckLastQuestionBeforeSkipping
                    }
                    dataTrackKey={MATHZONEDATAKEY.mathzoneWhiteBoardData}
                  />
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
