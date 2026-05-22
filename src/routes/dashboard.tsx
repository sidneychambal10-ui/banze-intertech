import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/DashboardShell";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{ title: "Painel Central — BANZE INTERTECH" }, { name: "robots", content: "noindex" }],
  }),
  component: DashboardLayout,
});

function DashboardLayout() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("banze_auth") !== "1") {
      navigate({ to: "/login" });
    } else {
      setReady(true);
    }
  }, [navigate]);
  if (!ready)
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        A carregar painel…
      </div>
    );
  return (
    <DashboardShell>
      <Outlet />
    </DashboardShell>
  );
}
