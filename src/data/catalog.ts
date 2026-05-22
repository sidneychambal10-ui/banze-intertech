import {
  Gamepad2,
  CreditCard,
  Boxes,
  MessageCircle,
  Wallet,
  Music,
  GraduationCap,
  Newspaper,
  Car,
  Swords,
  Trophy,
  Building2,
  Zap,
  Shield,
} from "lucide-react";

export const ecosystem = [
  {
    id: "games",
    title: "BANZE Games",
    desc: "Universo de jogos inspirados na cultura moçambicana.",
    icon: Gamepad2,
    accent: "from-fuchsia-500 to-violet-600",
  },
  {
    id: "pay",
    title: "BANZE Pay",
    desc: "Ponte de pagamentos segura para o futuro digital.",
    icon: CreditCard,
    accent: "from-blue-500 to-cyan-500",
  },
  {
    id: "apps",
    title: "BANZE Apps",
    desc: "Apps modernas que conectam pessoas e serviços.",
    icon: Boxes,
    accent: "from-emerald-400 to-teal-500",
  },
] as const;

export const apps = [
  {
    id: "chat",
    title: "Banze Chat",
    desc: "Mensagens encriptadas e chamadas em alta definição.",
    category: "Social",
    icon: MessageCircle,
    accent: "from-violet-500 to-fuchsia-500",
    image:
      "https://images.unsplash.com/photo-1611746872915-64382b5c76da?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "wallet",
    title: "Banze Wallet",
    desc: "Carteira digital integrada com M-Pesa e eMola.",
    category: "Fintech",
    icon: Wallet,
    accent: "from-blue-500 to-cyan-500",
    image:
      "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "music",
    title: "Banze Music",
    desc: "Streaming de artistas moçambicanos e africanos.",
    category: "Entretenimento",
    icon: Music,
    accent: "from-pink-500 to-rose-500",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "learn",
    title: "Banze Learn",
    desc: "Plataforma de cursos e capacitação tecnológica.",
    category: "Educação",
    icon: GraduationCap,
    accent: "from-emerald-500 to-teal-500",
    image:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "news",
    title: "Banze News",
    desc: "Notícias em tempo real curadas por IA.",
    category: "Informação",
    icon: Newspaper,
    accent: "from-amber-400 to-orange-500",
    image:
      "https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "id",
    title: "Banze ID",
    desc: "Identidade digital única para todo o ecossistema.",
    category: "Segurança",
    icon: Shield,
    accent: "from-indigo-500 to-blue-600",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
  },
] as const;

export const games = [
  {
    id: "city",
    title: "Banze City",
    desc: "Open-world inspirado em Moçambique.",
    category: "Open World",
    rating: 4.9,
    icon: Building2,
    accent: "from-fuchsia-600 to-violet-700",
    featured: true,
    image:
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "soccer",
    title: "Banze Soccer 25",
    desc: "Futebol arcade com seleções africanas.",
    category: "Desporto",
    rating: 4.6,
    icon: Trophy,
    accent: "from-emerald-500 to-lime-500",
    image:
      "https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "racing",
    title: "Banze Racing",
    desc: "Corridas neon pelas ruas de Maputo.",
    category: "Corridas",
    rating: 4.7,
    icon: Car,
    accent: "from-blue-500 to-cyan-500",
    image:
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "battle",
    title: "Banze Battle",
    desc: "Battle royale futurista 60 jogadores.",
    category: "Shooter",
    rating: 4.5,
    icon: Swords,
    accent: "from-rose-500 to-red-600",
    image:
      "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "street",
    title: "Banze Street",
    desc: "Aventura urbana de skate e parkour.",
    category: "Arcade",
    rating: 4.4,
    icon: Zap,
    accent: "from-amber-400 to-orange-500",
    image:
      "https://images.unsplash.com/photo-1520156473893-c44791e2e718?auto=format&fit=crop&w=800&q=80",
  },
] as const;

export type Item = { id: string; title: string; desc: string; category?: string };
