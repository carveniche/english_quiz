import { useEffect, useState, useContext, useRef } from "react";
import styles from "../../Mathzone/component/OnlineQuiz.module.css";
import {
  TeacherQuizDisplay,
  ValidationContext,
  ValidationContextProvider,
} from "../../Mathzone/MainOnlineQuiz/MainOnlineQuizPage";
import { ViewStatusContext } from "../../Mathzone/mathzone";
import TeacherViewEachResponseEnd from "../../Mathzone/component/ScoreUpdate/Teacher/TeacherViewResEnd/TeacherViewEachResponseEnd";
import { reviewPrePostTestResult } from "../../../../api";
interface ViewIncorrectQuestionParams {
  studentId: number | string | null | undefined;
  onClick: Function;
  user_id: number | string;
  exerciseId: string | number;
  prepostId: string | number;
  identity: string;
  currentIndex: number;
  handleDataTrack: Function;
}
interface ViewIncorrectViewStatusContextParams {
  updateTotalQuestionReview: Function;
  currentQuestionReview: number;
  handleChangeQuestionReview: Function;
  questionDemount: boolean;
  totalReviewResult: number;
  setTotalQuestion: Function;
}
export default function ViewIncorrectQuestion({
  studentId,
  onClick,
  user_id,
  exerciseId,
  prepostId,
  identity,
  currentIndex,
  handleDataTrack,
}: ViewIncorrectQuestionParams) {
  console.log(exerciseId);
  const [datas, setDatas] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetchDatas(user_id, studentId, exerciseId, prepostId);

    return () => {
      updateTotalQuestionReview(0);
      handleChangeQuestionReview(-currentQuestionReview);
      setTotalQuestion(0);
    };
  }, []);

  const fetchDatas = async (
    user_id: string | number,
    student_id: string | number,
    exercise_id: string | number,
    pre_post_test_id: string | number
  ) => {
    try {
      let result = await reviewPrePostTestResult({
        user_id,
        student_id,
        exercise_id,
        pre_post_test_id,
      });

      setDatas(result?.data?.result_data);
      //filteringDatas(result?.data?.results)
      updateTotalQuestionReview(result?.data?.result_data?.length || 0);
      setTotalQuestion(result?.data?.result_data?.length || 0);
      console.log(result);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };
  const ckeditorRef = useRef();

  const {
    updateTotalQuestionReview,
    currentQuestionReview,
    handleChangeQuestionReview,
    questionDemount,
    totalReviewResult,
    setTotalQuestion,
    handlePaginationRevieResult,
  } = useContext(ViewStatusContext);
  useEffect(() => {
    if (identity === "tutor" && currentQuestionReview > -1) {
      typeof handleDataTrack === "function" &&
        handleDataTrack(currentQuestionReview);
    }
  }, [currentQuestionReview]);
  useEffect(() => {
    if (identity === "tutor") {
      return;
    }
    handlePaginationRevieResult(currentIndex);
  }, [currentIndex]);
  return (
    <div className={styles.resultReview}>
      {identity === "tutor" && (
        <div style={{ clear: "both" }}>
          {" "}
          <button
            className={styles.NextButton2}
            onClick={() => onClick()}
            style={{
              marginTop: "0.4rem",
              marginRight: "0.4rem",
              minHeight: "24px",
              height: "24px",
              background: "none",
              color: "black",
              float: "right",
              "&:hover": { background: "darkred" },
            }}
          >
            X
          </button>
        </div>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBlock: "0.8rem",
        }}
      >
        <div>
          <u style={{ fontSize: "22px" }}>Result Review</u>
        </div>
      </div>
      {isLoading ? (
        <h1>Loading...</h1>
      ) : (
        <>
          <div className={styles.timerContainer}>
            <div className={styles.timerCircle}>
              <span className={styles.timerTime} id={styles.timerDisplay}>
                {(() => {
                  let count = 0;
                  if (
                    typeof datas === "object" &&
                    typeof datas[currentQuestionReview] === "object"
                  ) {
                    let type1 = datas[currentQuestionReview]?.question_data;
                    if (Array.isArray(type1)) {
                      count = type1[1]?.time_spent || 0;
                    }
                  }
                  let mm = Math.floor(count / 60);
                  let ss = count % 60;
                  return `${mm.toString().padStart(2, "0")}:${ss
                    .toString()
                    .padStart(2, "0")}`;
                })()}
              </span>
            </div>
          </div>
          {(() => {
            if (
              typeof datas === "object" &&
              typeof datas[currentQuestionReview] === "object"
            ) {
              let obj = {
                ...datas[currentQuestionReview],
                question_no: currentQuestionReview + 1,
                total: totalReviewResult,
              };
              return (
                <div style={{ clear: "both" }} ref={ckeditorRef}>
                  <ValidationContextProvider>
                    <ShowQuestion obj={obj} questionDemount={questionDemount} />
                  </ValidationContextProvider>
                </div>
              );
            } else return <h1>No Data Found</h1>;
          })()}
          <div style={{ clear: "both" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "1.7rem",
                marginBlock: "0.8rem",
              }}
            >
              <div>
                <u style={{ fontSize: "22px" }}>Student Response</u>
              </div>
            </div>
            {(() => {
              let { question_data } = datas[currentQuestionReview];
              question_data = question_data ?? [];
              let originalQuestion = question_data[0] || "";
              let response = question_data[1] || "";
              let type = originalQuestion?.question_type || "";
              if (!originalQuestion || !response || !type) return "";

              response = { ...response, correct: false };
              return questionDemount ? (
                <TeacherViewEachResponseEnd
                  type={type}
                  response={response}
                  timerStatus={true}
                  questionDatas={{
                    question_data: [originalQuestion],
                    result_data: [{ ...response }],
                  }}
                />
              ) : (
                ""
              );
            })()}
          </div>
        </>
      )}
    </div>
  );
}

function ShowQuestion({
  obj,
  questionDemount,
}: {
  obj: object;
  questionDemount: boolean;
}) {
  const { handleUpdateStudentAnswerResponse, setIsProgressBarVisible } =
    useContext(ValidationContext);
  useEffect(() => {
    handleUpdateStudentAnswerResponse(false);
    setIsProgressBarVisible(false);
  }, []);
  return questionDemount ? (
    <TeacherQuizDisplay obj={obj} showSolution={true} />
  ) : (
    ""
  );
}
