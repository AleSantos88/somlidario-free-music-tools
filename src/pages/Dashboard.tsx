import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import AppLayout from "@/components/core/AppLayout";
import { Button } from "@/components/ui/button";
import { Play, MoreHorizontal, Plus, Clock, CheckCircle, Loader2, FolderOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const statusConfig = {
  completed: { icon: CheckCircle, label: "Ready", className: "text-primary" },
  processing: { icon: Loader2, label: "Processing", className: "text-muted-foreground animate-spin" },
  pending: { icon: Clock, label: "Queued", className: "text-muted-foreground" },
  failed: { icon: Clock, label: "Failed", className: "text-destructive" },
};

const Dashboard = () => {
  const { user } = useAuth();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  return (
    <AppLayout title="Projects" subtitle="Your separated tracks and stems.">
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-muted-foreground tabular-nums">
          {projects.length} projects
        </div>
        <Link to="/upload">
          <Button size="sm" className="gradient-amber text-primary-foreground hover:opacity-90 h-9">
            <Plus className="w-4 h-4 mr-1.5" />
            New Project
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center mb-4">
            <FolderOpen className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">No projects yet</p>
          <p className="text-xs text-muted-foreground mb-4">Upload a song to get started</p>
          <Link to="/upload">
            <Button size="sm" className="gradient-amber text-primary-foreground hover:opacity-90">
              <Plus className="w-4 h-4 mr-1.5" />
              Upload Song
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {projects.map((project) => {
            const status = statusConfig[project.status as keyof typeof statusConfig] || statusConfig.pending;
            const StatusIcon = status.icon;
            const timeAgo = new Date(project.created_at).toLocaleDateString("pt-BR");
            return (
              <Link
                key={project.id}
                to={project.status === "completed" ? `/project/${project.id}` : "#"}
                className="flex items-center gap-4 px-4 py-3 rounded-lg bg-card shadow-card hover:shadow-card-hover transition-all duration-150 group"
              >
                <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center group-hover:bg-secondary transition-colors">
                  {project.status === "completed" ? (
                    <Play className="w-4 h-4 text-primary" />
                  ) : (
                    <StatusIcon className={`w-4 h-4 ${status.className}`} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">
                    {project.title}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    <span className="flex items-center gap-1">
                      <StatusIcon className={`w-3 h-3 ${status.className}`} />
                      {status.label}
                      {project.status === "processing" && (
                        <span className="tabular-nums ml-1">{project.progress}%</span>
                      )}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground tabular-nums">{timeAgo}</div>
                <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </Link>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
};

export default Dashboard;
