import React, { useContext, useEffect } from "react";
import Speaking_Type from "./Speaking_Type";
import "./Speaking_Type.css";
import { WRITING_GPT } from "../../Utility/Constant";
// import NotificationModal from "../GroupQuestion/ReadingComprehensive/NotificationModal";
import { useState } from "react";
import { ValidationContext } from "../../QuizPage";
import { Alert } from "@mui/material";

export const Main_Speaking_Type = ({ obj, wordsLength }) => {
  const {

    showSolution
  } = useContext(ValidationContext);
  let question_text = JSON.parse(obj?.question_data);


  let questionResponse = null;
  try {
    questionResponse = obj[WRITING_GPT.questionResponse] || null;
    questionResponse = JSON.parse(questionResponse);
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
  // url('https://d1t64bxz3n5cv1.cloudfront.net/stage.png')
  return (
    <>
      <div
        style={{
          // backgroundImage: `url('https://begalileo-english.s3.ap-south-1.amazonaws.com/Sub_icons/Book+stage.png')`,
          // backgroundSize: "cover",
          // backgroundPosition: "center",
          // backgroundRepeat: "no-repeat",
          // height: `${questionResponse ? "85vh":"100vh"}`,
          height: "100%",
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
        {/* <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "0.75rem",
          backgroundColor: "#f5fff6",
          padding: "1rem",
          boxShadow: "rgba(170, 157, 157, 35%) 0px 5px 15px",
          borderRadius: "10px",
        }}
      >
        <img
          id="message_img"
          src="https://d325uq16osfh2r.cloudfront.net/Speaking_type/person-speaking-clipart-md.png"
          alt="Audio recording"
          width="45"
          height="45"
        />
        <div>
          Please sit in a quiet place and be loud and clear while recording
        </div>
      </div> */}
        {!hideNotification && !showSolution && (
          <>
            <Alert severity="warning" onClose={() => setHideNotification(true)}>
              Please Find a quiet place and speak clearly. Record for at least 5 seconds.
            </Alert>

          </>


          // <NotificationModal
          //   msg={
          //     " Please sit in a quiet place and be loud and clear while recording"
          //   }
          //   onClose={setHideNotification}
          // />
        )}


        <Speaking_Type
          questionData={question_text}
          questionResponse={questionResponse}
          wordsLength={wordsLength}
        />
      </div>
    </>
  );
};
