import React, { useState } from "react";
import styles from "./outerPage.module.css";
import GroupFile from "./GroupFile";
export const ValidationContext = React.createContext("Validation Context");
export function ValidationContextProvider({ children }) {
  const [submitResponse, setSubmitResponse] = useState(false);
  const [disabledQuestion, setDisabledQuestion] = useState(false);
  const [isCorrect, setIsCorrect] = useState(-1); //0-false,1-true,-1 not selected
  const [studentAnswer, setStudentAnswer] = useState("");
  return (
    <ValidationContext.Provider
      value={{
        submitResponse,
        setDisabledQuestion,
        disabledQuestion,
        setIsCorrect,
        isCorrect,
        setSubmitResponse,
        setStudentAnswer,
        studentAnswer,
      }}
    >
      {children}
    </ValidationContext.Provider>
  );
}

function RenderingQuizPage({ obj }) {
  return (
    <div className={`${styles.bodyPage2} ${styles.bodyPage}`}>
      <ValidationContextProvider>
        <GroupFile data={obj} />
      </ValidationContextProvider>
    </div>
  );
}

export default function QuizPage({ obj }) {
  return (
    <>
      <RenderingQuizPage obj={obj} />
    </>
  );
}
