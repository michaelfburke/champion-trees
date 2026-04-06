/* Champion Trees - script.js
   Retro effects: starfield, animated ducks, sparkles, visitor counter */

(function () {
  'use strict';

  /* ==============================
     STARFIELD
     ============================== */
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');

  let stars = [];
  const NUM_STARS = 180;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function initStars() {
    stars = [];
    for (let i = 0; i < NUM_STARS; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.8 + 0.3,
        speed: Math.random() * 0.4 + 0.1,
        brightness: Math.random(),
        twinkleSpeed: Math.random() * 0.05 + 0.01,
        twinkleDir: Math.random() < 0.5 ? 1 : -1,
        color: pickStarColor(),
      });
    }
  }

  function pickStarColor() {
    const colors = ['#ffffff', '#aaffcc', '#00ff88', '#ccffee', '#ffff99'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const s of stars) {
      s.brightness += s.twinkleSpeed * s.twinkleDir;
      if (s.brightness >= 1) { s.brightness = 1; s.twinkleDir = -1; }
      if (s.brightness <= 0.1) { s.brightness = 0.1; s.twinkleDir = 1; }

      s.y += s.speed;
      if (s.y > canvas.height) {
        s.y = 0;
        s.x = Math.random() * canvas.width;
      }

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.globalAlpha = s.brightness;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    requestAnimationFrame(drawStars);
  }

  window.addEventListener('resize', function () {
    resizeCanvas();
    initStars();
  });

  resizeCanvas();
  initStars();
  drawStars();


  /* ==============================
     ANIMATED DUCKS
     ============================== */
  const DUCK_EMOJIS = ['🦆', '🐦', '🦉', '🐧'];
  const NUM_DUCKS = 8;
  const ducksContainer = document.getElementById('ducks-container');
  const ducks = [];

  function createDuck() {
    const el = document.createElement('div');
    el.classList.add('duck');

    const emoji = DUCK_EMOJIS[Math.floor(Math.random() * DUCK_EMOJIS.length)];
    el.textContent = emoji;

    const fromLeft = Math.random() < 0.5;
    const y = Math.random() * (window.innerHeight * 0.8) + window.innerHeight * 0.1;
    const speed = Math.random() * 1.5 + 0.8;
    const size = Math.random() * 18 + 20;
    const bobAmp = Math.random() * 15 + 5;
    const bobFreq = Math.random() * 0.04 + 0.02;
    const startX = fromLeft ? -60 : window.innerWidth + 60;

    el.style.fontSize = size + 'px';
    el.style.top = y + 'px';
    el.style.left = startX + 'px';
    if (!fromLeft) {
      el.style.transform = 'scaleX(-1)';
    }

    ducksContainer.appendChild(el);

    return {
      el,
      x: startX,
      y,
      speed: fromLeft ? speed : -speed,
      fromLeft,
      bobAmp,
      bobFreq,
      phase: Math.random() * Math.PI * 2,
      baseY: y,
      size,
    };
  }

  function initDucks() {
    for (let i = 0; i < NUM_DUCKS; i++) {
      const duck = createDuck();
      // Stagger starting positions
      duck.x = Math.random() * window.innerWidth;
      duck.el.style.left = duck.x + 'px';
      ducks.push(duck);
    }
  }

  let duckFrame = 0;

  function animateDucks() {
    duckFrame++;
    for (let i = ducks.length - 1; i >= 0; i--) {
      const d = ducks[i];
      d.x += d.speed;
      d.phase += d.bobFreq;
      const bobY = d.baseY + Math.sin(d.phase) * d.bobAmp;

      d.el.style.left = d.x + 'px';
      d.el.style.top = bobY + 'px';

      // Reset duck when it goes off screen
      const offRight = d.fromLeft && d.x > window.innerWidth + 80;
      const offLeft = !d.fromLeft && d.x < -80;
      if (offRight || offLeft) {
        ducksContainer.removeChild(d.el);
        ducks.splice(i, 1);
        ducks.push(createDuck());
      }
    }
    requestAnimationFrame(animateDucks);
  }

  initDucks();
  animateDucks();


  /* ==============================
     CURSOR SPARKLES
     ============================== */
  const sparklesContainer = document.getElementById('sparkles-container');
  const SPARKLE_CHARS = ['✦', '✧', '★', '✸', '✺', '❋', '✼', '❃', '✿', '❀'];
  const SPARKLE_COLORS = ['#ffff00', '#00ff88', '#ff00ff', '#00ccff', '#ff6600'];
  let lastSparkleTime = 0;
  const SPARKLE_INTERVAL = 120; // ms between sparkles

  document.addEventListener('mousemove', function (e) {
    const now = Date.now();
    if (now - lastSparkleTime < SPARKLE_INTERVAL) return;
    lastSparkleTime = now;

    spawnSparkle(e.clientX, e.clientY);
  });

  document.addEventListener('click', function (e) {
    for (let i = 0; i < 8; i++) {
      const offsetX = (Math.random() - 0.5) * 60;
      const offsetY = (Math.random() - 0.5) * 60;
      spawnSparkle(e.clientX + offsetX, e.clientY + offsetY);
    }
  });

  function spawnSparkle(x, y) {
    const el = document.createElement('div');
    el.classList.add('sparkle');
    el.textContent = SPARKLE_CHARS[Math.floor(Math.random() * SPARKLE_CHARS.length)];
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.color = SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)];
    el.style.fontSize = (Math.random() * 12 + 8) + 'px';
    el.style.textShadow = '0 0 6px currentColor';
    sparklesContainer.appendChild(el);
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 1000);
  }


  /* ==============================
     VISITOR COUNTER
     ============================== */
  const counterEl = document.getElementById('visitor-count');
  if (counterEl) {
    const stored = localStorage.getItem('ct_visits');
    const count = stored ? parseInt(stored, 10) + 1 : Math.floor(Math.random() * 1000) + 1;
    localStorage.setItem('ct_visits', count);
    counterEl.textContent = String(count).padStart(5, '0');
  }


  /* ==============================
     RETRO TEXT GLITCH ON BAND NAME
     ============================== */
  const bandName = document.querySelector('.band-name');
  const ORIGINAL_TEXT = bandName ? bandName.textContent : '';
  const GLITCH_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*';

  if (bandName) {
    setInterval(function () {
      if (Math.random() > 0.85) {
        const pos = Math.floor(Math.random() * ORIGINAL_TEXT.length);
        const glitchChar = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        const glitched = ORIGINAL_TEXT.substring(0, pos) + glitchChar + ORIGINAL_TEXT.substring(pos + 1);
        bandName.textContent = glitched;
        setTimeout(function () {
          bandName.textContent = ORIGINAL_TEXT;
        }, 80);
      }
    }, 200);
  }

})();
