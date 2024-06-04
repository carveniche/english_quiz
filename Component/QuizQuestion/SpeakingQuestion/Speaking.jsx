import React, { useContext, useEffect, useRef, useState } from "react";
import { ValidationContext } from "../../QuizPage";
import axios from "axios";
import SolveButton from "../../CommonComponent/SolveButton";
import styles from "../english_mathzone.module.css";
import CustomAlertBoxMathZone from "../../CommonComponent/CustomAlertBoxMathZone";
import objectParser from "../../Utility/objectParser";
import { Button, TextareaAutosize } from "@mui/material";
import getTextFromQuestion from "../../Utility/getTextFromQuestion";
import { OuterPageContext } from "../GroupQuestion/ContextProvider/OuterPageContextProvider";
import LinearProgressBar from "../Writing/LinearProgressBar";
import MicIcon from '@mui/icons-material/Mic';
import ReplayIcon from '@mui/icons-material/Replay';
import MicOffIcon from '@mui/icons-material/MicOff';
import ListeningModal from "../GroupQuestion/Listening/ListeningModal";
import ListeningPlayer from "./ListeningPlayer";
import getBlobDuration from "get-blob-duration";
var audioChunk=[]
export default function Speaking({ questionData,questionResponse }) {
  const chatGptResponseRef = useRef("");
  const scoreRef = useRef(null);
  const studentTextRef = useRef("");
  const [gptResponseLoading, setGptResponseLoading] = useState(false);
  const [isRecordingCompleted,setIsRecordingCompleted]=useState(false)
  const [redAlert, setRedAlert] = useState(false);
  const [hideCheckButton, setHideCheckButton] = useState(false)
  let quizFromRef = useRef(sessionStorage.getItem("engQuizFrom"));
  const isApiCalled = useRef(false);
  const {
    submitResponse,
    disabledQuestion,
    setIsCorrect,
    setSubmitResponse,
    setStudentAnswer,
  } = useContext(ValidationContext);
  const { setHasQuizAnswerSubmitted } = useContext(OuterPageContext);
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
    setGptResponseLoading(true);
    let questionText = questionData?.questionName;
    let instruction = questionData.prompt_text || "";
    questionText = getTextFromQuestion(questionText);
    let quizFrom = quizFromRef.current;
    let stateRef = [];
    let apiArray = [];
    let question_text = `The following question is asked to a student: '${questionText}'.'\nA student gives the following response to the question: .${prompt_text}\n'.Use this instruction ${instruction}. To Evaluate the response, and give concise feedback like a teacher, in less than 100 words`;
    // question_text = `The following question is asked to a student: '${questionText}'.'\nA student gives the following response to the question: .${prompt_text}\n'.Use this instruction ${instruction}. To Evaluate the response, and give concise feedback like a teacher but don't provide score, in less than 100 words`;

    // question_text = `The following question is asked to a student: '${questionText}'.'\nA student gives the following response to the question: .${prompt_text}\n'.Use this instruction ${instruction}. To Evaluate the response, and give the score in one word in number`;
    if (quizFrom === "diagnostic") {
      stateRef.push(chatGptResponseRef);
      stateRef.push(scoreRef);
      question_text = `The following question is asked to a student: '${questionText}'.'A student gives the following response to the question: ${prompt_text}'.Use this instruction ${instruction}. To Evaluate the response, and give concise feedback like a teacher but don't provide score, in less than 100 words`;
      apiArray[0] = apiCalled(question_text);
      question_text = `The following question is asked to a student: '${questionText}'.'\nA student gives the following response to the question: ${prompt_text}\n'.Use this instruction ${instruction}. To Evaluate the response, and give the score in one word in number.It should be only number as integer`;
      apiArray[1] = apiCalled(question_text || questionData?.prompt_text || "");
    } else {
      stateRef.push(chatGptResponseRef);
      stateRef.push(scoreRef);
      question_text = `The following question is asked to a student: '${questionText}'.'\nA student gives the following response to the question: ${prompt_text}\n'.Use this instruction ${instruction}. To Evaluate the response, and give concise feedback like a teacher but don't provide score, in less than 100 words`;
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
        stateRef[index].current = data[0]?.message?.content;
      });
      setGptResponseLoading(false);
      handleSubmit();
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    // handlePromptRequest();
  }, []);
  const handleSubmit = () => {
    if (submitResponse) return -1;
    if (disabledQuestion) return -1;
    setRedAlert(false);
    
    if(!audioChunk.length){
      setRedAlert(true)
      return -1
    }
   let blob=new Blob(audioChunk, { type: 'audio/wav' })
    setSubmitResponse(true);
    let obj = {
      studentResponse: "",
      chatGptResponse:"",
      score: 1,
      studentAudioResponse:blob
      
    };
    typeof window.handleChangeNextQuestion == "function" &&
    window.handleChangeNextQuestion(obj);
    typeof setHasQuizAnswerSubmitted === "function" &&
    setHasQuizAnswerSubmitted(true);
    setStudentAnswer(obj);
    setIsCorrect(1)
    return 1                    

  };
  // console.log(chatGptResponse,score)
  return (
    <div>
      <SolveButton onClick={handleSubmit} />
      {redAlert && !submitResponse && <CustomAlertBoxMathZone />}
      <div className={styles.questionName}>
        {questionData?.questionName?.length ? (
          <>
            {questionData?.questionName.map((item, key) => (
              <React.Fragment key={key}>
                {objectParser(item, key)}
              </React.Fragment>
            ))}
          </>
        ) : null}
      </div>
        <RecordingPlayerContainer isRecordingCompleted={isRecordingCompleted} setIsRecordingCompleted={setIsRecordingCompleted}/>
      {/* <div style={{ marginTop: 5 }}>
        <AutoSizeTextarea
          studentTextRef={studentTextRef}
          hideCheckButton={hideCheckButton}
          response={questionResponse?.studentResponse||null}
          isShowingResponse={submitResponse||disabledQuestion}
        />
      </div> */}
      {hideCheckButton && (
        <>
          {gptResponseLoading ? (
            <LinearProgressBar />
          ) : quizFromRef.current === "diagnostic" ? (
            ""
          ) : (
            <GptFeedback chatGptResponse={chatGptResponseRef.current} />
          )}
        </>
      )}
    </div>
  );
}

function GptFeedback({ chatGptResponse }) {
  return (
    <div className={styles.gpt_feedback_box}>
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
        Feedback From: Gpt-4
      </div>
    </div>
  );
}
let recorder=""
let voiceStream=""

let MAXIMUMINTERVAL=60
let TIMEINTERVAL=1000
function RecordingPlayerContainer({isRecordingCompleted,setIsRecordingCompleted}){
  const [url,setUrl]=useState("")
  const { submitResponse, disabledQuestion } = useContext(ValidationContext);
  const currentTimeRef=useRef(Date.now())
  const [count,setCount]=useState(0)
  const disabledButton=useRef(false)
  const intervalRef=useRef()
  const [preview,setPreview]=useState(false)
  const [totalTime,setTotalTime]=useState(0)
  const [isRecordingStarted,setIsRecordingStarted]=useState(false)
  const getMediaStream=async()=>{
    if(disabledButton.current &&submitResponse&&disabledButton) return
    audioChunk=[]
    disabledButton.current=true
    if(voiceStream){
      let tracks = voiceStream?.getTracks()||[];
      tracks.forEach((track)=>{
        if(track){
          track.stop()
        }
      })
  
    }
    try{
      voiceStream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: { deviceId: "default", echoCancellation: false },
      });
      startRecording(voiceStream)
    }
    catch(e){
    alert("permission denied or mic not found")
    }
    disabledButton.current=false
  }
  const startRecording=(stream)=>{
    recorder=new MediaRecorder(stream)
    recorder.ondataavailable=function(event){
      audioChunk.push(event.data)
  
    }

    recorder.onstop=function(){
        if(stream){
          let tracks = voiceStream?.getTracks()||[];
          tracks.forEach((track)=>{
            if(track){
              track.stop()
            }
          })
        }
        recorder=""
        setIsRecordingStarted(false)
        let blob=new Blob(audioChunk, { type: 'audio/wav' })
        setUrl(URL.createObjectURL(blob))
        getBlobDuration(blob).then(res=>setTotalTime(Math.floor(res)))
    }
    recorder.start(TIMEINTERVAL)
    currentTimeRef.current=Date.now()
    intervalRef.current=setInterval(()=>{
      setCount(prev=>prev+1)
    },1000)
    setIsRecordingStarted(true)
  }
  const stopRecording=()=>{
    if(recorder){
      recorder.stop()
      
    }
    clearInterval(intervalRef.current)
      setIsRecordingCompleted(true)
  
  }
  
useEffect(()=>{
  if(count>=MAXIMUMINTERVAL&&isRecordingStarted&&disabledButton.current===false){
    if(recorder)
    try{
    stopRecording()
  }
  catch(e){
    
  }
  }
},[count])
const handleReset=()=>{
  audioChunk=[]
  setCount(0)
  setIsRecordingStarted(false)
  setIsRecordingCompleted(false)
  getMediaStream()
  setPreview(false)
  setUrl("")
  setTotalTime(0)
}

  return <div className={styles.recordingPlayer}>
    <div className={styles.recordingTimer}>
    {(() => {
              let mm = Math.floor(count / 60);
              let ss = count % 60;
              return `${mm.toString().padStart(2, "0")}:${ss
                .toString()
                .padStart(2, "0")}`;
            })()}
    </div>
  <div style={{display:"flex",flexDirection:"column",alignItems:"center",marginTop:"20px",gap:"10px"}}>
  <div style={{width:"fit-content"}}>Tap the button to record your response</div>
      <div className={styles.materialUiButton} >
      {isRecordingCompleted?<Button disabled={submitResponse||disabledQuestion} variant="contained" onClick={handleReset} startIcon={<ReplayIcon />}>Record Again</Button>:isRecordingStarted?  <Button disabled={submitResponse||disabledQuestion} sx={{display:"flex",justifyContent:"center",alignItems:"center",width:50,aspectRatio:"1/1",borderRadius:"50%",border:"1px solid blue"}} startIcon={<MicOffIcon/>} onClick={stopRecording}></Button>: <Button disabled={submitResponse||disabledQuestion} sx={{display:"flex",justifyContent:"center",alignItems:"center",width:50,aspectRatio:"1/1",borderRadius:"50%",border:"1px solid blue"}} startIcon={<MicIcon/>} onClick={getMediaStream}></Button>}
      {totalTime&&isRecordingCompleted?<Button disabled={submitResponse||disabledQuestion} variant="contained" onClick={()=>setPreview(true)} >Preview</Button>:""}
    
      </div>
     <div>
     { preview&&<ListeningModal group_data={{
        resources:[{url:url}]
      
      }} onClick={()=>setPreview(false)} from={"preview"} autoPlay={true}>

  <ListeningPlayer audioUrl={url} autoPlay={true} totalTime={totalTime}/>
      </ListeningModal> }
     </div>
  </div>
  </div>
}
