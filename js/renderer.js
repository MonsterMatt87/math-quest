"use strict";

// --- Rendering / UI functions ---

function updateXPBar() {
  const totalPossibleStars = LEVELS.length * 3;
  const fraction =
    totalPossibleStars === 0
      ? 0
      : state.progress.totalStars / totalPossibleStars;
  const pct = Math.min(100, Math.round(fraction * 100));
  xpBar.style.width = pct + "%";
  xpLabel.textContent = `${state.progress.totalStars} star${
    state.progress.totalStars === 1 ? "" : "s"
  } collected`;
}

function renderLevelGrid() {
  levelGrid.innerHTML = "";
  LEVELS.forEach((level) => {
    const unlocked = state.progress.highestLevelUnlocked >= level.id;
    const stars = state.progress.starsByLevel[level.id] || 0;

    const tile = document.createElement("div");
    tile.className = "level-tile" + (unlocked ? "" : " locked");
    tile.innerHTML = `
      <div class="level-title">
        <span>${level.emoji}</span>
        <span>Level ${level.id} · ${level.name}</span>
      </div>
      <div class="level-meta">
        <span class="level-tag">
          🎯 <span>${level.difficulty}</span>
        </span>
        <span class="stars">
          ${[1, 2, 3]
            .map((i) =>
              i <= stars
                ? `<span class="star-filled">★</span>`
                : `<span class="star-empty">☆</span>`
            )
            .join("")}
        </span>
      </div>
      <div style="margin-top:4px; font-size:11px; color: var(--text-soft); display:flex; justify-content:space-between; align-items:center;">
        <span>Questions: ${level.questions}</span>
        <span>${unlocked ? "Tap to play" : "Locked"}</span>
      </div>
    `;

    if (unlocked) {
      tile.style.cursor = "pointer";
      tile.addEventListener("click", () => {
        startLevel(level.id - 1);
      });
    }

    levelGrid.appendChild(tile);
  });
}

function renderLeaderboard() {
  if (!leaderboardList || !leaderboardEl) return;

  leaderboardList.innerHTML = "";

  if (!leaderboard || leaderboard.length === 0) {
    leaderboardEl.style.display = "none";
    return;
  }

  leaderboardEl.style.display = "block";

  leaderboard.forEach((entry, index) => {
    const row = document.createElement("div");
    row.className = "leaderboard-row";
    if (index < 3) {
      row.classList.add("top3");
    }

    const namePart = document.createElement("div");
    namePart.className = "leaderboard-name";

    // Medal for top 3
    if (index === 0 || index === 1 || index === 2) {
      const medalSpan = document.createElement("span");
      medalSpan.className = "leaderboard-medal";
      if (index === 0) {
        medalSpan.classList.add("gold");
        medalSpan.textContent = "🥇";
      } else if (index === 1) {
        medalSpan.classList.add("silver");
        medalSpan.textContent = "🥈";
      } else if (index === 2) {
        medalSpan.classList.add("bronze");
        medalSpan.textContent = "🥉";
      }
      namePart.appendChild(medalSpan);
    }

    const rankSpan = document.createElement("span");
    rankSpan.className = "leaderboard-rank";
    rankSpan.textContent = index + 1;

    const nameSpan = document.createElement("span");
    nameSpan.textContent = entry.name;

    namePart.appendChild(rankSpan);
    namePart.appendChild(nameSpan);

    const scorePart = document.createElement("div");
    scorePart.className = "leaderboard-score";
    scorePart.textContent = `${entry.totalStars} ⭐`;

    row.appendChild(namePart);
    row.appendChild(scorePart);

    leaderboardList.appendChild(row);
  });
}

function renderRecentPlayers() {
  if (!recentPlayersList || !recentPlayersEl) return;

  recentPlayersList.innerHTML = "";

  if (!profiles || profiles.length === 0) {
    recentPlayersEl.style.display = "none";
    return;
  }

  recentPlayersEl.style.display = "block";

  profiles.forEach((p) => {
    const btn = document.createElement("button");
    btn.className = "secondary small recent-player-btn";
    if (p.name === state.playerName) {
      btn.classList.add("active");
    }
    btn.textContent = p.name;

    btn.addEventListener("click", () => {
      state.playerName = p.name;
      state.progress = p.progress;
      playerPillName.textContent = state.playerName;
      if (playerNameInput) {
        playerNameInput.value = state.playerName;
      }

      // Persist the newly selected current profile and refresh UI
      saveProgress();
      renderLevelGrid();
      updateXPBar();
    });

    recentPlayersList.appendChild(btn);
  });
}

function switchScreen(screenId) {
  [startScreen, gameScreen, summaryScreen].forEach((el) =>
    el.classList.remove("active")
  );
  const target = document.getElementById(screenId);
  if (target) target.classList.add("active");
}