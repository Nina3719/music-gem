import { useState } from "react";
import { Card } from "@mui/material";

// Start with fake tracks using MP3s
// Then move on to adaptive bitrate streaming, etc.
// Minimize button / way -->

type PlayerProps = {
  trackIds: string[];
  autoplay: boolean;
};

export default function Player({ trackIds, autoplay = false }: PlayerProps) {
  const [start, setStart] = useState(0);

  // Player // style as one or a playlist // autoplay
  return (
    <Card>
      <div>{/* <TrackInfo>  </TrackInfo> */}</div>
    </Card>
  );
}
