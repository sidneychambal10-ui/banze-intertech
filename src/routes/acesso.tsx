import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Gamepad2, CreditCard, Boxes, Loader2, UserCircle } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useFirebase } from "@/components/FirebaseContext";
import logo from "@/assets/banze-logo.png";

export const Route = createFileRoute("/acesso")({
  head: () => ({
    meta: [
      { title: "Acesso de Clientes — BANZE INTERTECH" },
      { name: "description", content: "Faça cadastro e login no ecossistema BANZE INTERTECH." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AcessoComum,
});

function AcessoComum() {
  const navigate = useNavigate();
  const { loginWithGoogle, user } = useFirebase();
  const [err, setErr] = useState<string | null>(null);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  // If already logged in, redirect to profile
  useState(() => {
    if (user) {
      navigate({ to: "/perfil" });
    }
  });

  const handleGoogleAuth = async () => {
    setErr(null);
    setLoadingGoogle(true);
    try {
      await loginWithGoogle();
      if (typeof window !== "undefined") {
        localStorage.setItem("banze_auth", "1");
      }
      navigate({ to: "/perfil" });
    } catch (error: unknown) {
      console.error(error);
      setErr("Erro ao autenticar com o Google. Tente novamente.");
    } finally {
      setLoadingGoogle(false);
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
          <div className="mb-8 flex flex-col items-center">
            <div className="glass inline-flex h-12 w-12 items-center justify-center rounded-full shadow-neon mb-3">
              <UserCircle className="h-6 w-6 text-gradient" />
            </div>
            <h2 className="text-center text-2xl font-black text-foreground tracking-tight">
              Acessar <span className="text-gradient">Área de Clientes</span>
            </h2>
            <p className="text-sm text-muted-foreground text-center mt-2.5">
              Faça login ou cadastre uma nova conta do ecossistema Banze para gerenciar seu perfil.
              Normal, rápido e seguro.
            </p>
          </div>

          {err && (
            <div className="mb-4 rounded-xl bg-red-500/10 p-3.5 text-xs font-semibold text-red-400 border border-red-500/20 text-center">
              {err}
            </div>
          )}

          {/* GOOGLE ENTRAR / REGISTRAR ROW ONLY */}
          <div className="mt-6 space-y-4">
            <button
              onClick={handleGoogleAuth}
              disabled={loadingGoogle}
              className="group flex w-full items-center justify-center gap-3 rounded-xl border border-white bg-white py-3.5 text-sm font-bold text-black shadow-lg transition duration-200 hover:bg-slate-100 disabled:opacity-75 cursor-pointer"
            >
              {loadingGoogle ? (
                <Loader2 className="h-4 w-4 animate-spin text-black" />
              ) : (
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61a5.66 5.66 0 0 1-2.455 3.71v3.08h3.95c2.31-2.13 3.64-5.27 3.64-8.64z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.95-3.08c-1.1.74-2.51 1.18-3.98 1.18-3.07 0-5.67-2.08-6.6-4.88H1.43v3.18A12 12 0 0 0 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.4 14.31a7.16 7.16 0 0 1 0-4.62V6.51H1.43a12 12 0 0 0 0 11.02l3.97-3.22z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42A12 12 0 0 0 1.43 6.51l3.97 3.22c.93-2.8 3.53-4.88 6.6-4.88z"
                  />
                </svg>
              )}
              {loadingGoogle ? "A conectar com Google..." : "Entrar com Google"}
            </button>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-8 leading-relaxed">
            Ao conectar-se na plataforma, aceita os Termos de Serviço e nossa Política de
            Privacidade.
          </p>

          <div className="mt-8 text-center">
            <Link
              to="/"
              className="text-xs text-muted-foreground hover:text-foreground hover:underline transition"
            >
              Voltar ao Início
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
