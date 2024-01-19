import React from "react";
import styles from "./Solution.module.css";
export default function Explanation({ obj }) {
  let question_data = JSON.parse(obj?.question_data);
  let model = question_data?.solutionModel || [];
  console.log(question_data);
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
                <div key={index}>
                  {item?.text && item?.text}
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
