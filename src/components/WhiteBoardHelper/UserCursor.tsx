export default function UserCursor({ remtoeArray, scaleRef, cursor }) {
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
                <img src={cursor} />
                {item?.identity}
              </div>
            );
          else <></>;
        })()
      )}
    </>
  );
}
