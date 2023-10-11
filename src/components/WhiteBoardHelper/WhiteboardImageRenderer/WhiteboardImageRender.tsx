import React, { useEffect, useId, useRef, useState } from "react";
import { Stage, Layer, Line, Image, Text } from "react-konva";
import { WHITEBOARDSTANDARDSCREENSIZE } from "../../../constants";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { handleLoadImage } from "./LoadImage";

export default function WhiteboardImageRender({
  images,
  whiteBoardData,
  handleDataTrack,
  count = 0,
  handleUpdateLocalAndRemoteData,
  currentIncomingLines,
}: {
  images: string;
  whiteBoardData: object;
  handleDataTrack: Function | undefined;
  count: number | undefined;
  handleUpdateLocalAndRemoteData: Function | undefined;
  currentIncomingLines: object;
}) {
  const { userId } = useSelector((state: RootState) => {
    return state.liveClassDetails;
  });
  const [currentLoadedImage, setCurrentLoadedImage] = useState("");
  const remoteArrayRef = useRef(JSON.parse(JSON.stringify(whiteBoardData)));
  const [_remoteState, setRemoteState] = useState(false);
  const [_localState, setLocalState] = useState(false);
  let coordinatesRef = useRef([]);
  const whiteBoardContainerRef = useRef();
  const currentIdRef = useRef(0);
  const drawingRef = useRef(false);
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
  const drawLine = (lastLines) => {
    coordinatesRef.current = coordinatesRef.current.filter(
      (item) => item.id != lastLines.id
    );
    coordinatesRef.current.push(lastLines);
    setLocalState((prev) => !prev);
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
    currentIdRef.current += 1;
    coordinatesRef.current.push({ ...penStructure });
    setLocalState((prev) => !prev);
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
    let lastLines = coordinatesRef.current.pop();
    // let lastLines = coordinates[coordinates.length - 1];
    lastLines.points = lastLines.points.concat([...temp]);
    drawLine(lastLines);
    let coordinates2 = {
      coordinates: lastLines,
    };
    coordinates2.isDrawing = true;
    coordinates2.cursorPoints = [...temp];
    typeof handleDataTrack === "function" && handleDataTrack(coordinates2);
  };

  const handleMouseUp = (e) => {
    drawingRef.current = false;
  };

  const handleMouseLeave = () => {
    drawingRef.current = false;
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
    if (images) handleLoadImage(images, handleAfterImageLoaded);
  }, [images]);

  return (
    <div className="w-full h-full p-1">
      <button onClick={() => {}}>Clear</button>

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
              {coordinatesRef.current.map((line, i) => (
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
              {remoteArrayRef.current?.map(({ coordinates }, key) =>
                coordinates?.map((line, index) =>
                  line?.type === "text" ? (
                    <Text
                      text={line?.value}
                      x={line?.points[0]}
                      y={line?.points[1]}
                      fontSize={30}
                      key={`key${key}-cell${index}`}
                    />
                  ) : (
                    <Line
                      key={`key${key}-cell${index}`}
                      points={line?.points.map((item, i) =>
                        i % 2
                          ? item * currentLoadedImage.height
                          : item * currentLoadedImage.width
                      )}
                      stroke={line.color}
                      strokeWidth={line?.stroke}
                    ></Line>
                  )
                )
              )}
            </Layer>
          </Stage>
        )}
      </div>
    </div>
  );
}
