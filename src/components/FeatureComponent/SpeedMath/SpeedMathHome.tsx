import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

import SpeedMathForeground from "./assets/images/SM-Background.svg";
import SpeedMathBackground from "./assets/images/SM-Image.svg";
import HeaderBar from "./HeaderBar";
import GameModeSelection from "./GameModeSelection";
import { useState } from "react";

export default function SpeedMath() {
  const [playMode, setPlayMode] = useState("computer");
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

  const selectedPlayMode = (event) => {
    setPlayMode(event.target.value);

    console.log("event", event.target.value);
  };

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
        <div className="h-1/5 w-full p-5">
          <HeaderBar />
        </div>
        <div className="h-full w-full justify-center ">
          <GameModeSelection
            playMode={playMode}
            selectedPlayMode={selectedPlayMode}
            startSpeedMath={startSpeedMath}
            remoteParticipantCount={remoteParticipantCount}
          />
        </div>
      </div>
    </div>
  );
}
