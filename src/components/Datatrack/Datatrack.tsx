import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router";
import { DataTrack as IDataTrack } from "twilio-video";
import { getQueryParams } from "../../utils/getQueryParams";
import { useDispatch } from "react-redux";
import {
  addAnimationDatatrack,
  addChatMessageDataTrack,
  addScreenShareDatatrack,
} from "../../redux/features/dataTrackStore";
import {
  addToActiveTab,
  deleteFromActiveTab,
} from "../../redux/features/addActiveTabLink";
import {
  addCurrentSelectedScreen,
  addMuteAllParticipant,
} from "../../redux/features/liveClassDetails";
import { FLAGGEDQUESTIONKEY, MATHZONEDATAKEY } from "../../constants";
import {
  changeMathzoneData,
  flagQuestionDetailsStore,
} from "../../redux/features/ComponentLevelDataReducer";

export default function DataTrack({ track }: { track: IDataTrack }) {
  const { pathname } = useLocation();
  const history = useNavigate();
  const queryParams = getQueryParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleMessage = (message: string) => {
      let parseMessage = JSON.parse(message);
      console.log(parseMessage);
      if (
        pathname === parseMessage.pathName ||
        parseMessage.pathName === null
      ) {
      } else {
        if (parseMessage.value.type === "deleteFromActiveTab") {
          history(`${parseMessage.pathName}?${queryParams}`);
          dispatch(deleteFromActiveTab(parseMessage.pathName));
        } else {
          history(`${parseMessage.pathName}?${queryParams}`);
          dispatch(
            addToActiveTab({
              path: parseMessage.pathName,
              key: parseMessage.key,
              icon: parseMessage.icon,
              name: parseMessage.name,
              extraParams: parseMessage.extraParams || {},
            })
          );
        }
      }

      if (parseMessage?.value?.datatrackName === "ScreenShare") {
        dispatch(addScreenShareDatatrack(parseMessage.value));
      } else if (parseMessage.value.datatrackName === "Animations") {
        dispatch(addAnimationDatatrack(parseMessage.value));
      } else if (parseMessage.value.datatrackName === "ChatMessage") {
        dispatch(addChatMessageDataTrack(parseMessage.value.messageArray));
      } else if (parseMessage.value.datatrackName === "MuteAllToggle") {
        dispatch(addMuteAllParticipant(parseMessage.value.muteState));
      }
      if (parseMessage?.value?.type === MATHZONEDATAKEY.mathzoneQuestionData) {
        console.log();
        dispatch(
          addToActiveTab({
            path: parseMessage?.value.activeTabData?.path || "",
            key: parseMessage?.value?.activeTabData?.key || "",
            icon: parseMessage?.value?.activeTabData?.icon || "",
            name: parseMessage?.value?.activeTabData?.name || "",
            extraParams: parseMessage?.value?.activeTabData?.path || "",
          })
        );
        dispatch(changeMathzoneData(parseMessage.value.mathzoneData));
      }
      if (
        parseMessage?.value?.type === FLAGGEDQUESTIONKEY.flaggedQuestionMenu
      ) {
        console.log(parseMessage);
        dispatch(
          addToActiveTab({
            path: parseMessage?.value.activeTabData?.path || "",
            key: parseMessage?.value?.activeTabData?.key || "",
            icon: parseMessage?.value?.activeTabData?.icon || "",
            name: parseMessage?.value?.activeTabData?.name || "",
            extraParams: parseMessage?.value?.activeTabData?.path || "",
          })
        );
        dispatch(
          flagQuestionDetailsStore(
            parseMessage?.value?.flaggedQuestionData || {}
          )
        );
      }
    };

    track.on("message", handleMessage);
    return () => {
      track.off("message", handleMessage);
    };
  }, [track]);

  return null; // This component does not return any HTML, so we will return 'null' instead.
}
