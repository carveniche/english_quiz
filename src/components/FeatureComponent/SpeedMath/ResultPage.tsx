import { useEffect, useState } from "react";
import { getGameResult } from "../../../api/index";

import WinnerIcon from "./assets/images/trophyicon.png";
import LosserIcon from "./assets/images/Sademoji.png";

import SpeedMathResultFetchingLottie from "../../LottieAnimations/SpeedMathResultFetchingLottie";
interface ResultPageProps {
  userAnswerData: any;
  computerScore: number;
  identity: string;
  liveClassId: number;
  playerId: number;
  gameId: number;
  playMode: string;
}

export default function ResultPage({
  userAnswerData,
  computerScore,
  identity,
  liveClassId,
  playerId,
  gameId,
  playMode,
}: ResultPageProps) {
  const [counter, setCounter] = useState(10);
  const [gameResultData, setGameResultData] = useState(null);
  const [studentScore, setStudentScore] = useState([]);
  const [computerWinnerStatus, setComputerWinnerStatus] = useState(false);

  useEffect(() => {
    counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
    if (counter === 0) {
      getSpeedMathResult();
    }
  }, [counter]);

  useEffect(() => {
    if (gameResultData !== null && playMode == "computer") {
      findWhoWinsComputerOrStudent();
    }
  }, [studentScore]);

  function findWhoWinsComputerOrStudent() {
    let finalStudentScore = studentScore;
    for (let i = 0; i < finalStudentScore.length; i++) {
      if (finalStudentScore[i].game_result === "winner") {
        setComputerWinnerStatus(false);
      } else if (finalStudentScore[i].game_result === "tied") {
        setComputerWinnerStatus(true);
      } else {
        setComputerWinnerStatus(true);
      }
    }
  }

  function getSpeedMathResult() {
    getGameResult(gameId, liveClassId, playerId, computerScore).then((res) => {
      if (res.data.status) {
        setGameResultData(res.data);
        setStudentScore(res.data.response_data);
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

  const showParticipantsScore = () => {
    return (
      <div className="flex flex-col justify-start items-start">
        <>
          {gameResultData.response_data.map((item: any) => {
            return (
              <>
                <div className="flex flex-row w-full h-full mt-5">
                  <div className="flex w-2/3 h-[10%] justify-between items-center  p-1">
                    <div className="flex w-[60%] flex-wrap">
                      <p className="text-speedMathTextColor font-bold text-lg">
                        {item.name}
                      </p>
                    </div>
                    <div className="flex w-[20%] flex-wrap justify-center">
                      <p className="text-speedMathTextColor font-bold text-lg">
                        -
                      </p>
                    </div>
                    <div className="flex w-[20%] flex-wrap justify-center">
                      <p className="text-speedMathTextColor font-bold text-lg">
                        {item.correct}/{item.total}
                      </p>
                    </div>
                  </div>
                  <div className="flex w-1/3 h-[10%] justify-center items-center m-auto  p-1">
                    {item.game_result === "winner" ? (
                      <img
                        style={{
                          width: "40px",
                          height: "40px",
                        }}
                        src={WinnerIcon}
                      ></img>
                    ) : item.game_result === "tied" ? (
                      <img
                        style={{
                          width: "40px",
                          height: "40px",
                        }}
                        src={WinnerIcon}
                      ></img>
                    ) : (
                      <img
                        style={{
                          width: "40px",
                          height: "40px",
                        }}
                        src={LosserIcon}
                      ></img>
                    )}
                  </div>
                </div>
              </>
            );
          })}

          {playMode === "computer" && (
            <div className="flex flex-row w-full h-full mt-5">
              <div className="flex w-2/3 h-[10%] justify-between items-center  p-1">
                <div className="flex w-[60%] flex-wrap">
                  <p className="text-speedMathTextColor font-bold text-lg">
                    Computer Score
                  </p>
                </div>
                <div className="flex w-[20%] flex-wrap justify-center">
                  <p className="text-speedMathTextColor font-bold text-lg">-</p>
                </div>
                <div className="flex w-[20%] flex-wrap justify-center">
                  <p className="text-speedMathTextColor font-bold text-lg">
                    {gameResultData?.computer_score || 0}
                  </p>
                </div>
              </div>
              <div className="flex w-1/3 h-[10%] justify-center items-center m-auto  p-1">
                {computerWinnerStatus ? (
                  <img
                    style={{
                      width: "40px",
                      height: "40px",
                    }}
                    src={WinnerIcon}
                  ></img>
                ) : (
                  <img
                    style={{
                      width: "40px",
                      height: "40px",
                    }}
                    src={LosserIcon}
                  ></img>
                )}
              </div>
            </div>
          )}
        </>
      </div>
    );
  };

  const scoreBoard = () => {
    return (
      <div className="flex flex-col w-full h-full items-start gap-2">
        <div className="flex flex-row w-[98%] h-[10%] justify-center items-start  rounded-full bg-white">
          <div className="flex w-1/2 h-full justify-around items-center  p-5">
            <div className="flex w-1/2 justify-center items-center">
              <p className="text-speedMathTextColor font-bold text-xl">
                Questions
              </p>
            </div>
            <div className="flex w-1/2 justify-center items-center">
              <p className="text-speedMathTextColor font-bold text-xl">
                Corrent Answer
              </p>
            </div>
          </div>
          <div className="flex w-1/2 h-full justify-around items-center  p-5">
            {gameResultData.response_data.map((student) => {
              return (
                <div className="flex w-1/2 justify-center items-center">
                  <p className="text-speedMathTextColor font-bold text-xl">
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
              <div className="flex flex-row w-[98%] h-[10%] justify-center items-start border rounded-full bg-speedMathGameSelectionModeYelloBg">
                <div className="flex w-1/2 h-full justify-around items-center  p-5">
                  <div className="flex w-1/2 justify-center items-center">
                    <p
                      dangerouslySetInnerHTML={{ __html: obj.question }}
                      className="text-speedMathTextColor font-bold text-xl"
                    />
                  </div>
                  <div className="flex w-1/2 justify-center items-center ">
                    <p className="text-speedMathTextColor font-bold text-xl">
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
                            <div className="flex min-w-[30px] min-h-[30px] w-auto h-auto justify-center items-center bg-green-400 rounded-full p-1">
                              <p className="text-speedMathTextColor font-bold text-xl text-center">
                                {res.player_question_data[index].player_answer}
                              </p>
                            </div>
                          ) : (
                            <div className="flex min-w-[30px] min-h-[30px] w-auto h-auto justify-center items-center bg-red-400 rounded-full p-1">
                              <p className="text-speedMathTextColor font-bold text-xl text-center">
                                {res.player_question_data[index].player_answer}
                              </p>
                            </div>
                          )
                        ) : (
                          <p className="text-speedMathTextColor font-bold text-xl">
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
        <div className="flex w-4/5 h-[95%] max-h-[400px] justify-center items-center overflow-auto mt-5">
          {gameResultData !== null && scoreBoard()}
        </div>
        <div className="flex w-1/5 h-full items-start mt-10">
          {gameResultData !== null && showParticipantsScore()}
        </div>
      </div>
    );
  };

  return (
    <div className="flex w-full h-full justify-between items-center">
      {counter > 0 ? resultPackingView() : resultView()}
    </div>
  );
}
