import { useEffect, useState } from "react";
import CorrectMark from "./assets/images/Correct.svg";
import ComputerPlay from "./ComputerPlay";
import { isStudentName } from "../../../utils/participantIdentity";

interface GameInProgressTeacherProps {
  playMode: string;
  speedMathScoreofAllParticipant: any;
  startQuestionTimer: boolean;
  onGameInProgressTimerEnd: (computerScore: number) => void;
}

const level_1_seconds = [2, 2, 2, 3, 3, 3, 4, 3, 3, 2];

export default function GameInProgressTeacher({
  playMode,
  speedMathScoreofAllParticipant,
  startQuestionTimer,
  onGameInProgressTimerEnd,
}: GameInProgressTeacherProps) {
  const [completionPercentage, setCompletionPercentage] = useState("0%");
  const [computerScore, setComputerScore] = useState(0);

  useEffect(() => {
    if (playMode == "computer") {
      setTimeout(function () {
        setComputerScore(computerScore + 1);
      }, level_1_seconds[getRandomIndex()] * 1000);
    }
  }, [computerScore]);

  useEffect(() => {
    if (!startQuestionTimer) {
      onGameInProgressTimerEnd(computerScore);
    }
  }, [startQuestionTimer]);

  const getRandomIndex = () => {
    var randomItemIndex =
      level_1_seconds[Math.floor(Math.random() * level_1_seconds.length)];

    return randomItemIndex;
  };

  return (
    <div className="flex flex-row w-full h-full justify-between items-center">
      <div className="flex w-full h-full justify-center items-center">
        <p className="text-speedMathTextColor font-bold text-6xl">
          Game In Progress
        </p>
      </div>
      <div className="flex w-full h-full justify-center items-center">
        <div className="flex flex-col w-[90%] h-full justify-center">
          {speedMathScoreofAllParticipant.length > 0 &&
            speedMathScoreofAllParticipant.map((studentData: any) => {
              return (
                <div className="flex flex-row w-[80%] h-[20%] justify-between items-center bg-speedMathGameSelectionModeYelloBg rounded-full mt-5 p-5">
                  <div>
                    <img src={CorrectMark} alt="Correct" />
                  </div>
                  <div>
                    <p className="text-speedMathTextColor font-bold text-xl">
                      {isStudentName({ identity: studentData.identity })}
                    </p>
                  </div>
                  <div>
                    <p className="text-speedMathTextColor font-bold text-2xl">
                      {studentData.currentUserScoreSpeedMath}
                    </p>
                  </div>
                  <div
                    className={`absolute bg-[#50CA95] h-[10%] rounded-full opacity-50`}
                    style={{
                      width: completionPercentage, // Set the width as a percentage
                    }}
                  ></div>
                </div>
              );
            })}

          {playMode === "computer" && (
            <ComputerPlay computerScore={computerScore} />
          )}
        </div>
      </div>
    </div>
  );
}
