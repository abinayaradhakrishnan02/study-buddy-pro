import { createFileRoute } from "@tanstack/react-router";

import { Bar, PageHeader, Panel, Ring } from "@/components/planner-ui";
import { DAYS, dailyProgress, examReadiness, focusMinutes, usePlanner } from "@/lib/planner-store";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Progress Tracker — Arcane" },
      {
        name: "description",
        content:
          "Subject-wise completion, weekly study hours, tasks completed, streaks and exam preparation percentages.",
      },
      { property: "og:title", content: "Progress Tracker — Arcane" },
      { property: "og:description", content: "See where your hours actually went." },
    ],
  }),
  component: Progress,
});

function Progress() {
  const { state } = usePlanner();
  const done = state.tasks.filter((t) => t.done).length;
  const maxDay = Math.max(...state.weeklyHours, 1);
  const maxSubject = Math.max(...state.subjectHours.map((s) => s.hours), 1);
  const weekTotal = Math.round(state.weeklyHours.reduce((a, b) => a + b, 0) * 10) / 10;

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <PageHeader
        eyebrow="Analytics"
        title="Progress Tracker"
        intro="Which subjects get your attention, how the week is stacking up, and how ready each exam is."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Panel className="p-8 lg:col-span-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-serif text-2xl">Weekly study hours</h2>
            <span className="label-caps">{weekTotal}h total</span>
          </div>
          <div className="flex h-52 items-end gap-4">
            {state.weeklyHours.map((h, i) => (
              <div key={DAYS[i]} className="flex flex-1 flex-col items-center gap-3">
                <span className="text-xs text-muted-foreground">{h}h</span>
                <div
                  className="w-full rounded-t-sm bg-primary transition-[height] duration-700"
                  style={{ height: `${(h / maxDay) * 100}%` }}
                />
                <span className="label-caps">{DAYS[i]}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="p-6 lg:col-span-4">
          <h2 className="mb-6 font-serif text-xl">Overall</h2>
          <div className="flex justify-center">
            <Ring value={dailyProgress(state)} label="Today" size={144} />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-6">
            <div className="text-center">
              <p className="text-lg font-medium">
                {done}/{state.tasks.length}
              </p>
              <p className="label-caps">Tasks done</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-medium">{state.streak}</p>
              <p className="label-caps">Day streak</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-medium">
                {Math.round((focusMinutes(state.sessions) / 60) * 10) / 10}h
              </p>
              <p className="label-caps">Focus time</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-medium">{state.profile.subjects.length}</p>
              <p className="label-caps">Subjects</p>
            </div>
          </div>
        </Panel>

        <Panel className="p-8 lg:col-span-6">
          <h2 className="mb-6 font-serif text-2xl">Time per subject</h2>
          <div className="space-y-5">
            {state.subjectHours.map((s) => (
              <div key={s.subject} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{s.subject}</span>
                  <span className="text-xs text-muted-foreground">{s.hours}h</span>
                </div>
                <Bar value={(s.hours / maxSubject) * 100} />
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="p-8 lg:col-span-6">
          <h2 className="mb-6 font-serif text-2xl">Exam preparation</h2>
          <div className="space-y-5">
            {state.exams.map((e) => (
              <div key={e.id} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{e.subject}</span>
                  <span className="text-xs text-muted-foreground">
                    {e.completed}/{e.chapters} • {examReadiness(e)}%
                  </span>
                </div>
                <Bar value={examReadiness(e)} tone="accent" />
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
