import { Slider, Box } from "@mui/material";
import { VolumeUp as VolumeIcon } from "@mui/icons-material";

type VolumeSliderProps = {
  volume: number; // 0.0 - 1.0
  onChange: (val: number) => void;
};

export default function VolumeSlider({ volume, onChange }: VolumeSliderProps) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", width: 150 }}>
      <VolumeIcon sx={{ mr: 1 }} />
      <Slider
        value={volume}
        min={0}
        max={1}
        step={0.01}
        onChange={(_, val) => onChange(val as number)}
      />
    </Box>
  );
}
