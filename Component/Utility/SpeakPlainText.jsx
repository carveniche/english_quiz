import React, { useEffect, useState } from "react";
import Lottie from "react-lottie";
import paused from "../Solution/AudioPaused.json";
import playing from "../Solution/AudioPlaying.json";

export default function SpeakPlainText({ readText }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    if (readText) setText(readText);
  }, [readText]);

  const readTheQuestionText = () => {
    const voicesAvailable = window.speechSynthesis.getVoices();

    if (isSpeaking || text.length === 0) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";

    const preferredVoices = [
      "Google UK English Male",
      "Google UK English Female",
      "Daniel",
      "Microsoft David",
      "Microsoft Zira"
    ];

    const selectedVoice = voicesAvailable.find((voice) =>
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

  const animationOptions = {
    loop: true,
    autoplay: true,
    animationData: isSpeaking ? playing : paused,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div style={{ cursor: "pointer" }} onClick={readTheQuestionText}>
      <Lottie
        options={animationOptions}
        height={"50px"}
        width={"50px"}
        isClickToPauseDisabled
      />
    </div>
  );
}
