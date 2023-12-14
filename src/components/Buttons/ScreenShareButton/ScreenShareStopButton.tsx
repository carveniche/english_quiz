import clsx from "clsx";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import useVideoContext from "../../../hooks/useVideoContext/useVideoContext";
import { isTutorTechBoth } from "../../../utils/participantIdentity";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      background: theme.brand,
      color: "white",
      "&:hover": {
        background: "#600101",
      },
    },
  })
);

export default function ScreenShareStopButton(props: { className?: string }) {
  const classes = useStyles();
  const { room, isSharingScreen, toggleScreenShare } = useVideoContext();
  const localParticipant = room?.localParticipant?.identity;

  return (
    <>
      {isTutorTechBoth({ identity: localParticipant || "" }) &&
        isSharingScreen && (
          <Button
            onClick={() => toggleScreenShare("")}
            className={clsx(classes.button, props.className)}
            data-cy-disconnect
          >
            Stop Screen Share
          </Button>
        )}
    </>
  );
}
