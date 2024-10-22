import React, { useEffect, useRef, useState } from "react";
import IconButton from "@mui/material/IconButton";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import ListeningModal from "../QuizQuestion/GroupQuestion/Listening/ListeningModal";
export default function ResourceViewer({ resources }) {
    const audioRef = useRef([]);
    const [selectedAudio,setSelectedAudio]=useState(-1)
    const handleAudioPlay = (index) => {
        setSelectedAudio(index)
        
    };
    
    return resources.length ? resources.map((item, key) => <React.Fragment key={key}>
  {key===selectedAudio&& <ListeningModal group_data={{
    question_text:[],resources:[{
        ...item
    }]
    
  }} onClick={()=>handleAudioPlay(-1)} autoPlay={true} from={"preview"}/>}
        {
            item?.type === "audio" ? (
                <IconButton
                    aria-label="speaker"
                    sx={{ float: "left" }}
                    onClick={() => handleAudioPlay(key)}
                    key={key}
                >
                    <VolumeUpIcon  style={{width:"55px",height:"55px"}}/>
                    <audio
                        ref={(el) => (audioRef.current[key] = el)}
                        src={item?.url}
                        style={{ display: "none" }}
                    ></audio>
                </IconButton>
            ) : (
                ""
            )
        }
    </React.Fragment>) : ""
}