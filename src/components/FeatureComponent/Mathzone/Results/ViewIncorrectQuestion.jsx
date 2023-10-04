import React, { useEffect } from "react";
import { useState } from "react";
import styles from "../component/OnlineQuiz.module.css";
import { TeacherQuizDisplay } from "../MainOnlineQuiz/MainOnlineQuizPage";
import { useContext } from "react";
import { ViewStatusContext } from "../mathzone";
import { useRef } from "react";
import { getReviewResultData } from "../../../../api";
import TeacherViewEachResponseEnd from "../component/ScoreUpdate/Teacher/TeacherViewResEnd/TeacherViewEachResponseEnd";
export default function ViewIncorrectQuestion({
  id,
  practiceId,
  onClick,
  user_id,
}) {
  const [datas, setDatas] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetchDatas();

    return () => {
      updateTotalQuestionReview(0);
      handleChangeQuestionReview(-currentQuestionReview);
      setTotalQuestion(0);
    };
  }, []);

  const fetchDatas = async () => {
    try {
      let result = await getReviewResultData({
        live_class_practice_id: practiceId,
        user_id: user_id,
        student_id: id,
      });

      setDatas(result?.data?.result_data);
      //filteringDatas(result?.data?.results)
      updateTotalQuestionReview(result?.data?.result_data?.length || 0);
      setTotalQuestion(result?.data?.result_data?.length || 0);
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
  } = useContext(ViewStatusContext);
  return (
    <div className={styles.resultReview}>
      <div style={{ clear: "both" }}>
        {" "}
        <button
          className={styles.NextButton2}
          onClick={onClick}
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
                      count = type1[0]?.time_spent;
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
                  {questionDemount ? (
                    <TeacherQuizDisplay obj={obj} resultView={true} />
                  ) : (
                    ""
                  )}
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
              if (
                typeof datas === "object" &&
                typeof datas[currentQuestionReview] === "object"
              ) {
                let type1 = datas[currentQuestionReview]?.question_data;

                if (!Array.isArray(type1)) {
                  return "";
                }
                let type = type1[0]?.question_type;
                let questionDatas = datas[currentQuestionReview];
                let response = type1[0]?.question_response;
                let { choice_id } = questionDatas?.question_data[0];
                let result_data = [{ choice_id }];
                questionDatas = { ...questionDatas, result_data };
                let obj = {
                  correct: false,
                  question_response: response,
                };
                return questionDemount ? (
                  <TeacherViewEachResponseEnd
                    type={type}
                    response={obj}
                    timerStatus={true}
                    questionDatas={questionDatas}
                  />
                ) : (
                  ""
                );
              } else return "";
            })()}
          </div>
        </>
      )}
    </div>
  );
}
