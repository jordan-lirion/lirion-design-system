/* toast: expose window.showToast(variant, title, description?) */
const _TOAST_ICONS = {
  default: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
  success: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
  warning: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  error:   '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
  info:    '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
};
const _CLOSE_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

window.showToast = function(variant, title, description) {
  const toaster = document.getElementById('toaster');
  if (!toaster) return;
  const el = document.createElement('div');
  el.className = `toast toast--${variant}`;
  el.innerHTML = `
    <svg class="toast__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${_TOAST_ICONS[variant] || _TOAST_ICONS.default}</svg>
    <div class="toast__body">
      <p class="toast__title">${title}</p>
      ${description ? `<p class="toast__description">${description}</p>` : ''}
    </div>
    <button class="toast__close" aria-label="Close">${_CLOSE_SVG}</button>
  `;
  const dismiss = () => {
    el.classList.add('is-dismissing');
    el.addEventListener('animationend', () => el.remove(), { once: true });
  };
  el.querySelector('.toast__close').addEventListener('click', dismiss);
  toaster.appendChild(el);
  setTimeout(dismiss, 4000);
};

/* static close buttons already in DOM */
document.querySelectorAll('.toast__close').forEach(btn => {
  btn.addEventListener('click', () => {
    const toast = btn.closest('.toast');
    toast.classList.add('is-dismissing');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  });
});
