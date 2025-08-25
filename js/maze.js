(() => {
  'use strict';

  // ---- Theme toggle (same behavior as DFS page) ----
  function initThemeToggle() {
    const body = document.body;
    const toggle = document.getElementById('theme-toggle');
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const startDark = saved === 'dark' || (!saved && prefersDark.matches);
    body.classList.toggle('dark-mode', startDark);

    // invert SVG via CSS in dfs.css
    toggle.addEventListener('click', () => {
      const isDark = body.classList.toggle('dark-mode');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }
    let speedMs = 50;
    let abortSearch = false;
  // ---- Maze state ----
  const MAZE_SIZE = 25;
  const CELL_SIZE = 20;

  let maze = [];
  let selectedAlgorithm = 'dfs';
  let isRunning = false;
  let isComplete = false;
  let isManualMode = false;
  let manualStart = null;
  let manualEnd = null;
  let settingStart = true; // true => next click sets start, false => end
  let stats = { visited: 0, pathLength: 0, time: 0 };

  const algorithmInfo = {
    dfs:   { name: 'Depth-First Search' },
    bfs:   { name: 'Breadth-First Search' },
    astar: { name: 'A* Search' }
  };

  // ---- Boot ----
  document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    hookUI();
    generateMaze();
  });

  // ---- UI wiring ----
  function hookUI() {
    // Algorithm segmented control
    document.querySelectorAll('#algoToggle .seg').forEach(btn => {
      btn.addEventListener('click', () => {
        if (isRunning) return;
        selectAlgorithm(btn.dataset.algorithm);
      });
    });

    // Mode segmented control
    document.getElementById('autoMode')?.addEventListener('click', () => !isRunning && setMode('auto'));
    document.getElementById('manualMode')?.addEventListener('click', () => !isRunning && setMode('manual'));

    // Action buttons
    document.getElementById('runButton')?.addEventListener('click', runAlgorithm);
    document.getElementById('generateButton')?.addEventListener('click', () => !isRunning && generateMaze());
    // STOP button
    const stopBtn = document.getElementById('stopButton');
    if (stopBtn) stopBtn.addEventListener('click', () => { abortSearch = true; });
    // Speed slider
    const speedSlider = document.getElementById('speedSlider');
    const speedValue  = document.getElementById('speedValue');
    if (speedSlider) {
    speedMs = parseInt(speedSlider.value, 10) || 0;
    if (speedValue) speedValue.textContent = speedMs + 'ms';
    speedSlider.addEventListener('input', () => {
        speedMs = parseInt(speedSlider.value, 10) || 0;
        if (speedValue) speedValue.textContent = speedMs + 'ms';
    });
    }
}

  function selectAlgorithm(algo) {
    selectedAlgorithm = algo;
    resetMaze();

    // Update segmented control styles/ARIA
    document.querySelectorAll('#algoToggle .seg').forEach(b => {
      const isSel = b.dataset.algorithm === algo;
      b.classList.toggle('selected', isSel);
      b.setAttribute('aria-selected', String(isSel));
    });

    // Update run button label
    const runBtn = document.getElementById('runButton');
    if (runBtn) runBtn.textContent = `Run ${algorithmInfo[algo].name}`;
  }

  function setMode(mode) {
    isManualMode = (mode === 'manual');
    resetMaze();

    const autoBtn = document.getElementById('autoMode');
    const manBtn  = document.getElementById('manualMode');
    if (autoBtn && manBtn) {
      autoBtn.classList.toggle('selected', mode === 'auto');
      manBtn.classList.toggle('selected', mode === 'manual');
      autoBtn.setAttribute('aria-selected', String(mode === 'auto'));
      manBtn.setAttribute('aria-selected', String(mode === 'manual'));
    }

    // Show/hide instructions + pointer cursor
    const hint = document.getElementById('manualInstructions');
    if (hint) hint.style.display = isManualMode ? 'block' : 'none';
    document.body.classList.toggle('manual-mode', isManualMode);

    if (isManualMode) {
      clearStartEnd();
    } else {
      setAutoStartEnd();
    }
    renderMaze();
  }

  // ---- Controls lock/unlock ----
  function setControlsEnabled(enabled) {
    const runBtn   = document.getElementById('runButton');
    const genBtn   = document.getElementById('generateButton');
    const stopBtn  = document.getElementById('stopButton');
    const algoBtns = Array.from(document.querySelectorAll('#algoToggle .seg'));
    const modeBtns = Array.from(document.querySelectorAll('#modeToggle .seg'));

    const all = [runBtn, genBtn, ...algoBtns, ...modeBtns].filter(Boolean);
    all.forEach(b => {
      b.disabled = !enabled;
      b.setAttribute('aria-disabled', String(!enabled));
    });

    if (stopBtn) {
        stopBtn.disabled = enabled;                // enabled when others disabled
        stopBtn.setAttribute('aria-disabled', String(!stopBtn.disabled));
    }
  }

  // ---- Maze generation (recursive backtracking) ----
  function generateMaze() {
    resetStats();
    resetMaze();
    // init all walls
    maze = Array.from({ length: MAZE_SIZE }, (_, y) =>
      Array.from({ length: MAZE_SIZE }, (_, x) => ({
        x, y,
        isWall: true, isStart: false, isEnd: false,
        isVisited: false, isPath: false,
        parent: null, distance: undefined, heuristic: undefined, fScore: undefined
      }))
    );

    const stack = [];
    const startCell = maze[1][1];
    startCell.isWall = false;
    stack.push(startCell);

    while (stack.length) {
      const current = stack[stack.length - 1];
      const neighbors = getUnvisitedNeighbors(current);
      if (neighbors.length) {
        const next = neighbors[Math.floor(Math.random() * neighbors.length)];
        const wallX = current.x + (next.x - current.x) / 2;
        const wallY = current.y + (next.y - current.y) / 2;
        maze[wallY][wallX].isWall = false;
        next.isWall = false;
        stack.push(next);
      } else {
        stack.pop();
      }
    }

    if (isManualMode) {
      clearStartEnd();
      const hint = document.getElementById('manualInstructions');
      if (hint) hint.textContent = 'Click on maze cells to set start (green) and end (red) points.';
    } else {
      setAutoStartEnd();
    }

    resetStats();
    renderMaze();
  }

  function getUnvisitedNeighbors(cell) {
    const res = [];
    const dirs = [{dx:0,dy:-2},{dx:2,dy:0},{dx:0,dy:2},{dx:-2,dy:0}];
    for (const {dx,dy} of dirs) {
      const nx = cell.x + dx, ny = cell.y + dy;
      if (nx >= 0 && nx < MAZE_SIZE && ny >= 0 && ny < MAZE_SIZE && maze[ny][nx].isWall) {
        res.push(maze[ny][nx]);
      }
    }
    return res;
  }

  // ---- Rendering ----
  function renderMaze() {
    
    const container = document.getElementById('mazeContainer');
    if (!container) return;

    container.innerHTML = '';

    maze.forEach((row, y) => {
      row.forEach((cell, x) => {
        const div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.left = (x * CELL_SIZE) + 'px';
        div.style.top  = (y * CELL_SIZE) + 'px';
        div.style.width  = CELL_SIZE + 'px';
        div.style.height = CELL_SIZE + 'px';
        div.style.transition = 'background-color .2s ease';

        if (isManualMode) {
          div.addEventListener('click', () => handleCellClick(x, y));
        }

        // Theme-aware colors via inline background
        // Theme-aware colors via CSS variables
    let bg = 'var(--maze-floor)';
    if (cell.isWall)          bg = 'var(--maze-wall)';
    else if (cell.isStart)    bg = 'var(--maze-start)';
    else if (cell.isEnd)      bg = 'var(--maze-end)';
    else if (cell.isPath)     bg = 'var(--maze-path)';
    else if (cell.isVisited)  bg = 'var(--maze-visit)';

    div.style.background = bg;

        container.appendChild(div);
      });
    });
  }

  function handleCellClick(x, y) {
    if (!isManualMode || isRunning) return;
    const cell = maze[y][x];
    if (cell.isWall) return;

    if (settingStart) {
      if (manualStart) manualStart.isStart = false;
      cell.isStart = true; cell.isEnd = false;
      manualStart = cell; settingStart = false;
      const hint = document.getElementById('manualInstructions');
      if (hint) hint.textContent = 'Now click to set the end point (red).';
    } else {
      if (manualEnd) manualEnd.isEnd = false;
      cell.isEnd = true; cell.isStart = false;
      manualEnd = cell; settingStart = true;
      const hint = document.getElementById('manualInstructions');
      if (hint) hint.textContent = 'Click to set a new start point (green).';
    }
    renderMaze();
  }

  function clearStartEnd() {
    maze.forEach(r => r.forEach(c => { c.isStart=false; c.isEnd=false; }));
    manualStart = manualEnd = null;
    settingStart = true;
  }

  function setAutoStartEnd() {
    clearStartEnd();
    maze[1][1].isStart = true;
    maze[MAZE_SIZE-2][MAZE_SIZE-2].isEnd = true;
  }

  async function runAlgorithm() {
    if (isRunning) return;
  if (isManualMode && (!manualStart || !manualEnd)) {
    alert('Please set both start and end points before running.');
    return;
  }

  isRunning = true;
  abortSearch = false;        // NEW
  resetMaze();

  setControlsEnabled(false);
  const runBtn = document.getElementById('runButton');
  const label  = algorithmInfo[selectedAlgorithm].name;
  if (runBtn) runBtn.textContent = 'Running...';

  const t0 = performance.now();
  try {
    if (selectedAlgorithm === 'dfs')       await solveDFS();
    else if (selectedAlgorithm === 'bfs')  await solveBFS();
    else                                    await solveAStar();
  } finally {
    const dt = Math.round(performance.now() - t0);
    stats.time = dt;
    updateStats();

    setControlsEnabled(true);
    if (runBtn) runBtn.textContent = `Run ${label}`;
    isRunning = false;
  }
  }

  async function solveDFS() {
    const visited = new Set();
    const stack = [];
    const startCell = maze.flat().find(c => c.isStart);
    stack.push(startCell);
    let visitedCount = 0;

    while (stack.length && !isComplete && !abortSearch) {
      const cur = stack.pop();
      const key = cur.x + ',' + cur.y;
      if (visited.has(key)) continue;

      visited.add(key);
      cur.isVisited = true;
      visitedCount++;

      if (cur.isEnd) {
            const path = buildPath(cur);
            stats.visited = visitedCount;
            stats.pathLength = path.length;
            isComplete = true;
            await animateFinalPath(path);
            return;
        }

      const nbrs = getValidNeighbors(cur);
      nbrs.reverse().forEach(n => {
        const k = n.x + ',' + n.y;
        if (!visited.has(k)) { n.parent = cur; stack.push(n); }
      });

      renderMaze();
      await sleep(speedMs);
    }
    if (abortSearch) return;
  }

  async function solveBFS() {
    const visited = new Set();
    const q = [];
    const startCell = maze.flat().find(c => c.isStart);
    q.push(startCell);
    visited.add(startCell.x + ',' + startCell.y);
    let visitedCount = 0;

    while (q.length && !isComplete && !abortSearch) {
      const cur = q.shift();
      cur.isVisited = true;
      visitedCount++;

      if (cur.isEnd) {
            const path = buildPath(cur);
            stats.visited = visitedCount;
            stats.pathLength = path.length;
            isComplete = true;
            await animateFinalPath(path);
            return;
        }

      const nbrs = getValidNeighbors(cur);
      nbrs.forEach(n => {
        const k = n.x + ',' + n.y;
        if (!visited.has(k)) {
          visited.add(k);
          n.parent = cur;
          q.push(n);
        }
      });

      renderMaze();
      await sleep(speedMs);
    }
    if (abortSearch) return;
  }

  async function solveAStar() {
    const open = [];
    const closed = new Set();
    const startCell = maze.flat().find(c => c.isStart);
    const endCell   = maze.flat().find(c => c.isEnd);

    startCell.distance = 0;
    startCell.heuristic = manhattan(startCell, endCell);
    startCell.fScore = startCell.heuristic;
    open.push(startCell);

    let visitedCount = 0;

    while (open.length && !isComplete && !abortSearch) {
      open.sort((a,b) => (a.fScore||0) - (b.fScore||0));
      const cur = open.shift();

      const key = cur.x + ',' + cur.y;
      closed.add(key);
      cur.isVisited = true;
      visitedCount++;

      if (cur.isEnd) {
        const path = buildPath(cur);
        stats.visited = visitedCount;
        stats.pathLength = path.length;
        isComplete = true;
        await animateFinalPath(path);
        return;
    }

      const nbrs = getValidNeighbors(cur);
      for (const n of nbrs) {
        const nk = n.x + ',' + n.y;
        if (closed.has(nk)) continue;

        const tentative = (cur.distance || 0) + 1;
        if (!open.includes(n)) {
          open.push(n);
        } else if (tentative >= (n.distance || Number.POSITIVE_INFINITY)) {
          continue;
        }
        n.parent = cur;
        n.distance = tentative;
        n.heuristic = manhattan(n, endCell);
        n.fScore = n.distance + n.heuristic;
      }

      renderMaze();
      await sleep(speedMs);
    }
    if (abortSearch) return;
  }

  function getValidNeighbors(c) {
    const res = [];
    const dirs = [{dx:0,dy:-1},{dx:1,dy:0},{dx:0,dy:1},{dx:-1,dy:0}];
    for (const {dx,dy} of dirs) {
      const nx = c.x + dx, ny = c.y + dy;
      if (nx>=0 && nx<MAZE_SIZE && ny>=0 && ny<MAZE_SIZE && !maze[ny][nx].isWall) {
        res.push(maze[ny][nx]);
      }
    }
    return res;
  }

  function manhattan(a,b) { return Math.abs(a.x-b.x) + Math.abs(b.y - a.y); }

//   function reconstructPath(endCell) {
//     let cur = endCell, len = 0;
//     while (cur) { cur.isPath = true; len++; cur = cur.parent; }
//     stats.pathLength = len;
//   }

    // Build the path from end -> start
function buildPath(endCell) {
  const path = [];
  let cur = endCell;
  while (cur) { path.push(cur); cur = cur.parent; }
  path.reverse(); // start -> end
  return path;
}

// Animate painting the final shortest path
async function animateFinalPath(path) {
  for (const node of path) {
    if (abortSearch) return;
    node.isPath = true;   // renders as blue
    renderMaze();
    await sleep(speedMs);      // adjust speed here (ms)
  }
}

  function resetMaze() {
    maze.forEach(r => r.forEach(c => {
      c.isVisited = false; c.isPath = false;
      c.distance = c.heuristic = c.fScore = undefined;
      c.parent = null;
    }));
    isComplete = false;
    resetStats();
    renderMaze();
  }

  function resetStats() {
    stats = { visited: 0, pathLength: 0, time: 0 };
    updateStats();
  }

  function updateStats() {
    const v = document.getElementById('visitedCount');
    const p = document.getElementById('pathLength');
    const t = document.getElementById('timeElapsed');
    if (v) v.textContent = stats.visited;
    if (p) p.textContent = stats.pathLength;
    if (t) t.textContent = stats.time + 'ms';
  }

function resetTraversal() {
  if (window.isSearching) return; // safety: don't let reset happen mid-search

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = grid[r][c];
      // flags set by searches / animations
      cell.isVisited   = false;   // yellow (visited)
      cell.inFrontier  = false;   // (if you use a separate frontier color)
      cell.isPath      = false;   // blue (final path)
      cell.parent      = null;

      // typical pathfinding bookkeeping (clear so next run is fresh)
      cell.g = Infinity;
      cell.h = 0;
      cell.f = Infinity;
      cell.dist = Infinity;
    }
  }

  // If you track stats in the UI
  if (window.stats) {
    stats.visited = 0;
    stats.pathLength = 0;
  }

  renderMaze();
}

function wireResetOnControls() {
  // Try a few common selectors so this works with your existing markup
  const algoSelect =
    document.querySelector('#algo') ||
    document.querySelector('#algorithm') ||
    document.querySelector('#search-select') ||
    document.querySelector('select[name="algorithm"]');

  if (algoSelect) {
    algoSelect.addEventListener('change', () => resetTraversal());
  }

  // Auto/Manual as radios, a select, or a toggle button
  const modeRadios = document.querySelectorAll('input[name="mode"]');
  modeRadios.forEach(r =>
    r.addEventListener('change', () => resetTraversal())
  );

  const modeSelect =
    document.querySelector('#mode') || document.querySelector('select[name="mode"]');
  if (modeSelect) {
    modeSelect.addEventListener('change', () => resetTraversal());
  }

  const modeToggle = document.querySelector('#mode-toggle');
  if (modeToggle) {
    // supports toggles that flip a class or data attribute elsewhere
    modeToggle.addEventListener('click', () => resetTraversal());
    modeToggle.addEventListener('change', () => resetTraversal());
  }
}

// call this once after your DOM is ready / after you build controls
wireResetOnControls();

const genBtn =
  document.querySelector('#generate') ||
  document.querySelector('#generate-maze') ||
  document.querySelector('button[data-action="generate-maze"]');

if (genBtn) {
  genBtn.addEventListener('click', () => {
    resetTraversal();   // clear any residual colors first
    // ... then your existing "generateMaze()" logic runs ...
  });
}



  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
})();

