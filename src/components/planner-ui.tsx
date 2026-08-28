import type { ReactNode } from "react";

export function Panel({
  children,
  className = "",
  tone = "card",
}: {
  children: ReactNode;
  className?: string;
  tone?: "card" | "ink";
}) {
  const base =
    tone === "ink"
      ? "bg-ink text-ink-foreground ring-1 ring-border"
      : "bg-card text-card-foreground ring-1 ring-border";
  return <div className={`rounded-[16px] ${base} ${className}`}>{children}</div>;
}

export function PageHeader({
  eyebrow,
  title,
  intro,
  action,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="label-caps">{eyebrow}</p>
        <h1 className="mt-2 font-serif text-4xl leading-tight lg:text-5xl">{title}</h1>
        {intro ? <p className="mt-3 max-w-[56ch] text-sm text-muted-foreground">{intro}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function StatusPill({ status }: { status: "done" | "active" | "upcoming" }) {
  const map = {
    done: "bg-primary/10 text-primary",
    active: "bg-accent/10 text-accent",
    upcoming: "bg-muted text-muted-foreground",
  } as const;
  const label = { done: "COMPLETED", active: "ACTIVE", upcoming: "UPCOMING" }[status];
  return (
    <span className={`rounded-full px-3 py-1 text-[10px] font-semibold ${map[status]}`}>{label}</span>
  );
}

export function PriorityPill({ priority }: { priority: "high" | "medium" | "low" }) {
  const map = {
    high: "bg-accent/10 text-accent",
    medium: "bg-primary/10 text-primary",
    low: "bg-muted text-muted-foreground",
  } as const;
  return (
    <span className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase ${map[priority]}`}>
      {priority}
    </span>
  );
}

export function Bar({ value, tone = "primary" }: { value: number; tone?: "primary" | "accent" }) {
  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
      <div
        className={`h-full rounded-full transition-[width] duration-700 ${
          tone === "accent" ? "bg-accent" : "bg-primary"
        }`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function Ring({
  value,
  label,
  size = 128,
}: {
  value: number;
  label: string;
  size?: number;
}) {
  const r = 44;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="size-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--color-muted)" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * Math.min(100, Math.max(0, value))) / 100}
          className="transition-[stroke-dashoffset] duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-serif text-2xl">{Math.round(value)}%</span>
        <span className="label-caps">{label}</span>
      </div>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="label-caps">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg bg-background px-3 py-2 text-sm ring-1 ring-input outline-none transition-shadow placeholder:text-subtle focus:ring-2 focus:ring-ring";

export function Button({
  children,
  variant = "primary",
  className = "",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ink" | "quiet" | "onInk";
}) {
  const map = {
    primary: "bg-primary text-primary-foreground ring-1 ring-primary hover:-translate-y-px",
    ink: "bg-ink text-ink-foreground ring-1 ring-ink hover:-translate-y-px",
    quiet: "bg-card text-foreground ring-1 ring-border hover:-translate-y-px",
    onInk: "bg-ink-foreground/10 text-ink-foreground ring-1 ring-ink-foreground/20 hover:bg-ink-foreground/20",
  } as const;
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all ${map[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Checkbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onChange}
      className={`size-4 shrink-0 rounded-sm ring-1 transition-colors ${
        checked ? "bg-primary ring-primary" : "bg-transparent ring-input hover:ring-primary"
      }`}
    />
  );
}

export function EmptyNote({ children }: { children: ReactNode }) {
  return <p className="py-6 text-center text-sm text-muted-foreground">{children}</p>;
}
