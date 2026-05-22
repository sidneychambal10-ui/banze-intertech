import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCircle,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  LogOut,
  Shield,
  Activity,
  AlertCircle,
  Save,
  Globe,
  Settings,
  Flame,
  User,
  Image as ImageIcon,
} from "lucide-react";
import { useFirebase, UserProfile } from "@/components/FirebaseContext";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { collection, doc, onSnapshot, query, where, orderBy, limit } from "firebase/firestore";
import { Navbar } from "@/components/Navbar";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Perfil de Usuário — BANZE INTERTECH" },
      { name: "description", content: "Gerencie seu perfil e suas definições em tempo real." },
    ],
  }),
  component: ProfilePage,
});

// Avatar Presets we provide so the user doesn't have to input manual links if they don't want to
const AVATAR_PRESETS = [
  { name: "Cyborg Felix", url: "https://api.dicebear.com/7.x/bottts/svg?seed=Felix" },
  { name: "Gamer Anya", url: "https://api.dicebear.com/7.x/bottts/svg?seed=Anya" },
  { name: "Coder Sasha", url: "https://api.dicebear.com/7.x/bottts/svg?seed=Sasha" },
  { name: "Robo Milo", url: "https://api.dicebear.com/7.x/bottts/svg?seed=Milo" },
  { name: "Pixel Space", url: "https://api.dicebear.com/7.x/identicon/svg?seed=Banze" },
  { name: "Neon Smart", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Boots" },
];

interface SystemActivityModel {
  id: string;
  userId: string;
  userEmail: string;
  displayName: string;
  photoURL: string;
  type: "cadastro" | "login" | "update_perfil";
  description: string;
  createdAt: unknown;
}

function ProfilePage() {
  const { user, profile, loading, logout, isAdmin, updateProfileData } = useFirebase();
  const navigate = useNavigate();

  // Profile forms fields
  const [displayNameInput, setDisplayNameInput] = useState("");
  const [photoURLInput, setPhotoURLInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Live collections
  const [personalActivities, setPersonalActivities] = useState<SystemActivityModel[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [allSystemActivities, setAllSystemActivities] = useState<SystemActivityModel[]>([]);

  // Redirection guard for unauthenticated users
  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/login" });
    }
  }, [user, loading, navigate]);

  // Load current values
  useEffect(() => {
    if (profile) {
      setDisplayNameInput(profile.displayName || "");
      setPhotoURLInput(profile.photoURL || "");
    }
  }, [profile]);

  // 1. Listen to user's personal logs in real-time
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "systemActivities"), where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: SystemActivityModel[] = [];
        snapshot.forEach((doc) => {
          list.push(doc.data() as SystemActivityModel);
        });

        // Sort descending on client side to prevent composite index errors
        list.sort((a, b) => {
          const getSec = (c: unknown) => {
            if (c && typeof c === "object" && "seconds" in c) {
              return (c as { seconds: number }).seconds;
            }
            if (typeof c === "string" || typeof c === "number") {
              return new Date(c as string | number).getTime();
            }
            return 0;
          };
          return getSec(b.createdAt) - getSec(a.createdAt);
        });

        setPersonalActivities(list.slice(0, 20));
      },
      (error) => {
        // Fallback or handle quietly
        console.error("Erro ao escutar logs pessoais:", error);
      },
    );

    return () => unsubscribe();
  }, [user]);

  // 2. Admin listeners for live central panel audits
  useEffect(() => {
    if (!isAdmin) return;

    // A. Listen to all users
    const usersQuery = query(collection(db, "users"), orderBy("createdAt", "desc"), limit(40));
    const unsubscribeUsers = onSnapshot(
      usersQuery,
      (snapshot) => {
        const uList: UserProfile[] = [];
        snapshot.forEach((doc) => {
          uList.push(doc.data() as UserProfile);
        });
        setAllUsers(uList);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, "users");
      },
    );

    // B. Listen to all activities globally
    const actQuery = query(
      collection(db, "systemActivities"),
      orderBy("createdAt", "desc"),
      limit(40),
    );
    const unsubscribeActivities = onSnapshot(
      actQuery,
      (snapshot) => {
        const list: SystemActivityModel[] = [];
        snapshot.forEach((doc) => {
          list.push(doc.data() as SystemActivityModel);
        });
        setAllSystemActivities(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, "systemActivities");
      },
    );

    return () => {
      unsubscribeUsers();
      unsubscribeActivities();
    };
  }, [isAdmin]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setErrorMsg(null);

    const nameTrim = displayNameInput.trim();
    if (!nameTrim) {
      setErrorMsg("O nome não pode estar em branco.");
      setIsSaving(false);
      return;
    }

    try {
      await updateProfileData(nameTrim, photoURLInput);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg("Ocorreu um erro ao gravar as alterações.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    if (typeof window !== "undefined") {
      localStorage.removeItem("banze_auth");
    }
    navigate({ to: "/" });
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-emerald-400 font-mono">
        <div className="flex flex-col items-center gap-3">
          <Activity className="h-8 w-8 animate-spin text-emerald-500" />
          <span>Carregando Perfil Central...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-foreground">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pb-24 pt-28">
        {/* HEADING PORTFOLIO SECTION */}
        <div className="mb-10 flex flex-col items-start justify-between gap-6 border-b border-white/5 pb-8 sm:flex-row sm:items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
              <Shield className="h-3.5 w-3.5 text-emerald-400" />
              {isAdmin ? "Supervisor do Sistema" : "Área de Clientes"}
            </span>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white leading-tight">
              Seu perfil,{" "}
              <span className="text-gradient font-black">
                {profile?.displayName || user.displayName}
              </span>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Configure as suas definições com sincronização em tempo real imediata.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2.5 text-sm font-semibold text-muted-foreground transition hover:bg-white/15 hover:text-white"
          >
            <LogOut className="h-4 w-4" /> Terminar Sessão
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* COLUMN 1 & 2: SIMPLE PROFILE MANAGEMENT & REAL-TIME LOGS */}
          <div className="lg:col-span-2 space-y-8">
            {/* PERSONAL CARD EDITOR WITH LIVE SYNCHRONIZATION */}
            <section className="glass-strong rounded-3xl p-6 shadow-glow relative overflow-hidden">
              <div className="absolute top-0 right-0 h-[3px] w-full bg-gradient-to-r from-emerald-500 to-emerald-400 animate-pulse" />

              <div className="flex items-center gap-3 mb-6">
                <div className="glass inline-flex h-10 w-10 items-center justify-center rounded-full text-emerald-400 shadow-neon">
                  <Settings className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Editar Dados do Perfil</h2>
                  <p className="text-xs text-muted-foreground">
                    Alterações guardadas de forma imediata e transparente
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-8 md:flex-row items-start">
                {/* Real-time Avatar Circle Preview */}
                <div className="flex flex-col items-center gap-3 shrink-0 mx-auto md:mx-0">
                  <div className="relative group">
                    <div className="absolute inset-0 rounded-full bg-gradient-neon opacity-35 blur-md group-hover:opacity-60 transition duration-300" />
                    <div className="relative h-28 w-28 rounded-full bg-black/40 border-2 border-emerald-500/50 flex items-center justify-center overflow-hidden">
                      {photoURLInput ? (
                        <img
                          src={photoURLInput}
                          alt="Previsualização"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <UserCircle className="h-20 w-20 text-emerald-500/80" />
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">
                    PREVISUALIZAÇÃO
                  </span>
                </div>

                {/* Form to submit configuration */}
                <form onSubmit={handleSaveProfile} className="flex-1 w-full space-y-5">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground block mb-2">
                      Nome de Exibição (Display Name)
                    </label>
                    <div className="glass flex items-center gap-3 rounded-xl px-4 py-3 border border-white/10 focus-within:border-emerald-500/50 transition">
                      <User className="h-4 w-4 text-emerald-500" />
                      <input
                        type="text"
                        placeholder="Insira seu nome..."
                        value={displayNameInput}
                        onChange={(e) => setDisplayNameInput(e.target.value)}
                        className="w-full bg-transparent text-sm text-foreground focus:outline-none placeholder:text-muted-foreground/40 font-semibold"
                        required
                      />
                    </div>
                  </div>

                  {/* Preset beautiful avatar selector */}
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground block mb-3">
                      Escolher foto a partir de Avatares Banze
                    </label>
                    <div className="grid grid-cols-6 gap-2">
                      {AVATAR_PRESETS.map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => setPhotoURLInput(preset.url)}
                          title={preset.name}
                          className={`relative h-11 w-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-1 overflow-hidden hover:scale-105 hover:bg-white/10 transition ${
                            photoURLInput === preset.url
                              ? "border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/20"
                              : ""
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.name}
                            className="h-full w-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground block mb-2">
                      Ou link para foto de perfil personalizada
                    </label>
                    <div className="glass flex items-center gap-3 rounded-xl px-4 py-3 border border-white/10 focus-within:border-emerald-500/50 transition">
                      <ImageIcon className="h-4 w-4 text-emerald-500" />
                      <input
                        type="url"
                        placeholder="https://exemplo.com/avatar.png"
                        value={photoURLInput}
                        onChange={(e) => setPhotoURLInput(e.target.value)}
                        className="w-full bg-transparent text-sm text-foreground focus:outline-none placeholder:text-muted-foreground/40 font-mono text-xs"
                      />
                    </div>
                  </div>

                  {saveSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold"
                    >
                      <CheckCircle className="h-4 w-4 shrink-0" />
                      Alterações do perfil guardadas em tempo real!
                    </motion.div>
                  )}

                  {errorMsg && (
                    <div className="flex items-center gap-1.5 text-xs text-red-400">
                      <XCircle className="h-4 w-4 shrink-0" />
                      {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-neon py-3.5 text-sm font-black text-black shadow-neon transition duration-200 hover:scale-[1.01] hover:brightness-110 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    {isSaving ? "Gravando em tempo real..." : "GRAVAR ALTERAÇÕES"}
                  </button>
                </form>
              </div>
            </section>

            {/* REAL-TIME SECURITY ALERTS / CONNECTION LEDGER */}
            <section className="glass rounded-3xl p-6 border border-white/5">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <Clock className="h-5 w-5 text-emerald-500" />
                  <div>
                    <h2 className="text-lg font-bold text-white">Minhas Atividades Recentes</h2>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
                      Real-time Connection log
                    </p>
                  </div>
                </div>
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              {personalActivities.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-muted-foreground font-mono text-xs">
                  Aguardando eventos ao vivo...
                </div>
              ) : (
                <div className="space-y-3">
                  {personalActivities.map((act) => (
                    <div
                      key={act.id}
                      className="flex items-start justify-between rounded-xl bg-white/[0.01] border border-white/5 p-3 text-xs"
                    >
                      <div className="flex items-start gap-2.5">
                        <span
                          className={`inline-flex shrink-0 h-2 w-2 rounded-full mt-1.5 ${
                            act.type === "cadastro"
                              ? "bg-cyan-400"
                              : act.type === "login"
                                ? "bg-emerald-400"
                                : "bg-amber-400"
                          }`}
                        />
                        <div>
                          <p className="font-semibold text-zinc-100">{act.description}</p>
                          <p className="text-[10px] text-muted-foreground lowercase font-mono">
                            Log ID: {act.id.slice(0, 10)}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground">Agora</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* COLUMN 3: PLATFORM INSIGHTS & REAL-TIME AUDITOR SUPERVISION */}
          <div className="space-y-8">
            {/* PLATFORM METRICS */}
            <section className="glass rounded-3xl p-6 border border-white/5 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 h-[3px] w-full bg-emerald-500/20" />
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="glass inline-flex h-10 w-10 items-center justify-center rounded-full text-emerald-400 shadow-neon">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Banze Oracle Live</h2>
                    <p className="text-[10px] text-muted-foreground font-mono">
                      Maputo, Moçambique
                    </p>
                  </div>
                </div>

                <div className="space-y-4 font-mono text-xs">
                  <div className="flex items-center justify-between rounded-xl bg-white/[0.02] border border-white/5 p-3">
                    <span className="text-muted-foreground">Fuso Horário</span>
                    <span className="text-zinc-200">Maputo (GMT+2)</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-white/[0.02] border border-white/5 p-3">
                    <span className="text-muted-foreground">Sincronização</span>
                    <span className="text-emerald-400 flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Ativa
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-white/[0.02] border border-white/5 p-3">
                    <span className="text-muted-foreground">Conexão WebSocket</span>
                    <span className="text-emerald-400">Ativa</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/5 pt-4 mt-6 flex items-start gap-2 text-[10px] text-muted-foreground font-mono leading-relaxed">
                <AlertCircle className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                <span>
                  Os dados do perfil e auditorias de sistema atualizam para todos em milissegundos.
                </span>
              </div>
            </section>

            {/* SUPERVISED SYSTEM AUDITS - SHOWN REAL-TIME FOR ADMINS */}
            {isAdmin && (
              <div className="space-y-8">
                {/* GLOBAL ACCOUNTS LIST */}
                <section className="glass rounded-3xl p-6 border border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-emerald-400" />
                      <h2 className="text-base font-bold text-white">Usuários Cadastrados</h2>
                    </div>
                    <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-widest text-emerald-400 font-mono">
                      {allUsers.length} total
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">
                    Acesso instantâneo de contas criadas na plataforma Banze Intertech.
                  </p>

                  <div className="max-h-[300px] overflow-y-auto space-y-2.5 pr-1">
                    {allUsers.map((u) => (
                      <div
                        key={u.userId}
                        className="flex items-center justify-between rounded-xl bg-white/[0.02] border border-white/5 p-2.5 text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {u.photoURL ? (
                            <img
                              src={u.photoURL}
                              alt={u.displayName}
                              className="h-7 w-7 rounded-full border border-white/10"
                            />
                          ) : (
                            <div className="h-7 w-7 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[10px] font-bold text-emerald-400">
                              {u.displayName.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-bold text-white truncate">{u.displayName}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{u.email}</p>
                          </div>
                        </div>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-widest shrink-0 ${
                            u.role === "admin"
                              ? "bg-red-500/10 text-red-400"
                              : "bg-emerald-500/10 text-emerald-300"
                          }`}
                        >
                          {u.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* REAL-TIME SYSTEM ACTIVITIES FEED */}
                <section className="glass rounded-3xl p-6 border border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-emerald-400" />
                      <h2 className="text-base font-bold text-white">Central de Eventos System</h2>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">
                    Central de monitoramento de logins, cadastros e atualizações de perfil em tempo
                    real.
                  </p>

                  <div className="max-h-[350px] overflow-y-auto space-y-3 pr-1">
                    {allSystemActivities.length === 0 ? (
                      <p className="text-[11px] text-center text-muted-foreground py-6 font-mono">
                        Nenhum evento detectado.
                      </p>
                    ) : (
                      allSystemActivities.map((act) => (
                        <div
                          key={act.id}
                          className="rounded-xl bg-white/[0.02] border border-white/5 p-3 text-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[9px] uppercase font-mono tracking-tighter text-emerald-300">
                              EVENTO: {act.type.toUpperCase()}
                            </span>
                            <span className="text-[9px] font-mono text-muted-foreground">
                              Agora
                            </span>
                          </div>

                          <p className="text-[11px] text-zinc-300 font-medium">{act.description}</p>

                          <div className="flex items-center gap-1.5 pt-1.5 border-t border-white/5 text-[9px] font-mono text-muted-foreground">
                            <span>{act.userEmail}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
