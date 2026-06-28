/* toast: expose window.showToast(variant, title, description?) */
const _TOAST_ICONS = {
  default: 'bell',
  success: 'circle-check',
  warning: 'triangle-alert',
  error:   'circle-x',
  info:    'info',
};

window.showToast = function(variant, title, description) {
  const toaster = document.getElementById('toaster');
  if (!toaster) return;
  const el = document.createElement('div');
  el.className = `toast toast--${variant}`;
  el.innerHTML = `
    <i data-lucide="${_TOAST_ICONS[variant] || _TOAST_ICONS.default}" class="toast__icon"></i>
    <div class="toast__body">
      <p class="toast__title">${title}</p>
      ${description ? `<p class="toast__description">${description}</p>` : ''}
    </div>
    <button class="toast__close" aria-label="Close"><i data-lucide="x"></i></button>
  `;
  if (typeof lucide !== 'undefined') lucide.createIcons();
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
