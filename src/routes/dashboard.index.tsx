import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Gamepad2,
  Boxes,
  Users,
  Bell,
  ArrowUpRight,
  Play,
  Activity,
  MessageCircle,
  Wallet,
  Clock,
} from "lucide-react";
import cityImg from "@/assets/banze-city.jpg";
import { apps, games } from "@/data/catalog";
import { RealTimeFinance } from "../components/RealTimeFinance";
import { collection, query, orderBy, limit, onSnapshot, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useFirebase } from "@/components/FirebaseContext";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardHome,
});

const stats = [
  {
    label: "Banze Games",
    value: "8",
    desc: "Jogos activos",
    icon: Gamepad2,
    accent: "from-fuchsia-500 to-violet-600",
  },
  {
    label: "Banze Apps",
    value: "12",
    desc: "Apps publicadas",
    icon: Boxes,
    accent: "from-emerald-500 to-teal-500",
  },
  {
    label: "Utilizadores",
    value: "52,4K",
    desc: "Comunidade activa",
    icon: Users,
    accent: "from-blue-500 to-cyan-500",
  },
  {
    label: "Notificações",
    value: "23",
    desc: "Novas hoje",
    icon: Bell,
    accent: "from-amber-400 to-orange-500",
  },
];

interface LiveActivity {
  id: string;
  userId: string;
  userEmail: string;
  displayName: string;
  photoURL?: string;
  type: "cadastro" | "login" | "update_perfil";
  description: string;
  createdAt: unknown;
}

function DashboardHome() {
  const { profile } = useFirebase();
  const [liveActivities, setLiveActivities] = useState<LiveActivity[]>([]);

  // Real-time Firestore Activities Subscriber
  useEffect(() => {
    if (!profile) return;

    const isSupervisor = profile.email.toLowerCase() === "sidneychambal10@gmail.com";

    const q = isSupervisor
      ? query(collection(db, "systemActivities"), orderBy("createdAt", "desc"), limit(10))
      : query(collection(db, "systemActivities"), where("userId", "==", profile.userId));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        let list: LiveActivity[] = [];
        snapshot.forEach((doc) => {
          list.push(doc.data() as LiveActivity);
        });

        if (!isSupervisor) {
          // Sort descending on client side to avoid needing a composite firestore index
          list.sort((a, b) => {
            const getSec = (c: unknown) => {
              if (c && typeof c === "object" && "seconds" in c) {
                return (c as { seconds: number }).seconds;
              }
              if (typeof c === "string" || typeof c === "number") {
                return new Date(c).getTime();
              }
              return 0;
            };
            return getSec(b.createdAt) - getSec(a.createdAt);
          });
          list = list.slice(0, 10);
        }

        setLiveActivities(list);
      },
      (error) => {
        console.error("Erro na escuta de atividades do dashboard:", error);
      },
    );

    return () => unsubscribe();
  }, [profile]);

  const getIconForType = (type: string) => {
    switch (type) {
      case "cadastro":
        return Users;
      case "login":
        return Wallet;
      case "update_perfil":
        return MessageCircle;
      default:
        return Activity;
    }
  };

  const getFriendlyTime = (createdAt: unknown) => {
    if (!createdAt) return "Agora mesmo";
    try {
      const date =
        createdAt && typeof createdAt === "object" && "toDate" in createdAt
          ? (createdAt as { toDate: () => Date }).toDate()
          : new Date(createdAt as string | number);
      return date.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "Há instantes";
    }
  };

  const isSupervisor = profile?.email?.toLowerCase() === "sidneychambal10@gmail.com";

  const displayedStats = stats.map((s) => {
    if (s.label === "Utilizadores") {
      if (isSupervisor) {
        return s;
      } else {
        return {
          label: "Status Colaborador",
          value: "Activo",
          desc: "Painel operacional",
          icon: Users,
          accent: "from-blue-500 to-cyan-500",
        };
      }
    }
    return s;
  });

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground md:text-4xl">
            Bem-vindo de volta,{" "}
            <span className="text-gradient">{profile?.displayName || "Yuran Banze"}</span> 👋
          </h1>
          <p className="mt-2 text-muted-foreground">
            Acompanhe o desempenho e actividade da BANZE INTERTECH em tempo real.
          </p>
        </div>
        <div className="glass rounded-xl px-4 py-2 text-sm text-foreground flex items-center gap-2">
          <Clock className="h-4 w-4 text-emerald-500 animate-pulse" />
          <span>Fuso Horário: Maputo (GMT+2)</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {displayedStats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="glass relative overflow-hidden rounded-2xl p-5"
          >
            <div className="flex items-start justify-between">
              <div
                className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${s.accent} shadow-glow`}
              >
                <s.icon className="h-5 w-5 text-white" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="mt-5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {s.label}
            </p>
            <p className="mt-1 text-3xl font-bold text-foreground">{s.value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{s.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Real-time Financial Analytics Hub */}
      {isSupervisor && <RealTimeFinance />}

      {/* Featured Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass relative overflow-hidden rounded-3xl"
      >
        <img
          src={cityImg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        <div className="relative max-w-xl p-8 md:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gradient">
            Projecto Principal
          </p>
          <h2 className="mt-2 text-4xl font-black text-foreground md:text-6xl">
            BANZE <span className="text-gradient">CITY</span>
          </h2>
          <p className="mt-3 max-w-md text-muted-foreground">
            Um jogo de mundo aberto inspirado na realidade moçambicana. Acompanhe o lançamento.
          </p>
          <Link
            to="/dashboard/games"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-neon px-5 py-3 text-sm font-semibold text-white shadow-neon"
          >
            <Play className="h-4 w-4 fill-white" /> Ver mais
          </Link>
        </div>
      </motion.div>

      {/* Two columns */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent activity - NOW POWERED BY FIRESTORE REAL-TIME ENGINES */}
        <div className="glass rounded-2xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <h3 className="text-lg font-bold text-foreground">
                Actividade recente em tempo real
              </h3>
            </div>
            <Activity className="h-4 w-4 text-emerald-500 animate-pulse" />
          </div>

          <ul className="mt-5 space-y-3">
            {liveActivities.length === 0 ? (
              // Seed placeholder fallback so that the dashboard always feels incredibly vibrant
              <>
                <li className="flex items-start gap-3 rounded-xl bg-white/[0.03] p-3 transition hover:bg-white/[0.06]">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-neon shadow-neon">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      Novo utilizador registado
                    </p>
                    <p className="text-xs text-muted-foreground">
                      sidneychambal10@gmail.com se registou no ecossistema Banze.
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">Agora</span>
                </li>
                <li className="flex items-start gap-3 rounded-xl bg-white/[0.03] p-3 transition hover:bg-white/[0.06]">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-neon shadow-neon">
                    <MessageCircle className="h-5 w-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      Update da comunidade em Maputo
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Pronto para receber notificações live de novos logins de utilizadores.
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">1 min atrás</span>
                </li>
              </>
            ) : (
              // Live Activities registered in Firestore systemActivities collection
              liveActivities.map((act) => {
                const IconComp = getIconForType(act.type);
                return (
                  <motion.li
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={act.id}
                    className="flex items-start gap-3 rounded-xl bg-white/[0.03] p-3 transition hover:bg-white/[0.06] border border-white/5"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-neon shadow-neon">
                      <IconComp className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {act.type === "cadastro"
                          ? "Nova Conta Criada"
                          : act.type === "login"
                            ? "Novo Login Efetuado"
                            : "Perfil Atualizado"}
                      </p>
                      <p className="text-xs text-muted-foreground">{act.description}</p>
                    </div>
                    <span className="shrink-0 text-[10px] font-mono text-emerald-400">
                      {getFriendlyTime(act.createdAt)}
                    </span>
                  </motion.li>
                );
              })
            )}
          </ul>
        </div>

        {/* Quick highlights */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-bold text-foreground">Apps em destaque</h3>
          <ul className="mt-4 space-y-3">
            {apps.slice(0, 4).map((a) => (
              <li key={a.id} className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${a.accent} shadow-neon`}
                >
                  <a.icon className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{a.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{a.category}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Featured games strip */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-bold text-foreground">Jogos em destaque</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {games.slice(0, 3).map((g) => (
            <div
              key={g.id}
              className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${g.accent} p-5`}
            >
              <g.icon className="absolute -right-4 -bottom-4 h-28 w-28 text-white/20" />
              <p className="text-[10px] font-semibold uppercase tracking-widest text-white/80">
                {g.category}
              </p>
              <p className="mt-1 text-lg font-bold text-white">{g.title}</p>
              <p className="mt-1 text-xs text-white/80">⭐ {g.rating}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
