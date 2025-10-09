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
import SpeakQuestionText from "../../Utility/SpeakQuestionText";
import Book_back from "../../assets/Images/Book_Background.jpg";
import AudiPlayerComponent from "../../CommonComponent/AudiPlayerComponent";
import React_Base_Api from "../../../ReactConfigApi";
import QuestionCommonContent from "../../CommonComponent/QuestionCommonContent";
import correctImages from "../../assets/Images/correct.png";
import inCorrectImages from "../../assets/Images/incorrect.png";
import SpeakPlainText from "../../Utility/SpeakPlainText";
import AlertModal from "../../Modals/AlertModal";
import GptFeedback from "../../Utility/GptFeedBack";
const useStyles = {
  autoSizeTextarea: {
    height: "95%",
    width: "100%",
    maxWidth: "100%",
    minWidth: "100px",
    minHeight: "150px",
    resize: "none",
    padding: "8px 12px",
    fontFamily: "Reddit Sans, sans-serif",
    fontSize: "inherit",
    boxShadow:
      "rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset",
    lineHeight: "inherit",
    boxSizing: "border-box",
    border: "1px solid #ccc",
    borderRadius: "4px",
    outline: "none",
  },
};

const AutoSizeTextarea = ({
  studentTextRef,
  showChatGptResponse,
  isShowingResponse,
  response,
}) => {
  const textareaRef = useRef(null);
  const [textareaValue, setTextareaValue] = useState("");
  const { submitResponse, showSolution, disabledQuestion } = useContext(ValidationContext);
  const handleTextareaChange = (event) => {
   
    if (submitResponse || showSolution || showChatGptResponse) return;
    if (disabledQuestion) return;
    setTextareaValue(event.target.value);
    if (textareaRef.current) {
      // textareaRef.current.style.height = "auto";
      // textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  studentTextRef.current = textareaValue;
  const handlePaste = (event) => {
    console.log("not allowed paste");
    event.preventDefault(); // This blocks the paste
  };
  useEffect(() => {
 if(response && isShowingResponse){
    setTextareaValue(response);
 }
  },[response])


  return (
    <>
      <div
        style={{
          width: "100%",
          height: "100%",
          maxHeight: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "2px",
        }}
      >
        <TextareaAutosize
          onPasteCapture={handlePaste}
          ref={textareaRef}
          className={`${styles.blinking} blinking`}
          style={useStyles.autoSizeTextarea}
          value={textareaValue}
          onChange={handleTextareaChange}
          placeholder="Type your response here..."
          minRows={12}
          maxRows={14}
          aria-label="Auto-sizing Textarea"
        // Minimum number of rows
        />
        <p
          style={{ margin: "0px", textAlign: "right", width: "100%" }}
        >{`Word Count : ${textareaValue.split(" ").filter((wrd) => wrd).length
          }`}</p>
      </div>
    </>
  );
};

export default function Writing({
  questionData,
  questionResponse,
  wordsLength,
  questionGroupData,
}) {
  const chatGptResponseRef = useRef("");
  const scoreRef = useRef(null);
  const studentTextRef = useRef("");
  const [gptResponseLoading, setGptResponseLoading] = useState(false);
  const [redAlert, setRedAlert] = useState(false);
  const [showChatGptResponse, setShowChatGptResponse] = useState(false);
  let quizFromRef = useRef(sessionStorage.getItem("engQuizFrom"));
  const isApiCalled = useRef(false);
  const [grpText, setGrpText] = useState("");
  const [qstnText, setQstnText] = useState("");
  const {
    submitResponse,
    disabledQuestion,
    setIsCorrect,
    setSubmitResponse,
    setStudentAnswer,
    showSolution,
    readOut,
    isEnglishTest
  } = useContext(ValidationContext);
  const { setHasQuizAnswerSubmitted } = useContext(OuterPageContext);
  const apiCalled = (prompt_text) => {
    const CONFIG_URL2 = window.CONFIG_URL || React_Base_Api;
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
    let question_text = ""
    if (true) {
      stateRef.push(chatGptResponseRef);
      stateRef.push(scoreRef);
      // question_text = `The following question is asked to a student: '${questionText}'.'\nA student gives the following response to the question: ${prompt_text}\n'.Use this instruction ${instruction}. To Evaluate the response, and give feedback but don't provide score, in less than 100 words`;
      //apiArray[0] = apiCalled(question_text);

      question_text = `The following question was asked to a student: '${questionText}'. 

      A student responded:
      '${prompt_text}'. 
      
      Use this instruction: ${instruction}. To evaluate the response, return the score as **1** if the response is correct; otherwise, return the score as **0**.  
      
      ### **Return Format:**  
      Strictly return **only valid JSON** as shown below:  

      {
          "score": <either 1 or 0>,
          "feedback": "<To evaluate the response and give feedback but don't provide a score, in less than 100 words>"
      }

      Ensure that the score is always **either 1 or 0**. **Do not include any additional text, explanations, or formatting outside the JSON output.**`;

      apiArray[0] = apiCalled(question_text || "");

    }

    try {
      let allData = await Promise.all(apiArray);
      allData = allData || [];

      allData.forEach(({ data }, index) => {
        data = data?.data || {};
        data = data.choices || [];
        stateRef[index].current = data[0]?.message?.content;
      });
      setGptResponseLoading(false);
      handleSubmit();
    } catch (e) {
      console.log(e);
    }
  };

  const handleSubmit = () => {
    if (submitResponse) return;
    if (disabledQuestion) return;
    setRedAlert(false);

    try {

      if (chatGptResponseRef?.current) {
        const { feedback, score } = JSON.parse(chatGptResponseRef?.current);
        scoreRef.current = score;
        chatGptResponseRef.current = feedback;
      }
    } catch (error) {
      console.log("error score", error);
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
    return scoreRef.current;
  };

    const [chatGptResponse, setChatGptResponse] = useState("");
  const [showAlert, setShowAlert] = useState(false);

let message = "Please make sure you write at least 10 words"
  const checkGptResponse = () => {
    if (submitResponse) return;
    if (disabledQuestion) return;
    if (showChatGptResponse) return;
    if (isApiCalled.current) return;
    setRedAlert(false);

    if (!studentTextRef.current || studentTextRef.current.trim() === "") {
      setRedAlert(true);
      return -1;
    }

    const studentResWordLen = studentTextRef.current.split(" ").length;

    if (qstnText.split(" ").length > 30 && studentResWordLen < 10) {
      setShowAlert(true);
      return -1;
    }

    isApiCalled.current = true;
    // handlePromptRequest(studentTextRef.current);
    setStudentAnswer(studentTextRef.current);
    setIsCorrect("await");
    setShowChatGptResponse(true);
    return "await";
  };


  window.handleShowChatGptResponse = setShowChatGptResponse

  window.handleChatGptResponse = (response) => {
    if (response) {
      if (typeof response == "string") {
        response = JSON.parse(response);
      }
      const { feedback, score } = response
      scoreRef.current = score;
      chatGptResponseRef.current = feedback;

      setIsCorrect(score == 1 ? 1 : 0);
      setChatGptResponse(response);
    }

  }
  // console.log(chatGptResponse,score)


  useEffect(() => {
    if (
      questionGroupData.group_data &&
      questionGroupData.group_data.question_text
    ) {
      var textGroupNodes = JSON.parse(
        questionGroupData.group_data.question_text
      );
      textGroupNodes = textGroupNodes[0]?.filter(
        (node) => node.node === "text"
      );
      var xyu = textGroupNodes?.reduce((acc, node) => {
        return (acc += node.value);
      }, "");
      setGrpText(xyu);
    }
    if (questionData.questionName) {
      var textGroupNodes = questionData.questionName?.filter(
        (node) => node.node === "text"
      );
      var xyu = textGroupNodes.reduce((acc, node) => {
        return (acc += node.value);
      }, "");
      setQstnText(xyu);
    }

  }, []);

  const longText = qstnText?.split(" ").length > 30 && questionGroupData?.group_type == "";
  return (
    <div style={{ width: "100%" }}>
      <SolveButton onClick={checkGptResponse} />
      {redAlert && !submitResponse && (
        <CustomAlertBoxMathZone msg="Please begin writing" />
      )}

    {showAlert && <AlertModal msg={message} onClose={setShowAlert} />}

      <div
        style={{
          backgroundRepeat: "no-repeat",
          display: "flex",
          gap: "10%",
          padding: "8px",
          backgroundSize: "cover",
          backgroundPosition: "center",
          // minHeight: "80vh",
          borderRadius: "15px",
          height: "fit-content",
          backgroundColor: "#e8f5e9",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)", // subtle shadow for depth
          border: "1px solid #e0e0e0",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: `${longText ? "row" : "column"}`,
            gap: "10px",
            width: "100%",
          }}
        >
          <QuestionCommonContent
            longText={longText}
            obj={questionData}
            wordsLength={wordsLength}
            choicesRef={[]}
            isEnglishStudentLevel={readOut}
          />

          <div
            style={{
              width: longText ? "80%" : "100%",
              height: longText ? "300px" : "280px",
              maxHeight: longText ? "300px" : "280px",
            }}
          >
            <AutoSizeTextarea
              studentTextRef={studentTextRef}
              showChatGptResponse={showChatGptResponse}
              response={questionResponse?.studentResponse || null}
              isShowingResponse={submitResponse || showSolution || disabledQuestion}
            />
          </div>
        </div>
      </div>

      {showChatGptResponse && (
        <>
          {!chatGptResponse ? (
            <LinearProgressBar />
          ) : (
            <GptFeedback
              chatGptResponse={chatGptResponseRef.current}
            />
          )}
        </>
      )}
    </div>
  );
}


