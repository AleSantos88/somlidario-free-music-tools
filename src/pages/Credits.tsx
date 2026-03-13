import { useQuery } from "@tanstack/react-query";
import AppLayout from "@/components/core/AppLayout";
import { CreditCard, Zap, Gift, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Credits = () => {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("credits")
        .eq("id", user!.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["transactions", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("credit_transactions")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  return (
    <AppLayout title="Credits" subtitle="Manage your processing credits.">
      <div className="max-w-2xl space-y-6">
        <div className="rounded-xl bg-card shadow-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Available Credits</p>
              <p className="text-4xl font-bold text-foreground tabular-nums">
                {profile?.credits ?? "—"}
              </p>
            </div>
            <div className="w-14 h-14 rounded-xl gradient-amber flex items-center justify-center">
              <Zap className="w-7 h-7 text-primary-foreground" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            1 credit = 1 song separation. Free credits refresh monthly.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-foreground mb-3">Transaction History</h3>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
            </div>
          ) : transactions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No transactions yet.
            </p>
          ) : (
            <div className="space-y-1">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-card shadow-card">
                  <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                    {tx.amount > 0 ? (
                      <Gift className="w-4 h-4 text-primary" />
                    ) : (
                      <CreditCard className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{tx.description || tx.transaction_type}</p>
                  </div>
                  <span className={`text-sm font-medium tabular-nums ${tx.amount > 0 ? "text-primary" : "text-muted-foreground"}`}>
                    {tx.amount > 0 ? "+" : ""}{tx.amount}
                  </span>
                  <span className="text-xs text-muted-foreground tabular-nums w-24 text-right">
                    {new Date(tx.created_at).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Credits;
