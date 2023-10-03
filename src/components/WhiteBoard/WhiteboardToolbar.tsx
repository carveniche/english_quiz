import React from "react";
const toolBar = [
  {
    id: 1,
    name: "Lines",
  },
  {
    id: 2,
    name: "pencil",
  },
  {
    id: 3,
    name: "Clear",
  },
];
export default function WhiteboardToolbar({ handleClick }) {
  return (
    <div className="flex gap-1">
      {toolBar.map((item, i) => (
        <div onClick={() => handleClick(item.id)} className="cursor-pointer">
          {item.name}
        </div>
      ))}
    </div>
  );
}
