import { Box, CardMedia, Typography, useTheme } from "@mui/material";
import { Track } from "./types";
import { useRef, useState, useEffect } from "react";

export default function TrackInfo({ track }: { track: Track }) {
  const theme = useTheme();
  const titleRef = useRef<HTMLSpanElement>(null);
  const artistRef = useRef<HTMLSpanElement>(null);
  const [titleOverflows, setTitleOverflows] = useState(false);
  const [artistOverflows, setArtistOverflows] = useState(false);

  const [titleScrollDistance, setTitleScrollDistance] = useState(0);
  const [artistScrollDistance, setArtistScrollDistance] = useState(0);

  useEffect(() => {
    const checkOverflow = () => {
      if (titleRef.current) {
        const parent = titleRef.current.parentElement;
        const overflow =
          titleRef.current.scrollWidth > titleRef.current.clientWidth;
        setTitleOverflows(overflow);
        if (overflow && parent) {
          // Calculate exact distance: full text width - visible container width
          const distance = titleRef.current.scrollWidth - parent.clientWidth;
          setTitleScrollDistance(distance);
        }
      }
      if (artistRef.current) {
        const parent = artistRef.current.parentElement;
        const overflow =
          artistRef.current.scrollWidth > artistRef.current.clientWidth;
        setArtistOverflows(overflow);
        if (overflow && parent) {
          const distance = artistRef.current.scrollWidth - parent.clientWidth;
          setArtistScrollDistance(distance);
        }
      }
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(checkOverflow);
    });

    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [track.title, track.artist]);

  const getHoverStyles = (shouldAnimate: boolean, scrollDistance: number) =>
    shouldAnimate
      ? {
          textOverflow: "unset",
          overflow: "visible",
          animation: "marquee 3s ease-in-out", // Increased to 10s for pause
          maxWidth: "none",
          "--scroll-distance": `${scrollDistance}px`,
        }
      : {};

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 2,
        width: "100%",
        "@keyframes marquee": {
          "0%": { transform: "translateX(0)" },
          "5%": { transform: "translateX(0)" }, // Pause at start
          "45%": { transform: "translateX(calc(-1 * var(--scroll-distance)))" },
          "55%": { transform: "translateX(calc(-1 * var(--scroll-distance)))" }, // Pause at end
          "95%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(0)" }, // Pause at start before loop
        },
      }}
    >
      <CardMedia
        component="img"
        // TODO(chennina): Crop images to square
        sx={{
          width: 60,
          height: 60,
          borderRadius: 1,
          flexShrink: 0,
        }}
        image={track.image_url}
        alt={track.title}
      />
      <Box
        sx={{
          minWidth: 0,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start", // vertically center title+subtitle
          alignItems: "flex-start",
        }}
      >
        <Typography
          sx={{
            textAlign: "left",
            fontSize: "1.125rem",
            fontWeight: 500,
            color: theme.palette.text.primary,
            mb: 0.5,
            width: "100%",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          <Box
            component="span"
            ref={titleRef}
            sx={{
              display: "inline-block",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "100%",
              verticalAlign: "bottom",
              transition: "all 0.3s ease",
              "&:hover": getHoverStyles(titleOverflows, titleScrollDistance),
            }}
          >
            {track.title}
          </Box>
        </Typography>
        <Typography
          sx={{
            textAlign: "left",
            fontSize: "0.875rem",
            color: theme.palette.text.secondary,
            width: "100%",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          <Box
            component="span"
            ref={artistRef}
            sx={{
              display: "inline-block",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "100%",
              verticalAlign: "bottom",
              transition: "all 0.3s ease",
              "&:hover": getHoverStyles(artistOverflows, artistScrollDistance),
            }}
          >
            {track.artist}
          </Box>
        </Typography>
      </Box>
    </Box>
  );
}
