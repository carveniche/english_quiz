import React, { useEffect, useState } from "react";
import Lottie from "react-lottie";
import * as paused from "../Solution/AudioPaused.json";
import * as playing from "../Solution/AudioPlaying.json";

export default function SpeakPlainText({ readText }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [text, setText] = useState("");
  const [voices, setVoices] = useState([]);
  const [canStart, setCanStart] = useState(false);
  useEffect(() => {
    if (readText.length > 0) {
      //let combinedText = readText.reduce((acc, node) => acc + node.value, "");
      //if (combinedText.includes("__")) {
       //// while (combinedText.includes("__")) {
         // combinedText = combinedText.replaceAll("__", "_");
        //}
      //}
     const combinedText = readText.replaceAll("_", " blank ");
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
    setIsSpeaking(true);
    const voicesAvailable = window.speechSynthesis.getVoices();
    if (isSpeaking || text.length === 0) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const textNeedstoSpoken = text.join(". ");
    console.log(textNeedstoSpoken)
    const utterance = new SpeechSynthesisUtterance(textNeedstoSpoken);
    utterance.lang="en-US";
    const preferredVoices = [ 
      "Google UK English Male",  // Chrome (Daniel equivalent)
      "Google UK English Female",
      "Daniel",                  // Safari
      "Microsoft David",         // Windows default
      "Microsoft Zira"
  ];

  const selectedVoice = voicesAvailable.find(voice =>
      preferredVoices.includes(voice.name)
  );

    utterance.voice = selectedVoice || voicesAvailable[0];
    if (voices.length === 0) {
      console.error("There was an error while generating speech:");
    }
    utterance.onstart = () => {
      setIsSpeaking(true);
    };

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
