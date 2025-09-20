(function () {
  function ensureLive() {
    let el = document.getElementById("copy-live");
    if (!el) {
      el = document.createElement("div");
      el.id = "copy-live";
      el.setAttribute("aria-live", "polite");
      el.className = "sr-only";
      document.body.appendChild(el);
    }
    return (msg) => { el.textContent = ""; setTimeout(() => (el.textContent = msg), 10); };
  }

  function burstConfettiAt(cx, cy, count = 26) {
    const colors = ['#f87171', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#f472b6'];
    for (let i = 0; i < count; i++) {
      const s = document.createElement("span");
      const size = 5 + Math.random() * 6;
      const color = colors[(Math.random() * colors.length) | 0];

      s.style.position = "fixed";
      s.style.left = cx + "px";
      s.style.top = cy + "px";
      s.style.width = size + "px";
      s.style.height = size + "px";
      s.style.background = color;
      s.style.borderRadius = "1px";
      s.style.pointerEvents = "none";
      s.style.opacity = "1";
      s.style.transform = "translate(0,0) rotate(0deg)";
      s.style.transition = "transform 800ms cubic-bezier(.12,.5,.3,1), opacity 800ms";

      document.body.appendChild(s);

      const dx = (Math.random() - 0.5) * 260;
      const dy = (-90 - Math.random() * 140);
      const rz = (Math.random() - 0.5) * 220;

      requestAnimationFrame(() => {
        s.style.transform = `translate(${dx}px, ${dy}px) rotate(${rz}deg)`;
        s.style.opacity = "0";
      });
      setTimeout(() => s.remove(), 900);
    }
  }

  function burstLettersAt(cx, cy, text, max = 12) {
    const chars = (text || "").split("").filter(c => c.trim().length);
    for (let i = 0; i < Math.min(max, chars.length || max); i++) {
      const ch = chars.length ? chars[(Math.random() * chars.length) | 0] : "✓";
      const s = document.createElement("span");
      s.textContent = ch;
      s.style.position = "fixed";
      s.style.left = cx + "px";
      s.style.top = cy + "px";
      s.style.fontSize = "14px";
      s.style.fontWeight = "700";
      s.style.color = "white";
      s.style.textShadow = "0 1px 2px rgba(0,0,0,.4)";
      s.style.pointerEvents = "none";
      s.style.opacity = "1";
      s.style.transform = "translate(0,0) rotate(0deg)";
      s.style.transition = "transform 900ms cubic-bezier(.12,.5,.3,1), opacity 900ms";

      document.body.appendChild(s);

      const dist = 120 + Math.random() * 160;
      const ang = Math.random() * Math.PI * 2;
      const tx = Math.cos(ang) * dist;
      const ty = Math.sin(ang) * dist * -0.6;
      const rz = (Math.random() - 0.5) * 180;

      requestAnimationFrame(() => {
        s.style.transform = `translate(${tx}px, ${ty}px) rotate(${rz}deg)`;
        s.style.opacity = "0";
      });
      setTimeout(() => s.remove(), 1000);
    }
  }

  function bindCopyConfetti(el, opts = {}) {
    if (!el || el.dataset.copyBound === "1") return;
    el.dataset.copyBound = "1";

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const announce = ensureLive();

    const getValue = () => {
      if (typeof opts.value === "function") return opts.value();
      if (typeof opts.value === "string") return opts.value;
      return (
        el.dataset.copyValue ||
        el.dataset.email ||
        el.getAttribute("data-email") ||
        el.querySelector(".copy-label")?.textContent?.trim() ||
        el.querySelector(".pill-label.normal")?.textContent?.trim() ||
        el.textContent.trim()
      );
    };

    const copiedLabel = opts.copiedLabel || el.dataset.copiedLabel || "¡Copiado!";
    const timeout = Number(el.dataset.copyTimeout || opts.timeout || 1200);
    const mode = (el.dataset.confetti || opts.confetti || "both").toLowerCase();
    const count = Number(opts.count || 26);

    const normal = el.querySelector(".pill-label.normal") || el.querySelector(".copy-label");
    const copied = el.querySelector(".pill-label.copied");

    const showCopied = (value) => {
      el.classList.add("is-copied");
      if (normal && copied) {
        normal.classList.add("hidden");
        copied.classList.remove("hidden");
      } else if (normal) {
        el.dataset.originalText = normal.textContent || "";
        normal.textContent = copiedLabel;
      }

      if (!prefersReduced && mode !== "none") {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        if (mode === "dots" || mode === "both") burstConfettiAt(cx, cy, count);
        if (mode === "letters" || mode === "both") burstLettersAt(cx, cy, value, Math.min(14, value.length));
      }

      setTimeout(() => {
        el.classList.remove("is-copied");
        if (normal && copied) {
          copied.classList.add("hidden");
          normal.classList.remove("hidden");
        } else if (normal && el.dataset.originalText !== undefined) {
          normal.textContent = el.dataset.originalText;
          delete el.dataset.originalText;
        }
      }, timeout);
    };

    const doCopy = async (value) => {
      try { await navigator.clipboard.writeText(value); }
      catch {
        const ta = document.createElement("textarea");
        ta.value = value; document.body.appendChild(ta);
        ta.select(); try { document.execCommand("copy"); } catch { }
        ta.remove();
      }
      announce("Copiado al portapapeles");
    };

    const onClick = async (e) => {
      if (el.tagName === "A") e.preventDefault();
      if (el.dataset.cooldown === "1") return;
      el.dataset.cooldown = "1"; setTimeout(() => el.removeAttribute("data-cooldown"), 900);

      const value = getValue();
      await doCopy(value);
      showCopied(value);
    };

    const onKey = (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(e); }
    };

    el.addEventListener("click", onClick);
    el.addEventListener("keydown", onKey);
  }

  function initCopyConfetti(selector = "[data-copy],[data-confetti-copy],#emailLink") {
    const mount = () => document.querySelectorAll(selector).forEach((el) => bindCopyConfetti(el));
    if (document.readyState !== "loading") mount();
    else document.addEventListener("DOMContentLoaded", mount);
    document.addEventListener("astro:page-load", () => mount());
  }

  if (typeof window !== 'undefined' && !window.__confetti_inited__) {
    window.__confetti_inited__ = true;
    if (document.readyState !== 'loading') initCopyConfetti();
    else document.addEventListener('DOMContentLoaded', () => initCopyConfetti());
    document.addEventListener('astro:page-load', () => initCopyConfetti());
  }

})();
