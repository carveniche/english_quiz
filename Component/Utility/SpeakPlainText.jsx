import React, { useEffect, useState } from "react";
import Lottie from "react-lottie";
import * as paused from "../Solution/AudioPaused.json";
import * as playing from "../Solution/AudioPlaying.json";

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

    // Attempt to load voices right away
    loadVoices();
    // If voices aren't ready yet, listen for when they become available
    window.speechSynthesis.onvoiceschanged = () => {
      loadVoices();
    };
  }, []);

  const readTheQuestionText = () => {
    if (!text || text.trim().length === 0) return;

    if (isSpeaking) {
      // Stop if already speaking
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(true);
    if (voicesAvailable.length === 0) {
      // Retry after delay if voices not ready
      console.log("Voices not yet available. Retrying...");
      setTimeout(readTheQuestionText, 200);
      return;
    }

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

    // 🔊 Triggers when speech starts
    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    // 🛑 Triggers when speech ends or gets cancelled
    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      setIsSpeaking(false);
      console.error("Speech as synthesis error:", event.error);
    };

    window.speechSynthesis.speak(utterance);
  };
  const playingOptions = {
    loop: true,
    autoplay: true,
    animationData: playing,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const pausedOptions = {
    loop: true,
    autoplay: true,
    animationData: paused,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <>
      <div style={{ cursor: "pointer" }} onClick={readTheQuestionText}>
        <Lottie
          options={isSpeaking ? playingOptions : pausedOptions}
          height={"50px"}
          width={"50px"}
          cursor={"pointer"}
        />
      </div>
    </>
  );
}