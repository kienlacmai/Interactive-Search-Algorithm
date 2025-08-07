// Simple DFS Implementation
function dfs(graph, startNode) {
    let visited = new Set();
    let order = [];

    function explore(node) {
        visited.add(node);
        order.push(node);
        
        graph[node].forEach(neighbor => {
            if (!visited.has(neighbor)) {
                explore(neighbor);
            }
        });
    }

    explore(startNode);
    return order;
}

// Example usage
const sampleGraph = {
    'A': ['B', 'C'],
    'B': ['D'],
    'C': ['E'],
    'D': [],
    'E': []
};

console.log(dfs(sampleGraph, 'A')); // ['A', 'B', 'D', 'C', 'E']
