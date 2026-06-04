import React, { useContext, useEffect, useState } from "react";
import styles from "../QuizQuestion/english_zone.module.css";
import objectParser from "../Utility/objectParser";
import QuestionContent from "../QuizQuestion/FillInTheBlanks/QuestionContent";
import AudiPlayerComponent from "./AudiPlayerComponent";
import SpeakQuestionText from "../Utility/SpeakQuestionText";
import { Box, Grow, IconButton, Modal } from "@mui/material";
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
  className
}) {
  const { readOut } = useContext(ValidationContext);
  const [open, setOpen] = useState(false);
  const [zoomItem, setZoomItem] = useState("");
  const questionTextRef = useRef(null)
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
    <div className={`${styles.questionContainer} ${className}`}>
      {textNodes.length || imageNodes.length ? (
        <div className={longText ? styles.flexCol : styles.flexRow}>
          {/* TEXT + AUDIO */}
          <div className={styles.textArea}>
            <div className={styles.audioWithText}>
              {readOut && <SpeakQuestionText readText={textNodes} />}
              <div className={`${styles.questionText} ${className}`} ref={questionTextRef} style={{ paddingRight: isOverflowing ? "12px" : '' }}>
                <div className="common_question_text">
                  {obj?.questionName?.map((item, key) => (
                    ['img', 'video', 'iframe'].includes(item?.node) ?
                      <div key={key} className={styles.imageArea_section}>
                        {objectParser(item, key)}
                        <ZoomOutIcon handleZoomOut={handleZoomOut} item={item} />
                      </div>
                      :
                      <React.Fragment key={key}>
                        {objectParser(item, key)}
                      </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            {obj?.resources?.length > 0 && (
              <AudiPlayerComponent resources={obj.resources} />
            )}

            {isFrom === "fill_in_the_blanks" &&
              choicesRef?.current?.length > 0 && (
                <QuestionContent choicesRef={choicesRef} />
              )}
          </div>

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
        backgroundColor: "#000",
        color: "#fff",
        boxShadow: 2,
        "&:hover": {
          transform: "scale(1.08)",
          backgroundColor: "#000",
        },
        transition: "transform 0.2s ease, color 0.2s ease",
      }}
    >
      <Fullscreen fontSize="small" />
    </IconButton>
  );
}

function ImageZoomOut({ item, open, setOpen, textNodes, readOut }) {
  const handleClose = (e) => {
    e.stopPropagation();
    setOpen(false);
  };

  function handleBodyClick(e) {
    e.stopPropagation();
  }
  return (

    <Modal open={open} onClose={handleClose} closeAfterTransition>
      <Grow in={open} timeout={300} mountOnEnter unmountOnExit style={{ width: '100%', height: '100%' }}>
        <Box
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: "0%",
            left: "0%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            height: "100%",
            outline: "none",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >


          <div className={styles.popupQuestionTextContainer} onClick={(e) => e.stopPropagation()}>
            {item === "showText" ? (
              <div className={styles.audioWithText}>
                {readOut && <SpeakQuestionText readText={textNodes} />}
                <div className={styles.questionTextMaxView}>
                  {textNodes.map((node, key) => (
                    <React.Fragment key={key}>{objectParser(node, key)}</React.Fragment>
                  ))}
                </div>
              </div>
            ) : (
              <div className={styles.max_view_image_video}>
                {objectParser(item, 0)}
              </div>
            )}
            <IconButton
              onClick={handleClose}
              sx={{
                position: "absolute",
                top: '0px',
                right: "0px",
                zIndex: '0',
                width:'25px',
                height:'25px',
                borderRadius:'0',
                backgroundColor: "trasparent",
                color: "black",
                "&:hover": {
                  // transform: "scale(1.01)",
                  backgroundColor: "#56abc5",
                  color: "white",
                },
                transition: "all 0.2s ease",
              }}
            >
              <Close fontSize="small" />
            </IconButton>
          </div>
        </Box>
      </Grow>
    </Modal>



  );
}
