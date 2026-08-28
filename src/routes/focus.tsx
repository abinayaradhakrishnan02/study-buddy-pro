import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { Button, PageHeader, Panel } from "@/components/planner-ui";
import { focusMinutes, todayHours, usePlanner } from "@/lib/planner-store";

export const Route = createFileRoute("/focus")({
  head: () => ({
    meta: [
      { title: "Focus Timer — Arcane" },
      {
        name: "description",
        content: "A Pomodoro focus timer: 25 minutes of study, 5 minutes of break, with every session recorded.",
      },
      { property: "og:title", content: "Focus Timer — Arcane" },
      { property: "og:description", content: "25 on, 5 off. Deep work, counted." },
    ],
  }),
  component: Focus,
});

const STUDY = 25 * 60;
const BREAK = 5 * 60;

function Focus() {
  const { state, addSession } = usePlanner();
  const [mode, setMode] = useState<"study" | "break">("study");
  const [left, setLeft] = useState(STUDY);
  const [running, setRunning] = useState(false);
  const modeRef = useRef(mode);
  modeRef.current = mode;

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setLeft((prev) => {
        if (prev > 1) return prev - 1;
        if (modeRef.current === "study") {
          addSession(25);
          setMode("break");
          return BREAK;
        }
        setMode("study");
        return STUDY;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running, addSession]);

  const total = mode === "study" ? STUDY : BREAK;
  const pct = ((total - left) / total) * 100;
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  const r = 46;
  const c = 2 * Math.PI * r;

  const reset = () => {
    setRunning(false);
    setMode("study");
    setLeft(STUDY);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <PageHeader
        eyebrow="Pomodoro"
        title="Focus Timer"
        intro="Twenty-five minutes of undivided attention, then five to breathe. Completed sessions add to your study time."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Panel tone="ink" className="p-10 lg:col-span-7">
          <div className="flex flex-col items-center text-center">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-foreground/50">
              {mode === "study" ? "Study Session" : "Short Break"}
            </span>
            <div className="relative my-8 size-64">
              <svg viewBox="0 0 100 100" className="size-full -rotate-90">
                <circle cx="50" cy="50" r={r} fill="none" stroke="var(--color-ink-foreground)" strokeOpacity="0.12" strokeWidth="4" />
                <circle
                  cx="50"
                  cy="50"
                  r={r}
                  fill="none"
                  stroke={mode === "study" ? "var(--color-accent)" : "var(--color-primary)"}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={c}
                  strokeDashoffset={c - (c * pct) / 100}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif text-6xl">
                  {mm}:{ss}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="onInk" onClick={() => setRunning((v) => !v)}>
                <span className="size-2 rounded-full bg-ink-foreground" />
                {running ? "Pause" : "Start Session"}
              </Button>
              <Button variant="onInk" onClick={reset}>
                Reset
              </Button>
            </div>
            <p className="mt-6 text-xs text-ink-foreground/50">
              {state.sessions.length} sessions logged • {todayHours(state.sessions)}h today
            </p>
          </div>
        </Panel>

        <div className="space-y-6 lg:col-span-5">
          <Panel className="p-6">
            <h2 className="mb-4 font-serif text-xl">Session log</h2>
            <div className="space-y-3">
              {state.sessions
                .slice()
                .reverse()
                .slice(0, 8)
                .map((s) => (
                  <div key={s.id} className="flex items-center justify-between border-b border-border pb-3 text-sm last:border-0 last:pb-0">
                    <span>{s.minutes} min focus</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(s.at).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                ))}
            </div>
          </Panel>
          <Panel className="p-6">
            <p className="label-caps">Total focus time</p>
            <p className="mt-3 font-serif text-4xl">
              {Math.round((focusMinutes(state.sessions) / 60) * 10) / 10}h
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Across {state.sessions.length} recorded Pomodoro sessions.
            </p>
          </Panel>
        </div>
      </div>
    </div>
  );
}
