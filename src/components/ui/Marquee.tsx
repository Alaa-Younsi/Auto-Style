import { cn } from "@/lib/utils";

interface MarqueeProps {
  text: string;
  className?: string;
  speed?: "slow" | "normal";
}

export function Marquee({ text, className, speed = "normal" }: MarqueeProps) {
  const repeated = text.repeat(4);
  return (
    <div className={cn("overflow-hidden whitespace-nowrap py-3 bg-brand/90", className)}>
      <div
        className={cn(
          "inline-block",
          speed === "slow" ? "animate-[marquee_50s_linear_infinite]" : "animate-marquee"
        )}
      >
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-ink/90">
          {repeated}
        </span>
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-ink/90">
          {repeated}
        </span>
      </div>
    </div>
  );
}
