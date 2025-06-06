import React, { useState, useRef } from "react";

export default function AudiPlayerComponent({ resources }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const handleAudioToggle = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
  };
  return (
    <>
      <div
        onClick={handleAudioToggle}
        style={{
          width: 80,
          height: 80,
          backgroundImage: `url("https://d1t64bxz3n5cv1.cloudfront.net/Hearing.png")`, // Replace with your background image URL
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          marginLeft:"10px",
          marginTop:"5px"
        }}
      >
        <img
          src={
            isPlaying
              ? "https://d1t64bxz3n5cv1.cloudfront.net/Animation+-+1729854589712.gif"
              : "https://d1t64bxz3n5cv1.cloudfront.net/audio-active_11781836.gif"
          }
          alt="Audio Control"
          style={{ width: 35, height: 35 }}
        />
        <audio ref={audioRef} src={resources[0].url} onEnded={handleAudioEnd} />
      </div>
    </>
  );
}
