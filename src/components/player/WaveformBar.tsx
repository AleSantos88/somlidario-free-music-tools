import { useMemo } from "react";

interface WaveformBarProps {
  isMuted: boolean;
  trackId: string;
}

const WaveformBar = ({ isMuted, trackId }: WaveformBarProps) => {
  // Generate deterministic pseudo-random bars based on trackId
  const bars = useMemo(() => {
    const result: number[] = [];
    let seed = 0;
    for (let i = 0; i < trackId.length; i++) {
      seed += trackId.charCodeAt(i);
    }
    for (let i = 0; i < 80; i++) {
      seed = (seed * 9301 + 49297) % 233280;
      result.push(0.15 + (seed / 233280) * 0.85);
    }
    return result;
  }, [trackId]);

  return (
    <div className="flex items-center gap-px h-full">
      {bars.map((height, i) => (
        <div
          key={i}
          className={`flex-1 rounded-sm transition-colors duration-150 ${
            isMuted ? "bg-border" : "bg-primary/60"
          }`}
          style={{ height: `${height * 100}%` }}
        />
      ))}
    </div>
  );
};

export default WaveformBar;
