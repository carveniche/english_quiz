import React, { useContext, useEffect, useRef } from "react";
import styles from "../Mathzone/component/OnlineQuiz.module.css";
import styled from "styled-components";
import { FlagQuestionContext } from "../FlagQuestion/ContextProvider/FlagQuestionContextProvider";
import { markAsResolvedHomeWorkQuestion } from "../../../api";
import {
  TeacherQuizDisplay,
  ValidationContext,
  ValidationContextProvider,
} from "../Mathzone/MainOnlineQuiz/MainOnlineQuizPage";
import FlagQuestionPagination from "../FlagQuestion/FlagQuestionPagination/FlagQuestionPagination";
import QuizPageLayout from "../Mathzone/QuizPageLayout/QuizPageLayout";
import TeacherViewEachResponseEnd from "../Mathzone/Results/Teacher/TeacherViewEachResponseEnd";
import QuizWhitePage from "../Mathzone/QuizPageLayout/QuizWhitepage";
import MathzoneWhiteBoard from "../Mathzone/MathzoneWhiteBoard";
import { MISCELLANEOUS } from "../../../constants";
const StaticQuestionRender = ({ obj }) => {
  const { handleUpdateStudentAnswerResponse, setIsProgressBarVisible } =
    useContext(ValidationContext);
  useEffect(() => {
    handleUpdateStudentAnswerResponse(false);
    setIsProgressBarVisible(false);
  }, []);
  return <TeacherQuizDisplay obj={obj} showSolution={true} />;
};
const RenderedStudentResponse = ({ datas }) => {
  const ckeditorRef = useRef();
  const {
    updateTotalQuestionReview,
    currentQuestionReview,
    questionDemount,
    totalReviewResult,
  } = useContext(FlagQuestionContext);
  return (
    <>
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
                <ValidationContextProvider>
                  <StaticQuestionRender obj={obj} />
                </ValidationContextProvider>
              ) : (
                ""
              )}
            </div>
          );
        } else return <h1>No Data Found</h1>;
      })()}
      <div style={{ clear: "both", marginTop: "2rem" }}>
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
              <h1>Loading...</h1>
            );
          } else return "";
        })()}
      </div>
    </>
  );
};
export default function DisplayHomeWorkQuestion({
  obj,
  questionData,
  setShowQuestion,
  openHomeWorkResponse,
  homewWorkStudentName,
  homeWorkCurrentQuestion,
  homeWorkStudentId,
  identity,
  userId,
  quizId,
  homeWorkId,
  liveClassId,
  handleShowQuestion,
  clearCanvas,
  onSendWhiteBoardLines,
  openRoughBoardScreen,
  updatestateforchild,
  reference,
  handleFlagQuestionChange,
  currentSelectedRouter,
  currentSelectedKey,
}) {
  const {
    updateTotalQuestionReview,
    currentQuestionReview,
    questionDemount,
    handleChangeHomeQuestionReview,
  } = useContext(FlagQuestionContext);

  useEffect(() => {
    updateTotalQuestionReview(questionData?.length || 0);
    // handleUpdateStudentAnswerResponse(true);
  }, []);
  useEffect(() => {
    if (identity === "tutor") return;
    typeof handleChangeHomeQuestionReview === "function" &&
      handleChangeHomeQuestionReview(homeWorkCurrentQuestion);
  }, [homeWorkCurrentQuestion]);

  useEffect(() => {
    if (identity === "tutor" && quizId && homeWorkId)
      openHomeWorkResponse({
        studentName: homewWorkStudentName,
        studentId: homeWorkStudentId,
        currentQuestion: currentQuestionReview,
        displayHomeWorkQuestion: true,
        quizId: quizId,
        homeWorkId: homeWorkId,
      });
  }, [currentQuestionReview]);
  const handleResolved = async (currentQuestion, quizId, homeWorkId) => {
    let question = questionData[currentQuestion] || [];
    let questionId = question?.question_data || [];
    questionId = questionId[0]?.question_id;
    try {
      console.log(userId, liveClassId);
      await markAsResolvedHomeWorkQuestion(
        questionId,
        userId,
        liveClassId,
        homeWorkId
      );
      handleChangeHomeQuestionReview(0);
      handleFlagQuestionChange(0);
      handleShowQuestion({
        val: true,
        studentName: homewWorkStudentName,
        studentId: homeWorkStudentId,
        quizId,
        mathzone: {},
        homeWorkId,
      });
    } catch (e) {}
  };
  return (
    <>
      <div id="outerBoxContainerOuiz" style={{ minHeight: 1 }}>
        {identity === "tutor" && questionData?.length > 0 && (
          <div
            style={{
              display: "flex",
              position: "relative",
              height: 40,
              marginTop: "0.4rem",
            }}
          >
            <div
              className={styles.paginationContainer}
              style={{ alignItem: "center" }}
            >
              <FlagQuestionPagination
                handleFlagQuestionChange={handleFlagQuestionChange}
              />
            </div>
            <div className={styles.nextBtnContainer} style={{ width: "180px" }}>
              <button
                id="ooooooo"
                className={styles.NextButton}
                style={{ width: "180px" }}
                onClick={() =>
                  handleResolved(currentQuestionReview, quizId, homeWorkId)
                }
              >
                Mark as reviewed
              </button>
            </div>
          </div>
        )}
      </div>
      <div
        className={`${styles.mainPage} h-full w-full m-0`}
        style={{ margin: 0, padding: 0, width: "100%" }}
      >
        <QuizPageLayout
          clearCanvas={clearCanvas}
          onSendWhiteBoardLines={onSendWhiteBoardLines}
          openRoughBoardScreen={openRoughBoardScreen}
          updatestateforchild={updatestateforchild}
          ref={reference}
          identity={identity}
          height={0}
        >
          {identity === "tutor" && (
            <Button>
              <button onClick={() => setShowQuestion(false)}>Close</button>
              <div
                style={{
                  textAlign: "center",
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                Homework Review
              </div>
            </Button>
          )}
          {identity !== "tutor" && userId != homeWorkStudentId && (
            <Button>
              <div style={{ textAlign: "center" }}>
                {homewWorkStudentName}'s Homework Review
              </div>
            </Button>
          )}
          <div
            style={{
              position: "relative",
              margin: "0 auto",
              width: "calc(100% - 160px)",
              maxHeight: `calc(100% - ${"tutor" ? 60 : 60}px)`,
              minHeight: `calc(100% - ${"tutor" ? 60 : 60}px)`,
            }}
          >
            <div
              className={`h-full w-full  absolute top-[${
                "tutor" === "tutor" ? 0 : 58
              }px] z-1`}
              style={{ height: "100%" }}
            >
              {" "}
              <MathzoneWhiteBoard
                currentSelectedRouter={currentSelectedRouter}
                currentSelectedKey={currentSelectedKey}
              />
            </div>
            <QuizWhitePage>
              <ValidationContextProvider>
                <RenderedStudentResponse datas={questionData} />
              </ValidationContextProvider>
            </QuizWhitePage>
          </div>
        </QuizPageLayout>
      </div>
    </>
  );
}

const Button = styled.div`
  width: calc(100% - 160px);
  margin: 0 auto;
  > button {
    width: 120px;
    height: 40px;
    background: red;
    margin-right: 1rem;
    border-radius: 20px;
    color: white;
    font-size: 20px;
    font-weight: bold;
    float: right;
    display: block;
  }
  > button:hover {
    text-decoration: underline;
  }
`;
