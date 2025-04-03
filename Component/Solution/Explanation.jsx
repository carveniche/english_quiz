import React, { useContext } from "react";
import styles from "./Solution.module.css";
import { ValidationContext } from "../QuizPage";
import SpeakPlainText from "../Utility/SpeakPlainText";
export default function Explanation({ obj }) {
  let question_data = JSON.parse(obj?.question_data);
  let model = question_data?.solutionModel || [];
  const { readOut } = useContext(ValidationContext);
  return model?.length ? (
    <>
      <>
        <p className={styles.explanation}>Explanation: </p>
        <div
          className={`${styles.explanationBoxContainer} ${styles.word_wrap} ${styles.word_wrap_space}`}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: "bold",
              opacity: 0.8,
              color: "#666",
            }}
          >
            {model?.map((item, index) => {
              return (
                <div key={index} style={{display:'flex'}}>
                  {readOut &&<SpeakPlainText readText={item?.text && item?.text.replace(/^ {3,}/gm, "")}/>}
                  {item?.text && item?.text.replace(/^ {3,}/gm, "")}
                  {item?.images && <img src={item?.images} />}
                </div>
              );
            })}
          </div>
        </div>
      </>
    </>
  ) : (
    ""
  );
}
