import React, { useState } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const ItemType = {
  LABEL: "label",
};

// Draggable label component
const DraggableLabel = ({ label, id }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemType.LABEL,
    item: { id, label },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        padding: "8px",
        margin: "4px",
        backgroundColor: "lightblue",
        cursor: "move",
        border: "1px solid black",
      }}
    >
      {label}
    </div>
  );
};

// Drop zone component
const DropZone = ({ position, onDrop, currentLabels }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemType.LABEL,
    drop: (item) => onDrop(item, position),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      style={{
        position: "absolute",
        top: position.y,
        left: position.x,
        width: "120px",
        height: "100px",
        border: isOver ? "2px solid green" : "2px dashed gray",
        backgroundColor: isOver ? "#f0f8ff" : "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "auto",
      }}
    >
      {currentLabels.length > 0
        ? currentLabels.map((label, index) => (
            <div
              key={index}
              style={{
                padding: "4px",
                margin: "2px",
                backgroundColor: "lightgray",
                border: "1px solid black",
                borderRadius: "4px",
              }}
            >
              {label}
            </div>
          ))
        : "Drop Here"}
    </div>
  );
};

// Main labeling component
const MainLabeling = ({ obj }) => {
  const [choices, setChoices] = useState(() => {
    try {
      return JSON.parse(obj?.question_data)?.choices || [];
    } catch (error) {
      console.error("Invalid JSON in question_data:", error);
      return [];
    }
  });

  const [dropZones, setDropZones] = useState(() => {
    try {
      return JSON.parse(obj?.question_data)?.dropZones.map((zone) => ({
        ...zone,
        currentLabels: [],
      })) || [];
    } catch (error) {
      console.error("Invalid JSON in question_data:", error);
      return [];
    }
  });

  const handleDrop = (item, position) => {
    const updatedDropZones = dropZones.map((zone) => {
      if (zone.x === position.x && zone.y === position.y) {
        return {
          ...zone,
          currentLabels: [...zone.currentLabels, item.label], // Append the dropped label
        };
      }
      return zone;
    });

    setDropZones(updatedDropZones);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ position: "relative", width: "600px", height: "400px", border: "1px solid black" }}>
        {/* Render drop zones */}
        {dropZones.map((zone, index) => (
          <DropZone
            key={index}
            position={{ x: zone.x, y: zone.y }}
            onDrop={handleDrop}
            currentLabels={zone.currentLabels}
          />
        ))}

        {/* Render draggable labels */}
        <div style={{ position: "absolute", bottom: "10px", left: "10px", display: "flex", gap: "10px" }}>
          {choices.map((choice) => (
            <DraggableLabel key={choice.id} id={choice.id} label={choice.label} />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default MainLabeling;