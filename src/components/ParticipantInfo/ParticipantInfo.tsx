import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { LocalVideoTrack, Participant, RemoteVideoTrack } from "twilio-video";

import AvatarIcon from "../../icons/AvatarIcon";

import Typography from "@material-ui/core/Typography";

import useIsTrackSwitchedOff from "../../hooks/useIsTrackSwitchedOff/useIsTrackSwitchedOff";
import usePublications from "../../hooks/usePublications/usePublications";
import useTrack from "../../hooks/useTrack/useTrack";
import useParticipantIsReconnecting from "../../hooks/useParticipantIsReconnecting/useParticipantIsReconnecting";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    infoContainer: {
      position: "absolute",
      zIndex: 2,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: "100%",
      width: "100%",
      background: "transparent",
      top: 0,
    },

    infoRowBottom: {
      display: "flex",
      justifyContent: "space-between",
      position: "absolute",
      bottom: 0,
      left: 0,
    },
    innerContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
    },

    participantName: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "black",
      position: "absolute",
      top: 12,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: 1,
      [theme.breakpoints.down("sm")]: {
        "& svg": {
          transform: "scale(0.7)",
        },
      },
    },

    avatarContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "black",
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: 1,
      [theme.breakpoints.down("sm")]: {
        "& svg": {
          transform: "scale(0.7)",
        },
      },
    },

    avatarContainerInner: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    reconnectingContainer: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(40, 42, 43, 0.75)",
      zIndex: 1,
    },

    identity: {
      background: "rgba(0, 0, 0, 0.5)",
      color: "white",
      padding: "0.18em 0.3em 0.18em 0",
      margin: 0,
      display: "flex",
      alignItems: "center",
    },

    typography: {
      color: "white",
      [theme.breakpoints.down("sm")]: {
        fontSize: "0.75rem",
      },
      marginTop: "10px",
    },
  })
);

interface ParticipantInfoProps {
  participant: Participant;
  children: React.ReactNode;
  onClick?: () => void;
  isSelected?: boolean;
  isLocalParticipant?: boolean;
  hideParticipant?: boolean;
  isDominantSpeaker?: boolean;
  screen?: string;
}

export default function ParticipantInfo({
  participant,
  isLocalParticipant,
  children,
  screen,
}: ParticipantInfoProps) {
  const publications = usePublications(participant);

  const videoPublication = publications.find(
    (p) => !p.trackName.includes("screen") && p.kind === "video"
  );

  const isVideoEnabled = Boolean(videoPublication);

  const videoTrack = useTrack(videoPublication);
  const isVideoSwitchedOff = useIsTrackSwitchedOff(
    videoTrack as LocalVideoTrack | RemoteVideoTrack
  );

  const isParticipantReconnecting = useParticipantIsReconnecting(participant);

  const classes = useStyles();

  return (
    <div>
      <div
        style={{
          position: screen === "allOtherScreens" ? "relative" : "absolute",
        }}
        className={classes.innerContainer}
      >
        {(!isVideoEnabled || isVideoSwitchedOff) && (
          <>
            <div className={classes.avatarContainer}>
              <div className={classes.avatarContainerInner}>
                <AvatarIcon />
                <Typography
                  variant="body1"
                  className={classes.typography}
                  component="span"
                >
                  {participant.identity}
                  {isLocalParticipant && " (You)"}
                </Typography>
              </div>
            </div>
          </>
        )}
        {isParticipantReconnecting && (
          <div className={classes.reconnectingContainer}>
            <Typography variant="body1" className={classes.typography}>
              Reconnecting...
            </Typography>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
