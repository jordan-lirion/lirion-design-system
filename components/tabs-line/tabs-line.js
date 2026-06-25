/* tabs-line: scoped to [data-tabs]; triggers and panels share data-value */
document.querySelectorAll('[data-tabs]').forEach(tabs => {
  tabs.querySelectorAll('.tabs-line__trigger[data-value]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const val = trigger.dataset.value;
      tabs.querySelectorAll('.tabs-line__trigger').forEach(t =>
        t.setAttribute('aria-selected', String(t === trigger))
      );
      tabs.querySelectorAll('[data-value]:not(.tabs-line__trigger)').forEach(el => {
        el.hidden = el.dataset.value !== val;
      });
    });
  });
});
