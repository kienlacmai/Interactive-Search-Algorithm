// visualization.js using Cytoscape.js example
document.addEventListener("DOMContentLoaded", function () {
    var cy = cytoscape({
        container: document.getElementById('visualization'),
        elements: [
            { data: { id: 'A' } },
            { data: { id: 'B' } },
            { data: { id: 'C' } },
            { data: { id: 'D' } },
            { data: { id: 'E' } },
            { data: { source: 'A', target: 'B' } },
            { data: { source: 'A', target: 'C' } },
            { data: { source: 'B', target: 'D' } },
            { data: { source: 'C', target: 'E' } }
        ],
        style: [
            {
                selector: 'node',
                style: {
                    'background-color': '#007BFF',
                    'label': 'data(id)',
                    'text-valign': 'center',
                    'color': '#fff'
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
            name: 'breadthfirst'
        }
    });
});