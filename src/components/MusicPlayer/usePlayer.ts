import { useState, useCallback } from "react";
import { Track, LoopMode } from "./types";

export type UsePlayerArgs = {
  tracks: Track[];
  autoplay?: boolean;
};

export type PlayerState = {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  currentIndex: number;
  loopMode: LoopMode;
  resetToStart: boolean;
  jumpToEnd: boolean;
  likedTracks: Set<string>;
};

export type PlayerActions = {
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  next: (manual?: boolean) => void;
  prev: (manual?: boolean) => void;
  setVolume: (val: number) => void;
  toggleLoop: () => void;
  clearReset: () => void;
  clearJump: () => void;
  toggleLike: (trackId: string) => void;
};

export type UsePlayerResults = {
  playerState: PlayerState;
  playerActions: PlayerActions;
};

export function usePlayer({ tracks }: UsePlayerArgs): UsePlayerResults {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [loopMode, setLoopMode] = useState<LoopMode>(LoopMode.Off);
  const [resetToStart, setResetToStart] = useState(false);
  const [jumpToEnd, setJumpToEnd] = useState(false);
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set());

  const currentTrack = tracks.length > 0 ? tracks[currentIndex] : null;

  // --- Actions ---
  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);
  const togglePlay = useCallback(() => setIsPlaying((p) => !p), []);

  const toggleLike = useCallback((trackId: string) => {
    setLikedTracks((prev) => {
      const next = new Set(prev);
      if (next.has(trackId)) {
        next.delete(trackId);
      } else {
        next.add(trackId);
      }
      return next;
    });
  }, []);

  const toggleLoop = useCallback(() => {
    setLoopMode((m) =>
      m === LoopMode.Off
        ? LoopMode.All
        : m === LoopMode.All
        ? LoopMode.One
        : LoopMode.Off
    );
  }, []);

  const next = useCallback(
    (manual = false) => {
      if (tracks.length === 0) return;
      if (!manual) {
        if (loopMode === LoopMode.One) {
          setCurrentIndex((i) => i);
          setResetToStart(true);
        }
        if (loopMode === LoopMode.All) {
          setCurrentIndex((i) => (i + 1) % tracks.length);
          setResetToStart(true);
        }
        if (loopMode === LoopMode.Off) {
          setCurrentIndex((i) => {
            if (i === tracks.length - 1) {
              setIsPlaying(false);
              return i; // stay at last track
            }
            return i + 1;
          });
        }
      }

      if (manual) {
        setCurrentIndex((i) => {
          if (i === tracks.length - 1) {
            if (loopMode === LoopMode.Off) {
              setIsPlaying(false);
              setJumpToEnd(true);
              return i; // stay at last track
            } else {
              const nextTrackIndex = (i + 1) % tracks.length;
              if (nextTrackIndex === i) {
                setResetToStart(true);
                setIsPlaying(true);
              }
              return nextTrackIndex;
            }
          }
          return (i + 1) % tracks.length;
        });

        if (loopMode === LoopMode.One) {
          setLoopMode(LoopMode.All);
        }
        // if (!isPlaying) setIsPlaying(true);
        return;
      }
    },
    [tracks.length, loopMode]
  );

  const prev = useCallback(
    (manual = false) => {
      if (tracks.length === 0) return;

      if (!manual) {
        if (loopMode === LoopMode.One) {
          setCurrentIndex((i) => i);
        } else if (loopMode === LoopMode.All) {
          setCurrentIndex((i) => (i - 1 + tracks.length) % tracks.length);
        } else if (loopMode === LoopMode.Off) {
          // if at first track, just restart and stop
          setCurrentIndex((i) => {
            if (i === 0) {
              setIsPlaying(false);
              return i;
            }
            return i - 1;
          });
        }
      }

      if (manual) {
        setCurrentIndex((i) => {
          if (i === 0) {
            if (loopMode === LoopMode.Off) {
              // ⬅️ jump to start of first track and play
              setResetToStart(true);
              return i;
            } else {
              // ⬅️ loop back to last track
              setResetToStart(true);
              return (i - 1 + tracks.length) % tracks.length;
            }
          }
          return (i - 1 + tracks.length) % tracks.length;
        });

        if (loopMode === LoopMode.One) {
          setLoopMode(LoopMode.All);
        }
        // if (!isPlaying) setIsPlaying(true);
      }
    },
    [tracks.length, loopMode]
  );

  return {
    playerState: {
      currentTrack,
      isPlaying,
      volume,
      currentIndex,
      loopMode,
      resetToStart,
      jumpToEnd,
      likedTracks,
    },
    playerActions: {
      play,
      pause,
      togglePlay,
      next,
      prev,
      setVolume,
      toggleLoop,
      clearReset: () => setResetToStart(false),
      clearJump: () => setJumpToEnd(false),
      toggleLike,
    },
  };
}
