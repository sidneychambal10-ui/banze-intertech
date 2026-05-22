import { Link } from "@tanstack/react-router";
import { Github, Twitter, Instagram, Mail } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-border/60">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              O ecossistema futurista de tecnologia, jogos e pagamentos de Moçambique.
            </p>
            <div className="mt-5 flex gap-3">
              {[Twitter, Instagram, Github, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="glass rounded-lg p-2 text-muted-foreground transition hover:text-foreground hover:shadow-neon"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Ecossistema
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/games" className="text-foreground/80 hover:text-foreground">
                  Banze Games
                </Link>
              </li>
              <li>
                <Link to="/apps" className="text-foreground/80 hover:text-foreground">
                  Banze Apps
                </Link>
              </li>
              <li>
                <Link to="/catalogo" className="text-foreground/80 hover:text-foreground">
                  Catálogo
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Empresa
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/apresentacao" className="text-foreground/80 hover:text-foreground">
                  Apresentação
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-foreground/80 hover:text-foreground">
                  Portal Colaboradores
                </Link>
              </li>
              <li>
                <a
                  href="mailto:contacto@banze.co.mz"
                  className="text-foreground/80 hover:text-foreground"
                >
                  Contacto
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/50 pt-6 text-xs text-muted-foreground md:flex-row">
          <p>© 2025 BANZE INTERTECH. Todos os direitos reservados.</p>
          <p>Feito com tecnologia em Moçambique 🇲🇿</p>
        </div>
      </div>
    </footer>
  );
}
