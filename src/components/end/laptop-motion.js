export function drawLaptop(root, progress, direction = "closing") {
  const p = Math.max(0, Math.min(1, progress));
  const angle = (p * Math.PI) / 2;

  const halfWidth = 629 + 181 * Math.sin(angle);
  const topY =
    765 - 765 * Math.cos(angle) + 231 * Math.sin(angle);

  const topX = 828 - halfWidth;
  const topWidth = halfWidth * 2;
  const ratio = topWidth / 1258;

  const matrix = [
    topWidth / 1258, 0, 0, 0,
    (199 * ratio - topX) / 765,
    (765 * ratio - topY) / 765,
    0,
    (ratio - 1) / 765,
    0, 0, 1, 0,
    topX, topY, 0, 1,
  ];

  root.querySelector("[data-lid]").style.transform =
    `matrix3d(${matrix.join(",")})`;

  const backFacing = topY >= 765;

  root.querySelector("[data-front]").style.visibility =
    backFacing ? "hidden" : "visible";

  root.querySelector("[data-back]").style.visibility =
    backFacing ? "visible" : "hidden";

  root.dataset.state =
    p === 0 ? "open" : p === 1 ? "closed" : direction;
}

export function mountLaptop(
  root,
  {
    duration = 4200,
    initialClosed = false,
    onComplete = () => {},
  } = {}
) {
  let frame = 0;
  let generation = 0;
  let current = initialClosed ? 1 : 0;
  let destroyed = false;

  const reduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  const scene = root.querySelector("[data-scene]");

  const resize = () => {
    const scale =
      root.clientWidth / Number(root.dataset.viewWidth);

    scene.style.transform = `scale(${scale})`;
  };

  const observer = new ResizeObserver(resize);
  observer.observe(root);

  resize();
  drawLaptop(root, current);

  delete root.dataset.assetError;

  const ready = Promise.all(
    Array.from(root.querySelectorAll("img")).map((img) =>
      img.decode()
    )
  );

  ready.catch(() => {
    root.dataset.assetError = "true";
  });

  function stop() {
    generation++;
    cancelAnimationFrame(frame);
  }

  async function setClosed(
    closed,
    { animate = closed } = {}
  ) {
    stop();

    const run = generation;
    const target = closed ? 1 : 0;

    // Keeps the previous immediate reset behavior.
    if (!animate) {
      current = target;
      drawLaptop(root, current);
      return;
    }

    try {
      await ready;
    } catch {
      return;
    }

    if (destroyed || run !== generation) return;

    const from = current;
    const direction = target > from ? "closing" : "opening";

    const ms = Number.isFinite(duration)
      ? Math.max(0, duration)
      : 4200;

    let started;

    function tick(now) {
      if (destroyed || run !== generation) return;

      if (started === undefined) started = now;

      const t =
        reduced.matches || ms === 0 || target === from
          ? 1
          : Math.min(1, (now - started) / ms);

      const eased =
        t * t * t * (t * (t * 6 - 15) + 10);

      current = from + (target - from) * eased;

      drawLaptop(root, current, direction);

      if (t < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        onComplete();
      }
    }

    frame = requestAnimationFrame(tick);
  }

  return {
    setClosed,

    destroy() {
      destroyed = true;
      stop();
      observer.disconnect();
    },
  };
}