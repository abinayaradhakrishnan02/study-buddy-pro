import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import {
  Button,
  Checkbox,
  EmptyNote,
  Field,
  PageHeader,
  Panel,
  PriorityPill,
  inputClass,
} from "@/components/planner-ui";
import { formatDate, usePlanner, type Priority, type Task } from "@/lib/planner-store";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Tasks & Assignments — Arcane" },
      {
        name: "description",
        content:
          "Track assignments, homework, projects and notes with deadlines, priorities and completion status.",
      },
      { property: "og:title", content: "Tasks & Assignments — Arcane" },
      { property: "og:description", content: "Every deadline in one prioritized list." },
    ],
  }),
  component: Tasks,
});

const types: Task["type"][] = ["Assignment", "Homework", "Project", "Notes"];

function Tasks() {
  const { state, addTask, toggleTask, removeTask } = usePlanner();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [type, setType] = useState<Task["type"]>("Assignment");
  const [due, setDue] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [filter, setFilter] = useState<"all" | "open" | "done">("all");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || title.trim().length > 120) return;
    addTask({
      title: title.trim(),
      subject: subject.trim().slice(0, 60) || "General",
      type,
      due: due || new Date().toISOString().slice(0, 10),
      priority,
    });
    setTitle("");
    setSubject("");
    setDue("");
  };

  const visible = state.tasks.filter((t) =>
    filter === "all" ? true : filter === "done" ? t.done : !t.done,
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <PageHeader
        eyebrow="Task manager"
        title="Tasks & Assignments"
        intro="Capture every submission with its deadline and priority, then clear them one by one."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Panel className="p-6 lg:col-span-4">
          <h2 className="mb-5 font-serif text-xl">New task</h2>
          <form onSubmit={submit} className="space-y-4">
            <Field label="Title">
              <input
                className={inputClass}
                value={title}
                maxLength={120}
                placeholder="Submit Physics lab report"
                onChange={(e) => setTitle(e.target.value)}
              />
            </Field>
            <Field label="Subject">
              <input
                className={inputClass}
                value={subject}
                maxLength={60}
                placeholder="Statistics"
                onChange={(e) => setSubject(e.target.value)}
              />
            </Field>
            <Field label="Type">
              <select value={type} onChange={(e) => setType(e.target.value as Task["type"])} className={inputClass}>
                {types.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Field>
            <Field label="Deadline">
              <input type="date" className={inputClass} value={due} onChange={(e) => setDue(e.target.value)} />
            </Field>
            <Field label="Priority">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className={inputClass}
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </Field>
            <Button type="submit">Add task</Button>
          </form>
        </Panel>

        <Panel className="p-6 lg:col-span-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-serif text-xl">All tasks</h2>
            <div className="flex gap-2">
              {(["all", "open", "done"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ring-1 transition-colors ${
                    filter === f
                      ? "bg-primary/10 text-primary ring-primary/20"
                      : "text-muted-foreground ring-border hover:text-foreground"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {visible.length === 0 ? (
            <EmptyNote>No tasks in this view.</EmptyNote>
          ) : (
            <div className="space-y-4">
              {visible.map((t) => (
                <div
                  key={t.id}
                  className="flex flex-wrap items-center gap-3 border-b border-border pb-4 last:border-0 last:pb-0"
                >
                  <Checkbox checked={t.done} onChange={() => toggleTask(t.id)} />
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm ${t.done ? "text-muted-foreground line-through" : "font-medium"}`}>
                      {t.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t.subject} • {t.type} • due {formatDate(t.due)}
                    </p>
                  </div>
                  <PriorityPill priority={t.priority} />
                  <button
                    onClick={() => removeTask(t.id)}
                    className="label-caps hover:text-accent"
                    aria-label={`Delete ${t.title}`}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
