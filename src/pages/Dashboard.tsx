import { Link } from "react-router-dom";
import AppLayout from "@/components/core/AppLayout";
import { Button } from "@/components/ui/button";
import { Play, MoreHorizontal, Plus, Clock, CheckCircle, Loader2 } from "lucide-react";

const mockProjects = [
  { id: "1", title: "Hotel California - Eagles", status: "completed", stems: 12, created: "2 hours ago" },
  { id: "2", title: "Bohemian Rhapsody - Queen", status: "processing", stems: 0, created: "15 min ago", progress: 67 },
  { id: "3", title: "Stairway to Heaven - Led Zeppelin", status: "completed", stems: 12, created: "1 day ago" },
  { id: "4", title: "Wish You Were Here - Pink Floyd", status: "completed", stems: 12, created: "3 days ago" },
];

const statusConfig = {
  completed: { icon: CheckCircle, label: "Ready", className: "text-primary" },
  processing: { icon: Loader2, label: "Processing", className: "text-muted-foreground animate-spin" },
  pending: { icon: Clock, label: "Queued", className: "text-muted-foreground" },
};

const Dashboard = () => {
  return (
    <AppLayout title="Projects" subtitle="Your separated tracks and stems.">
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-muted-foreground tabular-nums">
          {mockProjects.length} projects
        </div>
        <Link to="/upload">
          <Button size="sm" className="gradient-amber text-primary-foreground hover:opacity-90 h-9">
            <Plus className="w-4 h-4 mr-1.5" />
            New Project
          </Button>
        </Link>
      </div>

      <div className="space-y-2">
        {mockProjects.map((project) => {
          const status = statusConfig[project.status as keyof typeof statusConfig];
          const StatusIcon = status.icon;
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
                  {project.stems > 0 && <span>{project.stems} stems</span>}
                </div>
              </div>
              <div className="text-xs text-muted-foreground tabular-nums">{project.created}</div>
              <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </Link>
          );
        })}
      </div>
    </AppLayout>
  );
};

export default Dashboard;
