import { useState } from "react";
import { useParams } from "react-router-dom";
import AppLayout from "@/components/core/AppLayout";
import TrackRow from "@/components/player/TrackRow";
import PlayerControls from "@/components/player/PlayerControls";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface StemTrack {
  id: string;
  label: string;
  group: string;
  muted: boolean;
  solo: boolean;
  volume: number;
}

const initialStems: StemTrack[] = [
  { id: "lead_vocals", label: "Lead Vocals", group: "Vocals", muted: false, solo: false, volume: 80 },
  { id: "backing_vocals", label: "Backing Vocals", group: "Vocals", muted: false, solo: false, volume: 70 },
  { id: "guitar_lead", label: "Lead Guitar", group: "Guitars", muted: false, solo: false, volume: 75 },
  { id: "guitar_rhythm", label: "Rhythm Guitar", group: "Guitars", muted: false, solo: false, volume: 70 },
  { id: "acoustic_guitar", label: "Acoustic Guitar", group: "Guitars", muted: false, solo: false, volume: 65 },
  { id: "bass", label: "Bass", group: "Bass", muted: false, solo: false, volume: 75 },
  { id: "kick", label: "Kick", group: "Drums", muted: false, solo: false, volume: 80 },
  { id: "snare", label: "Snare", group: "Drums", muted: false, solo: false, volume: 75 },
  { id: "hihat", label: "Hi-Hat", group: "Drums", muted: false, solo: false, volume: 60 },
  { id: "toms", label: "Toms", group: "Drums", muted: false, solo: false, volume: 65 },
  { id: "cymbals", label: "Cymbals", group: "Drums", muted: false, solo: false, volume: 55 },
  { id: "overheads", label: "Overheads", group: "Drums", muted: false, solo: false, volume: 60 },
  { id: "other", label: "Other", group: "Other", muted: false, solo: false, volume: 50 },
];

const ProjectPlayer = () => {
  const { id } = useParams();
  const [stems, setStems] = useState<StemTrack[]>(initialStems);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleMute = (stemId: string) => {
    setStems((prev) =>
      prev.map((s) => (s.id === stemId ? { ...s, muted: !s.muted } : s))
    );
  };

  const toggleSolo = (stemId: string) => {
    setStems((prev) =>
      prev.map((s) => (s.id === stemId ? { ...s, solo: !s.solo } : s))
    );
  };

  const setVolume = (stemId: string, volume: number) => {
    setStems((prev) =>
      prev.map((s) => (s.id === stemId ? { ...s, volume } : s))
    );
  };

  const hasSolo = stems.some((s) => s.solo);

  // Group stems
  const groups = stems.reduce<Record<string, StemTrack[]>>((acc, stem) => {
    if (!acc[stem.group]) acc[stem.group] = [];
    acc[stem.group].push(stem);
    return acc;
  }, {});

  return (
    <AppLayout
      title="Hotel California"
      subtitle="Eagles — 12 stems separated"
    >
      <div className="flex items-center gap-3 mb-6">
        <PlayerControls isPlaying={isPlaying} onTogglePlay={() => setIsPlaying(!isPlaying)} />
        <div className="flex-1" />
        <Button variant="outline" size="sm" className="h-9 border-border text-foreground hover:bg-muted">
          <Download className="w-4 h-4 mr-1.5" />
          Download All
        </Button>
      </div>

      <div className="space-y-6">
        {Object.entries(groups).map(([group, tracks]) => (
          <div key={group}>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-1">
              {group}
            </div>
            <div className="space-y-1">
              {tracks.map((track) => (
                <TrackRow
                  key={track.id}
                  track={track}
                  isEffectivelyMuted={track.muted || (hasSolo && !track.solo)}
                  onToggleMute={() => toggleMute(track.id)}
                  onToggleSolo={() => toggleSolo(track.id)}
                  onVolumeChange={(v) => setVolume(track.id, v)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
};

export default ProjectPlayer;
