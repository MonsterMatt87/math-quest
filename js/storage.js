"use strict";

// --- Game configuration ---
const LEVELS = [
  {
    id: 1,
    name: "Everyday Arithmetic",
    difficulty: "Warm-up",
    emoji: "🔥",
    ops: ["+", "-"],
    max: 20,
    questions: 10,
  },
  {
    id: 2,
    name: "Larger Sums & Differences",
    difficulty: "Warm-up+",
    emoji: "➕",
    ops: ["+", "-"],
    max: 50,
    questions: 12,
  },
  {
    id: 3,
    name: "Core Multiplication",
    difficulty: "Core skills",
    emoji: "✖️",
    ops: ["×"],
    max: 10,
    questions: 12,
  },
  {
    id: 4,
    name: "Extended Multiplication",
    difficulty: "Core+",
    emoji: "✖️",
    ops: ["×"],
    max: 20,
    questions: 12,
  },
  {
    id: 5,
    name: "Intro Division",
    difficulty: "Challenge",
    emoji: "➗",
    ops: ["÷"],
    max: 10,
    questions: 12,
  },
  {
    id: 6,
    name: "Division Drills",
    difficulty: "Challenge+",
    emoji: "➗",
    ops: ["÷"],
    max: 20,
    questions: 12,
  },
  {
    id: 7,
    name: "Mixed Practice",
    difficulty: "Mixed",
    emoji: "🌗",
    ops: ["+", "-", "×", "÷"],
    max: 50,
    questions: 14,
  },
  {
    id: 8,
    name: "Mixed Challenge",
    difficulty: "Hard",
    emoji: "🌌",
    ops: ["+", "-", "×", "÷"],
    max: 100,
    questions: 15,
  },
  {
    id: 9,
    name: "Fast Mixed Recall",
    difficulty: "Hard+",
    emoji: "⚡",
    ops: ["+", "-", "×", "÷"],
    max: 150,
    questions: 16,
  },
  {
    id: 10,
    name: "Intense Mixed Set",
    difficulty: "Expert",
    emoji: "🚀",
    ops: ["+", "-", "×", "÷"],
    max: 200,
    questions: 18,
  },
];

const STORAGE_KEY = "mathQuestProgress-v1";

// --- Global state (shared across modules) ---
let timerId = null;
let timeLeft = 10;
let questionLocked = false;

let profiles = [];
let leaderboard = [];

let state = {
  playerName: "",
  currentLevelIndex: 0,
  questionIndex: 0,
  correctCount: 0,
  bestStreak: 0,
  currentStreak: 0,
  answersThisLevel: 0,
  currentQuestion: null,
  progress: {
    highestLevelUnlocked: 1,
    starsByLevel: {},
    totalStars: 0,
  },
};

// --- Storage helpers ---
function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);

    // New multi-profile format
    if (parsed && Array.isArray(parsed.profiles) && parsed.profiles.length > 0) {
      profiles = parsed.profiles;
      const currentName = parsed.currentName || parsed.playerName;

      let currentProfile = profiles[0];
      if (currentName) {
        const found = profiles.find((p) => p.name === currentName);
        if (found) currentProfile = found;
      }

      state.playerName = currentProfile.name;
      state.progress = currentProfile.progress || state.progress;
    }
    // Legacy single-profile format
    else if (parsed && parsed.progress) {
      state.progress = parsed.progress;
      if (parsed.playerName) state.playerName = parsed.playerName;
      profiles = [
        {
          name: state.playerName,
          progress: state.progress,
        },
      ];
    }

    if (parsed && Array.isArray(parsed.leaderboard)) {
      leaderboard = parsed.leaderboard;
    }
  } catch (e) {
    console.warn("Could not load progress", e);
  }
}

function saveProgress() {
  try {
    const name = state.playerName;
    const currentProgress = state.progress;

    const existingIndex = profiles.findIndex((p) => p.name === name);
    if (existingIndex >= 0) {
      profiles[existingIndex].progress = currentProgress;
      const [p] = profiles.splice(existingIndex, 1);
      profiles.unshift(p);
    } else {
      profiles.unshift({ name, progress: currentProgress });
    }

    if (profiles.length > 3) {
      profiles = profiles.slice(0, 3);
    }

    const payload = {
      currentName: state.playerName,
      profiles,
      leaderboard,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    console.warn("Could not save progress", e);
  }

  renderRecentPlayers();
}

function resetProgress() {
  // Only reset progress for the current player
  state.progress = {
    highestLevelUnlocked: 1,
    starsByLevel: {},
    totalStars: 0,
  };

  // Update or insert this player in the profiles list
  const idx = profiles.findIndex((p) => p.name === state.playerName);
  if (idx >= 0) {
    profiles[idx].progress = state.progress;
  } else {
    profiles.unshift({ name: state.playerName, progress: state.progress });
    if (profiles.length > 3) {
      profiles = profiles.slice(0, 3);
    }
  }

  updateLeaderboardForCurrentPlayer();
  saveProgress();
  renderLevelGrid();
  updateXPBar();
  renderLeaderboard();
}

function clearAllPlayers() {
  // Do not wipe leaderboard; only clear saved players and current state
  profiles = [];

  state.playerName = "";
  state.progress = {
    highestLevelUnlocked: 1,
    starsByLevel: {},
    totalStars: 0,
  };

  playerPillName.textContent = state.playerName || "-";
  if (playerNameInput) {
    playerNameInput.value = "";
  }

  // Persist empty profiles but keep leaderboard
  try {
    const payload = {
      currentName: state.playerName,
      profiles,
      leaderboard,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    console.warn("Could not save progress when clearing players", e);
  }

  renderLevelGrid();
  updateXPBar();
  renderLeaderboard();
  resumeHint.style.display = "none";
  if (recentPlayersEl) {
    recentPlayersEl.style.display = "none";
  }
}

function updateLeaderboardForCurrentPlayer() {
  const name = state.playerName;
  if (!name) return;
  const total = state.progress.totalStars || 0;

  // Always add a new entry — do NOT replace existing ones
  leaderboard.push({
    name,
    totalStars: total,
  });

  // Sort by score, then name
  leaderboard.sort((a, b) => {
    if (b.totalStars !== a.totalStars) return b.totalStars - a.totalStars;
    return a.name.localeCompare(b.name);
  });

  // Keep top 10 only
  if (leaderboard.length > 10) {
    leaderboard = leaderboard.slice(0, 10);
  }
}