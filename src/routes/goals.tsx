import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { Bar, Button, Checkbox, EmptyNote, Field, PageHeader, Panel, inputClass } from "@/components/planner-ui";
import { usePlanner } from "@/lib/planner-store";

export const Route = createFileRoute("/goals")({
  head: () => ({
    meta: [
      { title: "Study Goals — Arcane" },
      {
        name: "description",
        content: "Set daily and weekly study goals — hours per day, chapters per week, streaks — and watch them fill.",
      },
      { property: "og:title", content: "Study Goals — Arcane" },
      { property: "og:description", content: "Small commitments, tracked honestly." },
    ],
  }),
  component: Goals,
});

function Goals() {
  const { state, addGoal, toggleGoal, removeGoal, update } = usePlanner();
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("3");
  const [unit, setUnit] = useState("h");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = Number(target);
    if (!title.trim() || !Number.isFinite(t) || t <= 0 || t > 1000) return;
    addGoal({ title: title.trim().slice(0, 100), target: t, current: 0, unit: unit.slice(0, 8) || "h" });
    setTitle("");
  };

  const bump = (id: string, delta: number) =>
    update({
      goals: state.goals.map((g) =>
        g.id === id
          ? { ...g, current: Math.max(0, Math.min(g.target, Math.round((g.current + delta) * 10) / 10)) }
          : g,
      ),
    });

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <PageHeader
        eyebrow="Intentions"
        title="Goals"
        intro="Define what a good week looks like, then nudge each goal forward as you go."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Panel className="p-6 lg:col-span-4">
          <h2 className="mb-5 font-serif text-xl">New goal</h2>
          <form onSubmit={submit} className="space-y-4">
            <Field label="Goal">
              <input
                className={inputClass}
                value={title}
                maxLength={100}
                placeholder="Complete 5 chapters this week"
                onChange={(e) => setTitle(e.target.value)}
              />
            </Field>
            <Field label="Target">
              <input
                className={inputClass}
                value={target}
                inputMode="decimal"
                maxLength={6}
                onChange={(e) => setTarget(e.target.value)}
              />
            </Field>
            <Field label="Unit">
              <input
                className={inputClass}
                value={unit}
                maxLength={8}
                placeholder="h / ch / days"
                onChange={(e) => setUnit(e.target.value)}
              />
            </Field>
            <Button type="submit">Add goal</Button>
          </form>
        </Panel>

        <div className="space-y-6 lg:col-span-8">
          {state.goals.length === 0 ? (
            <Panel className="p-6">
              <EmptyNote>No goals yet — start with "Study 3 hours a day".</EmptyNote>
            </Panel>
          ) : (
            state.goals.map((g) => {
              const pct = Math.round((g.current / g.target) * 100);
              return (
                <Panel key={g.id} className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <Checkbox checked={g.done} onChange={() => toggleGoal(g.id)} />
                      <div>
                        <p className={`text-sm font-medium ${g.done ? "text-muted-foreground line-through" : ""}`}>
                          {g.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {g.current}
                          {g.unit} of {g.target}
                          {g.unit}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => bump(g.id, -0.5)} className="label-caps hover:text-foreground">
                        −
                      </button>
                      <button onClick={() => bump(g.id, 0.5)} className="label-caps hover:text-foreground">
                        +
                      </button>
                      <button onClick={() => removeGoal(g.id)} className="label-caps hover:text-accent">
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="mt-5 flex items-center gap-4">
                    <Bar value={pct} />
                    <span className="w-10 text-right text-xs font-medium text-muted-foreground">{pct}%</span>
                  </div>
                </Panel>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
