import React from "react";

export default function UserCursor({ remtoeArray }) {
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
                  top: top,
                  left: left,
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
