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
    const cls = 'visited active current highlighted correct wrong';
    cy.nodes().removeClass(cls);
    cy.edges().removeClass(cls);
  }
}

let timers = [];
function clearAnimTimers() {
  timers.forEach(t => clearTimeout(t));
  timers = [];
}

function animateStep(nodeId, delay, isCorrectPath=false) {
  const t = setTimeout(() => {
    const node = cy.$(`#${nodeId}`);
    if (node) {
      node.addClass('active');
      if (isCorrectPath) node.addClass('correct');
    }
  }, delay);
  timers.push(t);
}

// --- RENDER RESULTS ---
function renderResult(status) {
  const fb = document.getElementById('astar-feedback');
  if (!fb) return;

  if (status === true || status === 'step-correct') {
    fb.className = 'feedback correct';
    fb.textContent = status === true
      ? '✅ Great job! You followed the A* path correctly!'
      : '✅ Correct next step.';
  } else if (status === false) {
    fb.className = 'feedback wrong';
    fb.textContent = '❌ That node is not next on the A* path. Try again!';
  } else {
    fb.className = 'feedback';
    fb.textContent = '';
  }
}

// --- MAIN EXAMPLE RUN ---
function runExample() {
  resetGraph();
  const graph = getRandomGraph();
  loadGraph(graph);

  // Compute correct A* path for this graph from registry
  const ctx = getAStarContext(graph);
  correctAnswer = astar(graph, ctx.start, ctx.goal, ctx.weights, ctx.heuristic);
  console.log('Correct A* Path:', correctAnswer);

  // Animate
  let delay = 0;
  correctAnswer.forEach((n) => {
    animateStep(n, delay, true);
    delay += 700;
  });
}

// --- INTERACTIVE MODE ---
function startInteractive() {
  interactiveActive = true;
  userInput = [];
  const graph = getRandomGraph();
  loadGraph(graph);

  const ctx = getAStarContext(graph);
  correctAnswer = astar(graph, ctx.start, ctx.goal, ctx.weights, ctx.heuristic);

  renderResult(null);

  cy.nodes().on('tap', (evt) => {
    if (!interactiveActive) return;
    const clicked = evt.target.data('id');
    const expected = correctAnswer[userInput.length];
    if (clicked === expected) {
      userInput.push(clicked);
      const node = cy.$(`#${clicked}`);
      node.addClass('highlighted');
      renderResult('step-correct');
      if (userInput.length === correctAnswer.length) {
        renderResult(true);
        endInteractiveSession();
      }
    } else {
      const node = cy.$(`#${clicked}`);
      node.addClass('wrong');
      renderResult(false);
    }
  });
}

function endInteractiveSession() {
  interactiveActive = false;
}

// Cache main buttons for performance
let runExampleBtn, startInteractiveBtn;
function cacheButtons() {
  runExampleBtn       = document.getElementById('run-example-btn');
  startInteractiveBtn = document.getElementById('start-interactive-btn');
}

// --- UI MODE SWITCHING ---
function setUIMode(mode) {
  uiMode = mode;
  if (!runExampleBtn || !startInteractiveBtn) cacheButtons();

  const exInstr = document.getElementById('example-instructions');
  const itInstr = document.getElementById('interactive-instructions');
  const viz     = document.getElementById('visualization');
  const fb      = document.getElementById('astar-feedback');
  const quiz    = document.getElementById('astar-quiz');
  const coding  = document.getElementById('coding-activity');
  const quizBtn = document.getElementById('take-quiz-btn');
  const h1      = document.querySelector('h1');
  const pseudo  = document.getElementById('pseudocodePanel');
  const qzInstr = document.getElementById('quiz-instructions');
  const cdInstr = document.getElementById('coding-instructions');

  const show = (el) => { if (el) el.style.display = 'block'; };
  const hide = (el) => { if (el) el.style.display = 'none'; };

  // default hide
  hide(exInstr); hide(itInstr); hide(viz); hide(fb); hide(quiz); hide(coding); hide(qzInstr); hide(cdInstr);

  // close pseudocode if open
  if (pseudo && pseudo.classList.contains('show')) {
    pseudo.classList.remove('show');
    pseudo.setAttribute('aria-hidden', 'true');
    const btn = document.getElementById('togglePseudocodeBtn');
    if (btn) { btn.setAttribute('aria-pressed', 'false'); btn.textContent = 'Show pseudocode'; }
  }

  if (mode === 'example') {
    show(viz); show(exInstr); show(fb);
    if (runExampleBtn)       runExampleBtn.textContent       = 'Run Example A*';
    if (startInteractiveBtn) startInteractiveBtn.textContent = 'Start Interactive A*';
    if (quizBtn)             quizBtn.textContent             = 'Take a Quiz';
    if (h1) h1.textContent = 'A* Search (A*) — Interactive Tutorial';
    runExample();
  } else if (mode === 'interactive') {
    show(viz); show(itInstr); show(fb);
    if (runExampleBtn)       runExampleBtn.textContent       = 'Return to A* Example';
    if (startInteractiveBtn) startInteractiveBtn.textContent = 'Try another A* activity';
    if (quizBtn)             quizBtn.textContent             = 'Take a Quiz';
    if (h1) h1.textContent = 'A* Search (A*) — Interactive Tutorial';
    resetGraph();
    startInteractive();
  } else if (mode === 'quiz') {
    show(quiz); show(qzInstr);
    if (runExampleBtn)       runExampleBtn.textContent       = 'Run Example A*';
    if (startInteractiveBtn) startInteractiveBtn.textContent = 'Start Interactive A*';
    if (quizBtn)             quizBtn.textContent             = 'Retake Quiz';
    if (h1) h1.textContent = 'A* Quiz';
  } else if (mode === 'coding') {
    show(coding); show(cdInstr);
    if (runExampleBtn)       runExampleBtn.textContent       = 'Run Example A*';
    if (startInteractiveBtn) startInteractiveBtn.textContent = 'Start Interactive A*';
    if (quizBtn)             quizBtn.textContent             = 'Take a Quiz';
    if (h1) h1.textContent = 'A* Coding Activity';
  }
}

// --- BUTTONS / INIT ---
window.addEventListener('DOMContentLoaded', () => {
  cacheButtons();
  setUIMode('example');

  const runExampleBtn = document.getElementById('run-example-btn');
  const startInteractiveBtn = document.getElementById('start-interactive-btn');
  const quizBtn = document.getElementById('take-quiz-btn');
  const codingBtn = document.getElementById('start-coding-btn');
  const togglePseudo = document.getElementById('togglePseudocodeBtn');
  const closePseudo  = document.getElementById('closePseudocodeBtn');

  if (runExampleBtn) {
    runExampleBtn.addEventListener('click', () => {
      if (uiMode === 'interactive') setUIMode('example'); else setUIMode('example');
    });
  }
  if (startInteractiveBtn) {
    startInteractiveBtn.addEventListener('click', () => setUIMode('interactive'));
  }
  if (quizBtn) {
    quizBtn.addEventListener('click', () => setUIMode('quiz'));
  }
  if (codingBtn) {
    codingBtn.addEventListener('click', () => {
      setUIMode('coding');
      const panel = document.getElementById('coding-activity');
      if (panel) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
  if (togglePseudo) {
    togglePseudo.addEventListener('click', () => {
      const panel = document.getElementById('pseudocodePanel');
      const pressed = togglePseudo.getAttribute('aria-pressed') === 'true';
      const now = !pressed;
      togglePseudo.setAttribute('aria-pressed', now ? 'true' : 'false');
      togglePseudo.textContent = now ? 'Hide pseudocode' : 'Show pseudocode';
      if (panel) {
        if (now) { panel.classList.add('show'); panel.setAttribute('aria-hidden', 'false'); }
        else     { panel.classList.remove('show'); panel.setAttribute('aria-hidden', 'true'); }
      }
    });
  }
  if (closePseudo) {
    closePseudo.addEventListener('click', () => {
      const panel = document.getElementById('pseudocodePanel');
      const btn = document.getElementById('togglePseudocodeBtn');
      if (panel) { panel.classList.remove('show'); panel.setAttribute('aria-hidden', 'true'); }
      if (btn)   { btn.setAttribute('aria-pressed', 'false'); btn.textContent = 'Show pseudocode'; }
    });
  }
});
