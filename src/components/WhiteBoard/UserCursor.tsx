import React from "react";

export default function UserCursor({ remtoeArray, scaleRef }) {
  return (
    <>
      {remtoeArray?.map((item, key) =>
        (() => {
          let { cursorPoints } = item;

          cursorPoints = cursorPoints || [];
          let left = cursorPoints[0];
          let top = cursorPoints[1];
          if (item?.isDrawing)
            return (
              <div
                style={{
                  position: "absolute",
                  top: top * scaleRef.current.scaleY,
                  left: left * scaleRef.current.scaleX,
                }}
              >
                <img src="/static/cursor.png" />
                {item?.identity}
              </div>
            );
          else <></>;
        })()
      )}
    </>
  );
}
