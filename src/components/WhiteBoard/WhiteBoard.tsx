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
import WhiteboardToolbar from "./WhiteboardToolbar";
const TEXTAREAWIDTH = 250;
const TEXTAREAHEIGHT = 150;
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
  const [selectedPen, setSelectedPen] = useState("FreeDrawing");
  const [textInput, setTextInput] = useState({
    showInputBox: false,
    x: 0,
    y: 0,
    value: "",
  });
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

  const drawStraightLine = (e) => {
    let positionMove = e.target.getStage().getPointerPosition();
    let temp = [
      positionMove.x / scaleRef.current.scaleX,
      positionMove.y / scaleRef.current.scaleY,
    ];

    let lastLines = coordinates.pop();
    // let lastLines = coordinates[coordinates.length - 1];
    lastLines.points = [lastLines.points[0], lastLines.points[1], ...temp];
    drawLine(lastLines);
    let coordinates2 = {
      coordinates: lastLines,
    };
    coordinates2.cursorPoints = [...temp];
    coordinates2.identity = userId;
    coordinates2.isDrawing = true;
    handleDataTrack(coordinates2);
  };
  const freeDrawing = (e) => {
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
  const getTextBoxPosition = (e) => {
    const position = e.target.getStage().getPointerPosition();
    console.log(position);
    let x = position.x + TEXTAREAWIDTH;
    let y = position.y + TEXTAREAHEIGHT;
    if (x > canvasCalculatedDimension.current.width) {
      x = position.x - TEXTAREAWIDTH;
    } else {
      x = position.x;
    }
    if (y > canvasCalculatedDimension.current.height) {
      y = position.y - TEXTAREAHEIGHT;
    } else {
      y = position.y;
    }
    let inputText = {
      x: x,
      y: y,
      showInputBox: true,
      value: "",
    };
    setTextInput({ ...inputText });
  };
  const handleMouseDown = (e) => {
    if (selectedPen === "Text") {
      getTextBoxPosition(e);
      return;
    }
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
    if (selectedPen === "FreeDrawing") {
      freeDrawing(e);
    } else if (selectedPen === "Line") {
      drawStraightLine(e);
    }
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

  const handleToolBarSelect = (id: number) => {
    switch (id) {
      case 1:
        setSelectedPen("Line");
        break;
      case 2:
        setSelectedPen("FreeDrawing");
        break;
      case 3:
        setCoordinates([]);
        setRemoteArray([]);
        break;
      case 4:
        setSelectedPen("Text");
    }
  };
  const handleTextArea = (e) => {
    let { value } = e.target;
    textInput.value = value;
    setTextInput({ ...textInput });
  };
  const handleKeyDown = (e) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      let data = {
        points: [textInput.x, textInput.y],
        value: textInput.value,
        type: "text",
        id: `${userId}_${currentIdRef.current}`,
      };
      coordinates.push(data);
      setCoordinates([...coordinates]);
      setTextInput({
        x: 0,
        y: 0,
        showInputBox: false,
        value: "",
      });
      let coordinates2 = {
        coordinates: data,
      };
      coordinates2.cursorPoints = [];
      coordinates2.identity = userId;
      coordinates2.isDrawing = false;
      handleDataTrack(coordinates2);
      currentIdRef.current = currentIdRef.current + 1;
    }
  };
  return (
    <div className="w-full h-full p-1">
      <WhiteboardToolbar handleClick={handleToolBarSelect} />
      <div
        className="w-full  border-red-500 border overflow-hidden"
        style={{ height: "calc(100% - 20px)", position: "relative" }}
        ref={whiteBoardContainerRef}
      >
        <>
          {textInput?.showInputBox && (
            <textarea
              className={`absolute z-10 border-black border`}
              style={{
                top: textInput.y,
                left: textInput.x,
                width: TEXTAREAWIDTH,
                height: TEXTAREAHEIGHT,
              }}
              value={textInput.value}
              onChange={handleTextArea}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          )}
        </>
        <UserCursor remtoeArray={remoteArray} scaleRef={scaleRef} />
        <Stage
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
          className="border-black border"
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
          scale={{ x: scaleRef.current.scaleX, y: scaleRef.current.scaleY }}
        >
          {isScaled && false && (
            <Layer>
              <UrlImage
                x={0}
                width={canvasCalculatedDimension.current.width}
                height={canvasCalculatedDimension.current.height}
                src={"/static/whiteboard/GRAPH_PAPER.png"}
                scaleRef={scaleRef}
              />
            </Layer>
          )}
          <Layer>
            {coordinates.map((line, i) =>
              line?.type === "text" ? (
                <Text
                  text={line?.value}
                  x={line?.points[0]}
                  y={line?.points[1]}
                  fontSize={30}
                />
              ) : (
                <Line
                  key={i}
                  points={line?.points}
                  stroke={line?.color}
                  strokeWidth={line?.stroke}
                />
              )
            )}
            {remoteArray?.map(({ coordinates }, key) =>
              coordinates?.map((line) =>
                line?.type === "text" ? (
                  <Text
                    text={line?.value}
                    x={line?.points[0]}
                    y={line?.points[1]}
                    fontSize={30}
                  />
                ) : (
                  <Line
                    points={line?.points || []}
                    stroke={line.color}
                    strokeWidth={line?.stroke}
                  ></Line>
                )
              )
            )}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}

const UrlImage = (props: {
  width: number;
  height: number;
  x: number;
  src: string;
}) => {
  const { width, height, x, src, scaleRef } = props;
  const [image, setImage] = useState("");
  const handleLoad = () => {
    let image = new window.Image();
    image.src = src;
    image.onload = function () {
      setImage(image);
    };
  };
  useEffect(() => {
    handleLoad();
  }, [width, height]);
  return (
    <Image
      x={x}
      width={width / scaleRef.current.scaleX}
      height={height / scaleRef.current.scaleY}
      image={image}
    />
  );
};
