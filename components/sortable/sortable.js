/* sortable: drag-and-drop reorder for [data-sortable] containers with .sortable__item children */
document.querySelectorAll('[data-sortable]').forEach(list => {
  let dragged = null;

  list.addEventListener('dragstart', e => {
    dragged = e.target.closest('.sortable__item');
    if (dragged) dragged.classList.add('is-dragging');
  });

  list.addEventListener('dragend', () => {
    if (dragged) dragged.classList.remove('is-dragging');
    dragged = null;
  });

  list.addEventListener('dragover', e => {
    e.preventDefault();
    const target = e.target.closest('.sortable__item');
    if (!target || target === dragged) return;
    const rect = target.getBoundingClientRect();
    const after = e.clientY > rect.top + rect.height / 2;
    list.insertBefore(dragged, after ? target.nextSibling : target);
  });
});
