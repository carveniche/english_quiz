import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";
import styles from "./BalloonLottie.module.css";
export default function BalloonLottie({ mission, applyStyles }) {
  const container = useRef(null);

  return (
    <div>
      <div
        className="sampleoneanimation"
        ref={container}
        style={{
          position: "absolute",
          height: "100%",
          top: 0,
          left: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          zIndex: 99999999,
        }}
      >
        <img
          src={`/static/media/GifImages/${mission ? "ms" : "celebration"}.gif`}
          className={applyStyles ? styles.missionStyles : ""}
        />
      </div>
    </div>
  );
}
