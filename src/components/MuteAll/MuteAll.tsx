import { useState } from "react";
import MuteAllIcon from "../Navbar/NavbarIcons/MuteAllIcon";
import UnMuteAllIcon from "../Navbar/NavbarIcons/UnMuteAllIcon";
import { useDispatch } from "react-redux";
import { addMuteAllParticipant } from "../../redux/features/liveClassDetails";
import useVideoContext from "../../hooks/useVideoContext/useVideoContext";
export default function MuteAll() {
  const [activeMuteLogo, setActiveMuteLogo] = useState(true);
  const { room } = useVideoContext();

  const dispatch = useDispatch();

  const muteAllToggle = () => {
    setActiveMuteLogo(!activeMuteLogo);

    if (activeMuteLogo) {
      dispatch(addMuteAllParticipant(true));
    } else {
      dispatch(addMuteAllParticipant(false));
    }

    const [localDataTrackPublication] = [
      ...room.localParticipant.dataTracks.values(),
    ];

    let DataTrackObj = {
      pathName: null,

      value: {
        datatrackName: "MuteAllToggle",
        muteState: activeMuteLogo,
        identity: room?.localParticipant.identity,
      },
    };

    console.log("Data message send");
    localDataTrackPublication.track.send(JSON.stringify(DataTrackObj));
  };

  return (
    <button onClick={() => muteAllToggle()}>
      <div className="flex flex-row min-w-[100px] min-h-[35px] items-center rounded-full gap-2 bg-header-black-top hover:bg-black px-2 py-1">
        {activeMuteLogo ? (
          <>
            <MuteAllIcon />
            <span className="text-F2F2F2">Mute all</span>
          </>
        ) : (
          <>
            <UnMuteAllIcon />
            <span className="text-F2F2F2">Unmute all</span>
          </>
        )}
      </div>
    </button>
  );
}
