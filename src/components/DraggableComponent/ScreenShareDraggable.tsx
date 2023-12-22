import { useEffect, useState } from "react";
import { Rnd } from "react-rnd";
import useScreenShareParticipant from "../../hooks/useScreenShareParticipant/useScreenShareParticipant";
import ParticipantTracks from "../ParticipantTracks/ParticipantTracks";
import { useDispatch } from "react-redux";
import { setStudentScreenShareReceived } from "../../redux/features/liveClassDetails";
import { isTutor } from "../../utils/participantIdentity";
export default function ScreenShareDraggable() {
  const [width, setWidth] = useState<string>("600px");
  const [height, setHeight] = useState<string>("400px");
  const [xPosition, setXPosition] = useState<number>(0);
  const [yPosition, setYPosition] = useState<number>(0);

  const dispatch = useDispatch();

  const screenShareParticipant = useScreenShareParticipant();

  useEffect(() => {
    if (screenShareParticipant !== undefined) {
      dispatch(setStudentScreenShareReceived(true));
    }
    if (isTutor({ identity: screenShareParticipant?.identity || "" })) {
      setWidth("1000px");
      setHeight("600px");
    }
  }, [screenShareParticipant]);

  return (
    <div>
      {screenShareParticipant !== undefined && (
        <Rnd
          style={{
            ...ScreenShareStyles,
            position: "fixed",
          }}
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
          <ParticipantTracks
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
  border: "1px solid white",
  background: "#f0f0f0",
  zIndex: "11",
  width: "400px",
  height: "400px",
};
