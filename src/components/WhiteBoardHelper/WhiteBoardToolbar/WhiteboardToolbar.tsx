import Toolbar from "./JSON/Toolbar.json";
import Colorbar from "./JSON/ColorPicker.json";
import PenStroke from "./JSON/PenStroke.json";
import { useEffect, useState } from "react";

export default function WhiteboardToolbar({
  handleClick,
  closeToolbarPopup,
}: {
  handleClick: Function;
  closeToolbarPopup: boolean;
}) {
  const [id, setId] = useState(0);
  const [key, setKey] = useState("");
  const [isPopoverVisible, setPopoverVisible] = useState(false);
  const [openPopup, setOpenPopup] = useState("");

  useEffect(() => {
    if (!closeToolbarPopup) {
      setPopoverVisible(false);
    }
  }, [closeToolbarPopup]);
  const handleSelectedKey = (id: number, key: string) => {
    setPopoverVisible(!isPopoverVisible);
    switch (id) {
      case 1: {
        setId(id);
        setKey(key);
        setOpenPopup("ColorPalette");
        break;
      }
      case 2: {
        setId(id);
        setKey(key);
        setOpenPopup("PencilStroke");
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
      <div className="flex w-full h-[40px] items-center gap-2 p-5 bg-white">
        {Toolbar.map((item, i) => (
          <button
            onClick={() => handleSelectedKey(item.id, item.key)}
            className="cursor-pointer"
          >
            <img src={item.image}></img>
          </button>
        ))}
      </div>

      {isPopoverVisible && !closeToolbarPopup && (id === 1 || id === 2) && (
        <div
          className={`flex  ${
            id === 1 ? "w-[90px]" : "w-[130px]"
          }  flex-wrap absolute flex-row bg-white p-4 gap-4 shadow-md left-2`}
        >
          {id === 1 &&
            openPopup === "ColorPalette" &&
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
            openPopup === "PencilStroke" &&
            PenStroke.map((item) => {
              return (
                <button
                  style={{ cursor: "pointer" }}
                  onClick={() => handlePenStroke(item.strokeValue)}
                  className="flex flex-row items-center w-full p-1 gap-2"
                >
                  <div
                    style={{
                      border: "2px solid black",
                      width: "22px",
                      height:
                        item.strokeValue === 1
                          ? "0.5px"
                          : item.strokeValue === 3
                          ? "7px"
                          : "12px",
                      background: "black",
                    }}
                  ></div>
                  <p>{item.name}</p>
                </button>
              );
            })}
        </div>
      )}
    </div>
  );
}
