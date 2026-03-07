// @ts-check
'use strict';

const vscode = acquireVsCodeApi();

const BADGE_LABELS = {
  'first-commit': '🎯 First Commit',
  'bug-squasher': '🐛 Bug Squasher',
  'explain-it-back': '💬 Explain-It-Back',
  librarian: '📚 The Librarian',
  'ship-it': '🚀 Ship It',
  'prompt-perfectionist': '✨ Prompt Perfectionist',
  challenger: '⚡ Challenger',
  'rubber-duck': '🦆 Rubber Duck',
};

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
const $notStarted = /** @type {HTMLElement} */ (document.getElementById('not-started'));
const $mainContent = /** @type {HTMLElement} */ (document.getElementById('main-content'));
const $studentName = /** @type {HTMLElement} */ (document.getElementById('student-name'));
const $levelBadge = /** @type {HTMLElement} */ (document.getElementById('level-badge'));
const $xpBar = /** @type {HTMLElement} */ (document.getElementById('xp-bar'));
const $xpLabel = /** @type {HTMLElement} */ (document.getElementById('xp-label'));
const $reviewCard = /** @type {HTMLElement} */ (document.getElementById('review-card'));
const $reviewLevelBadge = /** @type {HTMLElement} */ (document.getElementById('review-level-badge'));
const $reviewQuestion = /** @type {HTMLElement} */ (document.getElementById('review-question'));
const $reviewAnswer = /** @type {HTMLTextAreaElement} */ (document.getElementById('review-answer'));
const $hintsUsedLabel = /** @type {HTMLElement} */ (document.getElementById('hints-used-label'));
const $buildMapList = /** @type {HTMLElement} */ (document.getElementById('build-map-list'));
const $buildMapProgressLabel = /** @type {HTMLElement} */ (document.getElementById('build-map-progress-label'));
const $badgesSection = /** @type {HTMLElement} */ (document.getElementById('badges-section'));
const $badgesList = /** @type {HTMLElement} */ (document.getElementById('badges-list'));
const $streakLabel = /** @type {HTMLElement} */ (document.getElementById('streak-label'));
const $submitBtn = /** @type {HTMLButtonElement} */ (document.getElementById('submit-btn'));
const $hintBtn = /** @type {HTMLButtonElement} */ (document.getElementById('hint-btn'));

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
  // Ctrl+Enter or Cmd+Enter to submit
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
    $submitBtn.click();
  }
});

// ── Message handler ───────────────────────────────────────
window.addEventListener('message', (event) => {
  const message = event.data;
  if (message.type === 'stateUpdate') {
    render(message.state, message.buildMap, message.setUp, message.levelInfo);
  }
});

// ── Render ────────────────────────────────────────────────
/**
 * @param {object|null} state
 * @param {Array} buildMap
 * @param {boolean} setUp
 * @param {{ level: number, title: string, nextLevelXP: number }} levelInfo
 */
function render(state, buildMap, setUp, levelInfo) {
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

  // Review card
  const review = state.pendingReview;
  if (review && review.active && review.question) {
    $reviewCard.classList.remove('hidden');
    $reviewLevelBadge.textContent = `L${review.questionLevel}`;
    $reviewQuestion.textContent = review.question;
    const hintsLeft = 3 - (review.hintsUsed || 0);
    $hintsUsedLabel.textContent = hintsLeft > 0
      ? `${hintsLeft} hint${hintsLeft !== 1 ? 's' : ''} remaining`
      : 'No hints remaining';
    $hintBtn.disabled = hintsLeft <= 0;
  } else {
    $reviewCard.classList.add('hidden');
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

  // Badges
  const badges = state.badges || [];
  if (badges.length > 0) {
    $badgesSection.classList.remove('hidden');
    $badgesList.innerHTML = '';
    for (const badge of badges) {
      const el = document.createElement('span');
      el.className = 'badge';
      el.textContent = BADGE_LABELS[badge] || badge;
      el.title = badge;
      $badgesList.appendChild(el);
    }
  } else {
    $badgesSection.classList.add('hidden');
  }

  // Streak
  const streak = state.streak || 0;
  $streakLabel.textContent = streak === 1
    ? '1 day streak'
    : streak > 1
    ? `${streak} day streak`
    : 'Start your streak today';
}

// Tell the extension we're ready
vscode.postMessage({ type: 'ready' });
