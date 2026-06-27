(function () {
  const tip = document.createElement('div');
  tip.className = 'tooltip-float';
  document.body.appendChild(tip);
  document.documentElement.classList.add('js-tooltips');

  let hideTimer;

  document.addEventListener('mouseover', function (e) {
    const el = e.target.closest('[data-tooltip]');
    if (!el) return;
    clearTimeout(hideTimer);

    const rect = el.getBoundingClientRect();
    tip.textContent = el.dataset.tooltip;
    tip.style.setProperty('--tip-x', rect.left + rect.width / 2 + 'px');
    tip.style.setProperty('--tip-y', rect.top - 8 + 'px');
    tip.classList.add('is-visible');
  });

  document.addEventListener('mouseout', function (e) {
    const el = e.target.closest('[data-tooltip]');
    if (!el) return;
    hideTimer = setTimeout(() => tip.classList.remove('is-visible'), 50);
  });
})();
