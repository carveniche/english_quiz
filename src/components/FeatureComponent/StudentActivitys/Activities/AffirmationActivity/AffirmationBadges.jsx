import React, { useEffect, useState } from "react";
import styles from "./Affirmation.module.css";
// const arr=[
//     "/static/media/badgesgif/1.",
//     "/static/media/badges/2.png",
//     "/static/media/badges/3.png",
//     "/static/media/badges/4.png",
//     "/static/media/badges/5.png",
//     "/static/media/badges/6.png",
//     "/static/media/badges/7.png"

// ]

export default function AffirmationBadges({
  checkIn,
  selectedItem,
  visibility,
}) {
  return (
    <div style={{ visibility }}>
      <img
        src={checkIn ? selectedItem?.image : selectedItem?.gif_image} //technically gif_image
        style={{
          minWidth: 150,
          width: 150,
          maxWidth: 120,
          objectFit: "fill",
        }}
      />
    </div>
  );
}

export function AffirmationBadges2({ bottom, item }) {
  const [state, setState] = useState(Date.now());
  const [image, setImage] = useState(item?.image);
  useEffect(() => {
    if (item?.image) setImage(item?.image);
  }, [item?.image]);
  return (
    <div
      className={styles.photoBadges}
      style={{
        width: 80,
        height: 80,
        padding: 0,
        margin: 0,
        transform: "rotate(-30deg)",
        right: 0,
        bottom: 0,
      }}
    >
      {image && (
        <img
          crossOrigin=""
          src={image + "?dummy=" + state}
          alt={item?.name}
          style={{
            height: "160px",
            minHeight: "160px",
            maxHeight: "160px",
            minWidth: "160px",
            width: "160px",
            maxWidth: "160px",

            objectFit: "fill",
          }}
        />
      )}
    </div>
  );
}
