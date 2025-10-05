import { Slider, Box, Typography, styled, useTheme } from "@mui/material";
import { useState, useEffect } from "react";

const SeekerSlider = styled(Slider)<{ buffered?: number; duration?: number }>(
  ({ theme, buffered = 0, duration = 1 }) => {
    const isDark = theme.palette.mode === "dark";

    return {
      color: "transparent", // 👈 prevent MUI default blue
      height: 4,
      padding: 0,
      "& .MuiSlider-rail": {
        opacity: 1,
        height: 4,
        borderRadius: 2,
        background: `linear-gradient(
          to right,
          ${isDark ? "#777" : "#c4c4c4"} ${(buffered / duration) * 100}%,
          ${isDark ? "#535353" : "#e5e5e5"} ${(buffered / duration) * 100}%
        )`,
      },
      "& .MuiSlider-track": {
        border: "none",
        height: 4,
        borderRadius: 2,
        backgroundColor: isDark ? "#fff" : "#444", // force correct color
      },
      "& .MuiSlider-thumb": {
        width: 10,
        height: 10,
        backgroundColor: isDark ? "#fff" : "#f0f0f0",
        border: "none",
        opacity: 0,
        transition: "opacity 0.2s",
      },
      "&:hover .MuiSlider-thumb, & .MuiSlider-thumb.Mui-focusVisible, & .MuiSlider-thumb.Mui-active":
        {
          opacity: 1,
        },
    };
  }
);

type SeekerProps = {
  currentTime: number;
  duration: number;
  buffered: number;
  onSeekCommitted: (newTime: number) => void;
};

function formatTime(seconds: number) {
  if (isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export default function Seeker({
  currentTime,
  duration,
  buffered,
  onSeekCommitted,
}: SeekerProps) {
  const theme = useTheme();

  const [percent, setPercent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isDragging && duration > 0) {
      setPercent((currentTime / duration) * 100);
    }
  }, [currentTime, duration, isDragging]);

  const handleCommit = (v: number) => {
    setIsDragging(false);
    const newTime = (v / 100) * duration;
    onSeekCommitted(newTime);
  };

  const bufferedPercent = duration > 0 ? (buffered / duration) * 100 : 0;
  const displayTime = isDragging ? (percent / 100) * duration : currentTime;

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ position: "relative", width: "100%" }}>
        <SeekerSlider
          aria-label="music progress"
          value={percent}
          min={0}
          max={100}
          step={1}
          onChange={(_, v) => setPercent(v as number)}
          onChangeCommitted={(_, v) => handleCommit(v as number)}
          onMouseDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
          buffered={bufferedPercent}
          duration={100}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          color: theme.palette.text.secondary,
          fontSize: "0.75rem",
          mt: "2px",
          lineHeight: 1.2,
        }}
      >
        <Typography
          variant="caption"
          sx={{ fontSize: "0.75rem", lineHeight: 1.2 }}
        >
          {formatTime(displayTime)}
        </Typography>
        <Typography
          variant="caption"
          sx={{ fontSize: "0.75rem", lineHeight: 1.2 }}
        >
          -{formatTime(Math.max(duration - displayTime, 0))}
        </Typography>
      </Box>
    </Box>
  );
}
