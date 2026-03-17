/* =============================================================
   SUBHASH BHARADWAJ — PORTFOLIO MAIN.JS
   Particle system · GSAP · Typed.js · Custom cursor · Accordion
   ============================================================= */

/* ─── Wait for DOM ─── */
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initCursor();
  initNavbar();
  initMobileMenu();
  initTyped();
  initGSAP();
  initAccordions();
  initStatCounters();
  initContactForm();
});

/* ─────────────────────────────────────────────
   1. PARTICLE CANVAS BACKGROUND
───────────────────────────────────────────── */
function initParticles() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');

  let W, H, particles, mouse = { x: -999, y: -999 };

  const CONFIG = {
    count: 90,
    maxDist: 130,
    speed: 0.35,
    radius: 1.8,
    color: '0,255,200',
    lineAlpha: 0.12,
  };

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * CONFIG.speed;
    this.vy = (Math.random() - 0.5) * CONFIG.speed;
    this.r = Math.random() * CONFIG.radius + 0.5;
    this.alpha = Math.random() * 0.5 + 0.2;
  }

  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;

    // Mouse repulsion
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 100) {
      const force = (100 - dist) / 100;
      this.x += dx * force * 0.04;
      this.y += dy * force * 0.04;
    }
  };

  function init() {
    resize();
    particles = Array.from({ length: CONFIG.count }, () => new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.update();

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${CONFIG.color},${p.alpha})`;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < CONFIG.maxDist) {
          const alpha = CONFIG.lineAlpha * (1 - d / CONFIG.maxDist);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(${CONFIG.color},${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  init();
  draw();
}

/* ─────────────────────────────────────────────
   2. CUSTOM CURSOR
───────────────────────────────────────────── */
function initCursor() {
  const dot = document.getElementById('cursor');
  const ring = document.getElementById('cursor-follower');
  let rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    dot.style.left = e.clientX + 'px';
    dot.style.top = e.clientY + 'px';
    rx += (e.clientX - rx) * 0.14;
    ry += (e.clientY - ry) * 0.14;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
  });

  // Smooth ring follow
  function animateRing() {
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover states
  const interactive = 'a, button, .acc-btn, .proj-card, .skill-cat, .cert-card, input, textarea, .social-link';
  document.querySelectorAll(interactive).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* ─────────────────────────────────────────────
   3. NAVBAR — scroll glass + active highlight
───────────────────────────────────────────── */
function initNavbar() {
  const nav = document.getElementById('navbar');
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);

    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    links.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current);
    });
  }, { passive: true });
}

/* ─────────────────────────────────────────────
   4. MOBILE MENU
───────────────────────────────────────────── */
function initMobileMenu() {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');

  btn.addEventListener('click', () => {
    menu.classList.toggle('open');
    const spans = btn.querySelectorAll('span');
    if (menu.classList.contains('open')) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  document.querySelectorAll('.mob-link').forEach(l => {
    l.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
}

/* ─────────────────────────────────────────────
   5. TYPED.JS — hero typewriter
───────────────────────────────────────────── */
function initTyped() {
  if (typeof Typed === 'undefined') return;
  new Typed('#typed', {
    strings: [
      'security infrastructure.',
      'detection engineering.',
      'Rust microservices.',
      'AI-augmented security.',
      'compliance platforms.',
    ],
    typeSpeed: 48,
    backSpeed: 28,
    backDelay: 1800,
    loop: true,
    smartBackspace: true,
  });
}

/* ─────────────────────────────────────────────
   6. GSAP SCROLL ANIMATIONS
───────────────────────────────────────────── */
function initGSAP() {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  const ease = 'power3.out';

  // Hero entrance
  gsap.from('.hero-eyebrow', { y: 30, opacity: 0, duration: 0.9, ease, delay: 0.3 });
  gsap.from('.hero-name',    { y: 50, opacity: 0, duration: 1,   ease, delay: 0.5 });
  gsap.from('.hero-subtitle-row', { y: 30, opacity: 0, duration: 0.9, ease, delay: 0.75 });
  gsap.from('.hero-tagline', { y: 30, opacity: 0, duration: 0.9, ease, delay: 0.95 });
  gsap.from('.hero-cta',     { y: 30, opacity: 0, duration: 0.9, ease, delay: 1.15 });
  gsap.from('.scroll-hint',  { y: 20, opacity: 0, duration: 0.8, ease, delay: 1.5 });
  gsap.from('.hero-social',  { x: -30, opacity: 0, duration: 1,  ease, delay: 1.2 });

  // Helper: section trigger
  function st(el, vars, triggerEl) {
    return gsap.from(el, {
      ...vars,
      ease,
      scrollTrigger: {
        trigger: triggerEl || el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      }
    });
  }

  // Section headers
  document.querySelectorAll('.section-header').forEach(h => {
    st(h, { y: 30, opacity: 0, duration: 0.8 });
  });

  // About
  st('.about-text',    { x: -50, opacity: 0, duration: 0.9 }, '#about');
  st('.terminal-card', { x: 50,  opacity: 0, duration: 0.9 }, '#about');
  st('.stats-row .stat-box', { y: 30, opacity: 0, duration: 0.6, stagger: 0.12 }, '#about');

  // Skills
  gsap.from('.skill-cat', {
    y: 40, opacity: 0, duration: 0.6, stagger: 0.08,
    ease,
    scrollTrigger: { trigger: '#skills', start: 'top 85%' }
  });

  // Experience
  st('.tl-card', { y: 40, opacity: 0, duration: 0.8 }, '#experience');

  // Projects
  gsap.from('.proj-card', {
    y: 50, opacity: 0, duration: 0.7, stagger: 0.13,
    ease,
    scrollTrigger: { trigger: '#projects', start: 'top 85%' }
  });

  // Certs
  gsap.from('.cert-card', {
    y: 30, opacity: 0, duration: 0.6, stagger: 0.1,
    ease,
    scrollTrigger: { trigger: '#certifications', start: 'top 88%' }
  });

  // Contact
  st('.contact-info',  { x: -40, opacity: 0, duration: 0.8 }, '#contact');
  st('.contact-form',  { x: 40,  opacity: 0, duration: 0.8 }, '#contact');

  // Arch spokes — orbit animation
  gsap.to('.arch-spoke', {
    rotation: 360,
    duration: 0,
  });

  // Pulse on arch center
  gsap.to('.arch-center', {
    boxShadow: '0 0 40px rgba(167,139,250,0.4)',
    duration: 1.5, repeat: -1, yoyo: true, ease: 'sine.inOut',
  });

  // Spoke hover glow pulse
  gsap.to('.arch-spoke', {
    boxShadow: '0 0 20px rgba(0,255,200,0.4)',
    duration: 1.8, repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: 0.4,
  });
}

/* ─────────────────────────────────────────────
   7. ACCORDION
───────────────────────────────────────────── */
function initAccordions() {
  // Open the first EBC2 accordion by default
  const ebc2 = document.querySelector('.acc-item.open');
  if (ebc2) {
    const body = ebc2.querySelector('.acc-body');
    body.style.maxHeight = body.scrollHeight + 'px';
    body.style.padding = '1.2rem';
  }

  document.querySelectorAll('.acc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.acc-item');
      const body = item.querySelector('.acc-body');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.acc-item.open').forEach(openItem => {
        openItem.classList.remove('open');
        const b = openItem.querySelector('.acc-body');
        b.style.maxHeight = '0';
        b.style.padding = '0 1.2rem';
      });

      // Open clicked (if was closed)
      if (!isOpen) {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
        body.style.padding = '1.2rem';
      }
    });
  });
}

/* ─────────────────────────────────────────────
   8. STAT COUNTERS — count up on scroll
───────────────────────────────────────────── */
function initStatCounters() {
  const stats = document.querySelectorAll('.stat-n[data-target]');
  if (!stats.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        let current = 0;
        const step = Math.ceil(target / 40);
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = current + suffix;
          if (current >= target) clearInterval(timer);
        }, 40);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(s => observer.observe(s));
}

/* ─────────────────────────────────────────────
   9. CONTACT FORM
───────────────────────────────────────────── */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Opening mail client...';
    setTimeout(() => { btn.innerHTML = 'Send Message <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9"/></svg>'; }, 2000);
  });
}

/* ─────────────────────────────────────────────
   10. SMOOTH CURSOR RING FOLLOW (rAF loop)
───────────────────────────────────────────── */
(function smoothRing() {
  const ring = document.getElementById('cursor-follower');
  if (!ring) return;
  let tx = 0, ty = 0, cx = 0, cy = 0;

  document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });

  function loop() {
    cx += (tx - cx) * 0.12;
    cy += (ty - cy) * 0.12;
    ring.style.left = cx + 'px';
    ring.style.top  = cy + 'px';
    requestAnimationFrame(loop);
  }
  loop();
})();
