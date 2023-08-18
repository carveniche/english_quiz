import React, { useContext, useEffect, useRef, useState } from "react";
import CorrectAnswerAnimation from "../../LottieTransformation/CorrectAnswerAnimation";
import GameLoseEmotionMathZone from "../../LottieTransformation/GameLoseEmotionMathZone";
import { ViewStatusContext } from "./Mathzone";
import { ValidationContext } from "./MainOnlineQuiz/MainOnlineQuizPage";
import styles from "./component/OnlineQuiz.module.css";
import styles2 from "./outerPage.module.css";
export default function SolveButton({ onClick }) {
  const excludeParticipant = ["sm", "audit", "smmanager", "", "parent"];
  const [openAnimation, setOpenAnimation] = useState(false);
  const timer1 = useRef(null);
  const timer2 = useRef(null);
  const {
    hasAnswerSubmitted,
    currentIdentity,
    isAnswerCorrect,
    selectedState,
  } = useContext(ValidationContext);
  const { hideSolveButton } = useContext(ViewStatusContext);
  useEffect(() => {
    if (hasAnswerSubmitted) {
      handleOpenAnimation();
    }
    return () => {
      clearTimeout(timer1.current);
      clearTimeout(timer2.current);
    };
  }, [hasAnswerSubmitted]);
  const handleOpenAnimation = () => {
    timer1.current = setTimeout(() => {
      setOpenAnimation(true);
      clearTimeout(timer1.current);
      handleCloseAnimation();
    }, 500);
  };
  const handleCloseAnimation = () => {
    timer2.current = setTimeout(() => {
      // setOpenAnimation(false);
      clearTimeout(timer2.current);
    }, 5000);
  };

  if (excludeParticipant?.includes(currentIdentity)) return <></>;
  return !hideSolveButton ? (
    <>
      {hasAnswerSubmitted ? (
        <div
          className={`${styles2.checkButton} ${styles.checkButtonWaiting}`}
          id="solveBtn"
        >
          <b>please wait...</b>
        </div>
      ) : (
        <button
          onClick={onClick}
          className={`${styles2.checkButton} ${styles.checkButtonColor}`}
          id="solveBtn"
        >
          Solve
        </button>
      )}
      {hasAnswerSubmitted && isAnswerCorrect && openAnimation && (
        <CorrectAnswerAnimation />
      )}
      {hasAnswerSubmitted && !isAnswerCorrect && openAnimation && (
        <GameLoseEmotionMathZone />
      )}
    </>
  ) : null;
}
