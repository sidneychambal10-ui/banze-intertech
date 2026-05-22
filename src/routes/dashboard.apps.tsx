import { createFileRoute } from "@tanstack/react-router";
import { AppCard } from "@/components/AppCard";
import { apps } from "@/data/catalog";

export const Route = createFileRoute("/dashboard/apps")({
  component: () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-foreground md:text-4xl">Banze Apps</h1>
        <p className="mt-2 text-muted-foreground">Todas as aplicações publicadas no ecossistema.</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {apps.map((a, i) => (
          <AppCard key={a.id} {...a} delay={i * 0.04} />
        ))}
      </div>
    </div>
  ),
});
