import { useState } from "react";
import styles from "../QuizQuestion/english_zone.module.css";
import SpeakPlainText from "./SpeakPlainText";
import { Close } from "@mui/icons-material";
import { Slide } from "@mui/material";

export default function GptFeedback({ chatGptResponse }) {
  const [isShow, setIsShow] = useState(true);

  return (
    <>
      <Slide
        direction="up"
        in={isShow}
        mountOnEnter
        unmountOnExit
        timeout={300}
      >
        <div className={styles.gpt_feedback_box}>
          {/* <Close
            className={styles.close_icon}
            onClick={() => setIsShow(false)}
          /> */}

          <h4 className="header_title_s">AI Feedback</h4>

          <div className={styles.audioWithText}>
            <SpeakPlainText readText={chatGptResponse} />

            <p className="para_text">
              {chatGptResponse || "No AI Feedback available"}
            </p>
          </div>
        </div>
      </Slide>

      {!isShow && (
        <button
          className={styles.show_feedback_btn}
          onClick={() => setIsShow(true)}
        >
          Show AI Feedback
        </button>
      )}
    </>
  );
}