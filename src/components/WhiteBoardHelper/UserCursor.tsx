import React from "react";

export default function UserCursor({ remtoeArray, scaleRef, cursor }) {
  return (
    <>
      {remtoeArray?.map((item, key) => (
        <React.Fragment key={key}>
          {(() => {
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
                    zIndex: 1,
                  }}
                >
                  <img src={cursor} />
                  {item?.userName}
                </div>
              );
            else <></>;
          })()}
        </React.Fragment>
      ))}
    </>
  );
}
