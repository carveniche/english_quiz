import { useEffect } from "react";
import { videoCallToken } from "../../../api/index";
import { useSelector, useDispatch } from "react-redux";
import { updateVideoCallTokenData } from "../../../redux/features/videoCallTokenData";
import { RootState } from "../../../redux/store";
import {
  makeStyles,
  Typography,
  Grid,
  Button,
  Theme,
  Hidden,
  Switch,
  Tooltip,
} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Divider from "@material-ui/core/Divider";
import LocalVideoPreview from "./LocalVideoPreview/LocalVideoPreview";
import SettingsMenu from "./SettingsMenu/SettingsMenu";
import ToggleAudioButton from "../../Buttons/ToggleAudioButton/ToggleAudioButton";
import ToggleVideoButton from "../../Buttons/ToggleVideoButton/ToggleVideoButton";
import useVideoContext from "../../../hooks/useVideoContext/useVideoContext";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { useKrispToggle } from "../../../hooks/useKrispToggle/useKrispToggle";
import SmallCheckIcon from "../../../icons/SmallCheckIcon";
import InfoIconOutlined from "../../../icons/InfoIconOutlined";

import { TwilioError } from "twilio-video";
import { videoCallTokenErrorWhileJoining } from "../../../genericErrorConstant";
const useStyles = makeStyles((theme: Theme) => ({
  gutterBottom: {
    marginBottom: "1em",
  },
  marginTop: {
    marginTop: "1em",
  },
  deviceButton: {
    width: "100%",
    border: "2px solid #aaa",
    margin: "1em 0",
  },
  localPreviewContainer: {
    paddingRight: "2em",
    marginBottom: "2em",
    [theme.breakpoints.down("sm")]: {
      padding: "0 2.5em",
    },
  },
  joinButtons: {
    display: "flex",
    justifyContent: "space-between",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column-reverse",
      width: "100%",
      "& button": {
        margin: "0.5em 0",
      },
    },
  },
  mobileButtonBar: {
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      justifyContent: "space-between",
      margin: "1.5em 0 1em",
    },
  },
  mobileButton: {
    padding: "0.8em 0",
    margin: 0,
  },
  toolTipContainer: {
    display: "flex",
    alignItems: "center",
    "& div": {
      display: "flex",
      alignItems: "center",
    },
    "& svg": {
      marginLeft: "0.3em",
    },
  },
}));

interface DeviceSelectionScreenProps {
  name: string;
  setError: React.Dispatch<React.SetStateAction<TwilioError | Error | null>>;
}

interface tokenParameters {
  getVideoCallToken: (userId: number, liveClassId: number) => Promise<void>;
}

interface tokenData {
  class_start_time: string;
  class_type: string;
  country: string;
  demo: boolean;
  env: string;
  grade: string;
  group_class: boolean;
  iso_code: string;
  new_coding_plan: boolean;
  role_name: string;
  room_id: string;
  show_new_codings: boolean;
  status: boolean;
  student_ids: string[];
  students: string[];
  teacher_id: number;
  teacher_name: string;
  time_zone: string;
  token: string;
  user_name: string;
  white_board_url: string;
}

export default function DeviceSelectionScreen({
  name,
  setError,
}: DeviceSelectionScreenProps) {
  const classes = useStyles();

  const videoCallTokenData = useSelector(
    (state: RootState) => state.videoCallTokenData
  );

  const { userId, liveClassId, isKrispEnabled, isKrispInstalled } = useSelector(
    (state: RootState) => state.liveClassDetails
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (userId != 0 && liveClassId != 0) {
      getVideoCallToken(userId, liveClassId);
    }
  }, [userId, liveClassId]);

  const getVideoCallToken: tokenParameters["getVideoCallToken"] = async (
    userId,
    liveClassId
  ) => {
    try {
      await videoCallToken(userId, liveClassId).then((response) => {
        if (response.data.status) {
          setNeccessaryInformationsFromVideoCallTokenApi(response.data);
        }
      });
    } catch (error) {
      console.error("API request error:", error);
    }
  };

  const setNeccessaryInformationsFromVideoCallTokenApi = (data: tokenData) => {
    if (typeof data === "object" && data !== null) {
      const convertedDataToArray = Object.entries(data);

      convertedDataToArray.map(([key, value]) => {
        const finalData = {
          key,
          value,
        };
        dispatch(updateVideoCallTokenData(finalData));
      });
    }
  };

  const isFetching = false; //Get this value from redux store;

  const {
    connect: videoConnect,
    isAcquiringLocalTracks,
    isConnecting,
  } = useVideoContext();

  const { toggleKrisp } = useKrispToggle();
  const disableButtons = isFetching || isAcquiringLocalTracks || isConnecting;

  const handleJoin = () => {
    if (videoCallTokenData.token != null) {
      let token = JSON.stringify(videoCallTokenData.token);
      videoConnect(JSON.parse(token));
    } else {
      const error = new Error();
      error.message = videoCallTokenErrorWhileJoining.errroMessage;
      error.code = videoCallTokenErrorWhileJoining.errorDescription;
      setError(error);
    }
  };

  if (isFetching || isConnecting) {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        direction="column"
        style={{ height: "100%" }}
      >
        <div>
          <CircularProgress variant="indeterminate" />
        </div>
        <div>
          <Typography
            variant="body2"
            style={{ fontWeight: "bold", fontSize: "16px" }}
          >
            Joining Meeting
          </Typography>
        </div>
      </Grid>
    );
  }

  return (
    <>
      <Typography variant="h5" className={classes.gutterBottom}></Typography>

      <Grid container justifyContent="center">
        <Grid item md={7} sm={12} xs={12}>
          <div className={classes.localPreviewContainer}>
            <LocalVideoPreview identity={name} />
          </div>
          <div className={classes.mobileButtonBar}>
            <Hidden mdUp>
              <ToggleAudioButton
                className={classes.mobileButton}
                disabled={disableButtons}
              />
              <ToggleVideoButton
                className={classes.mobileButton}
                disabled={disableButtons}
              />
              <SettingsMenu mobileButtonClass={classes.mobileButton} />
            </Hidden>
          </div>
        </Grid>
        <Grid item md={5} sm={12} xs={12}>
          <Grid
            container
            direction="column"
            justifyContent="space-between"
            style={{ alignItems: "normal" }}
          >
            <div>
              <Hidden smDown>
                <ToggleAudioButton
                  className={classes.deviceButton}
                  disabled={disableButtons}
                />
                <ToggleVideoButton
                  className={classes.deviceButton}
                  disabled={disableButtons}
                />
              </Hidden>
            </div>
          </Grid>
        </Grid>

        <Grid item md={12} sm={12} xs={12}>
          {isKrispInstalled && (
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              style={{ marginBottom: "1em" }}
            >
              <div className={classes.toolTipContainer}>
                <Typography variant="subtitle2">Noise Cancellation</Typography>
                <Tooltip
                  title="Suppress background noise from your microphone"
                  interactive
                  leaveDelay={250}
                  leaveTouchDelay={15000}
                  enterTouchDelay={0}
                >
                  <div>
                    <InfoIconOutlined />
                  </div>
                </Tooltip>
              </div>

              <FormControlLabel
                control={
                  <Switch
                    checked={!!isKrispEnabled}
                    checkedIcon={<SmallCheckIcon />}
                    disableRipple={true}
                    onClick={toggleKrisp}
                  />
                }
                label={isKrispEnabled ? "Enabled" : "Disabled"}
                style={{ marginRight: 0 }}
                // Prevents <Switch /> from being temporarily enabled (and then quickly disabled) in unsupported browsers after
                // isAcquiringLocalTracks becomes false:
                disabled={isKrispEnabled && isAcquiringLocalTracks}
              />
            </Grid>
          )}
          <Divider />
        </Grid>

        <Grid item md={12} sm={12} xs={12}>
          <Grid
            container
            direction="row"
            alignItems="center"
            style={{ marginTop: "1em" }}
          >
            <Hidden smDown>
              <Grid item md={7} sm={12} xs={12}>
                <SettingsMenu mobileButtonClass={classes.mobileButton} />
              </Grid>
            </Hidden>

            <Grid item md={5} sm={12} xs={12}>
              <div className={classes.joinButtons}>
                <Button
                  variant="outlined"
                  color="primary"
                  style={{
                    cursor: "none",
                  }}
                >
                  T.2.36
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  data-cy-join-now
                  onClick={handleJoin}
                  disabled={disableButtons}
                >
                  Join Now
                </Button>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
