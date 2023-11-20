import WinnerIcon from "./assets/images/trophyicon.png";
import LosserIcon from "./assets/images/Sademoji.png";
import SpeedMathLevelNoBg from "./assets/images/SM-Level-Yellow.svg";
interface SpeedMathScoreBoardProps {
  speedMathScoreBoard: object[];
  playMode: string;
}

export default function SpeedMathScoreBoard({
  speedMathScoreBoard,
  playMode,
}: SpeedMathScoreBoardProps) {
  return (
    <>
      {speedMathScoreBoard?.response_data.map((item: any, index) => {
        return (
          <div
            className="flex flex-row w-full h-full  justify-center items-center"
            key={`SpeedMathScore-${index}`}
          >
            <div className="flex w-2/3 h-[10%] justify-between items-center p-1">
              <div className="w-full h-16 flex justify-center relative items-center bg-[#58DCA3] rounded-full">
                <h1 className="text-center text-speedMathTextColor m-0 text-base overflow-hidden overflow-ellipsis">
                  {item.name}
                </h1>
                <div className="absolute z-10" style={{ right: "-57px" }}>
                  <img className="max-w-full block" src={SpeedMathLevelNoBg} />
                  <div className="absolute w-[50px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-white aspect-square flex items-center justify-center">
                    <div className=" text-speedMathTextColor  font-bold ">
                      {item.correct}/{item.total}
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="flex w-[60%] flex-wrap bg-[#58DCA3] rounded-full p-2 h-[64px]">
                <p className="text-speedMathTextColor font-bold text-lg">
               
                </p>
              </div> */}

              {/* <div className="flex w-[20%] flex-wrap justify-center">
                <p className="text-speedMathTextColor font-bold text-lg">
                  {item.correct}/{item.total}
                </p>
              </div> */}
            </div>
            <div className="flex w-1/3 h-[10%] justify-center items-center ml-[37px]  p-1">
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
        <div className="flex flex-row w-full h-full">
          <div className="w-full h-16 flex justify-center relative items-center bg-[#58DCA3] rounded-full">
            <h1 className="text-center text-speedMathTextColor m-0 text-base overflow-hidden overflow-ellipsis">
              Computer Score
            </h1>
            <div className="absolute z-10" style={{ right: "-57px" }}>
              <img className="max-w-full block" src={SpeedMathLevelNoBg} />
              <div className="absolute w-[50px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-white aspect-square flex items-center justify-center">
                <div className=" text-speedMathTextColor  font-bold ">
                  {speedMathScoreBoard?.computer_score || 0}
                </div>
              </div>
            </div>
          </div>
          {/* <div className="flex w-2/3 h-[10%] justify-between items-center  p-1">
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
          </div> */}
        </div>
      )}
    </>
  );
}
