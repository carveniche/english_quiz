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
import styles from "./Listening.module.css";
import { IconButton } from "@mui/material";
// import PandaSvg from "./PandaSvg";
import stopAllMedia from "../../../CommonComponent/stopAllMedia";
export default function ListeningPlayer({ audioUrl, autoPlay }) {
  const audioRef = useRef();
  const [currentTime, setCurrentTime] = useState(0);
  let [totalTime, setTotalTime] = useState(0);
  const [progress, setProgress] = React.useState(0);
  const [play, setPlay] = useState(false);
  const [isMute, setIsMute] = useState(false);




  const handlePlayPause = () => {
     stopAllMedia()
    if (play) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
   
    audioRef.current.muted = isMute;
    setPlay(!play);
  };
  const handleMuteUnmute = (isMute) => {
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
        if (!audioRef.current) return;
        audioRef.current.ontimeupdate = handleTimeUpdate;

        setIsMute(audioRef.current.muted || false);
        if (autoPlay)
          handlePlayPause()
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
    <div className={styles.listening_player_container}>
      <audio ref={audioRef} src={audioUrl} style={{ display: "none" }} onPause={()=>setPlay(false)}></audio>
     
      <div className={styles.audio_control_section}>

        <div className={styles.audio_info}>
          <h3 className={styles.audio_info_title}>Story Title</h3>
          <p className={styles.audio_time}>
            {timerFormatter(currentTime)} / {timerFormatter(totalTime)}
          </p>

        </div>

        <div className={styles.audio_progress_section}>
          <div className={styles.audio_progress_bar} style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className={styles.audio_controls}>
        <IconButton onClick={() => handleMuteUnmute(true)} sx={audio_control_button(isMute==true)}>
          <VolumeOff />
        </IconButton>

        <IconButton onClick={() => handleSliceAudio(-10)} sx={audio_control_button(false)}>
          <Replay10Icon />
        </IconButton>
        <IconButton onClick={handlePlayPause} sx={audio_control_button_big}>
          {play ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>
        <IconButton onClick={() => handleSliceAudio(10)} sx={audio_control_button(false)} >
          <Forward10Icon />
        </IconButton>
        <IconButton onClick={() => handleMuteUnmute(false)} sx={audio_control_button(isMute==false)}>
          <VolumeUp />
        </IconButton>

      </div>
    </div>
  );
}

const audio_control_button = (isMute=false) => ({
  width: `${30}px`,
  height: `${30}px`,
  backgroundColor: isMute ? "#3e3b3b" :"rgba(0, 0, 0, 0.25)",
  color: "#fff",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.35)"
  },
  "& svg": {
    width: "17px",
    height: "17px"
  }
});
const audio_control_button_big = {
  width: "46px",
  height: "46px",
  backgroundColor: "rgba(0, 0, 0, 0.25)",
  color: "#fff",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.35)"
  },
  "& svg": {
    width: "28px",
    height: "28px"
  }
};



