import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export function EcosystemCard({
  title,
  desc,
  icon: Icon,
  accent,
  delay = 0,
}: {
  title: string;
  desc: string;
  icon: LucideIcon;
  accent: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -6 }}
      className="glass group relative overflow-hidden rounded-2xl p-7 transition hover:shadow-neon"
    >
      <div
        className={`absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br ${accent} opacity-20 blur-3xl transition group-hover:opacity-40`}
      />
      <div
        className={`inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${accent} shadow-glow`}
      >
        <Icon className="h-7 w-7 text-white" />
      </div>
      <h3 className="mt-5 text-xl font-bold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
      <div className="mt-5 inline-flex items-center text-sm font-semibold text-gradient">
        Explorar →
      </div>
    </motion.div>
  );
}
