// MODULE: EXAMPLE AND INTERACTIVE ACTIVITY LOGISTICS

let interactiveActive = false;   // WHETHER WE ARE IN AN INTERACTIVE ATTEMPT RIGHT NOW
let uiMode = 'example';          // 'example' | 'interactive' | 'quiz' | 'coding'
let userInput = [];
let correctAnswer = [];

// --- HELPERS ---
function getRandomGraph() {
  const idx = getRandomInt(0, graphs.length - 1);
  return graphs[idx];
}

function resetGraph() {
  clearAnimTimers();
  if (typeof cy !== 'undefined') {
    cy.stop();
    const cls = 'visited active current highlighted correct wrong clicked done';
    cy.nodes().removeClass(cls);
    cy.edges().removeClass(cls);
    cy.nodes().forEach(node => {
      node.stop();
      node.removeStyle('background-color');
      node.removeStyle('color');
      node.removeStyle('text-outline-color');
      node.animate({
        style: {
          'background-color': '#007BFF',
          'color': '#fff',
          'text-outline-color': '#007BFF'
        }
      }, { duration: 200 });
    });
    cy.edges().forEach(e => {
      e.removeStyle('line-color');
      e.removeStyle('target-arrow-color');
      e.removeStyle('width');
    });
  }
  userInput = [];
}

// --- BUTTONS ---
let runExampleBtn, startInteractiveBtn;
function cacheButtons() {
  runExampleBtn       = document.getElementById('run-example-btn');
  startInteractiveBtn = document.getElementById('start-interactive-btn');
  // NOTE: quiz & coding buttons are fetched inline where needed
}

/* -----------------------------------------------------------
   REVEAL HELPERS (fast cadence 40 / 80 / 140 / 200 ms)
----------------------------------------------------------- */
function applyFastReveal(descEl, visEl) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  const header   = document.querySelector('h1');
  const controls = document.querySelector('.controls');

  // Ensure elements are visible before animating (avoid display:none jumps)
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.documentElement.classList.add('reveal-dfs');

      // header → desc → controls → panel
      if (header)   header.style.setProperty('--reveal-delay', '40ms');
      if (descEl)   descEl.style.setProperty('--reveal-delay', '80ms');
      if (controls) controls.style.setProperty('--reveal-delay','140ms');
      if (visEl)    visEl.style.setProperty('--reveal-delay',  '200ms');

      const finalize = () => {
        document.documentElement.classList.remove('reveal-dfs');
        [header, descEl, controls, visEl].forEach(el => el && el.style.removeProperty('--reveal-delay'));
        visEl && visEl.removeEventListener('animationend', finalize);
      };
      visEl && visEl.addEventListener('animationend', finalize, { once: true });
    });
  });
}

// --- UI MODE ---
function setUIMode(mode) {
  uiMode = mode;

  if (!runExampleBtn || !startInteractiveBtn) cacheButtons();

  const exInstr = document.getElementById('example-instructions');
  const itInstr = document.getElementById('interactive-instructions');
  const viz     = document.getElementById('visualization');
  const fb      = document.getElementById('dfs-feedback');
  const quiz    = document.getElementById('dfs-quiz');
  const coding  = document.getElementById('coding-activity');
  const quizBtn = document.getElementById('take-quiz-btn');
  const h1      = document.querySelector('h1');
  const pseudo  = document.getElementById('pseudocodePanel');
  const app     = document.getElementById('application-activity');
  const qzInstr = document.getElementById('quiz-instructions');
  const cdInstr = document.getElementById('coding-instructions');

  // helpers
  const show = (el) => { if (el) el.style.display = 'block'; };
  const hide = (el) => { if (el) el.style.display = 'none'; };

  // default: hide everything
  hide(exInstr); hide(itInstr); hide(viz); hide(fb); hide(quiz); hide(coding); hide(app); hide(qzInstr); hide(cdInstr);

  // close pseudocode if open (optional; keep UX simple when switching modes)
  if (pseudo && pseudo.classList.contains('show')) {
    pseudo.classList.remove('show');
    pseudo.setAttribute('aria-hidden', 'true');
    const btn = document.getElementById('togglePseudocodeBtn');
    if (btn) { btn.setAttribute('aria-pressed', 'false'); btn.textContent = 'Show pseudocode'; }
  }

  if (mode === 'example') {
    show(viz); show(exInstr); show(fb);
    if (runExampleBtn)       runExampleBtn.textContent       = 'Run Example DFS';
    if (startInteractiveBtn) startInteractiveBtn.textContent = 'Start Interactive DFS';
    if (quizBtn)             quizBtn.textContent             = 'Take a Quiz';
    if (h1) h1.textContent = '🧠 Example DFS Tutorial';
  } else if (mode === 'interactive') {
    show(viz); show(itInstr); show(fb);
    if (runExampleBtn)       runExampleBtn.textContent       = 'Return to DFS Example';
    if (startInteractiveBtn) startInteractiveBtn.textContent = 'Try another DFS';
    if (quizBtn)             quizBtn.textContent             = 'Take a Quiz';
    if (h1) h1.textContent = '🧠 Interactive DFS Tutorial';
  } else if (mode === 'quiz') {
    show(quiz); show(qzInstr)
    if (runExampleBtn)       runExampleBtn.textContent       = 'Run Example DFS';
    if (startInteractiveBtn) startInteractiveBtn.textContent = 'Start Interactive DFS';
    if (quizBtn)             quizBtn.textContent             = 'Retake Quiz';
    if (h1) h1.textContent = '🧠 DFS Quiz';
  } else if (mode === 'coding') {
    show(coding); show(cdInstr);
    if (runExampleBtn)       runExampleBtn.textContent       = 'Run Example DFS';
    if (startInteractiveBtn) startInteractiveBtn.textContent = 'Start Interactive DFS';
    if (quizBtn)             quizBtn.textContent             = 'Take a Quiz';
    if (h1) h1.textContent = '🧠 DFS Coding Activity';
  } else if (mode === 'application') {
    show(app);
    if (runExampleBtn)       runExampleBtn.textContent       = 'Run Example DFS';
    if (startInteractiveBtn) startInteractiveBtn.textContent = 'Start Interactive DFS';
    if (quizBtn)             quizBtn.textContent             = 'Take a Quiz';
    if (h1) h1.textContent = '🧩 Maze Application';
    const appPanel = document.getElementById('application-activity');
    if (appPanel) appPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Apply fast reveal for the visible description/panel
  let descEl = null, visEl = null;
  if (mode === 'example') {
    descEl = exInstr; visEl = viz;
  } else if (mode === 'interactive') {
    descEl = itInstr; visEl = viz;
  } else if (mode === 'quiz') {
    descEl = qzInstr; visEl = quiz;
  } else if (mode === 'coding') {
    descEl = cdInstr; visEl = coding;
  } else if (mode === 'application') {
    descEl = app ? app.querySelector('.activity-instructions') : null;
    visEl  = app ? app.querySelector('#maze-frame') : null;
  }
  applyFastReveal(descEl, visEl);
}

// --- EXAMPLE ACTIVITY ---
// RUN DFS AND ANIMATE ON GRAPH
function startDFS() {
  setUIMode('example');
  endInteractiveSession();
  const graph = typeof sampleGraph !== 'undefined' ? sampleGraph : getRandomGraph();
  loadGraph(graph);
  resetGraph();
  if (typeof cy !== 'undefined') {
    cy.resize();
    cy.layout({
      name: 'breadthfirst',
      directed: true,
      roots: ['A'],
      orientation: 'vertical',
      spacingFactor: 1.75,
      padding: 10
    }).run();
  }
  const order = dfs(graph, 'A');
  animateDFSTraversal(order);
}

// EXAMPLE TRAVERSAL ANIMATION
function animateDFSTraversal(order) {
  const delay = 600;
  order.forEach((nodeId, i) => {
    trackTimeout(() => {
      cy.getElementById(nodeId).animate({
        style: { 'background-color': 'orange' }
      }, { duration: 300 });
    }, i * delay);
  });
}

// TRAVERSAL VISUALIZED VIA HIGHLIGHTING
function highlightNode(nodeId, correct) {
  cy.getElementById(nodeId).animate({
    style: { 'background-color': correct ? '#28a745' : '#dc3545' }
  }, { duration: 300 });
}

// HIGHLIGHT TIMING AND DISPLAY
let _animTimers = [];
function trackTimeout(fn, ms) {
  const id = setTimeout(fn, ms);
  _animTimers.push(id);
  return id;
}

function clearAnimTimers() {
  _animTimers.forEach(clearTimeout);
  _animTimers = [];
}

// --- INTERACTIVE ACTIVITY ---
// START ACTIVITY
function startInteractiveDFS() {
  setUIMode('interactive');
  interactiveActive = true;
  renderResult(null);
  const graph = getRandomGraph();
  loadGraph(graph);
  resetGraph();
  if (typeof cy !== 'undefined') {
    cy.resize();
    cy.layout({
      name: 'breadthfirst',
      directed: true,
      roots: ['A'],
      orientation: 'vertical',
      spacingFactor: 1.75,
      padding: 10
    }).run();
  }
  if (typeof cy !== 'undefined') cy.off('tap');
  userInput     = [];
  correctAnswer = dfs(graph, 'A');
  console.log('Correct DFS Order:', correctAnswer);
  cy.on('tap', 'node', (evt) => {
    if (!interactiveActive) return;
    const clicked = evt.target.id();
    if (userInput.includes(clicked)) return;
    const expected = correctAnswer[userInput.length];
    if (clicked === expected) {
      userInput.push(clicked);
      highlightNode(clicked, true);
      renderResult('step-correct');
      if (userInput.length === correctAnswer.length) {
        renderResult(true);
        endInteractiveSession();
      }
    } else {
      highlightNode(clicked, false);
      renderResult(false);
    }
  });
}

function hideStartInteractive() {
  const btn = document.getElementById('start-interactive-btn');
  if (btn) btn.classList.remove('revealed');
}

// TEXT BOX FOR FEEDBACK
function renderResult(state) {
  const fb = document.getElementById('dfs-feedback');
  if (!fb) return;

  const modal = document.getElementById('dfs-modal');
  const modalMsg = document.getElementById('dfs-modal-message');
  const modalClose = document.getElementById('dfs-modal-close');

  if (state === false) {
    fb.className = 'feedback wrong';
    if (modal && modalMsg && modalClose) {
      modalMsg.textContent = '❌ Incorrect choice!';
      modalClose.textContent = 'Try Again';
      modal.style.display = 'flex';
      modalClose.onclick = () => { modal.style.display = 'none'; };
    }
  } else if (state === true) {
    fb.className = 'feedback correct';
    if (modal && modalMsg && modalClose) {
      modalMsg.textContent = '🎉 Traversal complete!';
      modalClose.textContent = 'Close';
      modal.style.display = 'flex';
      modalClose.onclick = () => { modal.style.display = 'none'; };
    }
  } else {
    // neutral / step-correct: keep fb visible but don't modal
    fb.className = 'feedback';
  }
}

// ENDING INTERACTIVE ACTIVITY
function endInteractiveSession() {
  interactiveActive = false;
  if (typeof cy !== 'undefined') cy.off('tap');
}

// --- PAGE LOGISTICS ---

// ALLOW BUTTONS TO CALL ACTIVITY FUNCTIONS
window.startInteractiveDFS = startInteractiveDFS;
window.startDFS = startDFS;
window.resetGraph = resetGraph;

// INITIALIZE ITEMS ON PAGE
document.addEventListener('DOMContentLoaded', () => {
  cacheButtons();
  setUIMode('example');

  // unify top buttons via the single state machine
  const codingBtn = document.getElementById('start-coding-btn');
  const quizBtn   = document.getElementById('take-quiz-btn');
  const appBtn    = document.getElementById('start-application-btn');

  if (runExampleBtn) {
    runExampleBtn.addEventListener('click', () => {
      setUIMode('example');
      startDFS();
    });
  }
  if (startInteractiveBtn) {
    startInteractiveBtn.addEventListener('click', () => {
      setUIMode('interactive');
      startInteractiveDFS();
    });
  }
  if (quizBtn) {
    quizBtn.addEventListener('click', () => {
      setUIMode('quiz');
      const selected = getRandomQuestions(dfsQuestions, 5);
      renderQuiz(selected);
    });
  }
  if (codingBtn) {
    codingBtn.addEventListener('click', () => {
      setUIMode('coding');
      const panel = document.getElementById('coding-activity');
      if (panel) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  if (appBtn) {
    appBtn.addEventListener('click', () => {
      setUIMode('application');
    });
  }

  // One-time top-down reveal on initial load (FAST cadence)
  (function runInitialRevealOnce() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || window._dfsRevealDone) return;  // do not re-run

    // Which description is currently visible?
    const desc = [
      document.getElementById('example-instructions'),
      document.getElementById('interactive-instructions'),
      document.getElementById('coding-instructions')
    ].find(el => el && getComputedStyle(el).display !== 'none');

    const header   = document.querySelector('h1');
    const controls = document.querySelector('.controls');
    const vis      = document.getElementById('visualization');

    // Set delays (header → desc → buttons → panel) — FAST cadence
    if (header)   header.style.setProperty('--reveal-delay', '80ms');
    if (desc)     desc.style.setProperty('--reveal-delay',   '160ms');
    if (controls) controls.style.setProperty('--reveal-delay','240ms');
    if (vis)      vis.style.setProperty('--reveal-delay',    '300ms');

    // Add the class that enables the CSS animations
    document.documentElement.classList.add('reveal-dfs');

    // After the LAST animation ends (the panel), remove the class + inline vars
    const finalize = () => {
      document.documentElement.classList.remove('reveal-dfs');
      [header, desc, controls, vis].forEach(el => el && el.style.removeProperty('--reveal-delay'));
      window._dfsRevealDone = true;   // prevent any future re-runs this session
      vis && vis.removeEventListener('animationend', finalize);
    };
    vis && vis.addEventListener('animationend', finalize);
  })();
});
