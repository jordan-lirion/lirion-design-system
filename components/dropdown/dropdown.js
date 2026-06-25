/* dropdown: toggle open/close on trigger click; close on outside click */
document.querySelectorAll('[data-dropdown]').forEach(dd => {
  const trigger = dd.querySelector('[data-dropdown-trigger]');
  trigger.addEventListener('click', e => {
    e.stopPropagation();
    const open = dd.classList.toggle('is-open');
    trigger.setAttribute('aria-expanded', String(open));
  });
});

document.addEventListener('click', () => {
  document.querySelectorAll('[data-dropdown].is-open').forEach(dd => {
    dd.classList.remove('is-open');
    dd.querySelector('[data-dropdown-trigger]').setAttribute('aria-expanded', 'false');
  });
});
