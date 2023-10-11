import { useRef, useState } from "react";
import AboutDialog from "../../AboutDialog/AboutDialog";
import BackgroundIcon from "../../../icons/BackgroundIcon";
import DeviceSelectionDialog from "../../DeviceSelectionDialog/DeviceSelectionDialog";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import InfoIconOutlined from "../../../icons/InfoIconOutlined";
import MoreIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import SettingsIcon from "../../../icons/SettingsIcon";
import {
  Button,
  styled,
  Theme,
  useMediaQuery,
  Menu as MenuContainer,
  MenuItem,
  Typography,
} from "@material-ui/core";
import { isSupported } from "@twilio/video-processors";
import useVideoContext from "../../../hooks/useVideoContext/useVideoContext";
import FlipCameraIcon from "../../../icons/FlipCameraIcon";
import useFlipCameraToggle from "../../../hooks/useFlipCameraToggle/useFlipCameraToggle";
import { VideoRoomMonitor } from "@twilio/video-room-monitor";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { isTech } from "../../../utils/participantIdentity";

export const IconContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
  width: "1.5em",
  marginRight: "0.3em",
});

export default function Menu(props: { buttonClassName?: string }) {
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

  const [aboutOpen, setAboutOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  //   const { setIsGalleryViewActive, isGalleryViewActive } = useAppState();

  const { room, setIsBackgroundSelectionOpen } = useVideoContext();

  const anchorRef = useRef<HTMLButtonElement>(null);
  const { flipCameraDisabled, toggleFacingMode, flipCameraSupported } =
    useFlipCameraToggle();

  const { role_name } = useSelector(
    (state: RootState) => state.videoCallTokenData
  );

  return (
    <>
      <Button
        onClick={() => setMenuOpen((isOpen) => !isOpen)}
        ref={anchorRef}
        className={props.buttonClassName}
        data-cy-more-button
      >
        {isMobile ? (
          <MoreIcon />
        ) : (
          <>
            More
            <ExpandMoreIcon />
          </>
        )}
      </Button>
      <MenuContainer
        open={menuOpen}
        onClose={() => setMenuOpen((isOpen) => !isOpen)}
        anchorEl={anchorRef.current}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: isMobile ? -55 : "bottom",
          horizontal: "center",
        }}
      >
        <MenuItem onClick={() => setSettingsOpen(true)}>
          <IconContainer>
            <SettingsIcon />
          </IconContainer>
          <Typography variant="body1">Audio and Video Settings</Typography>
        </MenuItem>

        {isSupported && (
          <MenuItem
            onClick={() => {
              setIsBackgroundSelectionOpen(true);

              setMenuOpen(false);
            }}
          >
            <IconContainer>
              <BackgroundIcon />
            </IconContainer>
            <Typography variant="body1">Backgrounds</Typography>
          </MenuItem>
        )}

        {flipCameraSupported && (
          <MenuItem disabled={flipCameraDisabled} onClick={toggleFacingMode}>
            <IconContainer>
              <FlipCameraIcon />
            </IconContainer>
            <Typography variant="body1">Flip Camera</Typography>
          </MenuItem>
        )}
        {isTech({ identity: String(role_name) }) && (
          <MenuItem
            onClick={() => {
              if (room !== null) {
                VideoRoomMonitor.registerVideoRoom(room);
                VideoRoomMonitor.toggleMonitor();
                setMenuOpen(false);
              }
            }}
          >
            <IconContainer>
              <SearchIcon style={{ fill: "#707578", width: "0.9em" }} />
            </IconContainer>
            <Typography variant="body1">Room Monitor</Typography>
          </MenuItem>
        )}

        <MenuItem onClick={() => setAboutOpen(true)}>
          <IconContainer>
            <InfoIconOutlined />
          </IconContainer>
          <Typography variant="body1">About</Typography>
        </MenuItem>
      </MenuContainer>
      <AboutDialog
        open={aboutOpen}
        onClose={() => {
          setAboutOpen(false);
          setMenuOpen(false);
        }}
      />
      <DeviceSelectionDialog
        open={settingsOpen}
        onClose={() => {
          setSettingsOpen(false);
          setMenuOpen(false);
        }}
      />
    </>
  );
}
