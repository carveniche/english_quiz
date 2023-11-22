import React, { useContext } from "react";
import styled from "styled-components";
import styles from "../component/OnlineQuiz.module.css";
import { ViewStatusContext } from "../mathzone";
import HtmlParser from "react-html-parser";
import MyAnswer from "../component/AnswerFolder/myAnswer";
export default function TeacherViewEachResponse({
  onClick,
  marginTop,
  response,
  conceptName,
  conceptTag,
  type,
  studentResponseData,
  hideCloseButton,
  questionDatas,
  showSkippedQuestion,
  showExtraDom,
}) {
  const { handleModalOff } = useContext(ViewStatusContext);
  return (
    <Modal style={{ position: "relative" }}>
      {!hideCloseButton && false && (
        <button
          className={styles.NextButton2}
          onClick={handleModalOff}
          style={{
            marginTop: "0.4rem",
            marginRight: "0.4rem",
            minHeight: "24px",
            height: "24px",
            background: "red",
            float: "right",
            "&:hover": { background: "darkred" },
          }}
        >
          X
        </button>
      )}

      <MyAnswer
        obj={response}
        type={type}
        studentResponseData={studentResponseData}
        questionData={questionDatas}
        showSkippedQuestion={showSkippedQuestion}
        showExtraDom={showExtraDom}
      />
    </Modal>
  );
}
// onClick={handleModalOff}

const Modal = styled.div``;
