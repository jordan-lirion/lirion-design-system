/* table: clickable rows — navigate to data-href unless a button/link was clicked */
document.querySelectorAll('tbody tr[data-href]').forEach(tr => {
  tr.addEventListener('click', e => {
    if (!e.target.closest('button, a')) location.href = tr.dataset.href;
  });
});
