import { createFileRoute, Link } from "@tanstack/react-router";

import { Bar, Checkbox, PageHeader, Panel, Ring, StatusPill } from "@/components/planner-ui";
import {
  dailyProgress,
  daysLeft,
  examReadiness,
  focusMinutes,
  formatDate,
  reminders,
  todayHours,
  usePlanner,
} from "@/lib/planner-store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Arcane Study Planner" },
      {
        name: "description",
        content:
          "Today's tasks, pending assignments, upcoming exams, study hours, streak and progress at a glance.",
      },
      { property: "og:title", content: "Dashboard — Arcane Study Planner" },
      {
        property: "og:description",
        content: "Your study day in one calm command center.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { state, toggleTask } = usePlanner();
  const done = state.tasks.filter((t) => t.done).length;
  const pending = state.tasks.length - done;
  const totalHours = Math.round((focusMinutes(state.sessions) / 60) * 10) / 10;
  const exams = state.exams.slice().sort((a, b) => +new Date(a.date) - +new Date(b.date));

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <PageHeader
        eyebrow={new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })}
        title={`Good day, ${state.profile.name.split(" ")[0]}`}
        intro={`You have ${pending} open tasks and ${exams.length} exams on the horizon.`}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Tasks completed", value: `${done}/${state.tasks.length}` },
          { label: "Pending assignments", value: String(pending) },
          { label: "Total study hours", value: `${totalHours}h` },
          { label: "Current streak", value: `${state.streak} days` },
        ].map((s) => (
          <Panel key={s.label} className="p-5">
            <p className="label-caps">{s.label}</p>
            <p className="mt-3 font-serif text-3xl">{s.value}</p>
          </Panel>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <Panel className="p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-serif text-2xl">Today's tasks</h2>
              <Link to="/tasks" className="label-caps hover:text-foreground">
                Manage
              </Link>
            </div>
            <div className="space-y-4">
              {state.tasks.map((t) => (
                <div key={t.id} className="flex items-center gap-3 border-b border-border pb-4 last:border-0 last:pb-0">
                  <Checkbox checked={t.done} onChange={() => toggleTask(t.id)} />
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm ${t.done ? "text-muted-foreground line-through" : "font-medium"}`}>
                      {t.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t.subject} • {t.type} • due {formatDate(t.due)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="p-8">
            <h2 className="mb-6 font-serif text-2xl">Today's schedule</h2>
            <div className="space-y-4">
              {state.slots.slice(0, 4).map((slot) => (
                <div key={slot.id} className="grid grid-cols-[100px_1fr] items-center gap-4 border-b border-border pb-4 last:border-0 last:pb-0">
                  <span className="text-sm font-medium text-muted-foreground">{slot.time}</span>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">{slot.subject}</p>
                      <p className="text-xs text-muted-foreground">{slot.activity}</p>
                    </div>
                    <StatusPill status={slot.status} />
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-6 lg:col-span-4">
          <Panel className="p-6">
            <h3 className="mb-6 text-sm font-medium">Daily progress</h3>
            <div className="flex justify-center py-2">
              <Ring value={dailyProgress(state)} label="Goal" />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-6">
              <div className="text-center">
                <p className="text-lg font-medium">{todayHours(state.sessions)}h</p>
                <p className="label-caps">Today</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-medium">{state.sessions.length}</p>
                <p className="label-caps">Sessions</p>
              </div>
            </div>
          </Panel>

          <Panel className="p-6">
            <h3 className="mb-4 text-sm font-medium">Upcoming exams</h3>
            <div className="space-y-5">
              {exams.map((e) => (
                <div key={e.id} className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">{e.subject}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(e.date)} • {daysLeft(e.date)} days left
                      </p>
                    </div>
                    <p className="text-sm font-medium text-accent">{examReadiness(e)}%</p>
                  </div>
                  <Bar value={examReadiness(e)} tone="accent" />
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="p-6">
            <h3 className="mb-4 text-sm font-medium">Reminders</h3>
            <ul className="space-y-3 text-sm">
              {reminders(state).map((r) => (
                <li key={r.id} className="flex gap-2.5">
                  <span
                    className={`mt-1.5 size-1.5 shrink-0 rounded-full ${
                      r.tone === "primary" ? "bg-primary" : r.tone === "accent" ? "bg-accent" : "bg-subtle"
                    }`}
                  />
                  <span className="text-muted-foreground">{r.text}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
