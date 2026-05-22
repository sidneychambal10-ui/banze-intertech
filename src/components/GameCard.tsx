import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Gamepad2, Star } from "lucide-react";

export function GameCard({
  id,
  title,
  desc,
  category,
  rating,
  icon: Icon,
  accent,
  image,
  delay = 0,
}: {
  id: string;
  title: string;
  desc: string;
  category: string;
  rating: number;
  icon: LucideIcon;
  accent: string;
  image?: string;
  delay?: number;
}) {
  const handlePlayDemo = () => {
    let gameType = "mines";
    if (
      id === "racing" ||
      title.toLowerCase().includes("slot") ||
      title.toLowerCase().includes("corridas")
    ) {
      gameType = "slot";
    } else if (id === "city" || id === "street" || title.toLowerCase().includes("puzzle")) {
      gameType = "puzzle";
    }

    window.dispatchEvent(
      new CustomEvent("open-banze-arcade", {
        detail: { game: gameType },
      }),
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -6 }}
      className="glass group relative overflow-hidden rounded-2xl transition hover:shadow-neon"
      id={`game-card-${title.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div className={`relative h-48 overflow-hidden bg-gradient-to-br ${accent}`}>
        {image ? (
          <>
            <img
              src={image}
              alt={title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-neutral-950/50" />
          </>
        ) : (
          <div className="absolute inset-0 grid-bg opacity-30" />
        )}

        <Icon className="absolute -right-6 -bottom-6 h-36 w-36 text-white/10" />

        <div className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-black/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white backdrop-blur-md border border-white/5">
          {category}
        </div>
        <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md border border-white/5">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {rating}
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed min-h-[40px]">{desc}</p>
        <button
          onClick={handlePlayDemo}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-neon/15 border border-emerald-500/20 py-2.5 text-sm font-bold text-emerald-400 transition hover:bg-gradient-neon hover:text-white cursor-pointer group/btn"
        >
          <Gamepad2 className="h-4 w-4 text-emerald-400 group-hover/btn:text-white transition" />
          <span>Jogar Demo Web</span>
        </button>
      </div>
    </motion.div>
  );
}
