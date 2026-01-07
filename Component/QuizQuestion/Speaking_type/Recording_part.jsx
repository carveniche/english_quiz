
import React, { useState, useEffect, useRef, useContext } from "react";
// import recordingGIF from "../../assets/Images/record.gif"
import SolveButton from "../../CommonComponent/SolveButton";
import CustomAlertBoxVoice from "../../CommonComponent/CustomAlertBoxVoice";
import { ValidationContext } from "../../QuizPage";
import LinearProgressBar from "../Writing/LinearProgressBar";
import getTextFromQuestion from "../../Utility/getTextFromQuestion";
import axios from "axios";
import { OuterPageContext } from "../GroupQuestion/ContextProvider/OuterPageContextProvider";
import React_Base_Api from "../../../ReactConfigApi";
import QuestionCommonContent from "../../CommonComponent/QuestionCommonContent";
import { Headphones, Mic} from "@mui/icons-material";
import { IconButton} from "@mui/material";
import GptFeedback from "../../Utility/GptFeedBack";
import stopAllMedia from "../../CommonComponent/stopAllMedia";
import AudioRecordingModal from "./AudioRecordingModal";
//import styles from "../../QuizQuestion/english_mathzone.module.css";
export default function Recording_part({ questionData, questionResponse, setIsTrue, wordsLength }) {
  const { setHasQuizAnswerSubmitted } = useContext(OuterPageContext);
  const {
    submitResponse,
    disabledQuestion,
    setIsCorrect,
    setSubmitResponse,
    setStudentAnswer,
    showSolution,
    readOut,
    isEnglishTest,
  } = useContext(ValidationContext);
  const chatGptResponseRef = useRef("");
  const scoreRef = useRef(null);
  const [gptResponseLoading, setGptResponseLoading] = useState(true);
  const [redAlert, setRedAlert] = useState(false);
  const [showChatGptResponse, setShowChatGptResponse] = useState(false);
  const [open, setOpen] = useState(false);
  const [audioPermission, setAudioPermission] = useState(true);
  const isApiCalled = useRef(false);
  let quizFromRef = useRef(sessionStorage.getItem("engQuizFrom"));

  // recording part states
  const [stateIndex, setStateIndex] = useState(0);
  const [audioURL, setAudioURL] = useState("");
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const audioFileRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const [isRecorder, setIsRecorder] = useState(false)
  const [payedTime, setPayedTime] = useState("00:00");
  const [audioDuration, setAudioDuration] = useState("00:00");
  const [isPlaying, setIsPlaying] = useState(false);
  const [checkAudioPermision,setCheckAudioPermision]=useState(false)
  const audioRefplay = useRef(null);

 useEffect(() => {
  return () => {
    if (mediaRecorderRef.current) {
      try {
        if (mediaRecorderRef.current.state !== "inactive") {
          mediaRecorderRef.current.stop();
        }
      } catch (e) {}

      // Stop mic tracks
      mediaRecorderRef.current.stream?.getTracks().forEach(track => track.stop());
    }
  };
}, []);

 function isSafari() {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

function startWavRecorder(stream) {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  const audioCtx = new AudioContextClass();
  const source = audioCtx.createMediaStreamSource(stream);
  const processor = audioCtx.createScriptProcessor(4096, 1, 1);
  const chunks = [];

  processor.onaudioprocess = (e) => {
    chunks.push(new Float32Array(e.inputBuffer.getChannelData(0)));
  };

  source.connect(processor);
  processor.connect(audioCtx.destination);

  return {
    stop: () => {
      processor.disconnect();
      source.disconnect();
      audioCtx.close();
      return encodeWav(chunks, audioCtx.sampleRate);
    }
  };
}


function encodeWav(chunks, sampleRate) {
  let totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);

  // WAV header + PCM data
  let buffer = new ArrayBuffer(44 + totalLength * 2);
  let view = new DataView(buffer);

  function writeString(offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  // RIFF header
  writeString(0, "RIFF");
  view.setUint32(4, 36 + totalLength * 2, true);
  writeString(8, "WAVE");

  // fmt chunk
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);      // PCM header size
  view.setUint16(20, 1, true);       // Audio format = PCM
  view.setUint16(22, 1, true);       // Channels = 1
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); // Byte rate
  view.setUint16(32, 2, true);       // Block align
  view.setUint16(34, 16, true);      // Bits per sample

  // data chunk
  writeString(36, "data");
  view.setUint32(40, totalLength * 2, true);

  // PCM samples
  let offset = 44;
  chunks.forEach(chunk => {
    for (let i = 0; i < chunk.length; i++) {
      let s = Math.max(-1, Math.min(1, chunk[i]));  
      view.setInt16(offset, s * 0x7FFF, true);
      offset += 2;
    }
  });

  return new Blob([view], { type: "audio/wav" });
}

function audioRecordingStoping() {
  chunksRef.current = [];
  audioFileRef.current = null;
  setAudioURL("");
  setPayedTime("00:00");

  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {

      if (isSafari()) {
        // SAFARI → WAV RECORDER
        const wavRecorder = startWavRecorder(stream);

        mediaRecorderRef.current = {
          type: "wav",
          recorder: wavRecorder,
          stream
        };

      } else {
        // CHROME / FIREFOX → WEBM RECORDER
        const mimeType = "audio/webm;codecs=opus";
        const recorder = new MediaRecorder(stream, { mimeType });

        recorder.ondataavailable = (e) => {
          chunksRef.current.push(e.data);
        };

        recorder.onstop = () => {
          clearInterval(timerIntervalRef.current);

          const blob = new Blob(chunksRef.current, { type: mimeType });
          chunksRef.current = [];

          const url = URL.createObjectURL(blob);
          audioFileRef.current = blob;
          setAudioURL(url);
        };

        mediaRecorderRef.current = {
          type: "webm",
          recorder,
          stream
        };

        recorder.start();
      }
    })
    .catch((err) => {
      if (err.name === "NotAllowedError") setAudioPermission(false);
      console.error(err);
    });
}

  const startTimer = () => {
    const startTime = Date.now();
    timerIntervalRef.current = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const formattedTime = formatTime(elapsedTime);
      setAudioDuration(formattedTime); // Update the timer display
    }, 1000);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    return formattedTime;
  };


  const handleRecord = () => {
    if (!audioPermission) return
    if (stateIndex === 1) {
      handleStopRecording()
      return;
    }
    stopAllMedia()
    setIsPlaying(false);
    if (stateIndex == 2) {
      setAudioDuration("00:00");
      setStateIndex(0);
      setIsRecorder(false)
    } else {
      audioRecordingStoping()
      setIsRecorder(true)
      setStateIndex(1);
      startTimer(); // Start the timer when recording starts
    }
  }

  const handleStopRecording = () => {
  setIsRecorder(false);

  // ---- SAFARI WAV FALLBACK ----
  if (mediaRecorderRef.current?.type === "wav") {
    clearInterval(timerIntervalRef.current);

    const seconds = timeToSeconds(audioDuration);

    if (seconds >= 5) {
      const wavBlob = mediaRecorderRef.current.recorder.stop();
      const url = URL.createObjectURL(wavBlob);

      audioFileRef.current = wavBlob;
      setAudioURL(url);

      setStateIndex(2);  // show playback UI
    } else {
      setStateIndex(0);
      setTimeout(() => {
        setAudioURL("");
        setAudioDuration("00:00");
      }, 200);
    }

    return; 
  }

  // ---- NORMAL MEDIARECORDER (WEBM) ----
  if (mediaRecorderRef.current?.type === "webm") {
    try {
      mediaRecorderRef.current.recorder.stop();
    } catch (e) {}

    clearInterval(timerIntervalRef.current);

    const seconds = timeToSeconds(audioDuration);

    if (seconds >= 5) {
      setStateIndex(2);
    } else {
      setStateIndex(0);
      setTimeout(() => {
        setAudioURL("");
        setAudioDuration("00:00");
      }, 200);
    }

    return;
  }

  // ---- BACKUP: YOU HAD old logic ----
  if (mediaRecorderRef.current) {
    try {
      mediaRecorderRef.current.stop();
    } catch (e) {}
  }

  clearInterval(timerIntervalRef.current);
  const seconds = timeToSeconds(audioDuration);

  if (seconds >= 5) {
    setStateIndex(2);
  } else {
    setStateIndex(0);
    setTimeout(() => {
      setAudioURL("");
      setAudioDuration("00:00");
    }, 200);
  }
};


// const handleStopRecording = () => {
//     setIsRecorder(false);
//     if (mediaRecorderRef.current) {
//         try {
//             mediaRecorderRef.current.stop();
//         } catch (e) {}
//     }

//     clearInterval(timerIntervalRef.current);

//     const seconds = timeToSeconds(audioDuration);
//     if (seconds >= 5) {
//         // show playback UI
//         setStateIndex(2); 
//     } else {
//         // too short → retry
//         setStateIndex(0);
//        setTimeout(() => {
//         setAudioURL("");
//         setAudioDuration("00:00");
//        }, 200);
        
//     }
// };


  function timeToSeconds(t) {
    const [min, sec] = t.split(":").map(Number);
    return min * 60 + sec;
  }

  const apiCalled = (prompt_text) => {
    const CONFIG_URL2 = window.CONFIG_URL || React_Base_Api;
    let formData = new FormData();
    formData.append("prompt_text", prompt_text);
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${CONFIG_URL2}app_teachers/gpt_response`,
      data: formData,
    };

    return axios(config);
  };

  // const handlePromptRequest = async (prompt_text) => {
  //   setShowChatGptResponse(true);
  //   setIsTrue(true);
  //   setGptResponseLoading(true);
  //   let questionText = questionData?.questionName;
  //   let instruction = questionData.prompt_text || "";
  //   questionText = getTextFromQuestion(questionText);
  //   let quizFrom = quizFromRef.current;
  //   let stateRef = [];
  //   let apiArray = [];
  //   if (!prompt_text) {
  //     prompt_text = "No response";
  //   }
  //   //let question_text = `The following question is asked to a student: '${questionText}'.'\nA student gives the following response to the question: .${prompt_text}\n'.Use this instruction ${instruction}. To Evaluate the response, and give feedback  in less than 100 words`;

  //   let question_text = `The following question was asked to a student: '${questionText}'. 
  //     A student responded:
  //     '${prompt_text}'. 
      
  //     Use this instruction: ${instruction}. To evaluate the response, return the score as **1** if the response is correct; otherwise, return the score as **0**.  
      
  //     ### **Return Format:**  
  //     Strictly return **only valid JSON** as shown below:  
    
  //     {
  //         "score": <either 1 or 0>,
  //         "feedback": "<Give general feedback on the student's response without using exact words from the response. Do not suggest retrying or reattempting. Keep it under 100 words. Do not include the score in the feedback.>"
  //     }
  
  //     Ensure that the score is always **either 1 or 0**. **Do not include any additional text, explanations, or formatting outside the JSON output.**`;
  //   stateRef.push(chatGptResponseRef);
  //   stateRef.push(scoreRef);

  //   apiArray[0] = apiCalled(question_text || "");

  //   try { 
  //     let allData = await Promise.all(apiArray);
  //     allData = allData || [];

  //     allData.forEach(({ data }, index) => {
  //       data = data?.data || {};
  //       data = data.choices || [];
  //       stateRef[index].current = data[0]?.message?.content;
  //     });

  //     setGptResponseLoading(false);
  //     handleSubmit();
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  // const handleSubmit = () => {
  //   if (submitResponse) return;
  //   if (disabledQuestion) return;
  //   setRedAlert(false);

  //   setSubmitResponse(true);

  //   try {
  //     if (chatGptResponseRef?.current) {
  //       const { feedback, score } = JSON.parse(chatGptResponseRef?.current);
  //       scoreRef.current = score;
  //       chatGptResponseRef.current = feedback;
  //     }
  //   } catch (error) {
  //     console.error("error score", error);
  //   }


  //   let obj = {
  //     audio_response: audioFileRef.current,
  //     chatGptResponse: chatGptResponseRef.current,
  //     score: Number(scoreRef.current),
  //   };


  //   typeof window.handleChangeNextQuestion == "function" &&
  //     window.handleChangeNextQuestion(obj);
  //   if (quizFromRef.current !== "diagnostic") {
  //     setIsCorrect(scoreRef.current == 1 ? 1 : 0);
  //   }
  //   setStudentAnswer(obj);
  //   typeof setHasQuizAnswerSubmitted === "function" &&
  //     setHasQuizAnswerSubmitted(true);
  //   return scoreRef.current == 0 ? 0 : 1;
  // };



  // const AudioTransalator_old = async (audioF) => {
  //   try {

  //     let blobfile = new File([audioFileRef.current], "audio.mp3", {
  //       type: "audio/mp3",
  //       lastModified: Date.now(),
  //     });

  //     const CONFIG_URL12 = window.CONFIG_URL12 || React_Base_Api;
  //     // const CONFIG_URL12 = window.CONFIG_URL12 || "https://staging.begalileo.com/";

  //     let formData = new FormData();
  //     formData.append("file", blobfile);
  //     formData.append("model", "whisper-1");
  //     formData.append("language", "en");
  //     formData.append("type", "audio");
  //     let config = {
  //       method: "POST",
  //       maxBodyLength: Infinity,
  //       url: `${CONFIG_URL12}app_teachers/gpt_response`,
  //       data: formData,
  //     };
  //     let audiotext = await axios(config);
  //     const data_text = audiotext.data.data.text;
  //     setShowChatGptResponse(true);
  //     setIsTrue(true);
  //     setGptResponseLoading(true);
  //     handlePromptRequest(data_text);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const AudioTransalator = async (audioF) => {
    try {
      setShowChatGptResponse(true);
      setIsTrue(true);
      setGptResponseLoading(true);
      // let blobfile = new File([audioFileRef.current], "audio.mp3", {
      //   type: "audio/mp3",
      //   lastModified: Date.now(),
      // });

      // const CONFIG_URL12 = window.CONFIG_URL12 || React_Base_Api;
      //  co
      // nst CONFIG_URL12 = window.CONFIG_URL12 || "https://staging.begalileo.com/";

      // let formData = new FormData();
      // formData.append("file", blobfile);
      // formData.append("model", "whisper-1");
      // formData.append("language", "en");
      // formData.append("type", "audio");
      // let config = {
      //   method: "POST",
      //   maxBodyLength: Infinity,
      //   url: `${CONFIG_URL12}app_teachers/gpt_response`,
      //   data: formData,
      // };
      // let audiotext = await axios(config);
      // const data_text = audiotext.data.data.text;
      let obj = {
        audio_response: audioFileRef.current,
        // audio_response_text: data_text,
      }
      setStudentAnswer(obj);
      setIsCorrect('await');
      setSubmitResponse(true);
    typeof setHasQuizAnswerSubmitted === "function" &&
      setHasQuizAnswerSubmitted(true);
    return "await";
      // handlePromptRequest(data_text);
    } catch (error) {
      console.error(error);
    }
  };

  const passAudio = () => {
    if (submitResponse) return;
    if (disabledQuestion) return;
    if (showChatGptResponse) return;
    if (isApiCalled.current) return;
    setRedAlert(false);
    if (!audioURL) {
      setRedAlert(true);
      return -1;
    }

    isApiCalled.current = true;
    AudioTransalator(audioFileRef.current);
  };


  const handleAudioToggle = () => {
    
    if (isPlaying) {
      audioRefplay.current.pause();
     } else {
      audioRefplay.current.play().catch(error => {
        alert("There was an error playing the audio.");
        setIsPlaying(false);
        console.error("Playback error:", error);
      });

    }
    setIsPlaying(!isPlaying);
  };
  



  const handleAudioEnd = () => {
    setIsPlaying(false);
  };


  const formatTimToSeconds = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${minutes < 10 ? '0' : ''}${minutes}:${sec < 10 ? '0' : ''}${sec}`;
  };

  // Event handler for when metadata is loaded
  const handleTimeUpdate = (e) => {
    const audio = e.target;
    const formattedTime = formatTimToSeconds(audio.currentTime);
    setPayedTime(formattedTime);
  };

  useEffect(() => {

    if (!open && isPlaying) {
      handleAudioToggle()
    }
  }, [open])


  window.handleShowChatGptResponse = setShowChatGptResponse
  window.handleChatGptResponse = (response) => {
    if (response) {
      if (typeof response == "string") {
        response = JSON.parse(response);
      }
      const { feedback, score } = response
      scoreRef.current = score;
      chatGptResponseRef.current = feedback;

      setIsCorrect(score == 1 ? 1 : 0);
      setGptResponseLoading(false);
      // setChatGptResponse(response);
    }

  }

  const handleFastForwardRewind = (action) => {
    if (audioRefplay.current) {
      let newTime;
      if (action === 'forward') {
        // Fast forward by 6 seconds
        newTime = Math.min(
          audioRefplay.current.currentTime + 6,  // Add 6 seconds to current time
          audioRefplay.current.duration  // Ensure the time doesn't exceed the duration
        );
      } else {
        // Rewind by 6 seconds
        newTime = Math.max(
          audioRefplay.current.currentTime - 6,  // Subtract 6 seconds from current time
          0  // Ensure the time doesn't go below 0
        );
      }

      audioRefplay.current.currentTime = newTime;  // Set the new time
      const formattedTime = formatTimToSeconds(newTime);  // Format the new time
      setPayedTime(formattedTime);  // Update the state with the formatted time
    }
  };

  useEffect(() => {
    const audio = audioRefplay.current;
    if (!audio) return;

    const extractDuration = () => {
      let dur = audio.duration;

      if (!isFinite(dur) || dur === Infinity || dur === 0) {
        // Force Safari / WebKit to calculate duration
        audio.currentTime = Number.MAX_SAFE_INTEGER;
        audio.ontimeupdate = () => {
          audio.ontimeupdate = null;
          audio.currentTime = 0;

          const realDuration = audio.duration;
          setAudioDuration(formatTimToSeconds(realDuration));
        };
      } else {
        // Normal browser case
        setAudioDuration(formatTimToSeconds(dur));
      }
    };

    audio.addEventListener("loadedmetadata", extractDuration);
    return () => audio.removeEventListener("loadedmetadata", extractDuration);

  }, [audioURL]);


  useEffect(() => {
    if (showSolution && questionResponse?.audio_response) {
      let audio_response = questionResponse.audio_response;

      if (audio_response.includes('.mp3')) {
        audio_response = audio_response.split('.mp3')[0] + '.mp3';
      }

      setAudioURL(audio_response);
    }
  }, [questionResponse]);

  return (
    <>
      <SolveButton onClick={passAudio} />
      {redAlert && !submitResponse && <CustomAlertBoxVoice />}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
          marginTop: "5px",
          width: "100%",
        }}
      >

        <QuestionCommonContent
          obj={questionData}
          wordsLength={wordsLength}
          choicesRef={[]}
          isEnglishStudentLevel={readOut}
        />
        {/* {showSolution && audioURL && <AudioRecorderInterface setOpen={setOpen} audioURL={audioURL} />} */}
        <AudioRecorderInterface setOpen={setOpen} audioURL={audioURL} />

        <AudioRecordingModal
          obj={questionData}
          audioDuration={audioDuration}
          audioPermission={audioPermission}
          handleStartRecording={handleRecord}
          open={open} setOpen={setOpen}
          stateIndex={stateIndex}
          handleAudioToggle={handleAudioToggle}
          isPlaying={isPlaying}
          payedTime={payedTime}
          handleFastForwardRewind={handleFastForwardRewind}
          audioURL={audioURL}
          setAudioURL={setAudioURL}
          isRecorder={isRecorder}

        />

        {(stateIndex === 2 || submitResponse || showSolution) && audioURL && (
          <audio
            id="first"
            ref={audioRefplay}
            src={audioURL}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleAudioEnd}
          />
        )}

        {showChatGptResponse && (
          <div style={{ width: '100%' }}>
            {gptResponseLoading ? (
              <LinearProgressBar type={"speaking"} />
            ) : (
              !isEnglishTest &&
              quizFromRef.current !== "diagnostic" &&
              <GptFeedback
                chatGptResponse={chatGptResponseRef.current}
                scoreResponse={scoreRef.current} />
            )}
          </div>

        )}

        {/* <button id="audio_submit" onClick={passAudio}>Submit Audio</button> */}
      </div>
    </>
  );
};


function AudioRecorderInterface({ setOpen, audioURL }) {
  const {
    submitResponse,
    showSolution,
  } = useContext(ValidationContext);

  const [isTrue, setIsTrue] = useState(false)
  useEffect(() => {

    if (showSolution || submitResponse || audioURL) {
      setIsTrue(true)
    } else {
      setIsTrue(false)
    }
  }, [showSolution, submitResponse, audioURL])

  return (
    <div className="audioRecording_container">
      <div className="audioRecording">
        <IconButton
          onClick={() => setOpen(true)}
          sx={{
            backgroundColor: '#FFFFFF73',
            color: 'white'
          }}>
          {isTrue ? <Headphones /> : <Mic />}
        </IconButton>
      </div>
      <button className="SecondaryButton btn_txt_xl " onClick={() => setOpen(true)}>{isTrue ? "Play Recording" : "Open Audio Recorder "}</button>
    </div>
  );
}


