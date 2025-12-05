
// import React, { useState, useEffect, useRef, useContext } from "react";
// // import recordingGIF from "../../assets/Images/record.gif"
// import { ValidationContext } from "../../QuizPage";

// import { Circle, Close, FastForward, FastRewind, Headphones, Info, KeyboardVoiceRounded, Mic, Pause, PlayArrow, Replay, Stop } from "@mui/icons-material";
// import { Alert, Box, IconButton, Modal, Tooltip } from "@mui/material";
// // import recordAgain from "../../../Component/assets/Images/Svg/recordAgain.svg";
// import objectParser from "../../Utility/objectParser";
// import DraggableWrapper from "../../Utility/DraggableWrapper";


// export default function AudioRecordingModal({
//     obj,
//     isPlaying,
//     audioDuration,
//     audioPermission,
//     open,
//     setOpen,
//     handleStartRecording,
//     stateIndex,
//     handleAudioToggle,
//     payedTime,
//     handleFastForwardRewind,
//     audioURL,
//     setAudioURL,
//     isRecorder


// }) {

//     const {
//         submitResponse,
//         showSolution,
//     } = useContext(ValidationContext);

//     const [isRecordAgain, setIsRecordAgain] = useState(false);

//     const handleClose = () => {
//         console.log("caaa")
//         if (isRecorder) {
//             alert("Stop the recording and close")
//             return
//         }
//         setOpen(false);
//     };


//     const reRecording = () => {
//         setIsRecordAgain(false);
//         setAudioURL("")
//         handleStartRecording();
//     }
//     const mediaTags = new Set(["img", "video", "a"]);
//     const textNodes = obj?.questionName.filter((node) => !mediaTags.has(node.node));

//     return (
//         <>
//             {
//                 open &&
//                 <DraggableWrapper id="1">


//                     <Box sx={BoxStyle} >

//                         <div className="audio_popup_container">
//                             <div className="audio_popup_section">
//                                 {!audioPermission && !showSolution && (
//                                     <Alert severity="error" style={{ textAlign: "center" }}>
//                                         {"Microphone access was denied"}
//                                     </Alert>

//                                 )}
//                                 <div className="audio_popup_header">
//                                     <div className="speaking_question_text">
//                                         <div className="para_text white">
//                                             {textNodes.map((item, key) => (
//                                                 <React.Fragment key={key}>
//                                                     {objectParser(item, key)}
//                                                 </React.Fragment>
//                                             ))}
//                                         </div>
//                                     </div>
//                                     <IconButton onClick={handleClose} sx={CloseStyle}>
//                                         <Close fontSize="small" />
//                                     </IconButton>
//                                 </div>

//                                 {!isRecordAgain && (
//                                     <>
//                                         {((stateIndex === 0 || stateIndex === 1) && !showSolution) && (
//                                             <AudioRecordingGifComponent stateIndex={stateIndex} audioDuration={audioDuration} />
//                                         )}

//                                         {(stateIndex === 2 || submitResponse || showSolution) && audioURL ? (
//                                             <AudioPlayIcon
//                                                 isPlaying={isPlaying}
//                                                 handleAudioToggle={handleAudioToggle}
//                                                 audioDuration={audioDuration}
//                                                 payedTime={payedTime}
//                                                 handleFastForwardRewind={handleFastForwardRewind}
//                                             />
//                                         ) : (
//                                             (submitResponse || showSolution) && <p className="para_text white">No audio available</p>
//                                         )}

//                                     </>
//                                 )}


//                                 {
//                                     isRecordAgain && (
//                                         <div className="audio_popup_body">
//                                             <div className="recording_container">
//                                                 <p className="small_body label_title white">Retake this recording?</p>
//                                                 <span className="cap_regular label_text white">you can re-record as many times as you want</span>
//                                                 <div className="cancel_retake_btns">
//                                                     <button className="cancel_btn btn_txt_s" onClick={() => setIsRecordAgain(false)}>Cancel</button>
//                                                     <button className="retake_btn btn_txt_s" style={{ color: '#FF570F' }} onClick={reRecording}>
//                                                         <Replay fontSize="btn_txt_s" /> Retake</button>
//                                                 </div>

//                                             </div>
//                                         </div>
//                                     )
//                                 }

//                                 {!showSolution && !submitResponse &&
//                                     <div className="audio_popup_footer">
//                                         {
//                                             stateIndex === 0 || stateIndex == 1 ?
//                                                 <div className="audio_popup_start_btn" onClick={handleStartRecording}>
//                                                     <AudioStartStopButton isRecorder={isRecorder} />

//                                                 </div>
//                                                 :
//                                                 <RecordAgainSubmitButton setIsRecordAgain={setIsRecordAgain} setOpen={setOpen} />

//                                         }
//                                     </div>
//                                 }
//                             </div>
//                         </div>

//                     </Box>
//                 </DraggableWrapper>

//             }


//         </>
//     );
// }





// function AudioStartStopButton({ isRecorder }) {
//     return (
//         <IconButton sx={{
//             border: "2px solid #b0a7a7",
//             color: 'red',
//             width: "58px",
//             height: "58px",

//         }}
//         >
//             {isRecorder ? <Stop fontSize="large" /> : <Circle sx={{ fontSize: 55 }} />}

//         </IconButton>

//     );
// }


// function AudioPlayIcon({ handleFastForwardRewind, isPlaying, audioDuration, handleAudioToggle, payedTime }) {

//     const convertToSeconds = (time) => {
//         const [minutes, seconds] = time.split(':').map(Number); // Split time into minutes and seconds
//         return minutes * 60 + seconds; // Convert to total seconds
//     };
//     const progressWidth = (convertToSeconds(payedTime) / convertToSeconds(audioDuration)) * 100;

//     const forwardStyle = (disabled) => ({
//         color: disabled ? "#888" : "#fff",
//         cursor: disabled ? "not-allowed" : "pointer",
//         pointerEvents: disabled ? "none" : "auto"
//     });

//     return (
//         <>
//             <div className="audio_popup_body">
//                 <div className="audio_popup_body_content">

//                     <IconButton
//                         sx={{
//                             backgroundColor: '#b0a7a7',
//                             color: 'white',
//                             width: "58px",
//                             height: "58px",
//                             '&:hover': {
//                                 backgroundColor: '#b0a7a7', // Keep background white
//                                 color: 'white',           // Change icon color
//                             }
//                         }}
//                         onClick={handleAudioToggle}
//                     >

//                         {isPlaying ? <Pause fontSize="large" /> : <PlayArrow fontSize="large" />}

//                     </IconButton>

//                     <div className="seek_bar_container">
//                         <>

//                             <IconButton />
//                             <FastRewind onClick={() => handleFastForwardRewind("rewind")}
//                                 sx={forwardStyle(progressWidth === 0)} />
//                             <FastForward onClick={() => handleFastForwardRewind("forward")} sx={forwardStyle(progressWidth === 100)} />

//                         </>

//                         <div className="audio_seek_bar_container">
//                             <div className="audio_seek_bar" style={{ width: `${progressWidth}%`, backgroundColor: '#fff' }} />
//                         </div>
//                         <div className="timer_show_container">
//                             <p className="label_text white">{payedTime} / {audioDuration}</p>
//                         </div>
//                     </div>

//                 </div>
//             </div>
//         </>

//     )
// }



// function RecordAgainSubmitButton({ setIsRecordAgain, setOpen }) {
//     return (
//         <div className="recordAgain_submit_container">
//             <IconButton
//                 sx={{
//                     backgroundColor: '#5E5CC8',
//                     color: '#FFC760',
//                     width: "36px",
//                     height: "36px",
//                     '&:hover': {
//                         backgroundColor: '#5E5CC8',
//                     }

//                 }}
//                 onClick={() => setIsRecordAgain(true)} className="pointer"
//             >
//                 <Replay sx={{ color: '#FFC760' }} />
//             </IconButton>
//             <button className="accentButton label_text white" onClick={() => setOpen(false)}>Submit</button>
//         </div>
//     )
// }


// function AudioRecordingGifComponent({ stateIndex, audioDuration, handleStartRecording }) {
//     return (
//         <div className="audio_popup_body">
//             <div className="audio_popup_body_content ">

//                 <Tooltip title="Minimum audio length is 5 seconds">
//                     <Info sx={{ position: 'absolute', right: 0, top: 0, color: 'white', cursor: "pointer" }} />
//                 </Tooltip>

//                 <p className="label_title white"> {stateIndex == 1 ? "Recording now" : "Click to start recording"}</p>

//                 <IconButton onClick={handleStartRecording}
//                     sx={{
//                         backgroundColor: '#b0a7a7',
//                         color: 'white',
//                         '&:hover': {
//                             transform: 'scale(1.02)',
//                             backgroundColor: '#b0a7a7', // Keep background white
//                             color: 'white',           // Change icon color
//                         }
//                     }}>
//                     <KeyboardVoiceRounded fontSize="large" />
//                 </IconButton>

//                 <div className="timer_show_container">
//                     <p className="label_text white"> {audioDuration || "00:00"}</p>
//                 </div>

//             </div>


//         </div>
//     )
// }





// export const BoxStyle = {
//     position: "absolute",
//     top: "50%",
//     left: "50%",
//     transform: "translate(-50%, -50%)",
//     p: 2,
//     outline: "none",
//     maxWidth: "300px",
//     width: "250px",
//     height: "300px",
//     maxHeight: "300px",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     p: 2,
// }


// export const CloseStyle = {
//     outline: "none",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: '#131416',
//     borderRadius: "100%",
//     width: "36px",
//     height: "36px",
//     color: '#fff',
//     '&:hover': {
//         transform: 'scale(1.02)',
//         backgroundColor: '#131416', // Keep background white
//         color: '#fff'           // Change icon color
//     }
// }
