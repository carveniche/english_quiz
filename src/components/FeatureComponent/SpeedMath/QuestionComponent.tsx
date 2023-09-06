import React, { useState, useEffect, useRef } from "react";
import { storeGameResponse, createSpeedMathGame } from "../../../api/index";
import CorrectMark from "./assets/images/Correct.svg";
import ComputerPlay from "./ComputerPlay";
import { Room } from "twilio-video";
import { isStudentName } from "../../../utils/participantIdentity";
interface QuestionComponentProps {
  room: Room | null;
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
  speedMathScoreofAllParticipant: any;
}

const level_1_seconds = [2, 2, 2, 3, 3, 3, 4, 3, 3, 2];

export default function QuestionComponent({
  room,
  speedMathGameId,
  identity,
  speedMathGameLevel,
  liveClassId,
  userId,
  playMode,
  onGameTimerEnd,
  startQuestionTimer,
  speedMathScoreofAllParticipant,
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
    if (playMode == "computer") {
      setTimeout(function () {
        setComputerScore(computerScore + 1);
      }, level_1_seconds[getRandomIndex()] * 1000);
    }
  }, [computerScore]);

  useEffect(() => {
    if (!startQuestionTimer) {
      onGameTimerEnd(userAnswerData, computerScore, userScore, speedMathGameId);
    }
  }, [startQuestionTimer]);

  const getRandomIndex = () => {
    var randomItemIndex =
      level_1_seconds[Math.floor(Math.random() * level_1_seconds.length)];
    return randomItemIndex;
  };

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
    if (currentUserScore < 34) {
      setCompletionPercentage(Math.floor((currentUserScore / 100) * 100) + "%");
    } else {
      setCompletionPercentage(Math.floor((currentUserScore / 200) * 100) + "%");
    }

    sendGameDataToServer(gameQuestionsData[questionCount].id, true, userAnswer);
    // onUpdateLiveSpeedMathScore(userId, identity, currentUserScore);
    updateScoreToOtherParticipant(userId, currentUserScore);
  };

  const updateScoreToOtherParticipant = (
    userId: number,
    currentUserScore: number
  ) => {
    const [localDataTrackPublication] = [
      ...room!.localParticipant.dataTracks.values(),
    ];
    let DataTrackObj = {
      pathName: null,
      value: {
        datatrackName: "updateSpeedMathScoreToOtherParticipant",
        identity: room?.localParticipant.identity,
        userId: userId,
        currentUserScoreSpeedMath: currentUserScore,
      },
    };
    localDataTrackPublication.track.send(JSON.stringify(DataTrackObj));
  };

  const sendGameDataToServer = (
    questionId: number,
    status: boolean,
    userAnswer: any
  ) => {
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
        <div className="flex flex-col w-[90%] h-full justify-center">
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
                width: completionPercentage, // Set the width as a percentage
              }}
            ></div>
          </div>
          {speedMathScoreofAllParticipant.length > 0 &&
            speedMathScoreofAllParticipant.map((studentData: any) => {
              return (
                <div className="flex flex-row w-[80%] h-[20%] justify-between items-center bg-speedMathGameSelectionModeYelloBg rounded-full mt-5 p-5">
                  <div>
                    <img src={CorrectMark} alt="Correct" />
                  </div>
                  <div>
                    <p className="text-speedMathTextColor font-bold text-xl">
                      {studentData.identity === "tutor" ? (
                        <>{studentData.identity}</>
                      ) : (
                        <>{isStudentName({ identity: studentData.identity })}</>
                      )}
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
