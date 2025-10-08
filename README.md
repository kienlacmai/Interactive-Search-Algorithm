# 🧭 Interactive Search Algorithm — DFS • BFS • A* (with Maze Lab)

An interactive, browser-based playground to **learn, visualize, and practice** classic graph search algorithms:
- **Depth-First Search (DFS)**
- **Breadth-First Search (BFS)**
- **A\*** (with **edge weights**, **heuristics**, and live **g/h/f** cost display)

---

## 🎯 What you can do

### 1) Watch the algorithm think (Example Mode)
- Step through DFS, BFS, or A* on curated graphs.
- See the **current node**, **frontier/stack/queue**, and **visited set** evolve.
- A **pseudocode panel** highlights the exact line corresponding to each step.

### 2) Try it yourself (Interactive Mode)
- You predict the next step (which node gets chosen next).
- The app validates your choice and gives **instant feedback** (modals/messages).
- Great for building intuition about LIFO (DFS), FIFO (BFS), and A*'s f-score priorities.

### 3) Check your understanding (Quiz Mode)
- Short, focused questions about traversal order and decisions.
- Immediate grading to reinforce the concepts.

### 4) Fill in the blanks (Coding Activity)
- A minimal **teaching checker** asks you to complete key lines of DFS/BFS/A* logic.
- Validates canonical patterns (e.g., stack/queue handling, neighbor exploration).

### 5) Explore the Maze Lab
- Generate a **grid maze** and visualize pathfinding.
- Toggle **Auto** vs **Manual**: watch it run or step through carefully.
- Switch algorithms (DFS/BFS/A*) to compare their behavior on the same maze.

---

## 🖥️ UI & Visualization

- **Cytoscape.js** renders the graph, animates traversals, and lays out nodes cleanly.
- Visual layers:
  - **Current** node, **frontier** (stack/queue/open set), **visited**, **path** highlighting
  - For **A\***, live **g(n)**, **h(n)**, **f(n) = g + h** display influences the chosen node.
- **Theme toggle** (light/dark) with localStorage persistence.
- **Keyboard-friendly** step/run/reset controls.

> Pages:
> - `index.html` (hub / landing)
> - `dfs_activity.html`
> - `bfs_activity.html`
> - `astar_activity.html`
> - `maze.html`

---

## 🚀 Quick Start

### Option A — Open locally
1. Download or clone the repo.
2. Double-click one of:
   - `dfs_activity.html`
   - `bfs_activity.html`
   - `astar_activity.html`
   - `maze.html`
3. Start clicking: Example → Interactive → Quiz → Coding.

> If your browser restricts local file scripts, run a tiny static server:
> ```bash
> # Python 3
> python -m http.server 5173
> # then visit http://localhost:5173
> ```

### Option B — Deploy to GitHub Pages
1. Push to a public repo.
2. In **Settings → Pages**, set the **branch** to `main` and **root** to `/ (root)`.
3. Open the published URL and share it!

---

## 🧪 How A* is shown here

- Graph has **edge weights** and a **heuristic** map.
- Open set = nodes being considered; we always pick the node with **lowest f(n)**.
- Live tables/pills show:
  - `g(n)` — cost so far
  - `h(n)` — heuristic to goal
  - `f(n) = g + h` — priority score driving selection
- When the goal is reached, the app reconstructs and highlights the **optimal path**.

---

## 🧩 Learning flow we recommend

1. **Start with DFS**: see recursive structure + stack behavior.
2. **Compare with BFS**: feel the queue and level-by-level expansion.
3. **Move to A\***: watch how weights + heuristics change node priority.
4. **Maze Lab**: try all three on the same grid; observe path differences.

---

Contributors: Kienlac Mai & Benny Lu
