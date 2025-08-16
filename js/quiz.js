// MODULE: QUIZ FORMATTING AND QUESTIONS
// QUIZ ACTIVITY QUESTIONS
//TODO: EXPLAIN WHY ANSWERS ARE WRONG
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
  },
  {
    question: "Which traversal method does DFS use?",
    options: ["Level-order", "Pre-order", "Post-order", "Random-order"],
    answer: "Pre-order"
  },
  {
    question: "DFS is guaranteed to find the shortest path in an unweighted graph.",
    options: ["True", "False"],
    answer: "False"
  },
  {
    question: "In DFS, what happens when a vertex has no unvisited adjacent vertices?",
    options: [
      "Restart from the first vertex",
      "Stop the search",
      "Backtrack to the previous vertex",
      "Remove the vertex from the graph"
    ],
    answer: "Backtrack to the previous vertex"
  },
  {
    question: "Which of the following is NOT a common application of DFS?",
    options: ["Topological sorting", "Finding connected components", "Cycle detection", "Sorting numbers in ascending order"],
    answer: "Sorting numbers in ascending order"
  },
  {
    question: "DFS traversal can be implemented using:",
    options: ["Recursion", "Explicit stack", "Both", "Neither"],
    answer: "Both"
  },
  {
    question: "In a DFS of a tree, how many times is each edge explored?",
    options: ["Once", "Twice", "Three times", "Depends on implementation"],
    answer: "Twice"
  },
  {
    question: "For a connected undirected graph with V vertices and E edges, DFS will visit:",
    options: ["All V vertices", "Only a subset of vertices", "All vertices and edges exactly once", "Only the root vertex"],
    answer: "All V vertices"
  }
];


// HELPERS -------------------->

function getRandomQuestions(allQuestions, n) {
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
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
  if (it)   it.style.display   = 'none';
  document.querySelector('h1').textContent = '🧠 Interactive DFS Tutorial';
}

// COMPLETE BUTTON LOGIC
document.getElementById('take-quiz-btn').onclick = function() {
  setUIMode('quiz');
  const viz = document.getElementById('visualization');
  const fb  = document.getElementById('dfs-feedback');
  const quizSection = document.getElementById('dfs-quiz');
  const quizBtn = document.getElementById('take-quiz-btn');

  if (viz) viz.style.display = 'none';
  if (fb)  fb.style.display  = 'none';

  quizSection.style.display = 'block';
  //quizBtn.textContent = 'Retake Quiz';

  const selectedQuestions = getRandomQuestions(dfsQuestions, 5);
  renderQuiz(selectedQuestions);
};

// QUIZ RENDER FORMATTING AND FEEDBACK
function renderQuiz() {
  // HIDING BUTTONS WHEN TAKING QUIZ
  const viz = document.getElementById('visualization');
  const fb  = document.getElementById('dfs-feedback');
  const ex  = document.getElementById('example-instructions');
  const it  = document.getElementById('interactive-instructions');
  if (viz) viz.style.display = 'none';
  if (fb)  fb.style.display  = 'none';
  if (ex)  ex.style.display  = 'none';
  if (it)  it.style.display  = 'none';

  // QUIZ FORMATTING - DEFAULT QUIZ TYPE
  const quizSection = document.getElementById('dfs-quiz');
  quizSection.style.display = 'block';
  quizSection.innerHTML = '<h2>DFS Quiz</h2><form id="quiz-form"></form>';
  const form = quizSection.querySelector('#quiz-form');
  // GENERATING 5 RANDOM QUESTIONS FROM SET OF QUESTIONS WITH FORMATTING
  const selectedQuestions = getRandomQuestions(dfsQuestions, 5);
  selectedQuestions.forEach((q, i) => {
    const qDiv = document.createElement('div');
    qDiv.className = 'quiz-question';
    qDiv.innerHTML = `
      <p><strong>${i + 1}.</strong> ${q.question}</p>
      ${q.options.map(opt => `
        <label style="display:block;cursor:pointer;">
          <input type="radio" name="q${i}" value="${opt}">
          ${opt}
        </label>
      `).join('')}
      <div class="q-feedback" style="min-height:1.2em;margin-top:6px;"></div>
      <hr style="opacity:.2;margin:12px 0;">
    `;
    form.appendChild(qDiv);

    // LIVE FEEDBACK WHEN ANSWER IS CLICKED
    // TODO: ADD CONCEPTUAL FEEDBACK TO EACH ANSWER SELECTION -- LATER IMPLEMENTATION
    const radios = Array.from(qDiv.querySelectorAll(`input[name="q${i}"]`));
    const fbNode = qDiv.querySelector('.q-feedback');

    radios.forEach(r => {
      r.addEventListener('change', () => {
        const selected = qDiv.querySelector(`input[name="q${i}"]:checked`);
        if (!selected) return;

        const correct = selected.value === q.answer;
        if (correct) {
          fbNode.textContent = '✅ Correct';
          fbNode.style.color = 'var(--green, #2ecc71)';
          qDiv.classList.add('correct');
          qDiv.classList.remove('incorrect');
          radios.forEach(x => x.disabled = true);
        } else {
          fbNode.textContent = '❌ Try again';
          fbNode.style.color = 'var(--red, #e74c3c)';
          qDiv.classList.add('incorrect');
          qDiv.classList.remove('correct');
        }
      });
    });
  });
}

// make available to other files


//window.hideQuizUI = hideQuizUI;


// function showQuizUI() {
//   const viz = document.getElementById('visualization');
//   const fb  = document.getElementById('dfs-feedback');
//   const ex  = document.getElementById('example-instructions');
//   const it  = document.getElementById('interactive-instructions');
//   if (viz) viz.style.display = 'none';
//   if (fb)  fb.style.display  = 'none';
//   if (ex)  ex.style.display  = 'none';
//   if (it)  it.style.display  = 'none';

//   const quiz = document.getElementById('dfs-quiz');
//   if (quiz) quiz.style.display = 'block';
//   document.querySelector('h1').textContent = 'DFS Quiz';
// }