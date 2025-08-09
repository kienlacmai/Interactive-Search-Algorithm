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

// --- UI helpers ---
function setUIMode(mode) {
  uiMode = mode;
  if (!runExampleBtn || !startInteractiveBtn || !resetBtn) cacheButtons();

  if (mode === 'interactive') {
    // Hide reset; rename the other two
    if (resetBtn) resetBtn.style.display = 'none';
    if (runExampleBtn) runExampleBtn.textContent = 'Return to DFS Example';
    if (startInteractiveBtn) startInteractiveBtn.textContent = 'Try another DFS';
  } else {
    // Example mode: show reset; restore names
    if (resetBtn) resetBtn.style.display = '';
    if (runExampleBtn) runExampleBtn.textContent = 'Run Example DFS';
    if (startInteractiveBtn) startInteractiveBtn.textContent = 'Start Interactive DFS';
  }
}

// Display on-screen feedback instead of alert()
function renderResult(success) {
  const fb = document.getElementById('dfs-feedback');
  if (!fb) return;
  if (success === true) {
    fb.textContent = '✅ You did it!';
    fb.className = 'feedback correct';
  } else if (success === false) {
    fb.textContent = '❌ Wrong step—try again.';
    fb.className = 'feedback wrong';
  } else {
    fb.textContent = '';
    fb.className = 'feedback';
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
  renderResult(null);
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
    setTimeout(() => {
      cy.getElementById(nodeId).animate({
        style: { 'background-color': 'orange' }
      }, { duration: 300 });
    }, i * delay);
  });
}

// Reset all nodes to default style
function resetGraph() {
  cy.nodes().forEach(node => {
    node.animate({
      style: {
        'background-color': '#007BFF',
        'color': '#fff',
        'text-outline-color': '#007BFF'
      }
    }, { duration: 300 });
  });
}

// Make controls callable from inline HTML handlers (if used)
window.startInteractiveDFS = startInteractiveDFS;
window.startDFS = startDFS;
window.resetGraph = resetGraph;

// Initialize UI text on load
document.addEventListener('DOMContentLoaded', () => {
  cacheButtons();
  setUIMode('example');
});