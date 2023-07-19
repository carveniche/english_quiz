import { ParticipantAudioTracks } from "../ParticipantAudioTracks/ParticipantAudioTracks";
import BegalileoLogo from "./NavbarIcons/beGalileoLogo";

export default function Header() {
  return (
    <>
      {/* 
        This ParticipantAudioTracks component will render the audio track for all participants in the room.
        It is in a separate component so that the audio tracks will always be rendered, and that they will never be 
        unnecessarily unmounted/mounted as the user switches between Gallery View and speaker View.
      */}
      <ParticipantAudioTracks />
      <div className="bg-header-black-top flex min-h-[40px] w-full justify-between ">
        <div className=" justify-center content-center p-4">
          <BegalileoLogo />
          <span className="text-BDBDBD p-4 mt-10">Coach: Ms.Styella</span>
        </div>
        <div className=" justify-center content-center p-4">
          <span className="text-BDBDBD p-4 mt-10">
            Class 2, Div A, Live class with Aashish
          </span>
        </div>
        <div className=" justify-center content-center items-center p-4">
          <BegalileoLogo />
          <span className="text-BDBDBD p-4 mt-10">Coach: Ms.Styella</span>
        </div>
      </div>
    </>
  );
}
