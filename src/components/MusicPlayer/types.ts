export type Track = {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  audio_url: string; // fake audio stream
  image_url: string; // single image --> p1 dynamic resize
  // stream_url: string; // .m3u8 or .mpd manifest for abr (HLS, DASH)
  audio: {
    adaptive_url?: string;
    mp3_url?: string;
  };
};

export enum LoopMode {
  Off = "off",
  All = "all",
  One = "one",
}
