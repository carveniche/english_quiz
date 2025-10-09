import React, { useContext, useEffect, useRef, useState } from "react";
import DragDrop from "../../QuizQuestion/reordering/Dragdrop";
import styles from "../Solution.module.css";
import DragDropSolution from "../../QuizQuestion/MatchTheFollowing/DragDropSolution";
import { OuterPageContext } from "../../QuizQuestion/GroupQuestion/ContextProvider/OuterPageContextProvider";
import SpeakQuestionText from "../../Utility/SpeakQuestionText";
import { ValidationContext } from "../../QuizPage";
import SpeakPlainText from "../../Utility/SpeakPlainText";
export default function QuestionTypeResponse({ obj, question_type }) {
  let questionData = JSON.parse(obj?.question_data);
  let choices = questionData?.choices || [];
  let correctValues = choices.filter((item) => item?.correct);

  return (
    <>
      {correctValues?.map((item, key) => {
        return (
          <p className="para-text" key={key} style={{ display: "inline" }}>
            {item?.value && item?.value}
            {item?.choice_image && <img src={item?.choice_image} />}
            {key < correctValues.length - 1 ? ", " : ""}
          </p>
        );
      })}
    </>
  );
}

export function SolutionForReordering({ obj, question_type }) {
  let questionData = JSON.parse(obj?.question_data);
  const choiceRef = useRef([]);

  return (
    <>
      <div
        className={`${styles.correctAnswer} ${styles.correctAnswer2}`}
        style={{ display: "block" }}
      >
        <h6>The correct answer is:</h6>
        <DragDrop
          questionData={questionData?.questionContent || []}
          choiceRef={choiceRef}
          isSolution={true}
          direction={
            question_type == "Vertical Ordering" ? "vertical" : "horizontal"
          }
        />
      </div>
    </>
  );
}

export function SolutionForWritingGpt({ obj, question_type, showSolution, userResponse }) {
  let data = JSON.parse(obj);
  const [showSpeakIcon, setShowSpeakIcon] = useState(false)
  const { showQuizResponse } = useContext(OuterPageContext);
  const { readOut } = useContext(ValidationContext);
  let parseResponse = null;
  try {
    parseResponse = JSON.parse(userResponse) || null
  }
  catch (e) {
    console.warn(e)
  }
  const requireQuestionType = ['Writing ChatGpt', 'read_the_text']



  useEffect(() => {
    if (question_type && readOut && requireQuestionType.includes(question_type)) {
      setShowSpeakIcon(true)
    }
  }, [question_type])

  return (showSolution ?
    <>
      <div
        className={`${styles.correctAnswer} ${styles.correctAnswer2}`}
        style={{ display: "block" }}
      >
        {
          showQuizResponse && parseResponse?.score >= 0 && <h6 style={{ marginBottom: 5 }}>Score: {parseResponse?.score}</h6>
        }
        <div className={styles.ai_audio_player_section}>
          {parseResponse?.chatGptResponse && <h5 className="header_title grey_text">Feedback:</h5>}
          {showSpeakIcon && <SpeakPlainText readText={parseResponse?.chatGptResponse} />}
        </div>
        <p className="para-text">{parseResponse?.chatGptResponse}</p>
      </div>
    </> : ""
  );
}


export function SolutionForDragDrop({ obj, question_type }) {
  let questionData = JSON.parse(obj?.question_data);
  return (
    <>
      <div
        className={`${styles.correctAnswer} ${styles.correctAnswer2}`}
        style={{ display: "block" }}
      >
        <h6>The correct answer is:</h6>
        <DragDropSolution
          questionContent={questionData?.question_content
            || []}

        />
      </div>
    </>
  );
}
