import { useEffect, useState } from "react";
import SpeedMathSpatio from "./assets/images/Spatio.svg";

import "./GameModeSelection.css";

interface GameModeSelectionProps {
  startSpeedMath: React.ChangeEventHandler<HTMLInputElement>;
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
    label: "Play with teacher",
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
    label: "Play with teacher",
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
            <p className="text-speedMathTextColor font-semibold">
              Select Play Mode for Kids
            </p>
          </div>
          <div className="flex flex-row h-3/5 w-full justify-center items-center">
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
                      <label htmlFor={obj.id}>{obj.label}</label>
                    </div>
                  );
                })
              : multipleUserModeOfPlay.map((item) => {
                  return <div key={item.id}>{item.name}</div>;
                })}
          </div>
          <div className="h-2/5 w-full justify-center"></div>
        </div>
      </div>
    </div>
  );
}
