import React, { useContext, useEffect } from "react";
import { ViewStatusContext } from "../Mathzone";
import TeacherViewEachResponse from "./TeacherViewEachResponse";
import { ValidationContext } from "../MainOnlineQuiz/MainOnlineQuizPage";

export default function ViewQuestionAtMiddle() {
  const { questionStatus, currentViewQuestion, currentIndex } =
    useContext(ViewStatusContext);
  const { setHasAnswerSubmitted, setIsProgressBarVisible } =
    useContext(ValidationContext);
  useEffect(() => {
    setHasAnswerSubmitted(true);
    setIsProgressBarVisible(false);
  }, []);
  return (
    <>
      {questionStatus && Object.keys(currentViewQuestion).length ? (
        <>
          <div style={{ marginBottom: 10 }}>Q. {currentIndex.index + 1}</div>
          <TeacherViewEachResponse
            response={currentViewQuestion?.response}
            type={currentViewQuestion?.type}
            studentResponseData={currentViewQuestion?.questionDatas}
            hideCloseButton={""}
            questionDatas={currentViewQuestion?.questionDatas}
            showSkippedQuestion={true}
            key={currentIndex.index + 1}
          />
        </>
      ) : (
        ""
      )}
    </>
  );
}
