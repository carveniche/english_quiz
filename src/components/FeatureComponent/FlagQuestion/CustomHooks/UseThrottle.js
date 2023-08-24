import React, { useRef } from "react";

export default function useThrottle(delay) {
  const ref = useRef(null);

  const inprogressThrottle = () => {
    return ref.current;
  };
  const handleThrottle = () => {
    ref.current = setTimeout(() => {
      ref.current = null;
    }, delay);
  };
  return [inprogressThrottle, handleThrottle];
}
