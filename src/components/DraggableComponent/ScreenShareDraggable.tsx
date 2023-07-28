import { useState } from "react";
import { Rnd } from "react-rnd";
import useScreenShareParticipant from "../../hooks/useScreenShareParticipant/useScreenShareParticipant";
import { Participant } from "../Participant/Participant";
export default function ScreenShareDraggable() {
  const [width, setWidth] = useState<string>("300px");
  const [height, setHeight] = useState<string>("300px");
  const [xPosition, setXPosition] = useState<number>(0);
  const [yPosition, setYPosition] = useState<number>(0);

  const screenShareParticipant = useScreenShareParticipant();

  return (
    <div>
      {screenShareParticipant !== undefined && (
        <Rnd
          style={{ ...ScreenShareStyles, position: "fixed" }}
          size={{ width: width, height: height }}
          position={{ x: xPosition, y: yPosition }}
          onDragStop={(e, d) => {
            setXPosition(d.x);
            setYPosition(d.y);
          }}
          onResizeStop={(e, direction, ref, delta, position) => {
            setWidth(ref.style.width);
            setHeight(ref.style.height);
            setXPosition(position.x);
            setYPosition(position.y);
          }}
        >
          <Participant
            participant={screenShareParticipant}
            enableScreenShare={true}
          />
        </Rnd>
      )}
    </div>
  );
}

const ScreenShareStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "solid 1px #ddd",
  background: "#f0f0f0",
  zIndex: "1",
  width: "400px",
  height: "400px",
};
