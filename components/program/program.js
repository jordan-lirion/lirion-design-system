/* program: board collapse/expand toggle for .board elements */
document.querySelectorAll('.board__toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const board = btn.closest('.board');
    if (!board) return;
    board.classList.toggle('is-collapsed');
    btn.setAttribute('aria-expanded', String(!board.classList.contains('is-collapsed')));
  });
});
