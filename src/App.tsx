import "./index.css";
import { useState } from "react";
import { VideoProvider } from "./components/VideoProvider";
import MenuBar from "./components/MenuBar/MenuBar";
import PreJoinScreen from "./components/PreJoinScreen/PreJoinScreen";
import useConnectionOptions from "./utils/useConnectionOptions/useConnectionOptions";
import { TwilioError, Logger } from "twilio-video";
import useRoomState from "./hooks/useRoomState/useRoomState";

import ErrorDialog from "./components/ErrorDialog/ErrorDialog";
import { styled, Theme } from "@material-ui/core/styles";
import Room from "./components/Room/Room";
import ReconnectingNotification from "./components/ReconnetingNotification/ReconnectingNotification";
import MobileTopMenuBar from "./components/MobileTopMenuBar/MobileTopMenuBar";

import { BrowserRouter } from "react-router-dom";
import AllPageRoutes from "./Router/AllPageRoutes";

import Header2 from "./components/Navbar/Header2";
import Header from "./components/Navbar/Header";
import { getQueryParams } from "./utils/getQueryParams";
import { ChatProvider } from "./components/ChatProvider";
import MainScreenRecording from "./components/ScreenRecording/MainScreenRecording";
import StudentFeedBackForm from "./components/FeedBackForms/StudentFeedbackForms/StudentFeedBackForm";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import useVideoContext from "./hooks/useVideoContext/useVideoContext";
import TeacherFeedbackFormStatus from "./components/FeedBackForms/TeacherFeedbackForm/TeacherFeedbackFormStatus";

const Main = styled("main")(({ theme }: { theme: Theme }) => ({
  overflow: "hidden",
  // paddingBottom: `${theme.footerHeight}px`, // Leave some space for the footer
  // background: "black",
  // [theme.breakpoints.down("sm")]: {
  //   paddingBottom: `${theme.mobileFooterHeight + theme.mobileTopBarHeight}px`, // Leave some space for the mobile header and footer
  // },
}));

const logger = Logger.getLogger("twilio-video");
logger.setLevel("SILENT");
function JoinedScreen() {
  const { room } = useVideoContext();
  const localParticipant = room?.localParticipant;
  const { isClassHasDisconnected } = useSelector(
    (state: RootState) => state.liveClassDetails
  );
  return (
    <Main>
      {isClassHasDisconnected &&
        (localParticipant?.identity === "tutor" ? (
          <TeacherFeedbackFormStatus />
        ) : (
          <StudentFeedBackForm />
        ))}
      {/* {pathname === "/" && <Navigate to={`/allScreen?${params}`} />} */}
      <Header />
      <Header2 />

      <ReconnectingNotification />
      <MobileTopMenuBar />
      <div className="section-component-layout">
        <Room />
        <MainScreenRecording />
        <AllPageRoutes />
      </div>
      <MenuBar />
    </Main>
  );
}
export function VideoApp() {
  const [error, setError] = useState<TwilioError | null>(null);
  const connectionOptions = useConnectionOptions();

  return (
    <VideoProvider options={connectionOptions} onError={setError}>
      <ErrorDialog dismissError={() => setError(null)} error={error} />
      <BrowserRouter>
        <ChatProvider>
          <App />
        </ChatProvider>
      </BrowserRouter>
    </VideoProvider>
  );
}

function App() {
  const roomState = useRoomState();
  return (
    <>
      {roomState === "disconnected" ? (
        <>
          <PreJoinScreen />
        </>
      ) : (
        <JoinedScreen />
      )}
    </>
  );
}

export default App;
