
export default function stopAllMedia() {
  try {
    // stop any ongoing text-to-speech
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    // pause all playing <audio> and <video> safely
    const mediaElements = document.querySelectorAll('audio, video');
    mediaElements.forEach(media => {
      if (media && typeof media.pause === "function" && !media.paused) {
        media.pause();
        // media.currentTime = 0; // optional — reset playback position
      }
    });
  } catch (error) {
    console.error("Error while stopping media:", error);
  }

};
