/* form: character counter, form reset, password toggle */

document.querySelectorAll('[data-maxlength]').forEach(input => {
  const max = parseInt(input.dataset.maxlength, 10);
  const hint = input.parentElement.querySelector('.hint');
  if (!hint) return;
  input.addEventListener('input', () => {
    hint.textContent = `${input.value.length} / ${max}`;
  });
});

document.querySelectorAll('[data-form-reset]').forEach(btn => {
  btn.addEventListener('click', () => btn.closest('form')?.reset());
});

/* [data-password-toggle] — button inside .input-group toggling its sibling input type.
   Button must contain exactly 2 SVGs: [0] eye-off (shown when password hidden), [1] eye (shown when password visible). */
document.addEventListener('click', e => {
  const btn = e.target.closest('[data-password-toggle]');
  if (!btn) return;
  const group = btn.closest('.input-group');
  if (!group) return;
  const input = group.querySelector('input');
  if (!input) return;
  const svgs = btn.querySelectorAll('svg');
  const show = input.type === 'password';
  input.type = show ? 'text' : 'password';
  if (svgs[0]) svgs[0].style.display = show ? 'none' : '';
  if (svgs[1]) svgs[1].style.display = show ? '' : 'none';
});
