(() => {
  "use strict";
  const v = document.createElement("div");
  v.className = "viewer";
  v.tabIndex = -1;
  v.setAttribute("role", "dialog");
  v.setAttribute("aria-modal", "true");
  v.setAttribute(
    "aria-label",
    "Photograph viewer. Press Escape or tap outside the image to close.",
  );
  const im = document.createElement("img");
  im.draggable = false;
  v.append(im);
  document.body.append(v);
  let scale = 1,
    x = 0,
    y = 0,
    scroll = 0,
    opener = null,
    gesture = null,
    lastTap = 0;
  const points = new Map();
  const clamp = (n) => Math.max(1, Math.min(8, n));
  function apply() {
    im.style.transform = `translate(calc(-50% + ${x}px),calc(-50% + ${y}px)) scale(${scale})`;
  }
  function reset() {
    scale = 1;
    x = y = 0;
    apply();
  }
  function close() {
    if (!v.classList.contains("open")) return;
    v.classList.remove("open");
    points.clear();
    gesture = null;
    document.body.classList.remove("viewer-open");
    document.body.style.top = "";
    window.scrollTo(0, scroll);
    im.removeAttribute("src");
    opener?.focus({ preventScroll: true });
  }
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[data-viewer],a.zoom");
    if (!a || e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    opener = a;
    const img = a.querySelector("img");
    im.src = a.href;
    im.alt = img?.alt || "Photograph by Donghun You";
    reset();
    scroll = window.scrollY;
    document.body.style.top = `-${scroll}px`;
    document.body.classList.add("viewer-open");
    v.classList.add("open");
    v.focus({ preventScroll: true });
  });
  v.addEventListener("click", (e) => {
    if (e.target === v) close();
  });
  v.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
    if (e.key === "Tab") {
      e.preventDefault();
      v.focus();
    }
  });
  v.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      const next = clamp(scale * Math.exp(-e.deltaY * 0.002));
      const cx = e.clientX - innerWidth / 2,
        cy = e.clientY - innerHeight / 2;
      const r = next / scale;
      x = cx - (cx - x) * r;
      y = cy - (cy - y) * r;
      scale = next;
      if (scale === 1) x = y = 0;
      apply();
    },
    { passive: false },
  );
  im.addEventListener("dblclick", reset);
  function begin() {
    const p = [...points.values()];
    if (p.length === 1) gesture = { type: "pan", px: p[0].x, py: p[0].y, x, y };
    else if (p.length >= 2)
      gesture = {
        type: "pinch",
        d: Math.hypot(p[1].x - p[0].x, p[1].y - p[0].y),
        cx: (p[0].x + p[1].x) / 2 - innerWidth / 2,
        cy: (p[0].y + p[1].y) / 2 - innerHeight / 2,
        scale,
        x,
        y,
      };
  }
  im.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    points.set(e.pointerId, { x: e.clientX, y: e.clientY });
    im.setPointerCapture(e.pointerId);
    begin();
  });
  im.addEventListener("pointermove", (e) => {
    if (!points.has(e.pointerId)) return;
    points.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const p = [...points.values()];
    if (gesture?.type === "pan" && scale > 1) {
      x = gesture.x + p[0].x - gesture.px;
      y = gesture.y + p[0].y - gesture.py;
    } else if (gesture?.type === "pinch" && p.length >= 2) {
      scale = clamp(
        (gesture.scale * Math.hypot(p[1].x - p[0].x, p[1].y - p[0].y)) /
          Math.max(gesture.d, 1),
      );
      const r = scale / gesture.scale,
        cx = (p[0].x + p[1].x) / 2 - innerWidth / 2,
        cy = (p[0].y + p[1].y) / 2 - innerHeight / 2;
      x = cx - (gesture.cx - gesture.x) * r;
      y = cy - (gesture.cy - gesture.y) * r;
      if (scale === 1) x = y = 0;
    }
    apply();
  });
  function end(e) {
    const p = points.get(e.pointerId);
    const tap =
      points.size === 1 &&
      gesture?.type === "pan" &&
      p &&
      Math.hypot(p.x - gesture.px, p.y - gesture.py) < 8;
    if (tap && e.pointerType === "touch") {
      const now = Date.now();
      if (now - lastTap < 300) {
        reset();
        lastTap = 0;
      } else lastTap = now;
    }
    points.delete(e.pointerId);
    begin();
  }
  im.addEventListener("pointerup", end);
  im.addEventListener("pointercancel", (e) => {
    points.delete(e.pointerId);
    begin();
  });
  window.addEventListener("resize", reset);
})();
