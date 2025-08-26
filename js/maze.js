(() => {
  'use strict';

  // -----------------------------
  // Config
  // -----------------------------
  let MAZE_SIZE = 25;    // grid dimension (must match CSS cell layout)
  const CELL_SIZE = 20;    // px

  // -----------------------------
  // Runtime state
  // -----------------------------
  let maze = [];                   // 2D array of cells
  let selectedAlgorithm = 'dfs';
  let isManualMode = false;        // auto by default
  let isRunning = false;           // auto mode guard
  let isComplete = false;          // auto mode goal reached
  let abortSearch = false;         // stop button
  let speedMs = 50;

  // Manual state machine
  //   'set'  -> choose start, then end
  //   'play' -> user clicks next step along computed **traversal order** (not just final path)
  //   'done' -> finished, any click returns to 'set'
  let manualPhase = 'set';
  let manualStart = null;
  let manualEnd = null;
  let manualTrace = null;    // array of cells in the exact visit/expansion order for the algorithm, ends at goal
  let manualParents = null;  // Map key->parent used to reveal final path at the end
  let manualIndex = 0;       // index in manualTrace (we expect clicks in this order)

  // Stats for auto mode
  let stats = { visited: 0, pathLength: 0, time: 0 };

  const ALGO = {
    dfs:   { name: 'Depth-First Search' },
    bfs:   { name: 'Breadth-First Search' },
    astar: { name: 'A* Search' }
  };

  // -----------------------------
  // Boot
  // -----------------------------
  document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    hookUI();
    generateMaze();
    // ensure consistent initialization
    setMode('auto');
    selectAlgorithm('dfs');
  });

  // -----------------------------
  // Theme toggle
  // -----------------------------
  function initThemeToggle() {
    const body = document.body;
    const toggle = document.getElementById('theme-toggle');
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const startDark = saved === 'dark' || (!saved && prefersDark.matches);
    body.classList.toggle('dark-mode', startDark);
    if (toggle) {
      toggle.addEventListener('click', () => {
        const isDark = body.classList.toggle('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
      });
    }
  }

  // -----------------------------
  // UI wiring
  // -----------------------------
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

    // Actions
    document.getElementById('runButton')?.addEventListener('click', runAlgorithm);
    document.getElementById('generateButton')?.addEventListener('click', () => { if (!isRunning) generateMaze(); });

    // Stop (auto mode)
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
    const sizeSlider = document.getElementById('sizeSlider');
    const sizeValue  = document.getElementById('sizeValue');
    if (sizeSlider) {
      // initialize from current MAZE_SIZE
      sizeSlider.value = String(MAZE_SIZE);
      if (sizeValue) sizeValue.textContent = `${MAZE_SIZE}×${MAZE_SIZE}`;

      sizeSlider.addEventListener('input', () => {
        const n = parseInt(sizeSlider.value, 10);
        // clamp just in case
        const newSize = Math.max(8, Math.min(25, isNaN(n) ? MAZE_SIZE : n));
        if (newSize === MAZE_SIZE) return;

        MAZE_SIZE = newSize;
        if (sizeValue) sizeValue.textContent = `${MAZE_SIZE}×${MAZE_SIZE}`;

        // regenerate a fresh maze at the new size
        generateMaze(); // no other logic needs to change
      });
    }
  }

  function selectAlgorithm(algo) {
    selectedAlgorithm = algo;

    // Update segmented control styles/ARIA
    document.querySelectorAll('#algoToggle .seg').forEach(b => {
      const isSel = b.dataset.algorithm === algo;
      b.classList.toggle('selected', isSel);
      b.setAttribute('aria-selected', String(isSel));
    });

    // Update run button label (auto mode)
    const runBtn = document.getElementById('runButton');
    if (runBtn) runBtn.textContent = `Run ${ALGO[algo].name}`;

    // If user is playing manual and we already have start/end, re-plan traversal using new algo
    if (isManualMode && manualStart && manualEnd) {
      planManualTraversal();
      manualIndex = 0;
      // clear any previously painted states
      maze.forEach(r => r.forEach(c => { c.isVisited = false; c.isPath = false; }));
      // mark start as already visited
      if (manualTrace && manualTrace.length) manualTrace[0].isVisited = true;
      renderStatus();
      renderMaze();
    }
  }

  function setMode(mode) {
    isManualMode = (mode === 'manual');
    // Toggle UI
    const autoBtn = document.getElementById('autoMode');
    const manBtn  = document.getElementById('manualMode');
    autoBtn?.classList.toggle('selected', !isManualMode);
    manBtn?.classList.toggle('selected', isManualMode);
    autoBtn?.setAttribute('aria-selected', String(!isManualMode));
    manBtn?.setAttribute('aria-selected', String(isManualMode));

    // Enable/disable run/stop
    const runBtn  = document.getElementById('runButton');
    const stopBtn = document.getElementById('stopButton');
    if (runBtn)  runBtn.disabled  = isManualMode;
    if (stopBtn) stopBtn.disabled = isManualMode; // only enabled during auto run

    // Instructions + cursor
    const hint = document.getElementById('manualInstructions');
    document.body.classList.toggle('manual-mode', isManualMode);
    if (hint) hint.style.display = isManualMode ? 'block' : 'none';

    resetTraversalState();

    if (isManualMode) {
      manualPhase = 'set';
      hint && (hint.textContent = 'Manual mode: Click to set start (green) and end (red).');
      clearStartEnd();
    } else {
      setAutoStartEnd();
    }

    renderMaze();
    renderStatus();
  }

  // -----------------------------
  // Maze generation (recursive backtracker)
  // -----------------------------
  function generateMaze() {
    // reset global state
    abortSearch = false;
    isRunning = false;
    isComplete = false;
    resetStats();

    // build grid of walls
    maze = Array.from({ length: MAZE_SIZE }, (_, y) =>
      Array.from({ length: MAZE_SIZE }, (_, x) => ({
        x, y,
        isWall: true,
        isStart: false, isEnd: false,
        isVisited: false, isPath: false,
        parent: null,
        distance: undefined, heuristic: undefined, fScore: undefined,
        flashWrong: 0
      }))
    );

    const stack = [];
    const start = maze[1][1];
    start.isWall = false;
    stack.push(start);

    while (stack.length) {
      const cur = stack[stack.length - 1];
      const neighbors = getUnvisitedNeighbors(cur);
      if (neighbors.length) {
        const next = neighbors[Math.floor(Math.random() * neighbors.length)];
        // remove wall between cur and next
        const wallX = cur.x + (next.x - cur.x) / 2;
        const wallY = cur.y + (next.y - cur.y) / 2;
        maze[wallY][wallX].isWall = false;
        next.isWall = false;
        stack.push(next);
      } else {
        stack.pop();
      }
    }

    // mode-specific setup
    if (isManualMode) {
      manualPhase = 'set';
      manualStart = manualEnd = null;
      manualTrace = null; manualParents = null; manualIndex = 0;
      const hint = document.getElementById('manualInstructions');
      hint && (hint.textContent = 'Click to set start (green) and end (red).');
    } else {
      setAutoStartEnd();
    }

    resetTraversalState();
    renderMaze();
    renderStatus();
  }

  function getUnvisitedNeighbors(cell) {
    const res = [];
    const dirs = [{dx:0,dy:-2},{dx:2,dy:0},{dx:0,dy:2},{dx:-2,dy:0}];
    for (const {dx,dy} of dirs) {
      const nx = cell.x + dx, ny = cell.y + dy;
      if (nx>=0 && nx<MAZE_SIZE && ny>=0 && ny<MAZE_SIZE && maze[ny][nx].isWall) {
        res.push(maze[ny][nx]);
      }
    }
    return res;
  }

  // -----------------------------
  // Rendering
  // -----------------------------
  function renderMaze() {
    const container = document.getElementById('mazeContainer');
    if (!container) return;
    container.style.width  = (MAZE_SIZE * CELL_SIZE) + 'px';
    container.style.height = (MAZE_SIZE * CELL_SIZE) + 'px';
    container.innerHTML = '';

    const now = performance.now();

    maze.forEach((row, y) => {
      row.forEach((cell, x) => {
        const div = document.createElement('div');
        div.className = 'cell';
        div.dataset.x = String(x);
        div.dataset.y = String(y);
        div.style.position = 'absolute';
        div.style.left = (x * CELL_SIZE) + 'px';
        div.style.top  = (y * CELL_SIZE) + 'px';
        div.style.width  = CELL_SIZE + 'px';
        div.style.height = CELL_SIZE + 'px';
        div.style.transition = 'background-color .18s ease, transform .12s ease';

        if (isManualMode) {
          div.addEventListener('click', () => handleCellClick(x, y));
        }

        // background color by state
        let bg = 'var(--maze-floor)';
        if (cell.isWall)          bg = 'var(--maze-wall)';
        else if (cell.isStart)    bg = 'var(--maze-start)';
        else if (cell.isEnd)      bg = 'var(--maze-end)';
        else if (cell.isPath)     bg = 'var(--maze-path)';
        else if (cell.isVisited)  bg = 'var(--maze-visit)';

        if (cell.flashWrong && now - cell.flashWrong < 260) {
          bg = 'var(--maze-wrong)';
          div.style.transform = 'scale(0.95)';
        }

        div.style.background = bg;
        container.appendChild(div);
      });
    });
  }

  // -----------------------------
  // Manual interactions (TRAVERSAL ORDER, not just shortest path)
  // -----------------------------
  function handleCellClick(x, y) {
    if (!isManualMode || isRunning) return;
    const cell = maze[y][x];
    if (cell.isWall) return;

    if (manualPhase === 'set') {
      // click 1: set start, click 2: set end -> then plan traversal
      if (!manualStart) {
        clearStartEnd();
        cell.isStart = true; manualStart = cell;
        setStatus('Start set. Now click to set the end point (red).');
      } else if (!manualEnd) {
        if (cell === manualStart) return;
        cell.isEnd = true; manualEnd = cell;
        if (planManualTraversal()) {
          manualPhase = 'play';
          manualIndex = 0;
          // mark the start as already visited (first element in trace)
          if (manualTrace.length) manualTrace[0].isVisited = true;
          setStatus(`Now follow ${ALGO[selectedAlgorithm].name} by clicking tiles in the order visited.`);
        } else {
          setStatus('No path exists between start and end. Choose different cells or regenerate.');
        }
      } else {
        // any further click resets start for quick replay
        clearStartEnd();
        cell.isStart = true; manualStart = cell; manualEnd = null;
        setStatus('Start updated. Click to set the end point (red).');
      }
      renderMaze();
      return;
    }

    if (manualPhase === 'play') {
      const next = manualTrace[manualIndex + 1];
      if (!next) return;
      if (cell === next) {
        cell.isVisited = true; // mark visit (traversal)
        manualIndex++;
        if (cell.isEnd) {
          // Show the final path (optional nice reveal)
          const path = rebuildPathFromParents(manualParents, manualStart, manualEnd);
          path.forEach(p => p.isPath = true);
          manualPhase = 'done';
          setStatus('🎉 Correct traversal! Click anywhere to set a new start and play again.');
        } else {
          setStatus('✅ Correct. Keep going…');
        }
        renderMaze();
      } else {
        // wrong tile flash
        cell.flashWrong = performance.now();
        setStatus('❌ Not the next visited tile for this algorithm — try a different direction.');
        renderMaze();
        setTimeout(() => { cell.flashWrong = 0; renderMaze(); }, 260);
      }
      return;
    }

    if (manualPhase === 'done') {
      manualPhase = 'set';
      setStatus('Click to set a new start (green), then an end (red).');
    }
  }

  // Compute the exact traversal order + parents for path reveal at the end
  function planManualTraversal() {
    if (!manualStart || !manualEnd) return false;

    // clear any drawn state
    maze.forEach(r => r.forEach(c => { c.isVisited = false; c.isPath = false; c.parent = null; }));

    let result = null;
    if (selectedAlgorithm === 'dfs')      result = traceDFS(manualStart, manualEnd);
    else if (selectedAlgorithm === 'bfs') result = traceBFS(manualStart, manualEnd);
    else                                  result = traceAStar(manualStart, manualEnd);

    if (!result) { manualTrace = null; manualParents = null; return false; }

    manualTrace = result.trace;
    manualParents = result.parents;

    return manualTrace && manualTrace.length > 1; // must at least have start->something
  }

  // -----------------------------
  // Auto mode (animated)
  // -----------------------------
  async function runAlgorithm() {
    if (isManualMode || isRunning) return;
    isRunning = true;
    abortSearch = false;
    resetTraversalState();

    const runBtn = document.getElementById('runButton');
    const label  = ALGO[selectedAlgorithm].name;
    if (runBtn) runBtn.textContent = 'Running…';

    const t0 = performance.now();
    try {
      if (selectedAlgorithm === 'dfs')       await solveDFS();
      else if (selectedAlgorithm === 'bfs')  await solveBFS();
      else                                   await solveAStar();
    } finally {
      stats.time = Math.round(performance.now() - t0);
      updateStats();
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
      const key = keyOf(cur);
      if (visited.has(key)) continue;
      visited.add(key);

      cur.isVisited = true; visitedCount++;
      if (cur.isEnd) {
        const path = buildPath(cur);
        stats.visited = visitedCount;
        stats.pathLength = path.length;
        isComplete = true;
        await animateFinalPath(path);
        break;
      }

      const nbrs = getValidNeighbors(cur);
      const order = [{dx:0,dy:-1},{dx:1,dy:0},{dx:0,dy:1},{dx:-1,dy:0}];
      nbrs.sort((a,b) => orderIndex(a, cur) - orderIndex(b, cur)).reverse();
      for (const n of nbrs) {
        const nk = keyOf(n);
        if (!visited.has(nk)) { n.parent = cur; stack.push(n); }
      }

      renderMaze();
      await sleep(speedMs);
    }
  }

  async function solveBFS() {
    const visited = new Set();
    const q = [];
    const startCell = maze.flat().find(c => c.isStart);
    q.push(startCell);
    visited.add(keyOf(startCell));
    let visitedCount = 0;

    while (q.length && !isComplete && !abortSearch) {
      const cur = q.shift();
      cur.isVisited = true; visitedCount++;

      if (cur.isEnd) {
        const path = buildPath(cur);
        stats.visited = visitedCount;
        stats.pathLength = path.length;
        isComplete = true;
        await animateFinalPath(path);
        break;
      }

      const nbrs = getValidNeighbors(cur).sort((a,b) => orderIndex(a, cur) - orderIndex(b, cur));
      for (const n of nbrs) {
        const nk = keyOf(n);
        if (!visited.has(nk)) {
          visited.add(nk);
          n.parent = cur;
          q.push(n);
        }
      }

      renderMaze();
      await sleep(speedMs);
    }
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
      const ck = keyOf(cur);

      if (closed.has(ck)) continue;
      closed.add(ck);
      cur.isVisited = true; visitedCount++;

      if (cur.isEnd) {
        const path = buildPath(cur);
        stats.visited = visitedCount;
        stats.pathLength = path.length;
        isComplete = true;
        await animateFinalPath(path);
        break;
      }

      for (const n of getValidNeighbors(cur)) {
        const nk = keyOf(n);
        if (closed.has(nk)) continue;
        const tentative = (cur.distance || 0) + 1;
        if (!open.includes(n)) open.push(n);
        else if (tentative >= (n.distance || Number.POSITIVE_INFINITY)) continue;
        n.parent = cur;
        n.distance = tentative;
        n.heuristic = manhattan(n, endCell);
        n.fScore = n.distance + n.heuristic;
      }

      renderMaze();
      await sleep(speedMs);
    }
  }

  // -----------------------------
  // Shared helpers (auto & manual)
  // -----------------------------
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

  function orderIndex(nbr, cur) {
    const dx = nbr.x - cur.x, dy = nbr.y - cur.y;
    if (dx === 0 && dy === -1) return 0; // up
    if (dx === 1 && dy ===  0) return 1; // right
    if (dx === 0 && dy ===  1) return 2; // down
    return 3; // left
  }

  function manhattan(a,b) { return Math.abs(a.x-b.x) + Math.abs(a.y-b.y); }

  function buildPath(endCell) {
    const path = [];
    let cur = endCell;
    while (cur) { path.push(cur); cur = cur.parent; }
    path.reverse();
    return path;
  }

  function rebuildPathFromParents(parentMap, start, goal) {
    const path = [];
    let cur = goal;
    while (cur && cur !== start) {
      path.push(cur);
      cur = parentMap.get(keyOf(cur));
    }
    if (!cur) return [];
    path.push(start);
    path.reverse();
    return path;
  }

  async function animateFinalPath(path) {
    for (const node of path) {
      if (abortSearch) return;
      node.isPath = true;
      renderMaze();
      await sleep(speedMs);
    }
  }

  function keyOf(c) { return c.x + ',' + c.y; }

  function clearStartEnd() {
    maze.forEach(r => r.forEach(c => { c.isStart=false; c.isEnd=false; c.isPath=false; c.isVisited=false; }));
    manualStart = manualEnd = null;
    manualTrace = null; manualParents = null;
    manualIndex = 0;
  }

  function setAutoStartEnd() {
    clearStartEnd();
    maze[1][1].isStart = true;
    maze[MAZE_SIZE-2][MAZE_SIZE-2].isEnd = true;
  }

  function resetTraversalState() {
    maze.forEach(r => r.forEach(c => {
      c.isVisited = false; c.isPath = false;
      c.distance = c.heuristic = c.fScore = undefined;
      c.parent = null; c.flashWrong = 0;
    }));
    isComplete = false;
    updateStats();
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

  function setStatus(msg) {
    const hint = document.getElementById('manualInstructions');
    if (hint) hint.textContent = msg;
  }

  function renderStatus() {
    if (!isManualMode) return;
    if (manualPhase === 'set') return; // instructions already shown
    if (manualPhase === 'play' && manualTrace) {
      const remaining = manualTrace.length - 1 - manualIndex;
      setStatus(`Following ${ALGO[selectedAlgorithm].name} traversal: ${remaining} step${remaining!==1?'s':''} to goal…`);
    }
    if (manualPhase === 'done') {
      setStatus('🎉 Nice! You followed the traversal correctly. Click to set a new start.');
    }
  }

  // -----------------------------
  // Manual traversal tracers (non-animated)
  // -----------------------------
  function traceDFS(start, goal) {
    const st = [start];
    const visited = new Set();
    const parent = new Map();
    const trace = [];

    while (st.length) {
      const cur = st.pop();
      const ck = keyOf(cur);
      if (visited.has(ck)) continue;
      visited.add(ck);
      trace.push(cur);
      if (cur === goal) return { trace, parents: parent };

      const nbrs = getValidNeighbors(cur).sort((a,b) => orderIndex(a, cur) - orderIndex(b, cur)).reverse();
      for (const n of nbrs) {
        const nk = keyOf(n);
        if (!visited.has(nk)) {
          if (!parent.has(nk)) parent.set(nk, cur);
          st.push(n);
        }
      }
    }
    return null; // unreachable
  }

  function traceBFS(start, goal) {
    const q = [start];
    const seen = new Set([keyOf(start)]);
    const parent = new Map();
    const trace = [];

    while (q.length) {
      const cur = q.shift();
      trace.push(cur);
      if (cur === goal) return { trace, parents: parent };

      const nbrs = getValidNeighbors(cur).sort((a,b) => orderIndex(a, cur) - orderIndex(b, cur));
      for (const n of nbrs) {
        const nk = keyOf(n);
        if (!seen.has(nk)) {
          seen.add(nk);
          if (!parent.has(nk)) parent.set(nk, cur);
          q.push(n);
        }
      }
    }
    return null;
  }

  function traceAStar(start, goal) {
    const open = [start];
    const g = new Map([[keyOf(start), 0]]);
    const f = new Map([[keyOf(start), manhattan(start, goal)]]);
    const parent = new Map();
    const closed = new Set();
    const trace = [];

    while (open.length) {
      open.sort((a,b) => (f.get(keyOf(a))||Infinity) - (f.get(keyOf(b))||Infinity));
      const cur = open.shift();
      const ck = keyOf(cur);
      if (closed.has(ck)) continue;
      closed.add(ck);

      trace.push(cur); // record expansion
      if (cur === goal) return { trace, parents: parent };

      for (const n of getValidNeighbors(cur)) {
        const nk = keyOf(n);
        if (closed.has(nk)) continue;
        const tentative = (g.get(ck) || Infinity) + 1;
        if (!open.includes(n)) open.push(n);
        else if (tentative >= (g.get(nk) || Infinity)) continue;
        parent.set(nk, cur);
        g.set(nk, tentative);
        f.set(nk, tentative + manhattan(n, goal));
      }
    }
    return null;
  }

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
})();

// --- UI reveal + micro-interactions (additive only) ---

// 1) Staggered load-in (match DFS timing & order)
document.documentElement.classList.add('reveal-dfs');
const revealTargets = [
  document.querySelector('h1'),                             // ~40ms
  document.getElementById('maze-instructions'),            // ~80ms
  document.querySelector('.controls'),                     // ~120ms
  document.querySelector('#application-activity #maze-frame'), // ~180ms
  document.querySelector('#application-activity .maze-stats')  // ~220ms
].filter(Boolean);

revealTargets.forEach((el, i) => {
  el.style.setProperty('--reveal-delay', `${40 + i * 40}ms`);
});

// 2) Ripple on clicks (controls buttons + segmented chips)
document.addEventListener('click', (e) => {
  const target = e.target.closest('.controls > button, .pseudo-toggle .seg');
  if (!target) return;

  const r = document.createElement('span');
  r.className = 'button-ripple';
  const rect = target.getBoundingClientRect();
  r.style.left = (e.clientX - rect.left) + 'px';
  r.style.top  = (e.clientY - rect.top) + 'px';
  target.appendChild(r);
  r.addEventListener('animationend', () => r.remove(), { once: true });
});

// 3) Little “tick” on slider value changes (optional polish)
const speedValue = document.getElementById('speedValue');
const sizeValue  = document.getElementById('sizeValue');
function tick(el) {
  if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  el.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.08)' }, { transform: 'scale(1)' }],
             { duration: 160, easing: 'ease-out' });
}
// If your hookUI updates these values, also call tick(...) there:
document.getElementById('speedSlider')?.addEventListener('input', () => tick(speedValue));
document.getElementById('sizeSlider')?.addEventListener('input',  () => tick(sizeValue));
