import SpeedMathLevelLogo from "./assets/images/SM-Level.svg";
import SpeedMathLevelNoBg from "./assets/images/SM-Level-Yellow.svg";
import SpeedMathSpatio from "./assets/images/Spatio.svg";
import QuestionTimer from "./QuestionTimer";

export default function HeaderBar() {
  //Get level from redux
  //Get Play Mode with Redux
  //Start timer when game starts

  return (
    <div className="flex flex-row justify-between items-center">
      <div className="flex flex-row w-full h-full justify-around items-center p-2">
        <div
          style={{
            background: `url(${SpeedMathLevelLogo}) no-repeat center center`,
          }}
          className="w-full h-16 flex justify-center items-center bg-center bg-cover rounded-full"
        >
          <div className="absolute inline-block left-[30px]">
            <img className="max-w-full block" src={SpeedMathLevelNoBg} />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white p-4 font-bold">
              1
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
            Play Mode - With Computer
          </h1>
        </div>
      </div>
      <div className="flex flex-row w-full h-full justify-center">
        Question Timer {/* <QuestionTimer duration={100} /> */}
      </div>
      <div className="flex flex-row w-full h-full justify-end ">
        <img className="w-[100px] h-[100px]" src={SpeedMathSpatio} />
      </div>
    </div>
  );
}
