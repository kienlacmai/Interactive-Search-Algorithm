const dfsQuestions = [
  {
    question: "Which data structure is commonly used to implement DFS?",
    options: ["Queue", "Stack", "Heap", "Tree"],
    answer: "Stack"
  },
  {
    question: "DFS can be used to detect cycles in a graph.",
    options: ["True", "False"],
    answer: "True"
  },
  {
    question: "What is the time complexity of DFS for a graph with V vertices and E edges?",
    options: ["O(V)", "O(E)", "O(V+E)", "O(V*E)"],
    answer: "O(V+E)"
  }
];

// Render quiz to the DOM
function renderQuiz() {
  // Hide the graph and feedback
  const viz = document.getElementById('visualization');
  const fb  = document.getElementById('dfs-feedback');
  const exInstr = document.getElementById('example-instructions');
  const intInstr = document.getElementById('interactive-instructions');

  if (viz) viz.style.display = 'none';
  if (fb)  fb.style.display  = 'none';
  if (exInstr) exInstr.style.display = 'none';
  if (intInstr) intInstr.style.display = 'none';

  // Show the quiz section
  const quizSection = document.getElementById('dfs-quiz');
  quizSection.style.display = 'block';
  quizSection.innerHTML = '<h2>DFS Quiz</h2><form id="quiz-form"></form>';

  const form = quizSection.querySelector('#quiz-form');
  dfsQuestions.forEach((q, i) => {
    const qDiv = document.createElement('div');
    qDiv.className = 'quiz-question';
    qDiv.innerHTML = `<p>${i + 1}. ${q.question}</p>` +
      q.options.map(opt =>
        `<label><input type="radio" name="q${i}" value="${opt}"> ${opt}</label><br>`
      ).join('');
    form.appendChild(qDiv);
  });
}

// --- helpers to toggle quiz vs activity UI ---
function showQuizUI() {
  const viz = document.getElementById('visualization');
  const fb  = document.getElementById('dfs-feedback');
  const ex  = document.getElementById('example-instructions');
  const it  = document.getElementById('interactive-instructions');
  if (viz) viz.style.display = 'none';
  if (fb)  fb.style.display  = 'none';
  if (ex)  ex.style.display  = 'none';
  if (it)  it.style.display  = 'none';

  const quiz = document.getElementById('dfs-quiz');
  if (quiz) quiz.style.display = 'block';
  document.querySelector('h1').textContent = 'DFS Quiz';
}

function hideQuizUI() {
  const viz = document.getElementById('visualization');
  const fb  = document.getElementById('dfs-feedback');
  const ex  = document.getElementById('example-instructions');
  const it  = document.getElementById('interactive-instructions');
  const quiz = document.getElementById('dfs-quiz');

  if (quiz) quiz.style.display = 'none';
  if (viz)  viz.style.display  = '';
  if (fb)   fb.style.display   = '';
  if (ex)   ex.style.display   = 'block';
  if (it)   it.style.display   = 'none';   // default state on load
  document.querySelector('h1').textContent = '🧠 Interactive DFS Tutorial';
}

// make available to other files
window.hideQuizUI = hideQuizUI;


