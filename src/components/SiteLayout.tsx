import { useState, useEffect, ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { GameCenter } from "./GameCenter";

export function SiteLayout({ children }: { children: ReactNode }) {
  const [arcadeOpen, setArcadeOpen] = useState(false);
  const [initialGame, setInitialGame] = useState("mines");

  useEffect(() => {
    const handleOpenArcade = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.game) {
        setInitialGame(customEvent.detail.game);
      } else {
        setInitialGame("mines");
      }
      setArcadeOpen(true);
    };

    window.addEventListener("open-banze-arcade", handleOpenArcade);
    return () => {
      window.removeEventListener("open-banze-arcade", handleOpenArcade);
    };
  }, []);

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 grid-bg opacity-40" />
      <Navbar />
      <main className="relative pt-28">{children}</main>
      <Footer />

      {/* Playable Game Center Overlay */}
      <GameCenter
        isOpen={arcadeOpen}
        onClose={() => setArcadeOpen(false)}
        initialGameId={initialGame}
      />
    </div>
  );
}
