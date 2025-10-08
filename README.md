# Interactive Search Algorithm Visualizer (DFS • BFS • A*)

A lightweight, front-end teaching tool for exploring classic graph search algorithms.  
Animate traversals, compare strategies, and practice with quiz-style activities — all in the browser.

> Pages included: `index.html`, `dfs_activity.html`, `bfs_activity.html`, `astar_activity.html`, and a simple `maze.html` demo.

---

## ✨ Features

- **Clickable, animated graph visualizations** for DFS, BFS, and A*.
- **Step-through controls** to follow each algorithm’s decisions.
- **Pseudocode view** that syncs with the current step (great for teaching).
- **Guided activities / quizzes** to predict traversal orders.
- **A*** supports **edge weights** and **heuristic values** to show `g`, `h`, and `f` costs as it searches.
- 100% **client-side**: just open the HTML files and go.

---

## 🗂️ Project Structure

```
.
├─ css/                # Stylesheets
├─ icons/              # UI icons
├─ js/                 # Algorithm logic + UI/visualization scripts
├─ index.html          # Landing page / hub
├─ dfs_activity.html   # DFS interactive activity
├─ bfs_activity.html   # BFS interactive activity
├─ astar_activity.html # A* interactive activity
└─ maze.html           # Small maze demo
```

---

## 🚀 Quick Start

### Option A — Open directly
1. Clone the repo:
   ```bash
   git clone https://github.com/kienlacmai/Interactive-Search-Alorgithm.git
   cd Interactive-Search-Alorgithm
   ```
2. Double-click `index.html` (or any of the `*_activity.html` pages) to open in your browser.

### Option B — Run a local server (recommended for Chrome)
```bash
# using Node
npx serve .

# or with Python 3
python -m http.server 5500
# then visit http://localhost:5500
```

---

## 🧠 How to Use

- **Pick an activity page**:
  - `dfs_activity.html` for depth-first search
  - `bfs_activity.html` for breadth-first search
  - `astar_activity.html` for A* pathfinding
- **Load / view the sample graph** (the page will render a directed graph).
- **Press play / step** to watch the traversal:
  - Nodes/edges highlight in the order visited.
  - Pseudocode pane advances with the current operation.
- **A***: Heuristic (`h`) and edge weights are shown; watch `g`, `h`, `f = g + h` update as the frontier changes.

---

## 🧩 Algorithms Included

- **DFS (Depth-First Search)**
  - Stack-based traversal, explores as far as possible along each branch.
- **BFS (Breadth-First Search)**
  - Queue-based traversal, visits nodes level by level (shortest path in unweighted graphs).
- **A*** (with heuristics)
  - Best-first search using `f(n) = g(n) + h(n)`; demonstrates priority-queue behavior and path reconstruction.

---

## ⚙️ Tech Stack

- **HTML / CSS / JavaScript** only — no backend required.
- Graph rendering & UI logic live in the `/js` folder; styles in `/css`.

---

## 🛠️ Development

- Keep algorithm logic modular (e.g., separate files for `dfs`, `bfs`, `astar`) with clear function signatures like:
  ```js
  // example shape
  const order = dfs(graph, startNode);
  const result = astar(graph, start, goal, weights, heuristic);
  ```
- Visualization code should subscribe to algorithm “events” (visit, enqueue/dequeue, relax edge, etc.) to animate the steps cleanly.

---

## ✅ Testing Your Changes

- Open each activity page and:
  1. Run the example to ensure traversal order matches expectations.
  2. Toggle pseudocode and verify highlighting syncs with the current step.
  3. For **A***, confirm weighted shortest-path correctness and `f` ordering behavior on ties.

---

## 📦 Deploy

- Use **GitHub Pages** (Settings → Pages → Deploy from branch) or any static host (Netlify, Vercel).
- Entry can be `index.html`, with links to the activity pages.

---

## 🤝 Contributing

1. Fork the repo and create a feature branch:
   ```bash
   git checkout -b feat/better-astar-visuals
   ```
2. Commit small, focused changes with clear messages.
3. Open a PR describing the change and screenshots/GIFs of the behavior.

## 📚 Attribution

Built by **Kienlac Mai & Benny Lu** as an interactive learning aid for search algorithms.
