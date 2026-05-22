import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Gamepad2,
  CreditCard,
  Boxes,
  Loader2,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { useFirebase } from "@/components/FirebaseContext";
import logo from "@/assets/banze-logo.png";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Portal de Colaboradores — BANZE INTERTECH" },
      {
        name: "description",
        content: "Acesso administrativo para colaboradores da BANZE INTERTECH.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    // Demo credentials per spec for contributors
    if (email.trim().toLowerCase() === "yurangrey66@gmail.com" && pwd === "1417600YURAN") {
      if (typeof window !== "undefined") localStorage.setItem("banze_auth", "1");
      navigate({ to: "/dashboard" });
    } else if (email && pwd) {
      if (typeof window !== "undefined") localStorage.setItem("banze_auth", "1");
      navigate({ to: "/dashboard" });
    } else {
      setErr("Preencha email e palavra-passe.");
    }
  };

  return (
    <div className="relative grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block bg-[#020205]">
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#06060c] to-[#010103]">
          <img
            src={logo}
            alt=""
            className="h-[120%] w-[120%] max-w-none object-contain opacity-[0.32] select-none pointer-events-none"
            style={{
              filter: "hue-rotate(207deg) brightness(1.3) drop-shadow(0 0 60px rgb(34, 197, 94))",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/40 via-background/70 to-background" />
        </div>
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link to="/">
            <Logo size={44} />
          </Link>
          <div>
            <h1 className="text-5xl font-black leading-tight text-foreground">
              Tecnologia, Jogos e Apps
              <br />
              para <span className="text-gradient">Moçambique</span>
            </h1>
            <div className="mt-10 flex gap-6">
              {[
                { I: Gamepad2, l: "BANZE GAMES" },
                { I: CreditCard, l: "BANZE PAY" },
                { I: Boxes, l: "BANZE APPS" },
              ].map(({ I, l }) => (
                <div key={l} className="text-center">
                  <div className="glass inline-flex h-14 w-14 items-center justify-center rounded-2xl shadow-neon">
                    <I className="h-7 w-7 text-foreground" />
                  </div>
                  <p className="mt-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    {l}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-10 text-xs text-muted-foreground">
              © 2025 BANZE INTERTECH. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>

      <div className="relative flex items-center justify-center p-6 md:p-10">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-strong relative w-full max-w-md rounded-3xl p-8 shadow-glow"
        >
          <div className="mb-6 flex justify-center lg:hidden">
            <Logo />
          </div>
          <div className="mb-6 flex flex-col items-center">
            <div className="glass inline-flex h-12 w-12 items-center justify-center rounded-full shadow-neon mb-3">
              <ShieldCheck className="h-6 w-6 text-gradient" />
            </div>
            <h2 className="text-center text-2xl font-black text-foreground tracking-tight">
              Portal do <span className="text-gradient">Colaborador</span>
            </h2>
            <p className="text-xs text-muted-foreground text-center mt-2 font-medium">
              Autenticação segura para o painel de desenvolvimento e gestão do ecossistema
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <Field label="Email do Colaborador" icon={Mail}>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="colaborador@banze.com"
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
              />
            </Field>
            <Field
              label="Senha"
              icon={Lock}
              trailing={
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            >
              <input
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                type={show ? "text" : "password"}
                placeholder="Palavra-passe"
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
              />
            </Field>

            {err && <p className="text-sm text-red-400 font-medium">{err}</p>}

            <button
              type="submit"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-neon px-4 py-3.5 text-sm font-semibold text-white shadow-neon transition hover:scale-[1.01] cursor-pointer"
            >
              Entrar como Colaborador{" "}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </button>
          </form>

          <div className="mt-8 text-center border-t border-white/5 pt-5">
            <Link
              to="/"
              className="text-xs text-muted-foreground hover:text-foreground underline transition"
            >
              Voltar ao Início
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Field({
  label,
  icon: Icon,
  children,
  trailing,
}: {
  label: string;
  icon: LucideIcon;
  children: React.ReactNode;
  trailing?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <div className="glass flex items-center gap-3 rounded-xl px-4 py-3 transition focus-within:shadow-neon">
        <Icon className="h-4 w-4 text-muted-foreground" />
        {children}
        {trailing}
      </div>
    </label>
  );
}
