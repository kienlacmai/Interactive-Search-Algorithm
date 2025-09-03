// astar.js — plain global function (no collisions)
function astar(graph, start, goal, weights = {}, heuristic = {}) {
  const open = new Set([start]);
  const cameFrom = {};
  const gScore = {};
  const fScore = {};
  const order = [];

  for (const n in graph) { gScore[n] = Infinity; fScore[n] = Infinity; }
  gScore[start] = 0;
  fScore[start] = (heuristic[start] ?? 0);

  function lowestF() {
    let best = null, bestVal = Infinity;
    open.forEach(n => { if (fScore[n] < bestVal) { bestVal = fScore[n]; best = n; } });
    return best;
  }
  const w = (u,v) => (weights[u + '->' + v] ?? 1);

  while (open.size) {
    const current = lowestF();
    order.push(current);
    if (current === goal) {
      const path = [];
      let cur = current;
      while (cur !== undefined) { path.push(cur); cur = cameFrom[cur]; }
      path.reverse();
      return { path, order, cost: gScore[current], cameFrom, gScore, fScore };
    }
    open.delete(current);
    for (const nb of (graph[current] || [])) {
      const tentative = gScore[current] + w(current, nb);
      if (tentative < gScore[nb]) {
        cameFrom[nb] = current;
        gScore[nb] = tentative;
        fScore[nb] = tentative + (heuristic[nb] ?? 0);
        open.add(nb);
      }
    }
  }
  return { path: [], order, cost: Infinity, cameFrom, gScore, fScore };
}

// A* sample graph + data — distinct names (won’t collide with dfs.js)
window.aStarGraph = {
  'A': ['B', 'C'],
  'B': ['D','F'],
  'C': ['E','G'],
  'D': [],
  'E': [],
  'F': [],
  'G': []
};
window.aStarWeights = {
  'A->B': 1, 'A->C': 2,
  'B->D': 4, 'B->F': 3,
  'C->E': 2, 'C->G': 3
};
window.aStarHeuristic = {
  'A': 5, 'B': 6, 'C': 3, 'D': 9, 'E': 7, 'F': 8, 'G': 0
};
