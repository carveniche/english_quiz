import React, { useEffect, useRef, useState } from "react";
import { deadlineForActvity } from "./Activities/ShapeChallengeActivity/ShapeChallengeCheckInActivity";

export default function ActivityTimerCalculator({

  identity,
  activityName,
  checkIn,
  participant,
  teacherTimerRef,
}) {
  const [count, setCount] = useState(0);
  let search = window.location.search;
  let urlParams = new URLSearchParams(search);
  let liveClassID = urlParams.get("liveClassID");
  let keys =
    activityName +
    (checkIn ? "check-in" : "check-out") +
    liveClassID +
    participant;
  const timerRef = useRef();
  const [currentTime, _] = useState(Date.now());
  useEffect(() => {
  
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
        return timer;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  return <></>;
}
