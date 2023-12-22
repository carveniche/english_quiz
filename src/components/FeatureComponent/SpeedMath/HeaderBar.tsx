import SpeedMathLevelLogo from "./assets/images/SM-Level.svg";
import SpeedMathLevelNoBg from "./assets/images/SM-Level-Yellow.svg";
import SpeedMathSpatio from "./assets/images/Spatio.svg";
import QuestionTimer from "./QuestionTimer";
import SpeedMathSummaryBoard from "./assets/images/Speedmath-summary.svg";
import SpeedMathScoreBoard from "./SpeedMathScoreBoard";

interface HeaderBarProps {
  speedMathGameLevel: number;
  playMode: string;
  startQuestionTimer: boolean;
  questionTimerEndedCallback: () => void;
  showSpeedMathSummaryBoard: boolean;
  speedMathScoreBoard: object[];
  group_class: boolean;
}

export default function HeaderBar({
  speedMathGameLevel,
  playMode,
  startQuestionTimer,
  questionTimerEndedCallback,
  showSpeedMathSummaryBoard,
  speedMathScoreBoard,
  group_class,
}: HeaderBarProps) {
  return (
    <div className="flex flex-row justify-between items-center">
      <div
        className="flex flex-row w-full h-full justify-around items-center p-2"
        style={{
          flexBasis: group_class ? "30%" : "auto",
        }}
      >
        <div
          style={{
            background: `url(${SpeedMathLevelLogo}) no-repeat center center`,
          }}
          className="w-full h-16 flex justify-center items-center bg-center bg-cover rounded-full"
        >
          <div className="absolute inline-block left-[30px]">
            <img className="max-w-full block" src={SpeedMathLevelNoBg} />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white p-4 font-bold">
              {speedMathGameLevel}
            </div>
          </div>
          <div>
            <h1 className="text-center text-white m-0 text-base">Level</h1>
          </div>
        </div>

        <div
          style={{
            background: `url(${SpeedMathLevelLogo}) no-repeat center center`,
            backgroundSize: "cover",
          }}
          className="w-full h-16 flex justify-center items-center bg-center bg-cover rounded-full"
        >
          <h1 className="text-center text-white m-0 text-base overflow-hidden overflow-ellipsis">
            Play Mode - With {playMode === "teacher" ? "Coach" : playMode}
          </h1>
        </div>
      </div>
      <div
        className="flex flex-row w-full h-full justify-center items-center"
        style={{
          flexBasis: group_class ? "60%" : "auto",
        }}
      >
        {startQuestionTimer && (
          <QuestionTimer
            duration={60}
            questionTimerEndedCallback={questionTimerEndedCallback}
          />
        )}
        {showSpeedMathSummaryBoard && <img src={SpeedMathSummaryBoard} />}
        {speedMathScoreBoard?.response_data?.length > 0 && (
          <SpeedMathScoreBoard
            speedMathScoreBoard={speedMathScoreBoard}
            playMode={playMode}
          />
        )}
      </div>
      <div
        className="flex flex-row w-full h-full justify-end "
        style={{
          flexBasis: group_class ? "10%" : "auto",
        }}
      >
        <img className="w-[100px] h-[100px]" src={SpeedMathSpatio} />
      </div>
    </div>
  );
}
