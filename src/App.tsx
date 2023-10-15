import "./index.css";
import { useRef, useState } from "react";
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
import { ChatProvider } from "./components/ChatProvider";
import MainScreenRecording from "./components/ScreenRecording/MainScreenRecording";
import StudentFeedBackForm from "./components/FeedBackForms/StudentFeedbackForms/StudentFeedBackForm";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import useVideoContext from "./hooks/useVideoContext/useVideoContext";
import TeacherFeedbackFormStatus from "./components/FeedBackForms/TeacherFeedbackForm/TeacherFeedbackFormStatus";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";

interface AppProps {
  setError: React.Dispatch<React.SetStateAction<TwilioError | Error | null>>;
}

const Main = styled("main")(({ theme }: { theme: Theme }) => ({
  overflow: "hidden",
}));

const logger = Logger.getLogger("twilio-video");
logger.setLevel("SILENT");
function JoinedScreen() {
  const parentRef = useRef<HTMLDivElement | null>(null);
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

      <Header />
      <Header2 />

      <ReconnectingNotification />
      <MobileTopMenuBar />
      <div className="section-component-layout" ref={parentRef}>
        <Room parentRef={parentRef} />
        <MainScreenRecording />
        <AllPageRoutes />
      </div>
      <MenuBar />
    </Main>
  );
}
export function VideoApp() {
  const [error, setError] = useState<TwilioError | Error | null>(null);
  const connectionOptions = useConnectionOptions();

  return (
    <VideoProvider options={connectionOptions} onError={setError}>
      <ErrorDialog dismissError={() => setError(null)} error={error} />
      <BrowserRouter>
        <ChatProvider>
          <ErrorBoundary>
            <App setError={setError} />
          </ErrorBoundary>
        </ChatProvider>
      </BrowserRouter>
    </VideoProvider>
  );
}

function App({ setError }: AppProps) {
  const roomState = useRoomState();
  return (
    <>
      {roomState === "disconnected" ? (
        <>
          <PreJoinScreen setError={setError} />
        </>
      ) : (
        <JoinedScreen />
      )}
    </>
  );
}

export default App;
