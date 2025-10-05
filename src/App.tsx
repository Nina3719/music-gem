import "./styles.css";
import { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { Player } from "./components/MusicPlayer";
import { Track } from "./components/MusicPlayer/types";
import { loadAndParseTracks } from "./utils/loadTracks";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { darkTheme, lightTheme } from "./utils/theme";

const demoTrack = ["001-gold-lime.mp3"];

const demoTracks: string[] = [
  "001-gold-lime.mp3",
  "002-summerland.m4a",
  "003-blinding-lights.m4a",
  "004-show-pony.mp3",
  "005-vampire-bat.m4a",
  "006-nuclear.m4a",
];

export default function App() {
  const [tracks, setTracks] = useState<Track[] | null>(null);

  useEffect(() => {
    loadAndParseTracks(demoTracks).then(setTracks);
  }, [demoTracks]);

  if (tracks === null) {
    return (
      <Box sx={{ pt: 8, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="App">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            pt: 8,
          }}
        >
          {/* input: track id or track ids */}
          <Player tracks={tracks} />
          {/* <Player trackIds={[]} /> */}
        </Box>
      </div>
    </ThemeProvider>
  );
}
