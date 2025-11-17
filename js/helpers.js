// Math Quest – Mental Math Trainer
// File: js/helpers.js
// Role: Small utility functions used across the app (formatting, UI helpers,
//       confetti trigger, highlighting correct options, etc.).

"use strict";

// --- Helper functions ---

function randInt(min, maxInclusive) {
  return Math.floor(Math.random() * (maxInclusive - min + 1)) + min;
}

function shuffleArray(arr) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

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

function setOptionsDisabled(disabled) {
  Array.from(optionsGrid.querySelectorAll(".option-btn")).forEach((btn) => {
    if (disabled) {
      btn.classList.add("disabled");
    } else {
      btn.classList.remove("disabled");
    }
  });
}

function showFeedback(message, isGood) {
  if (!feedbackEl) return;
  feedbackEl.textContent = message;
  // Reset previous state and apply a single style
  feedbackEl.classList.remove("good", "bad");
  if (isGood === true) {
    feedbackEl.classList.add("good");
  } else if (isGood === false) {
    feedbackEl.classList.add("bad");
  }
}

function highlightCorrectOption(correctValue) {
  Array.from(optionsGrid.querySelectorAll(".option-btn")).forEach((btn) => {
    const text = btn.textContent.trim();
    const num = parseInt(text.replace(/[^\d\-]/g, ""), 10);
    if (num === correctValue) {
      btn.classList.add("correct");
    }
  });
}
function triggerConfetti() {
  const container = document.getElementById("confettiContainer");
  if (!container) return;

  const colors = ["#fbbf24", "#22c55e", "#3b82f6", "#ec4899", "#e5e7eb"];
  const pieceCount = 45;

  for (let i = 0; i < pieceCount; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";

    piece.style.left = `${Math.random() * 100}%`;
    piece.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = `${Math.random() * 0.3}s`;

    container.appendChild(piece);

    setTimeout(() => {
      if (piece.parentNode) {
        piece.parentNode.removeChild(piece);
      }
    }, 4300);
  }
}
