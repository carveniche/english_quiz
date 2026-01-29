import React, { useState, useEffect, useRef, useContext } from "react";
import styles from "./Solution.module.css";
// import "@lottiefiles/lottie-player"; // ★ IMPORTANT
import { Zoom } from "@mui/material";
import { ValidationContext } from "../QuizPage";
import correctlottie from "./CorrectAimation.json";
import incorrectlottie from "./IncorrectAnimation.json";
import pandaCorrect from "./Right_answer.json";
import pandaWrong from "./Wrong_answer.json";
import Lottie from "lottie-react";
export default function CorrectIncorrectStatus({ obj }) {
  // const pandaCorrect =
  //   "https://d2jhdcglwxx007.cloudfront.net/lottie-json/Correct_panda.json";
  // const pandaWrong =
  //   "https://d2jhdcglwxx007.cloudfront.net/lottie-json/Wrong_Panda.json";
  // const correctlottie =
  //   "https://d2jhdcglwxx007.cloudfront.net/lottie-json/CorrectAimation.json";
  // const incorrectlottie =
  //   "https://d2jhdcglwxx007.cloudfront.net/lottie-json/IncorrectAnimation.json";

  const { isCorrect } = useContext(ValidationContext);

  const [triggerImage, setTriggerImage] = useState(false);
  const [triggerAnimation, setTriggerAnimation] = useState(false);
  const [triggerValue, setTriggerValue] = useState(null);
  const [animationKey, setAnimationKey] = useState(0);

  const audioRefs = useRef({ correct: [], incorrect: [] });

  // Expose global handler (your original logic)
  window.handleShowCorrectIncorrectImage = (val) => {
    setTriggerAnimation(false);
    setTriggerImage(true);
    setTriggerValue(val);
  };

  window.handleShowCorrectIncorrectAnimation = () => {
    const answer = window.checkAnswerStatus();
    if (answer == -1) return;

    playRandomAudio(answer);

    setTriggerImage(false);
    setTriggerValue(answer);
    setAnimationKey((prev) => prev + 1); // restart animation
  };
 

  const [correctJson, setCorrectJson] = useState(null);
  const [incorrectJson, setIncorrectJson] = useState(null);

  // useEffect(() => {
  //   loadPandaJson("correct").then(setCorrectJson);
  //   loadPandaJson("incorrect").then(setIncorrectJson);
  // }, []);


  // Audio list
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

  // Load audio files
  useEffect(() => {
    const base = "https://d3g74fig38xwgn.cloudfront.net/app-sounds/mathzone/";
    Object.keys(audioLists).forEach((type) => {
      audioRefs.current[type] = audioLists[type].map((file) => {
        const audio = new Audio(base + file);
        audio.preload = "auto";
        return audio;
      });
    });
  }, []);

  // Play random audio
  const playRandomAudio = (answer) => {
    const type = answer ? "correct" : "incorrect";
    const list = audioRefs.current[type];
    if (!list.length) return;

    const audio = list[Math.floor(Math.random() * list.length)];
    audio.currentTime = 0;

    setTriggerAnimation(true);
    audio.play().catch(() => {});
  };

  const handleAnimationComplete = () => {
    setTimeout(() => {
      setTriggerAnimation(false);
      setTriggerImage(true);
    }, 300);
  };

  const ishotspot = obj?.question_type === "hotspot";
  const pageType = sessionStorage.getItem("page_type") === "review";

  return (
    <>
      {/* Lottie Animation Section */}
      {triggerAnimation && (
        <div className={styles.quizCorrectInorrect}
        style={{
          right:"100px"
        }}
        >
          {/* Correct / Incorrect Animation */}
          <div style={{ maxWidth: 140 }}>

             <Lottie
              key={`main-${animationKey}`}
              animationData={triggerValue ? correctlottie : incorrectlottie}
              loop={false}
              autoplay
              onComplete={handleAnimationComplete} // ✅ now calls function
            />
          </div>

          {/* Panda Animation */}
          <div style={{ maxWidth: 200 }}>

             <Lottie
              key={`main-${animationKey}`}
              animationData={triggerValue ? pandaCorrect : pandaWrong}
              loop={false}
              autoplay
              onComplete={handleAnimationComplete} // ✅ now calls function
            />
         
          </div>
        </div>
      )}

      {/* Image Section */}
      <Zoom in={triggerImage} timeout={300}>
        <div
          className={styles.quizCorrectInorrect}
          style={{
            top: pageType ? "unset" : ishotspot ? "28px" : "0px",
            height: pageType ? "fit-content" : "100%",
            bottom: pageType ? "0px" : "unset",
          }}
        >
          {triggerValue === "Skipped" ? (
            <button className={styles.skippedButton}>Skipped</button>
          ) : ["Not attempted", "Notattempted"].includes(triggerValue) ? (
            <button className={styles.skippedButton} style={{ backgroundColor: "#1976D2" }}>
              Not Attempted
            </button>
          ) : (
            <img
              src={`https://d2jhdcglwxx007.cloudfront.net/${
                triggerValue ? "correct.png" : "incorrect.png"
              }`}
              alt="correct/incorrect"
            />
          )}
        </div>
      </Zoom>
    </>
  );
}
