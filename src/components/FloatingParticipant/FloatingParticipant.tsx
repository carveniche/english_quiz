import { Rnd } from "react-rnd";

export default function FloatingParticipant() {
  return (
    <div
      style={{
        position: "absolute",
        right: 100,
      }}
    >
      <Rnd>
        <div className=" border border-black min-w-[100px] min-h-[100px]">
          <h1>Hello</h1>
        </div>
      </Rnd>
    </div>
  );
}
