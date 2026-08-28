import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Button, Field, PageHeader, Panel, inputClass } from "@/components/planner-ui";
import { focusMinutes, usePlanner } from "@/lib/planner-store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Arcane Study Planner" },
      {
        name: "description",
        content: "Your course, semester, subjects, study statistics and achievements, saved on this device.",
      },
      { property: "og:title", content: "Profile — Arcane Study Planner" },
      { property: "og:description", content: "Your study identity and statistics." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { state, setProfile, reset } = usePlanner();
  const [name, setName] = useState(state.profile.name);
  const [course, setCourse] = useState(state.profile.course);
  const [semester, setSemester] = useState(state.profile.semester);
  const [subjects, setSubjects] = useState(state.profile.subjects.join(", "));
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setName(state.profile.name);
    setCourse(state.profile.course);
    setSemester(state.profile.semester);
    setSubjects(state.profile.subjects.join(", "));
  }, [state.profile]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setProfile({
      name: name.trim().slice(0, 80),
      course: course.trim().slice(0, 80),
      semester: semester.trim().slice(0, 40),
      subjects: subjects
        .split(",")
        .map((s) => s.trim().slice(0, 40))
        .filter(Boolean)
        .slice(0, 20),
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  const hours = Math.round((focusMinutes(state.sessions) / 60) * 10) / 10;
  const achievements = [
    { label: `${state.streak}-day streak`, earned: state.streak >= 7 },
    { label: "10 focus sessions", earned: state.sessions.length >= 10 },
    { label: "First exam plan", earned: state.exams.length > 0 },
    { label: "All tasks cleared", earned: state.tasks.length > 0 && state.tasks.every((t) => t.done) },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <PageHeader
        eyebrow="Student"
        title="Profile"
        intro="Your details and everything the planner has recorded. Data is stored locally on this device."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Panel className="p-6 lg:col-span-5">
          <h2 className="mb-5 font-serif text-xl">Details</h2>
          <form onSubmit={submit} className="space-y-4">
            <Field label="Name">
              <input className={inputClass} value={name} maxLength={80} onChange={(e) => setName(e.target.value)} />
            </Field>
            <Field label="Course">
              <input className={inputClass} value={course} maxLength={80} onChange={(e) => setCourse(e.target.value)} />
            </Field>
            <Field label="Semester">
              <input
                className={inputClass}
                value={semester}
                maxLength={40}
                onChange={(e) => setSemester(e.target.value)}
              />
            </Field>
            <Field label="Subjects (comma separated)">
              <textarea
                className={`${inputClass} min-h-24 resize-y`}
                value={subjects}
                maxLength={400}
                onChange={(e) => setSubjects(e.target.value)}
              />
            </Field>
            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit">Save profile</Button>
              <Button type="button" variant="quiet" onClick={reset}>
                Reset planner data
              </Button>
              {saved ? <span className="label-caps text-primary">Saved</span> : null}
            </div>
          </form>
        </Panel>

        <div className="space-y-6 lg:col-span-7">
          <Panel className="p-8">
            <h2 className="font-serif text-2xl">{state.profile.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {state.profile.course} • {state.profile.semester}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {state.profile.subjects.map((s) => (
                <span key={s} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                  {s}
                </span>
              ))}
            </div>
          </Panel>

          <div className="grid grid-cols-2 gap-6">
            <Panel className="p-6">
              <p className="label-caps">Study hours</p>
              <p className="mt-3 font-serif text-3xl">{hours}h</p>
            </Panel>
            <Panel className="p-6">
              <p className="label-caps">Focus sessions</p>
              <p className="mt-3 font-serif text-3xl">{state.sessions.length}</p>
            </Panel>
            <Panel className="p-6">
              <p className="label-caps">Tasks completed</p>
              <p className="mt-3 font-serif text-3xl">{state.tasks.filter((t) => t.done).length}</p>
            </Panel>
            <Panel className="p-6">
              <p className="label-caps">Current streak</p>
              <p className="mt-3 font-serif text-3xl">{state.streak}</p>
            </Panel>
          </div>

          <Panel className="p-6">
            <h3 className="mb-4 text-sm font-medium">Achievements</h3>
            <div className="flex flex-wrap gap-2">
              {achievements.map((a) => (
                <span
                  key={a.label}
                  className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${
                    a.earned ? "bg-primary/10 text-primary ring-primary/20" : "text-muted-foreground ring-border"
                  }`}
                >
                  {a.label}
                </span>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
