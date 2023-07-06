import { LocalVideoTrack, RemoteVideoTrack, TwilioError } from "twilio-video";

declare module "twilio-video" {
  interface LocalVideoTrack {
    isSwitchedOff: undefined;
    setPriority: undefined;
  }
  // These help to create union types between Local and Remote VideoTracks
}

declare global {
  interface MediaDevices {
    getDisplayMedia(constraints: MediaStreamConstraints): Promise<MediaStream>;
  }

  interface HTMLMediaElement {
    setSinkId?(sinkId: string): Promise<undefined>;
  }

  // Helps create a union type with TwilioError
  interface Error {
    code: undefined;
  }
}

export type Callback = (...args: any[]) => void;
export type ErrorCallback = (error: TwilioError | Error) => void;
export type IVideoTrack = LocalVideoTrack | RemoteVideoTrack;
export type RoomType = "group" | "group-small" | "peer-to-peer" | "go";
