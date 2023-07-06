import "./index.css";
import AppStateProvider, { useAppState } from "./state";
import { VideoProvider } from "./components/VideoProvider";
import JoiningScreen from "./components/JoiningScreen/JoiningScreen";
import useConnectionOptions from "./utils/useConnectionOptions/useConnectionOptions";

function App() {
  const { error, setError } = useAppState();
  const connectionOptions = useConnectionOptions();

  return (
    <div>
      <h1>Hello</h1>
      <VideoProvider options={connectionOptions} onError={setError}>
        <JoiningScreen />
      </VideoProvider>
    </div>
  );
}

export default App;
