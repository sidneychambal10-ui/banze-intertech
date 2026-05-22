import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  Home,
  LayoutGrid,
  Boxes,
  Gamepad2,
  Bell,
  Settings,
  LogOut,
  Presentation,
} from "lucide-react";
import type { ReactNode } from "react";
import { Logo } from "./Logo";

type NavItem = { to: string; label: string; icon: typeof Home; exact?: boolean };
const nav: NavItem[] = [
  { to: "/dashboard", label: "Início", icon: Home, exact: true },
  { to: "/dashboard/apresentacao", label: "Apresentação", icon: Presentation },
  { to: "/dashboard/catalogo", label: "Catálogo", icon: LayoutGrid },
  { to: "/dashboard/apps", label: "Banze Apps", icon: Boxes },
  { to: "/dashboard/games", label: "Banze Games", icon: Gamepad2 },
  { to: "/dashboard/notificacoes", label: "Notificações", icon: Bell },
  { to: "/dashboard/configuracoes", label: "Configurações", icon: Settings },
];

export function DashboardShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = () => {
    if (typeof window !== "undefined") localStorage.removeItem("banze_auth");
    navigate({ to: "/login" });
  };
  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 grid-bg opacity-30" />
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border/50 bg-background/60 p-5 backdrop-blur-xl lg:flex">
        <Link to="/dashboard">
          <Logo />
        </Link>
        <nav className="mt-8 flex-1 space-y-1">
          {nav.map((n) => {
            const active = n.exact
              ? location.pathname === n.to
              : location.pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to as "/dashboard"}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-gradient-neon text-white shadow-neon"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                }`}
              >
                <n.icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={logout}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-300 transition hover:bg-rose-500/10"
        >
          <LogOut className="h-4 w-4" /> Sair
        </button>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border/50 bg-background/60 px-6 py-4 backdrop-blur-xl lg:hidden">
          <Logo />
          <button onClick={logout} className="rounded-lg p-2 text-rose-300">
            <LogOut className="h-5 w-5" />
          </button>
        </header>
        <main className="relative px-5 py-8 md:px-10">{children}</main>
      </div>
    </div>
  );
}
