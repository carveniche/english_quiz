import { useEffect, useRef } from "react";
import IconButton from "@mui/material/IconButton";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
export default function ResourceViewer({ resources }) {
    const audioRef = useRef([]);
    const handleAudioPlay = (index) => {
        let audio = audioRef.current[index];
        if (audio) {
            audio.play();
        }
    };
    useEffect(() => {
        return () => {
            for (let audio of audioRef.current) {
                if (audio) audio.pause();
            }
        };
    }, []);
    return resources.length ? resources.map((item, key) => <>
        {
            item?.type === "audio" ? (
                <IconButton
                    aria-label="speaker"
                    sx={{ float: "right" }}
                    onClick={() => handleAudioPlay(key)}
                    key={key}
                >
                    <VolumeUpIcon />
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
    </>) : ""
}