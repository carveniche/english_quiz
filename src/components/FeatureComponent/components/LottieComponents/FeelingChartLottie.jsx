import React, { useEffect, useRef, useState } from "react";
import "./FeelingChartLottie.css";
export default function FeelingChart({
  selectedIndex,
  gifImage,
  alt,
  identity,
  isCheckIn,
  alt2,
  gifImage2,
  selectedIndex2,
  showCheckIn,
}) {
  useEffect(() => {}, []);
  const [image, setImage] = useState("");
  const [image2, setImage2] = useState("");
  const [currentDate, setCurrentDate] = useState(Date.now());
  const [state, setState] = useState(false);
  useEffect(() => {
    setImage(gifImage ?? "");
    setImage2(gifImage2 ?? "");
  }, [gifImage, gifImage2]);
  const container = useRef(null);

  // let arr = [
  //   "angry",
  //   "happy",
  //   "sad",
  //   "proud",
  //   "scared",
  //   "excited",
  //   "nervous",
  //   "guilty",
  //   "sleepy",
  //   "sick",
  // ];
  useEffect(() => {
    setTimeout(() => {
      setState(true);
    }, 50);
  }, []);
  return (
    state && (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "3.5rem",
          marginTop: showCheckIn ? "1rem" : 0,
        }}
      >
        {isCheckIn ? (
          <div
            ref={container}
            style={{ display: "flex", width: "100%", justifyContent: "center" }}
          >
            {!image && <img src={image + `?dummy=${currentDate}`} alt={alt} />}
            {image && (
              <img
                src={image + `?dummy=${currentDate}`}
                alt={alt}
                className={identity === "tutor" ? "feelingChartGifImage" : ""}
              />
            )}
          </div>
        ) : (
          <>
            {showCheckIn && (
              <div
                ref={container}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {showCheckIn && <div style={heading}>Before Class</div>}
                {!image && <img src="" alt="" />}
                {image && showCheckIn && (
                  <img
                    src={image + `?dummy=${currentDate}`}
                    alt={alt}
                    className={
                      identity === "tutor"
                        ? "feelingChartGifImage"
                        : "feelingChartGifImage"
                    }
                  />
                )}
              </div>
            )}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {showCheckIn && (
                <div className="" style={heading}>
                  After Class
                </div>
              )}
              {!image2 && <img src="" alt="" />}
              {image2 && (
                <img
                  src={image2 + `?dummy=${currentDate}`}
                  alt={alt2}
                  className={
                    identity === "tutor"
                      ? "feelingChartGifImage"
                      : "feelingChartGifImage"
                  }
                />
              )}
            </div>
          </>
        )}
      </div>
    )
  );
}

const heading = {
  fontSize: 18,

  fontWeight: 600,
};
