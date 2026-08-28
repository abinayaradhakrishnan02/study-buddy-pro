import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const links = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/timetable", label: "Timetable" },
  { to: "/tasks", label: "Tasks" },
  { to: "/goals", label: "Goals" },
  { to: "/focus", label: "Focus" },
  { to: "/progress", label: "Progress" },
  { to: "/exams", label: "Exams" },
  { to: "/profile", label: "Profile" },
] as const;

function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("arcane-theme");
    const isDark = stored === "dark";
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("arcane-theme", next ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to day mode" : "Switch to night mode"}
      className="rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground ring-1 ring-border transition-colors hover:text-foreground"
    >
      {dark ? "Day" : "Night"}
    </button>
  );
}

export function SiteNav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="size-6 rounded-sm bg-primary" />
            <span className="font-serif text-xl">Arcane</span>
          </Link>
          <div className="hidden gap-6 text-sm font-medium text-muted-foreground lg:flex">
            {links.slice(1).map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="transition-colors hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            to="/dashboard"
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-1 ring-primary transition-transform hover:-translate-y-px"
          >
            Get Started
          </Link>
        </div>
      </div>
      <div className="flex gap-4 overflow-x-auto border-t border-border px-6 py-2 text-xs font-medium text-muted-foreground lg:hidden">
        {links.slice(1).map((l) => (
          <Link key={l.to} to={l.to} activeProps={{ className: "text-foreground" }} className="whitespace-nowrap">
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <span className="size-4 rounded-sm bg-foreground" />
            <span className="font-serif text-lg">Arcane</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Arcane Academic Systems. Plan Smart. Study Better. Achieve More.
          </p>
          <div className="flex gap-6 text-sm font-medium text-muted-foreground">
            <Link to="/progress" className="transition-colors hover:text-foreground">
              Progress
            </Link>
            <Link to="/exams" className="transition-colors hover:text-foreground">
              Exams
            </Link>
            <Link to="/profile" className="transition-colors hover:text-foreground">
              Profile
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
