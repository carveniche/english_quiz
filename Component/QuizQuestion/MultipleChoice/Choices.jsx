import React, { useContext, useState } from "react";
import parse from "html-react-parser";
import styles from "../english_mathzone.module.css";
import { ValidationContext } from "../../QuizPage";
export default function Choices({ choicesRef }) {
  const { submitResponse, disabledQuestion } = useContext(ValidationContext);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const handleClick = (index) => {
    if (submitResponse || disabledQuestion) return;
    if (selectedIndex > -1)
      choicesRef.current[selectedIndex].isStudentAnswer = false;
    choicesRef.current[index].isStudentAnswer = true;
    setSelectedIndex(index);
  };

  return (
    <div className={styles.mathzoneMultipleChoiceFlexBox}>
      {choicesRef?.current.map((choice, key) => (
        <div
          key={key}
          style={{
            padding: `1rem 1rem`,
            boxShadow:
              "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 7px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset",
            border: "none",
          }}
          className={`${
            choice?.isStudentAnswer ? styles.mathzoneSelectedChoiceType : ""
          }`}
          onClick={() => handleClick(key)}
        >
          <div className={styles["mathzone-circle-selectbox"]}>
            <b>{String.fromCharCode(65 + key)}</b>
          </div>
          {choice?.value && <div>{parse(choice.value)}</div>}
          {choice?.choice_image && (
            <div className="choiceImage">
              <img
                style={{ maxWidth: "150px", maxHeight: "150px" }}
                src={choice?.choice_image}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
