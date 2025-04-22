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
      // textareaRef.current.style.height = "auto";
      // textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  studentTextRef.current = textareaValue;
  const handlePaste = (event) => {
    console.log("not allowed paste");
    event.preventDefault(); // This blocks the paste
  };

  //const wordCount = textareaValue.trim().split(/\s+/).filter(Boolean).length;

  return (
    <>
      <div
        style={{
          width: "100%",
          height: "100%",
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
          value={isShowingResponse ? textareaValue || response : textareaValue}
          onChange={handleTextareaChange}
          placeholder="Type your response here..."
          minRows={12}
          maxRows={14}
          aria-label="Auto-sizing Textarea"
          // Minimum number of rows
        />
        <p
          style={{ margin: "0px", textAlign: "right", width: "100%" }}
        >{`Word Count : ${
          textareaValue.split(" ").filter((wrd) => wrd).length
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
  const [hideCheckButton, setHideCheckButton] = useState(false);
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
    let question_text = `The following question is asked to a student: '${questionText}'.'\nA student gives the following response to the question: .${prompt_text}\n'.Use this instruction ${instruction}. To Evaluate the response, and give feedback  in less than 100 words`;
    // question_text = `The following question is asked to a student: '${questionText}'.'\nA student gives the following response to the question: .${prompt_text}\n'.Use this instruction ${instruction}. To Evaluate the response, and give concise feedback like a teacher but don't provide score, in less than 100 words`;
    if (grpText)
      question_text = `this is passage text ${grpText} ,   please read the passage text and then give the feedback ${question_text}`;
    // question_text = `The following question is asked to a student: '${questionText}'.'\nA student gives the following response to the question: .${prompt_text}\n'.Use this instruction ${instruction}. To Evaluate the response, and give the score in one word in number`;
    if (quizFrom === "diagnostic" && false) {
      stateRef.push(chatGptResponseRef);
      stateRef.push(scoreRef);
      question_text = `The following question is asked to a student: '${questionText}'.'A student gives the following response to the question: ${prompt_text}'.Use this instruction ${instruction}. To Evaluate the response, and  give feedback but don't provide score, in less than 100 words`;
      apiArray[0] = apiCalled(question_text);
      question_text = `The following question is asked to a student: '${questionText}'.'\nA student gives the following response to the question: ${prompt_text}\n'.Use this instruction ${instruction}. To Evaluate the response, and give the score in one word in number.It should be only number as integer`;

      apiArray[1] = apiCalled(question_text || questionData?.prompt_text || "");
    } else {
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

    try {
     
      if (chatGptResponseRef?.current) {
        const { feedback,score } = JSON.parse(chatGptResponseRef?.current);
        scoreRef.current = score;
        chatGptResponseRef.current = feedback;
      } 
    } catch (error) {
      console.log("error score", error);
    }

    // if (isNaN(Number(scoreRef.current))) {
    //   console.log("this is scoreref", scoreRef.current);

    //   let regex = /{{(\d+)}}/;
    //   console.log("this is regex", regex);

    //   let scoreValue = regex.exec(scoreRef.current);
    //   console.log("this is score value", scoreValue);

    //   // Extract the digit if score pattern is found
    //   if (scoreValue !== null) {
    //     scoreRef.current = scoreValue[1]; // The digit captured by the regex
    //   } else {
    //     // Second attempt if the score pattern isn't found
    //     regex = /{{(\d+)}}/;
    //     scoreValue = regex.exec(scoreRef.current) || [];
    //     regex = /\d+/g;
    //     scoreRef.current = regex.exec(scoreValue.pop());
    //   }
    // }

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
    return scoreRef.current;
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
    const studentResWordLen = studentTextRef.current.split(" ").length;

    if (qstnText.split(" ").length > 30 && studentResWordLen < 10) {
      alert("Please make sure you write at least 10 words");
      return;
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

  const longText = qstnText?.split(" ").length > 30;
  return (
    <div style={{ width: "100%" }}>
      <SolveButton onClick={checkGptResponse} />
      {redAlert && !submitResponse && (
        <CustomAlertBoxMathZone msg="Please begin writing" />
      )}

      <div
        style={{
          backgroundRepeat: "no-repeat",
          display: "flex",
          gap: "10%",
          padding: "20px",
          backgroundSize: "cover",
          backgroundPosition: "center",
          // minHeight: "80vh",
          borderRadius: "15px",
          height: "fit-content",
          backgroundColor: "#e8f5e9",
          // backgroundImage: `url(https://advancedcodingtraining.s3.ap-south-1.amazonaws.com/images/Book_Background_new.jpg)`,
          // backgroundImage: `url(https://begalileo-english.s3.ap-south-1.amazonaws.com/Sub_icons/WritingGptBg-02.png)`,
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
              width: longText ? "50%" : "100%",
              maxHeight: longText ? "250px" : "200px",
            }}
          >
            <AutoSizeTextarea
              studentTextRef={studentTextRef}
              hideCheckButton={hideCheckButton}
              response={questionResponse?.studentResponse || null}
              isShowingResponse={submitResponse || disabledQuestion}
            />
          </div>
        </div>
      </div>

      {hideCheckButton && (
        <>
          {gptResponseLoading ? (
            <LinearProgressBar />
          ) : quizFromRef.current === "diagnostic" ? (
            ""
          ) : (
            <GptFeedback chatGptResponse={chatGptResponseRef.current} scoreResponse={scoreRef.current} />
          )}
        </>
      )}
    </div>
  );
}

export function GptFeedback({ chatGptResponse, scoreResponse }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voice, setVoice] = useState(null);
  const { submitResponse } = useContext(ValidationContext);
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      // Filter for female voices; you can adjust this as needed
      const preferredVoices = [
        "Google UK English Male", // Chrome (Daniel equivalent)
        "Google UK English Female",
        "Daniel", // Safari
        "Microsoft David", // Windows default
        "Microsoft Zira",
      ];

      const selectedVoice = voices.find((voice) =>
        preferredVoices.includes(voice.name)
      );

      setVoice(selectedVoice || voices[0]); // Default to first available female voice or any voice
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
      <div>
        {submitResponse && (
          <div style={{ margin: "0", padding: "10px 10px 0 10px" ,display:"flex",alignItems:"center",gap:"5px"}}>
            Student's Response :-{" "}
            <img src={scoreResponse == "1" ? correctImages :inCorrectImages} width={30} height={30} />
          </div>
        )}
        <p style={{ padding: 10, fontSize: 15, margin: "0" }}>
          {chatGptResponse || "No Response"}
        </p>
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
