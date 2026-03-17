import { Play, Pause, SkipBack, Loader2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface PlayerControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  isLoading?: boolean;
}

const formatTime = (seconds: number) => {
  if (!seconds || !isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const PlayerControls = ({ isPlaying, onTogglePlay, currentTime, duration, onSeek, isLoading }: PlayerControlsProps) => {
  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onSeek(0)}
          className="w-9 h-9 rounded-md bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-150"
        >
          <SkipBack className="w-4 h-4" />
        </button>
        <button
          onClick={onTogglePlay}
          disabled={isLoading}
          className="w-11 h-11 rounded-md gradient-amber flex items-center justify-center text-primary-foreground hover:opacity-90 transition-opacity duration-150 active:scale-[0.98] disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" />
          )}
        </button>
      </div>

      <div className="text-xs text-muted-foreground tabular-nums w-10 text-right">
        {formatTime(currentTime)}
      </div>

      <Slider
        value={[currentTime]}
        max={duration || 100}
        step={0.1}
        onValueChange={(v) => onSeek(v[0])}
        className="flex-1"
      />

      <div className="text-xs text-muted-foreground tabular-nums w-10">
        {formatTime(duration)}
      </div>
    </div>
  );
};

export default PlayerControls;
