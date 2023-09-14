import clsx from "clsx";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import { Button } from "@material-ui/core";

import useVideoContext from "../../../hooks/useVideoContext/useVideoContext";
import { useDispatch } from "react-redux";
import { endRoomRequest } from "../../../redux/features/liveClassDetails";

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

export default function EndCallButton(props: { className?: string }) {
  const classes = useStyles();
  const { room } = useVideoContext();
  const dispatch = useDispatch();
  const handleOpenFeedbackForm = () => {
    dispatch(endRoomRequest(true));
  };
  return (
    <Button
      onClick={() => handleOpenFeedbackForm()}
      className={clsx(classes.button, props.className)}
      data-cy-disconnect
    >
      Disconnect
    </Button>
  );
}
