import { useEffect, useState } from "react";
import happyChild from "./assets/images/happyemoji.png";
interface GameStartingTimerProps {
  onTimerEnd: () => void;
}

export default function GameStartingTimer({
  onTimerEnd,
}: GameStartingTimerProps) {
  const [counter, setCounter] = useState(5);

  useEffect(() => {
    counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
    if (counter === 0) {
      onTimerEnd();
    }
  }, [counter]);

  return (
    <div className="flex flex-col w-full h-full justify-center items-center">
      <div className="flex h-1/5 w-full  justify-center">
        <p className=" text-speedMathTextColor text-7xl font-bold">
          0{counter}
        </p>
      </div>
      <div className="flex h-1/5 w-full justify-center mt-2">
        <p className="text-speedMathTextColor text-2xl font-semibold">
          You have 60 sec to answer as many question as you can. Don't miss the
          chance to get ahead of your teacher
        </p>
        <img
          style={{
            width: "30px",
            height: "30px",
            marginLeft: "6px",
            marginBottom: "4px",
          }}
          src={happyChild}
        ></img>
      </div>
    </div>
  );
}