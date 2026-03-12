import AppLayout from "@/components/core/AppLayout";
import { Button } from "@/components/ui/button";
import { CreditCard, Zap, Gift } from "lucide-react";

const Credits = () => {
  return (
    <AppLayout title="Credits" subtitle="Manage your processing credits.">
      <div className="max-w-2xl space-y-6">
        {/* Balance */}
        <div className="rounded-xl bg-card shadow-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Available Credits</p>
              <p className="text-4xl font-bold text-foreground tabular-nums">5</p>
            </div>
            <div className="w-14 h-14 rounded-xl gradient-amber flex items-center justify-center">
              <Zap className="w-7 h-7 text-primary-foreground" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            1 credit = 1 song separation. Free credits refresh monthly.
          </p>
        </div>

        {/* History */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-3">Transaction History</h3>
          <div className="space-y-1">
            {[
              { type: "initial_grant", amount: 5, label: "Welcome bonus", date: "Today" },
              { type: "job_spend", amount: -1, label: "Hotel California separation", date: "2 hours ago" },
              { type: "job_spend", amount: -1, label: "Bohemian Rhapsody separation", date: "15 min ago" },
            ].map((tx, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-card shadow-card">
                <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                  {tx.amount > 0 ? (
                    <Gift className="w-4 h-4 text-primary" />
                  ) : (
                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">{tx.label}</p>
                </div>
                <span className={`text-sm font-medium tabular-nums ${tx.amount > 0 ? "text-primary" : "text-muted-foreground"}`}>
                  {tx.amount > 0 ? "+" : ""}{tx.amount}
                </span>
                <span className="text-xs text-muted-foreground tabular-nums w-20 text-right">{tx.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Credits;
