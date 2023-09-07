import React, { useEffect, useState } from "react";
import styles from "../components/OnlineQuizPage/component/OnlineQuiz.module.css";
import styles2 from "./StudentActivity.module.css";
import { deadlineForActvity } from "./Activities/ShapeChallengeActivity/ShapeChallengeCheckInActivity";
import AffirmationBadges from "./Activities/AffirmationActivity/AffirmationBadges";
import ActivityButton from "./Button";
import HtmlParser from "react-html-parser";
export default function ActivityTimerAndEndButton({
  toolBox,
  handleEndActivity,
  keys,
  timerRef,
  currentTime,
  text,
  onClick,
  identity,
  showAffirmationStories,
  checkIn,
  showClosed,
  feelingChart,
  instruction,
  teacherTimerRef,
  selectedItem,
  showHeading,
  disabledEndActivityButton,
  isStudentActivityEnd,
  hideCornerBadges,
  timerCountRef,
}) {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    console.log("clll", showClosed);
    if (showClosed) return;
    handleEndActivity();
  };
  useEffect(() => {
    if (identity) return;
    let value = 0;
    let startTimeUpdate = Date.now();
    try {
      let obj = JSON.parse(localStorage.getItem(keys));

      if (obj) {
        let startTime = obj?.startTime || 0;
        let diff = Date.now() - startTime;
        if (diff >= deadlineForActvity) {
          localStorage.setItem(
            keys,
            JSON.stringify({ startTime: Date.now(), value: 0 })
          );
          value = 0;
        } else {
          value = Number(obj?.value) || 0;
          startTimeUpdate = obj?.startTime;
        }
      } else {
        localStorage.setItem(
          keys,
          JSON.stringify({ startTime: Date.now(), value: 0 })
        );
      }
    } catch (e) {
      localStorage.setItem(
        keys,
        JSON.stringify({ startTime: Date.now(), value: 0 })
      );
    }

    timerRef.current = setInterval(() => {
      setCount((prev) => {
        let value1 = value;

        let timer = Math.floor((Date.now() - currentTime) / 1000);
        timer += value;
        if (typeof teacherTimerRef === "object")
          teacherTimerRef.current = timer;
        localStorage.setItem(
          keys,
          JSON.stringify({ startTime: startTimeUpdate, value: timer })
        );
        if (typeof timerCountRef === "object") timerCountRef.current = timer;
        return timer;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);
  const handleClickNext = () => {
    typeof onClick === "function" && onClick();
  };
  return (
    <>
      {(showAffirmationStories || !checkIn) && (
        <div style={{ float: "left" }}>
          {
            <AffirmationBadges
              checkIn={checkIn}
              selectedItem={selectedItem}
              visibility={hideCornerBadges ? "hidden" : "visible"}
            />
          }
        </div>
      )}
      {!identity && (
        <>
          {toolBox === true && (
            <div
              style={{
                position: "absolute",
                right: 10,
              }}
            >
              {text && <ActivityButton onClick={handleClickNext} text={text} />}
            </div>
          )}
          {(!toolBox || checkIn === false) &&
            !disabledEndActivityButton &&
            !feelingChart && (
              <div style={{ position: "absolute", right: 10 }}>
                <button
                  style={{
                    marginLeft: 5,
                    padding: 5,

                    color: "white",
                    borderRadius: 5,
                  }}
                  onClick={() => !isStudentActivityEnd && handleClick()}
                >
                  <img
                    src={`/static/media/Closedicon/${
                      isStudentActivityEnd ? "close2" : "close1"
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
        </>
      )}
      <div
        style={{
          display: "flex",

          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1rem",
          float: identity ? "left" : "initial",
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
        {!identity && instruction && (
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
                visibility: showHeading ? "hidden" : "visible",
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
