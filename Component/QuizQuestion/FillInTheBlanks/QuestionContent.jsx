import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "../english_mathzone.module.css";
import { ValidationContext } from "../../QuizPage";

export default function QuestionContent({ choicesRef }) {
  const [update, setUpdate] = useState(false);
  const { submitResponse, disabledQuestion } = useContext(ValidationContext);
  const focusRef = useRef([]);

  const handleChange = (e, itemIndex, charIndex) => {
    if (submitResponse || disabledQuestion) return;

    const value = e.target.value || "";
    choicesRef.current[itemIndex].studentAnswer =
      choicesRef.current[itemIndex].studentAnswer || [];
    choicesRef.current[itemIndex].studentAnswer[charIndex] = value;

    // Move focus to the next input if a character was added
    if (value.length > 0) {
      initialFocus(itemIndex, charIndex + 1);
    } else {
      findLastElement(itemIndex, charIndex);
    }

    console.log(choicesRef);
    setUpdate(!update);
  };

  const findLastElement = (itemIndex, charIndex) => {
    let arr = focusRef.current[itemIndex];
    for (let i = charIndex - 1; i >= 0; i--) {
      if (arr[i]) {
        arr[i].focus();
        return;
      }
    }
  };

  const initialFocus = (itemIndex, startingChar) => {
    let arr = focusRef.current[itemIndex];
    for (let i = startingChar; i < arr.length; i++) {
      if (arr[i]) {
        arr[i].focus();
        return;
      }
    }
  };

  useEffect(() => {
    var focusTimeout = setTimeout(() => {
      // initialFocus(0, 0);
    }, 1000);
    return () => clearTimeout(focusTimeout);
  }, []);

  const handleKeyChange = (e, itemIndex, charIndex) => {
    if (e.key === "Backspace") {
      const value = choicesRef.current[itemIndex].studentAnswer || [];
      if (!value[charIndex]) {
        findLastElement(itemIndex, charIndex);
      }
    }
  };

  return (
    <div>
      <div
        className={styles.questionContent}
        style={{
          marginTop: 20,
      //    paddingLeft: "3rem",
          display: "flex",
        //  gap: "20px",
        alignItems:'end',
        }}
      >
        {choicesRef.current.map((item, itemIndex) => (
          <div key={itemIndex}>
            <React.Fragment key={itemIndex}>
              {item?.correct &&
                item?.value.split("").map((char, charIndex) => (
                  <input
                    className={styles.inputFieldfib}
                    key={charIndex}
                    maxLength={1}
                    size={1}
                    value={
                      choicesRef.current[itemIndex].studentAnswer?.[
                        charIndex
                      ] || ""
                    }
                    ref={(el) => {
                      if (!focusRef.current[itemIndex]) {
                        focusRef.current[itemIndex] = [];
                      }
                      focusRef.current[itemIndex][charIndex] = el;
                    }}
                    onChange={(e) => handleChange(e, itemIndex, charIndex)}
                    onKeyDown={(e) => handleKeyChange(e, itemIndex, charIndex)}
                    minLength={1}
                    style={{
                      fontSize: 16,
                      padding: 5,

                      boxSizing: "border-box",
                      textAlign: "center",
                    }}
                  />
                ))}
              {!item?.correct && <span>{item?.value}</span>}
              {itemIndex < choicesRef.current.length - 1 && <>&nbsp;</>}
            </React.Fragment>
          </div>
        ))}
      </div>
    </div>
  );
}
