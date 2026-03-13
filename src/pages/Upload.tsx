import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/core/AppLayout";
import { Button } from "@/components/ui/button";
import { Upload as UploadIcon, Music, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const STEM_DEFINITIONS = [
  { stem_type: "lead_vocals", label: "Lead Vocals", stem_group: "Vocals" },
  { stem_type: "backing_vocals", label: "Backing Vocals", stem_group: "Vocals" },
  { stem_type: "guitar_lead", label: "Lead Guitar", stem_group: "Guitars" },
  { stem_type: "guitar_rhythm", label: "Rhythm Guitar", stem_group: "Guitars" },
  { stem_type: "acoustic_guitar", label: "Acoustic Guitar", stem_group: "Guitars" },
  { stem_type: "bass", label: "Bass", stem_group: "Bass" },
  { stem_type: "kick", label: "Kick", stem_group: "Drums" },
  { stem_type: "snare", label: "Snare", stem_group: "Drums" },
  { stem_type: "hihat", label: "Hi-Hat", stem_group: "Drums" },
  { stem_type: "toms", label: "Toms", stem_group: "Drums" },
  { stem_type: "cymbals", label: "Cymbals", stem_group: "Drums" },
  { stem_type: "overheads", label: "Overheads", stem_group: "Drums" },
  { stem_type: "other", label: "Other", stem_group: "Other" },
];

const Upload = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type.startsWith("audio/")) {
      setFile(dropped);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  }, []);

  const handleUpload = async () => {
    if (!file || !user) return;
    setUploading(true);

    try {
      // 1. Check credits
      const { data: profile } = await supabase
        .from("profiles")
        .select("credits")
        .eq("id", user.id)
        .single();

      if (!profile || profile.credits < 1) {
        toast.error("Créditos insuficientes!");
        setUploading(false);
        return;
      }

      // 2. Upload file to storage
      const filePath = `uploads/${user.id}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("music_files")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 3. Create project
      const title = file.name.replace(/\.[^/.]+$/, "");
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .insert({
          user_id: user.id,
          title,
          original_file_path: filePath,
          status: "completed",
          progress: 100,
        })
        .select()
        .single();

      if (projectError) throw projectError;

      // 4. Create stem records (placeholder — no real AI processing yet)
      const stemRecords = STEM_DEFINITIONS.map((s) => ({
        project_id: project.id,
        stem_type: s.stem_type,
        label: s.label,
        stem_group: s.stem_group,
        file_path: null,
      }));

      const { error: stemsError } = await supabase
        .from("stems")
        .insert(stemRecords);

      if (stemsError) throw stemsError;

      // 5. Deduct credit
      await supabase
        .from("profiles")
        .update({ credits: profile.credits - 1 })
        .eq("id", user.id);

      await supabase.from("credit_transactions").insert({
        user_id: user.id,
        amount: -1,
        transaction_type: "debit",
        description: `Separação: ${title}`,
      });

      toast.success("Projeto criado com sucesso!");
      navigate("/dashboard");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Erro ao fazer upload");
    } finally {
      setUploading(false);
    }
  };

  return (
    <AppLayout title="Upload" subtitle="Upload a song to separate into stems.">
      <div className="max-w-2xl">
        {!file ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-2xl p-16 text-center transition-colors duration-150 cursor-pointer ${
              dragOver
                ? "border-primary bg-primary/5"
                : "border-border hover:border-muted-foreground"
            }`}
          >
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center mb-4">
                <UploadIcon className={`w-6 h-6 ${dragOver ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">
                Drop your audio file here
              </p>
              <p className="text-xs text-muted-foreground">
                MP3, WAV, FLAC, OGG — up to 50MB
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-card shadow-card p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                <Music className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground tabular-nums">
                  {(file.size / (1024 * 1024)).toFixed(1)} MB
                </p>
              </div>
              <button
                onClick={() => setFile(null)}
                disabled={uploading}
                className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded-lg bg-muted p-4">
              <p className="text-xs text-muted-foreground mb-2">Processing will use:</p>
              <p className="text-sm font-medium text-foreground">1 credit</p>
            </div>

            <Button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full gradient-amber text-primary-foreground hover:opacity-90 h-11"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Start Separation"
              )}
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Upload;
