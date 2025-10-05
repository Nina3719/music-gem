import { IconButton, Box, useTheme, alpha } from "@mui/material";
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
import CircleIcon from "@mui/icons-material/Circle";

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
    ? alpha(theme.palette.primary.light, 0.8)
    : alpha(theme.palette.primary.dark, 0.8);
  const activeColor = theme.palette.primary.main;

  const iconButtonSx = {
    "&:hover": { color: hoverColor },
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(2), // bigger touch target on mobile
    },
  };

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
          ...iconButtonSx,
          color: loopMode !== LoopMode.Off ? activeColor : baseIconColor,
          position: "relative",
          "& svg": {
            transition: "filter 0.2s ease-in-out",
          },
        }}
      >
        {loopMode === LoopMode.One ? (
          <>
            <RepeatOneIcon fontSize="small" />
            {loopMode === LoopMode.One && (
              <CircleIcon
                sx={{
                  fontSize: 5,
                  position: "absolute",
                  bottom: {
                    xs: 10, // mobile
                    sm: 4, // desktop+
                  },
                  left: "50%",
                  transform: "translateX(-50%)",
                  color: activeColor,
                }}
              />
            )}
          </>
        ) : (
          <>
            <RepeatIcon fontSize="small" />
            {loopMode === LoopMode.All && (
              <CircleIcon
                sx={{
                  fontSize: 5,
                  position: "absolute",
                  bottom: {
                    xs: 10, // mobile
                    sm: 4, // desktop+
                  },
                  left: "50%",
                  transform: "translateX(-50%)",
                  color: activeColor,
                }}
              />
            )}
          </>
        )}
      </IconButton>

      <IconButton
        onClick={() => onPrev(true)}
        sx={{
          ...iconButtonSx,
          color: baseIconColor,
          "&:hover": { color: hoverColor },
        }}
      >
        <PrevIcon fontSize="medium" />
      </IconButton>
      <IconButton
        onClick={onPlayPause}
        sx={{
          ...iconButtonSx,
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
          ...iconButtonSx,
          color: baseIconColor,
          "&:hover": { color: hoverColor },
        }}
      >
        <NextIcon fontSize="medium" />
      </IconButton>

      <IconButton
        onClick={onToggleLike}
        sx={{
          ...iconButtonSx,
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
