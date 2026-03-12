import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/core/AppLayout";
import { Button } from "@/components/ui/button";
import { Upload as UploadIcon, Music, X } from "lucide-react";

const Upload = () => {
  const navigate = useNavigate();
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);

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

  const handleUpload = () => {
    // In production, this would upload to Supabase Storage
    navigate("/dashboard");
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
              className="w-full gradient-amber text-primary-foreground hover:opacity-90 h-11"
            >
              Start Separation
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Upload;
