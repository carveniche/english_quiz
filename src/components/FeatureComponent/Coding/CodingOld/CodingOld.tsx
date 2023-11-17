import CodingHeader from "../CodingHeader";

interface CodingOldProps {
  codingUrl: string;
}

export default function CodingOld({ codingUrl }: CodingOldProps) {
  return (
    <div className="flex flex-col w-full h-full justify-center items-cente">
      <div className="flex w-full justify-center items-center py-4">
        <CodingHeader />
      </div>
      <div
        className="flex w-full h-full justify-center items-center"
        style={{ height: "calc(100% - 72px" }}
      >
        <iframe className="w-full h-full" title="Coding" src={codingUrl} />
      </div>
    </div>
  );
}
