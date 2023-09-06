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

  console.log("gameResultData", gameResultData);

  useEffect(() => {
    counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
    if (counter === 0) {
      getSpeedMathResult();
    }
  }, [counter]);

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
      <div className="flex flex-col justify-start items-start border border-green-200 rounded">
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
                Computer Animation
              </div>
            </div>
          )}
        </>
      </div>
    );
  };

  const scoreBoard = () => {
    return <div></div>;
  };

  const resultView = () => {
    return (
      <div className="flex flex-row w-full h-full justify-center items-center">
        <div className="flex w-4/5 h-[90%] justify-center items-center border border-red-500 overflow-auto">
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
