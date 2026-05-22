import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { User, Lock, Palette, Cpu, Bell, Check } from "lucide-react";
import { useFirebase } from "@/components/FirebaseContext";

export const Route = createFileRoute("/dashboard/configuracoes")({
  component: ConfigPage,
});

const tabs = [
  { id: "perfil", label: "Perfil", icon: User },
  { id: "seguranca", label: "Segurança", icon: Lock },
  { id: "aparencia", label: "Aparência", icon: Palette },
  { id: "sistema", label: "Sistema", icon: Cpu },
  { id: "notificacoes", label: "Notificações", icon: Bell },
] as const;

function ConfigPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("perfil");
  const { profile, isAdmin } = useFirebase();

  const isSupervisor = profile?.email?.toLowerCase() === "sidneychambal10@gmail.com";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-foreground md:text-4xl">Configurações</h1>
        <p className="mt-2 text-muted-foreground">Personalize a sua experiência no painel BANZE.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <nav className="glass rounded-2xl p-3">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                tab === t.id
                  ? "bg-gradient-neon text-white shadow-neon"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              }`}
            >
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </nav>

        <div className="glass rounded-2xl p-6 md:p-8">
          {tab === "perfil" && (
            <div className="space-y-5">
              <H title="Perfil" sub="Informações da conta conectada na plataforma." />
              <Field
                key={profile?.displayName || "nome"}
                label="Nome"
                value={profile?.displayName || "Utilizador Conectado"}
              />
              <Field key={profile?.email || "email"} label="Email" value={profile?.email || ""} />
              <Field
                key={profile?.role || "cargo"}
                label="Cargo"
                value={isSupervisor ? "Supervisor do Sistema" : "Colaborador"}
              />
            </div>
          )}
          {tab === "seguranca" && (
            <div className="space-y-5">
              <H title="Segurança" sub="Mantenha a sua conta protegida." />
              <Field label="Palavra-passe actual" placeholder="••••••••" type="password" />
              <Field label="Nova palavra-passe" placeholder="Nova palavra-passe" type="password" />
              <button className="rounded-xl bg-gradient-neon px-5 py-2.5 text-sm font-semibold text-white shadow-neon">
                Alterar palavra-passe
              </button>
              <div className="rounded-xl border border-border/60 p-4">
                <p className="text-sm font-semibold text-foreground">Sessões activas</p>
                <p className="mt-1 text-xs text-muted-foreground">MacBook Pro · Maputo · agora</p>
              </div>
            </div>
          )}
          {tab === "aparencia" && (
            <div className="space-y-5">
              <H title="Aparência" sub="Personalize o tema." />
              <div className="flex items-center justify-between rounded-xl border border-border/60 p-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">Modo escuro</p>
                  <p className="text-xs text-muted-foreground">
                    Optimizado para gaming e longas sessões.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                  <Check className="h-3 w-3" /> Activo
                </span>
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold text-foreground">Cor do tema</p>
                <div className="flex gap-3">
                  {[
                    "from-emerald-500 to-green-600",
                    "from-green-400 to-emerald-600",
                    "from-emerald-600 to-teal-500",
                    "from-lime-400 to-emerald-500",
                  ].map((g, index) => (
                    <button
                      key={g}
                      className={`h-10 w-10 rounded-full bg-gradient-to-br ${g} shadow-neon ring-2 transition ${
                        index === 0 ? "ring-emerald-500" : "ring-transparent hover:ring-white/30"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          {tab === "sistema" && (
            <div className="space-y-5">
              <H title="Sistema" sub="Informação técnica e regional." />
              <Field label="Idioma" value="Português (Moçambique)" />
              <Field label="Fuso horário" value="Africa/Maputo (UTC+2)" />
              <Field label="Versão do painel" value="v1.4.2 · estável" />
            </div>
          )}
          {tab === "notificacoes" && (
            <div className="space-y-4">
              <H title="Notificações" sub="Escolha o que quer receber." />
              {[
                "Novos utilizadores",
                "Actualizações de jogos",
                "Alertas do sistema",
                "Mensagens da equipa",
              ].map((l) => (
                <label
                  key={l}
                  className="flex items-center justify-between rounded-xl border border-border/60 p-4"
                >
                  <span className="text-sm text-foreground">{l}</span>
                  <input type="checkbox" defaultChecked className="h-4 w-4 accent-emerald-500" />
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function H({ title, sub }: { title: string; sub: string }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-foreground">{title}</h2>
      <p className="text-sm text-muted-foreground">{sub}</p>
    </div>
  );
}

function Field({
  label,
  value,
  placeholder,
  type = "text",
}: {
  label: string;
  value?: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <input
        type={type}
        defaultValue={value}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border/60 bg-input/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/60 focus:outline-none focus:shadow-neon"
      />
    </label>
  );
}
