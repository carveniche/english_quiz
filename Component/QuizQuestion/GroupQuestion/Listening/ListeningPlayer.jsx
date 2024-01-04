import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import React, { useEffect, useRef, useState } from "react";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Forward10Icon from "@mui/icons-material/Forward10";
import Replay10Icon from "@mui/icons-material/Replay10";
import Button from "@mui/material/Button";
import { VolumeOff } from "@mui/icons-material";
import { VolumeUp } from "@mui/icons-material";
export default function ListeningPlayer({ audioUrl }) {
  const audioRef = useRef();
  const [currentTime, setCurrentTime] = useState(0);
  let [totalTime, setTotalTime] = useState(0);
  const [progress, setProgress] = React.useState(0);
  const [play, setPlay] = useState(false);
  const [isMute, setIsMute] = useState(false);
  const handlePlayPause = () => {
    if (play) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    audioRef.current.muted = isMute;
    setPlay(!play);
  };
  const handleMuteUnmute = (isMute) => {
    console.log(isMute);
    setIsMute(isMute);
    audioRef.current.muted = isMute;
  };
  const handleTimeUpdate = (e) => {
    let { currentTime } = e.target;
    if (!totalTime) {
      totalTime = e.target.duration;
    }
    let progress = (currentTime * 100) / totalTime;
    setProgress(progress);
    setCurrentTime(Math.floor(currentTime));
  };
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.ontimeupdate = handleTimeUpdate;
      audioRef.current.onloadedmetadata = function () {
        audioRef.current.ontimeupdate = handleTimeUpdate;

        setIsMute(audioRef.current.muted || false);

        setTotalTime(audioRef.current.duration);
        audioRef.current.onended = function () {
          setPlay(false);
        };
      };
    }
    return () => {
      if (audioRef.current) {
        typeof audioRef.current.pause == "function" && audioRef.current.pause();
      }
    };
  }, []);
  const handleSliceAudio = (val) => {
    const { currentTime, duration } = audioRef.current;
    let sliceTime = currentTime + val;
    if (sliceTime < 0) sliceTime = 0;
    else if (sliceTime > duration) {
      sliceTime = duration;
    }
    console.log(sliceTime);
    audioRef.current.currentTime = sliceTime;
  };
  const timerFormatter = (currentTime) => {
    currentTime = Math.floor(currentTime);
    let mm = Math.floor(currentTime / 60);
    let ss = currentTime % 60;
    return `${mm.toString().padStart(2, "0")}:${ss
      .toString()
      .padStart(2, "0")}`;
  };
  return (
    <div
      style={{
        width: "calc(100% + 64px )",
        padding: 10,
        margin: "auto",
        marginLeft: -32,
        background: "rgba(0, 255, 255, 0.5)",
        marginBottom: -32,
        boxShadow: "border-box",
      }}
    >
      <audio ref={audioRef} src={audioUrl} style={{ display: "none" }}></audio>
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {play ? (
          <Button onClick={handlePlayPause}>
            <PauseIcon />
          </Button>
        ) : (
          <Button onClick={handlePlayPause}>
            <PlayArrowIcon />
          </Button>
        )}
        <Box sx={{ width: "350px" }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ height: 10 }}
          />
        </Box>
        <div>
          <p style={{ fontWeight: "bold", fontSize: 12, fontColor: "black" }}>
            {timerFormatter(currentTime)} | {timerFormatter(totalTime)}
          </p>
        </div>
      </div>
      <div
        style={{
          display: "flex",

          justifyContent: "center",
          width: "100%",
        }}
      >
        <Button onClick={() => handleSliceAudio(-10)}>
          <Replay10Icon />
        </Button>
        {isMute ? (
          <Button onClick={() => handleMuteUnmute(false)}>
            <VolumeOff />
          </Button>
        ) : (
          <Button>
            <VolumeUp onClick={() => handleMuteUnmute(true)} />
          </Button>
        )}
        <Button>
          <Forward10Icon onClick={() => handleSliceAudio(10)} />
        </Button>
      </div>
    </div>
  );
}
