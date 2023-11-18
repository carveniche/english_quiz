import { useEffect, useState } from "react";
import SpeedMathSpatio from "./assets/images/Spatio.svg";
import StartSpeedMath from "./assets/images/SM-Lets-go.svg";

interface GameModeSelectionProps {
  startSpeedMath: () => void;
  selectedPlayMode: React.ChangeEventHandler<HTMLInputElement>;
  remoteParticipantCount: number;
  playMode: string;
}

const singleUserModeOfPlay = [
  {
    name: "sm-mode",
    id: "speedmath-computer",
    label: "Play with computer",
    value: "computer",
  },

  {
    name: "sm-mode",
    id: "speedmath-teacher",
    label: "Play with Coach",
    value: "teacher",
  },
];

const multipleUserModeOfPlay = [
  {
    name: "sm-mode",
    id: "speedmath-friends",
    label: "Play with friends",
    value: "globe",
  },
  {
    name: "sm-mode",
    id: "speedmath-teacher",
    label: "Play with Coach",
    value: "teacher",
  },
];

export default function GameModeSelection({
  startSpeedMath,
  selectedPlayMode,
  remoteParticipantCount,
  playMode,
}: GameModeSelectionProps) {
  const [gameModeOfPlay, setGameModeOfPlay] = useState("SinglePlayer");

  useEffect(() => {
    const newGameModeOfPlay =
      remoteParticipantCount > 1 ? "MultiplePlayer" : "SinglePlayer";
    setGameModeOfPlay(newGameModeOfPlay);
  }, []);

  //Get Value from Redux RemoteParticipant Length and then check Mode of Play(Single user or Multiple User)

  return (
    <div className="flex w-full h-full justify-center items-center">
      <div className="flex flex-col w-[50%] h-[70%] justify-center">
        <div className="flex h-2/5 w-full  justify-center">
          <img className="w-[100px] h-[100px]" src={SpeedMathSpatio} />
        </div>
        <div className="flex flex-col h-full w-full  justify-center bg-speedMathGameSelectionModeYelloBg border rounded">
          <div className="flex h-1/5 w-full justify-center mt-2">
            <p className="text-speedMathTextColor font-semibold text-lg">
              Select Play Mode for Kids
            </p>
          </div>
          <div className="flex flex-row gap-5 h-3/5 w-full justify-center items-center">
            {gameModeOfPlay === "SinglePlayer"
              ? singleUserModeOfPlay.map((obj) => {
                  return (
                    <div key={obj.id}>
                      <input
                        id={obj.id}
                        name={obj.name}
                        type="radio"
                        checked={obj.value === playMode}
                        onChange={selectedPlayMode}
                        value={obj.value}
                      />
                      <label
                        className="text-speedMathTextColor text-xl"
                        htmlFor={obj.id}
                      >
                        {obj.label}
                      </label>
                    </div>
                  );
                })
              : multipleUserModeOfPlay.map((obj) => {
                  return (
                    <div key={obj.id}>
                      <input
                        id={obj.id}
                        name={obj.name}
                        type="radio"
                        checked={obj.value === playMode}
                        onChange={selectedPlayMode}
                        value={obj.value}
                      />
                      <label
                        className="text-speedMathTextColor text-xl"
                        htmlFor={obj.id}
                      >
                        {obj.label}
                      </label>
                    </div>
                  );
                })}
          </div>
          <div className="flex h-2/5 w-full justify-center items-center">
            <button onClick={startSpeedMath}>
              <img src={StartSpeedMath} alt="Let's go" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
