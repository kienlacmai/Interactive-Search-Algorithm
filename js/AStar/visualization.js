// visualization.js — SAFE INIT (no hard dependency on sampleGraph at parse time)
let cy;

function loadGraph(graph) {
  if (!cy) return;
  cy.elements().remove();
  cy.add(generateElementsFromGraph(graph));
  cy.layout({
    name: 'breadthfirst',
    directed: true,
    roots: ['A'],
    orientation: 'vertical',
    spacingFactor: 1.75,
    padding: 10
  }).run();
}

function generateElementsFromGraph(graph) {
  const elements = [];
  const added = new Set();
  for (const node in graph) {
    if (!added.has(node)) {
      elements.push({ data: { id: node } });
      added.add(node);
    }
    (graph[node] || []).forEach(nbr => {
      if (!added.has(nbr)) {
        elements.push({ data: { id: nbr } });
        added.add(nbr);
      }
      elements.push({ data: { source: node, target: nbr } });
    });
  }
  return elements;
}

document.addEventListener("DOMContentLoaded", function () {
  cy = cytoscape({
    userZoomingEnabled: false,
    userPanningEnabled: false,
    boxSelectionEnabled: false,
    autoungrabify: true,
    container: document.getElementById('visualization'),
    elements: [], // start empty—no crash if sampleGraph isn't defined yet
    style: [
      { selector: 'node', style: {
          'background-color': '#007BFF',
          'label': 'data(id)',
          'text-valign': 'center',
          'color': '#fff',
          'text-outline-color': '#000000ff',
          'text-outline-width': 2,
          'font-family': 'system-ui, sans-serif',
      }},
      { selector: 'edge', style: { 'width': 2, 'line-color': '#ccc' } }
    ],
    layout: {
      name: 'breadthfirst',
      directed: true,
      padding: 10,
      spacingFactor: 1.75,
      animate: false,
      avoidOverlap: true,
      roots: ['A'],
      orientation: 'vertical'
    }
  });

  // If a default graph exists, render it once.
  if (typeof window.sampleGraph !== 'undefined') {
    loadGraph(window.sampleGraph);
  } else if (typeof window.aStarGraph !== 'undefined') {
    loadGraph(window.aStarGraph);
  }
});
