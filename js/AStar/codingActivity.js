// ---------------- CODING ACTIVITY (Fill-in-the-blank) ----------------
//
// A* checker: validates two key blanks:
// 1) Selecting min-f node from open_set
// 2) Updating f[nb] = g[nb] + h(nb)
//
// This is a teaching checker, not a Python runner.
//
(function () {
  function $(id) { return document.getElementById(id); }

  function showCoding() {
    const quiz = $('astar-quiz');
    if (quiz) quiz.style.display = 'none';
    const viz = $('visualization');
    if (viz) viz.style.display = 'none';
  }

  function hideCoding() {
    const viz = $('visualization');
    if (viz) viz.style.display = 'block';
    const quiz = $('astar-quiz');
    if (quiz) quiz.style.display = 'none';
    const coding = $('coding-activity');
    if (coding) coding.style.display = 'none';
  }

  function checkSolution() {
    const editorEl = document.querySelector('.py-editor pre');
    const code = (editorEl?.textContent || '').toLowerCase();

    const minFRegex =
      /(current\s*=\s*.*(min|argmin).*f\s*\[?\s*[a-z_]*\s*\]?\s*.*open_set)/;
    const updateFRegex =
      /(f\s*\[\s*nb\s*\]\s*=\s*g\s*\[\s*nb\s*\]\s*\+\s*h\s*\(\s*nb\s*\))/;

    const okMin = minFRegex.test(code);
    const okF = updateFRegex.test(code);

    const messages = [];
    if (!okMin) messages.push('❌ Blank #1: select node with minimum f-score (e.g., current = argmin over open_set of f[n]).');
    else messages.push('✅ Blank #1 looks good.');
    if (!okF) messages.push('❌ Blank #2: update f[nb] = g[nb] + h(nb).');
    else messages.push('✅ Blank #2 looks good.');

    return { passed: okMin && okF, messages };
  }

  function writeOutput(lines, passed) {
    const out = $('py-output');
    out.className = 'feedback ' + (passed ? 'correct' : 'wrong');
    out.innerHTML = lines.map(l => `<div>${l}</div>`).join('');
  }

  function clearOutput() {
    const out = $('py-output');
    out.className = 'feedback';
    out.innerHTML = '';
  }

  window.addEventListener('DOMContentLoaded', () => {
    const runBtn = $('run-py');
    const clearBtn = $('clear-py');
    const exitBtn = $('exit-coding-activity');

    if (runBtn) {
      runBtn.addEventListener('click', () => {
        const { passed, messages } = checkSolution();
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
