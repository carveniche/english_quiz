import React, { useContext, useEffect, useState } from "react";
import styles from "../QuizQuestion/english_mathzone.module.css";
import objectParser from "../Utility/objectParser";
import QuestionContent from "../QuizQuestion/FillInTheBlanks/QuestionContent";
import AudiPlayerComponent from "./AudiPlayerComponent";
import SpeakQuestionText from "../Utility/SpeakQuestionText";
import { Box, IconButton, Modal } from "@mui/material";
import { Close, Fullscreen, ZoomOut } from "@mui/icons-material";
import { ValidationContext } from "../QuizPage";
import { useRef } from "react";

const mediaTags = new Set(["img", "video", "a", "iframe"]);

export default function QuestionCommonContent({
  isFrom,
  obj,
  wordsLength,
  longText,
  choicesRef,
  isEnglishStudentLevel,
}) {
  const {readOut} = useContext(ValidationContext);
  const [open, setOpen] = useState(false);
  const [zoomItem, setZoomItem] = useState("");
const questionTextRef=useRef(null)
 const [isOverflowing, setIsOverflowing] = useState(false);
  let textNodes = [];
  let imageNodes = [];
  try {
    textNodes = obj?.questionName.filter((node) => !mediaTags.has(node.node));
    imageNodes = obj?.questionName.filter((node) => mediaTags.has(node.node));
  } catch (error) {
    console.error("Error parsing question nodes:", error);
  }

  const handleZoomOut = (item) => {
    setZoomItem(item === "showText" ? "showText" : item);
    setOpen(true);
  };

  useEffect(() => {
    if (questionTextRef.current) {
      const height = questionTextRef.current.scrollHeight;
      setIsOverflowing(height > 251)
    }
  }, []);
  return (
    <div className={styles.questionContainer}>
      {textNodes.length || imageNodes.length ? (
        <div className={longText ? styles.flexCol : styles.flexRow}>
          {/* TEXT + AUDIO */}
          <div className={styles.textArea}>
            <div className={styles.audioWithText}>
              {readOut && <SpeakQuestionText readText={textNodes} />}
              <div className={styles.questionText} ref={questionTextRef} style={{paddingRight:isOverflowing?"12px":'' }}>
                <div>
                  {textNodes.map((item, key) => (
                  <React.Fragment key={key}>
                    {objectParser(item, key)}
                  </React.Fragment>
                ))}
                  </div>
              </div>
              {isOverflowing && <ZoomOutIcon handleZoomOut={handleZoomOut} item="showText" />}
            </div>

            {obj?.resources?.length > 0 && (
              <AudiPlayerComponent resources={obj.resources} />
            )}

            {isFrom === "fill_in_the_blanks" &&
              choicesRef?.current?.length > 0 && (
                <QuestionContent choicesRef={choicesRef} />
              )}
          </div>

          {/* IMAGE AREA */}
          {imageNodes.length > 0 && (
            <div className={styles.imageArea}>
              {imageNodes.map((item, key) => (
                <div key={key} className={styles.imageArea_section}>
                  {objectParser(item, key)}
                  <ZoomOutIcon handleZoomOut={handleZoomOut} item={item} />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className={styles.singleBlock}>
          {obj?.questionName?.map((item, key) => (
            <React.Fragment key={key}>
              {objectParser(item, key)}
            </React.Fragment>
          ))}
        </div>
      )}

      {open && (
        <ImageZoomOut
          item={zoomItem}
          open={open}
          setOpen={setOpen}
          textNodes={textNodes}
          readOut={readOut}
        />
      )}
    </div>
  );
}

function ZoomOutIcon({ handleZoomOut, item }) {
  return (
    <IconButton
      onClick={() => handleZoomOut(item)}
      sx={{
        position: "absolute",
        bottom: 3,
        right: 3,
        backgroundColor: "black",
        color: "#fff",
        boxShadow: 15,
        "&:hover": {
          transform: "scale(1.08)",
          backgroundColor: "black",
        },
        transition: "transform 0.2s ease, color 0.2s ease",
      }}
    >
      <Fullscreen fontSize="small" />
    </IconButton>
  );
}

function ImageZoomOut({ item, open, setOpen, textNodes,readOut }) {
  const handleClose = (e) => {
    e.stopPropagation();
    setOpen(false);
  };

  function handleBodyClick(e){
    e.stopPropagation();
  }
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
      onClick={handleClose}
        sx={{
          position: "absolute",
          top: "0%",
          left: "50%",
          transform: "translate(-50%, 0%)",
          width: "100%",
          height: "100%",
          outline: "none",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: '10px',
            right: "35px",
            zIndex:'35px',
            backgroundColor: "#fff",
            "&:hover": {
              transform: "scale(1.08)",
              backgroundColor: "#fff",
              color: "black",
            },
            transition: "transform 0.2s ease, color 0.2s ease",
          }}
        >
          <Close fontSize="small" />
        </IconButton>

        <div style={{ maxWidth: "80%",width:'80%', height: "80vh",background:"#ffff",padding:`${item === "showText" ?'20px':'5px'}`,borderRadius:'10px'}} onClick={handleBodyClick} >
          {item === "showText" ? (
             <div className={styles.audioWithText}>
              {readOut && <SpeakQuestionText readText={textNodes} />}
              <div className={styles.questionTextMaxView}>
                {textNodes.map((item, key) => (
                  <React.Fragment key={key}>
                    {objectParser(item, key)}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ) : (
           <div className={styles.max_view_image_video}>
             {objectParser(item, 0)}
            </div>
          )}
        </div>
      </Box>
    </Modal>
  );
}
