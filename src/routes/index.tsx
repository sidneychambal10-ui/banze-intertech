import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { EcosystemCard } from "@/components/EcosystemCard";
import { AppCard } from "@/components/AppCard";
import { GameCard } from "@/components/GameCard";
import { ecosystem, apps, games } from "@/data/catalog";
import logo from "@/assets/banze-logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BANZE INTERTECH — Tecnologia, Jogos e Apps" },
      {
        name: "description",
        content:
          "Construímos jogos, apps e soluções digitais para conectar o futuro digital de Moçambique.",
      },
      { property: "og:title", content: "BANZE INTERTECH" },
      { property: "og:description", content: "Tecnologia, Jogos e Apps no ecossistema Banze." },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 flex items-center justify-center overflow-hidden">
          <img
            src={logo}
            alt=""
            className="h-[140%] w-[140%] max-w-none object-contain opacity-[0.24] select-none pointer-events-none"
            style={{
              filter: "hue-rotate(207deg) brightness(1.3) drop-shadow(0 0 50px rgb(34, 197, 94))",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
        </div>
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-16 md:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-foreground/90">
              <Sparkles className="h-3.5 w-3.5 text-gradient" /> Powered by Banze Intertech
            </span>
            <h1 className="mt-6 text-5xl font-black leading-[1.05] text-foreground md:text-7xl">
              Tecnologia, <span className="text-gradient">Jogos</span> e{" "}
              <span className="text-gradient">Apps</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Desenvolvemos infraestrutura de ponta, aplicações inovadoras e experiências
              interativas de alta performance.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/catalogo"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-neon px-6 py-3.5 text-sm font-semibold text-white shadow-neon transition hover:scale-[1.02]"
              >
                Explorar Plataforma <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/acesso"
                className="glass inline-flex items-center gap-2 rounded-xl border border-emerald-500/20 px-6 py-3.5 text-sm font-semibold text-emerald-400 hover:bg-emerald-500/5 transition hover:shadow-neon"
              >
                Entrar / Cadastrar
              </Link>
              <Link
                to="/login"
                className="glass inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition hover:shadow-neon"
              >
                Para Colaboradores
              </Link>
            </div>
            <div className="mt-14 flex items-center gap-3 text-sm font-medium tracking-wide text-zinc-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
              <span>O ecossistema tem três pilares. Um só universo.</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ECOSYSTEM */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <SectionHead eyebrow="O Ecossistema" title="Três pilares. Um só universo." />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {ecosystem.map((e, i) => (
            <EcosystemCard key={e.id} {...e} delay={i * 0.1} />
          ))}
        </div>
      </section>

      {/* FEATURED APPS */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <SectionHead
          eyebrow="Banze Apps"
          title="Apps em destaque"
          link={{ to: "/apps", label: "Ver todas" }}
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {apps.slice(0, 3).map((a, i) => (
            <AppCard key={a.id} {...a} delay={i * 0.08} />
          ))}
        </div>
      </section>

      {/* FEATURED GAMES */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <SectionHead
          eyebrow="Banze Games"
          title="Jogos em destaque"
          link={{ to: "/games", label: "Ver todos" }}
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {games.slice(0, 3).map((g, i) => (
            <GameCard key={g.id} {...g} delay={i * 0.08} />
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}

function SectionHead({
  eyebrow,
  title,
  link,
}: {
  eyebrow: string;
  title: string;
  link?: { to: string; label: string };
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gradient">{eyebrow}</p>
        <h2 className="mt-2 text-3xl font-bold text-foreground md:text-4xl">{title}</h2>
      </div>
      {link && (
        <Link
          to={link.to as "/apps"}
          className="hidden text-sm font-semibold text-foreground/80 hover:text-foreground md:inline-flex"
        >
          {link.label} →
        </Link>
      )}
    </div>
  );
}
