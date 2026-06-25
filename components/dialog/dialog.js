/* dialog: [data-dialog-open="id"] opens dialog; [data-dialog-close] closes ancestor dialog */
document.querySelectorAll('[data-dialog-open]').forEach(btn => {
  btn.addEventListener('click', () => {
    const dlg = document.getElementById(btn.dataset.dialogOpen);
    if (dlg) dlg.showModal();
  });
});

document.querySelectorAll('[data-dialog-close]').forEach(btn => {
  btn.addEventListener('click', () => btn.closest('dialog')?.close());
});
