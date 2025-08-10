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
  // Add more questions as needed
];

// Utility to get N random questions
function getRandomQuestions(arr, n) {
  const shuffled = arr.slice().sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

// Render quiz to the DOM
function renderQuiz(questions) {
  const quizSection = document.getElementById('dfs-quiz');
  quizSection.innerHTML = '<h2>DFS Quiz</h2><form id="quiz-form"></form>';
  const form = quizSection.querySelector('#quiz-form');
  questions.forEach((q, i) => {
    const qDiv = document.createElement('div');
    qDiv.className = 'quiz-question';
    qDiv.innerHTML = `<p>${i + 1}. ${q.question}</p>` +
      q.options.map(opt =>
        `<label><input type="radio" name="q${i}" value="${opt}"> ${opt}</label><br>`
      ).join('');
    form.appendChild(qDiv);
  });
  form.innerHTML += '<button type="submit">Submit Quiz</button>';

  // Handle quiz submission and scoring
  form.onsubmit = function(e) {
    e.preventDefault();
    let score = 0;
    questions.forEach((q, i) => {
      const selected = form.querySelector(`input[name="q${i}"]:checked`);
      if (selected && selected.value === q.answer) {
        score++;
      }
    });
    quizSection.innerHTML = `<h2>DFS Quiz Results</h2>
      <p>You scored ${score} out of ${questions.length}.</p>
      <button id="retake-quiz-btn">Retake Quiz</button>
      <button id="exit-quiz-btn">Exit Quiz</button>`;
    document.getElementById('retake-quiz-btn').onclick = () => {
      renderQuiz(getRandomQuestions(dfsQuestions, 5));
    };
    document.getElementById('exit-quiz-btn').onclick = () => {
        document.getElementById('dfs-quiz').style.display = 'none';
        document.querySelector('.container').style.display = '';
        document.getElementById('dfs-feedback').style.display = '';
        document.querySelector('h1').textContent = '🧠 Interactive DFS Tutorial';
    };
  };
}

// "Take a Quiz" button logic
document.getElementById('take-quiz-btn').onclick = function() {
  // Hide or clear other page content
  document.querySelector('.container').style.display = 'none'; // Hide main content
  document.getElementById('dfs-feedback').style.display = 'none'; // Hide feedback if present

  // Change the header
  document.querySelector('h1').textContent = 'DFS Quiz';

  // Show the quiz section
  const quizSection = document.getElementById('dfs-quiz');
  quizSection.style.display = 'block';

  // Render the quiz
  const selectedQuestions = getRandomQuestions(dfsQuestions, 5);
  renderQuiz(selectedQuestions);
};