import WinnerIcon from "./assets/images/trophyicon.png";
import LosserIcon from "./assets/images/Sademoji.png";

interface SpeedMathScoreBoardProps {
  speedMathScoreBoard: object[];
  playMode: string;
}

export default function SpeedMathScoreBoard({
  speedMathScoreBoard,
  playMode,
}: SpeedMathScoreBoardProps) {
  console.log("speedMathScoreBoard", speedMathScoreBoard);
  return (
    <>
      {speedMathScoreBoard?.response_data.map((item: any) => {
        return (
          <div className="flex flex-row w-full h-full mt-5 ">
            <div className="flex w-2/3 h-[10%] justify-between items-center  p-1">
              <div className="flex w-[60%] flex-wrap">
                <p className="text-speedMathTextColor font-bold text-lg">
                  {item.name}
                </p>
              </div>
              <div className="flex w-[20%] flex-wrap justify-center">
                <p className="text-speedMathTextColor font-bold text-lg">-</p>
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
                {speedMathScoreBoard?.computer_score || 0}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
