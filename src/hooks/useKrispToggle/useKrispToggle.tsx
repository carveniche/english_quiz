import { LocalAudioTrack } from "twilio-video";
import { useCallback } from "react";
import useVideoContext from "../useVideoContext/useVideoContext";
import { useDispatch } from "react-redux";

import { addKrispInstalledEnabledDetails } from "../../redux/features/liveClassDetails";

export function useKrispToggle() {
  const { localTracks } = useVideoContext();

  const audioTrack = localTracks.find(
    (track) => track.kind === "audio"
  ) as LocalAudioTrack;
  const noiseCancellation = audioTrack && audioTrack.noiseCancellation;
  const vendor = noiseCancellation && noiseCancellation.vendor;

  const dispatch = useDispatch();

  const toggleKrisp = useCallback(() => {
    if (noiseCancellation) {
      noiseCancellation[
        noiseCancellation.isEnabled ? "disable" : "enable"
      ]().then(() => {
        dispatch(
          addKrispInstalledEnabledDetails({
            isKrispEnabled: noiseCancellation.isEnabled,
          })
        );
        // setIsKrispEnabled(noiseCancellation.isEnabled);
      });
    }
  }, [noiseCancellation]);

  return { vendor, toggleKrisp };
}
