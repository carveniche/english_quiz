import React, { useContext, useState } from "react";

import styles from "../english_mathzone.module.css";
import objectParser from "../../Utility/objectParser";
import Recording_part from "./Recording_part";
// import ResourceViewer from "../../CommonComponent/ResourceViewer";
// import SpeakQuestionText from "../../Utility/SpeakQuestionText";
import AudiPlayerComponent from "../../CommonComponent/AudiPlayerComponent";
import SpeakQuestionText from "../../Utility/SpeakQuestionText";
import { ValidationContext } from "../../QuizPage";
import QuestionCommonContent from "../../CommonComponent/QuestionCommonContent";

export default function Speaking_Type({
  questionData,
  questionResponse,
  wordsLength,
}) {

 
  const [isTrue, setIsTrue] = useState(false);
 

  return (
    <>
 
      <Recording_part
        questionData={questionData}
        questionResponse={questionResponse}
        setIsTrue={setIsTrue}
        wordsLength={wordsLength}
      />
       </>

  );
}

