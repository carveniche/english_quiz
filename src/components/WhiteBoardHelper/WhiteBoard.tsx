import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Text, Line, Image } from "react-konva";
import { WHITEBOARDSTANDARDSCREENSIZE } from "../../constants";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import UserCursor from "./UserCursor";
import WhiteboardToolbar from "./WhiteBoardToolbar/WhiteboardToolbar";
import { handleLoadImage } from "./WhiteboardImageRenderer/LoadImage";
import { useDispatch } from "react-redux";
import { changeWhiteBoardToolBarValue } from "../../redux/features/ComponentLevelDataReducer";
import { isTutorTechBoth } from "../../utils/participantIdentity";
const TEXTAREAWIDTH = 200;
const TEXTAREAHEIGHT = 50;

const eraserCursor = "/WhiteBoardToolbarAssets/Toolbar/Eraser.svg";
const penCursor = "/static/cursor.png";
const cursorUrl = "url({}) 1 16, auto";
export default function WhiteBoard({
  childRef,
  whiteBoardData,
  handleDataTrack,
  images,
  count = 0,
  handleUpdateLocalAndRemoteData,
  currentIncomingLines,
  cbAfterImageRendered,
  totalImageLength = 0,
  currentPdfIndex = 0,
  removeClearAllBtn = false,
  from,
}: {
  childRef: any;
  images: string;
  whiteBoardData: object;
  handleDataTrack: Function | undefined;
  count: number | undefined;
  handleUpdateLocalAndRemoteData: Function | undefined;
  currentIncomingLines: object;
  cbAfterImageRendered: Function | undefined | null;
  totalImageLength: number;
  currentPdfIndex: number;
  removeClearAllBtn: boolean;
  from: string | undefined | null;
}) {
  const { userId } = useSelector((state: RootState) => {
    return state.liveClassDetails;
  });
  const { role_name } = useSelector((state: RootState) => {
    return state.videoCallTokenData;
  });
  const scaleRef = useRef({
    scaleX: 1,
    scaleY: 1,
  });
  const [isScaled, setScaled] = useState(false);
  const dispatch = useDispatch();
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
  const DELAY = 200;
  const currentTimeStamp = useRef(Date.now());
  const [textInput, setTextInput] = useState({
    showInputBox: false,
    x: 0,
    y: 0,
    value: "",
  });
  const [closeToolbarPopup, setCloseToolbarPopup] = useState(false);
  const [currentLoadedImage, setCurrentLoadedImage] = useState("");
  const remoteArrayRef = useRef([]);
  const allCoordinateRef = useRef(
    JSON.parse(JSON.stringify(whiteBoardData)) || []
  );
  const [_remoteState, setRemoteState] = useState(false);
  const canvasCalculatedDimension = useRef({
    height: WHITEBOARDSTANDARDSCREENSIZE.height,
    width: WHITEBOARDSTANDARDSCREENSIZE.width,
  });
  const whiteBoardContainerRef = useRef();
  const currentIdRef = useRef(0);
  const [_localState, setLocalState] = useState(false);
  let coordinatesRef = useRef([]);
  const drawingRef = useRef(false);
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
  const handleScale = () => {
    let containerWidth = whiteBoardContainerRef.current.clientWidth;
    let containerHeight = whiteBoardContainerRef.current.clientHeight;
    // calculating ratio width by height
    let actualHeight =
      (containerWidth * WHITEBOARDSTANDARDSCREENSIZE.height) /
      WHITEBOARDSTANDARDSCREENSIZE.width;
    let actualWidth = containerWidth;
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
    allCoordinateRef.current = allCoordinateRef.current.filter(
      (item) => item.id != lastLines.id
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
    typeof handleDataTrack === "function" &&
      handleDataTrack({
        identity: userId,
        isDrawing: false,
      });
  };

  const handleMouseLeave = () => {
    setCloseToolbarPopup(false);
    drawingRef.current = false;
    typeof handleDataTrack === "function" &&
      handleDataTrack({
        identity: userId,
        isDrawing: false,
      });
  };
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
          changeWhiteBoardToolBarValue({
            key: "selectedPen",
            value: "FreeDrawing",
          })
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
        id: `${userId}_${Date.now()}`,
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
  const handleA4SizePageCalculation = (image) => {
    let containerWidth = whiteBoardContainerRef.current.clientWidth;
    if (image) {
      let widthHeightProportion = image.width / image.height;
      let width = image.width;
      if (
        isTutorTechBoth({ identity: role_name.toString() }) &&
        totalImageLength > 1
      ) {
        containerWidth -= 100;
      }
      if (containerWidth < width) width = containerWidth;
      let height = width / widthHeightProportion;
      image.width = width;
      image.height = height;
    }
  };
  const handleAfterImageLoaded = (image) => {
    let containerWidth = whiteBoardContainerRef?.current?.clientWidth;
    let containerHeight = whiteBoardContainerRef?.current?.clientHeight;
    let width = containerWidth;
    let height = containerHeight;
    if (image) {
      if (from === "uploadResource") {
        handleA4SizePageCalculation(image);
      } else {
        let widthHeightProportion = image.width / image.height; //width/
        let calculatedHeight = containerWidth / widthHeightProportion;
        if (calculatedHeight > containerHeight) {
          width = height * widthHeightProportion;
        } else {
          height = calculatedHeight;
        }

        image.width = width;
        image.height = height;
      }

      setCurrentLoadedImage(image);
    }
    typeof cbAfterImageRendered === "function" && cbAfterImageRendered();
    scaleRef.current = {
      scaleX: image.width,
      scaleY: image.height,
    };
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
        if ((temp?.isDrawing || temp.type === "text") && temp?.coordinates)
          drawLine(temp?.coordinates || {});
      }
    }
  }, [count]);
  useEffect(() => {
    if (images) {
      return;
    }
    handleScale();
  }, []);
  useEffect(() => {
    return () => {
      typeof handleUpdateLocalAndRemoteData === "function" &&
        handleUpdateLocalAndRemoteData(
          JSON.parse(JSON.stringify(allCoordinateRef.current))
        );
    };
  }, []);
  useEffect(() => {
    if (images) handleLoadImage(images, handleAfterImageLoaded);
  }, [images]);

  if (childRef) {
    childRef.current = () => {
      typeof handleDataTrack === "function" &&
        throttleFn(
          () => handleDataTrack({ type: "clearAll" }),
          DELAY,
          currentTimeStamp
        );
      handleClearAll();
    };
  }

  return (
    <div className="w-full h-full p-1">
      <WhiteboardToolbar
        handleClick={handleToolBarSelect}
        closeToolbarPopup={closeToolbarPopup}
        totalImageLength={totalImageLength}
        currentPdfIndex={currentPdfIndex}
        handleDataTrackPdfChange={handleDataTrack}
        removeClearAllBtn={removeClearAllBtn}
      />
      <div
        className={`${
          from === "uploadResource"
            ? "overflow-y-auto overflow-x-hidden h-max-full h-full"
            : "overflow-hidden"
        } `}
        style={{
          position: "relative",
          height: currentLoadedImage
            ? from === "uploadResource"
              ? ""
              : "fit-content"
            : "calc(100% - 40px)",
          width: currentLoadedImage ? "fit-content" : "100%",
          margin: "auto",
          cursor:
            cursor === "crosshair" ? cursor : cursorUrl.replace("{}", cursor),
        }}
        ref={whiteBoardContainerRef}
      >
        <>
          {selectedPen === "Text" && textInput?.showInputBox && (
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
        {images ? (
          <>
            {currentLoadedImage && (
              <Stage
                onMouseDown={handleMouseDown}
                onMousemove={handleMouseMove}
                onMouseup={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleMouseDown}
                onTouchMove={handleMouseMove}
                onTouchEnd={handleMouseUp}
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
                  {allCoordinateRef.current.map((line, i) =>
                    line?.type === "text" ? (
                      <Text
                        text={line?.value}
                        x={line?.points[0] * currentLoadedImage.width}
                        y={line?.points[1] * currentLoadedImage.height}
                        fontSize={30}
                        key={`key${i}`}
                      />
                    ) : (
                      <Line
                        key={`key${i}`}
                        points={line?.points?.map((item, i) =>
                          i % 2
                            ? item * currentLoadedImage.height
                            : item * currentLoadedImage.width
                        )}
                        globalCompositeOperation={
                          line.eraser ? "destination-out" : "source-over"
                        }
                        stroke={line.color}
                        strokeWidth={line?.stroke}
                      ></Line>
                    )
                  )}
                </Layer>
              </Stage>
            )}
          </>
        ) : (
          <Stage
            onMouseDown={handleMouseDown}
            onMousemove={handleMouseMove}
            onMouseup={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
            height={canvasCalculatedDimension.current.height}
            width={canvasCalculatedDimension.current.width}
            style={{
              width: "fit-content",
              height: "fit-content",
              maxWidth: "fit-content",
              maxHeight: "fit-content",
              overflow: "hidden",
              position: "relative",
              //url(/static/cursor.png) 1 16, auto
              cursor:
                cursor === "crosshair"
                  ? cursor
                  : cursorUrl.replace("{}", cursor),
              backgroundColor: "transparent",
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
        )}
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
