/* table: clickable rows — navigate to data-href unless a button/link was clicked */
document.querySelectorAll('tbody tr[data-href]').forEach(tr => {
  tr.addEventListener('click', e => {
    if (!e.target.closest('button, a')) location.href = tr.dataset.href;
  });
});

/* ----- Sortable columns ----- */

const _SORT_ICON = {
  none: '<i data-lucide="arrow-up-down"></i>',
  asc:  '<i data-lucide="arrow-up"></i>',
  desc: '<i data-lucide="arrow-down"></i>',
};

document.querySelectorAll('table.table').forEach(table => {
  const tbody = table.querySelector('tbody');
  if (!tbody) return;
  const originalOrder = [...tbody.querySelectorAll('tr')];

  table.querySelectorAll('.table__sort-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const th       = btn.closest('th');
      const colIndex = [...th.parentElement.children].indexOf(th);
      const current  = btn.dataset.sort || 'none';
      const next     = current === 'none' ? 'asc' : current === 'asc' ? 'desc' : 'none';

      /* reset all other sort buttons */
      table.querySelectorAll('.table__sort-btn').forEach(b => {
        if (b === btn) return;
        b.dataset.sort = 'none';
        b.querySelector('.table__sort-icon').innerHTML = _SORT_ICON.none;
      });
      if (typeof lucide !== 'undefined') lucide.createIcons();

      btn.dataset.sort = next;
      btn.querySelector('.table__sort-icon').innerHTML = _SORT_ICON[next];
      if (typeof lucide !== 'undefined') lucide.createIcons();

      if (next === 'none') {
        originalOrder.forEach(row => tbody.appendChild(row));
        return;
      }

      const rows = [...tbody.querySelectorAll('tr')];
      rows.sort((a, b) => {
        const aText = a.cells[colIndex]?.textContent.trim() ?? '';
        const bText = b.cells[colIndex]?.textContent.trim() ?? '';
        const aNum  = parseFloat(aText);
        const bNum  = parseFloat(bText);
        if (!isNaN(aNum) && !isNaN(bNum)) return next === 'asc' ? aNum - bNum : bNum - aNum;
        return next === 'asc'
          ? aText.localeCompare(bText, 'fr')
          : bText.localeCompare(aText, 'fr');
      });
      rows.forEach(row => tbody.appendChild(row));
    });
  });
});
