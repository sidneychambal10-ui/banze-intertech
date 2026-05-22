import logo from "@/assets/banze-logo.png";

export function Logo({ size = 36, withText = true }: { size?: number; withText?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <img
        src={logo}
        alt="Banze Intertech"
        width={size}
        height={size}
        className="rounded-md object-contain transition-all duration-300 hover:scale-105"
        style={{
          width: size,
          height: size,
          filter: "hue-rotate(207deg) brightness(1.1) drop-shadow(0 0 6px rgb(34, 197, 94))",
        }}
      />
      {withText && (
        <span className="font-display text-sm font-bold tracking-[0.18em] text-foreground">
          BANZE<span className="text-gradient"> INTERTECH</span>
        </span>
      )}
    </div>
  );
}
