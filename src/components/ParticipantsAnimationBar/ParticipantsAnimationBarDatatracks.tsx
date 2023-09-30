import useVideoContext from "../../hooks/useVideoContext/useVideoContext";
import { useLocation } from "react-router";
import { useDispatch } from "react-redux";
import { addAnimationDatatrack } from "../../redux/features/dataTrackStore";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { addMuteIndividualParticipant } from "../../redux/features/liveClassDetails";
export default function useParticipantsAnimationBarDatatracks() {
  const { room } = useVideoContext();
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const { currentSelectedKey } = useSelector(
    (state: RootState) => state.activeTabReducer
  );

  const handleKeyClick = (identity: string, key: string, state?: boolean) => {
    const [localDataTrackPublication] = [
      ...room.localParticipant.dataTracks.values(),
    ];

    if (key === "ScreenShare") {
      let DataTrackObj = {
        pathName: null,
        value: {
          datatrackName: "ScreenShare",
          publishedState: state,
          identity: identity,
          toggleFrom: "RequestingScreenShare",
        },
      };

      localDataTrackPublication.track.send(JSON.stringify(DataTrackObj));
    } else if (key === "MuteParticipant") {
      let DataTrackObj = {
        pathName: pathname === "/" ? null : pathname,
        value: {
          datatrackName: "MuteParticipant",
          muteStatus: state,
          identity: identity,
        },
      };

      localDataTrackPublication.track.send(JSON.stringify(DataTrackObj));
      dispatch(
        addMuteIndividualParticipant({
          identity: identity,
          muteStatus: state,
        })
      );
    } else {
      let json = {
        pathName: pathname === "/" ? null : pathname,
        key: currentSelectedKey,
        value: {
          datatrackName: "Animations",
          type: key,
          identity: identity,
        },
      };
      localDataTrackPublication.track.send(JSON.stringify(json));

      dispatch(
        addAnimationDatatrack({
          datatrackName: "Animations",
          type: key,
          identity: identity,
        })
      );
    }
  };

  return [handleKeyClick];
}
