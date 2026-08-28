import { createFileRoute, Link } from "@tanstack/react-router";

import deskImg from "@/assets/desk.jpg";
import { Bar, Panel, Ring, StatusPill } from "@/components/planner-ui";
import {
  dailyProgress,
  daysLeft,
  examReadiness,
  todayHours,
  usePlanner,
} from "@/lib/planner-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Arcane Study Planner — Plan Smart. Study Better." },
      {
        name: "description",
        content:
          "A quiet study planner for students: timetable, assignments, exam prep, Pomodoro focus sessions and progress tracking in one place.",
      },
      { property: "og:title", content: "Arcane Study Planner" },
      {
        property: "og:description",
        content: "Plan Smart. Study Better. Achieve More.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { state } = usePlanner();
  const progress = dailyProgress(state);
  const hours = todayHours(state.sessions);
  const today = new Date().toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    weekday: "long",
  });
  const todaySlots = state.slots.slice(0, 3);
  const nextExam = state.exams
    .slice()
    .sort((a, b) => +new Date(a.date) - +new Date(b.date))[0];

  return (
    <>
      <section className="py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center text-center">
            <h1 className="max-w-[20ch] text-balance font-serif text-5xl leading-tight lg:text-7xl">
              Plan Smart. Study Better. Achieve More.
            </h1>
            <p className="mt-8 max-w-[48ch] text-pretty text-lg text-muted-foreground">
              A quiet space for academic mastery. Organize your curriculum, track focus sessions, and
              visualize your progress with a system built for deep work.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                to="/dashboard"
                className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-ink-foreground ring-1 ring-ink transition-transform hover:-translate-y-px"
              >
                Get Started
              </Link>
              <Link
                to="/timetable"
                className="rounded-full bg-card px-6 py-3 text-sm font-medium ring-1 ring-border transition-transform hover:-translate-y-px"
              >
                View timetable
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-8">
              <Panel className="p-8">
                <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
                  <h2 className="font-serif text-2xl">Today's Timetable</h2>
                  <span className="label-caps">{today}</span>
                </div>
                <div className="space-y-4">
                  {todaySlots.map((slot, i) => (
                    <div
                      key={slot.id}
                      className={`grid grid-cols-[100px_1fr] items-center gap-4 ${
                        i < todaySlots.length - 1 ? "border-b border-border pb-4" : ""
                      }`}
                    >
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

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Panel className="p-6">
                  <h3 className="mb-4 text-sm font-medium">Tasks</h3>
                  <div className="space-y-3">
                    {state.tasks.slice(0, 3).map((t) => (
                      <div key={t.id} className="flex items-center gap-3">
                        <span
                          className={`size-4 rounded-sm ring-1 ${
                            t.done ? "bg-primary ring-primary" : "ring-input"
                          }`}
                        />
                        <span
                          className={`text-sm ${t.done ? "text-muted-foreground line-through" : ""}`}
                        >
                          {t.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </Panel>
                <Panel className="p-6">
                  <h3 className="mb-4 text-sm font-medium">Upcoming Exams</h3>
                  {nextExam ? (
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium">{nextExam.subject}</p>
                          <p className="text-xs text-muted-foreground">
                            {nextExam.chapters} Chapters • {daysLeft(nextExam.date)} days left
                          </p>
                        </div>
                        <p className="text-sm font-medium text-accent">
                          {examReadiness(nextExam)}% Ready
                        </p>
                      </div>
                      <Bar value={examReadiness(nextExam)} tone="accent" />
                    </div>
                  ) : null}
                </Panel>
              </div>
            </div>

            <div className="space-y-6 lg:col-span-4">
              <Panel tone="ink" className="p-8">
                <div className="flex flex-col items-center text-center">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-foreground/50">
                    Focus Timer
                  </span>
                  <div className="my-8 font-serif text-6xl">25:00</div>
                  <Link
                    to="/focus"
                    className="inline-flex items-center gap-2 rounded-full bg-ink-foreground/10 py-2 pl-3 pr-4 text-sm font-medium text-ink-foreground ring-1 ring-ink-foreground/20 transition-colors hover:bg-ink-foreground/20"
                  >
                    <span className="size-2 rounded-full bg-ink-foreground" />
                    Start Session
                  </Link>
                </div>
              </Panel>

              <Panel className="p-6">
                <h3 className="mb-6 text-sm font-medium">Daily Progress</h3>
                <div className="flex items-center justify-center py-4">
                  <Ring value={progress} label="Goal" />
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-6">
                  <div className="text-center">
                    <p className="text-lg font-medium">{hours}h</p>
                    <p className="label-caps">Study Time</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-medium">{state.streak}</p>
                    <p className="label-caps">Day Streak</p>
                  </div>
                </div>
              </Panel>

              <Panel className="overflow-hidden">
                <img
                  src={deskImg}
                  alt="Tidy desk with a notebook and pencil"
                  width={800}
                  height={600}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
                <div className="p-4">
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    "The secret of getting ahead is getting started."
                  </p>
                </div>
              </Panel>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
