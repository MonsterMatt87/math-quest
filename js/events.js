// Math Quest – Mental Math Trainer
// File: js/events.js
// Role: Wiring for all user interactions – button clicks, answer selection,
//       start/reset actions, and theme toggling.

"use strict";

// --- DOM references ---
const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const summaryScreen = document.getElementById("summaryScreen");

const playerNameInput = document.getElementById("playerName");
const startBtn = document.getElementById("startBtn");
const resetProgressBtn = document.getElementById("resetProgressBtn");
const clearPlayersBtn = document.getElementById("clearPlayersBtn");
const resumeHint = document.getElementById("resumeHint");
const recentPlayersEl = document.getElementById("recentPlayers");
const recentPlayersList = document.getElementById("recentPlayersList");
const levelGrid = document.getElementById("levelGrid");
const xpBar = document.getElementById("xpBar");
const xpLabel = document.getElementById("xpLabel");
const playerPillName = document.getElementById("playerPillName");

const levelBadge = document.getElementById("levelBadge");
const gameMeta = document.getElementById("gameMeta");
const questionProgress = document.getElementById("questionProgress");
const questionCard = document.getElementById("questionCard");
const questionText = document.getElementById("questionText");
const questionSub = document.getElementById("questionSub");
const optionsGrid = document.getElementById("optionsGrid");
const feedbackEl = document.getElementById("feedback");
const timerLabel = document.getElementById("timerLabel");
const streakLabel = document.getElementById("streakLabel");
const backToMenuBtn = document.getElementById("backToMenuBtn");

const summaryTitle = document.getElementById("summaryTitle");
const summarySubtitle = document.getElementById("summarySubtitle");
const summaryStars = document.getElementById("summaryStars");
const summaryAccuracy = document.getElementById("summaryAccuracy");
const summarySpeed = document.getElementById("summarySpeed");
const summaryBestStreak = document.getElementById("summaryBestStreak");
const summaryTotalStars = document.getElementById("summaryTotalStars");
const nextLevelBtn = document.getElementById("nextLevelBtn");
const replayLevelBtn = document.getElementById("replayLevelBtn");
const toMenuBtn = document.getElementById("toMenuBtn");

const confetti = document.getElementById("confetti");
const leaderboardEl = document.getElementById("leaderboard");
const leaderboardList = document.getElementById("leaderboardList");

// --- Event wiring ---
startBtn.addEventListener("click", () => {
  const newName = playerNameInput.value.trim();
  if (!newName) {
    alert("Please enter a player name to start.");
    return;
  }

  // Check if this player already exists
  const existing = profiles.find((p) => p.name === newName);

  if (existing) {
    state.playerName = existing.name;
    state.progress = existing.progress;
  } else {
    state.playerName = newName;
    state.progress = {
      highestLevelUnlocked: 1,
      starsByLevel: {},
      totalStars: 0,
    };
  }

  playerPillName.textContent = state.playerName || "-";
  saveProgress();

  const firstLevelIndex =
    state.progress.highestLevelUnlocked > 1
      ? state.progress.highestLevelUnlocked - 1
      : 0;

  startLevel(firstLevelIndex);

  // Optional celebratory confetti when starting an adventure
  if (typeof triggerConfetti === "function") {
    triggerConfetti();
  }
});

resetProgressBtn.addEventListener("click", () => {
  if (
    confirm(
      "Reset progress for this player? Stars and unlocked levels for this player will be cleared."
    )
  ) {
    resetProgress();
  }
});

if (clearPlayersBtn) {
  clearPlayersBtn.addEventListener("click", () => {
    if (
      confirm("Remove all saved players and their progress from this device?")
    ) {
      clearAllPlayers();
    }
  });
}

backToMenuBtn.addEventListener("click", goToMenu);
toMenuBtn.addEventListener("click", goToMenu);

replayLevelBtn.addEventListener("click", () => {
  startLevel(state.currentLevelIndex);
});

nextLevelBtn.addEventListener("click", () => {
  const nextIndex = Math.min(LEVELS.length - 1, state.currentLevelIndex + 1);
  startLevel(nextIndex);
});

// --- Initial load ---
loadProgress();
playerPillName.textContent = state.playerName || "-";
renderLevelGrid();
updateXPBar();
renderRecentPlayers();
renderLeaderboard();

if (
  state.progress.totalStars > 0 ||
  state.progress.highestLevelUnlocked > 1
) {
  resumeHint.style.display = "block";
}

// --- Theme toggle ---
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

// Load initial theme
const savedTheme = localStorage.getItem("mqTheme");
if (savedTheme === "light") {
  document.body.classList.add("light");
  if (themeIcon) themeIcon.textContent = "☀️";
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light");

    const isLight = document.body.classList.contains("light");
    localStorage.setItem("mqTheme", isLight ? "light" : "dark");

    if (themeIcon) {
      themeIcon.classList.add("morph");
      setTimeout(() => themeIcon.classList.remove("morph"), 350);
      themeIcon.textContent = isLight ? "☀️" : "🌙";
    }
  });
}
