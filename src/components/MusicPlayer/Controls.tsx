import { IconButton, Box, useTheme } from "@mui/material";
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  SkipNext as NextIcon,
  SkipPrevious as PrevIcon,
  Repeat as RepeatIcon,
  RepeatOne as RepeatOneIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from "@mui/icons-material";
import { LoopMode } from "./types";

type ControlProps = {
  isPlaying: boolean;
  loopMode: LoopMode;
  liked: boolean;
  onPlayPause: () => void;
  onNext: (manual?: boolean) => void;
  onPrev: (manual?: boolean) => void;
  onToggleLoop: () => void;
  onToggleLike: () => void;
};

export default function Controls({
  isPlaying,
  loopMode,
  liked,
  onPlayPause,
  onNext,
  onPrev,
  onToggleLoop,
  onToggleLike,
}: ControlProps) {
  const theme = useTheme();

  const isDark = theme.palette.mode === "dark";

  const baseIconColor = isDark ? "#ddd" : "#444";
  const hoverColor = isDark
    ? theme.palette.primary.light
    : theme.palette.primary.dark;
  const activeColor = theme.palette.primary.main;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1.25,
      }}
    >
      <IconButton
        onClick={onToggleLoop}
        sx={{
          color: loopMode !== LoopMode.Off ? activeColor : baseIconColor,
          "&:hover": { color: hoverColor },
        }}
      >
        {loopMode === LoopMode.One ? (
          <RepeatOneIcon fontSize="small" />
        ) : (
          <RepeatIcon fontSize="small" />
        )}
      </IconButton>

      <IconButton
        onClick={() => onPrev(true)}
        sx={{
          color: baseIconColor,
          "&:hover": { color: hoverColor },
        }}
      >
        <PrevIcon fontSize="medium" />
      </IconButton>
      <IconButton
        onClick={onPlayPause}
        sx={{
          color: baseIconColor,
          "&:hover": { color: hoverColor },
        }}
      >
        {isPlaying ? (
          <PauseIcon fontSize="large" />
        ) : (
          <PlayIcon fontSize="large" />
        )}
      </IconButton>
      <IconButton
        onClick={() => onNext(true)}
        sx={{
          color: baseIconColor,
          "&:hover": { color: hoverColor },
        }}
      >
        <NextIcon fontSize="medium" />
      </IconButton>

      <IconButton
        onClick={onToggleLike}
        sx={{
          color: liked ? activeColor : baseIconColor,
          "&:hover": { color: hoverColor },
        }}
      >
        {liked ? (
          <FavoriteIcon color="error" fontSize="small" />
        ) : (
          <FavoriteBorderIcon fontSize="small" />
        )}
      </IconButton>
    </Box>
  );
}
