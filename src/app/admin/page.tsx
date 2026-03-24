"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { isAdminAllowed } from "@/lib/admin-whitelist";
import { DashboardHeader } from "@/app/components/ui/dashboard-header";
import { DashboardCard } from "@/app/components/ui/dashboard-card";
import { RecentActivity } from "@/app/components/ui/recent-activity";
import { QuickActions } from "@/app/components/ui/quick-actions";
import { RevenueChart } from "@/app/components/ui/revenue-chart";
import { SystemStatus } from "@/app/components/ui/system-status";
import { Users, FileText, Activity, LayoutDashboard } from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !isAdminAllowed(session.user.email)) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    };
    checkUser();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-[#C9A84C] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
      <DashboardHeader 
        onRefresh={() => console.log('refresh')}
        isRefreshing={false}
      />

      {/* Metric Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <DashboardCard 
          index={0}
          stat={{
            title: "Published Articles",
            value: "142",
            change: "+3 this week",
            changeType: "positive",
            icon: FileText,
            color: "text-green-500",
            bgColor: "bg-green-500/10"
          }}
        />
        <DashboardCard 
          index={1}
          stat={{
            title: "System Status",
            value: "Optimal",
            change: "0 Downtime",
            changeType: "positive",
            icon: LayoutDashboard,
            color: "text-amber-500",
            bgColor: "bg-amber-500/10"
          }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 border-t border-white/5 pt-8">
        <div className="space-y-8">
          <RecentActivity />
        </div>
        <div className="space-y-8">
          <SystemStatus />
        </div>
      </div>
    </div>
  );
}
