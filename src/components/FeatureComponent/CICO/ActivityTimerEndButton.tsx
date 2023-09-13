import React, { useEffect, useState } from "react";
import "./index.css";
import styles2 from "./StudentActivity.module.css";
import HtmlParser from "react-html-parser";
import ActivityButton from "./ActivityButton";
import AffirmationBadges from "./AffirmationBadges";
import { CICO } from "../../../constants";
export default function ActivityTimerEndButton({
  currentTime = Date.now(),
  timerRef,
  instruction,
  showEndButton,
  handleEndActivity,
  text,
  handleClickNext,
  activityType,
  isBadgesVisible,
  selectedItem,
  isShowCornerImage,
}: {
  currentTime: number;
  timerRef: any;
}) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCount(() => {
        let timer = Math.floor((Date.now() - currentTime) / 1000);
        return timer;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);
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
      <div
        style={{
          position: "absolute",
          right: 10,
        }}
      >
        {text && <ActivityButton onClick={handleClickNext} text={text} />}
      </div>
      {showEndButton && (
        <div style={{ position: "absolute", right: 10 }}>
          <button
            style={{
              marginLeft: 5,
              padding: 5,

              color: "white",
              borderRadius: 5,
            }}
            onClick={() => handleEndActivity()}
          >
            <img
              src={`/static/media/Closedicon/${
                false ? "close2" : "close1"
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
            <div style={{ display: "flex", marginBottom: "0.4rem" }}>
              {(() => {
                let mm1 = Math.floor(count / 60);
                let ss1 = count % 60;
                let ss = [Math.floor(ss1 / 10), ss1 % 10];
                let mm = [Math.floor(mm1 / 10), mm1 % 10];

                // return `${mm.toString().padStart(2, "0")}:${ss
                //   .toString()
                //   .padStart(2, "0")}`;

                return (
                  <>
                    <div className="ledScreen">
                      <img
                        src={`/static/media/ledNumber/${
                          Number(mm[0]) || 0
                        }_2@1x.png`}
                      />
                    </div>
                    <div className="ledScreen">
                      <img
                        src={`/static/media/ledNumber/${
                          Number(mm[1]) || 0
                        }_2@1x.png`}
                      />
                    </div>
                    <div className="ledScreen">
                      <img src="/static/media/ledNumber/dot_2@1x.png" />
                    </div>
                    <div className="ledScreen">
                      <img
                        src={`/static/media/ledNumber/${
                          Number(ss[0]) || 0
                        }_2@1x.png`}
                      />
                    </div>

                    <div className="ledScreen">
                      <img
                        src={`/static/media/ledNumber/${
                          Number(ss[1]) || 0
                        }_2@1x.png`}
                      />
                    </div>
                  </>
                );
              })()}
            </div>
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
        {instruction && (
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
