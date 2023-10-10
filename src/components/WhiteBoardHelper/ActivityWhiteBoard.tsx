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
import WhiteboardToolbar from "./WhiteBoardToolbar/WhiteboardToolbar";
const TEXTAREAWIDTH = 250;
const TEXTAREAHEIGHT = 150;
const eraserCursor =
  "url('WhiteBoardToolbarAssets/Toolbar/Eraser.svg') 2 30, auto";
const penCursor = "url(/static/cursor.png) 1 16, auto";
export default function ActivityWhiteBoard({
  whiteBoardData,
  handleDataTrack,
  count = 0,
  handleUpdateLocalAndRemoteData,
  currentIncomingLines,
  images,
  whiteBoardRef,
  isWritingDisabled,
}: {
  images: [];
  whiteBoardData: object;
  handleDataTrack: Function | undefined;
  count: number | undefined;
  handleUpdateLocalAndRemoteData: Function | undefined;
  currentIncomingLines: object;
  isWritingDisabled: boolean | undefined | null;
}) {
  const { room } = useVideoContext();
  const localParticipant = room?.localParticipant;
  const { userId } = useSelector((state: RootState) => {
    return state.liveClassDetails;
  });
  const scaleRef = useRef({
    scaleX: 1,
    scaleY: 1,
  });
  const [isScaled, setScaled] = useState(false);
  const [selectedPen, setSelectedPen] = useState("FreeDrawing");
  const [eraserSelect, setEraserSelect] = useState(false);
  const [cursor, setCursor] = useState(penCursor);
  const [textInput, setTextInput] = useState({
    showInputBox: false,
    x: 0,
    y: 0,
    value: "",
  });
  const [colorCode, setColorCode] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(1);
  const [closeToolbarPopup, setCloseToolbarPopup] = useState(false);
  const remoteArrayRef = useRef(
    JSON.parse(JSON.stringify(whiteBoardData)) || []
  );
  const [_remoteState, setRemoteState] = useState(false);
  const canvasCalculatedDimension = useRef({
    height: WHITEBOARDSTANDARDSCREENSIZE.height,
    width: WHITEBOARDSTANDARDSCREENSIZE.width,
  });
  const whiteBoardContainerRef = useRef();
  const currentIdRef = useRef(0);
  const constantDelay = 10;
  const timerRef = useRef(0);
  const [_localState, setLocalState] = useState(false);
  let coordinatesRef = useRef([]);
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
    coordinatesRef.current = coordinatesRef.current.filter(
      (item) => item.id != lastLines.id
    );
    coordinatesRef.current.push(lastLines);
    setLocalState((prev) => !prev);
  };
  let ref = useRef();
  const remoteDrawLine = (lastLines) => {
    let findParticipant = remoteArrayRef.current.filter(
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
    let restParticipant = remoteArrayRef.current.filter(
      ({ identity }) => identity != lastLines.identity
    );

    restParticipant.push(findParticipant);
    remoteArrayRef.current = restParticipant;
    if (true) setRemoteState((prev) => !prev);
    lastLines.identity = userId;
    lastLines.isDrawing = true;
  };

  const drawStraightLine = (e) => {
    let positionMove = e.target.getStage().getPointerPosition();
    let temp = [
      positionMove.x / scaleRef.current.scaleX,
      positionMove.y / scaleRef.current.scaleY,
    ];

    let lastLines = coordinatesRef.current.pop();

    lastLines.points = [lastLines.points[0], lastLines.points[1], ...temp];
    drawLine(lastLines);
    let coordinates2 = {
      coordinates: lastLines,
    };
    coordinates2.cursorPoints = [...temp];
    coordinates2.isDrawing = true;
    typeof handleDataTrack === "function" && handleDataTrack(coordinates2);
  };
  const freeDrawing = (e) => {
    let positionMove = e.target.getStage().getPointerPosition();
    let temp = [
      positionMove.x / scaleRef.current.scaleX,
      positionMove.y / scaleRef.current.scaleY,
    ];
    let lastLines = coordinatesRef.current.pop();
    // let lastLines = coordinates[coordinates.length - 1];
    lastLines.points = lastLines.points.concat([...temp]);
    drawLine(lastLines);
    let coordinates2 = {
      coordinates: lastLines,
    };
    coordinates2.cursorPoints = [...temp];
    coordinates2.isDrawing = true;
    typeof handleDataTrack === "function" && handleDataTrack(coordinates2);
  };
  const getTextBoxPosition = (e) => {
    const position = e.target.getStage().getPointerPosition();
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
    if (isWritingDisabled) return;
    setCloseToolbarPopup(true);
    if (selectedPen === "Text") {
      getTextBoxPosition(e);
      return;
    }
    clearInterval(ref.current);
    drawingRef.current = true;

    const position = e.target.getStage().getPointerPosition();
    const penStructure = {
      id: `${userId}_${currentIdRef.current}`,
      stroke: strokeWidth,
      color: colorCode,
      eraser: eraserSelect,
      points: [
        position.x / scaleRef.current.scaleX,
        position.y / scaleRef.current.scaleY,
      ],
    };

    currentIdRef.current = currentIdRef.current + 1;
    coordinatesRef.current.push(penStructure);
    setLocalState((prev) => !prev);
  };
  const handleMouseMove = (e) => {
    if (isWritingDisabled) return;
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
    if (isWritingDisabled) return;
    setCloseToolbarPopup(false);
    drawingRef.current = false;
    typeof handleDataTrack === "function" &&
      handleDataTrack({
        identity: userId,
        isDrawing: false,
      });
  };

  const handleMouseLeave = () => {
    if (isWritingDisabled) return;
    setCloseToolbarPopup(false);
    drawingRef.current = false;
    typeof handleDataTrack === "function" &&
      handleDataTrack({
        identity: userId,
        isDrawing: false,
      });
  };
  useEffect(() => {
    if (count) {
      if (currentIncomingLines) {
        //1 // 2
        let temp = JSON.stringify(currentIncomingLines);
        remoteDrawLine(JSON.parse(temp) || {});
      }
    }
    return () => {
      typeof handleUpdateLocalAndRemoteData === "function" &&
        handleUpdateLocalAndRemoteData(
          JSON.parse(JSON.stringify(coordinatesRef.current)),
          JSON.parse(JSON.stringify(remoteArrayRef.current))
        );
    };
  }, [count]);
  useEffect(() => {
    handleScale();
  }, []);

  const handleToolBarSelect = (json: {
    id: number;
    value: any;
    key: string;
  }) => {
    switch (json.id) {
      case 1:
        setColorCode(json.value);
        setCursor(penCursor);
        setEraserSelect(false);
        break;
      case 2:
        setStrokeWidth(json.value);
        setSelectedPen(json.key);
        setCursor(penCursor);
        setEraserSelect(false);
        break;
      case 3:
        coordinatesRef.current = [];
        remoteArrayRef.current = [];
        setLocalState((prev) => !prev);
        setCursor(penCursor);
        setEraserSelect(false);
        break;
      case 4:
        setSelectedPen(json.key);
        setCursor(penCursor);
        setEraserSelect(false);
        break;
      case 5:
        setSelectedPen(json.key);
        setCursor(penCursor);
        setEraserSelect(false);
        break;
      case 6:
        setEraserSelect(true);
        setCursor(eraserCursor);
        break;
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
      coordinatesRef.current.push(data);
      setLocalState((prev) => !prev);
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
      typeof handleDataTrack === "function" && handleDataTrack(coordinates2);
      currentIdRef.current = currentIdRef.current + 1;
    }
  };
  return (
    <div className="w-full h-full p-1">
      {!isWritingDisabled && (
        <WhiteboardToolbar
          handleClick={handleToolBarSelect}
          closeToolbarPopup={closeToolbarPopup}
        />
      )}
      <div
        className="w-full"
        style={{
          height: "calc(100% - 20px)",
          position: "relative",
        }}
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
        <UserCursor
          remtoeArray={remoteArrayRef.current}
          scaleRef={scaleRef}
          cursor={cursor}
        />
        <Stage
          key={scaleRef.current.scaleX}
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
            position: "relative",
            //url(/static/cursor.png) 1 16, auto
            cursor: cursor,
            pointerEvents: isWritingDisabled ? "none" : "initial",
            backgroundColor: "transparent",
          }}
          scale={{ x: scaleRef.current.scaleX, y: scaleRef.current.scaleY }}
          ref={whiteBoardRef ? whiteBoardRef : null}
        >
          <Layer>
            {images.map((src, index) => {
              return (
                <UrlImage
                  key={index}
                  src={src}
                  width={150}
                  height={150}
                  x={index ? index * 25 + 150 : 0}
                  y={0}
                />
              );
            })}
          </Layer>
          <Layer>
            {coordinatesRef.current?.map((line, i) =>
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
                  globalCompositeOperation={
                    line.eraser ? "destination-out" : "source-over"
                  }
                />
              )
            )}
            {remoteArrayRef.current?.map(({ coordinates }, key) =>
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
                    globalCompositeOperation={
                      line.eraser ? "destination-out" : "source-over"
                    }
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
  const { width, height, x, src, y } = props;
  const [image, setImage] = useState("");
  const handleLoad = () => {
    let image = new window.Image();
    image.src = src;
    image.crossOrigin = "annonyms";
    image.onload = function () {
      setImage(image);
    };
  };
  useEffect(() => {
    handleLoad();
  }, [width, height]);
  return <Image x={x} y={y} width={width} height={height} image={image} />;
};
