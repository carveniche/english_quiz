interface GameModeSelectionProps {
  startSpeedMath: Function;
  selectedPlayMode: Function;
  remoteParticipantCount: number;
}

export default function GameModeSelection({
  startSpeedMath,
  selectedPlayMode,
  remoteParticipantCount,
}: GameModeSelectionProps) {
  console.log(
    "remoteParticipantCount in GameModeSelection SpeedMath",
    remoteParticipantCount
  );
  //Get Value from Redux RemoteParticipant Length and then check Mode of Play(Single user or Multiple User)

  return <div>GameModeSelection</div>;
}
