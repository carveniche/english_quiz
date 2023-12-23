import React, { useEffect, useRef, useState } from "react";
import styles from "../../english_mathzone.module.css";
import objectParser from "../../../Utility/objectParser";
import IconButton from "@mui/material/IconButton";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { Button } from "@mui/material";
import { useContext } from "react";
import { GroupQuestionContext } from "../ContextProvider/GroupContextProvider";
export default function Listening({ group_data, question_data }) {
  const audioRef = useRef([]);
  const { currentQuestion, handleChangeQuestion } =
    useContext(GroupQuestionContext);
  // const [currentQuestion, setCurrentQuestion] = useState(0);
  const handleQuestionChange = (val) => {
    if (currentQuestion + 1 < question_data.length) {
      handleChangeQuestion(val);
    }
  };
  const handleAudioPlay = (index) => {
    let audio = audioRef.current[index];
    if (audio) {
      audio.play();
    }
  };
  useEffect(() => {
    return () => {
      for (let audio of audioRef.current) {
        if (audio) audio.pause();
      }
    };
  }, []);
  return (
    <div>
      <div className={styles.group}>
        <div>
          {group_data?.resources.map((item, key) =>
            item?.type === "audio" ? (
              <IconButton
                aria-label="speaker"
                sx={{ float: "right" }}
                onClick={() => handleAudioPlay(key)}
                key={key}
              >
                <VolumeUpIcon />
                <audio
                  ref={(el) => (audioRef.current[key] = el)}
                  src={item?.url}
                  style={{ display: "none" }}
                ></audio>
              </IconButton>
            ) : (
              ""
            )
          )}
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
