import React, { useContext, useEffect, useRef, useState } from "react";
import { ValidationContext } from "../../QuizPage";
import axios from "axios";
import SolveButton from "../../CommonComponent/SolveButton";
import styles from "../english_mathzone.module.css";
import CustomAlertBoxMathZone from "../../CommonComponent/CustomAlertBoxMathZone";
import objectParser from "../../Utility/objectParser";
import { TextareaAutosize } from "@mui/material";
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
const BEARER_TOKEN =
  "Bearer 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";
const CONFIG_URL = "https://api.openai.com/v1/chat/completions";
const AutoSizeTextarea = ({ studentTextRef }) => {
  const textareaRef = useRef(null);
  const [textareaValue, setTextareaValue] = useState("");

  const handleTextareaChange = (event) => {
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
      value={textareaValue}
      onChange={handleTextareaChange}
      placeholder="Enter Response"
      aria-label="Auto-sizing Textarea"
      rowsMin={3} // Minimum number of rows
    />
  );
};
export default function Writing({ questionData }) {
  const [chatGptResponse, setChatGptResponse] = useState("");
  const studentTextRef = useRef("");
  const [redAlert, setRedAlert] = useState(false);
  const {
    submitResponse,
    disabledQuestion,
    setIsCorrect,
    setSubmitResponse,
    setStudentAnswer,
  } = useContext(ValidationContext);
  const apiCalled = (prompt_text) => {
    // let data = JSON.stringify({
    //   prompt: prompt_text,
    //   max_tokens: 500,
    //   temperature: 0,
    // });

    // let config = {
    //   method: "post",
    //   maxBodyLength: Infinity,
    //   url: CONFIG_URL,
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: BEARER_TOKEN,
    //   },
    //   data: data,
    // };
    // return axios.request(config);
    return axios.post(
      CONFIG_URL,
      {
        messages: prompt_text,
        max_tokens: 200,
        temperature: 1,
        echo: false,
        model: "gpt-3.5-turbo", // Adjust the length of the response
        // Add other parameters as needed based on OpenAI's API documentation
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: BEARER_TOKEN,
        },
      }
    );
  };
  const handlePromptRequest = async () => {
    let question_text = `The following question is asked to a student: 'In the box below, write a sentence using the word 'market'.'. A student gives the following response to the question: 'i don't know about market\n'. Evaluate the response, and give concise feedback like a teacher, in less than 100 words`;
    try {
      const { data } = await apiCalled(
        question_text || questionData?.prompt_text || ""
      );
      console.log(data);
      if (true) {
        console.log(data?.choices[0].text);
        setChatGptResponse(data?.choices[0].text);
      }
    } catch (e) {
      alert(e?.message || "Somthing went wrong please try again");
    }
  };
  useEffect(() => {
    // handlePromptRequest();
  }, []);
  const handleSubmit = () => {
    if (submitResponse) return;
    if (disabledQuestion) return;
    if (!studentTextRef.current) {
      setRedAlert(true);
      return;
    }
    let obj = {
      studentResponse: studentTextRef.current,
      chatGptResponse: chatGptResponse,
    };
    setStudentAnswer(JSON.stringify(obj));
    return 1;
  };

  return (
    <div>
      <SolveButton onClick={handleSubmit} />
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
        <AutoSizeTextarea studentTextRef={studentTextRef} />
      </div>
    </div>
  );
}
