import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

import SpeedMathForeground from "./assets/images/SM-Background.svg";
import SpeedMathBackground from "./assets/images/SM-Image.svg";
import HeaderBar from "./HeaderBar";
import GameModeSelection from "./GameModeSelection";
import { useState } from "react";
import { startSpeedMathGame } from "../../../api/index";
import GameStartingTimer from "./GameStartingTimer";
import { isTutor } from "../../../utils/participantIdentity";
import QuestionComponent from "./QuestionComponent";

export default function SpeedMath() {
  const [playMode, setPlayMode] = useState("computer");
  const [speedMathGameId, setSpeedMathGameId] = useState(0);
  const [componentNo, setComponentNo] = useState(1);

  const { activeTabArray, currentSelectedIndex } = useSelector(
    (state) => state.activeTabReducer
  );
  const { role_name } = useSelector(
    (state: RootState) => state.videoCallTokenData
  );
  const { liveClassId, userId } = useSelector(
    (state: RootState) => state.liveClassDetails
  );

  const { extraParams } = activeTabArray[currentSelectedIndex];

  const speedMathGameLevel = Number(extraParams.speedMathLevel);

  console.log("speedMathGameLevel", speedMathGameLevel);

  const { remoteParticipantCount } = useSelector(
    (state: RootState) => state.liveClassDetails
  );

  const startSpeedMath = () => {
    if (playMode === "") {
      alert("Please choose the play mode");
    } else {
      try {
        startSpeedMathGame(
          extraParams?.speedMathLevel + 1,
          liveClassId,
          playMode
        ).then((res) => {
          if (res.data.status) {
            setSpeedMathGameId(res.data.game_id);
            setComponentNo(2);
          }
        });
      } catch (error) {}
    }
  };

  const selectedPlayMode: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setPlayMode(event.target.value);
  };

  const onTimerEnd = () => {
    setComponentNo(3);
  };

  const onGameTimerEnd = () => {
    console.log("Question Game Timer End");
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
          <HeaderBar
            playMode={playMode}
            speedMathGameLevel={speedMathGameLevel}
          />
        </div>
        <div className="h-full w-full justify-center">
          {componentNo === 1 && (
            <GameModeSelection
              playMode={playMode}
              selectedPlayMode={selectedPlayMode}
              startSpeedMath={startSpeedMath}
              remoteParticipantCount={remoteParticipantCount}
            />
          )}
          {componentNo === 2 && <GameStartingTimer onTimerEnd={onTimerEnd} />}
          {componentNo === 3 ? (
            <QuestionComponent
              speedMathGameId={speedMathGameId}
              identity={String(role_name)}
              speedMathGameLevel={speedMathGameLevel}
              liveClassId={liveClassId}
              userId={userId}
              playMode={playMode}
              onGameTimerEnd={onGameTimerEnd}
            />
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}
