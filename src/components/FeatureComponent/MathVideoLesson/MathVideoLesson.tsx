import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { isTutor } from "../../../utils/participantIdentity";
import useVideoContext from "../../../hooks/useVideoContext/useVideoContext";

export default function MathVideoLesson() {
  const [videoPlaying, setVideoPlaying] = useState(false);
  const { room } = useVideoContext();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { activeTabArray, currentSelectedIndex } = useSelector(
    (state) => state.activeTabReducer
  );

  const { role_name } = useSelector(
    (state: RootState) => state.videoCallTokenData
  );

  const { extraParams } = activeTabArray[currentSelectedIndex];
  console.log("extraParams ", extraParams);

  useEffect(() => {
    return () => {
      handleDataTrack(false);
    };
  }, []);

  const handleDataTrack = (state: boolean) => {
    const [localDataTrackPublication] = [
      ...room!.localParticipant.dataTracks.values(),
    ];
    let DataTrackObj = {
      pathName: null,
      value: {
        datatrackName: "PlayVideoState",
        videoPlayState: state,
        muteState: state ? true : false,
        identity: room?.localParticipant.identity,
      },
    };

    localDataTrackPublication.track.send(JSON.stringify(DataTrackObj));
  };

  const handleVideoAction = (action: "play" | "pause") => {
    if (videoRef.current) {
      if (action === "play") {
        videoRef.current.play();
        setVideoPlaying(true);
        handleDataTrack(true);
      } else if (action === "pause") {
        videoRef.current.pause();
        handleDataTrack(false);
        setVideoPlaying(false);
      }
    }
  };

  return (
    <div className="flex flex-col w-full h-full justify-center items-center ">
      <div className="flex-1/4 justify-center items-center">
        {isTutor({ identity: String(role_name) }) ? (
          <button
            className={`bg-${videoPlaying ? "red" : "blue"}-500 hover:bg-${
              videoPlaying ? "red" : "blue"
            }-700 text-white font-bold py-2 px-4 rounded mt-16`}
            onClick={() => {
              if (videoPlaying) {
                handleVideoAction("pause");
              } else {
                handleVideoAction("play");
              }
            }}
          >
            {videoPlaying ? "Pause" : "Play"}
          </button>
        ) : null}
      </div>
      {videoPlaying && isTutor({ identity: String(role_name) }) && (
        <div>
          <h5>
            All participants are muted during video play. Pausing the video will
            unmute the participants
          </h5>
        </div>
      )}
      <div className="flex-3/4 justify-center items-center  w-55">
        <video
          ref={videoRef}
          style={{
            width: "86%",
            height: "95%",
            objectFit: "contain",
          }}
          playsInline
          src={extraParams.videoUrl}
        />
      </div>
    </div>
  );
}
