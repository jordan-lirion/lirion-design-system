/* tabs: scoped to [data-tabs]; triggers and panels share data-value */
document.querySelectorAll('[data-tabs]').forEach(tabs => {
  tabs.querySelectorAll('[data-value][role="tab"]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const val = trigger.dataset.value;
      tabs.querySelectorAll('[role="tab"]').forEach(t =>
        t.setAttribute('aria-selected', String(t === trigger))
      );
      tabs.querySelectorAll('[data-value]:not([role="tab"])').forEach(panel => {
        panel.hidden = panel.dataset.value !== val;
      });
    });
  });
});
