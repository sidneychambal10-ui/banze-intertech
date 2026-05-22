import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Clock } from "lucide-react";

export function AppCard({
  title,
  desc,
  category,
  icon: Icon,
  accent,
  image,
  delay = 0,
}: {
  title: string;
  desc: string;
  category: string;
  icon: LucideIcon;
  accent: string;
  image?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -6 }}
      className="glass group relative overflow-hidden rounded-2xl transition hover:shadow-neon"
      id={`app-card-${title.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div className={`relative h-44 overflow-hidden bg-gradient-to-br ${accent}`}>
        {image ? (
          <>
            <img
              src={image}
              alt={title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-neutral-950/40" />
          </>
        ) : (
          <div className="absolute inset-0 grid-bg opacity-30" />
        )}

        <div className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-black/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white backdrop-blur-md border border-white/5">
          {category}
        </div>

        {/* Floating icon */}
        <div className="absolute right-4 bottom-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md border border-white/10 shadow-lg text-white">
          <Icon className="h-5.5 w-5.5" />
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-base font-bold text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed min-h-[40px]">{desc}</p>
        <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 py-2.5 text-sm font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-white cursor-pointer group/btn">
          <Clock className="h-4 w-4 text-cyan-400 animate-pulse" />
          <span>Em breve</span>
        </button>
      </div>
    </motion.div>
  );
}
