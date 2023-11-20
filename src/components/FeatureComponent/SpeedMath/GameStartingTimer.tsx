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
      <div className="flex flex-col h-1/5 w-full  justify-center items-center">
        <p className=" text-speedMathTextColor text-7xl font-extrabold opacity-5">
          0{counter - 1}
        </p>
        <p className=" text-speedMathTextColor text-7xl font-extrabold ">
          0{counter}
        </p>
      </div>
      <div className="flex h-2/5 w-[50%] justify-center mt-10">
        <p className="text-speedMathTextColor text-2xl font-semibold">
          You have 60 sec to answer as much questions as you can . Don't miss
          the chance to get ahead of your teacher
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
