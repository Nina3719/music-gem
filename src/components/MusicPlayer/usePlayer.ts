import { useState, useEffect, useCallback } from "react";

type UsePlayerOptions = {
  trackIds: string[];
  autoPlayer?: boolean;
};

type Track = {
  trackId: string;
  title: string;
  artist: string;
  audio_url: string; // single mp3/ogg
  image_url: string; // single image --> p1 dynamic resize
  // stream_url: string; // .m3u8 or .mpd manifest for abr (HLS, DASH)
};
