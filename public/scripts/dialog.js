
function isClickOutsideDialog(dlg, evt) {
  const rect = dlg.getBoundingClientRect();
  return (
    evt.clientX < rect.left || evt.clientX > rect.right ||
    evt.clientY < rect.top  || evt.clientY > rect.bottom
  );
}

export function initDialogs() {
  document.querySelectorAll('dialog[data-dialog]').forEach((dlg) => {
    if (dlg.dataset.bound) return;      // evita duplicados
    dlg.dataset.bound = '1';

    dlg.addEventListener('click', (e) => {
      if (isClickOutsideDialog(dlg, e)) dlg.close();
    });
  });

  if (document.__dialogs_listener_bound__) return;
  document.__dialogs_listener_bound__ = true;

  document.addEventListener('click', (e) => {
    const target = e.target;
    if (!target || !(target instanceof Element)) return;

    // Abrir
    const openBtn = target.closest('[data-dialog-open]');
    if (openBtn) {
      const id = openBtn.getAttribute('data-dialog-open');
      if (!id) return;
      const dlg = document.getElementById(id);
      if (!dlg) return;
      if (typeof dlg.showModal === 'function') dlg.showModal();
      else dlg.setAttribute('open', '');
      return;
    }

    // Cerrar
    const closeBtn = target.closest('[data-dialog-close]');
    if (closeBtn) {
      const id = closeBtn.getAttribute('data-dialog-close');
      const dlg = id ? document.getElementById(id) : closeBtn.closest('dialog');
      if (dlg) dlg.close();
    }
  });
}

if (typeof window !== 'undefined') {
  if (!window.__dialogs_inited__) {
    initDialogs();
    window.__dialogs_inited__ = true;
  }
}
