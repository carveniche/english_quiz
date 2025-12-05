// src/components/DraggableWrapper.jsx
import React from "react";
import { useDrag } from "react-dnd";

const DraggableWrapper = ({ id, children, type = "BOX", data = {} }) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type,
    item: { id, ...data },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={dragRef}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
        transition: "opacity 0.2s ease",
      }}
    >
      {children}
    </div>
  );
};

export default DraggableWrapper;
