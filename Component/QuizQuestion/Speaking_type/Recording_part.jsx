
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
import { GptFeedback } from "../Writing/Writing";
import QuestionCommonContent from "../../CommonComponent/QuestionCommonContent";
import { Circle, Close, FastForward, FastRewind, Headphones, Info, KeyboardVoiceRounded, Mic, Pause, PauseCircleFilledOutlined, PauseCircleOutlineSharp, PlayArrow, Replay, Stop, StopCircle } from "@mui/icons-material";
import { Alert, Box, duration, IconButton, Modal, Tooltip } from "@mui/material";
// import recordAgain from "../../../Component/assets/Images/Svg/recordAgain.svg";
import objectParser from "../../Utility/objectParser";

 export default function Recording_part  ({ questionData, questionResponse, setIsTrue, wordsLength }) {
  const { setHasQuizAnswerSubmitted } = useContext(OuterPageContext);
  const {
    submitResponse,
    disabledQuestion,
    setIsCorrect,
    setSubmitResponse,
    setStudentAnswer,
    showSolution,
    readOut,
  } = useContext(ValidationContext);
  const chatGptResponseRef = useRef("");
  const scoreRef = useRef(null);
  const [gptResponseLoading, setGptResponseLoading] = useState(false);
  const [redAlert, setRedAlert] = useState(false);
  const [hideCheckButton, setHideCheckButton] = useState(false);
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
  const [isRecorder,setIsRecorder]=useState(false)

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          mediaRecorderRef.current = new MediaRecorder(stream);

          mediaRecorderRef.current.ondataavailable = (e) => {
            chunksRef.current.push(e.data);
          };

          mediaRecorderRef.current.onstop = () => {
            clearInterval(timerIntervalRef.current); // Stop the timer
            // setElapsedTime(0); // Reset the timer

            const blob = new Blob(chunksRef.current, {
              type: "audio/webm; codecs=opus",
            });
            chunksRef.current = [];
            const url = window.URL.createObjectURL(blob);
            setAudioURL(url);
            audioFileRef.current = blob;
          };
        })
        .catch((error) => {
          if (error.name === 'NotAllowedError') {
            setAudioPermission(false)
          }
          console.error("Error accessing media devices.", error);
          // setStateIndex(3);
        });
    } else {
      // setStateIndex(3);
    }

  }, []);

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

    if(!audioPermission) return

    if (stateIndex === 1) {
      handleStopRecording()
      return;
    }
    setIsPlaying(false);
    if (stateIndex == 2) {
      setAudioDuration("00:00");
      setStateIndex(0);
      setIsRecorder(false)
    } else {
      setStateIndex(1);
      mediaRecorderRef.current.start();
      startTimer(); // Start the timer when recording starts
      setIsRecorder(true)
    }


  };

  const handleStopRecording = () => {
    setIsRecorder(false)
    mediaRecorderRef.current.stop();
    clearInterval(timerIntervalRef.current); // Stop the timer when recording stops  
  if (timeToSeconds(audioDuration) >= timeToSeconds("00:05")) {
    setStateIndex(2);
  }else{
    setAudioDuration("00:00")
    setStateIndex(0);
    setAudioURL("")
  }
 
  };


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

  const handlePromptRequest = async (prompt_text) => {
    setHideCheckButton(true);
    setIsTrue(true);
    setGptResponseLoading(true);
    let questionText = questionData?.questionName;
    let instruction = questionData.prompt_text || "";
    questionText = getTextFromQuestion(questionText);
    let quizFrom = quizFromRef.current;
    let stateRef = [];
    let apiArray = [];
    if (!prompt_text) {
      prompt_text = "No response";
    }
    let question_text = `The following question is asked to a student: '${questionText}'.'\nA student gives the following response to the question: .${prompt_text}\n'.Use this instruction ${instruction}. To Evaluate the response, and give feedback  in less than 100 words`;
    if (quizFrom === "diagnostic" && false) {
      stateRef.push(chatGptResponseRef);
      stateRef.push(scoreRef);
      question_text = `The following question is asked to a student: '${questionText}'.'A student gives the following response to the question: ${prompt_text}'.Use this instruction ${instruction}. To Evaluate the response, and give  feedback  but don't provide score, in less than 100 words.Provide only general feedback on the student's response. Avoid using specific words from the response in the feedback`;
      apiArray[0] = apiCalled(question_text);
      question_text = `The following question is asked to a student: '${questionText}'.'\nA student gives the following response to the question: ${prompt_text}\n'.Use this instruction ${instruction}. To Evaluate the response, and give the score in one word in number.It should be only number as integer`;
      apiArray[1] = apiCalled(question_text || questionData?.prompt_text || "");
    } else {
      stateRef.push(chatGptResponseRef);
      stateRef.push(scoreRef);
      // question_text = `The following question is asked to a student: '${questionText}'.'\nA student gives the following response to the question: ${prompt_text}\n'.Use this instruction ${instruction}. To Evaluate the response, and give  feedback  but don't provide score, in less than 100 words.Provide only general feedback on the student's response. Avoid using specific words from the response in the feedback.`;
      // apiArray[0] = apiCalled(question_text);
      question_text = question_text = `The following question was asked to a student: '${questionText}'. 

      A student responded:
      '${prompt_text}'. 
      
      Use this instruction: ${instruction}. To evaluate the response, return the score as **1** if the response is correct; otherwise, return the score as **0**.  
      
      ### **Return Format:**  
      Strictly return **only valid JSON** as shown below:  
    
      {
          "score": <either 1 or 0>,
          "feedback": "<Give general feedback on the student's response without using exact words from the response. Do not suggest retrying or reattempting. Keep it under 100 words. Do not include the score in the feedback.>"
      }
  
      Ensure that the score is always **either 1 or 0**. **Do not include any additional text, explanations, or formatting outside the JSON output.**`;;
      apiArray[0] = apiCalled(question_text || "");
    }

    try {
      let allData = await Promise.all(apiArray);
      // console.log(allData)
      allData = allData || [];

      allData.forEach(({ data }, index) => {
        data = data?.data || {};
        data = data.choices || [];
        stateRef[index].current = data[0]?.message?.content;
      });

      setGptResponseLoading(false);
      handleSubmit();
    } catch (e) {
      console.log(e);
    }
  };

  const handleSubmit = () => {
    if (submitResponse) return;
    if (disabledQuestion) return;
    setRedAlert(false);

    setSubmitResponse(true);
   
    try {
      if (chatGptResponseRef?.current) {
        const { feedback, score } = JSON.parse(chatGptResponseRef?.current);
        scoreRef.current = score;
        chatGptResponseRef.current = feedback;
      }
    } catch (error) {
      console.log("error score", error);
    }


    let obj = {
      audio_response: audioFileRef.current,
      chatGptResponse: chatGptResponseRef.current,
      score: Number(scoreRef.current),
    };


    typeof window.handleChangeNextQuestion == "function" &&
      window.handleChangeNextQuestion(obj);
    if (quizFromRef.current !== "diagnostic") {
      setIsCorrect(scoreRef.current == 1 ? 1 : 0);
    }
    setStudentAnswer(obj);
    typeof setHasQuizAnswerSubmitted === "function" &&
      setHasQuizAnswerSubmitted(true);
    return scoreRef.current == 0 ? 0 : 1;
  };

  const AudioTransalator = async (audioF) => {
    let blobfile = new File([audioFileRef.current], "audio.mp3", {
      type: "audio/mp3",
      lastModified: Date.now(),
    });

    const CONFIG_URL12 = window.CONFIG_URL12 || React_Base_Api;
    //  const CONFIG_URL12 = window.CONFIG_URL12 || "https://staging.begalileo.com/";

    let formData = new FormData();
    formData.append("file", blobfile);
    formData.append("model", "whisper-1");
    formData.append("language", "en");
    formData.append("type", "audio");
    let config = {
      method: "POST",
      maxBodyLength: Infinity,
      url: `${CONFIG_URL12}app_teachers/gpt_response`,
      data: formData,
    };

    try {
      let audiotext = await axios(config);

      const data_text = audiotext.data.data.text;
      handlePromptRequest(data_text);
    } catch (error) {
      console.log(error);
    }
  };

  const passAudio = () => {
    if (submitResponse) return;
    if (disabledQuestion) return;
    if (hideCheckButton) return;
    if (isApiCalled.current) return;
    setRedAlert(false);
    if (!audioURL) {
      setRedAlert(true);
      return -1;
    }

    isApiCalled.current = true;
    AudioTransalator(audioFileRef.current);
  };

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRefplay = useRef(null);

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



  const [payedTime, setPayedTime] = useState("00:00");
  const [audioDuration, setAudioDuration] = useState("00:00");

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

    const handleLoadedMetadata = () => {

      if (audio.duration === Infinity) {
        // Trick to force browser to load full duration
        audio.currentTime = 1e101;
        audio.ontimeupdate = () => {
          audio.ontimeupdate = null;
          audio.currentTime = 0;
          const duration = audio.duration;
          const formatSec = formatTimToSeconds(duration);
          setAudioDuration(formatSec);
          console.log("Duration after trick:", audio.duration);
        };
      } else {


        console.log("Duration immediately:", audio.duration);
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
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

        {hideCheckButton && (
          <>
            <div style={{ width: '100%' }}>
              {gptResponseLoading ? (
                <LinearProgressBar type={"speaking"} />
              ) : quizFromRef.current === "diagnostic" ? (
                ""
              ) : (
                <GptFeedback chatGptResponse={chatGptResponseRef.current} scoreResponse={scoreRef.current} />
              )}
            </div>

          </>
        )}

        {/* <button id="audio_submit" onClick={passAudio}>Submit Audio</button> */}
      </div>
    </>
  );
};


function AudioRecorderInterface({ setOpen,audioURL }) {
  const {
    submitResponse,
    showSolution,
  } = useContext(ValidationContext);

const [isTrue,setIsTrue]=useState(false)
useEffect(()=>{

if(showSolution||submitResponse||audioURL){
  setIsTrue(true)
}else{
  setIsTrue(false)
}
},[showSolution,submitResponse,audioURL])

  return (
    <div className="audioRecording_container">
      <div className="audioRecording">
        <IconButton 
        onClick={() => setOpen(true)}
        sx={{
          backgroundColor: '#FFFFFF73',
          color: 'white'
        }}>
          {isTrue ? <Headphones/> : <Mic /> }
        </IconButton>
      </div>
      <button className="SecondaryButton" onClick={() => setOpen(true)}>{isTrue? "Play Recording" : "Open Audio Recorder "}</button>

    </div>
  );
}



function AudioRecordingModal({
  obj,
  isPlaying,
  audioDuration,
  audioPermission,
  open,
  setOpen,
  handleStartRecording,
  stateIndex,
  handleAudioToggle,
  payedTime,
  handleFastForwardRewind,
  audioURL,
  setAudioURL,
  isRecorder


}) {

  const {
    submitResponse,
    showSolution,
  } = useContext(ValidationContext);

  const [isRecordAgain, setIsRecordAgain] = useState(false);

  const handleClose = () => {
    if(isRecorder){
      alert("Stop the recording and close")
      return
    }
    setOpen(false);
  };


  const reRecording = () => {
    setIsRecordAgain(false);
    setAudioURL("")
    handleStartRecording();
  }
  const mediaTags = new Set(["img", "video", "a"]);
  const textNodes = obj?.questionName.filter((node) => !mediaTags.has(node.node));

  return (
    <>
    <Modal open={open} onClose={setOpen}>
      <Box sx={BoxStyle} >

        <div className="audio_popup_container">
          <div className="audio_popup_section">
            {!audioPermission && !showSolution &&  (
              <Alert severity="error" style={{ textAlign: "center" }}>
                {"Microphone access was denied"}
              </Alert>

            )}
            <div className="audio_popup_header">
              <div className="small_body">
                {textNodes.map((item, key) => (
                  <React.Fragment key={key}>
                    {objectParser(item, key)}
                  </React.Fragment>
                ))}</div>
              <IconButton onClick={handleClose} sx={CloseStyle}>
                <Close fontSize="small" />
              </IconButton>
            </div>

          {!isRecordAgain && (
              <>
                {((stateIndex === 0 || stateIndex === 1) && !showSolution) && (
                  <AudioRecordingGifComponent stateIndex={stateIndex} audioDuration={audioDuration} />
                )}

                  {(stateIndex === 2 || submitResponse || showSolution) && audioURL ? (
                    <AudioPlayIcon
                      isPlaying={isPlaying}
                      handleAudioToggle={handleAudioToggle}
                      audioDuration={audioDuration}
                      payedTime={payedTime}
                      handleFastForwardRewind={handleFastForwardRewind}
                    />
                  ) : (
                    (submitResponse || showSolution) && <p className="text">No audio available</p>
                  )}

              </>
            )}


            {
              isRecordAgain &&  (
                <div className="audio_popup_body">
                  <div className="recording_container">
                    <p className="small_body">Retake this recording?</p>
                    <span className="cap_regular">you can re-record as many times as you want</span>
                    <div className="cancel_retake_btns">
                      <button className="cancel_btn" onClick={() => setIsRecordAgain(false)}>Cancel</button>
                      <button className="retake_btn" style={{ color: '#FF570F' }} onClick={reRecording}>
                        <Replay fontSize="small" /> Retake</button>
                    </div>

                  </div>
                </div>
              )
            }

            {!showSolution && !submitResponse &&
              <div className="audio_popup_footer">
                {
                  stateIndex === 0 || stateIndex == 1 ?
                    <div className="audio_popup_start_btn" onClick={handleStartRecording}>
                      <AudioStartStopButton isRecorder={isRecorder} />

                    </div>
                    :
                    <RecordAgainSubmitButton setIsRecordAgain={setIsRecordAgain} setOpen={setOpen} />

                }
              </div>
            }
          </div>
        </div>

      </Box>


    </Modal>
    </>
  );
}



function AudioStartStopButton({ isRecorder }) {
  return (
    <IconButton sx={{
      border: "2px solid #b0a7a7",
      color: 'red',
      width: "58px",
      height: "58px",

    }}
    >
      {isRecorder ? <Stop fontSize="large" /> : <Circle sx={{ fontSize: 55 }} /> }

    </IconButton>

  );
}


function AudioPlayIcon({ handleFastForwardRewind, isPlaying, audioDuration, handleAudioToggle, payedTime }) {

  const convertToSeconds = (time) => {
    const [minutes, seconds] = time.split(':').map(Number); // Split time into minutes and seconds
    return minutes * 60 + seconds; // Convert to total seconds
  };
  const progressWidth = (convertToSeconds(payedTime) / convertToSeconds(audioDuration)) * 100;

  const forwardStyle = (disabled) => ({
    color: disabled ? "#888" : "#fff",
    cursor: disabled ? "not-allowed" : "pointer",
    pointerEvents: disabled ? "none" : "auto"
  });

  return (
    <>
      <div className="audio_popup_body">
        <div className="audio_popup_body_content">
          
          <IconButton
            sx={{
              backgroundColor: '#b0a7a7',
              color: 'white',
              width: "58px",
              height: "58px",
              '&:hover': {
                backgroundColor: '#b0a7a7', // Keep background white
                color: 'white',           // Change icon color
              }
            }}
            onClick={handleAudioToggle}
          >

            {isPlaying ? <Pause fontSize="large" /> : <PlayArrow fontSize="large" />}

          </IconButton>

          <div className="seek_bar_container">
            <>

              <IconButton />
              <FastRewind onClick={() => handleFastForwardRewind("rewind")}
                sx={forwardStyle(progressWidth === 0)} />
              <FastForward onClick={() => handleFastForwardRewind("forward")} sx={forwardStyle(progressWidth === 100)} />

            </>

            <div className="audio_seek_bar_container">
              <div className="audio_seek_bar" style={{ width: `${progressWidth}%`, backgroundColor: '#fff' }} />
            </div>
            <div className="timer_show_container">
              <p className="text">{payedTime} / {audioDuration}</p>
            </div>
          </div>

        </div>
      </div>
    </>

  )
}



function RecordAgainSubmitButton({ setIsRecordAgain, setOpen }) {
  return (
    <div className="recordAgain_submit_container">
      <IconButton
            sx={{
              backgroundColor: '#5E5CC8',
              color: '#FFC760',
              width: "36px",
              height: "36px",
              '&:hover': {
                backgroundColor: '#5E5CC8',
              }
              
            }}
            onClick={() => setIsRecordAgain(true)} className="pointer"
          >
            <Replay sx={{color: '#FFC760'}}/>
            </IconButton>
      <button className="accentButton white_text" onClick={() => setOpen(false)}>Submit</button>
    </div>
  )
}


function AudioRecordingGifComponent({ stateIndex, audioDuration, handleStartRecording }) {
  return (
    <div className="audio_popup_body">
      <div className="audio_popup_body_content ">

      <Tooltip title="Minimum audio length is 5 seconds">
       <Info sx={{ position: 'absolute', right: 0, top: 0, color: 'white',cursor:"pointer" }} />
     </Tooltip>

        <p className="text"> {stateIndex == 1 ? "Recording now" : "Click to start recording"}</p>
        <IconButton onClick={handleStartRecording}
          sx={{
            backgroundColor: '#b0a7a7',
            color: 'white',
            '&:hover': {
              transform: 'scale(1.02)',
              backgroundColor: '#b0a7a7', // Keep background white
              color: 'white',           // Change icon color
            }
          }}>
          <KeyboardVoiceRounded fontSize="large" />
        </IconButton>

        <div className="timer_show_container">
          <p className="text"> {audioDuration || "00:00"}</p>
        </div>

      </div>


    </div>
  )
}


export const BoxStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  p: 2,
  outline: "none",
  maxWidth: "90%",
  width: "90%",
  height: "90%",
  maxHeight: "90%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  p: 2,
}
export const CloseStyle = {
  outline: "none",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: '#131416',
  borderRadius: "100%",
  width: "36px",
  height: "36px",
  color: '#fff',
  '&:hover': {
    transform: 'scale(1.02)',
    backgroundColor: '#131416', // Keep background white
    color: '#fff'           // Change icon color
  }
}
