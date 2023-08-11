import React, { useEffect, useState } from "react";
import HtmlParserComponent from "../CommonJSFiles/HtmlParserComponent";
import { findAnswerValue } from "../CommonJSFiles/ManupulateJsonData/commonManupulateJsonData";
import { optionSelectStaticMathField } from "../component/HorizontalFillUpsEquationType/replaceDomeNode/ReplaceDomNode";
import styles from "../component/OnlineQuiz.module.css";
import AnswerInQuestionContentType from "./AnswerInQuestionContentType";
import parse from "html-react-parser";
export default function CorrectAnswerDisplay({ obj, identity }) {
  const specialParticipant = ["tutor", "parents"];
  const [answerValue, setAnswerValue] = useState("");

  useEffect(() => {
    checkSelectChoice();
  }, []);
  const checkSelectChoice = () => {
    var val = obj?.answer || obj?.answerCount || obj?.answerValue || "";
    let choiceType = obj?.choiceType;
    let keys = AnswerInQuestionContentType(obj?.type);
    console.log(obj?.type)
    val=String(obj?.type)?.trim()==="questiontextoptions"?"":val
    if (keys) {
      
      if (String(choiceType)?.trim() === "selectchoice" || !choiceType) {
        val = findAnswerValue(typeof obj === "object" ? obj[keys] : "");
      }
    }
    setAnswerValue(val);
  };
  return (
    <>
      {" "}
      {(
        Boolean(answerValue) && (
          <div style={{ color: "black" }} className={identity==="tutor"?styles.solutionPage:styles.marginTop1Rem} >
            <b>
              Correct Answer:&nbsp;&nbsp;
              {String(answerValue).includes("mq-selectable")?(parse(answerValue,optionSelectStaticMathField)):<HtmlParserComponent value={answerValue} />}
            </b>
          </div>
        )
      )}
    </>
  );
}
