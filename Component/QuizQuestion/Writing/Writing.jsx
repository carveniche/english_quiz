import React, { useContext, useEffect, useRef, useState } from "react";
import { ValidationContext } from "../../QuizPage";
import axios from "axios";
import SolveButton from "../../CommonComponent/SolveButton";
import styles from "../english_mathzone.module.css";
import CustomAlertBoxMathZone from "../../CommonComponent/CustomAlertBoxMathZone";
import objectParser from "../../Utility/objectParser";
import { TextareaAutosize } from "@mui/material";
import getTextFromQuestion from "../../Utility/getTextFromQuestion";
import LinearProgressBar from "./LinearProgressBar";
import { OuterPageContext } from "../GroupQuestion/ContextProvider/OuterPageContextProvider";
const useStyles = {
  autoSizeTextarea: {
    width: "100%",
    maxWidth: "80%",
    minWidth: "100px",
    minHeight: "150px",
    resize: "none",
    padding: "8px 12px",
    fontFamily: "inherit",
    fontSize: "inherit",
    lineHeight: "inherit",
    boxSizing: "border-box",
    border: "1px solid #ccc",
    borderRadius: "4px",
    outline: "none",
  },
};

const AutoSizeTextarea = ({ studentTextRef, hideCheckButton,isShowingResponse,response }) => {
  const textareaRef = useRef(null);
  const [textareaValue, setTextareaValue] = useState("");
  const { submitResponse, disabledQuestion } = useContext(ValidationContext);
  const handleTextareaChange = (event) => {
    if (submitResponse || hideCheckButton) return;
    if (disabledQuestion) return;
    setTextareaValue(event.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };
  studentTextRef.current = textareaValue;
  return (
    <TextareaAutosize
      ref={textareaRef}
      style={useStyles.autoSizeTextarea}
      value={isShowingResponse?(textareaValue||response):textareaValue}
      onChange={handleTextareaChange}
      placeholder="Enter Response"
      aria-label="Auto-sizing Textarea"
      // Minimum number of rows
    />
  );
};
export default function Writing({ questionData,questionResponse }) {
  const chatGptResponseRef = useRef("");
  const scoreRef = useRef(null);
  const studentTextRef = useRef("");
  const [gptResponseLoading, setGptResponseLoading] = useState(false);
  const [redAlert, setRedAlert] = useState(false);
  const [hideCheckButton, setHideCheckButton] = useState(false);
  let quizFromRef = useRef(sessionStorage.getItem("engQuizFrom"));
  const isApiCalled = useRef(false);
  const {
    submitResponse,
    disabledQuestion,
    setIsCorrect,
    setSubmitResponse,
    setStudentAnswer,
  } = useContext(ValidationContext);
  const { setHasQuizAnswerSubmitted } = useContext(OuterPageContext);
  const apiCalled = (prompt_text) => {
    const CONFIG_URL2 = window.CONFIG_URL || "https://begalileo.com/";
    let formData = new FormData();
    formData.append("prompt_text", prompt_text);
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${CONFIG_URL2}app_teachers/gpt_response`,
      data: formData,
    };

    return axios(config);
  };
  const handlePromptRequest = async (prompt_text) => {
    setGptResponseLoading(true);
    let questionText = questionData?.questionName;
    let instruction = questionData.prompt_text || "";
    questionText = getTextFromQuestion(questionText);
    let quizFrom = quizFromRef.current;
    let stateRef = [];
    let apiArray = [];
    let question_text = `The following question is asked to a student: '${questionText}'.'\nA student gives the following response to the question: .${prompt_text}\n'.Use this instruction ${instruction}. To Evaluate the response, and give concise feedback like a teacher, in less than 100 words`;
    // question_text = `The following question is asked to a student: '${questionText}'.'\nA student gives the following response to the question: .${prompt_text}\n'.Use this instruction ${instruction}. To Evaluate the response, and give concise feedback like a teacher but don't provide score, in less than 100 words`;

    // question_text = `The following question is asked to a student: '${questionText}'.'\nA student gives the following response to the question: .${prompt_text}\n'.Use this instruction ${instruction}. To Evaluate the response, and give the score in one word in number`;
    if (quizFrom === "diagnostic") {
      stateRef.push(chatGptResponseRef);
      stateRef.push(scoreRef);
      question_text = `The following question is asked to a student: '${questionText}'.'\nA student gives the following response to the question: ${prompt_text}\n'.Use this instruction ${instruction}. To Evaluate the response, and give concise feedback like a teacher but don't provide score, in less than 100 words`;
      apiArray[0] = apiCalled(question_text);
      question_text = `The following question is asked to a student: '${questionText}'.'\nA student gives the following response to the question: ${prompt_text}\n'.Use this instruction ${instruction}. To Evaluate the response, and give the score in one word in number`;
      apiArray[1] = apiCalled(question_text || questionData?.prompt_text || "");
    } else {
      stateRef.push(chatGptResponseRef);
      stateRef.push(scoreRef);
      question_text = `The following question is asked to a student: '${questionText}'.'\nA student gives the following response to the question: ${prompt_text}\n'.Use this instruction ${instruction}. To Evaluate the response, and give concise feedback like a teacher but don't provide score, in less than 100 words`;
      apiArray[0] = apiCalled(question_text);
      question_text = `The following question is asked to a student: '${questionText}'.'\nA student gives the following response to the question: ${prompt_text}\n'.Use this instruction ${instruction}. To Evaluate the response, and give the 1 for the response is correct otherwise give score 0. it should be only number as integer`;
      apiArray[1] = apiCalled(question_text || "");
    }
    try {
      let allData = await Promise.all(apiArray);
      // console.log(allData)
      allData = allData || [];

      allData.forEach(({ data }, index) => {
        data = data?.data || {};
        data = data.choices || [];
        console.log(data);
        stateRef[index].current = data[0]?.message?.content;
      });
      setGptResponseLoading(false);
      handleSubmit();
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    // handlePromptRequest();
  }, []);
  const handleSubmit = () => {
    if (submitResponse) return;
    if (disabledQuestion) return;
    setRedAlert(false);
    if (isNaN(Number(scoreRef.current))) {
      let regex = /score\s*:\s*\d$/i;
      let scoreValue = regex.exec(scoreRef.current);
      regex = /\d+/g;
      scoreValue=scoreValue||[]
      scoreRef.current = regex.exec(scoreValue.pop());
    }
    let obj = {
      studentResponse: studentTextRef.current,
      chatGptResponse: chatGptResponseRef.current,
      score: Number(scoreRef.current),
    };
    setSubmitResponse(true);
    typeof window.handleChangeNextQuestion == "function" &&
      window.handleChangeNextQuestion(obj);
    if (quizFromRef.current !== "diagnostic") {
      setIsCorrect(scoreRef.current == 1 ? 1 : 0);
    }
    setStudentAnswer(JSON.stringify(obj));
    typeof setHasQuizAnswerSubmitted === "function" &&
      setHasQuizAnswerSubmitted(true);
    return scoreRef.current == 0 ? 0 : 1;
  };
  const checkGptResponse = () => {
    if (submitResponse) return;
    if (disabledQuestion) return;
    if (hideCheckButton) return;
    if (isApiCalled.current) return;
    setRedAlert(false);
    if (!studentTextRef.current) {
      setRedAlert(true);
      return -1;
    }
    isApiCalled.current = true;
    handlePromptRequest(studentTextRef.current);
    setHideCheckButton(true);
    return 1;
  };
  // console.log(chatGptResponse,score)
  return (
    <div>
      <SolveButton onClick={checkGptResponse} />
      {redAlert && !submitResponse && <CustomAlertBoxMathZone />}
      <div className={styles.questionName}>
        {questionData?.questionName?.length ? (
          <>
            {questionData?.questionName.map((item, key) => (
              <React.Fragment key={key}>
                {objectParser(item, key)}
              </React.Fragment>
            ))}
          </>
        ) : null}
      </div>
      <div style={{ marginTop: 5 }}>
        <AutoSizeTextarea
          studentTextRef={studentTextRef}
          hideCheckButton={hideCheckButton}
          response={questionResponse?.studentResponse||null}
          isShowingResponse={submitResponse||disabledQuestion}
        />
      </div>
      {hideCheckButton && (
        <>
          {gptResponseLoading ? (
            <LinearProgressBar />
          ) : quizFromRef.current === "diagnostic" ? (
            ""
          ) : (
            <GptFeedback chatGptResponse={chatGptResponseRef.current} />
          )}
        </>
      )}
    </div>
  );
}

function GptFeedback({ chatGptResponse }) {
  return (
    <div className={styles.gpt_feedback_box}>
      <div style={{ padding: 10, fontSize: 15 }}>
        {chatGptResponse || "No Response"}
      </div>
      <div
        style={{
          width: "calc(100% - 10px)",
          display: "flex",
          justifyContent: "flex-end",
          paddingRight: 5,
          paddingTop: 5,
          paddingBottom: 5,
          color: "indigo",
          fontWeight: "normal",
        }}
      >
        Feedback From: Gpt-4
      </div>
    </div>
  );
}
