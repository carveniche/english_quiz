import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router";
import { DataTrack as IDataTrack } from "twilio-video";
import { getQueryParams } from "../../utils/getQueryParams";
import { useDispatch } from "react-redux";
import { addDataTrackValue } from "../../redux/features/dataTrackStore";

export default function DataTrack({ track }: { track: IDataTrack }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const queryParams = getQueryParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleMessage = (message: string) => {
      let parseMessage = JSON.parse(message);

      if (pathname === parseMessage.pathname) {
      } else {
        navigate(`${parseMessage.pathName}?${queryParams}`);
      }

      if (parseMessage.value) {
        dispatch(addDataTrackValue(parseMessage.value));
      }
    };

    track.on("message", handleMessage);
    return () => {
      track.off("message", handleMessage);
    };
  }, [track]);

  return null; // This component does not return any HTML, so we will return 'null' instead.
}
