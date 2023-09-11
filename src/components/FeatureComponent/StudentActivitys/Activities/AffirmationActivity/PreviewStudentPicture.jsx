import React from "react";
import { Button, Modal } from "react-bootstrap";
import AffirmationBadges, { AffirmationBadges2 } from "./AffirmationBadges";
import AffirmationSelection from "./AffirmationSelection";

export default function PreviewStudentPicture({
  preview,
  onClick,
  currentIndex,
  listOfAffirmation,
  image,
  identity,
  buttonText1,
  buttonText2,
  handleRetake
}) {
  const handleClick = () => {
    typeof onClick === "function" && onClick();
  };
  const handleRetakeClick=()=>{
    typeof handleRetake==="function"&&handleRetake()
  }

  return (
    <>
      {" "}
      <Modal show={preview}>
        <Modal.Body>
          <div
            style={{
              display: "flex",

              alignItems: "center",

              position: "relative",
              width: 338,
              placeSelf: "center",
              margin: "0 auto",
            }}
          >
            <img
              src={image}
              style={{ width: "100%", height: 250, objectFit: "fill" }}
            />
          </div>
        </Modal.Body>
        {identity === "tutor" && (
          <div style={{display:'flex',justifyContent:'space-between'}}>
           { buttonText2&&<Button
              onClick={handleRetakeClick}
              style={{
                width: 80,
                height: 30,

                padding: 5,
                display: "block",
                margin: 10,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                placeSelf: "start",
              }}
            >
              {buttonText2}
            </Button>}
{buttonText1&&            <Button
              onClick={handleClick}
              style={{
                width: 80,
                height: 30,

                padding: 5,
                display: "block",
                margin: 10,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                placeSelf: "end",
              }}
            >
             {buttonText1}
            </Button>}
          
          </div>
        )}
      </Modal>
    </>
  );
}
