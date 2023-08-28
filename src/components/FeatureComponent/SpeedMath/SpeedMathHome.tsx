import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

import SpeedMathForeground from "./assets/images/SM-Background.svg";
import SpeedMathBackground from "./assets/images/SM-Image.svg";
import HeaderBar from "./HeaderBar";
import GameModeSelection from "./GameModeSelection";

export default function SpeedMath() {
  const { activeTabArray, currentSelectedIndex } = useSelector(
    (state) => state.activeTabReducer
  );
  const { role_name } = useSelector(
    (state: RootState) => state.videoCallTokenData
  );
  const { extraParams } = activeTabArray[currentSelectedIndex];

  const { remoteParticipantCount } = useSelector(
    (state: RootState) => state.liveClassDetails
  );

  const startSpeedMath = () => {};

  const selectedPlayMode = () => {};

  return (
    <div
      style={{
        background: `url(${SpeedMathBackground}) no-repeat center center
    fixed`,
        backgroundSize: "cover",
      }}
      className="flex flex-col justify-center items-center w-full h-full"
    >
      <div
        style={{
          background: `url(${SpeedMathForeground}) no-repeat center center
           fixed`,
        }}
        className="flex flex-col justify-center items-center w-full h-full"
      >
        <div className="h-1/5 w-full border border-yellow p-5">
          <HeaderBar />
        </div>
        <div className="h-full w-full ">
          <GameModeSelection
            selectedPlayMode={selectedPlayMode}
            startSpeedMath={startSpeedMath}
            remoteParticipantCount={remoteParticipantCount}
          />
        </div>
      </div>
    </div>
  );
}
