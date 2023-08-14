import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "../component/OnlineQuiz.module.css";
import { ViewStatusContext } from "../Mathzone";
import { serializeResponse } from "../CommonJSFiles/gettingResponse";
import replaceJsonData from "../CommonJSFiles/replacingJsonData";
import { addStyles } from "./ExternalPackages";
import AllFile from "../AllFile";
export const ValidationContext = React.createContext("Auth Context");
addStyles();
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

export const TeacherQuizDisplay = ({
  obj,
  identity,
  refreshQuestion,
  conceptName,
  conceptTag,
  mathZoneQuizLevel,
  resultView,
}) => {
  var temp = {};
  let operation = null;
  let arr = ["orc", "oprc", "ol", "ckeditor"];
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

  return <></>;
};

const StudentQuizDisplay = ({ obj }) => {
  const [showStudentSolution, setShowStudentSolution] = useState(false);
  const [showTeacherSolution, setShowTeacherSolution] = useState(false);
  let arr = ["orc", "oprc", "ol", "ckeditor"];
  const [showExplation, setShowExplation] = useState(false);

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

  const handleShowSolution = (role) => {
    role === "tutor"
      ? setShowTeacherSolution(true)
      : setShowStudentSolution(true);
  };
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
      {/* {"solutionModal"} */}
    </div>
  );
};
export function RenderingQuizPage({
  props,
  obj,
  userInfo,
  responseUrlAnswer,
  setScoreUpdate,
  refreshQuestion,
  studentResponseSenderMathZone,
  conceptName,
  conceptTag,
  mathZoneQuizLevel,
  setCount,
  count,
  identity,
}) {
  const { setTotalQuestion } = useContext(ViewStatusContext);
  useEffect(() => {
    setTotalQuestion(obj?.total);
  }, []);
  if (obj?.question_data && obj?.question_data[0]?.operation) {
    obj = replaceJsonData(obj);
  }
  return (
    <>
      {identity === "tutor" ? (
        <>{<h1>Teacher View</h1>}</>
      ) : (
        <ValidationContextProvider>
          <StudentQuizDisplay
            obj={obj}
            userInfo={userInfo}
            identity={identity}
            responseUrlAnswer={responseUrlAnswer}
            setScoreUpdate={setScoreUpdate}
            studentResponseSenderMathZone={studentResponseSenderMathZone}
            conceptName={conceptName}
            conceptTag={conceptTag}
            mathZoneQuizLevel={mathZoneQuizLevel}
            setCount={setCount}
            count={count}
          />
        </ValidationContextProvider>
      )}
    </>
  );
}
