function isClickOutsideDialog(dlg: HTMLDialogElement, evt: MouseEvent) {
    const rect = dlg.getBoundingClientRect();
    return (
        evt.clientX < rect.left || evt.clientX > rect.right ||
        evt.clientY < rect.top || evt.clientY > rect.bottom
    );
}

export function initDialogs() {
    document.querySelectorAll<HTMLDialogElement>('dialog[data-dialog]').forEach((dlg) => {
        // Evita listeners duplicados si Astro rehidrata
        dlg.dataset.bound = '1';

        dlg.addEventListener('click', (e) => {
            if (isClickOutsideDialog(dlg, e)) dlg.close();
        });
    });

    // Delegación para abrir/cerrar
    document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement | null;
        if (!target) return;

        // Abrir
        const openBtn = target.closest<HTMLElement>('[data-dialog-open]');
        if (openBtn) {
            const id = openBtn.getAttribute('data-dialog-open');
            if (!id) return;
            const dlg = document.getElementById(id) as HTMLDialogElement | null;
            if (!dlg) return;
            if (typeof (dlg as any).showModal === 'function') dlg.showModal();
            else dlg.setAttribute('open', '');
            return;
        }

        // Cerrar con botón
        const closeBtn = target.closest<HTMLElement>('[data-dialog-close]');
        if (closeBtn) {
            const id = closeBtn.getAttribute('data-dialog-close');
            const dlg = id
                ? (document.getElementById(id) as HTMLDialogElement | null)
                : closeBtn.closest('dialog');
            dlg?.close();
        }
    });
}

// Auto-init al cargar
if (typeof window !== 'undefined') {
    (window as any).__dialogs_inited__ || (initDialogs(), (window as any).__dialogs_inited__ = true);
}
