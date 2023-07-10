import { LocalAudioTrack } from "twilio-video";
import { useCallback } from "react";
import useVideoContext from "../useVideoContext/useVideoContext";

export function useKrispToggle() {
  const { localTracks } = useVideoContext();
  const audioTrack = localTracks.find(
    (track) => track.kind === "audio"
  ) as LocalAudioTrack;
  const noiseCancellation = audioTrack && audioTrack.noiseCancellation;
  const vendor = noiseCancellation && noiseCancellation.vendor;
  // const { setIsKrispEnabled } = useAppState();

  const setIsKrispEnabled = (arg1: boolean) => {}; // This is some state which will set State to other component using redux

  const toggleKrisp = useCallback(() => {
    if (noiseCancellation) {
      noiseCancellation[
        noiseCancellation.isEnabled ? "disable" : "enable"
      ]().then(() => {
        setIsKrispEnabled(noiseCancellation.isEnabled);
      });
    }
  }, [noiseCancellation, setIsKrispEnabled]);

  return { vendor, toggleKrisp };
}
