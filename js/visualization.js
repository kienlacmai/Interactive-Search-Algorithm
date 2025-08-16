// MODULE: GENERATING THE VISUAL GRAPHS
let cy;
let currentGraph = sampleGraph;

function loadGraph(graph) {
    cy.elements().remove();
    cy.add( generateElementsFromGraph(graph) );
    //GRAPH LAYOUT SETTINGS
    cy.layout({
      name: 'breadthfirst',
      directed: true,
      roots: ['A'],
      orientation: 'vertical',
      spacingFactor: 1.75,
      padding: 10
    }).run();
  }

// FUNCTION CREATING NODES AND EDGES IN VISUAL GRAPH
function generateElementsFromGraph(graph) {
    const elements = [];
    const addedNodes = new Set();
    for (const node in graph) {
        if (!addedNodes.has(node)) {
            elements.push({ data: { id: node } });
            addedNodes.add(node);
        }
        graph[node].forEach(neighbor => {
            if (!addedNodes.has(neighbor)) {
                elements.push({ data: { id: neighbor } });
                addedNodes.add(neighbor);
            }
            elements.push({ data: { source: node, target: neighbor } });
        });
    }
    return elements;
}

//DISPLAYING THE EXAMPLE DFS GRAPH WHEN BUTTON IS CLICKED
document.addEventListener("DOMContentLoaded", function () {
    cy = cytoscape({
        userZoomingEnabled: false,
        userPanningEnabled: false,
        boxSelectionEnabled: false,
        autoungrabify: true,
        container: document.getElementById('visualization'),
        elements: generateElementsFromGraph(sampleGraph),
        style: [
            {
                selector: 'node',
                style: {
                    'background-color': '#007BFF',
                    'label': 'data(id)',
                    'text-valign': 'center',
                    'color': '#fff',
                    'text-outline-color': '#000000ff',
                    'text-outline-width': 2,
                    'font-family': 'system-ui, sans-serif',
                }
            },
            {
                selector: 'edge',
                style: {
                    'width': 2,
                    'line-color': '#ccc'
                }
            }
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
});