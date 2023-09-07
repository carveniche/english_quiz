import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
export default function RecordingStartNotification() {
  const [count, setCount] = React.useState(0);
  const isRecordingStarted = useSelector(
    (state: RootState) => state.liveClassDetails.isRecordingEnabled
  );
  useEffect(() => {
    let id: ReturnType<typeof setInterval> | undefined;
    if (isRecordingStarted) {
      const currentDate = Date.now();
      let currentCount = count;
      id = setInterval(() => {
        setCount(Math.floor((Date.now() - currentDate + currentCount) / 1000));
      }, 1000);
    } else {
      clearInterval(id);
    }
    return () => {
      clearInterval(id);
    };
  }, [isRecordingStarted]);
  return (
    <>
      <div className="flex items-center gap-x-1 mx-2">
        <div>
          <img src="/static/media/startRecordingIcon.svg" />
        </div>
        <div
          className="text-white "
          style={{
            fontSize: "12px",
            fontStyle: "normal",
            fontWeight: 500,
          }}
        >
          {(() => {
            let mm = Math.floor(count / 60);
            let ss = count % 60;
            return `${mm.toString().padStart(2, "0")}:${ss
              .toString()
              .padStart(2, "0")}`;
          })()}
        </div>
      </div>
    </>
  );
}
