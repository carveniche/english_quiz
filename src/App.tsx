import "./index.css";
import { useState } from "react";
import { VideoProvider } from "./components/VideoProvider";
import MenuBar from "./components/MenuBar/MenuBar";
import PreJoinScreen from "./components/PreJoinScreen/PreJoinScreen";
import useConnectionOptions from "./utils/useConnectionOptions/useConnectionOptions";
import { TwilioError, Logger } from "twilio-video";
import useRoomState from "./hooks/useRoomState/useRoomState";
import { ParticipantProvider } from "./components/ParticipantProvider";
import ErrorDialog from "./components/ErrorDialog/ErrorDialog";
import { styled, Theme } from "@material-ui/core/styles";
import Room from "./components/Room/Room";
import ReconnectingNotification from "./components/ReconnetingNotification/ReconnectingNotification";
import MobileTopMenuBar from "./components/MobileTopMenuBar/MobileTopMenuBar";

import { BrowserRouter } from "react-router-dom";
import AllPageRoutes from "./Router/AllPageRoutes";

import Header2 from "./components/Navbar/Header2";
import Header from "./components/Navbar/Header";

const Container = styled("div")({
  display: "grid",
  gridTemplateRows: "1fr auto",
});

const Main = styled("main")(({ theme }: { theme: Theme }) => ({
  overflow: "hidden",
  paddingBottom: `${theme.footerHeight}px`, // Leave some space for the footer
  background: "black",
  [theme.breakpoints.down("sm")]: {
    paddingBottom: `${theme.mobileFooterHeight + theme.mobileTopBarHeight}px`, // Leave some space for the mobile header and footer
  },
}));

const logger = Logger.getLogger("twilio-video");
logger.setLevel("SILENT");

export function VideoApp() {
  // const { error, setError } = useAppState();
  const [error, setError] = useState<TwilioError | null>(null);
  const connectionOptions = useConnectionOptions();

  return (
    <VideoProvider options={connectionOptions} onError={setError}>
      <ErrorDialog dismissError={() => setError(null)} error={error} />
      <ParticipantProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ParticipantProvider>
    </VideoProvider>
  );
}

function App() {
  const [error, setError] = useState<TwilioError | null>(null);

  const roomState = useRoomState();

  return (
    <>
      {roomState === "disconnected" ? (
        <>
          <PreJoinScreen />
        </>
      ) : (
        <Main>
          {/* {pathname === "/" && <Navigate to={`/allScreen?${params}`} />} */}
          <Header />
          <Header2 />
          <AllPageRoutes />
          <ReconnectingNotification />
          <MobileTopMenuBar />
          <Room />
          <MenuBar />
        </Main>
      )}
    </>
  );
}

export default App;
