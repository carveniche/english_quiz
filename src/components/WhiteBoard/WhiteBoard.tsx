import React, { useEffect, useId, useRef, useState } from "react";
interface WhiteboardProps {
  callback: Function;
}
import { Stage, Layer, Star, Text, Line, Image } from "react-konva";
import { ROUTERKEYCONST, WHITEBOARDSTANDARDSCREENSIZE } from "../../constants";
import useVideoContext from "../../hooks/useVideoContext/useVideoContext";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
const arr = [
  "https://www.begalileo.com/system/whiteboard_lessons/Grade4/G4_T5_IV_MAT0303/01_IV_MAT0303/1.jpg",
  "https://www.begalileo.com/system/whiteboard_lessons/Grade4/G4_T5_IV_MAT0303/01_IV_MAT0303/2.jpg",
  "https://www.begalileo.com/system/whiteboard_lessons/Grade4/G4_T5_IV_MAT0303/01_IV_MAT0303/3.jpg",
  "https://www.begalileo.com/system/whiteboard_lessons/Grade4/G4_T5_IV_MAT0303/01_IV_MAT0303/4.jpg",
  "https://www.begalileo.com/system/whiteboard_lessons/Grade4/G4_T5_IV_MAT0303/01_IV_MAT0303/5.jpg",
];
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
          }}
        >
          <Layer>
            <URLImage
              width={canvasCalculatedDimension.current.width}
              height={canvasCalculatedDimension.current.height}
              x={0}
              y={0}
              image={arr[1]}
              scaleRef={scaleRef}
            />
          </Layer>
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

const URLImage = (props) => {
  const [image, setImage] = useState(null);
  const imageDimension = useRef({
    width: props.width,
    height: props.height,
  });
  useEffect(() => {
    loadImage();
  }, []);
  const loadImage = () => {
    let image = new window.Image();
    image.src = props.image;
    image.onload = function () {
      console.log(props.width);
      let width = props.width;
      console.log(width);
      let imageWidthHeightRatio = image.height / image.width;
      let height = width * imageWidthHeightRatio;
      imageDimension.current = {
        width: width,
        height: height,
      };
      console.log(imageDimension);
      console.log(image.width, image.height);
      window.handleLoad = () => handleLoad(image);
    };
  };
  const handleLoad = (image) => {
    setImage(image);
  };
  return (
    <Image
      x={props.x}
      y={props.y}
      width={imageDimension.current.width}
      height={imageDimension.current.height}
      image={image}
    />
  );
};
