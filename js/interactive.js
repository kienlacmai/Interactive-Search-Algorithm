// MODULE: EXAMPLE AND INTERACTIVE ACTIVITY LOGISTICS

let interactiveActive = false;   // WHETHER WE ARE IN AN INTERACTIVE ATTEMPT RIGHT NOW
let uiMode = 'example';          // 'EXAMPLE' | 'INTERACTIVE'
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
let runExampleBtn, startInteractiveBtn, startQuizBtn;
function cacheButtons() {
  runExampleBtn       = document.getElementById('run-example-btn');
  startInteractiveBtn = document.getElementById('start-interactive-btn');
  // startQuizBtn        = document.getElementById('take-quiz-btn');
}

// --- UI MODE ---
function setUIMode(mode) {
  uiMode = mode; //MODE = EXAMPLE, WHICH IS THE DEFAULT
  if (!runExampleBtn || !startInteractiveBtn) cacheButtons();
  const exInstr  = document.getElementById('example-instructions');
  const instr = document.getElementById('interactive-instructions');
  const quizBtn = document.getElementById('take-quiz-btn');
  if (exInstr) exInstr.style.display = (mode === 'example' ? 'block' : 'none');
  if (instr) instr.style.display = (mode === 'interactive' ? 'block' : 'none');
  if (mode === 'interactive') {
    if (runExampleBtn) runExampleBtn.textContent = 'Return to DFS Example';
    if (startInteractiveBtn) startInteractiveBtn.textContent = 'Try another DFS';
    if (quizBtn) quizBtn.textContent = 'Take a Quiz';
  } else if (mode === 'example') {
    if (runExampleBtn) runExampleBtn.textContent = 'Run Example DFS';
    if (startInteractiveBtn) startInteractiveBtn.textContent = 'Start Interactive DFS';
    if (quizBtn) quizBtn.textContent = 'Take a Quiz';
  } 
}

// --- EXAMPLE ACTIVITY ---
// RUN DFS AND ANIMATE ON GRAPH
function startDFS() {
  if (typeof window.hideQuizUI === 'function') window.hideQuizUI();
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
  trackTimeout(revealStartInteractive, order.length * delay + 20);
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
  if (typeof window.hideQuizUI === 'function') window.hideQuizUI();
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

function revealStartInteractive() {
  const btn = document.getElementById('start-interactive-btn');
  if (btn) btn.classList.add('revealed');
  localStorage.setItem('dfsInteractiveRevealed', '1'); // COMMENT OUT TO SEE INITIAL USER FLOW
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
      modalClose.onclick = () => {
        modal.style.display = 'none';
      };
    }
  } else if (state === true) {
    fb.className = 'feedback correct';
    if (modal && modalMsg && modalClose) {
      modalMsg.textContent = '🎉 Traversal complete!';
      modalClose.textContent = 'Close';
      modal.style.display = 'flex';
      modalClose.onclick = () => {
        modal.style.display = 'none';
      };
    }
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

  if (localStorage.getItem('dfsInteractiveRevealed') === '1') {
    const btn = document.getElementById('start-interactive-btn');
    // ADD LOGIC FOR TAKE QUIZ BUTTON
    if (btn) btn.classList.add('revealed'); // STORES THE BUTTON INTO LOCAL MEMORY SO ONCE UNLOCKED ALWAYS UNLOCKED
  }
});
