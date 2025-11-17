// Math Quest – Mental Math Trainer
// File: js/helpers.js
// Role: Small utility functions used across the app (formatting, UI helpers,
//       confetti trigger, highlighting correct options, etc.).

"use strict";

// ============================================================
//  🎲 RANDOM UTILITIES – integers + array shuffle
// ============================================================

/**
 * Returns a random integer between min and maxInclusive.
 */
function randInt(min, maxInclusive) {
  return Math.floor(Math.random() * (maxInclusive - min + 1)) + min;
}

/**
 * Shuffles an array using Fisher–Yates and returns a new copy.
 */
function shuffleArray(arr) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}


// ============================================================
//  ⏱️ TIMER HELPERS – legacy fallback versions
//  (Used by older logic paths; new engine timer lives in engine.js)
// ============================================================

function stopTimer() {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }
  if (timerLabel) {
    timerLabel.classList.remove("timer-warning");
  }
}

function startQuestionTimer() {
  stopTimer();
  timeLeft = 10;

  if (timerLabel) {
    timerLabel.classList.remove("timer-warning");
    timerLabel.textContent = `⏱ ${timeLeft}s`;
  }

  timerId = setInterval(() => {
    timeLeft--;

    if (timerLabel) {
      const display = timeLeft < 0 ? 0 : timeLeft;
      timerLabel.textContent = `⏱ ${display}s`;

      if (timeLeft <= 3 && timeLeft >= 0) {
        timerLabel.classList.add("timer-warning");
      } else {
        timerLabel.classList.remove("timer-warning");
      }
    }

    if (timeLeft <= 0) {
      stopTimer();
      handleTimeout();
    }
  }, 1000);
}


// ============================================================
//  🎛️ UI TOGGLES – Enable/disable answer buttons
// ============================================================

/**
 * Adds or removes the .disabled class on all option buttons.
 */
function setOptionsDisabled(disabled) {
  Array.from(optionsGrid.querySelectorAll(".option-btn")).forEach((btn) => {
    if (disabled) {
      btn.classList.add("disabled");
    } else {
      btn.classList.remove("disabled");
    }
  });
}


// ============================================================
//  💬 FEEDBACK TEXT – Good/Bad answer messaging
// ============================================================

/**
 * Shows feedback below the question card, styled as good or bad.
 */
function showFeedback(message, isGood) {
  if (!feedbackEl) return;

  feedbackEl.textContent = message;

  // Reset previous state and apply a single correct class
  feedbackEl.classList.remove("good", "bad");

  if (isGood === true) {
    feedbackEl.classList.add("good");
  } else if (isGood === false) {
    feedbackEl.classList.add("bad");
  }
}


// ============================================================
//  🎯 CORRECT ANSWER HIGHLIGHT
// ============================================================

/**
 * Highlights whichever option matches the correct numeric answer.
 */
function highlightCorrectOption(correctValue) {
  Array.from(optionsGrid.querySelectorAll(".option-btn")).forEach((btn) => {
    const text = btn.textContent.trim();
    const num = parseInt(text.replace(/[^\d\-]/g, ""), 10);

    if (num === correctValue) {
      btn.classList.add("correct");
    }
  });
}


// ============================================================
//  🎉 CONFETTI PARTICLES – Falling animated celebration pieces
// ============================================================

/**
 * Creates falling confetti using randomly colored divs with CSS animations.
 * Automatically cleans each piece after animation ends.
 */
function triggerConfetti() {
  const container = document.getElementById("confettiContainer");
  if (!container) return;

  const colors = ["#fbbf24", "#22c55e", "#3b82f6", "#ec4899", "#e5e7eb"];
  const pieceCount = 45;

  for (let i = 0; i < pieceCount; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";

    // Random horizontal starting position
    piece.style.left = `${Math.random() * 100}%`;

    // Random color from palette
    piece.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];

    // Random slight animation delay
    piece.style.animationDelay = `${Math.random() * 0.3}s`;

    container.appendChild(piece);

    // Auto-remove after animation completes
    setTimeout(() => {
      if (piece.parentNode) {
        piece.parentNode.removeChild(piece);
      }
    }, 4300);
  }
}
