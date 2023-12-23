import { useContext } from "react";
import { ValidationContext } from "../QuizPage";
import { flushSync } from "react-dom";

export default function SolveButton({ onClick }) {
  const { studentAnswer, isCorrect } = useContext(ValidationContext);
  const handleSubmit = () => {
    if (typeof onClick === "function") return flushSync(() => onClick());
    return -1;
  };
  window.handleSubmitReactQuestion = handleSubmit;
  const checkAnswerStatus = () => {
    return isCorrect;
  };
  const handleCheckStudentResponse = () => {
    return {
      isCorrect,
      studentAnswer,
    };
  };
  window.checkAnswerStatus = checkAnswerStatus;
  window.handleCheckStudentResponse = handleCheckStudentResponse;
  return <></>;
}
