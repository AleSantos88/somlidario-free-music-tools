import { StemTrack } from "@/pages/ProjectPlayer";
import { Slider } from "@/components/ui/slider";
import { Volume2, VolumeX } from "lucide-react";
import WaveformBar from "./WaveformBar";

interface TrackRowProps {
  track: StemTrack;
  isEffectivelyMuted: boolean;
  onToggleMute: () => void;
  onToggleSolo: () => void;
  onVolumeChange: (volume: number) => void;
}

const TrackRow = ({ track, isEffectivelyMuted, onToggleMute, onToggleSolo, onVolumeChange }: TrackRowProps) => {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150 ${
        isEffectivelyMuted ? "bg-card/50 opacity-50" : "bg-card shadow-card"
      } hover:shadow-card-hover`}
    >
      {/* Track label */}
      <div className="w-32 min-w-[8rem]">
        <span className="text-sm font-medium text-foreground truncate block">{track.label}</span>
      </div>

      {/* Mute/Solo */}
      <div className="flex items-center gap-1">
        <button
          onClick={onToggleMute}
          className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors duration-150 ${
            track.muted
              ? "bg-destructive/20 text-destructive"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          M
        </button>
        <button
          onClick={onToggleSolo}
          className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors duration-150 ${
            track.solo
              ? "bg-primary/20 text-primary"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          S
        </button>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-2 w-32">
        <button onClick={onToggleMute} className="text-muted-foreground hover:text-foreground transition-colors">
          {isEffectivelyMuted ? (
            <VolumeX className="w-3.5 h-3.5" />
          ) : (
            <Volume2 className="w-3.5 h-3.5" />
          )}
        </button>
        <Slider
          value={[track.volume]}
          max={100}
          step={1}
          onValueChange={(v) => onVolumeChange(v[0])}
          className="flex-1"
        />
        <span className="text-[10px] text-muted-foreground tabular-nums w-7 text-right">
          {track.volume}
        </span>
      </div>

      {/* Waveform visualization */}
      <div className="flex-1 h-8">
        <WaveformBar isMuted={isEffectivelyMuted} trackId={track.id} />
      </div>
    </div>
  );
};

export default TrackRow;
