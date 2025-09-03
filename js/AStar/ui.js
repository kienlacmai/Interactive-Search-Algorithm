
// MODULE: UI TOGGLING LOGISTICS
// LIGHT/DARK THEME TOGGLE
const toggle = document.getElementById("theme-toggle");
toggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
  }
});
// PSEUDOCODE PANEL OPEN/CLOSE
(function () {
  const btn = document.getElementById('togglePseudocodeBtn');
  const panel = document.getElementById('pseudocodePanel');
  const close = document.getElementById('closePseudocodeBtn');
  function showPanel() {
    panel.classList.add('show');
    panel.setAttribute('aria-hidden', 'false');
    btn.setAttribute('aria-pressed', 'true');
    btn.textContent = 'Back to activity';
  }
  function hidePanel() {
    panel.classList.remove('show');
    panel.setAttribute('aria-hidden', 'true');
    btn.setAttribute('aria-pressed', 'false');
    btn.textContent = 'Show pseudocode';
  }
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-pressed') === 'true';
    open ? hidePanel() : showPanel();
  });
  close.addEventListener('click', hidePanel);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && btn.getAttribute('aria-pressed') === 'true') hidePanel();
  });
})();
// RECURSIVE TO ITERATIVE TOGGLE
(function () {
  const segs = document.querySelectorAll('.pseudo-toggle .seg');
  const recursive = document.getElementById('pseudo-recursive');
  const iterative = document.getElementById('pseudo-iterative');
  function setVariant(which) {
    segs.forEach(b => {
      const on = b.dataset.target === which;
      b.classList.toggle('selected', on);
      b.setAttribute('aria-selected', String(on));
    });
    recursive.classList.toggle('show', which === 'recursive');
    iterative.classList.toggle('show', which === 'iterative');
  }
  segs.forEach(b => b.addEventListener('click', () => setVariant(b.dataset.target)));
  setVariant('recursive');
})();