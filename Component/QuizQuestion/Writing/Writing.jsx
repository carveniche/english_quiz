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
    maxWidth: "100%",
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

const AutoSizeTextarea = ({
  studentTextRef,
  hideCheckButton,
  isShowingResponse,
  response,
}) => {
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
      value={isShowingResponse ? textareaValue || response : textareaValue}
      onChange={handleTextareaChange}
      placeholder="Enter Response"
      aria-label="Auto-sizing Textarea"
      // Minimum number of rows
    />
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
    let question_text = `The following question is asked to a student: '${questionText}'.'\nA student gives the following response to the question: .${prompt_text}\n'.Use this instruction ${instruction}. To Evaluate the response, and give feedback  in less than 100 words`;
    // question_text = `The following question is asked to a student: '${questionText}'.'\nA student gives the following response to the question: .${prompt_text}\n'.Use this instruction ${instruction}. To Evaluate the response, and give concise feedback like a teacher but don't provide score, in less than 100 words`;
    if (qstText)
      question_text = `this is passage text ${qstText} ,   please read the passage text and then give the feedback ${question_text}`;
    // question_text = `The following question is asked to a student: '${questionText}'.'\nA student gives the following response to the question: .${prompt_text}\n'.Use this instruction ${instruction}. To Evaluate the response, and give the score in one word in number`;
    if (quizFrom === "diagnostic") {
      stateRef.push(chatGptResponseRef);
      stateRef.push(scoreRef);
      question_text = `The following question is asked to a student: '${questionText}'.'A student gives the following response to the question: ${prompt_text}'.Use this instruction ${instruction}. To Evaluate the response, and  give feedback but don't provide score, in less than 100 words`;
      apiArray[0] = apiCalled(question_text);
      question_text = `The following question is asked to a student: '${questionText}'.'\nA student gives the following response to the question: ${prompt_text}\n'.Use this instruction ${instruction}. To Evaluate the response, and give the score in one word in number.It should be only number as integer`;
      apiArray[1] = apiCalled(question_text || questionData?.prompt_text || "");
    } else {
      stateRef.push(chatGptResponseRef);
      stateRef.push(scoreRef);
      question_text = `The following question is asked to a student: '${questionText}'.'\nA student gives the following response to the question: ${prompt_text}\n'.Use this instruction ${instruction}. To Evaluate the response, and give feedback but don't provide score, in less than 100 words`;
      apiArray[0] = apiCalled(question_text);
      question_text = `The following question is asked to a student: '${questionText}'.'A student gives the following response to the question: ${prompt_text}'.Use this instruction ${instruction}. To Evaluate the response, and give the score as {{1}} if the response is correct otherwise give score as {{0}}.Please follow instruction correctly`;
      apiArray[1] = apiCalled(question_text || "");
    }
    try {
      let allData = await Promise.all(apiArray);
      console.log(allData);
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

    // for (let num of scoreRef.current) {

    //   if (!isNaN(num) && num !== ' ') {
    //     if(num==='0'){
    //       scoreRef.current = num
    //     }else if(num==='1'){
    //      scoreRef.current = num
    //     }
    //   }
    // }

    if (isNaN(Number(scoreRef.current))) {
      console.log("this is scoreref", scoreRef.current);

 
     let regex = /{{(\d+)}}/;
      console.log("this is regex", regex);

      let scoreValue = regex.exec(scoreRef.current);
      console.log("this is score value", scoreValue);

      // Extract the digit if score pattern is found
      if (scoreValue !== null) {
        scoreRef.current = scoreValue[1]; // The digit captured by the regex
      } else {
        // Second attempt if the score pattern isn't found
        regex = /{{(\d+)}}/;
        scoreValue = regex.exec(scoreRef.current) || [];
        regex = /\d+/g;
        scoreRef.current = regex.exec(scoreValue.pop());
      }
    }

    console.log("this is scoreref before submit", scoreRef.current);
    let obj = {
      studentResponse: studentTextRef.current,
      chatGptResponse: chatGptResponseRef.current,
      score: Number(scoreRef.current),
    };
    console.log("this is obj", obj);
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

  var textNodes = questionData?.questionName.filter(
    (node) => node.node !== "img"
  );
  var imageNodes = questionData?.questionName.filter(
    (node) => node.node === "img"
  );

  const [qstText, setQstText] = useState("");
  useEffect(() => {
    if (
      questionGroupData.group_data &&
      questionGroupData.group_data.question_text
    ) {
      var textGroupNodes = JSON.parse(
        questionGroupData.group_data.question_text
      );
      textGroupNodes = textGroupNodes[0].filter((node) => node.node === "text");
      var xyu = textGroupNodes.reduce((acc, node) => {
        return (acc += node.value);
      }, "");
      setQstText(xyu);
    }
  }, []);

  return (
    <div>
      <SolveButton onClick={checkGptResponse} />
      {redAlert && !submitResponse && <CustomAlertBoxMathZone />}
      <div className={styles.questionName}>
        {textNodes && imageNodes ? (
          <>
            <div style={{ display: "flex" }}>
              <div
                className={`${wordsLength <= 50 ? styles.biggerFont : ""}`}
                style={{
                  display: "flex",
                  alignItems: wordsLength <= 50 ? "center" : "",
                }}
              >
                <div>
                  {textNodes &&
                    textNodes.length > 0 &&
                    textNodes.map((item, key) => (
                      <React.Fragment key={key}>
                        {objectParser(item, key)}
                      </React.Fragment>
                    ))}
                </div>
              </div>
              <div>
                {imageNodes &&
                  imageNodes.length > 0 &&
                  imageNodes.map((item, key) => (
                    <React.Fragment key={key}>
                      {objectParser(item, key)}
                    </React.Fragment>
                  ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {questionData?.questionName?.length ? (
              <>
                {questionData?.questionName.map((item, key) => (
                  <React.Fragment key={key}>
                    {objectParser(item, key)}
                  </React.Fragment>
                ))}
              </>
            ) : null}
          </>
        )}
        {/* {questionData?.questionName?.length ? (
          <>
            {questionData?.questionName.map((item, key) => (
              <React.Fragment key={key}>
                {objectParser(item, key)}
              </React.Fragment>
            ))}
          </>
        ) : null} */}
      </div>
      <div style={{ marginTop: 5 }}>
        <AutoSizeTextarea
          studentTextRef={studentTextRef}
          hideCheckButton={hideCheckButton}
          response={questionResponse?.studentResponse || null}
          isShowingResponse={submitResponse || disabledQuestion}
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
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voice, setVoice] = useState(null);
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      // Filter for female voices; you can adjust this as needed
      const femaleVoice = voices.find(
        (v) => v.name === "Microsoft Zira - English (United States)"
      );
      setVoice(femaleVoice || voices[0]); // Default to first available female voice or any voice
    };

    loadVoices(); // Initial load

    window.speechSynthesis.onvoiceschanged = loadVoices; // Update voices when available
  }, []);

  const toggleSpeak = () => {
    const speech = new SpeechSynthesisUtterance(
      chatGptResponse || "No Response"
    );
    speech.voice = voice; // Set the selected voice

    speech.onend = () => {
      setIsSpeaking(false); // Reset speaking state when finished
    };

    if (isSpeaking) {
      window.speechSynthesis.cancel(); // Stop speaking
      setIsSpeaking(false); // Update state
    } else {
      window.speechSynthesis.speak(speech); // Start speaking
      setIsSpeaking(true); // Update state
    }
  };

  return (
    <div className={styles.gpt_feedback_box}>
      <button
        style={{
          border: "1px solid white",
          cursor: "pointer",
          fontSize: "13px",
        }}
        onClick={toggleSpeak}
      >
        🔊 Read Aloud
      </button>
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
        Feedback From: AI
      </div>
    </div>
  );
}
