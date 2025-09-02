// MODULE: QUIZ FORMATTING AND QUESTIONS
// QUIZ ACTIVITY QUESTIONS
const dfsQuestions = [
  {
    question: "What does the f(n) score represent in A* search?",
    options: [
      "Estimated cost from start to goal through n (g(n) + h(n))",
      "Exact remaining cost from n to goal (h(n))",
      "Cost so far to reach n (g(n))",
      "Number of nodes expanded so far"
    ],
    answer: "Estimated cost from start to goal through n (g(n) + h(n))"
  },
  {
    question: "When is A* guaranteed to find an optimal path?",
    options: [
      "When the heuristic is admissible and consistent",
      "Only when the graph is a tree",
      "Only when all edges have equal weight",
      "When the heuristic overestimates the true cost"
    ],
    answer: "When the heuristic is admissible and consistent"
  },
  {
    question: "Which data structure is typically used to select the next node in A*?",
    options: ["Queue", "Stack", "Priority queue (min-heap)", "Hash map"],
    answer: "Priority queue (min-heap)"
  },
  {
    question: "If h(n) = 0 for all n, what algorithm does A* reduce to?",
    options: ["BFS", "Uniform Cost Search (Dijkstra)", "DFS", "Greedy Best-First Search"],
    answer: "Uniform Cost Search (Dijkstra)"
  },
  {
    question: "A consistent heuristic must satisfy which property?",
    options: [
      "h(n) = 0 for all goal nodes",
      "h(n) <= cost(n, n') + h(n') for every edge (n, n')",
      "h(n) >= true distance to the goal",
      "h(n) is constant over the graph"
    ],
    answer: "h(n) <= cost(n, n') + h(n') for every edge (n, n')"
  }
];

// HELPERS -------------------->
function getRandomQuestions(allQuestions, n) {
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function hideQuizUI() {
  const viz = document.getElementById('visualization');
  const fb  = document.getElementById('astar-feedback');
  const ex  = document.getElementById('example-instructions');
  const it  = document.getElementById('interactive-instructions');
  const app = document.getElementById('application-activity');
  if (viz) viz.style.display = 'none';
  if (fb) fb.style.display = 'none';
  if (ex) ex.style.display = 'none';
  if (it) it.style.display = 'none';
  if (app) app.style.display = 'none';
}

// RENDER QUIZ ---------------->
function renderQuiz(questions) {
  const container = document.getElementById('astar-quiz');
  if (!container) return;
  container.innerHTML = '';

  questions.forEach((q, idx) => {
    const card = document.createElement('div');
    card.className = 'quiz-card';

    const h3 = document.createElement('h3');
    h3.textContent = `Q${idx + 1}. ${q.question}`;
    card.appendChild(h3);

    const opts = document.createElement('div');
    opts.className = 'options';

    q.options.forEach(opt => {
      const label = document.createElement('label');
      label.className = 'option';

      const input = document.createElement('input');
      input.type = 'radio';
      input.name = `q${idx}`;
      input.value = opt;
      label.appendChild(input);

      const span = document.createElement('span');
      span.textContent = opt;
      label.appendChild(span);

      opts.appendChild(label);
    });

    card.appendChild(opts);
    container.appendChild(card);
  });

  const submit = document.createElement('button');
  submit.className = 'primary';
  submit.textContent = 'Submit Answers';
  submit.addEventListener('click', () => gradeQuiz(questions));
  container.appendChild(submit);

  const result = document.createElement('div');
  result.id = 'quiz-result';
  result.className = 'feedback';
  container.appendChild(result);
}

function gradeQuiz(questions) {
  let correct = 0;
  questions.forEach((q, idx) => {
    const selected = document.querySelector(`input[name="q${idx}"]:checked`);
    if (selected && selected.value === q.answer) correct++;
  });
  const res = document.getElementById('quiz-result');
  if (!res) return;
  const total = questions.length;
  const pct = Math.round((correct / total) * 100);

  res.className = 'feedback ' + (pct === 100 ? 'correct' : (pct >= 60 ? 'neutral' : 'wrong'));
  res.textContent = `You scored ${correct}/${total} (${pct}%).`;
}

// INIT ----------------------->
window.addEventListener('DOMContentLoaded', () => {
  const takeQuizBtn = document.getElementById('take-quiz-btn');
  if (!takeQuizBtn) return;

  takeQuizBtn.addEventListener('click', () => {
    hideQuizUI();
    const q = getRandomQuestions(dfsQuestions, 5);
    renderQuiz(q);
    const quiz = document.getElementById('astar-quiz');
    if (quiz) quiz.style.display = 'block';
  });
});
