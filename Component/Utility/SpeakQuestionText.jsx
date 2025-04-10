import React, { useEffect, useState } from "react";
import Lottie from "react-lottie";
import * as paused from "../Solution/AudioPaused.json";
import * as playing from "../Solution/AudioPlaying.json";

export default function SpeakQuestionText({ readText }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [text, setText] = useState("");
  const [voices, setVoices] = useState([]);
  const [canStart, setCanStart] = useState(false);
  useEffect(() => {
    if (readText.length > 0) {
      
      let type = ['a', 'video', 'audio', 'img','br'];

      let combinedText = readText.reduce((acc, node) => {
        return !type.includes(node.node) ? acc + node.value : acc;
      }, "");
    //  let temCombinedText = combinedText.replace(/\s+/g, " ").trim();

      if (combinedText.includes("__")) {
        while (combinedText.includes("__")) {
          combinedText = combinedText.replaceAll("__", "_");
        }
      }
      combinedText = combinedText.replaceAll("_" , " blank ");
      combinedText = combinedText.replaceAll("br" , "");
      setText(
        combinedText
          .split(".")
          .map((line) => line.trim())
          .filter(Boolean)
      );
    }

    const updateVoices = () => {
      console.log("Updating");
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
      }
    };

    updateVoices();

    window.speechSynthesis.onvoiceschanged = updateVoices;
    const timer = setTimeout(() => {
      setCanStart(true);
    }, 1000);
    return () => {
      if (timer) clearTimeout(timer);

      window.speechSynthesis.cancel();
    };
  }, [canStart]);
  useEffect(() => {
    const voiceCheckTimer = setTimeout(() => {
      if (voices.length === 0) {
        console.error("Fallback: No voices loaded");
      }
    }, 2000);
    return () => clearTimeout(voiceCheckTimer);
  }, [voices]);

 const readTheQuestionText = () => {
  const voicesAvailable = window.speechSynthesis.getVoices();

  // If already speaking, cancel the current utterance
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    return;
  }

  // Don't proceed if there's no text to speak
  if (text.length === 0) return;

  const textToSpeak = text.join(". ").trim();

  const utterance = new SpeechSynthesisUtterance(textToSpeak);

  // Preferred voice names across different platforms
  const preferredVoices = [
    "Google UK English Male",  // Chrome
    "Google UK English Female",
    "Daniel",                  // Safari
    "Microsoft David",         // Windows
    "Microsoft Zira"
  ];

  // Select a matching voice or fallback to first available
  const selectedVoice = voicesAvailable.find(voice =>
    preferredVoices.includes(voice.name)
  );

  utterance.voice = selectedVoice || voicesAvailable[0];
  utterance.rate = 0.5; // Adjust speaking speed here (0.1 to 10)

  // Handle start of speech
  utterance.onstart = () => {
    setIsSpeaking(true);
  };

  // Handle end of speech
  utterance.onend = () => {
    setIsSpeaking(false);
    console.log("Speech finished.");
  };

  // Handle any errors during speech
  utterance.onerror = (event) => {
    setIsSpeaking(false);
    console.error("Speech synthesis error:", event.error);
  };

  // Start speaking
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
