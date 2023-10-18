import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { isTutor } from "../../../utils/participantIdentity";
import useVideoContext from "../../../hooks/useVideoContext/useVideoContext";
import { useDispatch } from "react-redux";
import { updateMathVideoCurrentTime } from "../../../redux/features/liveClassDetails";
import {
  isSafariBrowser,
  iPadDevice,
  isIpadDeviceChrome,
} from "../../../utils/devices";

export default function MathVideoLesson() {
  const dispatch = useDispatch();

  const [mutedForSafari, setMutedForSafari] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { mathCurrentVideoPlaying } = useSelector(
    (state: RootState) => state.liveClassDetails
  );
  const [videoPlaying, setVideoPlaying] = useState(false);
  const { room } = useVideoContext();

  const videoRef = useRef<HTMLVideoElement>(null);
  const { activeTabArray, currentSelectedIndex } = useSelector(
    (state) => state.activeTabReducer
  );

  const { role_name } = useSelector(
    (state: RootState) => state.videoCallTokenData
  );

  const { videoPlayState } = useSelector(
    (state: RootState) => state.liveClassDetails
  );

  const { extraParams } = activeTabArray[currentSelectedIndex];

  useEffect(() => {
    console.log("videoPlayState", videoPlayState);
    if (videoPlayState) {
      handleVideoAction("play");
      setMutedForSafari(true);
    } else {
      handleVideoAction("pause");
      setMutedForSafari(false);
    }
  }, [videoPlayState]);

  useEffect(() => {
    if (videoRef.current) {
      if (
        mathCurrentVideoPlaying.currentVideoTagId === extraParams.videoTagId
      ) {
        videoRef.current.currentTime = mathCurrentVideoPlaying.currentVideoTime;
      } else {
        videoRef.current.currentTime = 2;
      }
    }
  }, []);

  useLayoutEffect(() => {
    return () => {
      if (videoRef.current) {
        const [localDataTrackPublication] = [
          ...room!.localParticipant.dataTracks.values(),
        ];
        let DataTrackObj = {
          pathName: null,
          value: {
            datatrackName: "UpdatePlayVideoTiming",
            currentVideoTime: videoRef.current.currentTime,
            currentVideoTagId: extraParams.videoTagId,
          },
        };
        if (localDataTrackPublication) {
          localDataTrackPublication.track.send(JSON.stringify(DataTrackObj));
        }

        dispatch(
          updateMathVideoCurrentTime({
            currentVideoTime: videoRef.current.currentTime,
            currentVideoTagId: extraParams.videoTagId,
          })
        );
      }
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
        if (isTutor({ identity: String(role_name) })) {
          handleDataTrack(true);
        }
      } else if (action === "pause") {
        videoRef.current.pause();
        setVideoPlaying(false);
        if (isTutor({ identity: String(role_name) })) {
          handleDataTrack(false);
        }
      }
    }
  };

  const handleLoadedData = () => {
    setIsLoading(false);

    // Video data loaded, can hide the loader
  };

  return (
    <div className="flex flex-col w-full h-full justify-center">
      <div className="flex h-[10%] w-full justify-center items-center">
        {isTutor({ identity: String(role_name) }) ? (
          <>
            <button
              style={{
                background: videoPlaying ? "red" : "blue",
                color: "white",
                padding: 10,
                borderRadius: "5px",
                fontSize: "bold",
                marginTop: "10px",
                width: "70px",
                height: "40px",
              }}
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
          </>
        ) : null}
      </div>
      <div className="flex h-[6%] w-full justify-center items-center">
        {videoPlaying && isTutor({ identity: String(role_name) }) && (
          <div className="flex w-full h-[30px] justify-center items-center">
            <p className="text-speedMathTextColor font-semibold text-lg">
              All participants are muted during video play. Pausing the video
              will unmute the participants
            </p>
          </div>
        )}
      </div>
      <div className="flex h-[6%] w-full justify-center items-center">
        {iPadDevice ||
          (isIpadDeviceChrome && (
            <div className="flex flex-row w-full h-[30px] justify-center items-center">
              <p className="text-speedMathTextColor font-semibold text-lg">
                {isLoading
                  ? "Please wait for video to Load"
                  : "You can click on play video now"}
              </p>
            </div>
          ))}
      </div>

      <div className="flex h-[84%] w-full justify-center items-center">
        {isSafariBrowser && !iPadDevice && !isIpadDeviceChrome ? (
          <video
            ref={videoRef}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
            playsInline
            src={extraParams.videoUrl}
            muted={mutedForSafari}
          />
        ) : iPadDevice || isIpadDeviceChrome ? (
          <video
            ref={videoRef}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
            playsInline
            src={extraParams.videoUrl}
            onLoadedData={handleLoadedData}
            controls={isLoading ? false : true}
          />
        ) : (
          <video
            ref={videoRef}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
            playsInline
            src={extraParams.videoUrl}
          />
        )}
      </div>
    </div>
  );
}
