export const iPadDevice =
  /Macintosh/.test(navigator.userAgent) && "ontouchend" in document;

export const isIpadDeviceChrome =
  /CriOS/i.test(navigator.userAgent) &&
  /iphone|ipod|ipad/i.test(navigator.userAgent);

export const isMobile = (() => {
  if (
    typeof navigator === "undefined" ||
    typeof navigator.userAgent !== "string"
  ) {
    return false;
  }
  return /Mobile/.test(navigator.userAgent);
})();
