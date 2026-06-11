import React, { useContext, useEffect, useRef, useState } from "react";
import { ValidationContext } from "../../QuizPage";
import SolveButton from "../../CommonComponent/SolveButton";
import styles from "./writing.module.css";
import CustomAlertBoxMathZone from "../../CommonComponent/CustomAlertBoxMathZone";
import { TextareaAutosize } from "@mui/material";
import LinearProgressBar from "./LinearProgressBar";
import { OuterPageContext } from "../GroupQuestion/ContextProvider/OuterPageContextProvider";
import QuestionCommonContent from "../../CommonComponent/QuestionCommonContent";
import AlertModal from "../../Modals/AlertModal";
import GptFeedback from "../../Utility/GptFeedBack";
import PdfUploader from "./PdfUploader";
import AutoSizeTextarea from "./AutoSizeTextarea";
import Zoom from "@mui/material/Zoom";
import TextEditor from "./TextEditor";

// ─── Writing ─────────────────────────────────────────────────────────────────
export default function Writing({
  questionData,
  questionResponse,
  wordsLength,
  questionGroupData,
}) {

  const chatGptResponseRef = useRef("");
  const scoreRef = useRef(null);
  const studentTextRef = useRef("");
  const [redAlert, setRedAlert] = useState(false);
  const [showChatGptResponse, setShowChatGptResponse] = useState(false);
  const [chatGptResponse, setChatGptResponse] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [qstnText, setQstnText] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const [atBottom, setAtBottom] = useState(false);
  const questionContentRef = useRef(null);
  const isApiCalled = useRef(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [extractedText,setExtractedText]=useState("")
  let quizFromRef = useRef(sessionStorage.getItem("engQuizFrom"));
  const {
    submitResponse,
    disabledQuestion,
    setIsCorrect,
    setSubmitResponse,
    setStudentAnswer,
    showSolution,
    readOut,
    isLiveClass
  } = useContext(ValidationContext);
  const { setHasQuizAnswerSubmitted } = useContext(OuterPageContext);

  const longText = qstnText?.split(" ").length > 30 && !questionGroupData?.group_type;

  // ── PDF extracted text → replace textarea content ──────────────────────────────
const handlePdfExtracted = (text) => {
  setExtractedText(text)
};

  // ── scroll / read-more ────────────────────────────────────────────────────
  useEffect(() => {
    const el = questionContentRef.current;
    if (el && longText) setShowReadMore(el.scrollHeight > el.clientHeight);
  }, [longText]);

  const handleScroll = () => {
    const el = questionContentRef.current;
    if (!el) return;
    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10;
    setAtBottom(nearBottom);
    setShowReadMore(!nearBottom);
  };

  const handleReadMore = () => {
    const el = questionContentRef.current;
    if (!el) return;
    setIsExpanded(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
      });
    });
  };



  // // ── submit ────────────────────────────────────────────────────────────────
  // const handleSubmit = () => {
  //   if (submitResponse || disabledQuestion) return;
  //   setRedAlert(false);
  //   try {
  //     if (chatGptResponseRef?.current) {
  //       const { feedback, score } = JSON.parse(chatGptResponseRef?.current);
  //       scoreRef.current = score;
  //       chatGptResponseRef.current = feedback;
  //     }
  //   } catch {}
  //   const obj = {
  //     studentResponse: studentTextRef.current,
  //     chatGptResponse: chatGptResponseRef.current,
  //     score: Number(scoreRef.current),
  //   };
  //   setSubmitResponse(true);
  //   typeof window.handleChangeNextQuestion === "function" &&
  //     window.handleChangeNextQuestion(obj);
  //   if (quizFromRef.current !== "diagnostic")
  //     setIsCorrect(scoreRef.current == 1 ? 1 : 0);
  //   setStudentAnswer(JSON.stringify(obj));
  //   typeof setHasQuizAnswerSubmitted === "function" &&
  //     setHasQuizAnswerSubmitted(true);
  //   return scoreRef.current;
  // };

  const checkGptResponse = () => {

    if (submitResponse || disabledQuestion || showChatGptResponse || isApiCalled.current) return;
    setRedAlert(false);
  const plainText = Array.isArray(studentTextRef.current)
    ? studentTextRef.current
        .map(item => item.insert || "")
        .join("")
        .trim()
    : (studentTextRef.current || "").trim();

  if (!plainText) {
    setRedAlert(true);
    return -1;
  }

  const wordLen = plainText
    .split(/\s+/)
    .filter(Boolean);

  if (qstnText.split(" ").length > 30 && wordLen.length < 10) {
    setShowAlert(true);
    return -1;
  }
    isApiCalled.current = true;
    const isFileUpload = extractedText ? true : false
    setStudentAnswer(JSON.stringify({ studentResponse: studentTextRef.current,isFileUpload:isFileUpload }));
    setIsCorrect("await");
    setShowChatGptResponse(true);
    return "await";
  };

  window.handleShowChatGptResponse = setShowChatGptResponse;
  window.handleChatGptResponse = (response) => {
    if (response) {
      if (typeof response === "string") response = JSON.parse(response);
      const { feedback, score } = response;
      scoreRef.current = score;
      chatGptResponseRef.current = feedback;
      setIsCorrect(score == 1 ? 1 : 0);
      setChatGptResponse(response);
    }
  };

  useEffect(() => {
    if (questionGroupData?.group_data?.question_text) {
      var nodes = JSON.parse(questionGroupData.group_data.question_text);
      nodes = nodes[0]?.filter((n) => n.node === "text");
    }
    if (questionData.questionName) {
      const textNodes = questionData.questionName?.filter((n) => n.node === "text");
      const xyu = textNodes.reduce((acc, n) => (acc += n.value), "");
      setQstnText(xyu);
    }
  }, []);


const isGroup = questionGroupData?.group_type ? true  :  false

  return (
    <div className={styles.writing_container}>
      <SolveButton onClick={checkGptResponse} />

      {redAlert && !submitResponse && (
        <CustomAlertBoxMathZone msg="Please begin writing" />
      )}
      {showAlert && (
        <AlertModal msg="Please make sure you write at least 10 words" onClose={setShowAlert} />
      )}

     
        <div className={styles.question_container} style={{flexDirection:isGroup ? "column" :"row"}}>
          {/* ── question content ── */}
         <div className={styles.question_content_container} > 
           <div
            ref={questionContentRef}
            onScroll={handleScroll}
            className={`${longText ? styles.question_content : ""} `}
          >
            <QuestionCommonContent
              longText={longText}
              obj={questionData}
              wordsLength={wordsLength}
              choicesRef={[]}
              isEnglishStudentLevel={readOut}
            />
           
          </div>
        
          <Zoom in={longText && showReadMore && !atBottom} timeout={300}>
            <div className={styles.readMore} onClick={handleReadMore}>
              <svg fill="#fff" viewBox="0 0 512 512" height="1em">
                <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
              </svg>
              Read more
            </div>
          </Zoom>
         </div>
           

          {/* ── textarea + PDF uploader ── */}
          <div className={`${styles.textarea_container} ${isGroup ? styles.group_textarea_container : ''}`}>
            {/* PDF uploader — hidden after submit */}
            {!submitResponse && !disabledQuestion && !isLiveClass && (
              <PdfUploader
                onExtracted={handlePdfExtracted}
                disabled={showChatGptResponse}
                setPdfLoading={setPdfLoading}
                pdfLoading={pdfLoading}
              />
            )}
            <TextEditor
              obj ={questionGroupData}
              pdfLoading={pdfLoading}
              studentTextRef={studentTextRef}
              showChatGptResponse={showChatGptResponse}
              response={questionResponse || null}
              isShowingResponse={submitResponse || showSolution || disabledQuestion||showChatGptResponse}
              extractedText={extractedText}
              setExtractedText={setExtractedText}
            
            />
            {/* <AutoSizeTextarea
              obj ={questionGroupData}
              pdfLoading={pdfLoading}
              studentTextRef={studentTextRef}
              showChatGptResponse={showChatGptResponse}
              response={questionResponse || null}
              isShowingResponse={submitResponse || showSolution || disabledQuestion}
              setValueRef={textareaExternalSetValue}
            /> */}
          </div>
        </div>

      {showChatGptResponse && (

        <React.Fragment>
          {!chatGptResponse ? (
            <div className={styles.gpt_response_container}>
              <LinearProgressBar />
            </div>
          ) : (
            <GptFeedback chatGptResponse={chatGptResponseRef.current} />
          )}
        </React.Fragment>

      )}
    </div>
  );
}