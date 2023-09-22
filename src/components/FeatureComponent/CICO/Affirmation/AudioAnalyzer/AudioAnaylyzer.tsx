import React, { useEffect, useRef } from "react";

export default function AudioAnaylyzer({ setMicRef }) {
  let scriptProcessor2 = useRef("");
  let mediaStream = useRef("");

  useEffect(() => {
    try {
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
        })
        .then(function (stream) {
          const audioContext = new AudioContext();
          mediaStream.current = stream;
          let analyser = audioContext.createAnalyser();
          var biquadFilter = audioContext.createBiquadFilter();
          biquadFilter.type = "highshelf";
          biquadFilter.frequency.value = 1000;
          biquadFilter.gain.value = 0.7;
          let microphone = audioContext.createMediaStreamSource(stream);
          let scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);
          analyser.smoothingTimeConstant = 0.8;
          analyser.fftSize = 1024;
          microphone.connect(analyser);
          analyser.connect(scriptProcessor);
          scriptProcessor.connect(audioContext.destination);
          scriptProcessor.onaudioprocess = function () {
            const array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            const arraySum = array.reduce((a, value) => a + value, 0);
            const average = arraySum / array.length;
            if (average >= 14) setMicRef(true);
            else setMicRef(false);

            scriptProcessor2.current = scriptProcessor;

            // colorPids(average);
          };
        })
        .catch(function (err) {
          /* handle the error */
          console.error(err);
        });
    } catch (e) {}
    return () => {
      typeof scriptProcessor2?.current?.disconnect === "function" &&
        scriptProcessor2?.current?.disconnect();
    };
  }, []);
  return <></>;
}
