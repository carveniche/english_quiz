import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "../component/OnlineQuiz.module.css";
import { ViewStatusContext } from "../mathzone";
import { serializeResponse } from "../CommonJSFiles/gettingResponse";
import replaceJsonData from "../CommonJSFiles/replacingJsonData";
import { addStyles } from "./ExternalPackages";
import AllFile from "../AllFile";
import SolveButton from "../SolveButton";
import oldQuestionWithNoHtmlQuestion from "../CommonJSFiles/oldQuestionWithNoHtmlQuestion";
import newTypeQuestionChecker from "../CommonJSFiles/newTypeQuestionChecker";
import {
  StudentAnswerResponse,
  saveStudentPrePostTestResponse,
} from "../../../../api";
import { allExcludedParticipants } from "../../../../utils/excludeParticipant";
import TimerClock from "./TimerClock";
import SolutionComponent from "../SolutionExplanation/SolutionComponent";
import "../component/mathzone.css";
import { MATHZONEDATAKEY } from "../../../../constants";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  openClosedMathzoneWhiteBoard,
  resetWhiteBoardData,
} from "../../../../redux/features/ComponentLevelDataReducer";
export const ValidationContext = React.createContext("Auth Context");
addStyles();
export function ValidationContextProvider({ children }) {
  const [hasAnswerSubmitted, setHasAnswerSubmitted] = useState(false);
  const [isProgressBarVisible, setIsProgressBarVisible] = useState(true);
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
    isProgressBarVisible,
    setIsProgressBarVisible,
  };
  return (
    <ValidationContext.Provider value={value}>
      {children}
    </ValidationContext.Provider>
  );
}

export const TeacherQuizDisplay = ({ obj, showSolution }) => {
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

  return (
    <>
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
          isResponse={false}
        />
        {showSolution && (
          <SolutionComponent
            showStudentSolution={true}
            arr={arr}
            obj={obj}
            temp={temp}
            showCorrectIncorrectImage={false}
          />
        )}
      </div>
    </>
  );
};

const StudentQuizDisplay = ({
  obj,
  identity,
  isPrePostTest,
  handleCheckLastQuestionBeforeSkipping,
}) => {
  const [showStudentSolution, setShowStudentSolution] = useState(false);
  const [showTeacherSolution, setShowTeacherSolution] = useState(false);
  const [response, setResponse] = useState(false);
  let arr = ["orc", "oprc", "ol", "ckeditor"];
  const [showExplation, setShowExplation] = useState(false);
  let {
    studentAnswerQuestion,
    setQuestionWithAnswer,
    isAnswerCorrect,
    handleUpdateStudentAnswerResponse,
    isStudentAnswerResponse,
    choicesId,
    handleCurrentIdentity,
    questionWithAnswer,
    studentAnswerChoice,
    hasAnswerSubmitted,
    choices,
  } = useContext(ValidationContext);
  const [count, setCount] = useState(0);
  const timerRef = useRef(null);
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
  useEffect(() => {
    handleCurrentIdentity(identity.trim());
  }, []);
  const handleSubmitAnswer = () => {
    window.handleSubmit();
  };
  const handleApiRequestForSavingAnswer = async (skipped_review) => {
    try {
      let arr = ["ckeditor"];
      let noResponse = oldQuestionWithNoHtmlQuestion();
      let question_id = obj.question_data[0].question_id;
      let live_class_id = obj?.live_class_id || obj?.lice_class_id;
      let live_class_practice_id = obj?.live_class_practice_id;
      let level = obj?.level;
      let tag_id = obj?.tag_id;

      let search = window.location.search;
      let urlParams = new URLSearchParams(search);
      let userId = urlParams.get("userID");

      let student_id = "";
      if (allExcludedParticipants.includes(identity)) {
        return;
      }
      let param = {
        choicesId,
        studentAnswerChoice,

        studentAnswerQuestion,
        question_id,
        live_class_id,
        live_class_practice_id,
        level,
        tag_id,
      };
      if (!arr.includes(obj?.question_data[0]?.question_type))
        studentAnswerQuestion = serializeResponse("studentAnswerResponse");
      if (newTypeQuestionChecker(obj?.question_data[0]?.question_type)) {
        studentAnswerQuestion = JSON.stringify({ ...questionWithAnswer });
      }
      if (
        noResponse.includes(obj?.question_data[0]?.question_type) &&
        !arr?.includes(obj?.question_data[0]?.question_type)
      ) {
        studentAnswerQuestion = "";
      }

      let formData = new FormData();

      console.log(studentAnswerChoice);
      console.log("StudentAnswerQuestio live class", studentAnswerQuestion);
      formData.append("student_answer_question", `${studentAnswerQuestion}`);
      formData.append("student_answer_choice", `${choices}`);

      if (obj?.question_data[0]?.question_type == "multi select") {
        for (let item of choicesId) {
          formData.append("choice[]", item);
        }
      } else {
        formData.append("choice", choicesId);
      }
      if (isPrePostTest) {
        if (obj?.questions_from == "skipped") {
          skipped_review = true;
        }
        let pre_post_test_id = obj?.pre_post_test_id;
        let queryParams = `?pre_post_test_id=${pre_post_test_id}&question_id=${question_id}&live_class_id=${live_class_id}&student_answer=${isAnswerCorrect}&time_spent=${count}&skipped_review=${
          skipped_review || false
        }`;
        let result = await saveStudentPrePostTestResponse(
          queryParams,
          formData
        );

        typeof handleCheckLastQuestionBeforeSkipping == "function" &&
          handleCheckLastQuestionBeforeSkipping(true, "", result?.data);
      } else {
        let queryParams = `?user_id=${userId}&question_id=${question_id}&live_class_practice_id=${live_class_practice_id}&live_class_id=${live_class_id}&tag_id=${tag_id}&level=${level}&student_id=${student_id}&student_answer=${isAnswerCorrect}&time_spent=${count}`;
        let result = await StudentAnswerResponse(queryParams, formData);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (hasAnswerSubmitted && !response) {
      if (isPrePostTest) {
        handleCheckLastQuestionBeforeSkipping(
          false,
          handleApiRequestForSavingAnswer
        );
      } else
        handleApiRequestForSavingAnswer(obj?.question_data[0]?.question_type);
      setResponse(true);
    }
  }, [hasAnswerSubmitted]);
  useEffect(() => {
    if (!hasAnswerSubmitted && identity !== "parent") {
      startTimer();
    } else if (identity !== "parent" && hasAnswerSubmitted) {
      clearInterval(timerRef.current);
    }
    return () => {
      clearInterval(timerRef.current);
    };
  }, [hasAnswerSubmitted]);
  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setCount((prev) => {
        return prev + 1;
      });
    }, 1000);
  };
  useEffect(() => {
    if (document.querySelector("#quizWhitePage") && hasAnswerSubmitted) {
      // setTimeout(() => {
      //   document.querySelector("#quizWhitePage").scrollTop =
      //     document.querySelector("#quizWhitePage").scrollHeight;
      // }, 500);
    }
  }, [hasAnswerSubmitted]);
  if (!Object.keys(obj).length) {
    return <></>;
  }
  return (
    <>
      {!allExcludedParticipants.includes(identity) && (
        <TimerClock count={count} />
      )}
      {!allExcludedParticipants.includes(identity) && (
        <SolveButton
          onClick={handleSubmitAnswer}
          isPrePostTest={isPrePostTest}
        />
      )}
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
        {!isPrePostTest && (
          <SolutionComponent
            showExplation={hasAnswerSubmitted}
            showStudentSolution={hasAnswerSubmitted}
            showTeacherSolution={showTeacherSolution}
            handleExplation={handleExplation}
            arr={arr}
            obj={obj}
            temp={temp}
            isAnswerCorrect={isAnswerCorrect}
            showCorrectIncorrectImage={true}
          />
        )}
      </div>
    </>
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
  isPrePostTest,
  handleCheckLastQuestionBeforeSkipping,
  dataTrackKey,
}) {
  const { setTotalQuestion } = useContext(ViewStatusContext);
  if (obj?.question_data && obj?.question_data[0]?.operation) {
    obj = replaceJsonData({ ...obj });
  }
  const { currentSelectedRouter, currentSelectedKey } = useSelector(
    (state) => state.activeTabReducer
  );
  const dispatch = useDispatch();
  useEffect(() => {
    setTotalQuestion(obj?.total || 0);

    return () => {
      if (dataTrackKey) {
        dispatch(resetWhiteBoardData({ dataTrackKey: dataTrackKey }));
        dispatch(openClosedMathzoneWhiteBoard(false));
      }
    };
  }, []);
  return (
    <>
      {identity === "tutor" ? (
        <>
          <ValidationContextProvider>
            <TeacherQuizDisplay
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
              showSolution={true}
            />
          </ValidationContextProvider>
        </>
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
            isPrePostTest={isPrePostTest}
            handleCheckLastQuestionBeforeSkipping={
              handleCheckLastQuestionBeforeSkipping
            }
          />
        </ValidationContextProvider>
      )}
    </>
  );
}
