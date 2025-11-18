## 📘 Math Quest – Mental Math Trainer

Math Quest is an interactive browser-based mental-math game designed for adults.

It features progressive difficulty, levels, stars, player profiles, streak tracking, particle confetti, animations, and a beautiful light/dark theme toggle.

Play it online via GitHub Pages or host it yourself — no backend required.

⸻

## 🚀 Live Demo

https://MonsterMatt87.github.io/math-quest/

⸻

## 🎮 Features

## ⭐ Gameplay

	•	10 levels with increasing difficulty
	•	Multiple-choice questions
	•	Timed questions with visual countdown
	•	Streak tracking and accuracy scoring
	•	XP bar and total stars progression
	•	1–3 star awards per level
	•	Summary screen with animated particle confetti

## 👤 Player System

	•	Create named players
	•	Automatic progress saving
	•	Switch between last 3 players
	•	Persistent leaderboard
	•	“Danger zone” UI for reset actions

## 🎨 Visual polish

	•	Smooth animations
	•	Level-up transitions
	•	Confetti particle effects
	•	Card shake on timeout
	•	Light/dark theme toggle
	•	Professional UI designed for adults

⸻

## 🗂️ Project Structure

```
math-quest/
├── index.html
│
├── styles/
│   ├── base.css
│   ├── layout.css
│   ├── cards.css
│   ├── buttons.css
│   ├── levels.css
│   ├── xp.css
│   ├── leaderboard.css
│   ├── game.css
│   ├── summary.css
│   ├── animations.css
│   ├── theme-dark.css
│   └── theme-light.css
│
├── js/
    ├── storage.js
    ├── helpers.js
    ├── renderer.js
    ├── engine.js
    └── events.js
 

```

### Favicon

```

The project includes a custom glowing division symbol favicon (`favicon.png`), which appears in the browser tab when running via GitHub Pages or locally.

To change it, replace the file in the project root:

```

/favicon.png

```

The favicon is automatically loaded through the `<link rel="icon">` tag inside `index.html`.

```

⸻

## 🧱 Architecture Overview

Math Quest is a small, modular front-end app built with **vanilla JavaScript**, **HTML**, and **CSS**, structured into clear layers:

```
                ┌──────────────────────────┐
                │        index.html        │
                │  (screens + root layout) │
                └────────────┬─────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
 ┌───────▼───────┐   ┌───────▼───────┐   ┌───────▼────────┐
 │   CSS Layer   │   │  Rendering &  │   │  Game Logic &  │
 │ (styles/*.css)│   │    UI Layer   │   │   State Layer  │
 └───────┬───────┘   │  (renderer.js)│   │ (engine.js,    │
         │           └───────┬───────┘   │  storage.js)   │
         │                   │           └───────┬────────┘
         │                   │                   │
         │           ┌───────▼────────┐          │
         │           │  Events Layer  │          │
         │           │  (events.js)   │──────────┘
         │           └───────┬────────┘
         │                   │
         │           ┌───────▼────────┐
         └──────────▶│ Helper Utils   │
                     │ (helpers.js)   │
                     └────────────────┘

```

Key Modules

	•	index.html
	
Defines the three main screens:

	•	Start screen (sign-in, levels, leaderboard)

	•	Game screen (questions, options, timer, streak)

	•	Summary screen (stars + stats after each level)
	
It also wires in all CSS and JS modules in a clear order.

CSS (styles/*.css)

	•	base.css – global tokens (colors, radii, typography)

	•	layout.css – shell, header, and responsive layout

	•	cards.css, buttons.css, game.css, levels.css, leaderboard.css, summary.css – component styles

	•	animations.css – keyframes (shake, timers, confetti, stars)

	•	theme-dark.css, theme-light.css – dark/light mode overrides

	•	xp.css – XP bar and progress visuals

js/storage.js

	•	Defines the LEVELS configuration (all levels, operations, ranges, and question counts).

	•	Manages profiles, progress, and leaderboard, persisted in localStorage.

	•	Exposes helpers like loadProgress(), saveProgress(), resetProgress(), and updateLeaderboardForCurrentPlayer().

js/engine.js

	•	Core game engine: question generation, timers, scoring, streaks, accuracy, stars, and level completion.

	•	Controls the flow between questions (askNextQuestion, handleAnswer, handleTimeout, endLevel).

js/renderer.js

	•	Handles UI updates: level grid, XP bar, recent players, leaderboard, and screen switching (switchScreen).

js/events.js

	•	Wires up all user interactions:

	•	Start button → create/select player → start level

	•	Danger zone buttons → reset progress / clear players

	•	Summary actions → next level, replay, back to menu

	•	Theme toggle → switch between dark and light modes

js/helpers.js

	•	Utility functions: random helpers (randInt, shuffleArray), feedback handling, answer highlighting, plus the confetti particle trigger.

⸻

Developer Notes

For deeper details on:

	•	How to add or change levels
	
	•	How to add new operations (+, −, ×, ÷, etc.)

	•	How to tune difficulty, timers, and star thresholds

See the developer documentation here: 

👉 **[DEV_NOTES.md](https://github.com/MonsterMatt87/math-quest/blob/main/DEV_NOTES.md)**

⸻

## 📦 Install & Run Locally

Clone the repository:
git clone https://github.com/MonsterMatt87/math-quest.git

cd math-quest

Open index.html in any browser.

That’s it!

⸻

## 🌐 Hosting via GitHub Pages

	1.	Go to your repository
	2.	Settings → Pages
	3.	Source: Deploy from a branch
	4.	Branch: main, Folder: root
	5.	Save
	6.	Wait ~30 seconds

Your game is now online!

⸻

## 🛠️ Technologies Used

	•	HTML5
	•	CSS3 (modular stylesheets, animations, themes)
	•	Vanilla JavaScript (no frameworks)
	•	LocalStorage for saves
	•	GitHub Pages for hosting

⸻

## 🤝 Contributing

Pull requests are welcome!
If you’d like to add features, improve UI, or optimize animations, feel free to open an issue first.

⸻

## 📜 License

This project is open-source under the MIT License — free to use, modify, and share.

⸻
