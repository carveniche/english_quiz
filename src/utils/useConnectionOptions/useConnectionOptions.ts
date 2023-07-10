import { ConnectOptions } from "twilio-video";

import { isMobile } from "../devices";
import removeUndefineds from "../common";

import { Track, VideoBandwidthProfileOptions } from "twilio-video";

export interface Settings {
  trackSwitchOffMode: VideoBandwidthProfileOptions["trackSwitchOffMode"];
  dominantSpeakerPriority?: Track.Priority;
  bandwidthProfileMode: VideoBandwidthProfileOptions["mode"];
  maxAudioBitrate: string;
  contentPreferencesMode?: "auto" | "manual";
  clientTrackSwitchOffControl?: "auto" | "manual";
  name: string;
}

type SettingsKeys = keyof Settings;

export interface SettingsAction {
  name: SettingsKeys;
  value: string;
}

export const initialSettings: Settings = {
  trackSwitchOffMode: undefined,
  dominantSpeakerPriority: "standard",
  bandwidthProfileMode: "collaboration",
  maxAudioBitrate: "16000",
  contentPreferencesMode: "auto",
  clientTrackSwitchOffControl: "auto",
  name: "RM8a6df75a01a51e2f1d3933e21b15c15f",
};

export default function useConnectionOptions() {
  // const { settings } = useAppState();
  const settings = initialSettings; // Neet to create separate redux store to get this values and store these values

  // See: https://sdk.twilio.com/js/video/releases/2.0.0/docs/global.html#ConnectOptions
  // for available connection options.
  const connectionOptions: ConnectOptions = {
    // Bandwidth Profile, Dominant Speaker, and Network Quality
    // features are only available in Small Group or Group Rooms.
    // Please set "Room Type" to "Group" or "Small Group" in your
    // Twilio Console: https://www.twilio.com/console/video/configure
    bandwidthProfile: {
      video: {
        mode: settings.bandwidthProfileMode,
        dominantSpeakerPriority: settings.dominantSpeakerPriority,
        trackSwitchOffMode: settings.trackSwitchOffMode,
        contentPreferencesMode: settings.contentPreferencesMode,
        clientTrackSwitchOffControl: settings.clientTrackSwitchOffControl,
      },
    },
    dominantSpeaker: true,
    networkQuality: { local: 1, remote: 1 },

    // Comment this line if you are playing music.
    maxAudioBitrate: Number(settings.maxAudioBitrate),

    preferredVideoCodecs: "auto",

    //@ts-ignore - Internal use only. This property is not exposed in type definitions.
    // environment: process.env.REACT_APP_TWILIO_ENVIRONMENT,
  };

  // For mobile browsers, limit the maximum incoming video bitrate to 2.5 Mbps.
  if (isMobile && connectionOptions?.bandwidthProfile?.video) {
    connectionOptions!.bandwidthProfile!.video!.maxSubscriptionBitrate = 2500000;
  }

  //   if (process.env.REACT_APP_TWILIO_ENVIRONMENT === "dev") {
  //     //@ts-ignore - Internal use only. This property is not exposed in type definitions.
  //     connectionOptions!.wsServer = "wss://us2.vss.dev.twilio.com/signaling";
  //   }

  // Here we remove any 'undefined' values. The twilio-video SDK will only use defaults
  // when no value is passed for an option. It will throw an error when 'undefined' is passed.
  return removeUndefineds(connectionOptions);
}
