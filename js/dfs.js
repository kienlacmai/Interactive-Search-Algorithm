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
    'B': ['D','F'],
    'C': ['E', 'G'],
    'D': [],
    'E': [],
    'F': [],
    'G': []
};

// 1. Balanced binary‐tree–like graph (depth 3)
const sampleGraph1 = {
    'A': ['B', 'C'],
    'B': ['D', 'E'],
    'C': ['F', 'G'],
    'D': ['H'],
    'E': [],
    'F': [],
    'G': [],
    'H': []
  };
  
  // 2. Unbalanced graph with branches of different lengths
  const sampleGraph2 = {
    'A': ['B', 'C'],
    'B': ['D'],        // B→D→G→H
    'C': ['E', 'F'],   // C→E→I
    'D': ['G'],
    'E': ['I'],
    'F': [],
    'G': ['H'],
    'H': [],
    'I': []
  };
  
  // 3. Graph containing a small cycle (to illustrate backtracking / cycle detection)
  const sampleGraph3 = {
    'A': ['B', 'C'],
    'B': ['D', 'E'],
    'C': ['F'],
    'D': ['B'],   // cycle: B→D→B
    'E': [],
    'F': ['G', 'H'],
    'G': [],
    'H': []
  };
  
  // 4. Disconnected graph (two separate components)
  const sampleGraph4 = {
    'A': ['B', 'C'],  // Component 1: A→B,C→D
    'B': ['D'],
    'C': [],
    'D': [],
    'E': ['F'],       // Component 2: E→F→G,H
    'F': ['G', 'H'],
    'G': [],
    'H': []
  };
  
  const randomgraphgenerator = [sampleGraph1, sampleGraph2, sampleGraph3, sampleGraph4];

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
