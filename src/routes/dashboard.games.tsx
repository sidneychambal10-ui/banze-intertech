import { createFileRoute } from "@tanstack/react-router";
import { GameCard } from "@/components/GameCard";
import { games } from "@/data/catalog";
import cityImg from "@/assets/banze-city.jpg";
import { Play } from "lucide-react";

export const Route = createFileRoute("/dashboard/games")({
  component: () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-foreground md:text-4xl">Banze Games</h1>
        <p className="mt-2 text-muted-foreground">Gerencie e acompanhe o catálogo de jogos.</p>
      </div>
      <div className="glass relative overflow-hidden rounded-3xl">
        <img
          src={cityImg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        <div className="relative max-w-lg p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gradient">
            Projecto Principal
          </p>
          <h2 className="mt-2 text-4xl font-black text-foreground md:text-5xl">
            BANZE <span className="text-gradient">CITY</span>
          </h2>
          <p className="mt-3 text-muted-foreground">Open-world inspirado em Moçambique.</p>
          <button className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-neon px-5 py-2.5 text-sm font-semibold text-white shadow-neon">
            <Play className="h-4 w-4 fill-white" /> Ver detalhes
          </button>
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {games
          .filter((g) => g.id !== "city")
          .map((g, i) => (
            <GameCard key={g.id} {...g} delay={i * 0.04} />
          ))}
      </div>
    </div>
  ),
});
