import { useState, useRef, useEffect } from "react";
import { Box, Typography, useTheme, Snackbar, Alert } from "@mui/material";
import { Track, LoopMode } from "./types";
import TrackInfo from "./TrackInfo";
import Controls from "./Controls";
import Seeker from "./Seeker";
import VolumeSlider from "./VolumeSlider";
import { usePlayer } from "./usePlayer";

// Start with fake tracks using MP3s
// Then move on to adaptive bitrate streaming, etc.
// Minimize button / way -->

type PlayerProps = {
  tracks: Track[];
};

function LikeBanner({
  open,
  message,
  onClose,
}: {
  open: boolean;
  message: string;
  onClose: () => void;
}) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={2000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert severity="success" sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}

export default function Player({ tracks }: PlayerProps) {
  const { playerState, playerActions } = usePlayer({
    tracks,
  });

  const [likeBannerOpen, setLikeBannerOpen] = useState(false);
  const [likeBannerMessage, setLikeBannerMessage] = useState("");
  const [bannerQueue, setBannerQueue] = useState<string[]>([]);
  const [currentBanner, setCurrentBanner] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const theme = useTheme();

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(
    playerState.currentTrack?.duration ?? 0
  );
  const [buffered, setBuffered] = useState(0);

  // Load track src and play/pause
  useEffect(() => {
    if (!audioRef.current || !playerState.currentTrack) return;
    const audio = audioRef.current;

    console.log("Loading track: ", playerState.currentTrack.audio.mp3_url);

    audio.src = playerState.currentTrack.audio.mp3_url ?? "";
    audio.load(); // reset current element

    setCurrentTime(0);
    setDuration(0);

    if (playerState.isPlaying) {
      audio.play().catch((err) => {
        console.warn("Player blocked: ", err);
      });
    } else audio.pause();
  }, [playerState.currentTrack]);

  // Toggle play/pause
  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    if (playerState.isPlaying) {
      audio.play().catch((err) => {
        console.warn("Player blocked: ", err);
      });
    } else audio.pause();
  }, [playerState.isPlaying]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = playerState.volume;
  }, [playerState.volume]);

  // Update seek
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration || duration);
    const onEnded = () => {
      playerActions.next();
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, [playerState.currentTrack, playerActions]);

  const handleSeekCommitted = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    console.log("buffered:", buffered);
    const onProgress = () => {
      if (audio.buffered.length > 0) {
        const end = audio.buffered.end(audio.buffered.length - 1);
        setBuffered(end);
      }
    };

    audio.addEventListener("progress", onProgress);
    return () => audio.removeEventListener("progress", onProgress);
  }, [playerState.currentTrack]);

  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    if (playerState.resetToStart) {
      audio.currentTime = 0;
      setCurrentTime(0);
      if (playerState.isPlaying) {
        audio.play().catch((err) => console.warn("Autoplay blocked:", err));
      }
      playerActions.clearReset();
    }

    if (playerState.jumpToEnd) {
      const setToEnd = () => {
        const d = audio.duration;
        if (d && isFinite(d)) {
          audio.currentTime = d;
          setCurrentTime(d);
        }
        playerActions.clearJump();
      };

      if (!isNaN(audio.duration) && isFinite(audio.duration)) {
        setToEnd();
      } else {
        audio.addEventListener("loadedmetadata", setToEnd, { once: true });
      }
      if (playerState.isPlaying) {
        audio.play().catch((err) => console.warn("Autoplay blocked:", err));
      }
    }
  }, [playerState.resetToStart, playerState.jumpToEnd]);

  const showNextBanner = () => {
    setBannerQueue((prev) => {
      if (prev.length === 0) {
        setCurrentBanner(null);
        return [];
      }
      const [next, ...rest] = prev;
      setCurrentBanner(next);
      return rest;
    });
  };

  const handleToggleLike = () => {
    if (!playerState.currentTrack) return;

    const { id, title } = playerState.currentTrack;
    const wasLiked = playerState.likedTracks.has(id);

    playerActions.toggleLike(id);

    const message = wasLiked
      ? `${title} is removed from your liked songs`
      : `${title} is added to your liked songs`;

    // enqueue message
    setBannerQueue((prev) => [...prev, message]);

    // if nothing is showing, start immediately
    if (!currentBanner) {
      setCurrentBanner(message);
      setBannerQueue((prev) => prev.slice(0, -1));
    }
  };

  // TODO(chennina): Determine how to handle no track state better
  if (!playerState.currentTrack)
    return (
      <Typography variant="body2" color="text.secondary" align="center">
        🐈 No tracks 🐈
      </Typography>
    );

  // Player // style as one or a playlist // autoplay
  // Prefetching next / final
  // If only 1, should be a replay current
  // If multiple, then should allow users to see queue -> popup??
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        width: 350,
        p: 2,
        // pb: 2,
        borderRadius: 3,
        bgcolor:
          theme.palette.mode === "dark"
            ? "rgba(28,28,30,0.95)" // Apple dark gray
            : "#F2F2F7", // Apple light gray background
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 4px 12px rgba(0,0,0,0.5)"
            : "0 1px 3px rgba(0,0,0,0.1)", // soft subtle shadow
        gap: 1,
      }}
    >
      <TrackInfo track={playerState.currentTrack} />
      <Seeker
        currentTime={currentTime}
        duration={duration || 0}
        buffered={buffered}
        onSeekCommitted={handleSeekCommitted}
      />
      {/* TODO: Potentially pre-load the next and prev videos */}
      <Controls
        isPlaying={playerState.isPlaying}
        loopMode={playerState.loopMode}
        liked={
          playerState.currentTrack
            ? playerState.likedTracks.has(playerState.currentTrack.id)
            : false
        }
        onPlayPause={playerActions.togglePlay}
        onNext={() => playerActions.next(true)}
        onPrev={() => playerActions.prev(true)}
        onToggleLoop={playerActions.toggleLoop}
        onToggleLike={handleToggleLike}
      />
      {/* TODO: Remove; control volume by sound from device */}
      {/* <VolumeSlider
        volume={playerState.volume}
        onChange={playerActions.setVolume}
      /> */}
      <audio ref={audioRef} style={{ display: "none" }} />
      {/* <audio
        ref={audioRef}
        src={playerState.currentTrack?.audio_url}
        onEnded={() => playerActions.next(false)} // 👈 autoplay = false
      /> */}

      <LikeBanner
        open={!!currentBanner}
        message={currentBanner ?? ""}
        onClose={showNextBanner}
      />
    </Box>
  );
}
