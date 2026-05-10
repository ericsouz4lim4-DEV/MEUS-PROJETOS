function syncActiveSection(list) {
  const links = list.querySelectorAll('a[href^="#"]');
  const items = [];

  links.forEach((link) => {
    const raw = link.getAttribute('href');
    if (!raw || raw.charAt(0) !== '#') return;
    const section = document.getElementById(raw.slice(1));
    if (!section) return;
    items.push({ link, el: section, id: section.id });
  });

  if (!items.length) return;

  const bufferPx = Math.min(120, window.innerHeight * 0.14);
  const probeY = window.scrollY + bufferPx;

  let activeId = items[0].id;
  items.forEach((entry) => {
    if (entry.el.offsetTop <= probeY) activeId = entry.id;
  });

  const atBottom =
    window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;

  if (atBottom) {
    activeId = items[items.length - 1].id;
  }

  items.forEach((entry) => {
    entry.link.classList.toggle('active', entry.id === activeId);
  });
}

function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas || !canvas.getContext) {
    return () => {};
  }

  const ctx = canvas.getContext('2d', { alpha: false });
  const root = document.documentElement;

  let rafId = 0;
  let stars = [];
  let meteors = [];
  let w = 0;
  let h = 0;
  let drift = 0;
  let nebulaAngle = 0;
  let colorCache = readColors();
  let lastTs = performance.now();

  function readColors() {
    const g = getComputedStyle(root);
    return {
      palette: [
        g.getPropertyValue('--text-primary').trim() || '#f5f0e8',
        g.getPropertyValue('--cosmic-cyan').trim() || '#5ce0d8',
        g.getPropertyValue('--accent-star').trim() || '#ffd23f',
      ],
      purpleHex: g.getPropertyValue('--cosmic-purple').trim() || '#6a3cbc',
      roseHex: g.getPropertyValue('--cosmic-rose').trim() || '#c8508c',
    };
  }

  function hexToRgb(hex) {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(String(hex).trim());
    if (!m) return [106, 60, 188];
    return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
  }

  function easeOutExpo(t) {
    const x = Math.min(Math.max(t, 0), 1);
    return x >= 1 ? 1 : 1 - Math.pow(2, -10 * x);
  }

  function starCount(layoutW, layoutH) {
    const area = layoutW * layoutH;
    return Math.round(Math.min(780, Math.max(165, area / 3500)));
  }

  function buildStars() {
    const n = starCount(w, h);
    stars = [];
    const colors = colorCache.palette;
    for (let i = 0; i < n; i++) {
      const z = 0.2 + Math.random() * 0.8;
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        z,
        r: Math.random() * 1.8 + 0.7,
        c: colors[Math.floor(Math.random() * colors.length)],
        tw: Math.random() * Math.PI * 2,
      });
    }
  }

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2.25);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    colorCache = readColors();
    buildStars();
    meteors.length = 0;
  }

  function drawNebulae(purpRgb, roseRgb) {
    const cx1 = w * (0.22 + Math.sin(nebulaAngle) * 0.02);
    const cy1 = h * (0.32 + Math.cos(nebulaAngle * 0.73) * 0.025);
    const cx2 = w * (0.78 + Math.cos(nebulaAngle * 0.61) * 0.022);
    const cy2 = h * (0.2 + Math.sin(nebulaAngle * 0.55) * 0.02);
    const cx3 = w * (0.55 + Math.sin(nebulaAngle * 0.41) * 0.018);
    const cy3 = h * (0.82 + Math.cos(nebulaAngle * 0.47) * 0.024);

    const g1 = ctx.createRadialGradient(cx1, cy1, 0, cx1, cy1, Math.max(w, h) * 0.45);
    g1.addColorStop(0, `rgba(${purpRgb[0]},${purpRgb[1]},${purpRgb[2]},0.12)`);
    g1.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, w, h);

    const g2 = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, Math.max(w, h) * 0.42);
    g2.addColorStop(0, `rgba(${roseRgb[0]},${roseRgb[1]},${roseRgb[2]},0.1)`);
    g2.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, w, h);

    const g3 = ctx.createRadialGradient(cx3, cy3, 0, cx3, cy3, Math.max(w, h) * 0.38);
    g3.addColorStop(0, `rgba(${purpRgb[0]},${purpRgb[1]},${purpRgb[2]},0.065)`);
    g3.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g3;
    ctx.fillRect(0, 0, w, h);
  }

  function maybeSpawnMeteor() {
    if (meteors.length >= 2) return;
    if (Math.random() > 0.00125) return;
    const fromTop = Math.random() > 0.5;
    const sx = fromTop ? Math.random() * w * 0.9 + w * 0.05 : w + 40;
    const sy = fromTop ? -60 : Math.random() * h * 0.85;
    const vx = fromTop ? 580 + Math.random() * 180 : -(720 + Math.random() * 240);
    const vy = fromTop ? 820 + Math.random() * 280 : -(120 + Math.random() * 180);
    meteors.push({ sx, sy, vx, vy, len: 72 + Math.random() * 48, t: 0 });
  }

  function tick(dt, scrollY) {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, w, h);

    const purpRgb = hexToRgb(colorCache.purpleHex);
    const roseRgb = hexToRgb(colorCache.roseHex);
    drift += dt * 0.012;
    nebulaAngle += dt * 0.000035;

    drawNebulae(purpRgb, roseRgb);

    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      s.tw += dt * (0.35 + s.z * 0.55);
      const dx = Math.sin(drift + s.z * 1.7) * 2.8 * dt;
      const dy = Math.cos(drift * 0.84 + s.z * 2.1) * 2.5 * dt;
      s.x += dx;
      s.y += dy;

      while (s.x < 0) s.x += w;
      while (s.x >= w) s.x -= w;
      while (s.y < 0) s.y += h;
      while (s.y >= h) s.y -= h;

      const parallaxPx = scrollY * 0.016 * s.z;
      let drawY = s.y - parallaxPx;
      drawY -= Math.floor(drawY / h) * h;

      const tw = 0.45 + Math.sin(s.tw) * 0.28 + s.z * 0.22;
      const a = Math.min(1, Math.max(0.22, tw));
      ctx.fillStyle = s.c;
      ctx.globalAlpha = a;
      ctx.beginPath();
      ctx.arc(s.x, drawY, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    maybeSpawnMeteor();
    for (let m = meteors.length - 1; m >= 0; m--) {
      const met = meteors[m];
      met.t += dt / 0.92;
      if (met.t >= 1) {
        meteors.splice(m, 1);
        continue;
      }

      met.sx += met.vx * dt;
      met.sy += met.vy * dt;

      const speed = Math.hypot(met.vx, met.vy) || 1;
      const ux = met.vx / speed;
      const uy = met.vy / speed;
      const headOpacity = easeOutExpo(1 - met.t) * 0.55;

      const grad = ctx.createLinearGradient(
        met.sx - ux * met.len,
        met.sy - uy * met.len,
        met.sx,
        met.sy
      );
      grad.addColorStop(0, 'rgba(255,240,232,0)');
      grad.addColorStop(easeOutExpo(0.55), `rgba(92,224,216,${headOpacity * 0.35})`);
      grad.addColorStop(1, `rgba(245,240,232,${headOpacity})`);

      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.35;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(met.sx - ux * met.len, met.sy - uy * met.len);
      ctx.lineTo(met.sx, met.sy);
      ctx.stroke();

      const offCanvas =
        met.sx < -met.len || met.sy < -met.len || met.sx > w + met.len || met.sy > h + met.len;
      if (offCanvas) meteors.splice(m, 1);
    }

    ctx.globalAlpha = 1;
  }

  function frame(ts) {
    const dt = Math.min((ts - lastTs) / 1000, 1 / 20);
    lastTs = ts;
    tick(dt, window.scrollY);
    rafId = window.requestAnimationFrame(frame);
  }

  function onResize() {
    resizeCanvas();
  }

  resizeCanvas();
  window.addEventListener('resize', onResize, { passive: true });
  rafId = window.requestAnimationFrame(frame);

  return function destroy() {
    window.cancelAnimationFrame(rafId);
    window.removeEventListener('resize', onResize);
    meteors.length = 0;
    stars.length = 0;
  };
}

function initFloatingNav() {
  const nav = document.getElementById('floating-nav');
  const hero = document.getElementById('hero');
  const list = nav && nav.querySelector('.nav-pill-list');

  if (!nav || !list) return;

  const handleScroll = () => {
    const threshold = hero ? hero.offsetHeight * 0.6 : 400;

    if (window.scrollY > threshold) {
      nav.classList.add('visible');
    } else {
      nav.classList.remove('visible');
    }

    syncActiveSection(list);
  };

  window.addEventListener(
    'scroll',
    () => {
      window.requestAnimationFrame(handleScroll);
    },
    { passive: true }
  );

  window.addEventListener('resize', () => {
    window.requestAnimationFrame(handleScroll);
  });

  if ('fonts' in document) {
    document.fonts.ready
      .then(() => {
        window.requestAnimationFrame(handleScroll);
      })
      .catch(() => {
        window.requestAnimationFrame(handleScroll);
      });
  }

  window.requestAnimationFrame(handleScroll);
}

function initCountdown() {
  const estreiaSection = document.querySelector('[data-target-date]');
  if (!estreiaSection) return;

  const targetDateStr = estreiaSection.getAttribute('data-target-date');
  const TARGET = new Date(targetDateStr);

  const timerElements = {
    days: document.querySelector('[data-countdown="days"]'),
    hours: document.querySelector('[data-countdown="hours"]'),
    minutes: document.querySelector('[data-countdown="minutes"]'),
    seconds: document.querySelector('[data-countdown="seconds"]'),
  };

  // Verificar se todos os elementos existem
  if (!Object.values(timerElements).every(el => el)) return;

  // Rastrear valores anteriores para animar apenas o que mudou
  const prevValues = { days: null, hours: null, minutes: null, seconds: null };

  function pad(n, len = 2) {
    return String(n).padStart(len, '0');
  }

  function animateUnit(el, newVal) {
    // 1. flip-out: sai para cima com fade
    el.classList.add('flip-out');

    setTimeout(() => {
      // 2. trocar texto e adicionar flip-in (invisível, abaixo)
      el.textContent = newVal;
      el.classList.remove('flip-out');
      el.classList.add('flip-in');

      // forçar reflow para que a transição dispare
      void el.offsetWidth;

      // 3. fade + slide in
      el.classList.add('visible');

      setTimeout(() => {
        el.classList.remove('flip-in', 'visible');
      }, 300);
    }, 120);
  }

  function updateUnit(key, newVal) {
    if (prevValues[key] !== newVal) {
      animateUnit(timerElements[key], newVal);
      prevValues[key] = newVal;
    }
  }

  function tick() {
    const now = Date.now();
    const diff = TARGET - now;

    if (diff <= 0) {
      // Zeroed out
      ['days', 'hours', 'minutes', 'seconds'].forEach(k => updateUnit(k, '00'));
      return;
    }

    const totalSec = Math.floor(diff / 1000);
    const seconds = totalSec % 60;
    const totalMin = Math.floor(totalSec / 60);
    const minutes = totalMin % 60;
    const totalHr = Math.floor(totalMin / 60);
    const hours = totalHr % 24;
    const days = Math.floor(totalHr / 24);

    updateUnit('days', String(days));
    updateUnit('hours', pad(hours));
    updateUnit('minutes', pad(minutes));
    updateUnit('seconds', pad(seconds));
  }

  // Executar imediatamente e depois a cada segundo
  tick();
  setInterval(tick, 1000);
}

function initTrailersCarousel() {
  const carousel = document.querySelector('.trailers__carousel');
  if (!carousel) return;

  const track = carousel.querySelector('.trailers__track');
  const slides = carousel.querySelectorAll('.trailers__slide');
  const dots = carousel.querySelectorAll('.trailers__dot');
  const prevBtn = carousel.querySelector('.trailers__arrow--prev');
  const nextBtn = carousel.querySelector('.trailers__arrow--next');
  const liveRegion = carousel.querySelector('#trailers-carousel-live');

  let currentIndex = 0;
  const totalSlides = slides.length;

  function updateCarousel() {
    // Atualizar posição do track
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Atualizar dots
    dots.forEach((dot, index) => {
      dot.classList.toggle('is-active', index === currentIndex);
      dot.setAttribute('aria-selected', index === currentIndex);
    });

    // Atualizar botões
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === totalSlides - 1;

    // Atualizar live region para acessibilidade
    liveRegion.textContent = `Trailer ${currentIndex + 1} de ${totalSlides}`;

    // Atualizar aria-label dos slides
    slides.forEach((slide, index) => {
      slide.setAttribute('aria-label', `${index + 1} de ${totalSlides}`);
    });
  }

  function goToSlide(index) {
    if (index < 0 || index >= totalSlides) return;
    currentIndex = index;
    updateCarousel();
  }

  function nextSlide() {
    if (currentIndex < totalSlides - 1) {
      goToSlide(currentIndex + 1);
    }
  }

  function prevSlide() {
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1);
    }
  }

  // Event listeners
  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => goToSlide(index));
  });

  // Suporte a teclado
  carousel.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        prevSlide();
        break;
      case 'ArrowRight':
        e.preventDefault();
        nextSlide();
        break;
      case 'Home':
        e.preventDefault();
        goToSlide(0);
        break;
      case 'End':
        e.preventDefault();
        goToSlide(totalSlides - 1);
        break;
    }
  });

  // Inicializar
  updateCarousel();
}

document.addEventListener('DOMContentLoaded', () => {
  initFloatingNav();
  initStarfield();
  initCountdown();
  initTrailersCarousel();
});
