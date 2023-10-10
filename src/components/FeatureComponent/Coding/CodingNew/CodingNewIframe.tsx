import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { useState } from "react";

import CircularProgress from "@material-ui/core/CircularProgress";
export default function CodingNewIframe() {
  const { activeTabArray, currentSelectedIndex } = useSelector(
    (state: RootState) => state.activeTabReducer
  );

  const [iframeLoaded, setIframeLoaded] = useState(false);

  const { extraParams } = activeTabArray[currentSelectedIndex];

  const handleOnload = () => {
    setIframeLoaded(true);
  };

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
        <iframe
          title="myIframe"
          src={extraParams.url}
          style={{ width: "100%", height: "100%", overflow: "hidden" }}
          onLoad={handleOnload}
          allow="autoplay"
        />
      </div>
    </>
  );
}
