/*!
 * scroll-parallax.js
 * --------------------------------------------------------------------------
 * Efeito de parallax de scroll suavizado (LERP) reutilizavel.
 *
 * O elemento se desloca em Y e rotaciona conforme o centro de um
 * "trigger" (um elemento de referencia, normalmente uma section) se move
 * em relacao ao centro da viewport.
 *
 * COMO USAR (HTML):
 * --------------------------------------------------------------------------
 *   <!-- Elementos com auto-init via atributo data-scroll-parallax -->
 *   <section id="minha-section">
 *     <div data-scroll-parallax="#minha-section"
 *          data-speed="-0.15"
 *          data-rotate="3">...</div>
 *
 *     <div data-scroll-parallax="#minha-section"
 *          data-speed="0.12"
 *          data-rotate="-2">...</div>
 *   </section>
 *
 *   <!-- Sem trigger compartilhado: usa o proprio bounding box -->
 *   <img data-scroll-parallax data-speed="0.2" data-rotate="0" src="..." />
 *
 *   <script src="scroll-parallax.js" defer></script>
 *
 * COMO USAR (JS):
 * --------------------------------------------------------------------------
 *   ScrollParallax.create({
 *     trigger: '#minha-section',          // opcional (Element ou selector)
 *     targets: '.meu-elemento',           // obrigatorio
 *     lerp: 0.12,                         // suavizacao (0..1) - menor = mais lento
 *     speed: 0.2,                         // fallback se nao houver data-speed
 *     rotate: 0,                          // fallback se nao houver data-rotate
 *     scale: 0,                           // fallback se nao houver data-scale
 *     speedAttr: 'data-speed',            // nome do atributo de velocidade
 *     rotateAttr: 'data-rotate',          // nome do atributo de rotacao
 *     scaleAttr: 'data-scale'             // nome do atributo de escala
 *   });
 *
 * ATRIBUTOS POR ELEMENTO:
 *   data-speed   -> multiplicador do deslocamento vertical (negativo = sobe)
 *   data-rotate  -> graus maximos de rotacao
 *   data-scale   -> intensidade do zoom (ex: 0.5 = cresce ate ~1.5x no extremo)
 *
 * RETORNO:
 *   create() devolve { update(), destroy() } para controle programatico.
 * --------------------------------------------------------------------------
 */
(function (global) {
  'use strict';

  const DEFAULT_LERP = 0.12;
  const SETTLE_Y = 0.12;
  const SETTLE_ROT = 0.02;
  const SETTLE_SCALE = 0.0008;

  function toElements(input) {
    if (!input) return [];
    if (typeof input === 'string') return Array.from(document.querySelectorAll(input));
    if (input instanceof Element) return [input];
    if (input instanceof NodeList || Array.isArray(input)) return Array.from(input);
    return [];
  }

  function toElement(input) {
    if (!input) return null;
    if (typeof input === 'string') return document.querySelector(input);
    if (input instanceof Element) return input;
    return null;
  }

  function num(value, fallback) {
    const n = parseFloat(value);
    return isFinite(n) ? n : fallback;
  }

  function create(options) {
    const opts = options || {};
    const targets = toElements(opts.targets);
    if (!targets.length) return null;

    const trigger = toElement(opts.trigger);
    const lerp = typeof opts.lerp === 'number' ? opts.lerp : DEFAULT_LERP;
    const speedAttr = opts.speedAttr || 'data-speed';
    const rotateAttr = opts.rotateAttr || 'data-rotate';
    const scaleAttr = opts.scaleAttr || 'data-scale';
    const defaultSpeed = typeof opts.speed === 'number' ? opts.speed : 0;
    const defaultRotate = typeof opts.rotate === 'number' ? opts.rotate : 0;
    const defaultScale = typeof opts.scale === 'number' ? opts.scale : 0;

    const state = new Map();
    targets.forEach((el) => {
      state.set(el, {
        speed: num(el.getAttribute(speedAttr), defaultSpeed),
        maxRot: num(el.getAttribute(rotateAttr), defaultRotate),
        scaleAmt: num(el.getAttribute(scaleAttr), defaultScale),
        targetY: 0,
        targetRot: 0,
        targetScale: 1,
        currentY: 0,
        currentRot: 0,
        currentScale: 1
      });
    });

    let raf = 0;
    let destroyed = false;

    function offsetFor(el) {
      const ref = trigger || el;
      const rect = ref.getBoundingClientRect();
      const refCenter = rect.top + rect.height / 2;
      const viewCenter = window.innerHeight / 2;
      return viewCenter - refCenter;
    }

    function computeTargets() {
      targets.forEach((el) => {
        const s = state.get(el);
        if (!s) return;
        const offset = offsetFor(el);
        const norm = offset / window.innerHeight;
        s.targetY = offset * s.speed;
        s.targetRot = norm * s.maxRot;
        s.targetScale = 1 + norm * s.scaleAmt;
      });
    }

    function render(force) {
      let stillAnimating = false;
      targets.forEach((el) => {
        const s = state.get(el);
        if (!s) return;
        if (force) {
          s.currentY = s.targetY;
          s.currentRot = s.targetRot;
          s.currentScale = s.targetScale;
        } else {
          s.currentY += (s.targetY - s.currentY) * lerp;
          s.currentRot += (s.targetRot - s.currentRot) * lerp;
          s.currentScale += (s.targetScale - s.currentScale) * lerp;
        }
        const yDelta = Math.abs(s.targetY - s.currentY);
        const rDelta = Math.abs(s.targetRot - s.currentRot);
        const scDelta = Math.abs(s.targetScale - s.currentScale);
        if (yDelta > SETTLE_Y || rDelta > SETTLE_ROT || scDelta > SETTLE_SCALE) stillAnimating = true;
        el.style.transform =
          `translateY(${s.currentY}px) ` +
          `rotate(${s.currentRot}deg) ` +
          `scale(${s.currentScale})`;
      });

      if (stillAnimating && !destroyed) {
        raf = requestAnimationFrame(() => render(false));
      } else {
        raf = 0;
      }
    }

    function update() {
      if (destroyed) return;
      computeTargets();
      if (!raf) raf = requestAnimationFrame(() => render(false));
    }

    function destroy() {
      destroyed = true;
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });

    computeTargets();
    render(true);
    requestAnimationFrame(update);

    return { update, destroy };
  }

  // Auto-init: agrupa elementos [data-scroll-parallax] por trigger
  // e cria uma instancia para cada grupo. Elementos sem valor no atributo
  // usam o proprio bounding box como referencia.
  function autoInit() {
    const nodes = document.querySelectorAll('[data-scroll-parallax]');
    if (!nodes.length) return;

    const groups = new Map();
    const standalone = [];

    nodes.forEach((el) => {
      const triggerSel = (el.getAttribute('data-scroll-parallax') || '').trim();
      if (!triggerSel) {
        standalone.push(el);
        return;
      }
      if (!groups.has(triggerSel)) groups.set(triggerSel, []);
      groups.get(triggerSel).push(el);
    });

    groups.forEach((els, sel) => {
      create({ trigger: sel, targets: els });
    });

    standalone.forEach((el) => {
      create({ targets: [el] });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }

  global.ScrollParallax = { create };
})(window);
