import useVideoContext from "../../hooks/useVideoContext/useVideoContext";

import { ParticipantAudioTracks } from "../ParticipantAudioTracks/ParticipantAudioTracks";

import MainParticipant from "../MainParticipant/MainParticipant";
import ParticipantList from "../ParticipantList/ParticipantList";
import { makeStyles, Theme, useMediaQuery, useTheme } from "@material-ui/core";
import clsx from "clsx";
import BackgroundSelectionDialog from "../BackgroundSelectionDialog/BackgroundSelectionDialog";

const useStyles = makeStyles((theme: Theme) => {
  const totalMobileSidebarHeight = `${
    theme.sidebarMobileHeight +
    theme.sidebarMobilePadding * 2 +
    theme.participantBorderWidth
  }px`;
  return {
    container: {
      position: "relative",
      height: "100%",
      display: "grid",
      gridTemplateColumns: `1fr ${theme.sidebarWidth}px`,
      gridTemplateRows: "100%",
      [theme.breakpoints.down("sm")]: {
        gridTemplateColumns: `100%`,
        gridTemplateRows: `calc(100% - ${totalMobileSidebarHeight}) ${totalMobileSidebarHeight}`,
      },
    },
    rightDrawerOpen: {
      gridTemplateColumns: `1fr ${theme.sidebarWidth}px ${theme.rightDrawerWidth}px`,
    },
  };
});

export default function Room() {
  const classes = useStyles();
  const { room } = useVideoContext();
  const isChatWindowOpen = false;
  const isBackgroundSelectionOpen = false;

  return (
    <div>
      <div
        className={clsx(classes.container, {
          [classes.rightDrawerOpen]:
            isChatWindowOpen || isBackgroundSelectionOpen,
        })}
      >
        {/* <ChatSnackButton /> */}

        {/* 
        This ParticipantAudioTracks component will render the audio track for all participants in the room.
        It is in a separate component so that the audio tracks will always be rendered, and that they will never be 
        unnecessarily unmounted/mounted as the user switches between Gallery View and speaker View.
      */}

        {/* <ParticipantAudioTracks /> */}

        <>
          <MainParticipant />
          <ParticipantList />
        </>
        <BackgroundSelectionDialog />
      </div>
    </div>
  );
}
