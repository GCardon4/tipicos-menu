import { LiveRequests } from "@/components/admin/LiveRequests";
import { requireAdmin } from "@/lib/admin/auth";
import { PENDING_SELECT, toPendingRequests } from "@/lib/admin/requests";

// loading.tsx del segmento /admin envuelve esta página en Suspense.
export default async function DashboardPage() {
  const supabase = await requireAdmin();
  const { data } = await supabase
    .from("service_requests")
    .select(PENDING_SELECT)
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  return <LiveRequests initial={toPendingRequests(data)} />;
}
