import { useEffect } from "react";
import useVideoContext from "../../../hooks/useVideoContext/useVideoContext";

export default function Coding() {
  const { room } = useVideoContext();

  const handleClick = () => {
    const [localDataTrackPublication] = [
      ...room!.localParticipant.dataTracks.values(),
    ];

    localDataTrackPublication.track.send(
      JSON.stringify("Testing coding component")
    );
  };

  useEffect(() => {
    console.log("coding");
  }, []);

  return (
    <div>
      <button onClick={handleClick}>Coding Component</button>
    </div>
  );
}
