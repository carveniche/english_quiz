import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

import SpeedMathForeground from "./assets/images/SM-Background.svg";
import SpeedMathBackground from "./assets/images/SM-Image.svg";
import HeaderBar from "./HeaderBar";
import GameModeSelection from "./GameModeSelection";
import { useEffect, useState } from "react";
import { startSpeedMathGame } from "../../../api/index";
import GameStartingTimer from "./GameStartingTimer";
import { isTutor, isTutorTechBoth } from "../../../utils/participantIdentity";
import QuestionComponent from "./QuestionComponent";
import ResultPage from "./ResultPage";
import useVideoContext from "../../../hooks/useVideoContext/useVideoContext";
import { useDispatch } from "react-redux";
import {
  addSpeedMathGameStartDetails,
  addSpeedMathScoreOfAllParticipant,
} from "../../../redux/features/liveClassDetails";
import GameInProgressTeacher from "./GameInProgressTeacher";

export default function SpeedMath() {
  const { room } = useVideoContext();
  const dispatch = useDispatch();
  const [playMode, setPlayMode] = useState("computer");
  const [speedMathGameId, setSpeedMathGameId] = useState(0);
  const [componentNo, setComponentNo] = useState(1);
  const [startQuestionTimer, setStartQuestionTimer] = useState(false);
  const [userAnswerData, setUserAnswerData] = useState([]);
  const [gameComputerScore, setGameComputerScore] = useState(0);
  const [gameUserScore, setGameUserScore] = useState(0);
  const [showSpeedMathSummaryBoard, setShowSpeedMathSummaryBoard] =
    useState(false);
  const [speedMathScoreBoard, setFinalSpeedMathScoreBoard] = useState([]);

  const { activeTabArray, currentSelectedIndex } = useSelector(
    (state) => state.activeTabReducer
  );
  const { role_name } = useSelector(
    (state: RootState) => state.videoCallTokenData
  );
  const {
    liveClassId,
    userId,
    speedMathGameIdStudent,
    speedMathPlayMode,
    speedMathScoreofAllParticipant,
  } = useSelector((state: RootState) => state.liveClassDetails);

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
    console.log("SpeedMathGameLevel", speedMathGameLevel);
    setComponentNo(1);
    setStartQuestionTimer(false);
    setFinalSpeedMathScoreBoard([]);
    dispatch(
      addSpeedMathScoreOfAllParticipant({
        resetScore: true,
      })
    );
  }, [speedMathGameLevel]);

  useEffect(() => {
    return () => {
      dispatch(
        addSpeedMathGameStartDetails({
          speedMathGameId: 0,
        })
      );
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
    setUserAnswerData(userAnswerData);
    setGameComputerScore(computerScore);
    setSpeedMathGameId(speedMathGameId);
    setGameUserScore(userScore);
    setComponentNo(4);
    setShowSpeedMathSummaryBoard(true);
  };

  const onGameInProgressTimerEnd = (computerScore: number) => {
    console.log("computerScore", computerScore);
    setGameComputerScore(computerScore);
    setShowSpeedMathSummaryBoard(true);
    setComponentNo(4);
  };

  const questionTimerEndedCallback = () => {
    setStartQuestionTimer(false);
  };

  const questionComponent = () => {
    if (isTutor({ identity: String(role_name) })) {
      if (playMode === "teacher") {
        return (
          <QuestionComponent
            room={room}
            speedMathGameId={speedMathGameId}
            identity={String(role_name)}
            speedMathGameLevel={speedMathGameLevel}
            liveClassId={liveClassId}
            userId={userId}
            playMode={playMode}
            onGameTimerEnd={onGameTimerEnd}
            startQuestionTimer={startQuestionTimer}
            speedMathScoreofAllParticipant={speedMathScoreofAllParticipant}
          />
        );
      } else {
        return (
          <GameInProgressTeacher
            playMode={playMode}
            speedMathScoreofAllParticipant={speedMathScoreofAllParticipant}
            startQuestionTimer={startQuestionTimer}
            onGameInProgressTimerEnd={onGameInProgressTimerEnd}
          />
        );
      }
    } else {
      return (
        <QuestionComponent
          room={room}
          speedMathGameId={speedMathGameId}
          identity={String(role_name)}
          speedMathGameLevel={speedMathGameLevel}
          liveClassId={liveClassId}
          userId={userId}
          playMode={playMode}
          onGameTimerEnd={onGameTimerEnd}
          startQuestionTimer={startQuestionTimer}
          speedMathScoreofAllParticipant={speedMathScoreofAllParticipant}
        />
      );
    }
  };

  const getFinalResult = (score: []) => {
    setFinalSpeedMathScoreBoard(score);
    setShowSpeedMathSummaryBoard(false);
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
            showSpeedMathSummaryBoard={showSpeedMathSummaryBoard}
            speedMathScoreBoard={speedMathScoreBoard}
          />
        </div>
        <div className="h-full w-full justify-center">
          {componentNo === 1 &&
          isTutorTechBoth({ identity: String(role_name) }) ? (
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
          {componentNo === 3 && questionComponent()}
          {componentNo === 4 && (
            <ResultPage
              userAnswerData={userAnswerData}
              computerScore={gameComputerScore}
              identity={String(role_name)}
              liveClassId={liveClassId}
              playerId={userId}
              gameId={speedMathGameId}
              playMode={playMode}
              getFinalResult={getFinalResult}
            />
          )}
        </div>
      </div>
    </div>
  );
}
