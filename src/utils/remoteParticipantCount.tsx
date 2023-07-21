import useParticipantsContext from "../hooks/useParticipantsContext/useParticipantsContext";
export const remoteParticipantCount = () => {
  const { speakerViewParticipants } = useParticipantsContext();

  let remotePCount = speakerViewParticipants.length;

  let width = "100vw";
  let height = "100vh";

  if (remotePCount === 0 || remotePCount === 1) {
    return [width, height];
  } else if (remotePCount === 2 || remotePCount === 3) {
    height = "50vh";
    return [width, height];
  } else {
    width = "50vw";
    height = "50vh";
    return [width, height];
  }
};
