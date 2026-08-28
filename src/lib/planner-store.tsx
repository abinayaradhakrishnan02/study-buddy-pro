import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Status = "done" | "active" | "upcoming";
export type Priority = "high" | "medium" | "low";

export type Slot = {
  id: string;
  day: string;
  time: string;
  subject: string;
  activity: string;
  status: Status;
};

export type Task = {
  id: string;
  title: string;
  subject: string;
  type: "Assignment" | "Homework" | "Project" | "Notes";
  due: string;
  priority: Priority;
  done: boolean;
};

export type Exam = {
  id: string;
  subject: string;
  date: string;
  chapters: number;
  completed: number;
};

export type Goal = {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  done: boolean;
};

export type Session = { id: string; minutes: number; at: string };

export type Profile = {
  name: string;
  course: string;
  semester: string;
  subjects: string[];
};

export type PlannerState = {
  slots: Slot[];
  tasks: Task[];
  exams: Exam[];
  goals: Goal[];
  sessions: Session[];
  profile: Profile;
  streak: number;
  weeklyHours: number[];
  subjectHours: { subject: string; hours: number }[];
};

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const uid = () => Math.random().toString(36).slice(2, 10);

const initialState: PlannerState = {
  profile: {
    name: "Aisha Rahman",
    course: "B.Sc. Computer Science",
    semester: "Semester 5",
    subjects: ["Mathematics", "Python", "Statistics", "Macroeconomics", "Ethics in AI"],
  },
  streak: 12,
  weeklyHours: [2.5, 3.2, 1.8, 4.2, 3.6, 2.1, 1.4],
  subjectHours: [
    { subject: "Mathematics", hours: 14.5 },
    { subject: "Python", hours: 11.2 },
    { subject: "Statistics", hours: 6.8 },
    { subject: "Macroeconomics", hours: 5.4 },
    { subject: "Ethics in AI", hours: 2.6 },
  ],
  slots: [
    { id: uid(), day: "Thu", time: "09:00 AM", subject: "Advanced Calculus", activity: "Problem Set 4 Revision", status: "done" },
    { id: uid(), day: "Thu", time: "11:30 AM", subject: "Macroeconomics", activity: "Chapter 8: Market Failure", status: "upcoming" },
    { id: uid(), day: "Thu", time: "02:00 PM", subject: "Ethics in AI", activity: "Peer Review Session", status: "active" },
    { id: uid(), day: "Mon", time: "06:00 AM", subject: "Mathematics", activity: "Revision", status: "done" },
    { id: uid(), day: "Mon", time: "05:00 PM", subject: "Python", activity: "Practice", status: "active" },
    { id: uid(), day: "Tue", time: "07:00 PM", subject: "Statistics", activity: "Notes", status: "upcoming" },
    { id: uid(), day: "Wed", time: "10:00 AM", subject: "Python", activity: "Lab exercises", status: "upcoming" },
    { id: uid(), day: "Fri", time: "04:00 PM", subject: "Mathematics", activity: "Mock test", status: "upcoming" },
  ],
  tasks: [
    { id: uid(), title: "Submit Physics Lab Report", subject: "Statistics", type: "Assignment", due: "2026-09-01", priority: "high", done: false },
    { id: uid(), title: "Read 'The Wealth of Nations'", subject: "Macroeconomics", type: "Notes", due: "2026-08-30", priority: "low", done: true },
    { id: uid(), title: "Annotate Bibliography for History", subject: "Ethics in AI", type: "Homework", due: "2026-09-03", priority: "medium", done: false },
    { id: uid(), title: "Python capstone milestone 2", subject: "Python", type: "Project", due: "2026-09-06", priority: "high", done: false },
  ],
  exams: [
    { id: uid(), subject: "Organic Chemistry", date: "2026-09-05", chapters: 12, completed: 8 },
    { id: uid(), subject: "Python", date: "2026-09-15", chapters: 8, completed: 5 },
    { id: uid(), subject: "Mathematics", date: "2026-09-22", chapters: 9, completed: 7 },
  ],
  goals: [
    { id: uid(), title: "Study 3 hours a day", target: 3, current: 2.4, unit: "h", done: false },
    { id: uid(), title: "Complete 5 chapters this week", target: 5, current: 3, unit: "ch", done: false },
    { id: uid(), title: "Maintain a 7-day streak", target: 7, current: 7, unit: "days", done: true },
  ],
  sessions: [
    { id: uid(), minutes: 25, at: "2026-08-28T08:10:00Z" },
    { id: uid(), minutes: 25, at: "2026-08-28T09:05:00Z" },
    { id: uid(), minutes: 50, at: "2026-08-28T11:20:00Z" },
  ],
};

const STORAGE_KEY = "arcane-planner-v1";

type Ctx = {
  state: PlannerState;
  hydrated: boolean;
  update: (patch: Partial<PlannerState>) => void;
  addTask: (t: Omit<Task, "id" | "done">) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;
  addSlot: (s: Omit<Slot, "id">) => void;
  cycleSlot: (id: string) => void;
  removeSlot: (id: string) => void;
  addExam: (e: Omit<Exam, "id">) => void;
  setExamProgress: (id: string, completed: number) => void;
  removeExam: (id: string) => void;
  addGoal: (g: Omit<Goal, "id" | "done">) => void;
  toggleGoal: (id: string) => void;
  removeGoal: (id: string) => void;
  addSession: (minutes: number) => void;
  setProfile: (p: Profile) => void;
  reset: () => void;
};

const PlannerContext = createContext<Ctx | null>(null);

export function PlannerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PlannerState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...initialState, ...(JSON.parse(raw) as PlannerState) });
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full or unavailable */
    }
  }, [state, hydrated]);

  const update = useCallback((patch: Partial<PlannerState>) => {
    setState((s) => ({ ...s, ...patch }));
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      state,
      hydrated,
      update,
      addTask: (t) => setState((s) => ({ ...s, tasks: [{ ...t, id: uid(), done: false }, ...s.tasks] })),
      toggleTask: (id) =>
        setState((s) => ({
          ...s,
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
        })),
      removeTask: (id) => setState((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== id) })),
      addSlot: (sl) => setState((s) => ({ ...s, slots: [...s.slots, { ...sl, id: uid() }] })),
      cycleSlot: (id) =>
        setState((s) => ({
          ...s,
          slots: s.slots.map((sl) =>
            sl.id === id
              ? {
                  ...sl,
                  status: sl.status === "upcoming" ? "active" : sl.status === "active" ? "done" : "upcoming",
                }
              : sl,
          ),
        })),
      removeSlot: (id) => setState((s) => ({ ...s, slots: s.slots.filter((sl) => sl.id !== id) })),
      addExam: (e) => setState((s) => ({ ...s, exams: [...s.exams, { ...e, id: uid() }] })),
      setExamProgress: (id, completed) =>
        setState((s) => ({
          ...s,
          exams: s.exams.map((e) =>
            e.id === id ? { ...e, completed: Math.max(0, Math.min(e.chapters, completed)) } : e,
          ),
        })),
      removeExam: (id) => setState((s) => ({ ...s, exams: s.exams.filter((e) => e.id !== id) })),
      addGoal: (g) => setState((s) => ({ ...s, goals: [...s.goals, { ...g, id: uid(), done: false }] })),
      toggleGoal: (id) =>
        setState((s) => ({ ...s, goals: s.goals.map((g) => (g.id === id ? { ...g, done: !g.done } : g)) })),
      removeGoal: (id) => setState((s) => ({ ...s, goals: s.goals.filter((g) => g.id !== id) })),
      addSession: (minutes) =>
        setState((s) => ({
          ...s,
          sessions: [...s.sessions, { id: uid(), minutes, at: new Date().toISOString() }],
        })),
      setProfile: (p) => setState((s) => ({ ...s, profile: p })),
      reset: () => setState(initialState),
    }),
    [state, hydrated, update],
  );

  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>;
}

export function usePlanner() {
  const ctx = useContext(PlannerContext);
  if (!ctx) throw new Error("usePlanner must be used inside PlannerProvider");
  return ctx;
}

/* ---------- derived helpers ---------- */

export function focusMinutes(sessions: Session[]) {
  return sessions.reduce((n, s) => n + s.minutes, 0);
}

export function todayHours(sessions: Session[]) {
  const today = new Date().toDateString();
  const mins = sessions
    .filter((s) => new Date(s.at).toDateString() === today)
    .reduce((n, s) => n + s.minutes, 0);
  return Math.round((mins / 60) * 10) / 10;
}

export function dailyProgress(state: PlannerState) {
  const tasks = state.tasks;
  const taskPart = tasks.length ? tasks.filter((t) => t.done).length / tasks.length : 0;
  const goal = state.goals[0];
  const hoursPart = goal ? Math.min(1, goal.current / goal.target) : 0;
  return Math.round(((taskPart + hoursPart) / 2) * 100);
}

export function examReadiness(e: Exam) {
  return e.chapters ? Math.round((e.completed / e.chapters) * 100) : 0;
}

export function daysLeft(date: string) {
  const diff = new Date(date).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86400000));
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

export function reminders(state: PlannerState) {
  const out: { id: string; text: string; tone: "primary" | "accent" | "muted" }[] = [];
  state.exams
    .slice()
    .sort((a, b) => +new Date(a.date) - +new Date(b.date))
    .slice(0, 2)
    .forEach((e) =>
      out.push({ id: `e-${e.id}`, text: `${e.subject} exam in ${daysLeft(e.date)} days`, tone: "primary" }),
    );
  state.tasks
    .filter((t) => !t.done)
    .slice(0, 2)
    .forEach((t) =>
      out.push({ id: `t-${t.id}`, text: `${t.title} due ${formatDate(t.due)}`, tone: "accent" }),
    );
  const missed = state.slots.find((s) => s.status === "upcoming");
  if (missed) out.push({ id: `s-${missed.id}`, text: `Revision pending: ${missed.subject} at ${missed.time}`, tone: "muted" });
  return out;
}
