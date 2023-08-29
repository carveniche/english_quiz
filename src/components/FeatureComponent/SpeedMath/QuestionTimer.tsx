import { useState, useEffect } from "react";
import "./QuestionTimer.css";
interface QuestionTimerProps {
  duration: number;
}

const QuestionTimer = ({ duration }: QuestionTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timeLeft]);

  const progress = ((duration - timeLeft) / duration) * 100;

  return (
    <div className="w-[80px] h-[80px] rounded-full border-6 border-blue-500 relative bg-white">
      <div
        className="circle-fill"
        style={{
          transform: `rotate(${progress * 3.6}deg)`,
        }}
      />
      <span
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {timeLeft}s
      </span>
    </div>
  );
};

export default QuestionTimer;
