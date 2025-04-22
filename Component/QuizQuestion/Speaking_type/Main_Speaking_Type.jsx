import React, { useContext } from "react";
import Speaking_Type from "./Speaking_Type";
import { WRITING_GPT } from "../../Utility/Constant";
import NotificationModal from "../GroupQuestion/ReadingComprehensive/NotificationModal";
import { useState } from "react";
import { ValidationContext } from "../../QuizPage";

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

  // url('https://d1t64bxz3n5cv1.cloudfront.net/stage.png')
  return (
    <>
      <div
        style={{
          backgroundImage: `url('https://begalileo-english.s3.ap-south-1.amazonaws.com/Sub_icons/Book+stage.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: `${questionResponse ? "85vh":"100vh"}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "start",
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
          <NotificationModal
            msg={
              " Please sit in a quiet place and be loud and clear while recording"
            }
            onClose={setHideNotification}
          />
        )}

        <div
          style={{
            border: "1px solid transparent",
            maxHeight: "600px",
            width: "75%",
            overflowX: "hidden",
            scrollbarWidth: "thin",
          }}
        >
          <Speaking_Type
            questionData={question_text}
            questionResponse={questionResponse}
            wordsLength={wordsLength}
          />
        </div>
      </div>
    </>
  );
};
