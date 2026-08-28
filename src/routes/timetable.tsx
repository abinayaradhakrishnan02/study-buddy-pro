import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { Button, EmptyNote, Field, PageHeader, Panel, StatusPill, inputClass } from "@/components/planner-ui";
import { DAYS, usePlanner } from "@/lib/planner-store";

export const Route = createFileRoute("/timetable")({
  head: () => ({
    meta: [
      { title: "Study Timetable — Arcane" },
      {
        name: "description",
        content: "Build a daily and weekly study timetable with time slots, subjects, activities and status.",
      },
      { property: "og:title", content: "Study Timetable — Arcane" },
      { property: "og:description", content: "Daily and weekly study schedule for every subject." },
    ],
  }),
  component: Timetable,
});

function Timetable() {
  const { state, addSlot, cycleSlot, removeSlot } = usePlanner();
  const [day, setDay] = useState("Mon");
  const [time, setTime] = useState("");
  const [subject, setSubject] = useState("");
  const [activity, setActivity] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!time.trim() || !subject.trim()) return;
    addSlot({
      day,
      time: time.trim().slice(0, 20),
      subject: subject.trim().slice(0, 60),
      activity: activity.trim().slice(0, 80) || "Study",
      status: "upcoming",
    });
    setTime("");
    setSubject("");
    setActivity("");
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <PageHeader
        eyebrow="Weekly plan"
        title="Study Timetable"
        intro="Lay out each day's slots. Tap a status to move it from upcoming to active to completed."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Panel className="p-6 lg:col-span-4">
          <h2 className="mb-5 font-serif text-xl">Add a slot</h2>
          <form onSubmit={submit} className="space-y-4">
            <Field label="Day">
              <select value={day} onChange={(e) => setDay(e.target.value)} className={inputClass}>
                {DAYS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Time">
              <input
                className={inputClass}
                value={time}
                maxLength={20}
                placeholder="06:00 – 07:00 AM"
                onChange={(e) => setTime(e.target.value)}
              />
            </Field>
            <Field label="Subject">
              <input
                className={inputClass}
                value={subject}
                maxLength={60}
                placeholder="Mathematics"
                onChange={(e) => setSubject(e.target.value)}
              />
            </Field>
            <Field label="Activity">
              <input
                className={inputClass}
                value={activity}
                maxLength={80}
                placeholder="Revision"
                onChange={(e) => setActivity(e.target.value)}
              />
            </Field>
            <Button type="submit">Add to timetable</Button>
          </form>
        </Panel>

        <div className="space-y-6 lg:col-span-8">
          {DAYS.map((d) => {
            const slots = state.slots.filter((s) => s.day === d);
            return (
              <Panel key={d} className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-serif text-xl">{d}</h2>
                  <span className="label-caps">{slots.length} slots</span>
                </div>
                {slots.length === 0 ? (
                  <EmptyNote>Nothing scheduled yet.</EmptyNote>
                ) : (
                  <div className="space-y-4">
                    {slots.map((s) => (
                      <div
                        key={s.id}
                        className="grid grid-cols-[110px_1fr] items-center gap-4 border-b border-border pb-4 last:border-0 last:pb-0"
                      >
                        <span className="text-sm font-medium text-muted-foreground">{s.time}</span>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium">{s.subject}</p>
                            <p className="text-xs text-muted-foreground">{s.activity}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => cycleSlot(s.id)} aria-label="Change status">
                              <StatusPill status={s.status} />
                            </button>
                            <button
                              onClick={() => removeSlot(s.id)}
                              className="label-caps hover:text-accent"
                              aria-label={`Remove ${s.subject}`}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Panel>
            );
          })}
        </div>
      </div>
    </div>
  );
}
