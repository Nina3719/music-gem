import "./styles.css";
import { Player } from "./components/MusicPlayer";

export default function App() {
  return (
    <div className="App">
      {/* input: track id or track ids */}
      <div>Music Player</div>
      <Player trackIds={[]} autoplay />
      {/* <Player trackIds={[]} /> */}
    </div>
  );
}
