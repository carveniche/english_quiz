import Lottie from "lottie-react";
import React, { useState, useRef } from "react";
import { transform } from "lodash";
import audioPlayer from '../Solution/audioPlayer.json'
export default function AudiPlayerComponent({ resources }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const [initialAnimate, setInitialAnimate] = useState(false)
  const handleAudioToggle = () => {
    setInitialAnimate(true)
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
          maxWidth: 65,
          minHeight: 65,
          maxHeight: 65,
          maxWidth: 65,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          position: 'relative'

        }}
      >
        {
          !initialAnimate && (
            <Lottie
              width={'100%'}
              animationData={audioPlayer}
              loop={true}
              autoplay

            />
          )

        }
        <Svg isPlaying={isPlaying} initialAnimate={initialAnimate} />

        {/* <img  src={isPlaying ? playing:paused } alt="not found" style={imgStyle(initialAnimate)}/> */}
        {/* <img
          src={
            isPlaying
              ? "https://d1t64bxz3n5cv1.cloudfront.net/Animation+-+1729854589712.gif"
              : "https://d1t64bxz3n5cv1.cloudfront.net/audio-active_11781836.gif"
          }
          alt="Audio Control"
          style={{ width: 26, height: 26 }}
        /> */}
        <audio ref={audioRef} src={resources[0].url} onEnded={handleAudioEnd} />
      </div>
    </>
  );
}


function Svg({ isPlaying, initialAnimate }) {
  return (
    <svg style={imgStyle(initialAnimate)} xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 45 45" fill="none">
      <circle cx="22.5" cy="22.5" r="22.5" fill="#D17DFF" />
      {
        isPlaying ?
          <>
            <rect x="17" y="15" width="4" height="15" rx="2" fill="white" />
            <rect x="24" y="15" width="4" height="15" rx="2" fill="white" />
          </>
          :
          <path d="M31.9108 21.6241C32.6006 22.0043 32.6006 22.9956 31.9108 23.3757L18.4827 30.7761C17.8162 31.1434 17 30.6613 17 29.9003L17 15.0996C17 14.3386 17.8162 13.8565 18.4827 14.2238L31.9108 21.6241Z" fill="white" />
      }
    </svg>
  )
}

const imgStyle = (initialAnimate) => ({
  visibility: initialAnimate ? "visible" : "hidden",
  width: "34px",
  height: "34px",
  position: "absolute",
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -60%)",
});
