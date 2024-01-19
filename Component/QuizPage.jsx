import React, { useContext, useEffect, useState } from "react";
import styles from "./outerPage.module.css";
import GroupFile from "./GroupFile";
import OuterPageContextProvider, {
  OuterPageContext,
} from "./QuizQuestion/GroupQuestion/ContextProvider/OuterPageContextProvider";
export const ValidationContext = React.createContext("Validation Context");
export function ValidationContextProvider({ children }) {
  const [submitResponse, setSubmitResponse] = useState(false);
  const [disabledQuestion, setDisabledQuestion] = useState(false);
  const { showQuizResponse } = useContext(OuterPageContext);
  const [isCorrect, setIsCorrect] = useState(-1); //0-false,1-true,-1 not selected
  const [studentAnswer, setStudentAnswer] = useState("");
  useEffect(() => {
    if (showQuizResponse) {
      setDisabledQuestion(true);
    }
  }, [showQuizResponse]);
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

function RenderingQuizPage({
  obj,
  showQuestion,
  showCorrectIncorrect,
  showSolution,
}) {
  return (
    <div className={`${styles.bodyPage2} ${styles.bodyPage}`}>
      <ValidationContextProvider>
        <GroupFile
          data={obj}
          isShowQuestion={showQuestion}
          showSolution={showSolution}
          showCorrectIncorrect={showCorrectIncorrect}
        />
      </ValidationContextProvider>
    </div>
  );
}

export default function QuizPage({
  obj,
  isShowQuestion,
  showSolution,
  showCorrectIncorrect,
}) {
  return (
    <>
      <OuterPageContextProvider>
        <IntermediateQuizPage
          isResponse={false}
          showQuestion={isShowQuestion}
          obj={obj}
          showSolution={showSolution}
          showCorrectIncorrect={showCorrectIncorrect}
        />
      </OuterPageContextProvider>
    </>
  );
}
export const IntermediateQuizPage = ({
  isResponse,
  showQuestion,
  obj,
  showSolution,
  showCorrectIncorrect,
}) => {
  const { setShowQuizResponse } = useContext(OuterPageContext);
  
  useEffect(() => {
    if (isResponse) setShowQuizResponse(true);
  }, [isResponse]);
  return (
    <RenderingQuizPage
      obj={obj}
      showQuestion={showQuestion}
      showSolution={showSolution}
      showCorrectIncorrect={showCorrectIncorrect}
    />
  );
};
