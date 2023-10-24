import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Star, Text, Line, Image } from "react-konva";
import { ROUTERKEYCONST, WHITEBOARDSTANDARDSCREENSIZE } from "../../constants";
import useVideoContext from "../../hooks/useVideoContext/useVideoContext";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import UserCursor from "./UserCursor";
import WhiteboardToolbar from "./WhiteBoardToolbar/WhiteboardToolbar";
import { changeWhiteBoardToolBarValue } from "../../redux/features/ComponentLevelDataReducer";
import { useDispatch } from "react-redux";
const TEXTAREAWIDTH = 250;
const TEXTAREAHEIGHT = 150;
const eraserCursor = "/WhiteBoardToolbarAssets/Toolbar/Eraser.svg";
const penCursor = "/static/cursor.png";
const cursorUrl = "url({}) 1 16, auto";
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
  const dispatch = useDispatch();
  const { userId } = useSelector((state: RootState) => {
    return state.liveClassDetails;
  });
  const scaleRef = useRef({
    scaleX: 1,
    scaleY: 1,
  });
  const {
    colorCode,
    strokeWidth,
    cursor,
    selectedPen,
    eraserSelect,
    eraserSize,
  } = useSelector(
    (state: RootState) =>
      state.ComponentLevelDataReducer.allWhiteBoardRelatedData.whiteboardToolbar
  );
  const [isScaled, setScaled] = useState(false);
  const [textInput, setTextInput] = useState({
    showInputBox: false,
    x: 0,
    y: 0,
    value: "",
  });
  const [closeToolbarPopup, setCloseToolbarPopup] = useState(false);
  const remoteArrayRef = useRef([]);
  const [_remoteState, setRemoteState] = useState(false);
  const canvasCalculatedDimension = useRef({
    height: WHITEBOARDSTANDARDSCREENSIZE.height,
    width: WHITEBOARDSTANDARDSCREENSIZE.width,
  });
  const currentTimeStamp = useRef(Date.now());
  const DELAY = 200;
  const whiteBoardContainerRef = useRef();
  const currentIdRef = useRef(0);
  const [_localState, setLocalState] = useState(false);
  let coordinatesRef = useRef([]);
  const drawingRef = useRef(false);
  const allCoordinateRef = useRef(
    JSON.parse(JSON.stringify(whiteBoardData)) || []
  );
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
  const throttleFn = (
    callback: Function,
    delay: number,
    prevTimeStampRef: { current: number }
  ) => {
    callback();
    return;
    if (Date.now() - prevTimeStampRef.current >= delay) {
      callback();
      prevTimeStampRef.current = Date.now();
    }
  };
  const drawLine = (lastLines: { id: string }) => {
    allCoordinateRef.current = allCoordinateRef.current.filter(
      (item: { id: string }) => item.id != lastLines.id
    );
    allCoordinateRef.current.push(lastLines);
    setLocalState((prev) => !prev);
  };
  let ref = useRef();
  const remoteDrawLine = (lastLines) => {
    let findParticipant = remoteArrayRef.current.filter(
      ({ identity }) => identity === lastLines.identity
    );
    findParticipant = findParticipant[0] || {};
    findParticipant.identity = lastLines.identity;
    findParticipant.userName = lastLines.userName;
    findParticipant.cursorPoints = lastLines?.cursorPoints || [];
    findParticipant.isDrawing = lastLines.isDrawing;
    delete findParticipant.coordinates;
    let restParticipant = remoteArrayRef.current.filter(
      ({ identity }) => identity != lastLines.identity
    );
    restParticipant.push(findParticipant);

    remoteArrayRef.current = restParticipant;
    if (true) setRemoteState((prev) => !prev);
  };

  const drawStraightLine = (e) => {
    let positionMove = e.target.getStage().getPointerPosition();
    let temp = [
      positionMove.x / scaleRef.current.scaleX,
      positionMove.y / scaleRef.current.scaleY,
    ];

    let lastLines = coordinatesRef.current[0];
    if (!lastLines) return;
    lastLines.points = [lastLines.points[0], lastLines.points[1], ...temp];
    drawLine(lastLines);
    let coordinates2 = {
      coordinates: lastLines,
    };
    coordinates2.cursorPoints = [...temp];
    coordinates2.isDrawing = true;

    typeof handleDataTrack === "function" &&
      throttleFn(() => handleDataTrack(coordinates2), DELAY, currentTimeStamp);
  };
  const freeDrawing = (e) => {
    let positionMove = e.target.getStage().getPointerPosition();
    let temp = [
      positionMove.x / scaleRef.current.scaleX,
      positionMove.y / scaleRef.current.scaleY,
    ];

    let lastLines = coordinatesRef.current[0];
    if (!lastLines) return;
    // let lastLines = coordinates[coordinates.length - 1];
    lastLines.points = lastLines.points.concat([...temp]);
    drawLine(lastLines);
    let coordinates2 = {
      coordinates: lastLines,
    };
    coordinates2.cursorPoints = [...temp];
    coordinates2.isDrawing = true;
    typeof handleDataTrack === "function" &&
      throttleFn(() => handleDataTrack(coordinates2), DELAY, currentTimeStamp);
  };
  const getTextBoxPosition = (e) => {
    const position = e.target.getStage().getPointerPosition();
    let inputText = {
      x: position.x,
      y: position.y,
      showInputBox: true,
      value: "",
    };
    setTextInput({ ...inputText });
  };
  const handleMouseDown = (e) => {
    if (cursor === "crosshair" && selectedPen !== "Text") {
      return;
    }
    setCloseToolbarPopup(true);
    if (selectedPen === "Text") {
      getTextBoxPosition(e);
      return;
    }
    clearInterval(ref.current);
    drawingRef.current = true;

    const position = e.target.getStage().getPointerPosition();
    const penStructure = {
      id: `${userId}_${Date.now()}`,
      stroke: eraserSelect ? eraserSize : strokeWidth,
      color: colorCode,
      eraser: eraserSelect,
      points: [
        position.x / scaleRef.current.scaleX,
        position.y / scaleRef.current.scaleY,
      ],
    };
    coordinatesRef.current = [];
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
  const handleClearAll = () => {
    coordinatesRef.current = [];
    remoteArrayRef.current = [];
    allCoordinateRef.current = [];
    setLocalState((prev) => !prev);
    dispatch(changeWhiteBoardToolBarValue({ key: "cursor", value: penCursor }));
    dispatch(
      changeWhiteBoardToolBarValue({ key: "eraserSelect", value: false })
    );
  };
  useEffect(() => {
    if (count) {
      if (currentIncomingLines) {
        let temp = JSON.parse(JSON.stringify(currentIncomingLines));
        if (currentIncomingLines?.type === "clearAll") {
          handleClearAll();
        }
        remoteDrawLine(temp || {});
        if ((temp?.isDrawing || temp?.type === "text") && temp?.coordinates)
          drawLine(temp?.coordinates || {});
      }
    }
  }, [count]);
  useEffect(() => {
    return () => {
      typeof handleUpdateLocalAndRemoteData === "function" &&
        handleUpdateLocalAndRemoteData(
          JSON.parse(JSON.stringify(allCoordinateRef.current))
        );
    };
  }, []);
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
        dispatch(
          changeWhiteBoardToolBarValue({ key: "colorCode", value: json.value })
        );
        dispatch(
          changeWhiteBoardToolBarValue({ key: "cursor", value: penCursor })
        );
        dispatch(
          changeWhiteBoardToolBarValue({ key: "eraserSelect", value: false })
        );
        break;
      case 2:
        dispatch(
          changeWhiteBoardToolBarValue({
            key: "strokeWidth",
            value: json.value,
          })
        );
        dispatch(
          changeWhiteBoardToolBarValue({ key: "selectedPen", value: json.key })
        );
        dispatch(
          changeWhiteBoardToolBarValue({ key: "cursor", value: penCursor })
        );
        dispatch(
          changeWhiteBoardToolBarValue({ key: "eraserSelect", value: false })
        );

        break;
      case 3:
        typeof handleDataTrack === "function" &&
          throttleFn(
            () => handleDataTrack({ type: "clearAll" }),
            DELAY,
            currentTimeStamp
          );
        handleClearAll();
        break;
      case 4:
        dispatch(
          changeWhiteBoardToolBarValue({ key: "selectedPen", value: json.key })
        );
        dispatch(
          changeWhiteBoardToolBarValue({ key: "cursor", value: "crosshair" })
        );
        dispatch(
          changeWhiteBoardToolBarValue({ key: "eraserSelect", value: false })
        );
        break;
      case 5:
        dispatch(
          changeWhiteBoardToolBarValue({ key: "selectedPen", value: json.key })
        );
        dispatch(
          changeWhiteBoardToolBarValue({ key: "cursor", value: penCursor })
        );
        dispatch(
          changeWhiteBoardToolBarValue({ key: "eraserSelect", value: false })
        );
        break;
      case 6:
        dispatch(
          changeWhiteBoardToolBarValue({
            key: "eraserSize",
            value: json.value,
          })
        );
        dispatch(
          changeWhiteBoardToolBarValue({ key: "cursor", value: eraserCursor })
        );
        dispatch(
          changeWhiteBoardToolBarValue({ key: "eraserSelect", value: true })
        );
        break;
      default:
        dispatch(
          changeWhiteBoardToolBarValue({ key: "cursor", value: "crosshair" })
        );
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
        points: [
          textInput.x / scaleRef.current.scaleX,
          textInput.y / scaleRef.current.scaleY,
        ],
        value: textInput.value,
        type: "text",
        id: `${userId}_${currentIdRef.current}`,
      };
      allCoordinateRef.current.push(data);
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
      coordinates2.type = "text";
      typeof handleDataTrack === "function" &&
        throttleFn(
          () => handleDataTrack(coordinates2),
          DELAY,
          currentTimeStamp
        );
      currentIdRef.current = currentIdRef.current + 1;
    }
  };
  return (
    <div className="w-full h-full p-1">
      {!isWritingDisabled && (
        <WhiteboardToolbar
          handleClick={handleToolBarSelect}
          closeToolbarPopup={closeToolbarPopup}
          totalImageLength={0}
          currentPdfIndex={0}
          handleDataTrackPdfChange={() => {}}
          removeClearAllBtn={false}
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
          cursor={cursor === "crosshair" ? penCursor : cursor}
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
            {images.map((src, i) => {
              let row = i % 3;
              let col = Math.floor(i / 3);
              let width = 150;
              let height = 150;
              let xAxis = (WHITEBOARDSTANDARDSCREENSIZE.width - 450 - 120) / 2;
              let x0 = xAxis + (width + 60) * row;
              let yAxis = 60 + (height + 60) * col;
              return (
                <UrlImage
                  key={i}
                  src={src}
                  width={150}
                  height={150}
                  x={x0}
                  y={yAxis}
                />
              );
            })}
          </Layer>
          <Layer>
            {allCoordinateRef.current?.map((line, i) => {
              return line?.type === "text" ? (
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
              );
            })}
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
  y: number;
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
