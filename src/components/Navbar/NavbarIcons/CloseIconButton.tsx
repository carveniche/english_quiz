import { MouseEventHandler } from "react";
interface CloseIconButton {
  onClick: MouseEventHandler | undefined;
}
export default function CloseIconButton({ onClick }: CloseIconButton) {
  return (
    <div onClick={onClick} className="cursor-pointer ">
      <div className="closebuttonclass"></div>
    </div>
  );
}
