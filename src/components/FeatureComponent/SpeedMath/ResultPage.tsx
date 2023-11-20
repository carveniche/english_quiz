import { useEffect, useState } from "react";
import { getGameResult } from "../../../api/index";

import SpeedMathResultFetchingLottie from "../../LottieAnimations/SpeedMathResultFetchingLottie";
import { isTutor } from "../../../utils/participantIdentity";
import VictoryAnimation from "../../LottieAnimations/SpeedMathVictoryAnimation";
import LossingAnimation from "../../LottieAnimations/SpeedMathLossingAnimation";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

interface ResultPageProps {
  userAnswerData: any;
  computerScore: number;
  identity: string;
  liveClassId: number;
  playerId: number;
  gameId: number;
  playMode: string;
  getFinalResult: (score: []) => void;
}

export default function ResultPage({
  computerScore,
  liveClassId,
  playerId,
  gameId,
  identity,
  playMode,
  getFinalResult,
}: ResultPageProps) {
  const { students } = useSelector(
    (state: RootState) => state.videoCallTokenData
  );
  const [counter, setCounter] = useState(10);
  const [gameResultData, setGameResultData] = useState(null);
  const [studentScore, setStudentScore] = useState([]);
  const [studentWinningStatus, setStudentWinningStatus] = useState(false);
  const [showWinningStatusAnimation, setShowWinningStatusAnimation] =
    useState(false);

  useEffect(() => {
    counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
    if (counter === 0) {
      if (playMode === "computer" && isTutor({ identity: identity })) {
        getSpeedMathResultForTutorInComputerMode();
      } else {
        getSpeedMathResult();
      }
    }
  }, [counter]);

  useEffect(() => {
    if (counter === 0) {
      findAverageForStudent();
    }
  }, [studentScore]);

  const resetWinningStatusAnimation = () => {
    setTimeout(() => {
      setShowWinningStatusAnimation(false);
    }, 5000);
  };

  function findAverageForStudent() {
    if (isTutor({ identity: String(identity) })) {
      return;
    }

    studentScore.forEach((score) => {
      let userIdentity = identity.split("-");
      if (score.player_id === Number(userIdentity[0])) {
        if (score.game_result === "winner" || score.game_result === "tied") {
          setStudentWinningStatus(true);
          setShowWinningStatusAnimation(true);
          resetWinningStatusAnimation();
        } else {
          setShowWinningStatusAnimation(true);
          resetWinningStatusAnimation();
        }
      }
    });
  }

  function getSpeedMathResultForTutorInComputerMode() {
    let studentId = students[0]?.id || 0;
    getGameResult(gameId, liveClassId, studentId, computerScore).then((res) => {
      if (res.data.status) {
        setGameResultData(res.data);
        setStudentScore(res.data.response_data);
        getFinalResult(res.data);
      }
    });
  }

  function getSpeedMathResult() {
    getGameResult(gameId, liveClassId, playerId, computerScore).then((res) => {
      if (res.data.status) {
        setGameResultData(res.data);
        setStudentScore(res.data.response_data);
        getFinalResult(res.data);
      }
    });
  }

  const resultPackingView = () => {
    return (
      <div className="flex flex-col w-full h-full justify-center items-center">
        <p className="text-speedMathTextColor font-bold text-2xl">
          Unlocking your result, be ready for the surprise!!
        </p>
        <div>
          <SpeedMathResultFetchingLottie />
        </div>
      </div>
    );
  };

  const scoreBoard = () => {
    return (
      <div className="flex flex-col w-full h-full items-start gap-2">
        <div className="flex flex-row w-[98%] h-[10%] justify-center items-start  rounded-full bg-white">
          <div className="flex w-1/2 h-full justify-around items-center  p-5">
            <div className="flex w-1/2 justify-center items-center">
              <p className="text-speedMathTextColor font-bold text-sm">
                Questions
              </p>
            </div>
            <div className="flex w-1/2 justify-center items-center">
              <p className="text-speedMathTextColor font-bold text-sm">
                Correct Answer
              </p>
            </div>
          </div>
          <div className="flex w-1/2 h-full justify-around items-center  p-5">
            {gameResultData.response_data.map((student, index) => {
              return (
                <div
                  className="flex w-1/2 justify-center items-center"
                  key={index}
                >
                  <p className="text-speedMathTextColor font-bold text-sm">
                    {student.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        {gameResultData.question_data.map((obj, index) => {
          return (
            <>
              <div
                className="flex flex-row w-[98%] h-[10%] justify-center items-start border rounded-full bg-speedMathGameSelectionModeYelloBg"
                key={index}
              >
                <div className="flex w-1/2 h-full justify-around items-center  p-5">
                  <div className="flex w-1/2 justify-center items-center">
                    <p
                      dangerouslySetInnerHTML={{ __html: obj.question }}
                      className="text-speedMathTextColor font-bold text-sm"
                    />
                  </div>
                  <div className="flex w-1/2 justify-center items-center ">
                    <p className="text-speedMathTextColor font-bold text-sm">
                      {obj.answer}
                    </p>
                  </div>
                </div>
                <div className="flex w-1/2 h-full justify-around items-center  p-5">
                  {gameResultData?.response_data.map((res) => {
                    return (
                      <div key={res.id}>
                        {res.player_question_data[index] !== undefined ? (
                          res.player_question_data[index].correct ? (
                            <div className="flex min-w-[20px] min-h-[20px] w-auto h-auto justify-center items-center bg-green-400 rounded-full p-1.5 aspect-square">
                              <p className="text-speedMathTextColor font-bold text-sm text-center">
                                {res.player_question_data[index].player_answer}
                              </p>
                            </div>
                          ) : (
                            <div className="flex min-w-[20px] min-h-[20px] w-auto h-auto justify-center items-center bg-red-400 rounded-full p-1.5 aspect-square">
                              <p className="text-speedMathTextColor font-bold text-sm text-center">
                                {res.player_question_data[index].player_answer}
                              </p>
                            </div>
                          )
                        ) : (
                          <p className="text-speedMathTextColor font-bold text-sm">
                            Na
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          );
        })}
      </div>
    );
  };

  const resultView = () => {
    return (
      <div className="flex flex-row w-full h-full justify-center items-center ">
        <div className="flex w-4/5 h-[95%] max-h-[350px] justify-center items-center overflow-auto mt-5">
          {gameResultData !== null && scoreBoard()}
        </div>
        <div className="flex w-1/5 h-full items-start mt-10"></div>
      </div>
    );
  };

  return (
    <div className="flex w-full h-full justify-between items-center">
      {studentWinningStatus && showWinningStatusAnimation ? (
        <div className="flex absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 justify-between w-[500px] h-[500px] z-10">
          <VictoryAnimation />
        </div>
      ) : !studentWinningStatus && showWinningStatusAnimation ? (
        <div className="flex absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 justify-between w-[250px] h-[250px] z-10">
          <LossingAnimation />
        </div>
      ) : null}

      {counter > 0 ? resultPackingView() : resultView()}
    </div>
  );
}
