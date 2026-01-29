import React, { useContext, useEffect } from "react";
import Speaking_Type from "./Speaking_Type";
import "./Speaking_Type.css";
import { WRITING_GPT } from "../../Utility/Constant";
// import NotificationModal from "../GroupQuestion/ReadingComprehensive/NotificationModal";
import { useState } from "react";
import { ValidationContext } from "../../QuizPage";
import { Alert } from "@mui/material";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import Recording_part from "./Recording_part";

export const Main_Speaking_Type = ({ obj, wordsLength }) => {
  const {
    showSolution
  } = useContext(ValidationContext);
  let question_text = JSON.parse(obj?.question_data);


  let questionResponse = null;
  try {
    questionResponse = obj[WRITING_GPT.questionResponse] || null;
    if(typeof questionResponse =="string"){
    questionResponse = JSON.parse(questionResponse);
    }
  } catch (e) {
    console.log(e);
  }
  const [hideNotification, setHideNotification] = useState(false);
  useEffect(() => {
    const timeOut = setTimeout(() => {
      setHideNotification(true)
    }, 5000)
    return () => clearTimeout(timeOut)
  }, [])
  const [isTrue, setIsTrue] = useState(false);
  // url('https://d1t64bxz3n5cv1.cloudfront.net/stage.png')
  return (
    <>
      <div
        style={{
         height:"100vh",
          backgroundColor: "rgb(0 205 216 / 16%)",
          padding: "1.5rem 1rem",
          borderRadius: "15px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "start",
          position: "relative",
        }}
      >

        {!hideNotification && !showSolution && (
          <>
            <Alert severity="warning" onClose={() => setHideNotification(true)}>
              Please Find a quiet place and speak clearly. Record for at least 5 seconds.
            </Alert>

          </>

        )}


        <Recording_part
          questionData={question_text}
          questionResponse={questionResponse}
          setIsTrue={setIsTrue}
          wordsLength={wordsLength}
        />

        {/* <Speaking_Type
          questionData={question_text}
          questionResponse={questionResponse}
          wordsLength={wordsLength}
        /> */}


     
      </div>
    </>
  );
};
