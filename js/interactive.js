// interactive.js

// State variables
let interactiveActive = false;
let userInput = [];
let correctAnswer = [];

// Array of random graphs
const randomGraphs = randomgraphgenerator;
const N = randomGraphs.length;

// Utility: pick a random graph from the array
function getRandomGraph() {
  const idx = getRandomInt(0, N - 1);
  return randomGraphs[idx];
}
// Render on-screen feedback instead of alert()
function renderResult(success) {
  const fb = document.getElementById('dfs-feedback');
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

// Highlight a node with green/red on user tap
function highlightNode(nodeId, correct) {
  cy.getElementById(nodeId).animate({
    style: { 'background-color': correct ? '#28a745' : '#dc3545' }
  }, { duration: 300 });
}

// Start a new interactive DFS session
function startInteractiveDFS() {
  interactiveActive = true;
  renderResult(null);                // Clear previous feedback

  const graph = getRandomGraph();
  loadGraph(graph);                  // Rebuilds the graph visualization
  resetGraph();                      // Reset all node styles to default

  cy.off('tap');                     // Remove any old handlers

  userInput     = [];
  correctAnswer = dfs(graph, 'A');   // Compute correct DFS order
  console.log('Correct DFS Order:', correctAnswer);

  // Attach a single tap handler for this session
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
        interactiveActive = false;
      }
    } else {
      highlightNode(clicked, false);
      renderResult(false);
    }
  });
}

// Simple DFS animation (non-interactive)
function startDFS() {
  const graph = sampleGraph;
  loadGraph(graph);
  const order = dfs(graph, 'A');
  animateDFSTraversal(order);
}

// Animate the DFS traversal by coloring nodes orange sequentially
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

// Reset all nodes to the default style
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

// Expose functions globally for HTML buttons
window.startInteractiveDFS = startInteractiveDFS;
window.startDFS            = startDFS;
