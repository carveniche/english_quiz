import React, { useEffect, useId, useRef, useState } from "react";
interface WhiteboardProps {
  callback: Function;
}
import { Stage, Layer, Line, Image } from "react-konva";
import {
  ROUTERKEYCONST,
  WHITEBOARDSTANDARDSCREENSIZE,
} from "../../../constants";
import useVideoContext from "../../../hooks/useVideoContext/useVideoContext";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { handleLoadImage } from "./LoadImage";
const arr = [
  "https://www.begalileo.com/system/whiteboard_lessons/Grade4/G4_T5_IV_MAT0303/01_IV_MAT0303/1.jpg",
  "https://www.begalileo.com/system/whiteboard_lessons/Grade4/G4_T5_IV_MAT0303/01_IV_MAT0303/2.jpg",
  "https://www.begalileo.com/system/whiteboard_lessons/Grade4/G4_T5_IV_MAT0303/01_IV_MAT0303/3.jpg",
  "https://www.begalileo.com/system/whiteboard_lessons/Grade4/G4_T5_IV_MAT0303/01_IV_MAT0303/4.jpg",
  "https://www.begalileo.com/system/whiteboard_lessons/Grade4/G4_T5_IV_MAT0303/01_IV_MAT0303/5.jpg",
];
export default function WhiteboardImageRenerer() {
  const { room } = useVideoContext();
  const { whiteBoardData } = useSelector(
    (state: RootState) => state.ComponentLevelDataReducer
  );
  const { userId } = useSelector((state: RootState) => {
    return state.liveClassDetails;
  });
  const [currentLoadedImage, setCurrentLoadedImage] = useState("");
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
        position.x / currentLoadedImage.width,
        position.y / currentLoadedImage.height,
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
    const position = e.target.getStage().getPointerPosition();
    let temp = [
      position.x / currentLoadedImage.width,
      position.y / currentLoadedImage.height,
    ];
    // let temp = [positionMove.x, positionMove.y];
    let lastLines = coordinates.pop();
    // let lastLines = coordinates[coordinates.length - 1];
    lastLines.points = lastLines.points.concat([...temp]);
    drawLine(lastLines);
    handleDataTrack(lastLines);
  };

  const handleMouseUp = (e) => {
    drawingRef.current = false;
  };

  const handleMouseLeave = () => {
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
    // handleScale();
  }, []);
  const handleAfterImageLoaded = (image) => {
    let containerWidth = whiteBoardContainerRef.current.clientWidth;
    let containerHeight = whiteBoardContainerRef.current.clientHeight;
    let width = containerWidth;
    let height = containerHeight;
    if (image) {
      let widthHeightProportion = image.width / image.height; //width/
      let calculatedHeight = containerWidth / widthHeightProportion;
      if (calculatedHeight > containerHeight) {
        width = height * widthHeightProportion;
      } else {
        height = calculatedHeight;
      }

      image.width = width;
      image.height = height;
      setCurrentLoadedImage(image);
    }
  };
  useEffect(() => {
    handleLoadImage(
      "/pdf/whiteboard/01_III_MAT0101_page-0024.jpg",
      handleAfterImageLoaded
    );
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
        className="w-ful border overflow-hidden"
        style={{ height: "calc(100% - 20px)" }}
        ref={whiteBoardContainerRef}
      >
        {currentLoadedImage && (
          <Stage
            onMouseDown={handleMouseDown}
            onMousemove={handleMouseMove}
            onMouseup={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
            className="border-black border"
            height={currentLoadedImage.height}
            width={currentLoadedImage.width}
            style={{
              width: `${currentLoadedImage.width}px`,
              height: `${currentLoadedImage.height}px`,
              maxWidth: "fit-content",
              maxHeight: "fit-content",
              overflow: "hidden",
              margin: "auto",
              position: "relative",
            }}
          >
            {currentLoadedImage && (
              <Layer>
                <Image
                  x={0}
                  y={0}
                  image={currentLoadedImage}
                  width={currentLoadedImage.width}
                  height={currentLoadedImage.height}
                />
              </Layer>
            )}
            <Layer>
              {coordinates.map((line, i) => (
                <Line
                  key={i}
                  points={line?.points.map((item, i) =>
                    i % 2
                      ? item * currentLoadedImage.height
                      : item * currentLoadedImage.width
                  )}
                  stroke={line?.color}
                  strokeWidth={line?.stroke}
                />
              ))}
            </Layer>
          </Stage>
        )}
      </div>
    </div>
  );
}
