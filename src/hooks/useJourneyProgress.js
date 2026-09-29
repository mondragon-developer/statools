import { useSyncExternalStore } from 'react';
import { STAGES, XP, CAPSTONE_STAGE_ID, getStage, lessonPath, stagePath } from '../data/journey';

const STORAGE_KEY = 'statools-journey-v1';

const emptyProgress = () => ({
  lessons: {},
  practice: {},
  calculators: {},
  reflections: {},
  checkpoints: {},
  badges: {},
  capstone: null,
  xp: 0,
  streak: { current: 0, longest: 0, lastDay: null },
  certificateName: '',
});

// Progress lives only in this browser. Storage can throw (private mode, blocked
// site data), in which case the journey still works for the current visit.
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? sanitize(JSON.parse(raw)) : emptyProgress();
  } catch {
    return emptyProgress();
  }
}

const isRecord = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);

const pick = (value, keep, map = (v) => v) => {
  const out = {};
  if (isRecord(value)) {
    Object.entries(value).forEach(([k, v]) => { if (keep(v)) out[k] = map(v); });
  }
  return out;
};
const isString = (v) => typeof v === 'string';
const stringMap = (value, max = 4000) => pick(value, isString, v => v.slice(0, max));
const count = (v) => (Number.isFinite(v) && v >= 0 ? Math.floor(v) : 0);

// Imported codes are user-supplied text, so every field and nested value is type-checked:
// the teacher report and capstone page render these values directly.
export function sanitize(raw) {
  const base = emptyProgress();
  if (!isRecord(raw)) return base;
  const out = { ...base };
  out.lessons = stringMap(raw.lessons, 40);
  out.checkpoints = stringMap(raw.checkpoints, 40);
  out.badges = stringMap(raw.badges, 40);
  out.reflections = stringMap(raw.reflections, 1000);
  out.practice = pick(raw.practice, v => v === true);
  out.calculators = pick(raw.calculators, v => v === true);
  if (isRecord(raw.capstone)) {
    const c = raw.capstone;
    out.capstone = {
      caseId: isString(c.caseId) ? c.caseId : undefined,
      submittedAt: isString(c.submittedAt) ? c.submittedAt : undefined,
      answers: stringMap(c.answers, 2000),
      drafts: pick(c.drafts, isRecord, d => stringMap(d, 2000)),
    };
  }
  out.xp = count(raw.xp);
  if (isRecord(raw.streak)) {
    out.streak = {
      current: count(raw.streak.current),
      longest: count(raw.streak.longest),
      lastDay: isString(raw.streak.lastDay) ? raw.streak.lastDay : null,
    };
  }
  if (typeof raw.certificateName === 'string') out.certificateName = raw.certificateName.slice(0, 80);
  return out;
}

let state = load();
const listeners = new Set();

function commit(next) {
  state = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Keep the in-memory state even when it cannot be saved.
  }
  listeners.forEach(listener => listener());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// Another tab finishing a lesson should show up here too.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      state = load();
      listeners.forEach(listener => listener());
    }
  });
}

export const dayKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// Compares calendar days, not elapsed hours, so 23- and 25-hour DST days still count.
export function isStreakAlive(lastDay) {
  if (!lastDay) return false;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return lastDay === dayKey(new Date()) || lastDay === dayKey(yesterday);
}

function withStreak(progress) {
  const today = dayKey(new Date());
  const { lastDay, current, longest } = progress.streak;
  if (lastDay === today) return progress;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const continued = lastDay === dayKey(yesterday);
  const nextCurrent = continued ? current + 1 : 1;
  return {
    ...progress,
    xp: progress.xp + (continued ? XP.dailyReturn : 0),
    streak: { current: nextCurrent, longest: Math.max(longest, nextCurrent), lastDay: today },
  };
}

export function isStageComplete(progress, stage) {
  const lessonsDone = stage.lessons.every(lesson => progress.lessons[lesson.id]);
  const checkpointsDone = Boolean(progress.checkpoints[stage.id]);
  const capstoneDone = stage.id !== CAPSTONE_STAGE_ID || Boolean(progress.capstone?.submittedAt);
  return lessonsDone && checkpointsDone && capstoneDone;
}

// Returns the progress with any newly earned badge, plus that badge's stage (or null).
function withBadge(progress, stageId) {
  const stage = getStage(stageId);
  if (!stage || progress.badges[stageId] || !isStageComplete(progress, stage)) {
    return [progress, null];
  }
  return [{ ...progress, badges: { ...progress.badges, [stageId]: new Date().toISOString() } }, stage];
}

export const journeyActions = {
  answerPractice(questionId) {
    if (state.practice[questionId]) return;
    commit({ ...state, practice: { ...state.practice, [questionId]: true }, xp: state.xp + XP.practice });
  },

  markCalculatorTried(lessonId) {
    if (state.calculators[lessonId]) return;
    commit({ ...state, calculators: { ...state.calculators, [lessonId]: true }, xp: state.xp + XP.calculator });
  },

  saveReflection(lessonId, text) {
    const firstTime = !state.reflections[lessonId] && text.trim();
    commit({
      ...state,
      reflections: { ...state.reflections, [lessonId]: text },
      xp: state.xp + (firstTime ? XP.reflection : 0),
    });
  },

  completeLesson(stageId, lessonId) {
    if (state.lessons[lessonId]) return null;
    const next = withStreak({
      ...state,
      lessons: { ...state.lessons, [lessonId]: new Date().toISOString() },
      xp: state.xp + XP.lesson,
    });
    const [withNewBadge, badgeStage] = withBadge(next, stageId);
    commit(withNewBadge);
    return badgeStage;
  },

  completeCheckpoints(stageId) {
    if (state.checkpoints[stageId]) return null;
    const next = withStreak({
      ...state,
      checkpoints: { ...state.checkpoints, [stageId]: new Date().toISOString() },
      xp: state.xp + XP.checkpoints,
    });
    const [withNewBadge, badgeStage] = withBadge(next, stageId);
    commit(withNewBadge);
    return badgeStage;
  },

  // Drafts are kept per case so switching cases never overwrites the submitted one.
  saveCapstoneDraft(caseId, answers) {
    const capstone = state.capstone || {};
    commit({ ...state, capstone: { ...capstone, drafts: { ...capstone.drafts, [caseId]: answers } } });
  },

  submitCapstone(caseId, answers) {
    const firstSubmit = !state.capstone?.submittedAt;
    const next = withStreak({
      ...state,
      capstone: {
        drafts: { ...state.capstone?.drafts, [caseId]: answers },
        caseId,
        answers,
        submittedAt: state.capstone?.submittedAt || new Date().toISOString(),
      },
      xp: state.xp + (firstSubmit ? XP.capstone : 0),
    });
    const [withNewBadge, badgeStage] = withBadge(next, CAPSTONE_STAGE_ID);
    commit(withNewBadge);
    return badgeStage;
  },

  setCertificateName(name) {
    commit({ ...state, certificateName: name });
  },

  reset() {
    commit(emptyProgress());
  },

  importProgress(imported) {
    commit(sanitize(imported));
  },
};

export function stageStats(progress, stage) {
  const done = stage.lessons.filter(lesson => progress.lessons[lesson.id]).length;
  const steps = stage.lessons.length + 1 + (stage.id === CAPSTONE_STAGE_ID ? 1 : 0);
  const stepsDone = done
    + (progress.checkpoints[stage.id] ? 1 : 0)
    + (stage.id === CAPSTONE_STAGE_ID && progress.capstone?.submittedAt ? 1 : 0);
  let status = 'start';
  if (progress.badges[stage.id]) status = 'completed';
  else if (stepsDone > 0) status = 'continue';
  return { done, total: stage.lessons.length, percent: Math.round((stepsDone / steps) * 100), status };
}

export function overallPercent(progress) {
  const totals = STAGES.map(stage => stageStats(progress, stage).percent);
  return Math.round(totals.reduce((sum, p) => sum + p, 0) / STAGES.length);
}

// The single "what should I do next?" answer the plan asks every screen to give.
export function nextStep(progress) {
  for (const stage of STAGES) {
    const lesson = stage.lessons.find(l => !progress.lessons[l.id]);
    if (lesson) return { type: 'lesson', stage, lesson };
    if (!progress.checkpoints[stage.id]) return { type: 'checkpoints', stage };
    if (stage.id === CAPSTONE_STAGE_ID && !progress.capstone?.submittedAt) return { type: 'capstone', stage };
  }
  return { type: 'done' };
}

export function nextStepLink(step) {
  if (step.type === 'lesson') return { to: lessonPath(step.stage, step.lesson), label: 'Continue today\'s 15-minute lesson' };
  if (step.type === 'checkpoints') return { to: `${stagePath(step.stage)}#checkpoints`, label: `Finish the Stage ${step.stage.id} checkpoints` };
  if (step.type === 'capstone') return { to: '/learn/capstone', label: 'Open your final case file' };
  return { to: '/learn/certificate', label: 'View your certificate' };
}

export default function useJourneyProgress() {
  return useSyncExternalStore(subscribe, () => state, () => state);
}
