import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, ArrowRight, UserCircle, LogOut } from "lucide-react";
import { Logo } from "./Logo";
import { useFirebase } from "./FirebaseContext";

const links = [
  { to: "/", label: "Início" },
  { to: "/apresentacao", label: "Apresentação" },
  { to: "/catalogo", label: "Catálogo" },
  { to: "/apps", label: "Banze Apps" },
  { to: "/games", label: "Banze Games" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, profile, logout } = useFirebase();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    if (typeof window !== "undefined") {
      localStorage.removeItem("banze_auth");
    }
    navigate({ to: "/" });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto mt-4 max-w-7xl px-4">
        <nav className="glass-strong flex items-center justify-between rounded-2xl px-4 py-3 shadow-glow">
          <Link to="/" className="shrink-0">
            <Logo />
          </Link>
          <ul className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  activeOptions={{ exact: l.to === "/" }}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
                  activeProps={{
                    className:
                      "rounded-lg px-3 py-2 text-sm font-semibold text-foreground bg-white/5",
                  }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/perfil"
                  className="hidden items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-white/15 md:inline-flex"
                >
                  {profile?.photoURL ? (
                    <img
                      src={profile.photoURL}
                      alt={profile.displayName}
                      className="h-5 w-5 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <UserCircle className="h-5 w-5 text-emerald-400" />
                  )}
                  <span className="max-w-[120px] truncate">{profile?.displayName || "Perfil"}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="hidden items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/10 hover:text-red-300 md:inline-flex"
                  title="Fazer Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="hidden items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-white/10 hover:text-foreground md:inline-flex"
                >
                  Para Colaboradores
                </Link>
                <Link
                  to="/acesso"
                  className="hidden items-center gap-2 rounded-xl bg-gradient-neon px-4 py-2 text-sm font-semibold text-white shadow-neon transition hover:scale-[1.02] md:inline-flex"
                >
                  Entrar / Cadastrar
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
            <button
              onClick={() => setOpen((v) => !v)}
              className="rounded-lg p-2 text-foreground lg:hidden"
              aria-label="Menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
        {open && (
          <div className="glass-strong mt-2 rounded-2xl p-3 lg:hidden">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm text-foreground hover:bg-white/5"
              >
                {l.label}
              </Link>
            ))}
            {user ? (
              <div className="mt-3 space-y-2 border-t border-white/5 pt-3">
                <Link
                  to="/perfil"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl bg-white/5 px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-white/10"
                >
                  {profile?.photoURL ? (
                    <img
                      src={profile.photoURL}
                      alt={profile.displayName}
                      className="h-5 w-5 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <UserCircle className="h-5 w-5 text-emerald-400" />
                  )}
                  <span>{profile?.displayName || "Meu Perfil"}</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-300 hover:bg-red-500/15"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Terminar Sessão</span>
                </button>
              </div>
            ) : (
              <div className="mt-3 space-y-2 border-t border-white/5 pt-3">
                <Link
                  to="/acesso"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl bg-gradient-neon px-4 py-2.5 text-center text-sm font-semibold text-white shadow-neon"
                >
                  Entrar / Cadastrar
                </Link>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-center text-sm font-semibold text-muted-foreground"
                >
                  Para Colaboradores
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
