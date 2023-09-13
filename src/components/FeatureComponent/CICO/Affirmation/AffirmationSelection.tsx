import React from "react";
import styles from "./affirmation.module.css";

export default function AffirmationSelection({
  affirmation,
  onClick,
  currentIndex,
  className,
  identity = "tutor",
  checkIn,
  micRef,
}) {
  const handleClick = (i: number) => {
    typeof onClick === "function" && onClick(i);
  };

  return (
    <div className={styles[className]}>
      {checkIn ? (
        affirmation?.map((item, i) => {
          return (
            item &&
            i < 2 && (
              <div
                key={i}
                onClick={() => handleClick(i)}
                style={{
                  backgroundColor:
                    i === currentIndex || affirmation?.length === 1
                      ? "black"
                      : "initial",
                  borderColor: "black",
                  width: "250px",
                  height: "250px",
                  borderRadius: "50%",
                  padding: 0,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div>
                  <img
                    src={item?.image} //item?.image
                    alt={item?.name}
                    style={{
                      width: "240px",
                      height: "240px",
                      display: "block",
                    }}
                  />
                </div>
              </div>
            )
          );
        })
      ) : (
        <AffirmationSelectionCheckout
          item={affirmation[0]}
          i={0}
          micRef={micRef}
        />
      )}
    </div>
  );
}

const AffirmationSelectionCheckout = ({ item, i, micRef }) => {
  return (
    <>
      <div
        key={i}
        style={{
          width: "360px",
          height: "360px",
          padding: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          border: 0,
        }}
      >
        <div
          style={{
            background: "#b9c2fc",
            borderColor: "black",

            width: "281px",
            height: "281px",
            borderRadius: "50%",
            padding: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
          }}
          className={micRef ? styles.animation : ""}
        ></div>
        <div>
          <img
            src={item?.image} // need to replace by this item?.image
            style={{
              width: "300px",
              height: "300px",
              display: "block",
              position: "relative",
            }}
            alt={item?.name}
          />
        </div>
      </div>
    </>
  );
};
