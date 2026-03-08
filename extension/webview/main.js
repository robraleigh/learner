// @ts-check
'use strict';

const vscode = acquireVsCodeApi();

// ── Badge catalog ──────────────────────────────────────────
// minStage: badge is only surfaced as "working toward" and shown unlocked once
// the student reaches this stage. The sidebar visually locks higher-stage badges.
const BADGE_CATALOG = [
  {
    track: 'HTML / Markup',
    badges: [
      { id: 'markup-apprentice', label: '🏗️ Markup Apprentice', tier: 'bronze', target: 3, minStage: 1, description: 'Write HTML elements correctly across 3 tasks' },
      { id: 'semantic-scholar',  label: '📐 Semantic Scholar',  tier: 'silver', target: 3, minStage: 2, description: 'Use semantic elements: header, nav, main, footer, article' },
      { id: 'form-builder',      label: '📋 Form Builder',      tier: 'gold',   target: 1, minStage: 2, description: 'Build a complete working HTML form' },
    ],
  },
  {
    track: 'CSS',
    badges: [
      { id: 'style-starter',       label: '🎨 Style Starter',        tier: 'bronze', target: 3, minStage: 1, description: 'Write CSS rules from scratch across 3 tasks' },
      { id: 'selector-savvy',      label: '🎯 Selector Savvy',       tier: 'silver', target: 3, minStage: 2, description: 'Use class, ID, and element selectors correctly' },
      { id: 'flex-apprentice',     label: '📦 Flex Apprentice',      tier: 'silver', target: 3, minStage: 2, description: 'Use flexbox layout correctly 3 times' },
      { id: 'variable-keeper',     label: '🧮 Variable Keeper',      tier: 'silver', target: 1, minStage: 2, description: 'Use CSS custom properties in a project' },
      { id: 'responsive-designer', label: '📱 Responsive Designer',  tier: 'gold',   target: 2, minStage: 4, description: 'Write media queries that work correctly' },
      { id: 'css-architect',       label: '🏛️ CSS Architect',        tier: 'gold',   target: 1, minStage: 4, description: 'Combine flexbox/grid + variables + media query in one project' },
    ],
  },
  {
    track: 'JavaScript — Fundamentals',
    badges: [
      { id: 'variable-vault',        label: '🗃️ Variable Vault',        tier: 'bronze', target: 3, minStage: 1, description: 'Use const/let correctly and explain the difference' },
      { id: 'conditional-navigator', label: '🚦 Conditional Navigator', tier: 'bronze', target: 5, minStage: 1, description: 'Write correct if/else or switch statements' },
      { id: 'loop-rider',            label: '🔄 Loop Rider',            tier: 'silver', target: 3, minStage: 2, description: 'Write a loop correctly and explain it' },
      { id: 'array-handler',         label: '🛒 Array Handler',         tier: 'silver', target: 4, minStage: 2, description: 'Use array methods (push, pop, filter, map) correctly' },
    ],
  },
  {
    track: 'JavaScript — Functions',
    badges: [
      { id: 'function-forger',    label: '⚒️ Function Forger',    tier: 'bronze', target: 3, minStage: 2, description: 'Write a function from scratch (not from a template)' },
      { id: 'return-master',      label: '↩️ Return Master',      tier: 'silver', target: 3, minStage: 2, description: 'Write functions with return values and explain them' },
      { id: 'function-whisperer', label: '🧙 Function Whisperer', tier: 'gold',   target: 2, minStage: 3, description: 'Write functions with multiple parameters and explain all parts' },
    ],
  },
  {
    track: 'JavaScript — Objects',
    badges: [
      { id: 'object-maker',     label: '🗂️ Object Maker',     tier: 'bronze', target: 3, minStage: 2, description: 'Create objects with multiple properties and access them' },
      { id: 'object-architect', label: '🧱 Object Architect', tier: 'silver', target: 3, minStage: 3, description: 'Build a complex object-based data structure and explain it' },
      { id: 'data-modeller',    label: '🗄️ Data Modeller',    tier: 'gold',   target: 1, minStage: 5, description: 'Design a data structure for a real feature and justify the shape' },
    ],
  },
  {
    track: 'Git & Workflow',
    badges: [
      { id: 'first-commit',    label: '💾 First Commit',    tier: 'bronze', target: 1, minStage: 0, description: 'Make your first git commit' },
      { id: 'branch-explorer', label: '🌿 Branch Explorer', tier: 'silver', target: 1, minStage: 3, description: 'Create a branch, make changes, and merge it' },
      { id: 'git-historian',   label: '🔍 Git Historian',   tier: 'silver', target: 1, minStage: 3, description: 'Use git log and git diff to find something specific' },
    ],
  },
  {
    track: 'Debugging',
    badges: [
      { id: 'log-detective', label: '🔦 Log Detective', tier: 'bronze', target: 3, minStage: 1, description: 'Use console.log strategically to find a bug' },
      { id: 'bug-squasher',  label: '🐛 Bug Squasher',  tier: 'silver', target: 1, minStage: 2, description: 'Fix a bug you found yourself' },
      { id: 'rubber-duck',   label: '🦆 Rubber Duck',   tier: 'gold',   target: 1, minStage: 3, description: 'Find a bug via /debug before Claude points to it' },
    ],
  },
  {
    track: 'Data & Storage',
    badges: [
      { id: 'json-handler',    label: '📄 JSON Handler',    tier: 'bronze', target: 3, minStage: 4, description: 'Read/write JSON and explain its structure' },
      { id: 'file-wrangler',   label: '📂 File Wrangler',   tier: 'silver', target: 2, minStage: 5, description: 'Use the fs module to read and write files' },
      { id: 'db-apprentice',   label: '🛢️ DB Apprentice',   tier: 'silver', target: 3, minStage: 5, description: 'Write correct SQL queries (INSERT, SELECT, WHERE)' },
      { id: 'schema-designer', label: '📊 Schema Designer', tier: 'gold',   target: 1, minStage: 5, description: 'Design a data schema and justify field choices' },
      { id: 'query-master',    label: '🔎 Query Master',    tier: 'gold',   target: 2, minStage: 5, description: 'Write queries with filtering, ordering, or joining' },
    ],
  },
  {
    track: 'APIs & Networking',
    badges: [
      { id: 'fetch-first',    label: '🌐 Fetch First',    tier: 'bronze', target: 1, minStage: 7, description: 'Make a successful API call with fetch' },
      { id: 'async-rider',    label: '⏳ Async Rider',    tier: 'silver', target: 3, minStage: 7, description: 'Use async/await correctly and explain why it\'s needed' },
      { id: 'api-reader',     label: '📡 API Reader',     tier: 'silver', target: 2, minStage: 7, description: 'Read API docs and identify the right endpoint' },
      { id: 'error-handler',  label: '🛡️ Error Handler',  tier: 'gold',   target: 2, minStage: 7, description: 'Handle API errors gracefully with try/catch' },
    ],
  },
  {
    track: 'DevOps & Deployment',
    badges: [
      { id: 'package-publisher', label: '📤 Package Publisher', tier: 'bronze', target: 1, minStage: 4, description: 'Write a working package.json with correct scripts' },
      { id: 'script-runner',     label: '⚙️ Script Runner',     tier: 'silver', target: 2, minStage: 4, description: 'Write and run custom npm scripts' },
      { id: 'env-aware',         label: '🔐 Env Aware',         tier: 'silver', target: 1, minStage: 6, description: 'Use environment variables correctly (.env, process.env)' },
      { id: 'ship-to-web',       label: '🌍 Ship to Web',       tier: 'gold',   target: 1, minStage: 7, description: 'Deploy a project to a live URL' },
    ],
  },
  {
    track: 'Architecture',
    badges: [
      { id: 'module-maker',      label: '🧩 Module Maker',      tier: 'bronze', target: 2, minStage: 4, description: 'Split code into separate files and import correctly' },
      { id: 'separation-artist', label: '✂️ Separation Artist', tier: 'silver', target: 2, minStage: 5, description: 'Separate data, logic, and UI into different files' },
      { id: 'architect',         label: '🔭 Architect',         tier: 'gold',   target: 1, minStage: 6, description: 'Design a multi-file project structure before writing any code' },
    ],
  },
  {
    track: 'Learning & Process',
    badges: [
      { id: 'explain-it-back',      label: '💬 Explain-It-Back',      tier: 'silver', target: 3, minStage: 0, description: 'Accurately explain a concept back in your own words, 3 times' },
      { id: 'librarian',            label: '📚 The Librarian',         tier: 'bronze', target: 1, minStage: 4, description: 'First npm install of a real package' },
      { id: 'specification-writer', label: '📝 Specification Writer',  tier: 'silver', target: 2, minStage: 4, description: 'Use specification-first prompting correctly' },
      { id: 'prompt-perfectionist', label: '✨ Prompt Perfectionist',  tier: 'gold',   target: 3, minStage: 2, description: 'Claude-generated code accepted without edits, 3 times' },
      { id: 'challenger',           label: '⚡ Challenger',            tier: 'gold',   target: 3, minStage: 2, description: 'Complete 3 challenge exercises' },
      { id: 'ship-it',              label: '🚀 Ship It',               tier: 'gold',   target: 1, minStage: 2, description: 'Complete the Build Map and write a README' },
    ],
  },
];

// Flat lookup maps derived from the catalog
const BADGE_BY_ID = /** @type {Record<string, any>} */ ({});
for (const track of BADGE_CATALOG) {
  for (const b of track.badges) {
    BADGE_BY_ID[b.id] = b;
  }
}

const LEVEL_XP_THRESHOLDS = {
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

// ── DOM refs ──────────────────────────────────────────────
const $notStarted        = /** @type {HTMLElement} */ (document.getElementById('not-started'));
const $mainContent       = /** @type {HTMLElement} */ (document.getElementById('main-content'));
const $studentName       = /** @type {HTMLElement} */ (document.getElementById('student-name'));
const $levelBadge        = /** @type {HTMLElement} */ (document.getElementById('level-badge'));
const $xpBar             = /** @type {HTMLElement} */ (document.getElementById('xp-bar'));
const $xpLabel           = /** @type {HTMLElement} */ (document.getElementById('xp-label'));
const $tabNav            = /** @type {HTMLElement} */ (document.getElementById('tab-nav'));
const $panelSession      = /** @type {HTMLElement} */ (document.getElementById('panel-session'));
const $panelBadges       = /** @type {HTMLElement} */ (document.getElementById('panel-badges'));
const $instructionCard   = /** @type {HTMLElement} */ (document.getElementById('instruction-card'));
const $instructionTypeBadge    = /** @type {HTMLElement} */ (document.getElementById('instruction-type-badge'));
const $instructionHeaderLabel  = /** @type {HTMLElement} */ (document.getElementById('instruction-header-label'));
const $instructionText         = /** @type {HTMLElement} */ (document.getElementById('instruction-text'));
const $instructionSubtext      = /** @type {HTMLElement} */ (document.getElementById('instruction-subtext'));
const $reviewCard        = /** @type {HTMLElement} */ (document.getElementById('review-card'));
const $reviewLevelBadge  = /** @type {HTMLElement} */ (document.getElementById('review-level-badge'));
const $reviewQuestion    = /** @type {HTMLElement} */ (document.getElementById('review-question'));
const $reviewAnswer      = /** @type {HTMLTextAreaElement} */ (document.getElementById('review-answer'));
const $hintsUsedLabel    = /** @type {HTMLElement} */ (document.getElementById('hints-used-label'));
const $buildMapList      = /** @type {HTMLElement} */ (document.getElementById('build-map-list'));
const $buildMapProgressLabel = /** @type {HTMLElement} */ (document.getElementById('build-map-progress-label'));
const $badgesSection     = /** @type {HTMLElement} */ (document.getElementById('badges-section'));
const $badgesList        = /** @type {HTMLElement} */ (document.getElementById('badges-list'));
const $badgesInProgress  = /** @type {HTMLElement} */ (document.getElementById('badges-in-progress'));
const $badgesTabLink     = /** @type {HTMLElement} */ (document.getElementById('badges-tab-link'));
const $streakLabel       = /** @type {HTMLElement} */ (document.getElementById('streak-label'));
const $submitBtn         = /** @type {HTMLButtonElement} */ (document.getElementById('submit-btn'));
const $hintBtn           = /** @type {HTMLButtonElement} */ (document.getElementById('hint-btn'));
const $idleHint          = /** @type {HTMLElement} */ (document.getElementById('idle-hint'));
const $badgeCatalog      = /** @type {HTMLElement} */ (document.getElementById('badge-catalog'));

// ── Tab switching ─────────────────────────────────────────
let activeTab = 'session';

$tabNav.addEventListener('click', (e) => {
  const btn = /** @type {HTMLElement} */ (e.target);
  if (!btn.classList.contains('tab-btn')) return;
  switchTab(btn.dataset.tab || 'session');
});

$badgesTabLink.addEventListener('click', () => switchTab('badges'));

function switchTab(tab) {
  activeTab = tab;
  for (const btn of $tabNav.querySelectorAll('.tab-btn')) {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  }
  $panelSession.classList.toggle('hidden', tab !== 'session');
  $panelBadges.classList.toggle('hidden', tab !== 'badges');
}

// ── Event listeners ───────────────────────────────────────
$submitBtn.addEventListener('click', () => {
  const answer = $reviewAnswer.value.trim();
  if (!answer) return;
  vscode.postMessage({ type: 'submitAnswer', answer });
  $reviewAnswer.value = '';
  $submitBtn.disabled = true;
  $submitBtn.textContent = 'Submitted!';
  setTimeout(() => {
    $submitBtn.disabled = false;
    $submitBtn.textContent = 'Submit';
  }, 2000);
});

$hintBtn.addEventListener('click', () => {
  vscode.postMessage({ type: 'requestHint' });
});

$reviewAnswer.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
    $submitBtn.click();
  }
});

// ── Message handler ───────────────────────────────────────
window.addEventListener('message', (event) => {
  const message = event.data;
  if (message.type === 'stateUpdate') {
    render(message.state, message.buildMap, message.setUp, message.levelInfo, message.currentInstruction);
  }
});

// ── Render ────────────────────────────────────────────────
/**
 * @param {object|null} state
 * @param {Array} buildMap
 * @param {boolean} setUp
 * @param {{ level: number, title: string, nextLevelXP: number }} levelInfo
 * @param {{ type: string, text: string, subtext: string }|null} currentInstruction
 */
function render(state, buildMap, setUp, levelInfo, currentInstruction) {
  if (!setUp || !state) {
    $notStarted.classList.remove('hidden');
    $mainContent.classList.add('hidden');
    return;
  }

  $notStarted.classList.add('hidden');
  $mainContent.classList.remove('hidden');

  // Header
  $studentName.textContent = state.studentName || 'You';
  $levelBadge.textContent = `Lv ${levelInfo.level} · ${levelInfo.title}`;

  // XP bar
  const currentLevelXP = LEVEL_XP_THRESHOLDS[levelInfo.level] || 0;
  const nextLevelXP = levelInfo.nextLevelXP;
  const xpInLevel = state.xp - currentLevelXP;
  const xpNeeded = nextLevelXP - currentLevelXP;
  const pct = levelInfo.level >= 10 ? 100 : Math.min(100, Math.round((xpInLevel / xpNeeded) * 100));
  $xpBar.style.width = `${pct}%`;
  $xpLabel.textContent = levelInfo.level >= 10
    ? `${state.xp} XP — Max Level!`
    : `${state.xp} / ${nextLevelXP} XP`;

  // Instruction card
  if (currentInstruction && currentInstruction.text) {
    $instructionCard.classList.remove('hidden');
    const typeLabels = { task: 'Do this', explanation: 'Read this', question: 'Answer this' };
    $instructionTypeBadge.textContent = currentInstruction.type || 'task';
    $instructionHeaderLabel.textContent = typeLabels[currentInstruction.type] || 'Next step';
    $instructionText.textContent = currentInstruction.text;
    $instructionSubtext.textContent = currentInstruction.subtext || '';
    $instructionSubtext.classList.toggle('hidden', !currentInstruction.subtext);
  } else {
    $instructionCard.classList.add('hidden');
  }

  // Review card
  const review = state.pendingReview;
  if (review && review.active && review.question) {
    $reviewCard.classList.remove('hidden');
    $idleHint.classList.add('hidden');
    $reviewLevelBadge.textContent = `L${review.questionLevel}`;
    $reviewQuestion.textContent = review.question;
    const hintsLeft = 3 - (review.hintsUsed || 0);
    $hintsUsedLabel.textContent = hintsLeft > 0
      ? `${hintsLeft} hint${hintsLeft !== 1 ? 's' : ''} remaining`
      : 'No hints remaining';
    $hintBtn.disabled = hintsLeft <= 0;
  } else {
    $reviewCard.classList.add('hidden');
    $idleHint.classList.remove('hidden');
    $reviewAnswer.value = '';
  }

  // Build Map
  const complete = buildMap.filter((/** @type {any} */ i) => i.complete).length;
  const total = buildMap.length;
  $buildMapProgressLabel.textContent = total > 0 ? `${complete} / ${total} complete` : '';
  $buildMapList.innerHTML = '';
  for (const item of buildMap) {
    const li = document.createElement('li');
    li.className = `build-map-item${item.complete ? ' complete' : ''}${item.current ? ' current' : ''}`;

    const indicator = document.createElement('span');
    if (item.complete) {
      indicator.className = 'check-icon';
      indicator.textContent = '✓';
    } else if (item.current) {
      indicator.className = 'current-arrow';
      indicator.textContent = '→';
    } else {
      indicator.className = 'item-num';
      indicator.textContent = `${item.index}.`;
    }

    const text = document.createElement('span');
    text.textContent = item.text;
    li.appendChild(indicator);
    li.appendChild(text);
    $buildMapList.appendChild(li);
  }

  // Badge summary (session panel)
  renderBadgeSummary(state);

  // Badge catalog (badges panel)
  renderBadgeCatalog(state);

  // Streak
  const streak = state.streak || 0;
  $streakLabel.textContent = streak === 1
    ? '1 day streak'
    : streak > 1
    ? `${streak} day streak`
    : 'Start your streak today';
}

// ── Badge summary (session panel) ─────────────────────────
function renderBadgeSummary(state) {
  const earned = state.badges || [];
  const progress = state.badgeProgress || {};
  const inProgressEntries = Object.entries(progress)
    .filter(([, count]) => /** @type {number} */ (count) > 0)
    .sort((a, b) => {
      const ba = BADGE_BY_ID[a[0]];
      const bb = BADGE_BY_ID[b[0]];
      if (!ba || !bb) return 0;
      return (/** @type {number} */ (b[1]) / bb.target) - (/** @type {number} */ (a[1]) / ba.target);
    });

  const hasAnything = earned.length > 0 || inProgressEntries.length > 0;
  $badgesSection.classList.toggle('hidden', !hasAnything);

  // Earned chips
  $badgesList.innerHTML = '';
  for (const id of earned) {
    const def = BADGE_BY_ID[id];
    const el = document.createElement('span');
    el.className = `badge badge--${def ? def.tier : 'bronze'}`;
    el.textContent = def ? def.label : id;
    el.title = def ? def.description : id;
    $badgesList.appendChild(el);
  }

  // In-progress chips
  $badgesInProgress.innerHTML = '';
  for (const [id, count] of inProgressEntries) {
    const def = BADGE_BY_ID[id];
    if (!def) continue;
    const el = document.createElement('div');
    el.className = `badge-progress-row badge-progress-row--${def.tier}`;

    const labelEl = document.createElement('span');
    labelEl.className = 'badge-progress-label';
    labelEl.textContent = def.label;

    const barWrap = document.createElement('div');
    barWrap.className = 'badge-progress-bar-wrap';

    const bar = document.createElement('div');
    bar.className = `badge-progress-bar badge-progress-bar--${def.tier}`;
    bar.style.width = `${Math.min(100, Math.round((/** @type {number} */ (count) / def.target) * 100))}%`;

    const countEl = document.createElement('span');
    countEl.className = 'badge-progress-count';
    countEl.textContent = `${count}/${def.target}`;

    barWrap.appendChild(bar);
    el.appendChild(labelEl);
    el.appendChild(barWrap);
    el.appendChild(countEl);
    $badgesInProgress.appendChild(el);
  }
}

// ── Badge catalog (badges panel) ──────────────────────────
function renderBadgeCatalog(state) {
  const earned = new Set(state.badges || []);
  const progress = state.badgeProgress || {};
  const currentStage = state.currentStage || 0;

  $badgeCatalog.innerHTML = '';

  // Summary line at top
  const total = Object.keys(BADGE_BY_ID).length;
  const earnedCount = earned.size;
  const summary = document.createElement('div');
  summary.className = 'catalog-summary';
  summary.textContent = `${earnedCount} / ${total} earned`;
  $badgeCatalog.appendChild(summary);

  for (const trackDef of BADGE_CATALOG) {
    const section = document.createElement('div');
    section.className = 'catalog-track';

    const header = document.createElement('div');
    header.className = 'catalog-track-header';
    header.textContent = trackDef.track;
    section.appendChild(header);

    const grid = document.createElement('div');
    grid.className = 'catalog-grid';

    for (const badge of trackDef.badges) {
      const isEarned = earned.has(badge.id);
      const isLocked = currentStage < badge.minStage;
      const count = progress[badge.id] || 0;

      const card = document.createElement('div');
      card.title = badge.description;

      if (isEarned) {
        card.className = `catalog-badge catalog-badge--earned catalog-badge--${badge.tier}`;

        const icon = document.createElement('div');
        icon.className = 'catalog-badge-icon';
        icon.textContent = badge.label.split(' ')[0]; // just the emoji

        const name = document.createElement('div');
        name.className = 'catalog-badge-name';
        name.textContent = badge.label.replace(/^\S+\s/, ''); // label without emoji

        const checkEl = document.createElement('div');
        checkEl.className = 'catalog-badge-earned-mark';
        checkEl.textContent = '✓';

        card.appendChild(icon);
        card.appendChild(name);
        card.appendChild(checkEl);

      } else if (isLocked) {
        card.className = 'catalog-badge catalog-badge--locked';

        const icon = document.createElement('div');
        icon.className = 'catalog-badge-icon';
        icon.textContent = '🔒';

        const name = document.createElement('div');
        name.className = 'catalog-badge-name';
        name.textContent = badge.label.replace(/^\S+\s/, '');

        const lockLabel = document.createElement('div');
        lockLabel.className = 'catalog-badge-lock-label';
        lockLabel.textContent = `Stage ${badge.minStage}`;

        card.appendChild(icon);
        card.appendChild(name);
        card.appendChild(lockLabel);

      } else {
        // Available but not yet earned
        card.className = `catalog-badge catalog-badge--available catalog-badge--${badge.tier}`;

        const icon = document.createElement('div');
        icon.className = 'catalog-badge-icon';
        icon.textContent = badge.label.split(' ')[0];

        const name = document.createElement('div');
        name.className = 'catalog-badge-name';
        name.textContent = badge.label.replace(/^\S+\s/, '');

        const barWrap = document.createElement('div');
        barWrap.className = 'catalog-badge-bar-wrap';
        const bar = document.createElement('div');
        bar.className = `catalog-badge-bar catalog-badge-bar--${badge.tier}`;
        bar.style.width = badge.target === 1
          ? '0%'
          : `${Math.round((count / badge.target) * 100)}%`;
        barWrap.appendChild(bar);

        const countEl = document.createElement('div');
        countEl.className = 'catalog-badge-count';
        countEl.textContent = `${count} / ${badge.target}`;

        card.appendChild(icon);
        card.appendChild(name);
        card.appendChild(barWrap);
        card.appendChild(countEl);
      }

      grid.appendChild(card);
    }

    section.appendChild(grid);
    $badgeCatalog.appendChild(section);
  }
}

// Tell the extension we're ready
vscode.postMessage({ type: 'ready' });
