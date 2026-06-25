/* form: character counter for inputs with [data-maxlength]; [data-form-reset] resets ancestor form */
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
