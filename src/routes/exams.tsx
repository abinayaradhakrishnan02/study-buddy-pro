import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { Bar, Button, EmptyNote, Field, PageHeader, Panel, inputClass } from "@/components/planner-ui";
import { daysLeft, examReadiness, formatDate, usePlanner } from "@/lib/planner-store";

export const Route = createFileRoute("/exams")({
  head: () => ({
    meta: [
      { title: "Exam Planner — Arcane" },
      {
        name: "description",
        content: "Log each exam with its date and syllabus, then track chapters covered and preparation percentage.",
      },
      { property: "og:title", content: "Exam Planner — Arcane" },
      { property: "og:description", content: "Syllabus coverage mapped to exam dates." },
    ],
  }),
  component: Exams,
});

function Exams() {
  const { state, addExam, setExamProgress, removeExam } = usePlanner();
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");
  const [chapters, setChapters] = useState("8");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const ch = Number(chapters);
    if (!subject.trim() || !date || !Number.isFinite(ch) || ch <= 0 || ch > 200) return;
    addExam({ subject: subject.trim().slice(0, 60), date, chapters: Math.round(ch), completed: 0 });
    setSubject("");
    setDate("");
  };

  const sorted = state.exams.slice().sort((a, b) => +new Date(a.date) - +new Date(b.date));

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <PageHeader
        eyebrow="Preparation"
        title="Exam Planner"
        intro="Every exam, its syllabus, and exactly how much of it you've covered so far."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Panel className="p-6 lg:col-span-4">
          <h2 className="mb-5 font-serif text-xl">Add an exam</h2>
          <form onSubmit={submit} className="space-y-4">
            <Field label="Subject">
              <input
                className={inputClass}
                value={subject}
                maxLength={60}
                placeholder="Python"
                onChange={(e) => setSubject(e.target.value)}
              />
            </Field>
            <Field label="Exam date">
              <input type="date" className={inputClass} value={date} onChange={(e) => setDate(e.target.value)} />
            </Field>
            <Field label="Syllabus chapters">
              <input
                className={inputClass}
                value={chapters}
                inputMode="numeric"
                maxLength={3}
                onChange={(e) => setChapters(e.target.value)}
              />
            </Field>
            <Button type="submit">Add exam</Button>
          </form>
        </Panel>

        <div className="space-y-6 lg:col-span-8">
          {sorted.length === 0 ? (
            <Panel className="p-6">
              <EmptyNote>No exams logged yet.</EmptyNote>
            </Panel>
          ) : (
            sorted.map((e) => (
              <Panel key={e.id} className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-xl">{e.subject}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDate(e.date)} • {daysLeft(e.date)} days left • {e.chapters} chapters
                    </p>
                  </div>
                  <p className="text-sm font-medium text-accent">{examReadiness(e)}% Ready</p>
                </div>
                <div className="mt-5">
                  <Bar value={examReadiness(e)} tone="accent" />
                </div>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-muted-foreground">
                    Completed {e.completed}/{e.chapters} chapters
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setExamProgress(e.id, e.completed - 1)}
                      className="label-caps hover:text-foreground"
                      aria-label="Decrease chapters covered"
                    >
                      −
                    </button>
                    <button
                      onClick={() => setExamProgress(e.id, e.completed + 1)}
                      className="label-caps hover:text-foreground"
                      aria-label="Increase chapters covered"
                    >
                      +
                    </button>
                    <button onClick={() => removeExam(e.id)} className="label-caps hover:text-accent">
                      Remove
                    </button>
                  </div>
                </div>
              </Panel>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
