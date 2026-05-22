import { createFileRoute, Link } from "@tanstack/react-router";
import { AppCard } from "@/components/AppCard";
import { GameCard } from "@/components/GameCard";
import { apps, games } from "@/data/catalog";

export const Route = createFileRoute("/dashboard/catalogo")({
  component: () => (
    <div className="space-y-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground md:text-4xl">Catálogo completo</h1>
          <p className="mt-2 text-muted-foreground">
            Todos os produtos publicados no ecossistema BANZE.
          </p>
        </div>
        <Link
          to="/catalogo"
          className="glass hidden rounded-xl px-4 py-2 text-sm font-semibold text-foreground md:inline-flex"
        >
          Ver público →
        </Link>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-foreground">Apps</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {apps.map((a, i) => (
            <AppCard key={a.id} {...a} delay={i * 0.04} />
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-foreground">Games</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {games.map((g, i) => (
            <GameCard key={g.id} {...g} delay={i * 0.04} />
          ))}
        </div>
      </div>
    </div>
  ),
});
