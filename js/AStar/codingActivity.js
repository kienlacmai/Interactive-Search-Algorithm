// ---------------- CODING ACTIVITY (Fill-in-the-blank) — A* ----------------
//
// Note: This is a *teaching* checker, not a Python runner.
// We validate two blanks for a canonical A* pattern:
//
//   Blank #1: current = min(open_set, key=lambda n: f[n])
//   Blank #2: f[nb] = g[nb] + h(nb)        (also accepts g[nb] + h[nb])
//
// Accepts small formatting variations (whitespace, lambda var name).
//

(function () {
  // ----- helpers -----
  function $(id) { return document.getElementById(id); }
  const CLEAN = s => (s || '').replace(/#.*$/gm, '').replace(/\s+/g, '').trim();

  // Show/hide so it behaves like the DFS panel
  function showCoding() {
    // Hide other activities/panels if they exist
    const quiz = $('dfs-quiz'); if (quiz) quiz.style.display = 'none';
    const viz  = $('visualization'); if (viz) viz.style.display = 'none';

    // Show this panel
    const panel = $('coding-activity-astar');
    if (panel) panel.style.display = 'block';
  }

  function hideCoding() {
    const panel = $('coding-activity-astar');
    if (panel) panel.style.display = 'none';

    const viz = $('visualization'); if (viz) viz.style.display = '';
  }

  function readBlanks() {
    // Only read inputs inside the A* panel
    const blanks = document.querySelectorAll('#coding-activity-astar input.blank');
    const values = Array.from(blanks).map(b => (b.value || '').trim());
    return {
      minExpr: values[0] || '',  // current = [here]
      fExpr:   values[1] || ''   // f[nb] = [here]
    };
  }

  // Return booleans for correctness; allow common variants
  function checkAnswers(minExpr, fExpr) {
    const m = CLEAN(minExpr);
    const f = CLEAN(fExpr);

    // Accept: min(open_set, key=lambda <var>: f[<var>])
    // Regex is on the cleaned string (no spaces).
    const minOK = /^min\(open_set,key=lambda[a-zA-Z_]\w*:f\[[a-zA-Z_]\w*\]\)$/.test(m);

    // Accept g[nb] + h(nb) and g[nb] + h[nb]
    const fOK = /^g\[nb\]\+h\(nb\)$/.test(f) || /^g\[nb\]\+h\[nb\]$/.test(f);

    return { minOK, fOK };
  }

  function runHiddenTests(minExpr, fExpr) {
    const { minOK, fOK } = checkAnswers(minExpr, fExpr);
    const messages = [];

    if (!minOK) {
      messages.push('❌ Blank #1: pick the node with the smallest f-score — try: min(open_set, key=lambda n: f[n])');
    } else {
      messages.push('✅ Blank #1 looks good.');
    }

    if (!fOK) {
      messages.push('❌ Blank #2: f combines path cost and heuristic — use: g[nb] + h(nb)');
    } else {
      messages.push('✅ Blank #2 looks good.');
    }

    return { passed: (minOK && fOK), messages };
  }

  function writeOutput(lines, passed) {
    const out = $('py-output-astar');
    if (!out) return;
    out.className = 'feedback ' + (passed ? 'correct' : 'wrong');
    out.innerHTML = lines.map(l => `<div>${l}</div>`).join('');
  }

  function clearOutput() {
    const out = $('py-output-astar');
    if (!out) return;
    out.className = 'feedback';
    out.textContent = '';
  }

  // ----- wire up -----
  document.addEventListener('DOMContentLoaded', () => {
    const startBtn = $('start-coding-astar-btn'); // optional “Start Coding” trigger
    const runBtn   = $('run-astar');

    if (startBtn) {
      startBtn.addEventListener('click', () => {
        clearOutput();
        showCoding();
      });
    }

    if (runBtn) {
      runBtn.addEventListener('click', () => {
        const { minExpr, fExpr } = readBlanks();
        const { passed, messages } = runHiddenTests(minExpr, fExpr);
        writeOutput(messages, passed);
      });
    }
  });
})();
