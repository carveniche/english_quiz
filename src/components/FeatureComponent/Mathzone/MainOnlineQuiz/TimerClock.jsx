import React from "react";
import styles from "../component/OnlineQuiz.module.css";
export default function TimerClock({ count }) {
  return (
    <>
      {" "}
      <div
        className={styles.timerContainer}
        style={{ position: "absolute", top: -5 }}
      >
        <div className={styles.timerCircle}>
          <span className={styles.timerTime} id={styles.timerDisplay}>
            {(() => {
              let mm = Math.floor(count / 60);
              let ss = count % 60;
              return `${mm.toString().padStart(2, "0")}:${ss
                .toString()
                .padStart(2, "0")}`;
            })()}
          </span>
        </div>
      </div>
    </>
  );
}
