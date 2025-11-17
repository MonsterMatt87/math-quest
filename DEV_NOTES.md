# Math Quest – Developer Notes

This document explains how the game is structured under the hood and how to:

- Extend levels  
- Add new operations  
- Tweak difficulty and scoring  

It’s intended for developers who want to modify or extend Math Quest.

---

## 1. Where levels are defined

All level configuration lives in:

js/storage.js

Inside that file you’ll see:

```
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
  // ...
];
```

Each object in LEVELS describes a single level.

Level fields
	•	id
  
Must be a unique integer, and sequential (1, 2, 3, …).

This is used for unlocking and for mapping stars to each level.
	•	name
  
Friendly label shown in the level grid (e.g. “Mixed Challenge”).
	•	difficulty
  
Subtitle shown in the UI (“Warm-up”, “Hard”, “Expert”, etc.).
	•	emoji
  
Visual icon for the level (🔥, ⚡, 🚀, …).
	•	ops
  
An array of operations used in this level.

Currently supported values:
	•	"+" – addition
	•	"-" – subtraction
	•	"×" – multiplication
	•	"÷" – division
	•	max
  
Controls the numeric range for operands (e.g. up to 20, 50, 100).
	•	questions
  
How many questions this level asks before showing the summary.

⸻

## 2. How question generation works

Question generation is handled in:

js/engine.js

Look for:

```

function generateQuestion(level) { ... }

```

It chooses an operator from level.ops and generates (a, b, correct) based on the operator:
	•	For "+" and "-":
  
Random operands between 0 and level.max
	•	For "×":
  
Random operands between 0 and level.max
	•	For "÷":
  
It generates clean divisions by choosing a divisor and quotient, then computing a = b * quotient, so answers are integers.

After that, it builds 4 options:
	•	One correct value
	•	Three nearby values (± up to 5), shuffled

If you add new operations, you must extend generateQuestion to handle them.

⸻

## 3. Adding a new level

To add a new level:

1.	Open js/storage.js
  
2.	Find the LEVELS array
  
3.	Append a new object at the end, e.g.:
  

```

{
  id: 11,
  name: "Expert Mixed Marathon",
  difficulty: "Master",
  emoji: "🏆",
  ops: ["+", "-", "×", "÷"],
  max: 300,
  questions: 20,
},

```

4.	Make sure:

•	id is exactly LEVELS.length + 1

•	You don’t have duplicate IDs

•	ops only contains operations supported by generateQuestion

The UI (level grid, XP bar, etc.) will automatically:

•	Show the new level in the grid
  
•	Count its stars in the XP bar
  
•	Allow unlocking when performance conditions are met (see below)

⸻

## 4. Changing difficulty of existing levels

Difficulty for each level is mainly controlled by:

•	ops – which operations (addition only vs mixed, etc.)
  
•	max – how large the numbers are
  
•	questions – how many questions per level

Examples

•	To make Level 1 easier:

```

max: 10,
questions: 8,

```

•	To make Level 10 harder:

```

max: 300,
questions: 20,

```

You can also change ops to force certain skill types, e.g.:

•	Pure division drills:

```

ops: ["÷"]

```

•	Mixed addition + subtraction:

```

ops: ["+", "-"]

```

## 5. Unlocking behavior and star thresholds

Unlocking and stars logic lives in endLevel():

```

// js/engine.js

// Stars: 0 for 0% accuracy; otherwise 1–3 based on thresholds
let starsEarned = 0;
if (accuracy >= 90) {
  starsEarned = 3;
} else if (accuracy >= 70) {
  starsEarned = 2;
} else if (accuracy > 0) {
  starsEarned = 1;
}

```

Adjusting star thresholds

To make 3 stars easier, for example:

```

if (accuracy >= 85) {
  starsEarned = 3;
} else if (accuracy >= 60) {
  starsEarned = 2;
} else if (accuracy > 0) {
  starsEarned = 1;
}

```

Unlocking the next level

Still inside endLevel():

```

if (
  level.id === state.progress.highestLevelUnlocked &&
  state.currentLevelIndex < LEVELS.length - 1 &&
  starsEarned >= 2
) {
  state.progress.highestLevelUnlocked = level.id + 1;
}

```

This means:

•	You must earn at least 2 stars

•	On your highest unlocked level

•	Then the next level unlocks

To require 3 stars to unlock:

```

starsEarned >= 3

```

## 6. Adding a new operation (e.g. exponents or percentages)

Right now, the engine supports "+", "-", "×", "÷".

If you want to add a new operator, say "^" for powers:

1.	Update level configs to include "^" in ops for relevant levels

2.	Extend generateQuestion(level):

```

} else if (op === "^") {
  // Example: a^b with small exponents
  a = randInt(2, 5);
  b = randInt(2, 3);
  correct = Math.pow(a, b);
}

```

3.	Make sure:

•	Results are not too large

•	Options remain reasonable (you may want to adjust the ±5 delta)

⚠️ Tip: For non-integer or more complex operations (percentages, decimals), you may also want to tweak how options are generated and formatted.

## 7. Tuning the timer and pacing

In js/engine.js, timing logic is in:

```

function startQuestionTimer() { ... }
function handleAnswer(...) { ... }
function handleTimeout() { ... }

```

Key controls:

•	Time per question: timerRemaining = 10;

•	Delay before moving to the next question on answer:

```

setTimeout(() => {
  state.questionIndex++;
  setOptionsDisabled(false);
  askNextQuestion();
}, 1400);

```

•	Delay before moving on after timeout:

```

setTimeout(() => {
  state.questionIndex++;
  setOptionsDisabled(false);
  askNextQuestion();
}, 3500);

```

You can tweak these values to make the game feel faster or more relaxed.

⸻

## 8. Where to look for specific behaviors

•	Question generation:

js/engine.js → generateQuestion(level)

•	Per-question flow / timing / feedback:

js/engine.js → askNextQuestion, handleAnswer, handleTimeout

•	Level summary, stars, and unlocks:

js/engine.js → endLevel

•	Levels grid, leaderboard, recent players:

js/renderer.js

•	Saving/loading profiles + leaderboard:

js/storage.js → loadProgress, saveProgress, updateLeaderboardForCurrentPlayer

## 9. Safe experiments

If you’re experimenting with difficulty or features:

•	Add a new level at the end instead of editing existing ones, so you can compare.

•	Change only one thing at a time:

•	max

•	questions

•	star thresholds

•	Test with a fresh player (use “Remove all players” in the UI) to see the full unlock flow.

⸻

Happy hacking!

If you extend Math Quest with new modes, operations, or visual effects, consider documenting them here so future contributors can follow the logic. 🚀
