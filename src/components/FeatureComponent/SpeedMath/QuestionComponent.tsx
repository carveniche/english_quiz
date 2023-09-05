import React, { useState, useEffect, useRef } from "react";
interface QuestionComponentProps {
  speedMathGameId: number;
  identity: string;
  speedMathGameLevel: number;
  liveClassId: number;
  userId: number;
  playMode: string;
  onGameTimerEnd: () => void;
}

export default function QuestionComponent({
  speedMathGameId,
  identity,
  speedMathGameLevel,
  liveClassId,
  userId,
  playMode,
  onGameTimerEnd,
}: QuestionComponentProps) {
  const [gameQuestionsData, setGameQuestionsData] = useState(["1"]);
  const [questionsCount, setQuestionsCount] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [completionPercentage, setCompletionPercentage] = useState("0%");
  const [userAnswerData, setUserAnswersData] = useState([]);
  const [computerScore, setComputerScore] = useState(0);
  const textAnswerInput = useRef();

  useEffect(() => {
    // console.log("Question Started speedMathGameId", speedMathGameId);
    // var players = [];
    // players[0] = userId;
    // console.log("Userid live class", userId);
    // console.log("Game Id live Class", gameId);
    // createSpeedMathGame(gameId, userId).then((res) => {
    //   console.log("Questions : ", res.data);
    //   if (res.data.status)
    //     // setGameId(res.data.game_id)
    //     setGameQuestions(res.data.game_questions);
    // });
  }, []);

  return (
    <div className="flex flex-row w-full h-full justify-between items-center border border-red-500">
      <div className="flex flex-col w-full h-full justify-center items-center p-5 gap-4">
        <div className="flex flex-col w-full h-full justify-center items-center  bg-speedMathGameSelectionModeYelloBg rounded">
          <div className="flex h-2/5 w-full justify-center items-center">
            <p className="text-speedMathTextColor font-bold text-xl">
              Keep answering as quickly as you can
            </p>
          </div>
          <div className="flex h-3/5 w-full justify-center items-center border border-red-500">
            {gameQuestionsData.length > 0 && questionsCount < 50 && (
              <p className="text-speedMathTextColor font-bold text-4xl">10+5</p>
            )}
          </div>
        </div>
        <div className="flex w-full h-full justify-center items-center  bg-speedMathGameSelectionModeYelloBg rounded">
          2
        </div>
      </div>
      <div className="flex w-full h-full justify-center items-center border border-blue-900">
        2
      </div>
    </div>
  );
}
