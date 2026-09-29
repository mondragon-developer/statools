import stage1 from './stage1';
import stage2 from './stage2';
import stage3 from './stage3';
import stage4 from './stage4';
import stage5 from './stage5';
import stage6 from './stage6';
import stage7 from './stage7';

export const STAGES = [stage1, stage2, stage3, stage4, stage5, stage6, stage7];

export const CAPSTONE_STAGE_ID = 7;

export const XP = {
  lesson: 20,
  practice: 5,
  calculator: 10,
  reflection: 5,
  checkpoints: 30,
  capstone: 50,
  dailyReturn: 10,
};

export const getStage = (stageId) => STAGES.find(s => s.id === Number(stageId));

export const getLesson = (stageId, lessonId) => getStage(stageId)?.lessons.find(l => l.id === lessonId);

export const allLessons = () => STAGES.flatMap(stage => stage.lessons.map(lesson => ({ stage, lesson })));

export const stagePath = (stage) => `/learn/stage/${stage.id}`;
export const lessonPath = (stage, lesson) => `/learn/stage/${stage.id}/lesson/${lesson.id}`;
