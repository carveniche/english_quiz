import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router";
import { DataTrack as IDataTrack } from "twilio-video";
import { getQueryParams } from "../../utils/getQueryParams";

export default function DataTrack({ track }: { track: IDataTrack }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const queryParams = getQueryParams();

  useEffect(() => {
    const handleMessage = (message: string) => {
      console.log("Message", message);
      if (pathname === message) {
      } else {
        navigate(`${message}?${queryParams}`);
      }
    };

    console.log("Datatrack Subscribed");
    track.on("message", handleMessage);
    return () => {
      console.log("Datatrack UnSubscribed");
      track.off("message", handleMessage);
    };
  }, [track]);

  return null; // This component does not return any HTML, so we will return 'null' instead.
}
