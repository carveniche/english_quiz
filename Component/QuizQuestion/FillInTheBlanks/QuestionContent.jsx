  import React, { useContext, useEffect, useRef, useState } from "react";
  import styles from "../english_mathzone.module.css";
  import { ValidationContext } from "../../QuizPage";



  export default function QuestionContent({ choicesRef }) {
    const [update, setUpdate] = useState(false);
    const { studentAnswer, submitResponse, disabledQuestion, showSolution } =
      useContext(ValidationContext);
    const focusRef = useRef([]);

    const handleChange = (e, itemIndex) => {
      if (submitResponse || disabledQuestion || showSolution) return;

      const {maxLength,value} = e.target;
    
      choicesRef.current[itemIndex].studentAnswer = value;

      setUpdate(!update); // Trigger re-render

      // Move focus to the next input if a character was added
      
      if (maxLength ==value.length) {
        moveFocusForward(itemIndex + 1);
      }
    };

    const moveFocusForward = (nextIndex) => {
      while (
        nextIndex < choicesRef.current.length &&
        !choicesRef.current[nextIndex].correct // Skip incorrect letters
      ) {
        nextIndex++;
      }
    
      if (focusRef.current[nextIndex]) {
        focusRef.current[nextIndex].focus();
      }
    };
    

    const moveFocusBackward = (prevIndex) => {
      while (
        prevIndex >= 0 &&
        !choicesRef.current[prevIndex].correct // Skip incorrect letters
      ) {
        prevIndex--;
      }
    
      if (focusRef.current[prevIndex]) {
        focusRef.current[prevIndex].focus();
      }
    };
    

    useEffect(() => {
      var focusTimeout = setTimeout(() => {
        // moveFocusForward(0);
      }, 1000);
      return () => clearTimeout(focusTimeout);
    }, []);

    const handleKeyChange = (e, itemIndex) => {
      if (e.key === "Backspace") {
        if (!choicesRef.current[itemIndex].studentAnswer) {
          moveFocusBackward(itemIndex - 1);
        }
      }
    };
  
    // if (studentAnswer.length > 0) {
    //   choicesRef.current = choicesRef.current.map((c, i) => ({
    //     ...c,
        
    //     //studentAnswer: studentAnswer[i] ? studentAnswer[i].studentAnswer : "",
        
    //   }));
    // }
    return (
      <div>
        <div
          className={styles.questionContent}
          style={{
            marginTop: 20,
            display: "flex",
            alignItems: "end",
          }}
        >
          {choicesRef.current.map((item, itemIndex) => (
            <div key={itemIndex}>

              {item.correct ? (
                <input
                  className={styles.inputFieldfib}
                  key={itemIndex}
                  maxLength={item?.value.length}
                  size={1}
                  readOnly={showSolution}
                  value={choicesRef.current[itemIndex].studentAnswer || ""}
                  ref={(el) => (focusRef.current[itemIndex] = el)}
                  onChange={(e) => handleChange(e, itemIndex)}
                  onKeyDown={(e) => handleKeyChange(e, itemIndex)}
                  style={{
                    width: `${item?.value.length* 10 +20}px`,
                    fontSize: 16,
                    padding: 5,
                    boxSizing: "border-box",
                    textAlign: `${item?.value.length > 1 ? "left" : "center"}`,
                  }}
                />
              ) : (
                <span>{item.value}</span>
              )}
              {itemIndex < choicesRef.current.length - 1 && <>&nbsp;</>}
            </div>
          ))}
        </div>
      </div>
    );
  }
