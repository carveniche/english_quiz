import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import HtmlParser from "html-react-parser";
import { optionSelectStaticMathField } from "../component/HorizontalFillUpsEquationType/replaceDomeNode/ReplaceDomNode";
import { Pattern } from "../component/questiontextoptions/clickableOnPicture/pattern";
import styles from "./Solution.module.css";
export default function CondiitonalCorrectAnswer({ questionData, temp }) {
  let answerValue =
    (temp?.answer && temp?.answer !== "true" ? temp?.answer : false) ||
    (temp?.answerValue &&
    temp.answerValue !== true &&
    temp.answerValue !== "true"
      ? temp.answerValue
      : false) ||
    temp?.answerCount;

  let oldType = ["Multiple choice", "True/False"];
  if (questionData?.question_type == "questiontextoptions") {
    return (
      <div className={styles.correctAnswerBox}>
        <div className={`${styles.correctAnswer} ${styles.correctAnswer2}`}>
          <h6>The correct answer is:</h6>
          <QuestionTextOptionAnswerContainer
            temp={temp?.questionContent[0] || {}}
          />
        </div>
      </div>
    );
  }
  return oldType.includes(questionData?.question_type) ? (
    <MultipleChoiceQuestionCorrectAnswer
      choices={
        questionData?.choice_data?.filter((item) => item.correct)[0] || {}
      }
    />
  ) : questionData?.operation ? (
    answerValue ? (
      <div className={styles.correctAnswerBox}>
        <div className={`${styles.correctAnswer} ${styles.correctAnswer2}`}>
          <h6>The correct answer is:</h6>
          <h6>{answerValue}</h6>
        </div>
      </div>
    ) : temp?.choiceType == "selectchoice" ||
      temp?.type === "options_multiple_pictures" ? (
      <MultipleChoiceCorrectAnswer data={temp} />
    ) : (
      ""
    )
  ) : (
    ""
  );
}
function HtmlAndMathQuillParser(data) {
  let str = String(data);
  return str.includes("mq-selectable")
    ? HtmlParser(data, optionSelectStaticMathField)
    : HtmlParser(data);
}
function MultipleChoiceCorrectAnswer({ data }) {
  const [choiceData, setChoiceData] = useState([]);
  const getCorrectValue = (obj, temp) => {
    if (!Array.isArray(obj) && typeof obj === "object") {
      if (
        obj?.selected == "true" ||
        obj.isMissed == "true" ||
        obj?.option == "true"
      ) {
        temp.push({ ...obj });
        return true;
      } else return false;
    }
    if (Array.isArray(obj))
      for (let item of obj) {
        if (getCorrectValue(item, temp)) return;
      }
    return false;
  };
  useEffect(() => {
    let temp = [];
    let questionContent = data?.questionContent || [];
    if (!Array.isArray(questionContent)) questionContent = data?.choices;
    getCorrectValue(questionContent, temp);
    setChoiceData([...temp]);
  }, []);

  return choiceData?.length ? (
    <div className={styles.correctAnswerBox}>
      <div className={`${styles.correctAnswer} ${styles.correctAnswer2}`}>
        <h6>The correct answer is:</h6>
        {choiceData?.map((item, key) => (
          <h6 key={key}>
            {HtmlAndMathQuillParser(
              item?.value || item?.numvalue || item.image
            )}
          </h6>
        ))}
      </div>
    </div>
  ) : (
    ""
  );
}
function MultipleChoiceQuestionCorrectAnswer({ choices }) {
  console.log(choices);
  return (
    <div className={styles.correctAnswerBox}>
      <div className={styles.correctAnswer}>
        <h6>The correct answer is:</h6>
        <div>
          {choices.choices && <div>{HtmlParser(choices.choices)}</div>}
          {choices.choice_image && (
            <div>
              <img
                src={choices.choice_image}
                style={{ maxWidth: "100%", height: "fit-contain" }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
function QuestionTextOptionAnswerContainer({ temp }) {
  let data = temp?.filter((item) => item.selected == "true")[0];

  return <Pattern count={data?.count} imgUrl={data?.value} />;
}
