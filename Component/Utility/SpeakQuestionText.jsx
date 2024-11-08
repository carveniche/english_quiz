import React, { useEffect, useState } from "react";
import playing from "../assets/Images/PlayingAudioAnimation.gif";
import paused from "../assets/Images/PlayAudioLottie.gif";

export default function SpeakQuestionText({ readText }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [text, setText] = useState("");
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    if (readText.length > 0) {
      let combinedText = readText.reduce((acc, node) => acc + node.value, "");
      if (combinedText.includes("__")) {
        while (combinedText.includes("__")) {
          combinedText = combinedText.replaceAll("__", "_");
        }
      }
      combinedText = combinedText.replaceAll("_", " blank ");
      setText(
        combinedText
          .split(".")
          .map((line) => line.trim())
          .filter(Boolean)
      );
    }

    setVoices(window.speechSynthesis.getVoices());

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      window.speechSynthesis.cancel();
    };
  }, [readText.length]);

  const readTheQuestionText = () => {
    console.log("isSpeaking", isSpeaking);
    console.log("text.length", text);
    if (isSpeaking || text.length === 0) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text.join(". "));
    utterance.voice = voices[12] || voices[0];
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
      console.error("Speech as synthesis error:", event.error);
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <>
      {/* <VolumeUpIcon
        style={{
          width: "35px",
          height: "35px",
          color: "#23bdf0",
          cursor: "pointer",
        }}
        onClick={readTheQuestionText}
      /> */}
      <img
        // src={isSpeaking ? playing : paused}
        src={
          isSpeaking
            ? "/assets/new_home/PlayingAudioAnimation.gif"
            : "/assets/new_home/PlayAudioLottie.gif"
        }
        style={{ maxWidth: "50px", maxHeight: "50px", cursor: "pointer" }}
        onClick={readTheQuestionText}
        alt="play"
      />
    </>
  );
}
