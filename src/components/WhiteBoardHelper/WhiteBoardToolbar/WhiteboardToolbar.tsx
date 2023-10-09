import Toolbar from "./JSON/Toolbar.json";
import Colorbar from "./JSON/ColorPicker.json";
import PenStroke from "./JSON/PenStroke.json";
import { useState } from "react";

export default function WhiteboardToolbar({ handleClick }) {
  const [id, setId] = useState(0);
  const [key, setKey] = useState("");
  const [isPopoverVisible, setPopoverVisible] = useState(false);
  const handleSelectedKey = (id: number, key: string) => {
    switch (id) {
      case 1: {
        setId(id);
        setKey(key);
        setPopoverVisible(!isPopoverVisible);
        break;
      }
      case 2: {
        setId(id);
        setKey(key);
        setPopoverVisible(!isPopoverVisible);
        break;
      }

      case 3: {
        setId(id);
        setKey(key);
        handleCommonClick(3, "Clear");
        break;
      }
      case 4: {
        setId(id);
        setKey(key);
        handleCommonClick(4, "Text");
        break;
      }
      case 5: {
        setId(id);
        setKey(key);
        handleCommonClick(5, "Line");
        break;
      }
      case 6: {
        setId(id);
        setKey(key);
        handleCommonClick(6, "Eraser");
        break;
      }
    }
  };

  const handleColorCode = (colorCode: string) => {
    let json = {
      id: id,
      value: colorCode,
      key: key,
    };
    handleClick(json);
  };

  const handlePenStroke = (penStroke: number) => {
    let json = {
      id: id,
      value: penStroke,
      key: key,
    };

    handleClick(json);
  };

  const handleCommonClick = (id: number, key: string) => {
    let json = {
      id: id,
      key: key,
    };

    handleClick(json);
  };

  return (
    <div className="relative z-[1]">
      <div className="flex w-full h-[40px] items-center gap-2 p-5">
        {Toolbar.map((item, i) => (
          <button
            onClick={() => handleSelectedKey(item.id, item.key)}
            className="cursor-pointer"
          >
            <img src={item.image}></img>
          </button>
        ))}
      </div>

      {isPopoverVisible && (
        <div className="flex w-[90px] flex-wrap absolute flex-row bg-white p-4 gap-4 shadow-md">
          {id === 1 &&
            Colorbar.map((item) => {
              return (
                <button
                  style={{ cursor: "pointer" }}
                  onClick={() => handleColorCode(item.code)}
                >
                  <img src={item.image}></img>
                </button>
              );
            })}

          {id === 2 &&
            PenStroke.map((item) => {
              return (
                <button
                  style={{ cursor: "pointer" }}
                  onClick={() => handlePenStroke(item.strokeValue)}
                >
                  <p>{item.name}</p>
                </button>
              );
            })}
        </div>
      )}
    </div>
  );
}
