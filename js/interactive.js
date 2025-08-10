// interactive.js

// --- Global state ---
let interactiveActive = false;   // whether we are in an interactive attempt right now
let uiMode = 'example';          // 'example' | 'interactive'
let userInput = [];
let correctAnswer = [];

// Expect these to be defined in dfs.js
//   - sampleGraph
//   - randomgraphgenerator (array of graphs)
//   - getRandomInt(min,max)
const randomGraphs = typeof randomgraphgenerator !== 'undefined' ? randomgraphgenerator : [];
const N = randomGraphs.length;

// --- Button cache ---
let runExampleBtn, startInteractiveBtn, resetBtn;
function cacheButtons() {
  runExampleBtn       = document.getElementById('run-example-btn');
  startInteractiveBtn = document.getElementById('start-interactive-btn');
  resetBtn            = document.getElementById('reset-btn');
}

// --- scheduling for example animation (ADDED) ---
let _animTimers = []; // ADDED: store all timeouts used by the example animation
function trackTimeout(fn, ms) { // ADDED
  const id = setTimeout(fn, ms);
  _animTimers.push(id);
  return id;
}
function clearAnimTimers() { // ADDED
  _animTimers.forEach(clearTimeout);
  _animTimers = [];
}

// --- reveal/hide "Start Interactive DFS" gate (ADDED) ---
function revealStartInteractive() { // ADDED
  const btn = document.getElementById('start-interactive-btn');
  if (btn) btn.classList.add('revealed'); // relies on CSS gate you added earlier
  localStorage.setItem('dfsInteractiveRevealed', '1');
}
function hideStartInteractive() { // ADDED
  const btn = document.getElementById('start-interactive-btn');
  if (btn) btn.classList.remove('revealed');
}

// --- UI helpers ---
function setUIMode(mode) {
  uiMode = mode;
  if (!runExampleBtn || !startInteractiveBtn || !resetBtn) cacheButtons();
  const exInstr  = document.getElementById('example-instructions');
  const instr = document.getElementById('interactive-instructions');
  if (exInstr) exInstr.style.display = (mode === 'example' ? 'block' : 'none');
  if (instr) instr.style.display = (mode === 'interactive' ? 'block' : 'none');
  if (mode === 'interactive') {
    // CHANGED: keep Reset visible in interactive mode (was hidden before)
    if (runExampleBtn) runExampleBtn.textContent = 'Return to DFS Example';
    if (startInteractiveBtn) startInteractiveBtn.textContent = 'Try another DFS';
  } else {
    // Example mode: restore names
    if (runExampleBtn) runExampleBtn.textContent = 'Run Example DFS';
    if (startInteractiveBtn) startInteractiveBtn.textContent = 'Start Interactive DFS';
  }
}

// Display on-screen feedback instead of alert()
function renderResult(state) {
  const fb = document.getElementById('dfs-feedback');
  if (!fb) return;

  const modal = document.getElementById('dfs-modal');
  const modalMsg = document.getElementById('dfs-modal-message');
  const modalClose = document.getElementById('dfs-modal-close');

  // Only show modal for wrong step or traversal complete
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

// Pick a random graph from the pool
function getRandomGraph() {
  if (!N) return typeof sampleGraph !== 'undefined' ? sampleGraph : {};
  const idx = getRandomInt(0, N - 1);
  return randomGraphs[idx];
}

// Highlight a node with green/red on user tap
function highlightNode(nodeId, correct) {
  cy.getElementById(nodeId).animate({
    style: { 'background-color': correct ? '#28a745' : '#dc3545' }
  }, { duration: 300 });
}

// Remove interactive handlers and flags
function endInteractiveSession() {
  interactiveActive = false;
  if (typeof cy !== 'undefined') cy.off('tap');
}

// Start a new interactive DFS session (new random graph each time)
function startInteractiveDFS() {
  setUIMode('interactive');
  interactiveActive = true;
  renderResult(null); // clear feedback

  const graph = getRandomGraph();
  loadGraph(graph);   // from visualization.js
  resetGraph();       // reset styles

  if (typeof cy !== 'undefined') cy.off('tap'); // clear any old handlers

  userInput     = [];
  correctAnswer = dfs(graph, 'A');
  console.log('Correct DFS Order:', correctAnswer);

  // Single tap handler for this session
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

// Non-interactive example: run DFS on the sample graph and animate
function startDFS() {
  // When returning to example from interactive, restore UI and stop interactive taps
  setUIMode('example');
  //renderResult(null);
  endInteractiveSession();

  const graph = typeof sampleGraph !== 'undefined' ? sampleGraph : getRandomGraph();
  loadGraph(graph);
  resetGraph();

  const order = dfs(graph, 'A');
  animateDFSTraversal(order);
}

// Animate a DFS traversal (orange sequence)
function animateDFSTraversal(order) {
  const delay = 600;
  order.forEach((nodeId, i) => {
    trackTimeout(() => { // CHANGED: track timeouts so Reset can cancel them
      cy.getElementById(nodeId).animate({
        style: { 'background-color': 'orange' }
      }, { duration: 300 });
    }, i * delay);
  });

  // Reveal “Start Interactive DFS” just after the last step finishes (ADDED)
  trackTimeout(revealStartInteractive, order.length * delay + 20); // ADDED
}

// Reset all nodes to default style AND cancel any running animation/timers
function resetGraph() {
  clearAnimTimers();                 // ADDED: cancel any pending example steps

  if (typeof cy !== 'undefined') {
    cy.stop();                       // ADDED: stop queued animations

    // ADDED: clear traversal classes and inline styles
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

  // ADDED: reset interactive attempt and feedback
  userInput = [];
  //renderResult(null);

  // ADDED: gate interactive button again (only matters if you use the CSS gate)
  //hideStartInteractive();
}

// Make controls callable from inline HTML handlers (if used)
window.startInteractiveDFS = startInteractiveDFS;
window.startDFS = startDFS;
window.resetGraph = resetGraph;

// Initialize UI text on load
document.addEventListener('DOMContentLoaded', () => {
  cacheButtons();
  setUIMode('example');

  if (localStorage.getItem('dfsInteractiveRevealed') === '1') {
    const btn = document.getElementById('start-interactive-btn');
    if (btn) btn.classList.add('revealed');
  }
});
