
import React, { useState, useEffect, useRef, useContext } from 'react';
// import recordingGIF from "../../assets/Images/record.gif"
import SolveButton from '../../CommonComponent/SolveButton';
import CustomAlertBoxVoice from '../../CommonComponent/CustomAlertBoxVoice';
import { ValidationContext } from '../../QuizPage';
import LinearProgressBar from '../Writing/LinearProgressBar';
import styles from "../english_mathzone.module.css";
import getTextFromQuestion from '../../Utility/getTextFromQuestion';
import axios from 'axios';
import { OuterPageContext } from "../GroupQuestion/ContextProvider/OuterPageContextProvider";

const Recording_part = ({ questionData,questionResponse,setIsTrue}) => {

    const { setHasQuizAnswerSubmitted } = useContext(OuterPageContext);
    const {
        submitResponse,
        disabledQuestion,
        setIsCorrect,
        setSubmitResponse,
        setStudentAnswer,
      } = useContext(ValidationContext);
      const chatGptResponseRef = useRef("");
  const scoreRef = useRef(null);
  const [gptResponseLoading, setGptResponseLoading] = useState(false);
  const [redAlert, setRedAlert] = useState(false);
  const [hideCheckButton, setHideCheckButton] = useState(false);
  const isApiCalled = useRef(false);
  let quizFromRef = useRef(sessionStorage.getItem("engQuizFrom"));
  
    // recording part states
    const [stateIndex, setStateIndex] = useState(0);
    const [audioURL, setAudioURL] = useState('');
    const [elapsedTime, setElapsedTime] = useState(0);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const audioFileRef = useRef(null);
    const timerIntervalRef = useRef(null);

    // button styles start
    const recordbtn = {
        border: 'none',
        //background: '#38c185',
        color: 'transparent',
        padding: '12px',
        borderRadius: '20px',
        cursor: 'pointer',
        fontSize:'13px',
        backgroundImage: 'url("https://d1t64bxz3n5cv1.cloudfront.net/Button_Start.png")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
        width:'150px'
        
    };
    const stoprecord={
        border: 'none',
      //  background: 'red',
        color: 'transparent',
        padding: '12px',
        borderRadius: '20px',
        cursor: 'pointer',
        fontSize:'13px',
        backgroundImage: 'url("https://d1t64bxz3n5cv1.cloudfront.net/Button_Stop.png")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
        width:'150px'
    }
        // button styles end


    useEffect(() => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then((stream) => {
            mediaRecorderRef.current = new MediaRecorder(stream);
  
            mediaRecorderRef.current.ondataavailable = (e) => {
              chunksRef.current.push(e.data);
            };
  
            mediaRecorderRef.current.onstop = () => {
              clearInterval(timerIntervalRef.current);  // Stop the timer
              setElapsedTime(0); // Reset the timer

              const blob = new Blob(chunksRef.current, { type: 'audio/mp3; codecs=opus' });
              chunksRef.current = [];
              const url = window.URL.createObjectURL(blob);
              setAudioURL(url);
  
              // Convert Blob to File
              // audioFileRef.current = new File([blob], "audio.mp3", {
              //   type: 'audio/mp3',
              //   lastModified: Date.now(),
              // });
              audioFileRef.current=blob;

            };
          })
          .catch((error) => {
            console.error('Error accessing media devices.', error);
            setStateIndex(3);
          });
      } else {
        setStateIndex(3);
      }
    }, []);
  
    const startTimer = () => {
      const startTime = Date.now();
      timerIntervalRef.current = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        setElapsedTime(elapsedTime);
      }, 1000);
    };
  
    const formatTime = (time) => {
      const minutes = Math.floor(time / 60000);
      const seconds = Math.floor((time % 60000) / 1000);
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };
  
    const handleRecord = () => {
      setStateIndex(1);
      mediaRecorderRef.current.start();
      startTimer();  // Start the timer when recording starts
    };
  
    const handleStopRecording = () => {
      setStateIndex(2);
      mediaRecorderRef.current.stop();
      clearInterval(timerIntervalRef.current);  // Stop the timer when recording stops
    };
  
    const apiCalled = (prompt_text) => {
        const CONFIG_URL2 = window.CONFIG_URL || "https://begalileo.com/";
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
        console.log('this is prompt_text',prompt_text)
        if(!prompt_text){
            prompt_text="No response";
        }
        let question_text = `The following question is asked to a student: '${questionText}'.'\nA student gives the following response to the question: .${prompt_text}\n'.Use this instruction ${instruction}. To Evaluate the response, and give feedback  in less than 100 words`;
        if (quizFrom === "diagnostic") {
            stateRef.push(chatGptResponseRef);
            stateRef.push(scoreRef);
            question_text = `The following question is asked to a student: '${questionText}'.'A student gives the following response to the question: ${prompt_text}'.Use this instruction ${instruction}. To Evaluate the response, and give  feedback  but don't provide score, in less than 100 words.Provide only general feedback on the student's response. Avoid using specific words from the response in the feedback`;
            apiArray[0] = apiCalled(question_text);
            question_text = `The following question is asked to a student: '${questionText}'.'\nA student gives the following response to the question: ${prompt_text}\n'.Use this instruction ${instruction}. To Evaluate the response, and give the score in one word in number.It should be only number as integer`;
            apiArray[1] = apiCalled(question_text || questionData?.prompt_text || "");      
        }else{
            stateRef.push(chatGptResponseRef);
            stateRef.push(scoreRef);
            question_text = `The following question is asked to a student: '${questionText}'.'\nA student gives the following response to the question: ${prompt_text}\n'.Use this instruction ${instruction}. To Evaluate the response, and give  feedback  but don't provide score, in less than 100 words.Provide only general feedback on the student's response. Avoid using specific words from the response in the feedback.`;
            apiArray[0] = apiCalled(question_text);
            question_text = `The following question is asked to a student: '${questionText}'.'A student gives the following response to the question: ${prompt_text}'.Use this instruction ${instruction}. To Evaluate the response, and give the score as {{1}} if the response is correct otherwise give score as {{0}}.Please follow instruction correctly`;
            apiArray[1] = apiCalled(question_text || "");
        }

        try {
            let allData = await Promise.all(apiArray);
            // console.log(allData)
            allData = allData || [];
      
            allData.forEach(({ data }, index) => {
              data = data?.data || {};
              data = data.choices || [];
              console.log(data);
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
        
        if (isNaN(Number(scoreRef.current))) {
          console.log('this is scoreref', scoreRef.current);
        
         let regex = /{{(\d+)}}/;
          console.log('this is regex', regex);
        
          let scoreValue = regex.exec(scoreRef.current);
          console.log('this is score value', scoreValue);
        
          // Extract the digit if score pattern is found
          if (scoreValue !== null) {
            scoreRef.current = scoreValue[1]; // The digit captured by the regex
          } else {
            // Second attempt if the score pattern isn't found
            regex = /{{(\d+)}}/;
            scoreValue = regex.exec(scoreRef.current) || [];
            regex = /\d+/g;
            scoreRef.current = regex.exec(scoreValue.pop());
          }
        }

          console.log('this is AA ',audioFileRef.current)

          let obj = {
            audio_response: audioFileRef.current,
            chatGptResponse: chatGptResponseRef.current,
            score: Number(scoreRef.current),
          };
          console.log('this is object',obj)
          setSubmitResponse(true);
          typeof window.handleChangeNextQuestion == "function" &&
            window.handleChangeNextQuestion(obj);
          if (quizFromRef.current !== "diagnostic") {
            setIsCorrect(scoreRef.current == 1 ? 1 : 0);
          }
          setStudentAnswer(JSON.stringify(obj));
          typeof setHasQuizAnswerSubmitted === "function" &&
            setHasQuizAnswerSubmitted(true);
          return scoreRef.current == 0 ? 0 : 1;
    }

     const AudioTransalator = async(audioF)=>{
        console.log('this is audio inside',audioF)
        let blobfile= new File([audioFileRef.current], "audio.mp3", {
             type: 'audio/mp3',
             lastModified: Date.now(),
          });
        // const formData = new FormData();
        // formData.append("file", blobfile);
        // formData.append("model", "whisper-1");
        // formData.append("language", "en");
        // try {
        //     const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        //         method: "POST",
        //         headers: {
        //         "Authorization": ``
        //         },
        //         body: formData
        //     });

        //     if (!response.ok) {
        //         throw new Error(`Error: ${response.statusText}`);
        //     }

        //     const data = await response.json();
        //     console.log('this is dfsdfs',data)
          
        //     handlePromptRequest(data.text);

        // } catch (error) {
        //     console.error('Error:', error);
        //     alert("There was an error transcribing the audio.");
        // } 
      // const CONFIG_URL12 = window.CONFIG_URL12 || "http://localhost:3000/";

         const CONFIG_URL12 = window.CONFIG_URL12 || "https://begalileo.com/";
    //  const CONFIG_URL12 = window.CONFIG_URL12 || "https://staging.begalileo.com/";
        
        let formData = new FormData();
        formData.append("file", blobfile);
         formData.append("model", "whisper-1");
         formData.append("language", "en");
         formData.append("type", "audio");
         console.log( `${CONFIG_URL12}app_teachers/gpt_response`)
        let config = {
          method: "POST",
          maxBodyLength: Infinity,
          url: `${CONFIG_URL12}app_teachers/gpt_response`,
          data: formData,
        };
    
           try {
            let audiotext= await axios(config);
            console.log('this is audiotext',audiotext) 
            const data_text = audiotext.data.data.text;
           console.log('this is dfsdfs',data_text)   
           handlePromptRequest(data_text);
           } catch (error) {
            console.log(error)
           }
           
           
        

     }

    const passAudio = () => {
        if (submitResponse) return;
        if (disabledQuestion) return;
        if (hideCheckButton) return;
        if (isApiCalled.current) return;
        setRedAlert(false);
        if(!audioURL){
            setRedAlert(true);
            return -1;
        }
      console.log('this is src', audioURL);
      console.log('this is audioFileRef.current', audioFileRef.current);
      isApiCalled.current = true;
      
      AudioTransalator(audioFileRef.current); 
      return 1;
   
   
    };
  



    const [isPlaying, setIsPlaying] = useState(false);
    const audioRefplay = useRef(null);
    const handleAudioToggle = () => {
      if (isPlaying) {
        audioRefplay.current.pause();
      } else {
        audioRefplay.current.play();
      }
      setIsPlaying(!isPlaying);
    };
    const handleAudioEnd = () => {
      setIsPlaying(false);
    };
    return (
<div>
  


<SolveButton  onClick={passAudio} />
{redAlert && !submitResponse && <CustomAlertBoxVoice />}

      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', flexDirection: 'column' ,marginTop:'20px',width:'100%'}}>
       
       
        <div className="display" style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' ,alignItems: 'center'}}>
        {stateIndex === 1 && (
          <div className="timer" id="timer">{formatTime(elapsedTime)}</div>
        )}  
          {stateIndex === 1 && (
            <>
              <img id="message_img" src="https://d1t64bxz3n5cv1.cloudfront.net/Talking+C.gif" alt="Audio recording" width="200" height="200" />
              <span>Recording...</span>
            </>
          )}
          {(stateIndex === 2||(submitResponse||disabledQuestion)) && (
            // <audio id="first" controls src={(submitResponse||disabledQuestion)?(audioURL||questionResponse?.audio_response):audioURL}></audio>

            <div
            onClick={handleAudioToggle}
            style={{
              width: 75,
              height: 75,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
            }}>
              <img
          src={
            isPlaying
              ? "https://d1t64bxz3n5cv1.cloudfront.net/AudioPlay.gif"
              : "https://d1t64bxz3n5cv1.cloudfront.net/PlayButton.gif"
          }
          alt="Audio Control"
          style={{ width: 85, height: 85}}
        />
            <audio id="first"  ref={audioRefplay}  src={(submitResponse||disabledQuestion)?(audioURL||questionResponse?.audio_response):audioURL} onEnded={handleAudioEnd}></audio>
            </div>

          )}
        </div>
  
        {(!questionResponse?.audio_response) && <div className="controllers">
          {stateIndex === 0 && <button id="record"  style={recordbtn} onClick={handleRecord}>Start Recording</button>}
          {stateIndex === 1 && <button id="stop" style={stoprecord} onClick={handleStopRecording}>Stop Recording</button>}
          {stateIndex === 2 && (
            <>{!hideCheckButton &&
              <button id="record" style={recordbtn} onClick={handleRecord}>Record Again</button>
            }
            </>
          )}
        </div>}
  
        {hideCheckButton && (
        <>
          {gptResponseLoading ? ( <LinearProgressBar />) 
          : quizFromRef.current === "diagnostic" ? ("") : 
          (<GptFeedback chatGptResponse={chatGptResponseRef.current} /> )}
        </>
      )}
        
        {/* <button id="audio_submit" onClick={passAudio}>Submit Audio</button> */}
       
      </div>
 </div>     
    );
  
}



function GptFeedback({ chatGptResponse }) {
  // const [isSpeaking, setIsSpeaking] = useState(false);
  // const speech = new SpeechSynthesisUtterance(chatGptResponse || "No Response");

  
  // const toggleSpeak = () => {
  //   if (isSpeaking) {
  //     window.speechSynthesis.cancel(); // Stop speaking
  //   } else {
  //     window.speechSynthesis.speak(speech); // Start speaking
  //   }
  //   setIsSpeaking(!isSpeaking); // Toggle speaking state
  // };

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voice, setVoice] = useState(null);
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      console.log('voices',voices)
      // Filter for female voices; you can adjust this as needed
      const femaleVoice = voices.find(v => v.name === "Microsoft Zira - English (United States)");
      setVoice(femaleVoice || voices[0]); // Default to first available female voice or any voice
    };

    loadVoices(); // Initial load

    window.speechSynthesis.onvoiceschanged = loadVoices; // Update voices when available

  }, []);

  const toggleSpeak = () => {
    const speech = new SpeechSynthesisUtterance(chatGptResponse || "No Response");
    speech.voice = voice; // Set the selected voice

    speech.onend = () => {
      setIsSpeaking(false); // Reset speaking state when finished
    };

    if (isSpeaking) {
      window.speechSynthesis.cancel(); // Stop speaking
      setIsSpeaking(false); // Update state
    } else {
      window.speechSynthesis.speak(speech); // Start speaking
      setIsSpeaking(true); // Update state
    }
  };

    return (
      <div className={`${styles.gpt_feedback_box} ${styles.speakingtype_gpt}`} >
              <button style={{border:"1px solid white",cursor:"pointer",fontSize:"13px"}} onClick={toggleSpeak}>🔊 Read Aloud</button>
        <div style={{ padding: 10, fontSize: 15 }}>
          {chatGptResponse || "No Response"}
        </div>
        <div
          style={{
            width: "calc(100% - 10px)",
            display: "flex",
            justifyContent: "flex-end",
            paddingRight: 5,
            paddingTop: 5,
            paddingBottom: 5,
            color: "indigo",
            fontWeight: "normal",
          }}
        >
          Feedback From: AI
        </div>
      </div>
    );
  }

export default Recording_part 




