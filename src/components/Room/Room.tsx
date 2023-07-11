import useVideoContext from "../../hooks/useVideoContext/useVideoContext";

import { ParticipantAudioTracks } from "../ParticipantAudioTracks/ParticipantAudioTracks";

import ChatSnackButton from "../Buttons/ChatSnakeButton/ChatSnakeButton";
import MainParticipant from "../MainParticipant/MainParticipant";

export default function Room() {
  const { room } = useVideoContext();

  console.log("Main Video Room Component Class room", room);
  return (
    <div>
      <h1>Main Video Room Component Class</h1>

      <ChatSnackButton />

      {/* 
        This ParticipantAudioTracks component will render the audio track for all participants in the room.
        It is in a separate component so that the audio tracks will always be rendered, and that they will never be 
        unnecessarily unmounted/mounted as the user switches between Gallery View and speaker View.
      */}

      <ParticipantAudioTracks />

      <MainParticipant />
    </div>
  );
}
