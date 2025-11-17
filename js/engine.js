// Math Quest – Mental Math Trainer
// File: js/engine.js
// Role: Core game engine. Manages question generation, timing, streaks, scoring,
//       level progression, and summary calculations.

"use strict";

// --- Core game engine ---

let timerInterval = null;
let timerRemaining = 10;

function startQuestionTimer() {
  stopTimer();
  timerRemaining = 10;
  timerLabel.style.animation = "";
  timerLabel.textContent = `⏱️ ${timerRemaining}s`;
  timerLabel.classList.remove("timer-warning");

  timerInterval = setInterval(() => {
    timerRemaining--;
    timerLabel.textContent = `⏱️ ${timerRemaining}s`;

    if (timerRemaining === 3) {
      timerLabel.classList.add("timer-warning");
    }
    if (timerRemaining === 1) {
      timerLabel.classList.add("timer-warning-final");
    }

    if (timerRemaining <= 0) {
      // Stop any timer warning animations before triggering timeout feedback
      timerLabel.classList.remove("timer-warning");
      timerLabel.classList.remove("timer-warning-final");

      stopTimer();
      handleTimeout();
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = null;
  timerLabel.classList.remove("timer-warning");
  timerLabel.classList.remove("timer-warning-final");
  timerLabel.style.animation = "";
}

function startLevel(levelIndex) {
  state.currentLevelIndex = levelIndex;
  state.questionIndex = 0;
  state.correctCount = 0;
  state.bestStreak = 0;
  state.currentStreak = 0;
  state.answersThisLevel = 0;
  state.currentQuestion = null;

  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";
  streakLabel.textContent = "🔥 Streak: 0";

  questionProgress.style.width = "0%";

  const level = LEVELS[state.currentLevelIndex];
  levelBadge.textContent = `${level.emoji} Level ${level.id} · ${level.difficulty}`;
  gameMeta.textContent = `Question 1 of ${level.questions}`;

  switchScreen("gameScreen");
  askNextQuestion();
}

function askNextQuestion() {
 const questionCard = document.getElementById("questionCard");

// Reset any previous shake animation before showing a new question
questionCard.style.animation = "";

const level = LEVELS[state.currentLevelIndex];
  if (state.questionIndex >= level.questions) {
    endLevel();
    return;
  }

  const q = generateQuestion(level);
  state.currentQuestion = q;
  questionLocked = false;

  questionText.textContent = q.text;
  questionSub.textContent = "Tap the correct answer:";
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";

  const pct = Math.round((state.questionIndex / level.questions) * 100);
  questionProgress.style.width = pct + "%";
  gameMeta.textContent = `Question ${
    state.questionIndex + 1
  } of ${level.questions}`;

  questionCard.classList.remove("bump");
  void questionCard.offsetWidth; // reflow
  questionCard.classList.add("bump");

  optionsGrid.innerHTML = "";
  q.options.forEach((value, idx) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.innerHTML = `
      <span class="option-label">${String.fromCharCode(65 + idx)}</span>
      <span>${value}</span>
    `;
    btn.addEventListener("click", () => handleAnswer(btn, value));
    optionsGrid.appendChild(btn);
  });

  startQuestionTimer();
}

function generateQuestion(level) {
  const op = level.ops[randInt(0, level.ops.length - 1)];
  let a, b, correct;

  if (op === "+") {
    a = randInt(0, level.max);
    b = randInt(0, level.max);
    correct = a + b;
  } else if (op === "-") {
    a = randInt(0, level.max);
    b = randInt(0, level.max);
    if (b > a) [a, b] = [b, a];
    correct = a - b;
  } else if (op === "×") {
    a = randInt(0, level.max);
    b = randInt(0, level.max);
    correct = a * b;
  } else if (op === "÷") {
    b = randInt(1, level.max);
    const quotient = randInt(1, level.max);
    a = b * quotient;
    correct = a / b;
  } else {
    a = 0;
    b = 0;
    correct = 0;
  }

  const text =
    op === "×"
      ? `${a} × ${b} = ?`
      : op === "÷"
      ? `${a} ÷ ${b} = ?`
      : `${a} ${op} ${b} = ?`;

  const optionsSet = new Set();
  optionsSet.add(correct);

  while (optionsSet.size < 4) {
    const delta = randInt(-5, 5);
    let candidate = correct + delta;
    if (candidate < 0) candidate = Math.abs(candidate);
    if (candidate === correct) continue;
    optionsSet.add(candidate);
  }

  const options = shuffleArray(Array.from(optionsSet));

  return {
    text,
    correct,
    options,
  };
}

function handleAnswer(btn, chosenValue) {
  if (!state.currentQuestion || questionLocked) return;
  questionLocked = true;
  stopTimer();

  const correct = state.currentQuestion.correct;
  setOptionsDisabled(true);

  state.answersThisLevel++;

  if (chosenValue === correct) {
    btn.classList.add("correct");
    showFeedback("Nice! That’s correct 🎉", true);
    state.correctCount++;
    state.currentStreak++;
    if (state.currentStreak > state.bestStreak) {
      state.bestStreak = state.currentStreak;
    }
  } else {
    btn.classList.add("wrong");
    showFeedback(`Almost! The answer was ${correct}.`, false);
    state.currentStreak = 0;
    highlightCorrectOption(correct);
  }

  streakLabel.textContent = `🔥 Streak: ${state.currentStreak}`;

  // Always wait 1400ms before moving to the next question,
  // regardless of correct/incorrect
  setTimeout(() => {
    state.questionIndex++;
    setOptionsDisabled(false);
    askNextQuestion();
  }, 1400);
}

function handleTimeout() {
  if (questionLocked || !state.currentQuestion) return;
  questionLocked = true;

setTimeout(() => {
  const questionCard = document.getElementById("questionCard");
  if (questionCard) {
    // Remove the bump animation so shake can take over
    questionCard.classList.remove("bump");

    questionCard.classList.add("shake-card");
    setTimeout(() => questionCard.classList.remove("shake-card"), 600);
  }
}, 50);

  setOptionsDisabled(true);
  state.answersThisLevel++;
  state.currentStreak = 0;
  streakLabel.textContent = `🔥 Streak: ${state.currentStreak}`;

// Delay ALL DOM updates so shake animation can play first
setTimeout(() => {
  showFeedback(
    `Time's up. The answer was ${state.currentQuestion.correct}.`,
    false
  );

  highlightCorrectOption(state.currentQuestion.correct);
}, 700);

  setTimeout(() => {
    state.questionIndex++;
    setOptionsDisabled(false);
    askNextQuestion();
  }, 3500);
}

function endLevel() {
  stopTimer();
  const level = LEVELS[state.currentLevelIndex];
  const accuracy =
    state.answersThisLevel === 0
      ? 0
      : Math.round((state.correctCount / state.answersThisLevel) * 100);

  // Stars: 0 for 0% accuracy; otherwise 1–3 based on thresholds
  let starsEarned = 0;
  if (accuracy >= 90) {
    starsEarned = 3;
  } else if (accuracy >= 70) {
    starsEarned = 2;
  } else if (accuracy > 0) {
    starsEarned = 1;
  }

  const previousStars = state.progress.starsByLevel[level.id] || 0;
  const deltaStars = Math.max(0, starsEarned - previousStars);

  state.progress.starsByLevel[level.id] = Math.max(previousStars, starsEarned);
  state.progress.totalStars += deltaStars;

  updateLeaderboardForCurrentPlayer();

  if (
    level.id === state.progress.highestLevelUnlocked &&
    state.currentLevelIndex < LEVELS.length - 1 &&
    starsEarned >= 2
  ) {
    state.progress.highestLevelUnlocked = level.id + 1;
  }

  saveProgress();
  renderLevelGrid();
  updateXPBar();
  renderLeaderboard();

  summaryTitle.textContent = `Level ${level.id} complete! ${level.emoji}`;
  if (starsEarned === 3) {
    summarySubtitle.textContent =
      "Excellent accuracy. Ready for a tougher set?";
  } else if (starsEarned === 2) {
    summarySubtitle.textContent =
      "Solid work. A little more focus and you’ll hit 3 stars.";
  } else if (starsEarned === 1) {
    summarySubtitle.textContent =
      "Good effort. Replay this level to strengthen your skills.";
  } else {
    summarySubtitle.textContent =
      "Tough round. Try again to start collecting stars.";
  }

  summaryStars.innerHTML = "";
  for (let i = 1; i <= 3; i++) {
    const span = document.createElement("span");
    if (i <= starsEarned) {
      span.textContent = "★";
      span.className = "star-filled";
    } else {
      span.textContent = "☆";
      span.className = "star-empty";
    }
    summaryStars.appendChild(span);
  }

  // Trigger 3-star animation when all stars are earned
  if (starsEarned === 3) {
    summaryStars.classList.remove("three-star-win");
    void summaryStars.offsetWidth;
    summaryStars.classList.add("three-star-win");
  } else {
    summaryStars.classList.remove("three-star-win");
  }

  summaryAccuracy.textContent = `${accuracy}% correct`;
  summarySpeed.textContent = `${state.answersThisLevel} question${
    state.answersThisLevel === 1 ? "" : "s"
  } answered`;
  summaryBestStreak.textContent = `🔥 x${state.bestStreak}`;
  summaryTotalStars.textContent = `${state.progress.totalStars} ⭐`;


  if (starsEarned === 3 && typeof triggerConfetti === "function") {
    triggerConfetti();
  }

  if (
    state.currentLevelIndex >= LEVELS.length - 1 ||
    state.progress.highestLevelUnlocked <= LEVELS[state.currentLevelIndex].id
  ) {
    nextLevelBtn.style.display = "none";
  } else {
    nextLevelBtn.style.display = "inline-flex";
  }

  switchScreen("summaryScreen");
}

function goToMenu() {
  stopTimer();

  // Re-render UI based on the current player's progress
  renderLevelGrid();
  updateXPBar();
  renderRecentPlayers();

  if (playerNameInput) {
    playerNameInput.value = state.playerName;
  }

  switchScreen("startScreen");
}
