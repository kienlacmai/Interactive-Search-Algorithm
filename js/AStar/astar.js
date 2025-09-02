// MODULE: A* ALGORITHM + SAMPLE GRAPHS

// ---------- A* (returns the node path from start to goal) ----------
function astar(graph, start, goal, weights, heuristic) {
  // graph: { node: [neighbors...] }
  // weights: { "U->V": cost }
  // heuristic: { node: h(node) }

  const openSet = new Set([start]);
  const cameFrom = {};
  const gScore = {};
  const fScore = {};

  for (const node in graph) {
    gScore[node] = Infinity;
    fScore[node] = Infinity;
  }
  gScore[start] = 0;
  fScore[start] = heuristic[start] ?? 0;

  function lowestF() {
    let best = null, bestVal = Infinity;
    openSet.forEach(n => {
      if (fScore[n] < bestVal) {
        bestVal = fScore[n];
        best = n;
      }
    });
    return best;
  }

  while (openSet.size > 0) {
    const current = lowestF();
    if (current === goal) {
      // reconstruct path
      const path = [current];
      let cur = current;
      while (cur in cameFrom) {
        cur = cameFrom[cur];
        path.push(cur);
      }
      return path.reverse(); // start ... goal
    }

    openSet.delete(current);

    for (const nb of graph[current]) {
      const wKey = current + "->" + nb;
      const w = weights[wKey] ?? 1; // default to 1 if not provided
      const tentative = gScore[current] + w;
      if (tentative < gScore[nb]) {
        cameFrom[nb] = current;
        gScore[nb] = tentative;
        fScore[nb] = tentative + (heuristic[nb] ?? 0);
        if (!openSet.has(nb)) openSet.add(nb);
      }
    }
  }

  // no path
  return [];
}

// ---------- Sample graphs with weights + heuristics ----------
const sampleGraph1 = {
  'A': ['B','C'],
  'B': ['D','E'],
  'C': ['F'],
  'D': ['G'],
  'E': ['G','H'],
  'F': ['H'],
  'G': [],
  'H': []
};
const weights1 = {
  'A->B': 1, 'A->C': 4,
  'B->D': 2, 'B->E': 5,
  'C->F': 1,
  'D->G': 2,
  'E->G': 1, 'E->H': 4,
  'F->H': 2
};
const coords1 = { A:[0,0], B:[1,1], C:[1,-1], D:[2,2], E:[2,0], F:[2,-2], G:[3,1], H:[3,-1] };

const sampleGraph2 = {
  'A': ['B','C'],
  'B': ['D'],
  'C': ['D','E'],
  'D': ['F'],
  'E': ['F','H'],
  'F': ['G'],
  'G': ['H'],
  'H': []
};
const weights2 = {
  'A->B': 2, 'A->C': 1,
  'B->D': 2,
  'C->D': 2, 'C->E': 2,
  'D->F': 2,
  'E->F': 1, 'E->H': 5,
  'F->G': 1,
  'G->H': 1
};
const coords2 = { A:[0,0], B:[1,1], C:[1,-1], D:[2,0], E:[2,-2], F:[3,0], G:[4,0], H:[5,0] };

const sampleGraph3 = {
  'A': ['B','C'],
  'B': ['E'],
  'C': ['D','F'],
  'D': ['G'],
  'E': ['G'],
  'F': ['H'],
  'G': ['H'],
  'H': []
};
const weights3 = {
  'A->B': 1, 'A->C': 2,
  'B->E': 4,
  'C->D': 1, 'C->F': 2,
  'D->G': 2,
  'E->G': 1,
  'F->H': 2,
  'G->H': 1
};
const coords3 = { A:[0,0], B:[1,1], C:[1,-1], D:[2,-2], E:[2,2], F:[2,-1], G:[3,1], H:[4,0] };

const sampleGraph4 = {
  'A': ['B','C'],
  'B': ['D','E'],
  'C': ['E'],
  'D': ['F'],
  'E': ['F','H'],
  'F': ['G'],
  'G': ['H'],
  'H': []
};
const weights4 = {
  'A->B': 1, 'A->C': 3,
  'B->D': 2, 'B->E': 2,
  'C->E': 1,
  'D->F': 2,
  'E->F': 2, 'E->H': 5,
  'F->G': 1,
  'G->H': 1
};
const coords4 = { A:[0,0], B:[1,1], C:[1,-1], D:[2,2], E:[2,0], F:[3,0], G:[4,0], H:[5,0] };

// Heuristic factory (straight-line distance to goal 'H')
function makeHeuristic(coords, goal='H') {
  function dist(a,b) {
    const dx = a[0]-b[0], dy = a[1]-b[1];
    return Math.hypot(dx,dy);
  }
  const target = coords[goal];
  const h = {};
  for (const k in coords) h[k] = dist(coords[k], target);
  return h;
}

// Registry for weights/heuristics
const AStarContexts = new Map([
  [sampleGraph1, {weights: weights1, heuristic: makeHeuristic(coords1), start:'A', goal:'H'}],
  [sampleGraph2, {weights: weights2, heuristic: makeHeuristic(coords2), start:'A', goal:'H'}],
  [sampleGraph3, {weights: weights3, heuristic: makeHeuristic(coords3), start:'A', goal:'H'}],
  [sampleGraph4, {weights: weights4, heuristic: makeHeuristic(coords4), start:'A', goal:'H'}],
]);

function getAStarContext(graph) {
  return AStarContexts.get(graph) || {weights:{}, heuristic:{}, start:'A', goal:'H'};
}

// Export graph list & default
const graphs = [sampleGraph1, sampleGraph2, sampleGraph3, sampleGraph4];
const sampleGraph = sampleGraph1;

// Utility
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
