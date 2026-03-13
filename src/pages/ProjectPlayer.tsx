import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import AppLayout from "@/components/core/AppLayout";
import TrackRow from "@/components/player/TrackRow";
import PlayerControls from "@/components/player/PlayerControls";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export interface StemTrack {
  id: string;
  label: string;
  group: string;
  muted: boolean;
  solo: boolean;
  volume: number;
}

const ProjectPlayer = () => {
  const { id } = useParams();
  const [trackStates, setTrackStates] = useState<Record<string, { muted: boolean; solo: boolean; volume: number }>>({});
  const [isPlaying, setIsPlaying] = useState(false);

  const { data: project, isLoading: loadingProject } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: stems = [], isLoading: loadingStems } = useQuery({
    queryKey: ["stems", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stems")
        .select("*")
        .eq("project_id", id!);
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const tracks: StemTrack[] = stems.map((s) => ({
    id: s.id,
    label: s.label,
    group: s.stem_group,
    muted: trackStates[s.id]?.muted ?? false,
    solo: trackStates[s.id]?.solo ?? false,
    volume: trackStates[s.id]?.volume ?? 75,
  }));

  const toggleMute = (stemId: string) => {
    setTrackStates((prev) => ({
      ...prev,
      [stemId]: { ...prev[stemId], muted: !(prev[stemId]?.muted ?? false), solo: prev[stemId]?.solo ?? false, volume: prev[stemId]?.volume ?? 75 },
    }));
  };

  const toggleSolo = (stemId: string) => {
    setTrackStates((prev) => ({
      ...prev,
      [stemId]: { ...prev[stemId], solo: !(prev[stemId]?.solo ?? false), muted: prev[stemId]?.muted ?? false, volume: prev[stemId]?.volume ?? 75 },
    }));
  };

  const setVolume = (stemId: string, volume: number) => {
    setTrackStates((prev) => ({
      ...prev,
      [stemId]: { ...prev[stemId], volume, muted: prev[stemId]?.muted ?? false, solo: prev[stemId]?.solo ?? false },
    }));
  };

  const hasSolo = tracks.some((s) => s.solo);

  const groups = tracks.reduce<Record<string, StemTrack[]>>((acc, stem) => {
    if (!acc[stem.group]) acc[stem.group] = [];
    acc[stem.group].push(stem);
    return acc;
  }, {});

  if (loadingProject || loadingStems) {
    return (
      <AppLayout title="Loading..." subtitle="">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title={project?.title || "Project"}
      subtitle={`${stems.length} stems separated`}
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
        {Object.entries(groups).map(([group, groupTracks]) => (
          <div key={group}>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-1">
              {group}
            </div>
            <div className="space-y-1">
              {groupTracks.map((track) => (
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
