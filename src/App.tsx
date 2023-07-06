import "./index.css";
import { useAppState } from "./state";
import { VideoProvider } from "./components/VideoProvider";
import PreJoinScreen from "./components/PreJoinScreen/PreJoinScreen";
import useConnectionOptions from "./utils/useConnectionOptions/useConnectionOptions";

function App() {
  const { error, setError } = useAppState();
  const connectionOptions = useConnectionOptions();

  return (
    <VideoProvider options={connectionOptions} onError={setError}>
      <PreJoinScreen />
    </VideoProvider>
  );
}

export default App;
