import BegalileoLogo from "./NavbarIcons/BegalileoLogo";
import ReportErrorScreenShot from "../ReportErrorScreenShot/ReportErrorScreenShot";
import CallTechSupport from "../CallTechSupport/CallTechSupport";
import { ParticipantAudioTracks } from "../ParticipantAudioTracks/ParticipantAudioTracks";
import RecordingStartNotification from "../RecordingStartNotification/RecordingStartNotification";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { isParent, isTech, isTutor } from "../../utils/participantIdentity";
export default function Header() {
  const { role_name, teacher_name } = useSelector(
    (state: RootState) => state.videoCallTokenData
  );
  const { parentJoinedClass, techJoinedClass } = useSelector(
    (state: RootState) => state.liveClassDetails
  );

  return (
    <>
      {/* 
        This ParticipantAudioTracks component will render the audio track for all participants in the room.
        It is in a separate component so that the audio tracks will always be rendered, and that they will never be 
        unnecessarily unmounted/mounted as the user switches between Gallery View and speaker View.
      */}

      <ParticipantAudioTracks />
      <div className="bg-header-black-top flex min-h-[40px] w-full justify-between ">
        <div className=" flex flex-row justify-center items-center content-center p-4">
          <div>
            <BegalileoLogo />
            <span className="text-BDBDBD p-4 mt-10">
              Coach: {teacher_name.toString()}
            </span>
          </div>
          {parentJoinedClass && isTutor({ identity: String(role_name) }) && (
            <div className="w-4 h-4 rounded-full bg-red-800 animate-ping"></div>
          )}
        </div>
        <div className="  justify-center content-center p-4">
          {/* <span className="text-BDBDBD p-4 mt-10">
            Class 2, Div A, Live class with Aashish
          </span> */}
        </div>
        <div className=" justify-center content-center items-center p-4 pr-[30px]">
          <div className="flex flex-row justify-between min-w-[180px] gap-2">
            <RecordingStartNotification />
            {techJoinedClass && !isTech({ identity: String(role_name) }) && (
              <div className="flex justify-center items-center bg-green-500 p-1 rounded">
                <span className="text-white">Tech Joined...</span>
              </div>
            )}
            {!isTech({ identity: String(role_name) }) && <CallTechSupport />}

            <div className="h-px-[28px] w-[1px] bg-callTechSupportLine"></div>
            {isTutor({ identity: String(role_name) }) &&
              !isParent({ identity: String(role_name) }) && (
                <ReportErrorScreenShot />
              )}
          </div>
        </div>
      </div>
    </>
  );
}
