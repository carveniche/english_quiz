import React, { useContext, useState } from "react";
import styles from "../english_mathzone.module.css";
import { ValidationContext } from "../../QuizPage";
export default function QuestionContent({ choicesRef }) {
  const [update, setUpdate] = useState(false);
  const { submitResponse, disabledQuestion } = useContext(ValidationContext);
  const handleChange = (e, index) => {
    if (submitResponse) return;
    if (disabledQuestion) return;
    choicesRef.current[index].studentAnswer = e.target.value;
    setUpdate(!update);
  };
  return (
    <div>
      <div className={styles.questionContent}>
        {choicesRef.current.map((item, key) => (
          <React.Fragment key={key}>
            {key > 0 && <>&nbsp;</>}
            {item?.correct ? (
              <input
                size={item?.studentAnswer?.length || 1}
                value={item?.studentAnswer || ""}
                onChange={(e) => handleChange(e, key)}
                minLength={1}
              />
            ) : (
              item?.value
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
