import { Play, Pause, SkipBack } from "lucide-react";

interface PlayerControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
}

const PlayerControls = ({ isPlaying, onTogglePlay }: PlayerControlsProps) => {
  return (
    <div className="flex items-center gap-2">
      <button className="w-9 h-9 rounded-md bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-150">
        <SkipBack className="w-4 h-4" />
      </button>
      <button
        onClick={onTogglePlay}
        className="w-11 h-11 rounded-md gradient-amber flex items-center justify-center text-primary-foreground hover:opacity-90 transition-opacity duration-150 active:scale-[0.98]"
      >
        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
      </button>
      <div className="ml-3 text-xs text-muted-foreground tabular-nums">
        0:00 / 6:31
      </div>
    </div>
  );
};

export default PlayerControls;
