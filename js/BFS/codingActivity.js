// ---------------- CODING ACTIVITY (Fill-in-the-blank) ----------------
//
// Note: This is a *teaching* checker, not a Python runner.
// We validate the two blanks for a canonical iterative DFS pattern.
// Accepts a few common variants for the neighbor push.
//

(function () {
  function $(id) { return document.getElementById(id); }

  function showCoding() {
    // Hide other activities
    $('dfs-quiz').style.display = 'none';

    // Hide the visualization
    const viz = $('visualization');
    viz.style.display = 'none';

    // Show coding panel
    $('coding-activity').style.display = 'block';
  }

  function hideCoding() {
    $('coding-activity').style.display = 'none';
    // Re-show the visualization
    const viz = $('visualization');
    viz.style.display = '';
  }

  function readBlanks() {
    const blanks = document.querySelectorAll('#coding-activity input.blank');
    const values = Array.from(blanks).map(b => (b.value || '').trim());
    return {
      startPush: values[0] || '',
      neighborExpr: values[1] || '',
    };
  }

function checkAnswers(startPush, neighborExpr) {
  // Accept common correct answers
  const okStart = ['start'];
  const okNeighbors = new Set([
    'graph[node]',
    'list(graph[node])',  // acceptable Python variant
  ]);

  const startCorrect = okStart.includes(startPush);
  const neighborCorrect = okNeighbors.has(neighborExpr.replace(/\s+/g, ''));

  return { startCorrect, neighborCorrect };
}

function runHiddenTests(startPush, neighborExpr) {
  const { startCorrect, neighborCorrect } = checkAnswers(startPush, neighborExpr);

  const messages = [];
  if (!startCorrect) {
    messages.push('❌ Blank #1: enqueue the *start* node into the queue first.');
  } else {
    messages.push('✅ Blank #1 looks good.');
  }

  if (!neighborCorrect) {
    messages.push('❌ Blank #2: enqueue all neighbors of the current node.');
  } else {
    messages.push('✅ Blank #2 looks good.');
  }

  const passed = startCorrect && neighborCorrect;
  return { passed, messages };
}


  function writeOutput(lines, passed) {
    const out = $('py-output');
    out.className = 'feedback ' + (passed ? 'correct' : 'wrong');
    out.innerHTML = lines.map(l => `<div>${l}</div>`).join('');
  }

  function clearOutput() {
    const out = $('py-output');
    out.className = 'feedback';
    out.textContent = '';
  }

  document.addEventListener('DOMContentLoaded', () => {
    const startCodingBtn = $('start-coding-btn');
    const runBtn = $('run-python');
    const clearBtn = $('clear-output');
    const exitBtn = $('exit-coding-activity');

    if (startCodingBtn) {
      startCodingBtn.addEventListener('click', showCoding);
    }
    if (runBtn) {
      runBtn.addEventListener('click', () => {
        const { startPush, neighborExpr } = readBlanks();
        const { passed, messages } = runHiddenTests(startPush, neighborExpr);
        writeOutput(messages, passed);
      });
    }
    if (clearBtn) {
      clearBtn.addEventListener('click', clearOutput);
    }
    if (exitBtn) {
      exitBtn.addEventListener('click', () => {
        clearOutput();
        hideCoding();
      });
    }
  });
})();
