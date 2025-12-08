


import React, { useState, useEffect,useRef, useContext } from "react";
import styles from "./Solution.module.css";
import Lottie from "lottie-react";
import correctlottie from "../assets/LottieAnimation/CorrectAimation.json";
import incorrectlottie from "../assets/LottieAnimation/IncorrectAnimation.json";
import pandaRight from "../assets/LottieAnimation/Right_answer.json";
import pandaWrong from "../assets/LottieAnimation/Wrong_answer.json";
import { Zoom } from "@mui/material";
import { ValidationContext } from "../QuizPage";

export default function CorrectIncorrectStatus({obj}) {
  const { isCorrect } = useContext(ValidationContext);
  const [triggerImage, setTriggerImage] = useState(false);
  const [triggerAnimation, setTriggerAnimation] = useState(false);
  const [triggerValue, setTriggerValue] = useState(null);
  const [animationKey, setAnimationKey] = useState(0);

  const audioRefs = useRef({ correct: [], incorrect: [] });

  // Expose handlers globally
  window.handleShowCorrectIncorrectImage = (val) => {
    setTriggerAnimation(false);
    setTriggerImage(true);
    setTriggerValue(val);
  };

  window.handleShowCorrectIncorrectAnimation = (val) => {
    const answer = window.checkAnswerStatus();
    if(answer == -1) return;
    playRandomAudio(answer);
    setTriggerImage(false);
    setTriggerValue(answer);
    setAnimationKey((prev) => prev + 1); // restart animation
  };


  function handleAnimationComplete() {
    console.log("Animation completed");
    // Hide animation, show image after animation finishes
   setTimeout(() => {
    setTriggerAnimation(false);
    setTriggerImage(true);
   }, 500);
  }


  const audioLists = {
    correct: [
      "Nice-work.mp3",
      "Well-Done.mp3",
      "You-did-it.mp3",
      "keep-it-up.mp3",
      "Awesome.mp3",
      "Fantastic.mp3",
      "Good-job.mp3",
    ],
    incorrect: ["Wrong_answer.mp3"],
  };

  useEffect(() => {
    const audioBaseUrl = "https://d3g74fig38xwgn.cloudfront.net/app-sounds/mathzone/";
    Object.keys(audioLists).forEach((type) => {
      audioRefs.current[type] = audioLists[type].map((file) => {
        const audio = new Audio(`${audioBaseUrl}${file}`);
        audio.preload = "auto";
        return audio;
      });
    });
  }, []);

  const playRandomAudio = (answer) => {
    if (answer === -1) return;
    const type = answer ? "correct" : "incorrect";
    const list = audioRefs.current[type];
    if (!list?.length) return;
    const randomAudio = list[Math.floor(Math.random() * list.length)];
    randomAudio.currentTime = 0;
    setTriggerAnimation(true);
    randomAudio.play().catch((err) => console.warn("Audio play error:", err));
  };
  const ishotspot = obj?.question_type === "hotspot";
   const pageType = sessionStorage.getItem("page_type") == "review"
  return (
    <>
      {triggerAnimation && (
        <div className={styles.quizCorrectInorrect}>
          <div style={{ maxWidth: 140 }}>
            <Lottie
              key={`main-${animationKey}`}
              animationData={triggerValue ? correctlottie : incorrectlottie}
              loop={false}
              autoplay
              onComplete={handleAnimationComplete} // ✅ now calls function
            />
          </div>
          <div style={{ maxWidth: 200 }}>
            <Lottie
              onComplete={handleAnimationComplete}
              key={`panda-${animationKey}`}
              animationData={triggerValue ? pandaRight : pandaWrong}
              loop={false}
              autoplay

            />
          </div>
        </div>
      )}

      <Zoom in={triggerImage} timeout={300}>
        <div className={styles.quizCorrectInorrect}
          style={{
            top: pageType ? "unset" : ishotspot ? '28px' : '-35px',
            height: pageType ? 'fit-content' : '100%',
            bottom: pageType ? '0px' : 'unset',
          }}
        >
          {triggerValue === "Skipped" ? (
            <button className={styles.skippedButton}>Skipped</button>
          ) : ["Not attempted","Notattempted"].includes(triggerValue) ? (
            <button className={styles.skippedButton} style={{backgroundColor:'#1976D2'}}>Not Attempted</button>
          ) : (
            <img
              src={`https://d2jhdcglwxx007.cloudfront.net/${triggerValue ? "correct.png" : "incorrect.png"
                }`}
              alt="correct/incorrect"
            />
          )}
        </div>
      </Zoom>
    </>
  );
}

