export default function initCardSpotlight() {
  const setPos = (card, e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  // Delegación global: detecta la card-spot bajo el cursor SIEMPRE
  const onMove = (e) => {
    const card = e.target.closest?.(".card-spot");
    if (!card) return;
    setPos(card, e);
  };

  // Evitamos múltiples registros
  if (window.__spotlightBound) return;
  window.__spotlightBound = true;

  // pointermove funciona mejor que mousemove (touch/pen también)
  window.addEventListener("pointermove", onMove, { passive: true });

  // al entrar, fijamos la posición inicial para que no quede en 50%/50%
  document.addEventListener("pointerenter", (e) => {
    const card = e.target.closest?.(".card-spot");
    if (!card) return;
    setPos(card, e);
  }, true);
}
