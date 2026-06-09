import React, { useContext, useEffect, useRef, useState } from "react";
import { ValidationContext } from "../../QuizPage";
import styles from "./writing.module.css";
import React_Base_Api from "../../../ReactConfigApi";

// ─── AutoSizeTextarea ────────────────────────────────────────────────────────
const AutoSizeTextarea = ({
    studentTextRef,
    showChatGptResponse,
    isShowingResponse,
    response,
    setValueRef,
    pdfLoading,
    obj
}) => {
    const textareaRef = useRef(null);
    const [textareaValue, setTextareaValue] = useState("");
    const [wordCount, setWordCount] = useState(0);
    const { submitResponse, showSolution, disabledQuestion } = useContext(ValidationContext);
    const lastKeyRef = useRef(null);
    const [objData,setObjData] = useState({})

    useEffect(() => {
        if (setValueRef) setValueRef.current = setTextareaValue;
    }, []);

    const handleKeyDown = (e) => { lastKeyRef.current = e.key; };

    const handleTextareaChange = (e) => {
        if (submitResponse || showSolution || showChatGptResponse) return;
        if (disabledQuestion) return;
        const type = e.nativeEvent.inputType;
        const dataLength = e.nativeEvent?.data?.split("").length;
        if (type === "deleteContentBackward" && lastKeyRef.current !== "Backspace") return "";
        else if (type === "insertCompositionText") return "";
        else if (type === "insertText" && dataLength > 1) return "";
        setTextareaValue(e.target.value);
    };

    studentTextRef.current = textareaValue;
    const handlePaste = (event) => { event.preventDefault(); };

    useEffect(() => {
        if (response && isShowingResponse) {
            const question_response =
                typeof response === "object" && response.studentResponse
                    ? response.studentResponse
                    : response || "";
            setTextareaValue(question_response);
        }
    }, [response, isShowingResponse]);

    useEffect(() => {
        const words = textareaValue?.trim().split(/\s+/).filter(Boolean);
        setWordCount(words?.length || 0);
    }, [textareaValue]);
    const LINE_HEIGHT = 32;
    const TOP_PADDING = 10;

    // ✅ auto-grow textarea height to match content
    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
    }, [textareaValue]);


const handleSaveDraft = async () => {
  if (!studentTextRef.current) return;

  try {
    const formData = new FormData();

    formData.append("response", studentTextRef.current);
    formData.append("student_id", objData.student_id);
    formData.append("at_from", objData.at_form);
    formData.append("english_question_id", objData.english_question_id);

    const response = await fetch(
      `${React_Base_Api}/app_teachers/save_student_response_drafts`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (data.status) {
      alert("Draft saved");
    }
  } catch (err) {
    console.error(err);
  }
};

    useEffect(()=>{
        if(obj){
            const temp={
                student_id:obj?.student_id,
                at_form:"english_zone_web",
                english_question_id:obj?.question_data[0]?.question_id
            }
            setObjData(temp)
        }
    },[obj])

    return (
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 4, flex: 1, height: "100%", position: "relative" }}>
            {!pdfLoading && 
            <button className={styles.save_draft} onClick={handleSaveDraft}>save (draft)</button>
            }

            {/* ── notebook wrapper — no fixed height, grows with content ── */}
            <div
                className={'scroll__bar'}
                style={{
                    position: "relative",
                    borderRadius: "8px 0 8px 8px",
                    overflowY: "auto",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                    border: "1px solid #d0d7e2",
                    background: "#fff",
                    opacity: pdfLoading ? 0.5 : 1,
                    transition: "opacity 0.3s ease",
                    pointerEvents: pdfLoading ? "none" : "auto",
                    // ✅ no flex:1, no fixed height — wrapper grows with textarea
                }}>

                {/* pdf loading overlay */}
                {pdfLoading && (
                    <div style={{
                        position: "absolute", inset: 0, zIndex: 10,
                        display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center",
                        background: "rgba(255,255,255,0.6)",
                        backdropFilter: "blur(2px)", gap: 10,
                    }}>
                        <div style={{
                            width: 36, height: 36,
                            border: "3px solid #e8edf2",
                            borderTop: "3px solid rgb(45,140,240)",
                            borderRadius: "50%",
                            animation: "spinLoader 0.8s linear infinite",
                        }} />
                        <span style={{ color: "rgb(45,140,240)", fontFamily: "'Nunito Sans', sans-serif", fontSize: 14 }}>
                            Extracting text…
                        </span>
                    </div>
                )}

                {/* textarea */}
                <textarea
                    ref={textareaRef}
                    onKeyDown={handleKeyDown}
                    onPasteCapture={handlePaste}
                    className={`${styles.writing_textarea} para_text scroll__bar`}
                    value={textareaValue}
                    onChange={handleTextareaChange}
                    placeholder="Start writing here..."
                    readOnly={isShowingResponse}
                    autoComplete="new-password"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    data-gramm="false"
                    data-enable-grammarly="false"
                    style={{
                        minHeight: `${TOP_PADDING * 2 + LINE_HEIGHT * 10}px`,
                        padding: `${TOP_PADDING}px 12px 12px 16px`,
                        lineHeight: `${LINE_HEIGHT}px`,
                        // ✅ lines live ON the textarea — scroll perfectly with text
                        backgroundImage: `repeating-linear-gradient(
                        to bottom,
                        transparent,
                        transparent ${LINE_HEIGHT - 1}px,
                        #dde8f5 ${LINE_HEIGHT - 1}px,
                        #dde8f5 ${LINE_HEIGHT}px
                        )`,
                        backgroundPositionY: `${TOP_PADDING}px`,
                        fontFamily: '"Merienda", cursive'


                    }}
                />
            </div>

            {/* word count */}
            <p className="btn_txt_s" style={{
                margin: 0,
                textAlign: "right",
                fontSize: 12,
                color: "#888",
            }}>
                Word Count : {wordCount}
            </p>

            {/* load Caveat font */}
            <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Merienda:wght@300..900&display=swap');

  @keyframes spinLoader {
    to { transform: rotate(360deg); }
  }

  .writing_textarea {
    font-family: "Merienda", cursive !important;
    font-weight: 400;
    font-style: normal;
  }

  .writing_textarea::placeholder {
    font-family: "Merienda", cursive !important;
    font-weight: 300;
    color: #b0bec5;
  }
`}</style>
        </div>
    );
};

export default AutoSizeTextarea;