import React, { useEffect, useId, useRef, useState } from "react";
interface WhiteboardProps {
  callback: Function;
}
import { Stage, Layer, Star, Text, Line } from "react-konva";
import { ROUTERKEYCONST, WHITEBOARDSTANDARDSCREENSIZE } from "../../constants";
import useVideoContext from "../../hooks/useVideoContext/useVideoContext";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export default function WhiteBoard() {
  const { room } = useVideoContext();
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
  const canvasCalculatedDimension = useRef({
    height: WHITEBOARDSTANDARDSCREENSIZE.height,
    width: WHITEBOARDSTANDARDSCREENSIZE.width,
  });
  const whiteBoardContainerRef = useRef();
  const currentIdRef = useRef(0);
  const handleDataTrack = (points) => {
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
      scaleX: actualWidth / WHITEBOARDSTANDARDSCREENSIZE.width,
      scaleY: actualHeight / WHITEBOARDSTANDARDSCREENSIZE.height,
    };
    canvasCalculatedDimension.current = {
      height: actualHeight,
      width: actualWidth,
    };
    setScaled(true);
  };
  const drawLine = (lastLines) => {
    coordinates = coordinates.filter((item) => item.id != lastLines.id);
    coordinates.push(lastLines);
    setCoordinates([...coordinates]);
  };
  const handleMouseDown = (e) => {
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
    const positionMove = e.target.getStage().getPointerPosition();
    let temp = [
      positionMove.x / scaleRef.current.scaleX,
      positionMove.y / scaleRef.current.scaleY,
    ];
    let lastLines = coordinates.pop();
    // let lastLines = coordinates[coordinates.length - 1];
    lastLines.points = lastLines.points.concat([...temp]);
    drawLine(lastLines);
    handleDataTrack(lastLines);
  };

  const handleMouseUp = (e) => {
    drawingRef.current = false;
  };

  useEffect(() => {
    if (whiteBoardData?.count) {
      if (whiteBoardData?.whiteBoardsPoints) {
        //1 // 2
        let temp = JSON.stringify(whiteBoardData?.whiteBoardsPoints);
        drawLine(JSON.parse(temp) || {});
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
        }}
      >
        Clear
      </button>
      <div
        className="w-full  border-red-500 border overflow-hidden"
        style={{ height: "calc(100% - 20px)" }}
        ref={whiteBoardContainerRef}
      >
        <Stage
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
          className="border-black border"
          scale={{ x: scaleRef.current.scaleX, y: scaleRef.current.scaleY }}
          height={WHITEBOARDSTANDARDSCREENSIZE.height * scaleRef.current.scaleY}
          width={WHITEBOARDSTANDARDSCREENSIZE.width * scaleRef.current.scaleX}
          style={{
            width: "fit-content",
            height: "fit-content",
            maxWidth: "fit-content",
            maxHeight: "fit-content",
            overflow: "hidden",
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
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
