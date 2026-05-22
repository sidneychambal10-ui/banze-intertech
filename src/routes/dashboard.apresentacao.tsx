import { createFileRoute } from "@tanstack/react-router";
import { Target, Eye, Compass, Rocket } from "lucide-react";

export const Route = createFileRoute("/dashboard/apresentacao")({
  component: () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-foreground md:text-4xl">Apresentação da empresa</h1>
        <p className="mt-2 text-muted-foreground">
          Quem somos, missão, visão e objectivos da BANZE INTERTECH.
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {[
          {
            I: Compass,
            t: "Quem Somos",
            d: "Empresa moçambicana de tecnologia, jogos e pagamentos.",
          },
          { I: Target, t: "Missão", d: "Acelerar a transformação digital de Moçambique." },
          { I: Eye, t: "Visão", d: "Ser o maior ecossistema tecnológico africano até 2030." },
          { I: Rocket, t: "Objectivos", d: "50+ produtos, 100k jovens formados, expansão CPLP." },
        ].map(({ I, t, d }) => (
          <div key={t} className="glass relative overflow-hidden rounded-2xl p-7">
            <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-gradient-neon opacity-15 blur-3xl" />
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-neon shadow-neon">
              <I className="h-6 w-6 text-white" />
            </div>
            <h2 className="mt-5 text-xl font-bold text-foreground">{t}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{d}</p>
          </div>
        ))}
      </div>
    </div>
  ),
});
