import React, { useState } from "react";
import objectParser from "../../../Utility/objectParser";
import styles from "../../english_mathzone.module.css";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import SpeakQuestionText from "../../../Utility/SpeakQuestionText";
export default function Page({ passage }) {
  const [linesLength, setLinesLength] = useState(passage.length || 0);
  const isEnglishStudentLevel =
    localStorage.getItem("isEnglishStudentLevel") || false;
  console.log("isEnglishStudentLevel", isEnglishStudentLevel);
  return (
    // <div className={styles.a4Page}>
    <div
      className={`${styles.a4Page}  ${
        linesLength <= 5 ? styles.biggerFont : ""
      }`}
    >
      {/* {isEnglishStudentLevel && <SpeakQuestionText readText={passage} />} */}
      {/* <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}> */}
      <div>
        {passage.map((item, key) => {
          return (
            <React.Fragment key={key}>{objectParser(item, key)}</React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
