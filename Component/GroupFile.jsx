import React, { useState } from "react";
import MainReadingComprehensive from "./QuizQuestion/GroupQuestion/ReadingComprehensive/MainReadingComprehensive";
import Allfile from "./Allfile";
import { ValidationContextProvider } from "./QuizPage";
import CorrectIncorrectStatus from "./Solution/CorrectIncorrectStatus";
import MainListening from "./QuizQuestion/GroupQuestion/Listening/MainListening";
import styles from "../Component/outerPage.module.css";
import QuestionTracker from "./CommonComponent/QuestionTracker";
export function QuizDisplay({ obj, showCorrectIncorrect, showSolution, data }) {

  return (
    <>
      <ValidationContextProvider key={obj?.question_id} showSolution={showSolution} readOut={obj?.read_out}>
        <Allfile data={obj} questionData={data} />

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
      <div
        style={{
          padding: "10px 20px",
          userSelect: "none",         // Prevents text selection
          WebkitUserSelect: "none",   // Safari
          MozUserSelect: "none",      // Firefox
          msUserSelect: "none"        // Internet Explorer
        }}
        onCopy={(e) => e.preventDefault()}
        onContextMenu={(e) => e.preventDefault()}
      >

        <div className={styles.main_layout_section}>
          {data?.group_type &&
            <div className={styles.group_container}>
              {groupObject[data?.group_type]}
            </div>
          }
       
            <div className={`${styles.question_container} ${data?.group_type ? styles.group_active : ""} `}>
              {
                data?.group_type && data.question_data.length && (
                  <QuestionTracker data={data} />
                )
              }

              <div className={styles.question_section}>
                <QuizDisplay
                  obj={data?.question_data[0] || ""}
                  data={data}
                  showCorrectIncorrect={showCorrectIncorrect}
                  showSolution={showSolution}
                />
              </div>
            </div>
         
        </div>
      </div>
    </>
  );
}
