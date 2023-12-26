import React, { useEffect, useRef, useState } from "react";
import styles from "../../english_mathzone.module.css";
import objectParser from "../../../Utility/objectParser";
import { Button } from "@mui/material";
import { useContext } from "react";
import { GroupQuestionContext } from "../ContextProvider/GroupContextProvider";
import ResourceViewer from "../../../CommonComponent/ResourceViewer";
export default function Listening({ group_data, question_data }) {
 
  const { currentQuestion, handleChangeQuestion } =
    useContext(GroupQuestionContext);
  // const [currentQuestion, setCurrentQuestion] = useState(0);
  const handleQuestionChange = (val) => {
    if (currentQuestion + 1 < question_data.length) {
      handleChangeQuestion(val);
    }
  };

  return (
    <div>
      <div className={styles.group}>
        <div>
          <ResourceViewer resources={group_data?.resources||[]}/>
          
        </div>
        <div className={styles.questionName} style={{ clear: "both" }}>
          {group_data?.question_text.map((item, key) => (
            <React.Fragment key={key}>{objectParser(item, key)}</React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
