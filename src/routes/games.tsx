import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Play, Star } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { GameCard } from "@/components/GameCard";
import { games } from "@/data/catalog";
import cityImg from "@/assets/banze-city.jpg";

export const Route = createFileRoute("/games")({
  head: () => ({
    meta: [
      { title: "Banze Games — BANZE INTERTECH" },
      { name: "description", content: "BANZE CITY e toda a colecção de jogos da BANZE." },
      { property: "og:image", content: cityImg },
    ],
    links: [{ rel: "canonical", href: "/games" }],
  }),
  component: GamesPage,
});

function GamesPage() {
  const others = games.filter((g) => g.id !== "city");
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gradient">
          Banze Games
        </p>
        <h1 className="mt-3 text-4xl font-black text-foreground md:text-6xl">
          Jogue como nunca antes.
        </h1>

        {/* Featured */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass mt-10 grid overflow-hidden rounded-3xl md:grid-cols-2"
        >
          <div className="relative min-h-[320px]">
            <img
              src={cityImg}
              alt="Banze City"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/30 to-transparent md:bg-gradient-to-l" />
          </div>
          <div className="p-8 md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gradient">
              Projecto Principal
            </p>
            <h2 className="mt-3 text-4xl font-black text-foreground md:text-5xl">
              BANZE <span className="text-gradient">CITY</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Um jogo de mundo aberto inspirado em Moçambique. Conduz, explora e vive a vida na
              cidade neon do futuro.
            </p>
            <div className="mt-5 flex items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/10 px-3 py-1 font-semibold text-amber-300">
                <Star className="h-3 w-3 fill-amber-300" /> 4.9
              </span>
              <span className="rounded-full bg-white/5 px-3 py-1 font-semibold text-muted-foreground">
                Open World
              </span>
            </div>
            <button
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent("open-banze-arcade", {
                    detail: { game: "puzzle" },
                  }),
                );
              }}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-neon px-6 py-3 text-sm font-semibold text-white shadow-neon cursor-pointer transition active:scale-95"
            >
              <Play className="h-4 w-4 fill-white" /> Jogar agora
            </button>
          </div>
        </motion.div>

        <div className="mt-14">
          <h2 className="text-2xl font-bold text-foreground">Mais jogos</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {others.map((g, i) => (
              <GameCard key={g.id} {...g} delay={i * 0.05} />
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
