// visualization.js using Cytoscape.js
let cy; // make cy global so interactive.js can access it

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
                    'text-outline-width': 2
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
            roots: ['A'], // starting node of your DFS
            orientation: 'vertical' // or 'horizontal'
}
    });
});

function generateElementsFromGraph(graph) {
    const elements = [];
    const addedNodes = new Set();

    for (const node in graph) {
        if (!addedNodes.has(node)) {
            elements.push({ data: { id: node } });
            addedNodes.add(node);
        }

        graph[node].forEach(neighbor => {
            // Add neighbor node if not already added
            if (!addedNodes.has(neighbor)) {
                elements.push({ data: { id: neighbor } });
                addedNodes.add(neighbor);
            }

            // Add edge
            elements.push({ data: { source: node, target: neighbor } });
        });
    }

    return elements;
}
