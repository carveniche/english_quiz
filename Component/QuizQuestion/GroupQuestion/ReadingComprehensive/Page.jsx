import React, { useState } from "react";
import objectParser from "../../../Utility/objectParser";
import styles from "../../english_mathzone.module.css";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import SpeakQuestionText from "../../../Utility/SpeakQuestionText";
import QuestionCommonContent from "../../../CommonComponent/QuestionCommonContent";
export default function Page({ passage }) {
  const [linesLength, setLinesLength] = useState(passage.length || 0);
 
const obj={questionName:passage}
  return (
    <>
     <QuestionCommonContent obj={obj}/>
    </>
   
  );
}


