import React from "react";
import styles from "../QuizQuestion/english_mathzone.module.css";
import objectParser from "../Utility/objectParser";
import QuestionContent from "../QuizQuestion/FillInTheBlanks/QuestionContent";
import AudiPlayerComponent from "./AudiPlayerComponent";
import SpeakQuestionText from "../Utility/SpeakQuestionText";

export default function QuestionCommonContent({ isFrom,obj, wordsLength,longText, choicesRef, isEnglishStudentLevel }) {
  const mediaTags = new Set(["img", "video", "a"]);
  const textNodes = obj?.questionName.filter((node) => !mediaTags.has(node.node));
  const imageNodes = obj?.questionName.filter((node) => mediaTags.has(node.node));

  return (
    <div className={styles.questionContainer}>
      {textNodes && imageNodes ? (
        <div className={longText ? styles.flexCol : styles.flexRow}>
          {/* TEXT + AUDIO */}
          <div
            className={`${styles.textArea}`}
          >
            <div className={styles.audioWithText}>
              {isEnglishStudentLevel && <SpeakQuestionText readText={textNodes} />}
              <div className={styles.questionText}>
                {textNodes.map((item, key) => (
                  <React.Fragment key={key}>
                    {objectParser(item, key)}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {obj?.resources?.length > 0 && (
              <AudiPlayerComponent resources={obj.resources} />
            )}

            {isFrom=="fill_in_the_blanks" && choicesRef?.current?.length > 0 && (
              <QuestionContent choicesRef={choicesRef} />
            )}
          </div>

          {/* IMAGE SIDE */}
          <div className={styles.imageArea}>
            {imageNodes.map((item, key) => (
              <React.Fragment key={key}>
                {objectParser(item, key)}
              </React.Fragment>
            ))}
          </div>
        </div>
      ) : (
        // Fallback if no split text/image nodes
        <div className={styles.singleBlock}>
          {obj?.questionName?.map((item, key) => (
            <React.Fragment key={key}>
              {objectParser(item, key)}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
