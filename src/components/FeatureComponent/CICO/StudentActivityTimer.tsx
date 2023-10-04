import { useEffect, useState } from "react";
import "./index.css";
import styles2 from "./StudentActivity.module.css";
import HtmlParser from "react-html-parser";
import { CICO } from "../../../constants";
import AffirmationBadges from "./AffirmationBadges";
export default function StudentActivityTimer({
  currentTime = Date.now(),
  timerRef,
  instruction,
  handleSubmit,
  isClosed,
  isShowCornerImage,
  activityType,
  selectedItem,
  isBadgesVisible,
  showEndButton,
}: {
  currentTime: number;
  timerRef: any;
  instruction: string;
  handleSubmit: Function | null;
  isClosed: boolean;
  showEndButton: boolean;
  isShowCornerImage: boolean | undefined;
  activityType: string | undefined;
  selectedItem: object;
  isBadgesVisible: boolean | undefined;
}) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    timerRef.current.id = setInterval(() => {
      setCount(() => {
        let timer = Math.floor((Date.now() - currentTime) / 1000);
        return timer;
      });
    }, 1000);
    return () => clearInterval(timerRef.current.id);
  }, []);
  const handleClick = () => {
    typeof handleSubmit === "function" && handleSubmit();
  };
  timerRef.current.count = count;
  return (
    <>
      {isShowCornerImage && (
        <div style={{ float: "left" }}>
          <AffirmationBadges
            checkIn={activityType === CICO.checkIn}
            visibility={isBadgesVisible ? "visible" : "hidden"}
            selectedItem={selectedItem}
          />
        </div>
      )}
      {showEndButton && (
        <div style={{ position: "absolute", right: 10 }}>
          <button
            style={{
              marginLeft: 5,
              padding: 5,

              color: "white",
              borderRadius: 5,
            }}
            onClick={handleClick}
          >
            <img
              src={`/static/media/Closedicon/${
                isClosed ? "close2" : "close1"
              }.png`}
              style={{ width: 80 }}
            />
          </button>
        </div>
      )}
      <div
        style={{
          display: "flex",
          gap: "2rem",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div>
          <div>
            <div style={{ display: "flex", marginBottom: "2rem" }}></div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        ></div>
      </div>
      <div
        style={{
          display: "flex",

          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1rem",
          float: false ? "left" : "initial",
        }}
      >
        <div
          className="timercontainerWithBadges"
          style={{
            width: 100,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        ></div>
        {true && (
          <div
            className={styles2.whiteboardContainerInstruction}
            style={{ width: "94%", marginRight: "6%", padding: 0 }}
          >
            <div
              className={styles2.instructionHeading}
              style={{ display: "none" }}
            >
              Instruction
            </div>
            <div
              className={styles2.instructionHeading}
              style={{
                textAlign: "center",
                visibility: false ? "hidden" : "visible",
              }}
            >
              {HtmlParser(instruction ?? "")}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
