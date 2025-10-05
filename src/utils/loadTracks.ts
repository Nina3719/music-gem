import { parseBlob } from "music-metadata-browser";
import { Track } from "../components/MusicPlayer/types";

function capitalizeWords(text: string) {
  return text
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function loadAndParseTracks(
  fileNames: string[]
): Promise<Track[]> {
  console.log("Files being parsed: ", fileNames);
  const tracks: Track[] = [];

  for (const file of fileNames) {
    const url = `/tracks/${file}`;
    const res = await fetch(url);
    if (!res.ok) continue;

    const blob = await res.blob();
    const metadata = await parseBlob(blob);

    let pictureUrl: string | undefined;
    const picture = metadata.common.picture?.[0];
    if (picture) {
      const coverBlob = new Blob([picture.data], { type: picture.format });
      pictureUrl = URL.createObjectURL(coverBlob);
      console.log(pictureUrl);
    }

    const [id, ...rest] = file.replace(/\.[^/.]+$/, "").split("-");
    const fallbackTitle = capitalizeWords(rest.join(" ")) || file;
    // const fallbackTitle = "Testing very very long long long long title";

    tracks.push({
      id,
      title: metadata.common.title ?? fallbackTitle ?? "Unknown Title",
      artist: metadata.common.artist ?? "Unknown Artist",
      // artist: "Testing very very very long artist name",
      album: metadata.common.album ?? "Unknown Album",
      duration: metadata.format.duration ?? 0,
      image_url: pictureUrl ?? "/assets/fallback-note.svg",
      audio_url: url,
      audio: {
        mp3_url: url,
      },
    });
  }

  return tracks;
}
