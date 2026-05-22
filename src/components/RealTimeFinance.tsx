import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Wallet,
  CreditCard,
  ArrowUpRight,
  Activity,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface Transaction {
  id: string;
  time: string;
  method: "M-Pesa" | "eMola" | "Visa" | "Banze Pay";
  amount: number;
  user: string;
  status: "success" | "pending";
}

interface ChartData {
  time: string;
  revenue: number;
  transactions: number;
}

// Names pool for random generation
const NAMES_POOL = [
  "Carlos J.",
  "Mariana T.",
  "Filipe N.",
  "Anabela S.",
  "Mateus L.",
  "Zaida G.",
  "Ibraimo A.",
  "Rosa P.",
  "Osvaldo M.",
  "Cláudio K.",
];

const METHODS_POOL: ("M-Pesa" | "eMola" | "Visa" | "Banze Pay")[] = [
  "M-Pesa",
  "eMola",
  "Visa",
  "Banze Pay",
];

export function RealTimeFinance() {
  const [totalRevenue, setTotalRevenue] = useState(1245890); // starts at MT 1,245,890
  const [todayRevenue, setTodayRevenue] = useState(48250); // starts at MT 48,250
  const [txCount, setTxCount] = useState(1337);
  const [showPulse, setShowPulse] = useState(false);

  // Initial historic chart data
  const [chartData, setChartData] = useState<ChartData[]>([
    { time: "10:50", revenue: 4200, transactions: 12 },
    { time: "10:52", revenue: 4800, transactions: 15 },
    { time: "10:54", revenue: 5100, transactions: 14 },
    { time: "10:56", revenue: 4700, transactions: 18 },
    { time: "10:58", revenue: 5900, transactions: 22 },
    { time: "11:00", revenue: 6400, transactions: 25 },
    { time: "11:02", revenue: 6200, transactions: 24 },
    { time: "11:04", revenue: 7100, transactions: 29 },
  ]);

  // Initial live feed of transactions
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      time: "11:04:12",
      method: "M-Pesa",
      amount: 450,
      user: "Delfina S.",
      status: "success",
    },
    {
      id: "2",
      time: "11:04:35",
      method: "Visa",
      amount: 2500,
      user: "Yuran B.",
      status: "success",
    },
    {
      id: "3",
      time: "11:04:48",
      method: "eMola",
      amount: 120,
      user: "Amílcar C.",
      status: "success",
    },
    {
      id: "4",
      time: "11:05:01",
      method: "Banze Pay",
      amount: 890,
      user: "Sónia M.",
      status: "success",
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Generate new transaction
      const randomName = NAMES_POOL[Math.floor(Math.random() * NAMES_POOL.length)];
      const randomMethod = METHODS_POOL[Math.floor(Math.random() * METHODS_POOL.length)];
      // M-Pesa/eMola tend to be smaller, Visa/Banze Pay larger
      let amount = 0;
      if (randomMethod === "M-Pesa" || randomMethod === "eMola") {
        amount = Math.floor(Math.random() * 450) + 50; // 50 to 500 MT
      } else {
        amount = Math.floor(Math.random() * 3500) + 500; // 500 to 4000 MT
      }

      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0]; // HH:MM:SS
      const shortTimeStr = timeStr.substring(0, 5); // HH:MM

      const newTx: Transaction = {
        id: Math.random().toString(),
        time: timeStr,
        method: randomMethod,
        amount,
        user: randomName,
        status: "success",
      };

      // 2. Update metrics state with micro-counter increase
      setTotalRevenue((prev) => prev + amount);
      setTodayRevenue((prev) => prev + amount);
      setTxCount((prev) => prev + 1);
      setShowPulse(true);
      setTimeout(() => setShowPulse(false), 800);

      // 3. Roll transactions list (keep max 5)
      setTransactions((prev) => [newTx, ...prev.slice(0, 4)]);

      // 4. Update chart details
      setChartData((prev) => {
        const lastElement = prev[prev.length - 1];
        // If same minute, accumulate, else append and shift
        if (lastElement && lastElement.time === shortTimeStr) {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...lastElement,
            revenue: lastElement.revenue + amount,
            transactions: lastElement.transactions + 1,
          };
          return updated;
        } else {
          const newPoint: ChartData = {
            time: shortTimeStr,
            revenue: Math.floor(Math.random() * 3000) + amount + 4000,
            transactions: Math.floor(Math.random() * 10) + 20,
          };
          // keep last 10 points
          const shifted = [...prev, newPoint];
          if (shifted.length > 10) {
            shifted.shift();
          }
          return shifted;
        }
      });
    }, 3800); // simulation interval matches general high-frequency transaction processing

    return () => clearInterval(interval);
  }, []);

  // Formatter for MT (Meticais) currency values
  const formatMT = (val: number) => {
    return new Intl.NumberFormat("pt-MZ", {
      style: "currency",
      currency: "MZN",
    })
      .format(val)
      .replace("MZN", "MT");
  };

  return (
    <div className="space-y-6">
      {/* Header section with status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Fluxo Financeiro em Tempo Real</h3>
            <p className="text-xs text-muted-foreground">
              Monitorização ao vivo das transações eletrónicas do ecossistema Banze
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
          <ShieldCheck className="h-4 w-4" />
          Gateway Banze Pay Operacional
        </div>
      </div>

      {/* Main Stats Panel Group */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Stat 1: Saldo total */}
        <div className="glass relative overflow-hidden rounded-2xl p-5 border border-white/5 bg-white/[0.01]">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">
              Receita Geral Acumulada
            </span>
            <Wallet className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="mt-4">
            <span className="text-xs text-muted-foreground block">
              Total de Vendas do Ecossistema
            </span>
            <motion.h4
              key={totalRevenue}
              initial={{ scale: 1 }}
              animate={showPulse ? { scale: [1, 1.05, 1], color: ["#fff", "#34d399", "#fff"] } : {}}
              transition={{ duration: 0.5 }}
              className="text-2xl font-black text-foreground mt-1 tracking-tight"
            >
              {formatMT(totalRevenue)}
            </motion.h4>
          </div>
          <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-emerald-500 to-teal-500" />
        </div>

        {/* Stat 2: Hoje */}
        <div className="glass relative overflow-hidden rounded-2xl p-5 border border-white/5 bg-white/[0.01]">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">
              Volume Diário (Hoje)
            </span>
            <TrendingUp className="h-5 w-5 text-emerald-400" />
          </div>
          <div className="mt-4">
            <span className="text-xs text-muted-foreground block">Processamento 24h</span>
            <motion.h4
              key={todayRevenue}
              initial={{ scale: 1 }}
              animate={showPulse ? { scale: [1, 1.05, 1], color: ["#fff", "#10b981", "#fff"] } : {}}
              transition={{ duration: 0.5 }}
              className="text-2xl font-black text-foreground mt-1 tracking-tight"
            >
              {formatMT(todayRevenue)}
            </motion.h4>
          </div>
          <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-emerald-400 to-green-500" />
        </div>

        {/* Stat 3: Total transações */}
        <div className="glass relative overflow-hidden rounded-2xl p-5 border border-white/5 bg-white/[0.01]">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">Contagem Global TX</span>
            <Activity className="h-5 w-5 text-green-400" />
          </div>
          <div className="mt-4">
            <span className="text-xs text-muted-foreground block">
              Ordens Liquidadas com Sucesso
            </span>
            <motion.h4
              key={txCount}
              initial={{ scale: 1 }}
              animate={showPulse ? { scale: [1, 1.05, 1], color: ["#fff", "#22c55e", "#fff"] } : {}}
              transition={{ duration: 0.5 }}
              className="text-2xl font-black text-foreground mt-1 tracking-tight"
            >
              {txCount.toLocaleString("pt-MZ")}
            </motion.h4>
          </div>
          <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-green-500 to-emerald-600" />
        </div>
      </div>

      {/* Grid: Graphic on left, Live Transation list on right */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recharts chart */}
        <div className="glass rounded-2xl p-6 border border-white/5 lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-foreground">Gráfico de Volume de Vendas</h4>
                <p className="text-xs text-muted-foreground">
                  Montante médio de transações em intervalos de 2 minutos
                </p>
              </div>
              <div className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 rounded px-2 py-0.5 uppercase tracking-wider">
                Automático (Live)
              </div>
            </div>

            {/* Performance Graphic */}
            <div className="h-64 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                  <XAxis
                    dataKey="time"
                    stroke="#ffffff40"
                    style={{ fontSize: "10px", fontFamily: "JetBrains Mono" }}
                  />
                  <YAxis
                    stroke="#ffffff40"
                    style={{ fontSize: "10px", fontFamily: "JetBrains Mono" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0d0e12",
                      borderColor: "#ffffff15",
                      borderRadius: "12px",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                    labelStyle={{ color: "#888" }}
                    itemStyle={{ color: "#34d399", fontWeight: "bold" }}
                    formatter={(value: string | number) => [`${formatMT(Number(value))}`, "Volume"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5 text-[10px] tracking-wider font-mono">
              <AlertCircle className="h-3.5 w-3.5 text-emerald-400" />
              Sincronizado via WebSockets e Banze Intertech APIs
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider bg-white/[0.05] rounded px-2 py-0.5">
              Latência: 14ms
            </span>
          </div>
        </div>

        {/* Live Transaction Ticker on the right */}
        <div className="glass rounded-2xl p-6 border border-white/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-foreground">Atividade Concorrente</h4>
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-neon"></span>
            </div>

            <div className="space-y-3 max-h-[290px] overflow-hidden">
              <AnimatePresence mode="popLayout">
                {transactions.map((t, idx) => (
                  <motion.div
                    key={t.id}
                    layout
                    initial={{ opacity: 0, x: 20, y: -10 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className="flex items-center justify-between rounded-xl bg-white/[0.02] p-3 border border-white/[0.04] transition hover:bg-white/[0.05]"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white font-bold text-xs ${
                          t.method === "M-Pesa"
                            ? "bg-red-500 shadow-red-500/10"
                            : t.method === "eMola"
                              ? "bg-yellow-500 text-black shadow-yellow-500/10"
                              : t.method === "Visa"
                                ? "bg-blue-600 shadow-blue-500/10"
                                : "bg-gradient-neon shadow-neon"
                        }`}
                      >
                        {t.method.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-foreground">{t.user}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {t.method} • {t.time}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-emerald-400">+{t.amount} MT</p>
                      <span className="text-[8px] uppercase tracking-widest text-emerald-500 font-semibold bg-emerald-500/10 rounded px-1.5 py-0.2">
                        OK
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="border-t border-white/5 pt-3 mt-4 flex items-center justify-between text-[10px] text-muted-foreground">
            <span>Fuso Horário: Maputo (GMT+2)</span>
            <span className="text-gradient">Auditado</span>
          </div>
        </div>
      </div>
    </div>
  );
}
