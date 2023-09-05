import { useEffect, useState } from "react";
import CorrectMark from "./assets/images/Correct.svg";

interface ComputerPlayProps {
  computerScore: number;
}
export default function ComputerPlay({ computerScore }: ComputerPlayProps) {
  const [completionPercentage, setCompletionPercentage] = useState("0%");

  useEffect(() => {
    if (computerScore < 34) {
      setCompletionPercentage(Math.floor((computerScore / 100) * 100) + "%");
    } else {
      setCompletionPercentage(Math.floor((computerScore / 200) * 100) + "%");
    }
  }, [computerScore]);

  return (
    <div className="flex flex-row w-[80%] h-[20%] justify-between items-center bg-speedMathGameSelectionModeYelloBg rounded-full mt-5 p-5">
      <div>
        <img src={CorrectMark} alt="Correct" />
      </div>
      <div>
        <p className="text-speedMathTextColor font-bold text-xl">Computer</p>
      </div>
      <div>
        <p className="text-speedMathTextColor font-bold text-2xl">
          {computerScore}
        </p>
      </div>
      <div
        className={`absolute w-[50%] flex-wrap bg-[#50CA95] h-[10%] rounded-full opacity-50`}
        style={{
          width: completionPercentage, // Set the width as a percentage
        }}
      ></div>
    </div>
  );
}
