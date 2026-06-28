/* toast: expose window.showToast(variant, text) */
const _TOAST_ICONS = {
  default: 'bell',
  success: 'circle-check',
  warning: 'triangle-alert',
  error:   'circle-x',
};

window.showToast = function(variant, text) {
  const toaster = document.getElementById('toaster');
  if (!toaster) return;
  const el = document.createElement('div');
  el.className = `toast toast--${variant}`;
  el.innerHTML = `
    <i data-lucide="${_TOAST_ICONS[variant] || _TOAST_ICONS.default}" class="toast__icon"></i>
    <p class="toast__text">${text}</p>
    <button class="toast__close" aria-label="Close"><i data-lucide="x"></i></button>
  `;
  const dismiss = () => {
    el.classList.add('is-dismissing');
    el.addEventListener('animationend', () => el.remove(), { once: true });
  };
  el.querySelector('.toast__close').addEventListener('click', dismiss);
  toaster.appendChild(el);
  if (typeof lucide !== 'undefined') lucide.createIcons();
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
