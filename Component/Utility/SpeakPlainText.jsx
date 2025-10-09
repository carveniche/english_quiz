import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import { cloneDeep } from "lodash";
import paused from "../Solution/AudioPaused.json";
import playing from "../Solution/AudioPlaying.json";
import { VolumeUp } from "@mui/icons-material";
import { IconButton } from "@mui/material";

export default function SpeakPlainText({ readText }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [text, setText] = useState("");
  const [voicesAvailable, setVoicesAvailable] = useState([]);

  useEffect(() => {
    if (readText) setText(readText);
  }, [readText]);

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setVoicesAvailable(voices);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    window.speechSynthesis.cancel();
  }, []);

  const readTheQuestionText = () => {
  
    if (!text || text.trim().length === 0) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (voicesAvailable.length === 0) {
      console.log("Voices not yet available. Retrying...");
      setTimeout(readTheQuestionText, 200);
      return;
    }

    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";

    const preferredVoices = [
      "Google UK English Male",
      "Google UK English Female",
      "Daniel",
      "Microsoft David",
      "Microsoft Zira",
    ];

    const selectedVoice = voicesAvailable.find(voice =>
      preferredVoices.includes(voice.name)
    );

    utterance.voice = selectedVoice || voicesAvailable[0];

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      setIsSpeaking(false);
      console.error("Speech synthesis error:", event.error);
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <>

       <IconButton sx={speakingStyle(isSpeaking)} onClick={readTheQuestionText}>
        <VolumeUp/>
       </IconButton>
      {/* <Lottie
        key={isSpeaking ? "playing" : "paused"}
        animationData={cloneDeep(isSpeaking ? playing : paused)}
        loop
        autoplay
        style={{ height: "50px", width: "50px", cursor: "pointer" }}
      /> */}
    </>
  );
}
const speakingStyle = (isSpeaking) => ({
  backgroundColor: "transparent",
  width:"32px",
  height:"32px",
  border: "none",
  cursor: "pointer",
  color: isSpeaking ? "#86C440" : "#32C7FF",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
});