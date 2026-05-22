import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { AppCard } from "@/components/AppCard";
import { apps } from "@/data/catalog";

export const Route = createFileRoute("/apps")({
  head: () => ({
    meta: [
      { title: "Banze Apps — BANZE INTERTECH" },
      {
        name: "description",
        content: "Descubra as apps do ecossistema BANZE: chat, wallet, music, learn e mais.",
      },
    ],
    links: [{ rel: "canonical", href: "/apps" }],
  }),
  component: AppsPage,
});

function AppsPage() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gradient">Banze Apps</p>
        <h1 className="mt-3 text-4xl font-black text-foreground md:text-6xl">
          Apps que <span className="text-gradient">movem</span> o dia a dia.
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Uma família de aplicações desenhadas para Moçambique — rápidas, seguras e bonitas.
        </p>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {apps.map((a, i) => (
            <AppCard key={a.id} {...a} delay={i * 0.05} />
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
