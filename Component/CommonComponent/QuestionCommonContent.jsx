import React, { useState } from "react";
import styles from "../QuizQuestion/english_mathzone.module.css";
import objectParser from "../Utility/objectParser";
import QuestionContent from "../QuizQuestion/FillInTheBlanks/QuestionContent";
import AudiPlayerComponent from "./AudiPlayerComponent";
import SpeakQuestionText from "../Utility/SpeakQuestionText";
import { Box, IconButton, Modal } from "@mui/material";
import { Close, ZoomOut } from "@mui/icons-material";

export default function QuestionCommonContent({ isFrom, obj, wordsLength, longText, choicesRef, isEnglishStudentLevel }) {
  const mediaTags = new Set(["img", "video", "a"]);
  const textNodes = obj?.questionName.filter((node) => !mediaTags.has(node.node));
  const imageNodes = obj?.questionName.filter((node) => mediaTags.has(node.node));
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  function handleZoomOut(url) {
    setImageUrl(url)
    setOpen(true)
  }
  return (
    <div className={styles.questionContainer}>
      {textNodes && imageNodes ? (
        <div className={longText ? styles.flexCol : styles.flexRow}>
          {/* TEXT + AUDIO */}
          <div
            className={`${styles.textArea}`}
          >
            <div className={styles.audioWithText}>
              {isEnglishStudentLevel && <SpeakQuestionText readText={textNodes} />}
              <div className={styles.questionText}>
                {textNodes.map((item, key) => (
                  <React.Fragment key={key}>
                    {objectParser(item, key)}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {obj?.resources?.length > 0 && (
              <AudiPlayerComponent resources={obj.resources} />
            )}

            {isFrom == "fill_in_the_blanks" && choicesRef?.current?.length > 0 && (
              <QuestionContent choicesRef={choicesRef} />
            )}
          </div>

          {/* IMAGE SIDE */}
          <div className={styles.imageArea}>
            {imageNodes.map((item, key) => (
              <div key={key} className={styles.imageArea_section} >
                {objectParser(item, key)}

                <ZoomOutIcon handleZoomOut={handleZoomOut} item={item} />
              </div>
            ))}

          </div>
        </div>

      ) : (
        // Fallback if no split text/image nodes
        <div className={styles.singleBlock}>
          {obj?.questionName?.map((item, key) => (

            <React.Fragment key={key}>
              {objectParser(item, key)}
            </React.Fragment>
          ))}
        </div>
      )}


      <ImageZoomOut imageUrl={imageUrl} open={open} setOpen={setOpen} />

    </div>
  );
}





function ZoomOutIcon({ handleZoomOut, item }) {
  return (
    <IconButton
      onClick={() => handleZoomOut(item?.value)}
      sx={{
        position: 'absolute',
        bottom: 3,
        right: 3,
        boxShadow: '15',
        backgroundColor: 'black',
        color:"#ffff",
        '&:hover': {
          transform: 'scale(1.08)',
          backgroundColor: 'black',
          //backgroundColor: '#fff', // Keep background white
          //color: 'black'           // Change icon color
        },
        transition: 'transform 0.2s ease, color 0.2s ease',
      }}
    >
      <ZoomOut fontSize="small" />
    </IconButton>
  )
}



function ImageZoomOut({ imageUrl, open, setOpen }) {
  const handleClose = (e) =>{
    e.stopPropagation()
    setOpen(false);

  }

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
         onClick={(e)=>handleClose(e)}
        sx={{
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
          
        }}
       
      >
        <IconButton
         onClick={(e)=>handleClose(e)}

          sx={{
            position: 'absolute',
            top: 3,
            right: 3,
            backgroundColor: '#fff',
            '&:hover': {
              transform: 'scale(1.08)',
              backgroundColor: '#fff', // Keep background white
              color: 'black'           // Change icon color
            },
            transition: 'transform 0.2s ease, color 0.2s ease',
          }}
        >
          <Close fontSize="small" />
        </IconButton>

        <img
          src={imageUrl}
          alt="Zoomed"
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            backgroundColor: "#fff",
          }}
        />
      </Box>


    </Modal>
  );
}
