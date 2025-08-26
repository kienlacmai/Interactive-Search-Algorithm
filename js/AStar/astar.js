// MODULE: DFS ALGORITHM RUN AND GRAPH GENERATION

// DFS ALGORITHM CODE TO RUN
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

// EXAMPLE ACTIVITIY GRAPH
const sampleGraph = {
    'A': ['B', 'C'],
    'B': ['D','F'],
    'C': ['E', 'G'],
    'D': [],
    'E': [],
    'F': [],
    'G': []
};

// GRAPHS AND RANDOM GRAPH GENERATOR FOR INTERACTIVE DFS
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
  const sampleGraph2 = {
    'A': ['B', 'C'],
    'B': ['D'],        
    'C': ['E', 'F'],   
    'D': ['G'],
    'E': ['I'],
    'F': [],
    'G': ['H'],
    'H': [],
    'I': []
  };
  const sampleGraph3 = {
    'A': ['B', 'C'],
    'B': ['D', 'E'],
    'C': ['F'],
    'D': ['B'], 
    'E': [],
    'F': ['G', 'H'],
    'G': [],
    'H': []
  };
  const sampleGraph4 = {
    'A': ['B', 'C'],
    'B': ['D'],
    'C': [],
    'D': ['E','F'],
    'E': [],      
    'F': ['G', 'H'],
    'G': [],
    'H': []
  };
  
  const graphs = [sampleGraph1, sampleGraph2, sampleGraph3, sampleGraph4];

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
