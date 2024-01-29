import React, { useState } from "react";
import MainReadingComprehensive from "./QuizQuestion/GroupQuestion/ReadingComprehensive/MainReadingComprehensive";
import Allfile from "./Allfile";
import { ValidationContextProvider } from "./QuizPage";
import CorrectIncorrectStatus from "./Solution/CorrectIncorrectStatus";
import MainListening from "./QuizQuestion/GroupQuestion/Listening/MainListening";
import styles from "../Component/outerPage.module.css";
export function QuizDisplay({ obj, showCorrectIncorrect, showSolution }) {
  return (
    <>
      <ValidationContextProvider key={obj?.question_id}>
        <Allfile data={obj} />
        <CorrectIncorrectStatus
          showCorrectIncorrect={showCorrectIncorrect}
          showSolution={showSolution}
          obj={obj}
        />
      </ValidationContextProvider>
    </>
  );
}
export default function GroupFile({
  data,
  isShowQuestion,
  showSolution,
  showCorrectIncorrect,
}) {
  let groupObject = {
    "Reading Comprehension": (
      <MainReadingComprehensive data={data} showQuestion={isShowQuestion} />
    ),
    Listening: <MainListening data={data} showQuestion={isShowQuestion} />,
  };
  const [showQuestion, setShowQuestion] = useState(isShowQuestion || false);
  window.setShowQuestion = setShowQuestion;
  return (
    <>
      {groupObject[data?.group_type]}
      {showQuestion && (
        <div style={{ padding: "10px 0" }} className={styles.groupPage}>
          <QuizDisplay
            obj={data?.question_data[0] || ""}
            showCorrectIncorrect={showCorrectIncorrect}
            showSolution={showSolution}
          />
        </div>
      )}
    </>
  );
}
