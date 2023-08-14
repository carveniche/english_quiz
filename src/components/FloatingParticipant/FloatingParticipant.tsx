import { Rnd } from "react-rnd";

export default function FloatingParticipant(props: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: "absolute",
        right: 190,
        marginRight: 5,
      }}
    >
      <Rnd>{props.children}</Rnd>
    </div>
  );
}
