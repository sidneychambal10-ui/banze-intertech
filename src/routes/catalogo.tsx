import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { AppCard } from "@/components/AppCard";
import { GameCard } from "@/components/GameCard";
import { apps, games } from "@/data/catalog";
import { CreditCard, Wifi, Cloud, Shield } from "lucide-react";

export const Route = createFileRoute("/catalogo")({
  head: () => ({
    meta: [
      { title: "Catálogo — BANZE INTERTECH" },
      {
        name: "description",
        content: "Todos os produtos do ecossistema BANZE: apps, jogos, serviços e pagamentos.",
      },
    ],
    links: [{ rel: "canonical", href: "/catalogo" }],
  }),
  component: Catalogo,
});

const services = [
  {
    id: "pay",
    title: "Banze Pay",
    desc: "Gateway de pagamentos integrado com M-Pesa, eMola e cartões.",
    category: "Pagamentos",
    icon: CreditCard,
    accent: "from-blue-500 to-cyan-500",
    image:
      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "cloud",
    title: "Banze Cloud",
    desc: "Hospedagem e infraestrutura em África.",
    category: "Serviços",
    icon: Cloud,
    accent: "from-indigo-500 to-violet-600",
    image:
      "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "net",
    title: "Banze Net",
    desc: "Conectividade para comunidades e empresas.",
    category: "Serviços",
    icon: Wifi,
    accent: "from-emerald-500 to-teal-500",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "sec",
    title: "Banze Secure",
    desc: "Cibersegurança e identidade digital.",
    category: "Pagamentos",
    icon: Shield,
    accent: "from-rose-500 to-red-500",
    image:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
  },
];

const tabs = ["Todos", "Apps", "Games", "Serviços", "Pagamentos"] as const;

function Catalogo() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Todos");

  const showApps = tab === "Todos" || tab === "Apps";
  const showGames = tab === "Todos" || tab === "Games";
  const showServices = tab === "Todos" || tab === "Serviços" || tab === "Pagamentos";
  const filteredServices =
    tab === "Pagamentos" ? services.filter((s) => s.category === "Pagamentos") : services;

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gradient">Catálogo</p>
        <h1 className="mt-3 text-4xl font-black text-foreground md:text-6xl">
          Todo o ecossistema, num só lugar.
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Explore apps, jogos, serviços digitais e soluções de pagamento da BANZE INTERTECH.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                tab === t
                  ? "bg-gradient-neon text-white shadow-neon"
                  : "glass text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {showApps && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-foreground">Apps</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {apps.map((a, i) => (
                <AppCard key={a.id} {...a} delay={i * 0.05} />
              ))}
            </div>
          </div>
        )}
        {showGames && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-foreground">Games</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {games.map((g, i) => (
                <GameCard key={g.id} {...g} delay={i * 0.05} />
              ))}
            </div>
          </div>
        )}
        {showServices && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-foreground">Serviços & Pagamentos</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredServices.map((s, i) => (
                <AppCard key={s.id} {...s} delay={i * 0.05} />
              ))}
            </div>
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
