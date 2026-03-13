import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    // Cleanup temporary files before signing out
    if (session?.user) {
      try {
        const { data: projects } = await supabase
          .from("projects")
          .select("id")
          .eq("user_id", session.user.id);

        if (projects) {
          for (const project of projects) {
            // Delete stems files from storage
            const { data: stems } = await supabase
              .from("stems")
              .select("file_path")
              .eq("project_id", project.id);

            if (stems) {
              const paths = stems.map((s) => s.file_path).filter(Boolean);
              if (paths.length > 0) {
                await supabase.storage.from("music_files").remove(paths);
              }
            }
          }

          // Delete original uploads
          const { data: files } = await supabase.storage
            .from("music_files")
            .list(`uploads/${session.user.id}`);

          if (files && files.length > 0) {
            const uploadPaths = files.map(
              (f) => `uploads/${session.user.id}/${f.name}`
            );
            await supabase.storage.from("music_files").remove(uploadPaths);
          }
        }
      } catch (err) {
        console.error("Cleanup error:", err);
      }
    }

    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{ session, user: session?.user ?? null, loading, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};
