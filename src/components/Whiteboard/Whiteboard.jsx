import "./Whiteboard.css";
import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Star, Text, Line } from "react-konva";

export default function Whiteboard() {
  const [currentLines, setCurrentLines] = useState([]);
  const [points, setPoints] = useState([]);
  const [penStroke, setPenStroke] = useState(5);
  const [colorPickerValue, setColorPickerValue] = useState("red");
  const [scaleValueX, setScaleValueX] = useState("");
  const [scaleValueY, setScaleValueY] = useState("");
  const isDrawing = useRef(false);
  const stageRef = useRef(null);

  const sceneWidth = 1000;
  const sceneHeight = 500;

  const WhiteBoardFirst = () => {
    let CANVAS_WIDTH = 600;
    let CANVAS_HEIGHT = 300;

    let scaleX = CANVAS_WIDTH / sceneWidth;
    let scaleY = CANVAS_HEIGHT / sceneHeight;
    const handleMouseDown = (e) => {
      isDrawing.current = true;
      const position = e.target.getStage().getPointerPosition();

      position.x = position.x / scaleX;
      position.y = position.y / scaleY;

      let currentLines = [
        {
          penStroke,
          colorPickerValue,
          points: [position.x, position.y],
        },
      ];

      setCurrentLines(currentLines);
    };

    const handleMouseMove = (e) => {
      if (!isDrawing.current) {
        return;
      }
      const positionMove = e.target.getStage().getPointerPosition();

      positionMove.x = positionMove.x / scaleX;
      positionMove.y = positionMove.y / scaleX;

      let lastCanvasLines = currentLines[currentLines.length - 1];

      lastCanvasLines.points = lastCanvasLines.points.concat([
        positionMove.x,
        positionMove.y,
      ]);

      setCurrentLines([...currentLines, lastCanvasLines]);
    };

    const handleMouseUp = () => {
      currentLines.map((line) => {});

      isDrawing.current = false;
    };

    const handleMouseLeave = (e) => {
      isDrawing.current = false;
    };

    return (
      <div className="firstWhiteboard" id="firstWhiteboard">
        <Stage
          width={sceneWidth * scaleX}
          height={sceneHeight * scaleY}
          scale={{ x: scaleX, y: scaleY }}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <Layer listening={false} hitGraphEnabled={false}>
            {currentLines.length > 0 &&
              currentLines.map((line, i) => (
                <Line
                  key={i}
                  points={line?.points}
                  stroke={line?.colorPickerValue}
                  strokeWidth={line?.penStroke}
                  perfectDrawEnabled={false}
                  tension={0.5}
                  lineCap="round"
                />
              ))}
          </Layer>
        </Stage>
      </div>
    );
  };

  const WhiteBoardSecond = () => {
    let CANVAS_WIDTH = 500;
    let CANVAS_HEIGHT = 250;

    let scaleX = CANVAS_WIDTH / sceneWidth;
    let scaleY = CANVAS_HEIGHT / sceneHeight;

    useEffect(() => {
      fitStageIntoParentContainer();
    }, [currentLines]);

    function fitStageIntoParentContainer() {
      var container = document.querySelector("#secondWhiteboard");

      var containerWidth = container.offsetWidth;

      var containerHeight = container.offsetHeight;

      var scaleX = containerWidth / sceneWidth;
      var scaleY = containerHeight / sceneHeight;

      setScaleValueX(scaleX);
      setScaleValueY(scaleY);
    }

    const handleMouseDown = (e) => {
      isDrawing.current = true;
      const position = e.target.getStage().getPointerPosition();

      position.x = position.x / scaleX;
      position.y = position.y / scaleY;

      let currentLines = [
        {
          penStroke,
          colorPickerValue,
          points: [position.x, position.y],
        },
      ];

      setCurrentLines(currentLines);
    };

    const handleMouseMove = (e) => {
      if (!isDrawing.current) {
        return;
      }
      const positionMove = e.target.getStage().getPointerPosition();

      positionMove.x = positionMove.x / scaleX;
      positionMove.y = positionMove.y / scaleX;

      let lastCanvasLines = currentLines[currentLines.length - 1];

      lastCanvasLines.points = lastCanvasLines.points.concat([
        positionMove.x,
        positionMove.y,
      ]);

      setCurrentLines([...currentLines, lastCanvasLines]);
    };

    const handleMouseUp = () => {
      currentLines.map((line) => {});

      isDrawing.current = false;
    };

    const handleMouseLeave = (e) => {
      isDrawing.current = false;
    };

    return (
      <div className="secondWhiteboard" id="secondWhiteboard">
        <Stage
          width={sceneWidth * scaleX}
          height={sceneHeight * scaleY}
          scale={{ x: scaleX, y: scaleY }}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <Layer listening={false} hitGraphEnabled={false}>
            {currentLines.length > 0 &&
              currentLines.map((line, i) => (
                <Line
                  key={i}
                  points={line?.points}
                  stroke={line?.colorPickerValue}
                  strokeWidth={line?.penStroke}
                  perfectDrawEnabled={false}
                  tension={0.5}
                  lineCap="round"
                />
              ))}
          </Layer>
        </Stage>
      </div>
    );
  };

  return (
    <div className="mainContainer">
      <WhiteBoardFirst />
      <WhiteBoardSecond />
    </div>
  );
}
