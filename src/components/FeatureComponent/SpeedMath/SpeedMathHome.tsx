import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

import SpeedMathForeground from "./assets/images/SM-Background.svg";
import SpeedMathBackground from "./assets/images/SM-Image.svg";
import HeaderBar from "./HeaderBar";
import GameModeSelection from "./GameModeSelection";
import { useEffect, useState } from "react";
import { startSpeedMathGame } from "../../../api/index";
import GameStartingTimer from "./GameStartingTimer";
import { isTutor } from "../../../utils/participantIdentity";
import QuestionComponent from "./QuestionComponent";
import ResultPage from "./ResultPage";
import useVideoContext from "../../../hooks/useVideoContext/useVideoContext";
import { useDispatch } from "react-redux";
import { addSpeedMathGameStartDetails } from "../../../redux/features/liveClassDetails";

export default function SpeedMath() {
  const { room } = useVideoContext();
  const dispatch = useDispatch();
  const [playMode, setPlayMode] = useState("computer");
  const [speedMathGameId, setSpeedMathGameId] = useState(0);
  const [componentNo, setComponentNo] = useState(1);
  const [startQuestionTimer, setStartQuestionTimer] = useState(false);

  const { activeTabArray, currentSelectedIndex } = useSelector(
    (state) => state.activeTabReducer
  );
  const { role_name } = useSelector(
    (state: RootState) => state.videoCallTokenData
  );
  const { liveClassId, userId, speedMathGameIdStudent, speedMathPlayMode } =
    useSelector((state: RootState) => state.liveClassDetails);

  const { extraParams } = activeTabArray[currentSelectedIndex];

  const speedMathGameLevel = Number(extraParams.speedMathLevel);

  const { remoteParticipantCount } = useSelector(
    (state: RootState) => state.liveClassDetails
  );

  useEffect(() => {
    if (speedMathGameIdStudent !== 0) {
      setSpeedMathGameId(speedMathGameIdStudent);
      setPlayMode(speedMathPlayMode);
      setComponentNo(2);
    }
  }, [speedMathGameIdStudent]);

  useEffect(() => {
    console.log("speedMathGameLevel changes in redux", speedMathGameLevel);
    setComponentNo(1);
    setStartQuestionTimer(false);
  }, [speedMathGameLevel]);

  useEffect(() => {
    return () => {
      dispatch(
        addSpeedMathGameStartDetails({
          speedMathGameId: 0,
        })
      );

      console.log("Component Unmount SpeedMath");
    };
  }, []);

  const startSpeedMath = () => {
    if (playMode === "") {
      alert("Please choose the play mode");
    } else {
      try {
        startSpeedMathGame(speedMathGameLevel + 1, liveClassId, playMode).then(
          (res) => {
            if (res.data.status) {
              setSpeedMathGameId(res.data.game_id);
              setComponentNo(2);
              sendDatatracktoStartGameForStudenent(
                res.data.game_id,
                speedMathGameLevel + 1,
                playMode
              );
            }
          }
        );
      } catch (error) {}
    }
  };

  const sendDatatracktoStartGameForStudenent = (
    speedMathGameId: number,
    speedMathGameLevel: number,
    playMode: string
  ) => {
    const [localDataTrackPublication] = [
      ...room!.localParticipant.dataTracks.values(),
    ];
    let DataTrackObj = {
      pathName: null,
      value: {
        datatrackName: "SpeedMathGameStart",
        identity: room?.localParticipant.identity,
        speedMathGameId: speedMathGameId,
        speedMathGameLevel: speedMathGameLevel,
        speedMathPlayMode: playMode,
      },
    };
    localDataTrackPublication.track.send(JSON.stringify(DataTrackObj));
  };

  const selectedPlayMode: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setPlayMode(event.target.value);
  };

  const onTimerEnd = () => {
    setComponentNo(3);
    setStartQuestionTimer(true);
  };

  const onGameTimerEnd = (
    userAnswerData: Array<[]>,
    computerScore: number,
    userScore: number,
    speedMathGameId: number
  ) => {
    console.log("Question Game Timer End");
    console.log("userAnswerData", userAnswerData);
    console.log("computerScore", computerScore);
    console.log("userScore", userScore);
    console.log("speedMathGameId", speedMathGameId);
    setComponentNo(4);
  };

  const questionTimerEndedCallback = () => {
    setStartQuestionTimer(false);
    console.log("Question Timer Ended In SpeedMath Main Page");
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
            startQuestionTimer={startQuestionTimer}
            questionTimerEndedCallback={questionTimerEndedCallback}
          />
        </div>
        <div className="h-full w-full justify-center">
          {componentNo === 1 && isTutor({ identity: String(role_name) }) ? (
            <GameModeSelection
              playMode={playMode}
              selectedPlayMode={selectedPlayMode}
              startSpeedMath={startSpeedMath}
              remoteParticipantCount={remoteParticipantCount}
            />
          ) : (
            <></>
          )}
          {componentNo === 2 && <GameStartingTimer onTimerEnd={onTimerEnd} />}
          {componentNo === 3 && (
            <QuestionComponent
              speedMathGameId={speedMathGameId}
              identity={String(role_name)}
              speedMathGameLevel={speedMathGameLevel}
              liveClassId={liveClassId}
              userId={userId}
              playMode={playMode}
              onGameTimerEnd={onGameTimerEnd}
              startQuestionTimer={startQuestionTimer}
            />
          )}
          {componentNo === 4 && <ResultPage />}
        </div>
      </div>
    </div>
  );
}
