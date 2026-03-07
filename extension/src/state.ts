import * as fs from 'fs';
import * as path from 'path';

export interface PendingReview {
  active: boolean;
  filePath: string;
  questionLevel: number;
  question: string;
  format: 'text' | 'multiple_choice';
  choices?: string[];
  hints: string[];
  hintsUsed: number;
}

export interface LearnerState {
  studentName: string;
  currentStage: number;
  currentBuildMapItem: number;
  pendingReview: PendingReview;
  xp: number;
  level: number;
  levelTitle: string;
  badges: string[];
  streak: number;
  lastSession: string;
}

export interface BuildMapItem {
  index: number;
  text: string;
  complete: boolean;
  current: boolean;
}

const LEVEL_TITLES: Record<number, string> = {
  1: 'Debug Mode',
  2: 'Hello World',
  3: 'Function Author',
  4: 'Loop Master',
  5: 'Prompt Writer',
  6: 'Git Committer',
  7: 'Bug Hunter',
  8: 'Code Reviewer',
  9: 'Project Builder',
  10: 'Shipping Engineer',
};

const LEVEL_XP: Record<number, number> = {
  1: 0,
  2: 200,
  3: 500,
  4: 1000,
  5: 2000,
  6: 3500,
  7: 5000,
  8: 7500,
  9: 10000,
  10: 15000,
};

export function getLevelForXP(xp: number): { level: number; title: string; nextLevelXP: number } {
  let level = 1;
  for (const [l, threshold] of Object.entries(LEVEL_XP)) {
    if (xp >= threshold) {
      level = parseInt(l);
    }
  }
  const nextLevel = Math.min(level + 1, 10);
  return {
    level,
    title: LEVEL_TITLES[level] || 'Debug Mode',
    nextLevelXP: LEVEL_XP[nextLevel] || LEVEL_XP[10],
  };
}

export function readState(workspaceRoot: string): LearnerState | null {
  const statePath = path.join(workspaceRoot, '.learner', 'state.json');
  try {
    const raw = fs.readFileSync(statePath, 'utf-8');
    return JSON.parse(raw) as LearnerState;
  } catch {
    return null;
  }
}

export function writePendingAnswer(
  workspaceRoot: string,
  question: string,
  answer: string,
  questionLevel: number,
  hintsUsed: number
): void {
  const answerPath = path.join(workspaceRoot, '.learner', 'pending-answer.json');
  const data = {
    question,
    answer,
    questionLevel,
    hintsUsed,
  };
  fs.writeFileSync(answerPath, JSON.stringify(data, null, 2), 'utf-8');
}

export function parseBuildMap(workspaceRoot: string): BuildMapItem[] {
  const buildMapPath = path.join(workspaceRoot, '.learner', 'build-map.md');
  try {
    const raw = fs.readFileSync(buildMapPath, 'utf-8');
    const lines = raw.split('\n');
    const items: BuildMapItem[] = [];
    let index = 0;
    let firstIncomplete = -1;

    for (const line of lines) {
      const checkedMatch = line.match(/^- \[x\] \d+\. (.+)$/i);
      const uncheckedMatch = line.match(/^- \[ \] \d+\. (.+)$/);

      if (checkedMatch) {
        items.push({ index: ++index, text: checkedMatch[1], complete: true, current: false });
      } else if (uncheckedMatch) {
        if (firstIncomplete === -1) {
          firstIncomplete = index + 1;
        }
        items.push({ index: ++index, text: uncheckedMatch[1], complete: false, current: false });
      }
    }

    // Mark the first incomplete item as current
    if (firstIncomplete !== -1) {
      const currentItem = items.find((i) => i.index === firstIncomplete);
      if (currentItem) {
        currentItem.current = true;
      }
    }

    return items;
  } catch {
    return [];
  }
}

export function isSetUp(workspaceRoot: string): boolean {
  const configPath = path.join(workspaceRoot, '.learner', 'config.json');
  return fs.existsSync(configPath);
}
