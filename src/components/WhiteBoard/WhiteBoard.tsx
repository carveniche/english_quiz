import React, { useEffect, useId, useRef, useState } from "react";
interface WhiteboardProps {
  callback: Function;
}
import { Stage, Layer, Star, Text, Line, Image } from "react-konva";
import { ROUTERKEYCONST, WHITEBOARDSTANDARDSCREENSIZE } from "../../constants";
import useVideoContext from "../../hooks/useVideoContext/useVideoContext";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import UserCursor from "./UserCursor";
const arr = [
  "https://www.begalileo.com/system/whiteboard_lessons/Grade4/G4_T5_IV_MAT0303/01_IV_MAT0303/1.jpg",
  "https://www.begalileo.com/system/whiteboard_lessons/Grade4/G4_T5_IV_MAT0303/01_IV_MAT0303/2.jpg",
  "https://www.begalileo.com/system/whiteboard_lessons/Grade4/G4_T5_IV_MAT0303/01_IV_MAT0303/3.jpg",
  "https://www.begalileo.com/system/whiteboard_lessons/Grade4/G4_T5_IV_MAT0303/01_IV_MAT0303/4.jpg",
  "https://www.begalileo.com/system/whiteboard_lessons/Grade4/G4_T5_IV_MAT0303/01_IV_MAT0303/5.jpg",
];
export default function WhiteBoard() {
  const { room } = useVideoContext();
  const localParticipant = room?.localParticipant;
  const { whiteBoardData } = useSelector(
    (state: RootState) => state.ComponentLevelDataReducer
  );
  const { userId } = useSelector((state: RootState) => {
    return state.liveClassDetails;
  });
  const scaleRef = useRef({
    scaleX: 1,
    scaleY: 1,
  });
  const [isScaled, setScaled] = useState(false);
  const remoteArrayRef = useRef([]);
  const [remoteArray, setRemoteArray] = useState([]);
  const canvasCalculatedDimension = useRef({
    height: WHITEBOARDSTANDARDSCREENSIZE.height,
    width: WHITEBOARDSTANDARDSCREENSIZE.width,
  });
  const whiteBoardContainerRef = useRef();
  const currentIdRef = useRef(0);
  const constantDelay = 10;
  const timerRef = useRef(0);
  const handleDataTrack = (points) => {
    if (Date.now() - timerRef.current <= constantDelay) return;
    timerRef.current = Date.now();

    const [localDataTrackPublication] = [
      ...room!.localParticipant.dataTracks.values(),
    ];
    let DataTrackObj = {
      pathName: ROUTERKEYCONST.whiteboard.path,
      key: ROUTERKEYCONST.whiteboard.key,
      value: {
        datatrackName: ROUTERKEYCONST.whiteboard.key,
        whiteBoardPoints: points,
      },
    };

    localDataTrackPublication.track.send(JSON.stringify(DataTrackObj));
  };
  let [coordinates, setCoordinates] = useState([]);
  const drawingRef = useRef(false);
  const handleScale = () => {
    let containerWidth = whiteBoardContainerRef.current.clientWidth;
    let containerHeight = whiteBoardContainerRef.current.clientHeight;
    let actualWidth = containerWidth;
    // calculating ratio width by height
    let actualHeight =
      (containerWidth * WHITEBOARDSTANDARDSCREENSIZE.height) /
      WHITEBOARDSTANDARDSCREENSIZE.width;
    if (actualHeight > containerHeight) {
      actualWidth =
        (containerHeight * WHITEBOARDSTANDARDSCREENSIZE.width) /
        WHITEBOARDSTANDARDSCREENSIZE.height;
      actualHeight = containerHeight;
    }
    actualHeight = containerHeight;
    scaleRef.current = {
      scaleX: containerWidth / WHITEBOARDSTANDARDSCREENSIZE.width,
      scaleY: containerHeight / WHITEBOARDSTANDARDSCREENSIZE.height,
    };
    canvasCalculatedDimension.current = {
      height: containerHeight,
      width: containerWidth,
    };
    setScaled(true);
  };
  const drawLine = (lastLines) => {
    coordinates = coordinates.filter((item) => item.id != lastLines.id);
    coordinates.push(lastLines);
    setCoordinates([...coordinates]);
  };
  let ref = useRef();
  const remoteDrawLine = (lastLines) => {
    let findParticipant = remoteArray.filter(
      ({ identity }) => identity === lastLines.identity
    );
    findParticipant = findParticipant[0] || {};
    findParticipant.identity = lastLines.identity;
    findParticipant.cursorPoints = lastLines?.cursorPoints || [];
    findParticipant.isDrawing = lastLines.isDrawing;
    let coordinates = findParticipant?.coordinates || [];
    coordinates = coordinates.filter(
      (item) => item.id != lastLines?.coordinates?.id
    );
    if (lastLines?.coordinates) coordinates.push(lastLines?.coordinates);
    findParticipant.coordinates = coordinates;
    let restParticipant = remoteArray.filter(
      ({ identity }) => identity != lastLines.identity
    );

    restParticipant.push(findParticipant);
    remoteArrayRef.current = restParticipant;
    if (true) setRemoteArray([...remoteArrayRef.current]);
    lastLines.identity = userId;
    lastLines.isDrawing = true;
  };
  const handleMouseDown = (e) => {
    clearInterval(ref.current);
    drawingRef.current = true;

    const position = e.target.getStage().getPointerPosition();
    const penStructure = {
      id: `${userId}_${currentIdRef.current}`,
      stroke: 5,
      color: "black",
      points: [
        position.x / scaleRef.current.scaleX,
        position.y / scaleRef.current.scaleY,
      ],
    };

    currentIdRef.current = currentIdRef.current + 1;
    coordinates.push(penStructure);
    setCoordinates([...coordinates]);
  };

  const handleMouseMove = (e) => {
    if (!drawingRef.current) {
      return;
    }
    let positionMove = e.target.getStage().getPointerPosition();
    let temp = [
      positionMove.x / scaleRef.current.scaleX,
      positionMove.y / scaleRef.current.scaleY,
    ];
    let lastLines = coordinates.pop();
    // let lastLines = coordinates[coordinates.length - 1];
    lastLines.points = lastLines.points.concat([...temp]);
    drawLine(lastLines);
    let coordinates2 = {
      coordinates: lastLines,
    };
    coordinates2.cursorPoints = [...temp];
    coordinates2.identity = userId;
    coordinates2.isDrawing = true;
    handleDataTrack(coordinates2);
  };

  const handleMouseUp = (e) => {
    drawingRef.current = false;
    handleDataTrack({
      identity: userId,
      isDrawing: false,
    });
  };

  const handleMouseLeave = () => {
    drawingRef.current = false;
    handleDataTrack({
      identity: userId,
      isDrawing: false,
    });
  };

  useEffect(() => {
    if (whiteBoardData?.count) {
      if (whiteBoardData?.whiteBoardsPoints) {
        //1 // 2
        let temp = JSON.stringify(whiteBoardData?.whiteBoardsPoints);
        remoteDrawLine(JSON.parse(temp) || {});
      }
    }
  }, [whiteBoardData?.count]);
  useEffect(() => {
    handleScale();
  }, []);
  return (
    <div className="w-full h-full p-1">
      <button
        onClick={() => {
          setCoordinates([]);
          setRemoteArray([]);
        }}
      >
        Clear
      </button>
      <div
        className="w-full  border-red-500 border overflow-hidden"
        style={{ height: "calc(100% - 20px)", position: "relative" }}
        ref={whiteBoardContainerRef}
      >
        <UserCursor remtoeArray={remoteArray} />
        <Stage
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
          className="border-black border"
          scale={{ x: scaleRef.current.scaleX, y: scaleRef.current.scaleY }}
          height={canvasCalculatedDimension.current.height}
          width={canvasCalculatedDimension.current.width}
          style={{
            width: "fit-content",
            height: "fit-content",
            maxWidth: "fit-content",
            maxHeight: "fit-content",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Layer>
            {coordinates.map((line, i) => (
              <Line
                key={i}
                points={line?.points}
                stroke={line?.color}
                strokeWidth={line?.stroke}
              />
            ))}
            {remoteArray?.map(({ coordinates }, key) =>
              coordinates?.map((line) => (
                <Line
                  points={line?.points || []}
                  stroke={line.color}
                  strokeWidth={line?.stroke}
                ></Line>
              ))
            )}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
