import { touchEventType } from "./touchEventType";

export function dragdropPointCordinate(e) {
  console.log(e.type);
  if (touchEventType.includes(e?.type)) {
    let touchPointes = e?.originalEvent ?? e;
    var touch = touchPointes.touches[0] || touchPointes.changedTouches[0];
    var mouseX = touch.pageX;
    var mouseY = touch.pageY;
  } else {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }
  return [mouseX, mouseY];
}
