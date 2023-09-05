import React, { useState, useEffect, useRef } from "react";
import { storeGameResponse, createSpeedMathGame } from "../../../api/index";
import CorrectMark from "./assets/images/Correct.svg";
interface QuestionComponentProps {
  speedMathGameId: number;
  identity: string;
  speedMathGameLevel: number;
  liveClassId: number;
  userId: number;
  playMode: string;
  startQuestionTimer: boolean;
  onGameTimerEnd: (
    userAnswerData: Array<[]>,
    computerScore: number,
    userScore: number,
    gameId: number
  ) => void;
}

export default function QuestionComponent({
  speedMathGameId,
  identity,
  speedMathGameLevel,
  liveClassId,
  userId,
  playMode,
  onGameTimerEnd,
  startQuestionTimer,
}: QuestionComponentProps) {
  const [gameQuestionsData, setGameQuestionsData] = useState([]);
  const [questionCount, setQuestionCount] = useState<number>(0);
  const [userScore, setUserScore] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [completionPercentage, setCompletionPercentage] = useState("0%");
  const [userAnswerData, setUserAnswersData] = useState([]);
  const [computerScore, setComputerScore] = useState(0);
  const textAnswerInput = useRef(null);

  useEffect(() => {
    try {
      createSpeedMathGame(speedMathGameId, userId).then((res) => {
        if (res.data.status) setGameQuestionsData(res.data.game_questions);
      });
    } catch (error) {
      console.log("Error", error);
    }
  }, []);

  useEffect(() => {
    if (!startQuestionTimer) {
      onGameTimerEnd(userAnswerData, computerScore, userScore, speedMathGameId);
    }
  }, [startQuestionTimer]);

  const onUserInputChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const re = /^[0-9\b]+$/;

    if (event.target.value === "" || re.test(event.target.value)) {
      setUserInput(event.target.value);
    }
  };

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter" && event.target.value != "") {
      var userAnswer = event.target.value;
      setQuestionCount((questionCount) => questionCount + 1);
      clearAnswerInput();

      if (userAnswer == gameQuestionsData[questionCount].answer) {
        onCorrectAnswer(userAnswer);
      } else {
        sendGameDataToServer(
          gameQuestionsData[questionCount].id,
          false,
          userAnswer
        );
      }
      var userData = {
        question: gameQuestionsData[questionCount].question,
        correctAnswer: gameQuestionsData[questionCount].answer,
        studentAnswer: userAnswer,
        status: userAnswer == gameQuestionsData[questionCount].answer,
      };

      setUserAnswersData([...userAnswerData, userData]);
    }
  };

  const clearAnswerInput = () => setUserInput("");

  const onCorrectAnswer = (userAnswer: any) => {
    var currentUserScore = userScore + 1;
    setUserScore(currentUserScore);
    setCompletionPercentage(Math.floor((currentUserScore / 50) * 100) + "%");
    sendGameDataToServer(gameQuestionsData[questionCount].id, true, userAnswer);
    // onUpdateLiveSpeedMathScore(userId, identity, currentUserScore);
  };

  const sendGameDataToServer = (
    questionId: number,
    status: boolean,
    userAnswer: any
  ) => {
    console.log(
      "userId checking before saving question data to server",
      userId
    );
    storeGameResponse(userId, speedMathGameId, questionId, status, userAnswer);
  };

  return (
    <div className="flex flex-row w-full h-full justify-between items-center">
      <div className="flex flex-col w-full h-full justify-center items-center p-5 gap-4">
        <div className="flex flex-col w-full h-full justify-center items-center  bg-speedMathGameSelectionModeYelloBg rounded-full">
          <div className="flex h-2/5 w-full justify-center items-center">
            <p className="text-speedMathTextColor font-bold text-xl">
              Keep answering as quickly as you can
            </p>
          </div>
          <div className="flex h-3/5 w-full justify-center items-center">
            {gameQuestionsData.length > 0 && questionCount < 50 && (
              <p className="text-speedMathTextColor font-bold text-4xl">
                <div
                  style={{ padding: "0px 0px 0px 44px" }}
                  dangerouslySetInnerHTML={{
                    __html: gameQuestionsData[questionCount].question,
                  }}
                />
              </p>
            )}
          </div>
        </div>
        <div className="flex w-full h-full justify-center items-center  bg-speedMathGameSelectionModeYelloBg rounded-full">
          <input
            autoFocus
            placeholder="Answer and Enter"
            type="text"
            // inputMode={ipad ? "none" : "numeric"}
            onChange={onUserInputChange}
            value={userInput}
            ref={textAnswerInput}
            onKeyDown={handleKeyPress}
            className="w-[80%] h-[80%] rounded-full p-10 text-3xl "
          />
        </div>
      </div>
      <div className="flex w-full h-full justify-center items-center">
        <div className="flex w-[90%] h-full justify-center">
          <div className="flex flex-row w-[80%] h-[20%] justify-between items-center bg-speedMathGameSelectionModeYelloBg rounded-full mt-5 p-5">
            <div>
              <img src={CorrectMark} alt="Correct" />
            </div>
            <div>
              <p className="text-speedMathTextColor font-bold text-xl">You</p>
            </div>
            <div>
              <p className="text-speedMathTextColor font-bold text-2xl">
                {userScore}
              </p>
            </div>
            <div
              className={`absolute bg-[#50CA95] h-[10%] rounded-full opacity-50`}
              style={{
                width: completionPercentage,
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
