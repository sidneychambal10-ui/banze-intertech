import { createFileRoute } from "@tanstack/react-router";
import { Bell, Users, Gamepad2, AlertTriangle, MessageCircle, Boxes } from "lucide-react";

export const Route = createFileRoute("/dashboard/notificacoes")({
  component: NotificacoesPage,
});

const notifications = [
  {
    icon: Users,
    type: "Novo utilizador",
    title: "JoãoMZ registou-se",
    time: "agora",
    color: "from-emerald-500 to-teal-500",
    unread: true,
  },
  {
    icon: Boxes,
    type: "Nova app",
    title: "Banze News foi publicada",
    time: "10 min",
    color: "from-blue-500 to-cyan-500",
    unread: true,
  },
  {
    icon: Gamepad2,
    type: "Update de jogo",
    title: "Banze Racing v2.1 disponível",
    time: "1h",
    color: "from-fuchsia-500 to-violet-600",
  },
  {
    icon: AlertTriangle,
    type: "Alerta do sistema",
    title: "Pico de tráfego no Banze Pay",
    time: "2h",
    color: "from-amber-400 to-orange-500",
  },
  {
    icon: MessageCircle,
    type: "Mensagem",
    title: "Equipa de produto: reunião às 15h",
    time: "3h",
    color: "from-rose-500 to-pink-500",
  },
  {
    icon: Users,
    type: "Novo utilizador",
    title: "Maria_07 activou o Premium",
    time: "ontem",
    color: "from-emerald-500 to-teal-500",
  },
];

function NotificacoesPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black text-foreground md:text-4xl">Notificações</h1>
          <p className="mt-2 text-muted-foreground">
            Tudo o que acontece no ecossistema BANZE, em tempo real.
          </p>
        </div>
        <div className="glass inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm text-foreground">
          <Bell className="h-4 w-4 text-gradient" /> {notifications.filter((n) => n.unread).length}{" "}
          novas
        </div>
      </div>

      <div className="glass rounded-2xl p-3">
        <ul className="divide-y divide-border/40">
          {notifications.map((n, i) => (
            <li key={i} className="flex items-center gap-4 p-4 transition hover:bg-white/[0.04]">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${n.color} shadow-neon`}
              >
                <n.icon className="h-6 w-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gradient">
                  {n.type}
                </p>
                <p className="mt-0.5 truncate text-sm font-semibold text-foreground">{n.title}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">{n.time}</span>
                {n.unread && (
                  <span className="h-2.5 w-2.5 rounded-full bg-gradient-neon shadow-neon" />
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
