import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import AppLayout from "@/components/core/AppLayout";
import TrackRow from "@/components/player/TrackRow";
import PlayerControls from "@/components/player/PlayerControls";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";

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

  // Get public URL for the original uploaded file
  const audioUrl = useMemo(() => {
    if (!project?.original_file_path) return null;
    const { data } = supabase.storage
      .from("music_files")
      .getPublicUrl(project.original_file_path);
    return data?.publicUrl || null;
  }, [project?.original_file_path]);

  const { isPlaying, currentTime, duration, togglePlay, seek, isLoading: audioLoading, error: audioError } = useAudioPlayer(audioUrl);

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
      {/* Player controls with seek bar */}
      <div className="mb-6 space-y-3">
        <PlayerControls
          isPlaying={isPlaying}
          onTogglePlay={togglePlay}
          currentTime={currentTime}
          duration={duration}
          onSeek={seek}
          isLoading={audioLoading}
        />
        {audioError && (
          <p className="text-xs text-destructive">{audioError}</p>
        )}
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-muted-foreground">
          A separação de instrumentos por IA será implementada em breve. Por enquanto, você pode ouvir a faixa original.
        </p>
        <Button variant="outline" size="sm" className="h-9 border-border text-foreground hover:bg-muted">
          <Download className="w-4 h-4 mr-1.5" />
          Download
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
