import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Target, Eye, Compass, Rocket, Globe2, Cpu } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/apresentacao")({
  head: () => ({
    meta: [
      { title: "Apresentação — BANZE INTERTECH" },
      {
        name: "description",
        content: "Quem somos, missão, visão e o futuro digital de Moçambique.",
      },
      { property: "og:title", content: "Apresentação — BANZE INTERTECH" },
      { property: "og:description", content: "Tecnologia + Gaming + Apps + Pagamentos." },
    ],
    links: [{ rel: "canonical", href: "/apresentacao" }],
  }),
  component: Apresentacao,
});

const blocks = [
  {
    icon: Compass,
    title: "Quem Somos",
    text: "A BANZE INTERTECH é uma empresa moçambicana focada em construir o ecossistema digital do futuro — unindo tecnologia, jogos e pagamentos numa só plataforma.",
  },
  {
    icon: Target,
    title: "Missão",
    text: "Acelerar a transformação digital de Moçambique através de produtos de classe mundial, acessíveis a todos.",
  },
  {
    icon: Eye,
    title: "Visão",
    text: "Ser o maior ecossistema tecnológico africano até 2030, exportando inovação moçambicana para o mundo.",
  },
  {
    icon: Rocket,
    title: "Objectivos",
    text: "Lançar 50+ produtos digitais, capacitar 100.000 jovens em tecnologia e processar pagamentos em toda a CPLP.",
  },
  {
    icon: Globe2,
    title: "O futuro digital de Moçambique",
    text: "Construímos infraestrutura, comunidade e oportunidade — para uma geração que merece criar e não apenas consumir.",
  },
  {
    icon: Cpu,
    title: "Tecnologia + Gaming + Apps + Pagamentos",
    text: "Quatro frentes, uma só visão: um país conectado por software feito em casa.",
  },
];

function Apresentacao() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-6 py-16 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gradient">
          Apresentação
        </p>
        <h1 className="mt-4 text-5xl font-black leading-tight text-foreground md:text-7xl">
          Construindo o <span className="text-gradient">futuro digital</span> de Moçambique
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Uma nova geração de tecnologia africana — pensada, desenhada e desenvolvida em Moçambique
          para o mundo.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blocks.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="glass relative overflow-hidden rounded-2xl p-7 transition hover:shadow-neon"
            >
              <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-gradient-neon opacity-15 blur-3xl" />
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-neon shadow-neon">
                <b.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-foreground">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.text}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
