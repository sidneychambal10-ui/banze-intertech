import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Volume2,
  VolumeX,
  Coins,
  Shield,
  Play,
  RotateCcw,
  Sparkles,
  Trophy,
  ArrowRight,
  Gamepad2,
  Info,
  Layers,
  Star,
} from "lucide-react";

// Web Audio API Synthesizer Helper for Retro and Neon Sound Effects
class GameAudio {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  constructor() {
    // Lazy initialized on first user interaction
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        (
          window as unknown as {
            webkitAudioContext?: typeof AudioContext;
          }
        ).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  // Safe wrapper for play sounds
  public playSound(
    type: "click" | "gem" | "explosion" | "cashout" | "spin" | "win" | "puzzlePlace",
  ) {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      switch (type) {
        case "click": {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(600, now);
          osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.06);
          break;
        }
        case "gem": {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(880, now); // A5
          osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.3);
          break;
        }
        case "explosion": {
          // Noise / Sweep explosion
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(300, now);
          osc.frequency.linearRampToValueAtTime(40, now + 0.4);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.5);
          break;
        }
        case "cashout": {
          // Catchy arpeggio
          const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
          notes.forEach((freq, idx) => {
            if (!this.ctx) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = "square";
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);
            gain.gain.setValueAtTime(0.06, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.15);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.15);
          });
          break;
        }
        case "spin": {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(120, now);
          osc.frequency.linearRampToValueAtTime(400, now + 0.3);
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.3);
          break;
        }
        case "win": {
          // Big fanfare sound
          const notes = [587.33, 739.99, 880.0, 1174.66, 1479.98]; // D5, F#5, A5, D6, F#6
          notes.forEach((freq, idx) => {
            if (!this.ctx) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, now + idx * 0.06);
            gain.gain.setValueAtTime(0.1, now + idx * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.3);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.06);
            osc.stop(now + idx * 0.06 + 0.3);
          });
          break;
        }
        case "puzzlePlace": {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.setValueAtTime(554, now + 0.05);
          gain.gain.setValueAtTime(0.07, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.15);
          break;
        }
      }
    } catch (e) {
      console.warn("Audio Context block or error", e);
    }
  }
}

const soundManager = new GameAudio();

// List of Slot Symbols
const SLOT_SYMBOLS = [
  { char: "🥥", label: "Coqueiro", color: "text-emerald-400", pay: 2 },
  { char: "🛡️", label: "Escudo", color: "text-indigo-400", pay: 3 },
  { char: "🚗", label: "Chapa", color: "text-amber-400", pay: 5 },
  { char: "💎", label: "Brilhante", color: "text-cyan-400", pay: 8 },
  { char: "🦁", label: "Leão", color: "text-red-400", pay: 12 },
  { char: "🌟", label: "Estrela BANZE", color: "text-fuchsia-400", pay: 20 },
];

interface GameCenterProps {
  isOpen: boolean;
  onClose: () => void;
  initialGameId?: string;
}

export function GameCenter({ isOpen, onClose, initialGameId = "mines" }: GameCenterProps) {
  const [activeTab, setActiveTab] = useState<"mines" | "slot" | "puzzle">(
    (initialGameId === "slot" || initialGameId === "puzzle" ? initialGameId : "mines") as
      | "mines"
      | "slot"
      | "puzzle",
  );
  const [soundOn, setSoundOn] = useState(true);
  const [balance, setBalance] = useState<number>(10000); // 10,000 MT

  // Load / Save Balance
  useEffect(() => {
    const saved = localStorage.getItem("banze_arcade_balance");
    if (saved) {
      setBalance(Number(saved));
    } else {
      localStorage.setItem("banze_arcade_balance", "10000");
    }
  }, []);

  const updateBalance = (newVal: number) => {
    setBalance(newVal);
    localStorage.setItem("banze_arcade_balance", String(newVal));
  };

  const handleToggleSound = () => {
    const newVal = !soundOn;
    setSoundOn(newVal);
    soundManager.enabled = newVal;
    soundManager.playSound("click");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md"
        />

        {/* Modal Applet */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          className="relative flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-neutral-900 shadow-2xl shadow-emerald-500/5 sm:h-[80vh] md:h-[750px]"
        >
          {/* Neon Top Bar Glow */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-fuchsia-500 opacity-80" />

          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-white/5 bg-neutral-950/50 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
                <Gamepad2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-black tracking-tight text-white">BANZE Arcade</h2>
                <p className="text-xs text-neutral-400">
                  Entretenimento interactivo do ecossistema BANZE
                </p>
              </div>
            </div>

            {/* Dashboard indicators */}
            <div className="flex items-center gap-4">
              {/* Wallet balance */}
              <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-400">
                <Coins className="h-4 w-4" />
                <span>{balance.toLocaleString()} MT</span>
              </div>

              {/* Sound Toggle */}
              <button
                onClick={handleToggleSound}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/5 bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white transition"
                title={soundOn ? "Desativar Som" : "Ativar Som"}
              >
                {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-neutral-400 hover:bg-neutral-800 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tab Panel */}
          <div className="flex shrink-0 gap-1 border-b border-white/5 bg-neutral-950/20 px-4 py-2">
            <button
              onClick={() => {
                setActiveTab("mines");
                soundManager.playSound("click");
              }}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeTab === "mines"
                  ? "bg-gradient-neon text-white shadow-neon"
                  : "text-neutral-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              💣 BANZE Mines
            </button>
            <button
              onClick={() => {
                setActiveTab("slot");
                soundManager.playSound("click");
              }}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeTab === "slot"
                  ? "bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white shadow-lg"
                  : "text-neutral-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              🎰 BANZE Slot
            </button>
            <button
              onClick={() => {
                setActiveTab("puzzle");
                soundManager.playSound("click");
              }}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeTab === "puzzle"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg"
                  : "text-neutral-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              🧩 BANZE Slider
            </button>
          </div>

          {/* Game Canvas Container */}
          <div className="flex-1 overflow-y-auto bg-neutral-900/60 p-6">
            <AnimatePresence mode="wait">
              {activeTab === "mines" && (
                <MinesGame balance={balance} updateBalance={updateBalance} />
              )}
              {activeTab === "slot" && <SlotGame balance={balance} updateBalance={updateBalance} />}
              {activeTab === "puzzle" && <SliderPuzzleGame />}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// ==========================================
// 💣 GAME 1: BANZE MINES (CASH DIGITAL)
// ==========================================
function MinesGame({
  balance,
  updateBalance,
}: {
  balance: number;
  updateBalance: (v: number) => void;
}) {
  const [mineCount, setMineCount] = useState<number>(3);
  const [bet, setBet] = useState<number>(100);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [board, setBoard] = useState<
    Array<{ id: number; isOpen: boolean; status: "safe" | "mine" | "hidden" }>
  >([]);
  const [minesIndexes, setMinesIndexes] = useState<Set<number>>(new Set());
  const [payout, setPayout] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [gameResult, setGameResult] = useState<"won" | "lost" | null>(null);
  const [clickedCount, setClickedCount] = useState<number>(0);

  // Auto-init board
  useEffect(() => {
    resetBoard();
  }, []);

  const resetBoard = () => {
    const newBoard = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      isOpen: false,
      status: "hidden" as const,
    }));
    setBoard(newBoard);
    setIsGameOver(false);
    setGameResult(null);
    setClickedCount(0);
    setPayout(0);
  };

  // Safe Multiplier Calculator using combinatorial formula matching classic Mines
  const getNextMultiplier = (mines: number, currentReveals: number) => {
    let mult = 1.0;
    for (let i = 0; i < currentReveals; i++) {
      const remainingTotal = 25 - i;
      const remainingSafe = remainingTotal - mines;
      if (remainingSafe <= 0) break;
      mult *= remainingTotal / remainingSafe;
    }
    // Boost slightly and apply 1% house edge
    return Number((mult * 0.99).toFixed(2));
  };

  const handleStartGame = () => {
    if (bet <= 0 || bet > balance) {
      alert("Saldo insuficiente ou aposta inválida!");
      return;
    }
    soundManager.playSound("click");
    updateBalance(balance - bet);
    setIsPlaying(true);
    resetBoard();

    // Generate random mines coordinates
    const indexesSet = new Set<number>();
    while (indexesSet.size < mineCount) {
      indexesSet.add(Math.floor(Math.random() * 25));
    }
    setMinesIndexes(indexesSet);
  };

  const handleTileClick = (index: number) => {
    if (!isPlaying || isGameOver || board[index].isOpen) return;

    const newBoard = [...board];
    const isMine = minesIndexes.has(index);

    if (isMine) {
      // Hitting Mine!
      soundManager.playSound("explosion");
      newBoard[index] = { id: index, isOpen: true, status: "mine" };

      // Reveal all other mines
      minesIndexes.forEach((idx) => {
        newBoard[idx] = { id: idx, isOpen: true, status: "mine" };
      });
      // Set others as safe if already opened
      board.forEach((b, i) => {
        if (b.isOpen && !minesIndexes.has(i)) {
          newBoard[i] = { id: i, isOpen: true, status: "safe" };
        }
      });

      setBoard(newBoard);
      setIsGameOver(true);
      setIsPlaying(false);
      setGameResult("lost");
    } else {
      // Safe Gem found
      soundManager.playSound("gem");
      newBoard[index] = { id: index, isOpen: true, status: "safe" };
      const nextCount = clickedCount + 1;
      setClickedCount(nextCount);

      // Calculate new Multiplier
      const nextMult = getNextMultiplier(mineCount, nextCount);
      setPayout(Number((bet * nextMult).toFixed(2)));

      setBoard(newBoard);

      // Check force win if all safe parts are discovered
      const totalSafeSpots = 25 - mineCount;
      if (nextCount === totalSafeSpots) {
        handleCashout();
      }
    }
  };

  const handleCashout = () => {
    if (!isPlaying || isGameOver) return;
    soundManager.playSound("cashout");
    updateBalance(balance + payout);
    setIsPlaying(false);
    setIsGameOver(true);
    setGameResult("won");
  };

  const currentMult = getNextMultiplier(mineCount, clickedCount);
  const estimatedNextMult = getNextMultiplier(mineCount, clickedCount + 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="grid gap-6 lg:grid-cols-12"
    >
      {/* Settings Column */}
      <div className="flex flex-col gap-4 rounded-2xl bg-neutral-950/40 border border-white/5 p-5 lg:col-span-4">
        <div>
          <label className="text-xs font-semibold text-neutral-400 block mb-2">
            Quantia de Minas (1-24)
          </label>
          <div className="grid grid-cols-4 gap-1.5 bg-neutral-950 rounded-xl p-1 border border-white/5">
            {[3, 5, 10, 20].map((num) => (
              <button
                key={num}
                disabled={isPlaying}
                onClick={() => {
                  setMineCount(num);
                  soundManager.playSound("click");
                }}
                className={`py-1.5 rounded-lg text-xs font-bold transition ${
                  mineCount === num && !isPlaying
                    ? "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30"
                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          <input
            type="range"
            min={1}
            max={24}
            disabled={isPlaying}
            value={mineCount}
            onChange={(e) => {
              setMineCount(Number(e.target.value));
              soundManager.playSound("click");
            }}
            className="mt-3 w-full accent-emerald-500"
          />
          <div className="flex justify-between text-[10px] text-neutral-500 mt-1 font-mono">
            <span>1 Mina</span>
            <span className="text-emerald-400 font-bold">{mineCount} Minas</span>
            <span>24 Minas</span>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-neutral-400 block mb-2">Aposta (MT)</label>
          <div className="relative">
            <Coins className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400" />
            <input
              type="number"
              min={10}
              disabled={isPlaying}
              value={bet}
              onChange={(e) => setBet(Math.max(10, Number(e.target.value)))}
              className="w-full bg-neutral-950 rounded-xl border border-white/5 px-10 py-2.5 text-sm font-bold text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <div className="grid grid-cols-4 gap-1.5 mt-2">
            {["MIN", "2X", "/2", "MAX"].map((act) => (
              <button
                key={act}
                disabled={isPlaying}
                onClick={() => {
                  soundManager.playSound("click");
                  if (act === "MIN") setBet(10);
                  if (act === "2X") setBet((b) => Math.min(balance, b * 2));
                  if (act === "/2") setBet((b) => Math.max(10, Math.floor(b / 2)));
                  if (act === "MAX") setBet(balance);
                }}
                className="py-1 rounded-lg text-[10px] font-mono font-bold bg-white/5 text-neutral-400 border border-white/5 hover:text-white hover:bg-white/10 transition"
              >
                {act}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-2 space-y-2">
          {!isPlaying ? (
            <button
              onClick={handleStartGame}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-neon py-3.5 text-sm font-bold text-white shadow-neon cursor-pointer"
            >
              <Play className="h-4 w-4 fill-white" /> Iniciar Jogo
            </button>
          ) : (
            <button
              onClick={handleCashout}
              className="flex w-full flex-col items-center justify-center rounded-xl bg-amber-500 hover:bg-amber-400 py-2.5 text-black shadow-lg transition cursor-pointer font-black"
            >
              <span className="text-xs uppercase opacity-85">Retirar</span>
              <span className="text-sm">
                {payout.toLocaleString() || "0"} MT ({currentMult}x)
              </span>
            </button>
          )}

          {isGameOver && (
            <button
              onClick={() => {
                soundManager.playSound("click");
                resetBoard();
              }}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 py-2 text-xs font-semibold text-white transition"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Limpar Tabuleiro
            </button>
          )}
        </div>

        {/* Dashboard/Pay Info */}
        <div className="mt-auto border-t border-white/5 pt-4">
          <div className="flex justify-between items-center text-xs text-neutral-400 font-medium">
            <span>Próximo Multiplicador:</span>
            <span className="text-emerald-400 font-mono font-bold">{estimatedNextMult}x</span>
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-neutral-500">
            Cada diamante revelado aumenta o multiplicador. Se clicar numa bomba, perde! Pode
            retirar as suas moedas a qualquer momento.
          </p>
        </div>
      </div>

      {/* Grid Canvas Column */}
      <div className="flex flex-col items-center justify-center rounded-2xl bg-neutral-950/20 border border-white/5 p-6 lg:col-span-8">
        {/* Statistics or victory alert */}
        <div className="min-h-[40px] flex items-center justify-center w-full mb-4">
          {gameResult === "won" && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="px-6 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-black flex items-center gap-2"
            >
              <Trophy className="h-4 w-4 fill-emerald-400 text-emerald-400" />
              <span>
                Ganhou {payout.toLocaleString()} MT! (+{currentMult}x)
              </span>
            </motion.div>
          )}
          {gameResult === "lost" && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="px-6 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-black flex items-center gap-2"
            >
              <span>💥 Detonou uma bomba! Perdeu {bet} MT</span>
            </motion.div>
          )}
          {isPlaying && (
            <div className="text-xs font-semibold text-neutral-400 flex items-center gap-2 font-mono">
              <span>Multiplicador Actual:</span>
              <span className="text-emerald-400 font-black text-sm">{currentMult}x</span>
              <span className="text-neutral-500">({clickedCount} acertos)</span>
            </div>
          )}
          {!isPlaying && !isGameOver && (
            <div className="text-xs text-neutral-400 font-semibold flex items-center gap-2">
              <Info className="h-3.5 w-3.5 text-emerald-400" /> Escolha o valor da aposta e inicie
              para jogar!
            </div>
          )}
        </div>

        {/* 5x5 Grid */}
        <div className="grid grid-cols-5 gap-2.5 max-w-[340px] w-full aspect-square">
          {board.map((tile, idx) => {
            const isRevealedMine = tile.isOpen && tile.status === "mine";
            const isRevealedSafe = tile.isOpen && tile.status === "safe";

            return (
              <motion.button
                key={tile.id}
                whileHover={isPlaying && !tile.isOpen ? { scale: 1.05 } : {}}
                whileTap={isPlaying && !tile.isOpen ? { scale: 0.95 } : {}}
                onClick={() => handleTileClick(idx)}
                disabled={!isPlaying || tile.isOpen}
                className={`relative flex items-center justify-center rounded-xl font-bold cursor-pointer transition-colors ${
                  tile.isOpen
                    ? isRevealedMine
                      ? "bg-red-500/20 border border-red-500/50 shadow-lg shadow-red-500/10 text-red-400"
                      : "bg-emerald-500/20 border border-emerald-500/50 shadow-lg shadow-emerald-500/10 text-emerald-400"
                    : isPlaying
                      ? "bg-neutral-800 border border-white/5 hover:bg-neutral-700 hover:border-emerald-500/30"
                      : "bg-neutral-900 border border-white/5 cursor-not-allowed opacity-80"
                }`}
              >
                {/* Tile Content */}
                {tile.isOpen ? (
                  isRevealedMine ? (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-lg">
                      💥
                    </motion.span>
                  ) : (
                    <motion.div
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="flex flex-col items-center"
                    >
                      <Sparkles className="h-5 w-5 fill-emerald-400" />
                    </motion.div>
                  )
                ) : (
                  <div className="h-1.5 w-1.5 rounded-full bg-neutral-600 group-hover:bg-emerald-500/50" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// 🎰 GAME 2: BANZE SLOT (STREET JACKPOT)
// ==========================================
function SlotGame({
  balance,
  updateBalance,
}: {
  balance: number;
  updateBalance: (v: number) => void;
}) {
  const [bet, setBet] = useState<number>(100);
  const [reels, setReels] = useState<Array<number>>([0, 1, 2]);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [winStatus, setWinStatus] = useState<{ amount: number; message: string } | null>(null);

  const handleSpin = () => {
    if (bet <= 0 || bet > balance) {
      alert("Aposta inválida ou saldo insuficiente!");
      return;
    }
    soundManager.playSound("spin");
    setIsSpinning(true);
    setWinStatus(null);
    updateBalance(balance - bet);

    // Dynamic Interval spin simulation
    let count = 0;
    const interval = setInterval(() => {
      setReels([
        Math.floor(Math.random() * SLOT_SYMBOLS.length),
        Math.floor(Math.random() * SLOT_SYMBOLS.length),
        Math.floor(Math.random() * SLOT_SYMBOLS.length),
      ]);
      count++;
      if (count > 8) {
        clearInterval(interval);
        // Compute final reels result
        const fReels = [
          Math.floor(Math.random() * SLOT_SYMBOLS.length),
          Math.floor(Math.random() * SLOT_SYMBOLS.length),
          Math.floor(Math.random() * SLOT_SYMBOLS.length),
        ];
        setReels(fReels);

        // Check payouts formulas
        let wonAmount = 0;
        let msg = "";

        if (fReels[0] === fReels[1] && fReels[1] === fReels[2]) {
          // jackpot 3 matching
          const symbolObj = SLOT_SYMBOLS[fReels[0]];
          const mult = symbolObj.pay;
          wonAmount = bet * mult;
          msg = `🎈 JACKPOT! Triplo ${symbolObj.label} (${mult}x)`;
          soundManager.playSound("win");
        } else if (fReels[0] === fReels[1] || fReels[1] === fReels[2] || fReels[0] === fReels[2]) {
          // 2 matching
          const matchIdx = fReels[0] === fReels[1] ? fReels[0] : fReels[2];
          const symbolObj = SLOT_SYMBOLS[matchIdx];
          wonAmount = Math.floor(bet * 1.5);
          msg = `✨ Par de ${symbolObj.label}! (1.5x)`;
          soundManager.playSound("cashout");
        }

        if (wonAmount > 0) {
          updateBalance(balance - bet + wonAmount);
          setWinStatus({ amount: wonAmount, message: msg });
        } else {
          setWinStatus({ amount: 0, message: "Tente novamente!" });
        }
        setIsSpinning(false);
      }
    }, 120);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col items-center gap-6"
    >
      {/* Visual Reel Stage */}
      <div className="relative flex w-full max-w-lg flex-col items-center rounded-2xl bg-gradient-to-br from-neutral-950 to-neutral-900 border border-white/10 p-6 shadow-2xl">
        <div className="absolute top-4 left-4 text-[10px] font-mono tracking-widest text-fuchsia-400 font-bold">
          🎰 BANZE STREET SLOT
        </div>

        {/* Reels grid */}
        <div className="grid grid-cols-3 gap-4 w-full bg-neutral-950 rounded-2xl p-6 border-2 border-fuchsia-500/20 shadow-inner mt-6">
          {reels.map((index, i) => {
            const sym = SLOT_SYMBOLS[index];
            return (
              <div
                key={i}
                className="flex flex-col items-center justify-center p-6 h-36 rounded-xl bg-neutral-900/80 border border-white/5 shadow-md relative overflow-hidden"
              >
                {/* Reel wire lights */}
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-fuchsia-500/40 to-transparent" />
                <motion.span
                  key={`${index}-${i}`}
                  initial={{ y: -30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-5xl"
                >
                  {sym?.char || "🥥"}
                </motion.span>
                <span
                  className={`text-[10px] mt-2 font-black uppercase tracking-wider ${sym?.color || "text-emerald-400"}`}
                >
                  {sym?.label || "Coqueiro"}
                </span>
                <span className="text-[9px] text-neutral-500 font-mono mt-0.5">
                  Payout: {sym?.pay}x
                </span>
              </div>
            );
          })}
        </div>

        {/* Win/Loss alert bar */}
        <div className="h-12 flex items-center justify-center mt-4 w-full">
          {winStatus && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`text-center font-bold px-4 py-2 rounded-xl text-sm ${
                winStatus.amount > 0
                  ? "bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400"
                  : "bg-white/5 border border-white/5 text-neutral-400"
              }`}
            >
              {winStatus.message}
            </motion.div>
          )}
        </div>
      </div>

      {/* Control Actions & Info */}
      <div className="w-full max-w-lg grid gap-4 md:grid-cols-12 rounded-2xl bg-neutral-950/40 border border-white/5 p-5">
        <div className="md:col-span-6 flex flex-col justify-center">
          <label className="text-xs font-semibold text-neutral-400 block mb-1.5">Aposta (MT)</label>
          <div className="relative">
            <Coins className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-fuchsia-400" />
            <input
              type="number"
              min={10}
              disabled={isSpinning}
              value={bet}
              onChange={(e) => setBet(Math.max(10, Number(e.target.value)))}
              className="w-full bg-neutral-950 rounded-xl border border-white/5 px-10 py-2.5 text-sm font-bold text-white focus:outline-none focus:ring-1 focus:ring-fuchsia-500"
            />
          </div>
        </div>

        <div className="md:col-span-6 flex items-end">
          <button
            disabled={isSpinning}
            onClick={handleSpin}
            className={`w-full py-3.5 rounded-xl text-sm font-black uppercase tracking-wider text-white select-none transition cursor-pointer ${
              isSpinning
                ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                : "bg-gradient-to-r from-fuchsia-500 to-violet-600 shadow-lg shadow-fuchsia-500/20 active:scale-95 hover:brightness-110"
            }`}
          >
            {isSpinning ? "Girando..." : "Rodar Canal!"}
          </button>
        </div>
      </div>

      {/* Paytable info */}
      <div className="w-full max-w-lg rounded-xl bg-white/5 border border-white/5 p-4 flex flex-col">
        <span className="text-xs font-bold text-neutral-300 flex items-center gap-1">
          <Info className="h-3.5 w-3.5 text-fuchsia-400" /> Tabela de Pagamentos (Par / Trio)
        </span>
        <div className="grid grid-cols-3 gap-2 mt-3 text-[11px] text-neutral-400 font-mono">
          {SLOT_SYMBOLS.map((s) => (
            <div key={s.char} className="flex justify-between border-b border-white/5 pb-1">
              <span>
                {s.char} {s.label}
              </span>
              <span className="text-fuchsia-400 font-bold">{s.pay}x</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// 🧩 GAME 3: BANZE SLIDER PUZZLE
// ==========================================
function SliderPuzzleGame() {
  // 3x3 array format representing tile indices. 8 empty is -1.
  const [tiles, setTiles] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 0]);
  const [moves, setMoves] = useState<number>(0);
  const [isWon, setIsWon] = useState<boolean>(false);

  useEffect(() => {
    shuffle();
  }, []);

  const shuffle = () => {
    soundManager.playSound("click");
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 0];

    // Perform simulated random moves to guarantee solvability
    for (let k = 0; k < 80; k++) {
      const blankIndex = arr.indexOf(0);
      const row = Math.floor(blankIndex / 3);
      const col = blankIndex % 3;

      const validIndices: number[] = [];
      if (row > 0) validIndices.push(blankIndex - 3); // top
      if (row < 2) validIndices.push(blankIndex + 3); // bottom
      if (col > 0) validIndices.push(blankIndex - 1); // left
      if (col < 2) validIndices.push(blankIndex + 1); // right

      const randomTarget = validIndices[Math.floor(Math.random() * validIndices.length)];
      arr[blankIndex] = arr[randomTarget];
      arr[randomTarget] = 0;
    }

    setTiles(arr);
    setMoves(0);
    setIsWon(false);
  };

  const handleBlockClick = (index: number) => {
    if (isWon) return;

    const blankIndex = tiles.indexOf(0);
    const tileRow = Math.floor(index / 3);
    const tileCol = index % 3;
    const blankRow = Math.floor(blankIndex / 3);
    const blankCol = blankIndex % 3;

    // Check adjacent condition
    const dist = Math.abs(tileRow - blankRow) + Math.abs(tileCol - blankCol);
    if (dist === 1) {
      soundManager.playSound("puzzlePlace");
      const nextTiles = [...tiles];
      nextTiles[blankIndex] = tiles[index];
      nextTiles[index] = 0;
      setTiles(nextTiles);
      setMoves((m) => m + 1);

      // Verify Win condition
      const isSolved = nextTiles.every((val, idx) => {
        if (idx === nextTiles.length - 1) return val === 0;
        return val === idx + 1;
      });

      if (isSolved) {
        setIsWon(true);
        soundManager.playSound("win");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col items-center gap-6"
    >
      <div className="text-center">
        <h3 className="text-base font-black text-white">Desafio Deslizante BANZE</h3>
        <p className="text-xs text-neutral-400 mt-1 max-w-sm">
          Coloque os blocos numéricos em ordem crescente (1 a 8) movendo-os para o espaço vazio.
        </p>
      </div>

      {/* Grid wrapper */}
      <div className="relative rounded-2xl bg-neutral-950/80 border border-white/10 p-4 shadow-xl max-w-[320px] w-full">
        <div className="grid grid-cols-3 gap-2 aspect-square">
          {tiles.map((num, idx) => {
            const isEmpty = num === 0;
            return (
              <button
                key={idx}
                onClick={() => handleBlockClick(idx)}
                className={`flex aspect-square items-center justify-center rounded-xl text-lg font-black transition-all border outline-none cursor-pointer ${
                  isEmpty
                    ? "bg-transparent border-transparent cursor-default"
                    : "bg-gradient-to-br from-neutral-800 to-neutral-900 text-white hover:brightness-115 border-white/5 active:scale-95"
                }`}
              >
                {!isEmpty && <span className="text-gradient font-black text-2xl">{num}</span>}
              </button>
            );
          })}
        </div>

        {isWon && (
          <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-6 text-center">
            <Trophy className="h-12 w-12 text-amber-400 animate-bounce mb-2" />
            <h4 className="text-lg font-black text-white">Excelente Trabalho!</h4>
            <p className="text-xs text-neutral-400 mt-1">Conseguiu em {moves} movimentos.</p>
            <button
              onClick={shuffle}
              className="mt-4 px-4 py-2 bg-gradient-neon text-white text-xs font-bold rounded-xl shadow-neon cursor-pointer"
            >
              Jogar Novamente
            </button>
          </div>
        )}
      </div>

      {/* Foot info & statistics panel */}
      <div className="flex w-full max-w-[320px] items-center justify-between bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-xs">
        <span className="text-neutral-400 font-medium">
          Movimentos: <b className="text-white font-mono font-bold">{moves}</b>
        </span>
        <button
          onClick={shuffle}
          className="text-cyan-400 font-bold hover:underline cursor-pointer flex items-center gap-1 text-[11px]"
        >
          <RotateCcw className="h-3 w-3" /> Embaralhar
        </button>
      </div>
    </motion.div>
  );
}
