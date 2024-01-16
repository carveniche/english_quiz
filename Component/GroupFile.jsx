import React, { useState } from "react";
import MainReadingComprehensive from "./QuizQuestion/GroupQuestion/ReadingComprehensive/MainReadingComprehensive";
import Allfile from "./Allfile";
import { ValidationContextProvider } from "./QuizPage";
import CorrectIncorrectStatus from "./Solution/CorrectIncorrectStatus";
import MainListening from "./QuizQuestion/GroupQuestion/Listening/MainListening";
import styles from "../Component/outerPage.module.css"
export function QuizDisplay({ obj }) {
  return (
    <>
      <ValidationContextProvider key={obj?.question_id}>
        <Allfile data={obj} />
        <CorrectIncorrectStatus />
      </ValidationContextProvider>
    </>
  );
}
export default function GroupFile({ data, isShowQuestion }) {
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
        <div style={{ paddingTop:10 }} className={styles.groupPage}>
          <QuizDisplay obj={data?.question_data[0] || ""} />
        </div>
      )}
    </>
  );
}
