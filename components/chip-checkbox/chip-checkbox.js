/* chip-checkbox: toggle aria-pressed on click */
document.querySelectorAll('.chip-checkbox').forEach(chip => {
  chip.addEventListener('click', () => {
    chip.setAttribute('aria-pressed', chip.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
  });
});
