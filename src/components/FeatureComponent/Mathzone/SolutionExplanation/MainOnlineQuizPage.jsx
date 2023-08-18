import React, { useState, forwardRef, useContext, useRef } from "react";
import replaceJsonData from "../CommonJSFiles/replacingJsonData";
import AllFile from "../../components/AllFile";
import { serializeResponse } from "../CommonJSFiles/gettingResponse";
import { addStyles } from "../ExternalPackages";
import OrcAnswered from "../component/ORC/OrcAnswered";
import CkEditorAnswer from "../component/Ckeditor/CkEditorAnswer";
import OprcAnswered from "../component/Oprc/OprcAnswered";
import MainOl from "../component/OL/MainOl";

import SolutionComponent from "./SolutionComponent";
import styles from "../../outerPage.module.css";
export const ValidationContext = React.createContext("Auth Context");
export function ValidationContextProvider({ children }) {
  const [hasAnswerSubmitted, setHasAnswerSubmitted] = useState(false);
  let [responseUrl, setResponseUrl] = useState("");
  let [questionWithAnswer, setQuestionWithAnswer] = useState({});
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [choicesId, setChoicesId] = useState("");
  const [choices, setChoices] = useState("");
  const [studentAnswerQuestion, setStudentAnswerQuestion] = useState("");
  const [studentAnswerChoice, setStudentAnswerChoice] = useState("");
  const [currentIdentity, setCurrentIdentity] = useState("");
  const handleCurrentIdentity = (identity) => {
    setCurrentIdentity(identity);
  };
  const [isStudentAnswerResponse, setIsStudentAnswerResponse] = useState(false);
  const handleUpdateStudentAnswerResponse = (value) => {
    setIsStudentAnswerResponse(value);
  };
  const value = {
    hasAnswerSubmitted,
    setHasAnswerSubmitted,
    setIsAnswerCorrect,
    isAnswerCorrect,
    choicesId,
    setChoicesId,
    studentAnswerChoice,
    setStudentAnswerChoice,
    studentAnswerQuestion,
    setStudentAnswerQuestion,
    responseUrl,
    setResponseUrl,
    handleCurrentIdentity,
    currentIdentity,
    setQuestionWithAnswer,
    questionWithAnswer,
    handleUpdateStudentAnswerResponse,
    isStudentAnswerResponse,
    choices,
    setChoices,
  };

  return (
    <ValidationContext.Provider value={value}>
      {children}
    </ValidationContext.Provider>
  );
}
addStyles();
const StudentQuizDisplay = ({ obj }) => {
  const [showStudentSolution, setShowStudentSolution] = useState(false);
  const [showTeacherSolution, setShowTeacherSolution] = useState(false);
  let arr = ["orc", "oprc", "ol", "ckeditor"];
  const [showExplation, setShowExplation] = useState(false);
  const answerModal = useRef({
    orc: (
      <OrcAnswered
        obj={obj?.question_data[0]}
        question_text={obj?.question_data[0]?.question_text}
      />
    ),
    ckeditor: (
      <CkEditorAnswer
        str={obj?.question_data[0]?.question_text}
        choiceData={obj?.question_data[0]?.choice_data}
      />
    ),
    oprc: <OprcAnswered obj={obj?.question_data[0]} />,
    ol: <MainOl obj2={obj} answer={true} />,
  });
  const {
    studentAnswerQuestion,
    setQuestionWithAnswer,
    isAnswerCorrect,
    handleUpdateStudentAnswerResponse,
    isStudentAnswerResponse,
    choicesId,
  } = useContext(ValidationContext);
  const checkData = (data) => {
    let arr = ["orc", "ol", "oprc"];
    let arr2 = ["Multiple choice", "Fill in the blanks", "multi select"];
    let arr3 = ["ckeditor"];
    if (arr.includes(data)) {
      return serializeResponse("studentAnswerResponse");
    } else if (arr2.includes(data)) {
      return choicesId;
    } else if (arr3.includes(data)) {
      return { html: studentAnswerQuestion, choices: choicesId };
    }
    let temp = {};
    setQuestionWithAnswer((prev) => {
      temp = { ...prev };
      return prev;
      return;
    });
    return temp;
  };

  var temp = {};
  let operation = null;
  try {
    operation = obj?.question_data[0]?.operation;
    temp = JSON.parse(obj.question_data[0].question_text);
    temp = {
      ...temp,
      upload_file_name: obj.question_data[0]?.upload_file_name,
    };
  } catch (e) {
    temp = obj;
  }

  window.checkData = checkData;
  window.handleUpdateStudentAnswerResponse = handleUpdateStudentAnswerResponse;
  const handleShowSolution = (role) => {
    role === "tutor"
      ? setShowTeacherSolution(true)
      : setShowStudentSolution(true);
  };
  window.reactMathzoneShowSolution = handleShowSolution;
  const handleExplation = () => {
    setShowExplation(!showExplation);
  };
  return (
    <div
      style={{ position: "relative" }}
      className={`${
        obj?.question_data[0]?.operation ? "new_type_question_prev_wrap" : ""
      } ${styles.bodyPage2}
      `}
    >
      <AllFile
        type={obj?.question_data[0]?.question_type}
        obj={obj}
        temp={temp}
        isResponse={isStudentAnswerResponse}
      />
      {(showStudentSolution || showTeacherSolution) && (
        <SolutionComponent
          answerModal={answerModal}
          showExplation={showExplation}
          showStudentSolution={showStudentSolution}
          showTeacherSolution={showTeacherSolution}
          handleExplation={handleExplation}
          arr={arr}
          obj={obj}
          temp={temp}
          isAnswerCorrect={isAnswerCorrect}
        />
      )}
    </div>
  );
};
function RenderingQuizPage({ obj }) {
  if (obj?.question_data && obj?.question_data[0]?.operation) {
    obj = replaceJsonData(obj);
  }
  return (
    <>
      <ValidationContextProvider>
        <StudentQuizDisplay obj={obj} />
      </ValidationContextProvider>
    </>
  );
}

const MainOnlineQuizPage = forwardRef(
  ({ props, obj, refreshQuestion }, ref) => {
    const [count, setCount] = useState(0);
    return (
      <>
        <RenderingQuizPage obj={obj} />
      </>
    );
  }
);

export default MainOnlineQuizPage;
