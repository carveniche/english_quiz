import React, { useEffect, useState } from "react";
import "./index.css";
import styles2 from "./StudentActivity.module.css";
import HtmlParser from "react-html-parser";
export default function StudentActivityTimer({
  currentTime = Date.now(),
  timerRef,
  instruction,
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
      <div style={{ position: "absolute", right: 10 }}>
        <button
          style={{
            marginLeft: 5,
            padding: 5,

            color: "white",
            borderRadius: 5,
          }}
          onClick={() => null}
        >
          <img
            src={`/static/media/Closedicon/${false ? "close2" : "close1"}.png`}
            style={{ width: 80 }}
          />
        </button>
      </div>
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
