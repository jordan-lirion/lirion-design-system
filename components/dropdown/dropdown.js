/* dropdown: event-delegated; works for static and dynamically added [data-dropdown] elements */
document.addEventListener('click', e => {
  const trigger = e.target.closest('[data-dropdown-trigger]');
  if (trigger) {
    const dd = trigger.closest('[data-dropdown]');
    if (!dd) return;
    document.querySelectorAll('[data-dropdown].is-open').forEach(other => {
      if (other === dd) return;
      other.classList.remove('is-open');
      const t = other.querySelector('[data-dropdown-trigger]');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
    const open = dd.classList.toggle('is-open');
    trigger.setAttribute('aria-expanded', String(open));
    return;
  }
  document.querySelectorAll('[data-dropdown].is-open').forEach(dd => {
    dd.classList.remove('is-open');
    const t = dd.querySelector('[data-dropdown-trigger]');
    if (t) t.setAttribute('aria-expanded', 'false');
  });
});
