import React, { useEffect, useRef, useState } from "react";
import QuizPageLayout from "../Mathzone/QuizPageLayout/QuizPageLayout";
import styles from "./EnglishQuizZoneOuter.module.css";
import styles2 from "./EnglishQuizZoneInner.module.css";
import QuizWhitePage from "../Mathzone/QuizPageLayout/QuizWhitepage";
import {
  handleUpdateNextQuestionEnglishQuiz,
  startPracticeEnglishQuizZone,
} from "../../../api/englishApi";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { isTutorTechBoth } from "../../../utils/participantIdentity";
import useVideoContext from "../../../hooks/useVideoContext/useVideoContext";
import { ENGLISHQUIZDATAKEY, MATHZONEDATAKEY } from "../../../constants";
import RenderedQuestion from "./RenderedQuestion";
import { allExcludedParticipants } from "../../../utils/excludeParticipant";
import useSpeakerViewParticipants from "../../../hooks/useSpeakerViewParticipants/useSpeakerViewParticipants";
import TeachersTitle from "./Teacher/TeachersTitle";
import StudentsTitle from "./Student/StudentsTitle";

export default function EnglishQuiz() {
  const { concept, objective_id, level } = useParams();
  const { liveClassId } = useSelector((state) => state.liveClassDetails);
  const [loading, setLoading] = useState(true);
  const [obj, setObj] = useState({});
  const [formattedQuestionData, setFormattedQuestionData] = useState({});
  const [practiceId, setPracticeId] = useState();
  const [currentHeight, setCurrentHeight] = useState(0);
  const heightRef = useRef(null);
  const { room } = useVideoContext();
  const speakerViewParticipants = useSpeakerViewParticipants();
  const localParticipant = room?.localParticipant?.identity;
  const remoteParticipant = speakerViewParticipants.filter((item) => {
    return !allExcludedParticipants.includes(item.identity);
  });
  const {
    currentSelectedRouter,
    currentSelectedIndex,
    currentSelectedKey,
    activeTabArray,
  } = useSelector((state) => state.activeTabReducer);
  let activeTabData = activeTabArray[currentSelectedIndex];

  const handleDataTrack = (data, identity) => {
    const [localDataTrackPublication] = [
      ...room.localParticipant.dataTracks.values(),
    ];
    let DataTrackObj = {
      pathName: currentSelectedRouter,
      key: currentSelectedKey,
      value: {
        type: ENGLISHQUIZDATAKEY.englishquizQuestionData,
        identity: null,
        englishQuizData: {
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

  const startEnglishQuiz = async () => {
    let { data } = await startPracticeEnglishQuizZone({
      live_class_id: liveClassId,
      objective_id: 409,
      new_level: level,
    });

    if (data?.status) {
      setLoading(false);
      setObj({ ...data });
      fixedQuestionFormat(data);
      setPracticeId(data?.details.live_class_practice_id || "");
    }
  };

  const handleNextQuestion = async (
    live_class_practice_id,
    objective_id,
    level,
    live_class_id,
    identity
  ) => {
    let isAuthorizedUser = isTutorTechBoth({ identity });
    if (!isAuthorizedUser) {
      return;
    }
    setLoading(true);

    console.log("live_class_practice_id", live_class_practice_id);
    console.log("objective_id", objective_id);
    console.log("level", level);
    console.log("live_class_id", live_class_id);
    console.log("identity", identity);
    return;
    let { data } = await handleUpdateNextQuestionEnglishQuiz({
      live_class_practice_id,
      objective_id,
      level,
      live_class_id,
    });
    if (data?.status) {
      setObj({ ...data });
      setLoading(false);
      handleDataTrack({ data }, identity);
      setKey(key + 1);
    }
  };
  const fixedQuestionFormat = (obj) => {
    let formatData = {
      group_type: "",
      group_data: {
        group_type: "",
        question_text: "",
      },
      question_data: [
        {
          question_type: "",
          question_data: "",
        },
      ],
    };
    let { details } = obj;
    details = details[0];

    if (details?.group_type == "group") {
      formatData.group_type = details?.group_question_type || "";
      formatData.group_data.group_type = details?.group_question_type || "";
      formatData.group_data.question_text = details?.group_data || "";
    }
    formatData.question_data[0].question_type = details?.question_type || "";
    formatData.question_data[0].question_data = details?.question_data || "";
    setFormattedQuestionData({ ...formatData });
  };

  function handleResizeWidth(elementRef, dispatch) {
    let height = elementRef ? elementRef.clientHeight : 0;
    typeof dispatch === "function" && dispatch(height || 0);
  }

  useEffect(() => {
    startEnglishQuiz();
  }, []);

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
            {localParticipant === "tutor" ? (
              <TeachersTitle
                remoteParticipant={remoteParticipant}
                isQuizCompleted={obj?.quiz_completed}
                onClick={() =>
                  handleNextQuestion(
                    practiceId,
                    objective_id,
                    level,
                    liveClassId,
                    localParticipant
                  )
                }
                totalQuestion={obj?.total}
                practiceId={practiceId}
                currentQuestion={obj?.question_no}
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

          <QuizPageLayout height={currentHeight}>
            <div className={styles.title2}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  fontWeight: "bold !important",
                }}
                id={styles.titleStatus}
              >
                English Quiz
              </div>
            </div>
            <div
              style={{
                position: "relative",
                margin: "0 auto",
                width: "calc(100% - 160px)",
                maxHeight: `calc(100% - 60px)`,
                minHeight: `calc(100% - 60px)`,
              }}
            >
              <QuizWhitePage>
                {Object.keys(formattedQuestionData).length ? (
                  <RenderedQuestion obj={formattedQuestionData} />
                ) : null}
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
