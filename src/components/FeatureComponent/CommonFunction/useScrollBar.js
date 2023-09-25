import { useContext, useRef } from "react";
import { ViewStatusContext } from "../Mathzone/mathzone";
import { dragdropPointCordinate } from "./dragdropPointCordinate";

export function useScrollBar() {
  const { whitePageRef } = useContext(ViewStatusContext);
  let scrollPositionRef = useRef();
  const timerRef = useRef(null);
  const handleDrag = (e) => {
    if (!whitePageRef?.current) return;
    let ele = whitePageRef.current;
    if (ele?.scrollHeight <= ele.clientHeight) return;
    let dy = dragdropPointCordinate(e)[1] - scrollPositionRef.current.y;
    dy *= -1;
    // console.log( scrollPositionRef.current)
    ele.scrollTop = scrollPositionRef.current.top - dy;
  };
  const handleDragStart = (e) => {
    if (timerRef.current || !whitePageRef?.current) return;
    let elem = whitePageRef.current;
    let y = dragdropPointCordinate(e)[1];

    scrollPositionRef.current = {
      y: y,
      top: elem.scrollTop,
    };
    console.log(scrollPositionRef.current);
  };
  return [handleDrag, handleDragStart];
}
