// ---------------- CODING ACTIVITY (Fill-in-the-blank) ----------------
// Teaching checker (no Python runtime). Validates a canonical iterative DFS pattern.

(function () {
  function $(id) { return document.getElementById(id); }

  // ---- NEW: tiny helpers for UI feedback ----
  function markBlank(index, ok, hint = '') {
    const blanks = document.querySelectorAll('#coding-activity input.blank');
    const b = blanks[index];
    if (!b) return;
    b.classList.toggle('correct', ok);
    b.classList.toggle('wrong', !ok);
    b.setAttribute('aria-invalid', String(!ok));
    b.setAttribute('title', hint || '');
  }

  // Reuse the DFS modal just like interactive.js does
  function renderCodingResult({ passed, startCorrect, neighborCorrect }) {
  const fb = $('py-output');
  if (!fb) return;

  const modal    = $('dfs-modal');
  const modalMsg = $('dfs-modal-message');
  const modalBtn = $('dfs-modal-close'); // primary button slot
  if (!modal || !modalMsg || !modalBtn) return;

  fb.className = 'feedback ' + (passed ? 'correct' : 'wrong');

  // helpers to manage extra buttons
  function ensureBtn(id, label) {
    let btn = document.getElementById(id);
    if (!btn) {
      btn = document.createElement('button');
      btn.id = id;
      btn.textContent = label;
      modalBtn.insertAdjacentElement('afterend', btn);
    } else {
      btn.textContent = label;
    }
    return btn;
  }
  function removeBtn(id) {
    const b = document.getElementById(id);
    if (b && b.parentNode) b.parentNode.removeChild(b);
  }

  // Success → close-only, no hint/giveup buttons
  if (passed) {
    modalMsg.textContent = '🎉 All tests passed! Nice work.';
    modalBtn.textContent = 'Close';
    modalBtn.onclick = () => { modal.style.display = 'none'; };
    removeBtn('dfs-modal-hint');
    removeBtn('dfs-modal-giveup');
    modal.style.display = 'flex';
    return;
  }

  // Failure → offer Try Again + Get a hint
  const someRight = startCorrect || neighborCorrect;
  modalMsg.textContent = someRight
    ? '⚠️ You got one blank correct, but the other needs fixing.'
    : '❌ Both blanks are incorrect.';

  modalBtn.textContent = 'Try Again';
  modalBtn.onclick = () => { modal.style.display = 'none'; };

  const hintBtn = ensureBtn('dfs-modal-hint', 'Get a hint');
  removeBtn('dfs-modal-giveup'); // only show "Give up" in the hint view, not here

  hintBtn.onclick = () => {
    // Show the hint *in the same modal*, with two new buttons: Try again + Give up
    // Compute targeted hint text for each case
    let hint = '';
    if (!startCorrect && !neighborCorrect) {
      // both wrong -> nudge only for the first box (as requested)
      hint = 'Hint for blank #1: initialize the stack with the start node. For example: stack = [start].';
    } else if (!startCorrect) {
      hint = 'Hint for blank #1: the initial push should be the start node itself → [start].';
    } else if (!neighborCorrect) {
      hint = 'Hint for blank #2: push neighbors in reverse order so left-most is visited first (e.g., reversed(graph[node]) or graph[node][::-1]).';
    }

    modalMsg.textContent = hint;

    // Primary now reads Try again; keep same handler (close modal)
    modalBtn.textContent = 'Try again';
    modalBtn.onclick = () => { modal.style.display = 'none'; };

    // Add a secondary "Give up" (no logic yet)
   const giveUpBtn = ensureBtn('dfs-modal-giveup', 'Give up');
giveUpBtn.onclick = () => {
  const inputs = document.querySelectorAll('#coding-activity input.blank');

  // ✅ Autofill box 1 with the correct value
  if (inputs[0]) inputs[0].value = 'start';

  // 📚 List all valid answers for box 2
  const neighborAnswers = [
    'reversed(graph[node])',
    'list(reversed(graph[node]))',
    'graph[node][::-1]',
    'sorted(graph[node], reverse=True)'
  ];

  const modalMsg = document.getElementById('dfs-modal-message');
  modalMsg.innerHTML = `
    <div>✅ <strong>Answer for blank #1:</strong> <code>start</code></div>
    <div style="margin-top:.5em;">📚 <strong>Possible answers for blank #2:</strong>
      <ul style="text-align:left;margin:.5em 0 0 1.25em;">
        ${neighborAnswers.map(a => `<li><code>${a}</code></li>`).join('')}
      </ul>
    </div>
  `;

  // Primary button becomes Close
  const modalBtn = document.getElementById('dfs-modal-close');
  modalBtn.textContent = 'Close';
  modalBtn.onclick = () => { document.getElementById('dfs-modal').style.display = 'none'; };

  // Remove the "Give up" button after showing solution
  giveUpBtn.remove();
};

    // In hint view we don’t need the "Get a hint" button anymore
    removeBtn('dfs-modal-hint');

    modal.style.display = 'flex';
  };

  modal.style.display = 'flex';
}

  function readBlanks() {
    const blanks = document.querySelectorAll('#coding-activity input.blank');
    const values = Array.from(blanks).map(b => (b.value || '').trim());
    return { startPush: values[0] || '', neighborExpr: values[1] || '' };
  }

  function checkAnswers(startPush, neighborExpr) {
    // Accept common correct answers
    const okStart = ['start'];
    const okNeighbors = new Set([
      'reversed(graph[node])',
      'list(reversed(graph[node]))',
      'graph[node][::-1]',
      'sorted(graph[node],reverse=True)',
    ]);

    const startCorrect = okStart.includes(startPush.replace(/\s+/g, ''));
    const neighborCanonical = neighborExpr.replace(/\s+/g, '');
    const neighborCorrect = okNeighbors.has(neighborCanonical);

    return { startCorrect, neighborCorrect };
  }

  function runHiddenTests(startPush, neighborExpr) {
  const { startCorrect, neighborCorrect } = checkAnswers(startPush, neighborExpr);
  const passed = startCorrect && neighborCorrect;

  // Just return booleans, no messages
  return { passed, startCorrect, neighborCorrect };
}



  document.addEventListener('DOMContentLoaded', () => {
    const startCodingBtn = $('start-coding-btn');
    const runBtn   = $('run-python');
    const clearBtn = $('clear-output');

    // Prefer the global UI state machine if present
    if (startCodingBtn) {
      startCodingBtn.addEventListener('click', () => {
        if (typeof window.setUIMode === 'function') {
          window.setUIMode('coding');
          const panel = $('coding-activity');
          if (panel) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          // Fallback: show panel directly
          $('dfs-quiz') && ($('dfs-quiz').style.display = 'none');
          $('visualization') && ($('visualization').style.display = 'none');
          $('coding-activity').style.display = 'block';
        }
      });
    }

    if (runBtn) {
  runBtn.addEventListener('click', () => {
    const { startPush, neighborExpr } = readBlanks();
    const result = runHiddenTests(startPush, neighborExpr);

    // Per-blank highlighting + quick hints (no HTML injected)
    markBlank(0, result.startCorrect, result.startCorrect ? '' : 'Use "start"');
    markBlank(1, result.neighborCorrect, result.neighborCorrect ? '' : 'Reverse the neighbors');

    // Pass the whole result so the modal can handle 0/1/2-correct cases
    renderCodingResult(result);
  });
}


    if (clearBtn) clearBtn.addEventListener('click', clearOutput);
  });
})();
