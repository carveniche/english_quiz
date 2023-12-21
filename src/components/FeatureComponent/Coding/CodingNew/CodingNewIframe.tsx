import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { useEffect, useState } from "react";

import CircularProgress from "@material-ui/core/CircularProgress";
import { isTutor } from "../../../../utils/participantIdentity";
import { useDispatch } from "react-redux";
import { toggleCodingIframeAlreadyOpened } from "../../../../redux/features/liveClassDetails";
export default function CodingNewIframe() {
  const { activeTabArray, currentSelectedIndex } = useSelector(
    (state: RootState) => state.activeTabReducer
  );
  const dispatch = useDispatch();
  const { role_name } = useSelector(
    (state: RootState) => state.videoCallTokenData
  );

  const [iframeLoaded, setIframeLoaded] = useState(false);

  const { extraParams } = activeTabArray[currentSelectedIndex];

  const { refreshNewCodingIframe } = useSelector(
    (state: RootState) => state.liveClassDetails
  );

  const handleOnload = () => {
    setIframeLoaded(true);
  };

  useEffect(() => {
    if (isTutor({ identity: String(role_name) })) {
      setIframeLoaded(false);
      setTimeout(() => {
        setIframeLoaded(true);
      }, 2000);
    }
  }, [refreshNewCodingIframe]);
  useEffect(() => {
    dispatch(toggleCodingIframeAlreadyOpened(true));
    return () => {
      dispatch(toggleCodingIframeAlreadyOpened(false));
    };
  }, []);
  return (
    <>
      {!iframeLoaded ? (
        <div className="flex w-full h-full justify-center items-center">
          <CircularProgress variant="indeterminate" />
        </div>
      ) : (
        ""
      )}

      <div className="h-full">
        {isTutor({ identity: String(role_name) }) && iframeLoaded && (
          <iframe
            title="myIframe"
            src={extraParams.url}
            style={{ width: "100%", height: "100%", overflow: "hidden" }}
            onLoad={handleOnload}
            allow="autoplay; microphone"
          />
        )}

        {!isTutor({ identity: String(role_name) }) && (
          <iframe
            title="myIframe"
            src={extraParams.url}
            style={{ width: "100%", height: "100%", overflow: "hidden" }}
            onLoad={handleOnload}
            allow="autoplay; microphone"
          />
        )}
      </div>
    </>
  );
}
