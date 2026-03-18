/* =============================================================
   SUBHASH BHARADWAJ — PORTFOLIO MAIN.JS
   ============================================================= */

// --- WAIT FOR DOM ---
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initScrollProgress();
  initCursor();
  initNav();
  initParticles();
  initTyped();
  initGSAP();
  initAccordions();
  initCounters();
  initBackTop();
});

/* ─────────────────────────────────────────────
   1. PRELOADER
   ───────────────────────────────────────────── */
function initPreloader() {
  const loader = document.getElementById('preloader');
  if(!loader) return;
  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    loader.classList.add('out');
    document.body.style.overflow = '';
  }, 2200);
}

/* ─────────────────────────────────────────────
   2. SCROLL PROGRESS
   ───────────────────────────────────────────── */
function initScrollProgress() {
  const bar = document.getElementById('scroll-bar');
  if(!bar) return;
  window.addEventListener('scroll', () => {
    const s = window.scrollY;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = h > 0 ? (s/h * 100) + '%' : '0%';
  }, {passive:true});
}

/* ─────────────────────────────────────────────
   3. CUSTOM CURSOR
   ───────────────────────────────────────────── */
function initCursor() {
  const dot = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  if(!dot || !ring) return;
  
  let tx = 0, ty = 0, cx = 0, cy = 0;
  
  document.addEventListener('mousemove', e => {
    tx = e.clientX; ty = e.clientY;
    dot.style.left = tx + 'px';
    dot.style.top = ty + 'px';
  });
  
  function loop() {
    cx += (tx - cx) * 0.15;
    cy += (ty - cy) * 0.15;
    ring.style.left = cx + 'px';
    ring.style.top = cy + 'px';
    requestAnimationFrame(loop);
  }
  loop();

  const interactives = 'a, button, .acc-btn, .spec-card, .sk-cat, .proj-card, .cert-card, input, textarea, .citem, .nav-brand';
  document.querySelectorAll(interactives).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hov'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hov'));
  });
}

/* ─────────────────────────────────────────────
   4. NAVBAR & MOBILE MENU
   ───────────────────────────────────────────── */
function initNav() {
  const nav = document.getElementById('nav');
  const links = document.querySelectorAll('.nl');
  const secs = document.querySelectorAll('section[id]');
  
  window.addEventListener('scroll', () => {
    if(window.scrollY > 40) nav.classList.add('stuck');
    else nav.classList.remove('stuck');

    let curr = '';
    secs.forEach(s => { if(window.scrollY >= s.offsetTop - 150) curr = s.id; });
    links.forEach(l => {
      l.classList.toggle('on', l.getAttribute('href') === '#' + curr);
    });
  }, {passive:true});

  const btn = document.getElementById('ham');
  const menu = document.getElementById('mob-menu');
  if(!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('open');
    const sp = btn.querySelectorAll('span');
    if(menu.classList.contains('open')) {
      sp[0].style.transform = 'translateY(7px) rotate(45deg)';
      sp[1].style.opacity = '0';
      sp[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      sp.forEach(s => { s.style.transform=''; s.style.opacity=''; });
    }
  });
  document.querySelectorAll('.mm-link').forEach(l => {
    l.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.querySelectorAll('span').forEach(s => { s.style.transform=''; s.style.opacity=''; });
    });
  });
}

/* ─────────────────────────────────────────────
   5. BACKGROUND PARTICLES (Starfield effect)
   ───────────────────────────────────────────── */
function initParticles() {
  const cvs = document.getElementById('bg-canvas');
  if(!cvs) return;
  const ctx = cvs.getContext('2d');
  let W, H;
  const pts = [];
  const C = 100;
  
  function resize() { W = cvs.width = window.innerWidth; H = cvs.height = window.innerHeight; }
  window.addEventListener('resize', resize);
  resize();

  for(let i=0; i<C; i++) {
    pts.push({
      x: Math.random()*W, y: Math.random()*H,
      vx: (Math.random()-0.5)*0.3, vy: (Math.random()-0.5)*0.3,
      r: Math.random()*1.5+0.5,
      a: Math.random()*0.5+0.1
    });
  }

  let mx = -999, my = -999;
  window.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; });

  function draw() {
    ctx.clearRect(0,0,W,H);
    for(let i=0; i<C; i++) {
      let p = pts[i];
      p.x += p.vx; p.y += p.vy;
      if(p.x<0||p.x>W) p.vx*=-1;
      if(p.y<0||p.y>H) p.vy*=-1;
      
      const dx = p.x - mx; const dy = p.y - my;
      const d = Math.sqrt(dx*dx+dy*dy);
      if(d < 120) {
        p.x += dx*(120-d)*0.0005;
        p.y += dy*(120-d)*0.0005;
      }
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(6,214,160,${p.a})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();
}

/* ─────────────────────────────────────────────
   6. TYPED.JS
   ───────────────────────────────────────────── */
function initTyped() {
  if(typeof Typed === 'undefined') return;
  new Typed('#typed', {
    strings: [
      'Rust Microservices.',
      'Detection Engineering.',
      'AI MCP Servers.',
      'Kubernetes Infra.',
      'Enterprise SIEM/SOAR.'
    ],
    typeSpeed: 50,
    backSpeed: 30,
    backDelay: 1500,
    loop: true
  });
}

/* ─────────────────────────────────────────────
   7. GSAP SCROLL ANIMATIONS
   ───────────────────────────────────────────── */
function initGSAP() {
  if(typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  const ease = 'power3.out';

  // Hero Reveal (delayed for preloader)
  const d = 2.2;
  gsap.from('.hero-status', {y:20, opacity:0, duration:1, ease, delay:d});
  gsap.from('.hero-name', {y:30, opacity:0, duration:1, ease, delay:d+0.2});
  gsap.from('.hero-title-row', {y:20, opacity:0, duration:1, ease, delay:d+0.4});
  gsap.from('.hero-typed-row', {y:20, opacity:0, duration:1, ease, delay:d+0.5});
  gsap.from('.hero-desc', {y:20, opacity:0, duration:1, ease, delay:d+0.6});
  gsap.from('.hero-actions', {y:20, opacity:0, duration:1, ease, delay:d+0.7});
  gsap.from('.hero-social-rail', {opacity:0, duration:1, ease, delay:d+0.9});
  gsap.from('.orb-system', {scale:0.8, opacity:0, duration:1.5, ease, delay:d+0.3});

  // Generic sections
  document.querySelectorAll('.sec-head').forEach(el => {
    gsap.from(el, { scrollTrigger:{trigger:el, start:'top 85%'}, y:30, opacity:0, duration:0.8, ease });
  });

  // Specialize cards
  gsap.from('.spec-card', {
    scrollTrigger:{trigger:'.spec-grid', start:'top 85%'},
    y:40, opacity:0, duration:0.8, stagger:0.15, ease
  });

  // About 
  gsap.from('.term-card', {scrollTrigger:'.term-card', x:40, opacity:0, duration:1, Math});

  // Skills
  gsap.from('.sk-cat', {
    scrollTrigger:{trigger:'.skills-grid', start:'top 85%'},
    y:40, opacity:0, duration:0.7, stagger:0.1, ease
  });

  // Experience
  gsap.from('.exp-card', {scrollTrigger:'.exp-card', y:40, opacity:0, duration:0.9, ease});

  // Projects
  gsap.from('.proj-card', {
    scrollTrigger:{trigger:'.proj-grid', start:'top 85%'},
    y:50, opacity:0, duration:0.8, stagger:0.2, ease
  });

  // Certs
  gsap.from('.cert-card', {
    scrollTrigger:{trigger:'.certs-row', start:'top 90%'},
    y:20, opacity:0, duration:0.6, stagger:0.1, ease
  });

  // Contact
  gsap.from('.contact-items .citem', {
    scrollTrigger:{trigger:'.contact-wrap', start:'top 85%'},
    x:-30, opacity:0, duration:0.6, stagger:0.1, ease
  });
  gsap.from('.contact-form', {scrollTrigger:'.contact-form', x:40, opacity:0, duration:0.9, ease});
}

/* ─────────────────────────────────────────────
   8. ACCORDION
   ───────────────────────────────────────────── */
function initAccordions() {
  // EBC2 is open by default via HTML class .open
  // Let's set its height
  const openItem = document.querySelector('.acc-item.open');
  if(openItem) {
    const b = openItem.querySelector('.acc-body');
    b.style.maxHeight = b.scrollHeight + 'px';
  }

  document.querySelectorAll('.acc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.acc-item');
      const body = item.querySelector('.acc-body');
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.acc-item.open').forEach(o => {
        if(o !== item) {
          o.classList.remove('open');
          o.querySelector('.acc-body').style.maxHeight = '0';
        }
      });
      if(!isOpen) {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      } else {
        item.classList.remove('open');
        body.style.maxHeight = '0';
      }
    });
  });
}

/* ─────────────────────────────────────────────
   9. STAT COUNTERS
   ───────────────────────────────────────────── */
function initCounters() {
  const q = document.querySelectorAll('.astat-n[data-target]');
  if(!q.length) return;
  const obs = new IntersectionObserver(en => {
    en.forEach(e => {
      if(e.isIntersecting) {
        const el = e.target;
        const tar = +el.dataset.target;
        let c = 0; const s = Math.ceil(tar/40);
        const t = setInterval(() => {
          c = Math.min(c+s, tar);
          el.textContent = c + (el.dataset.sfx||'+');
          if(c>=tar) clearInterval(t);
        }, 40);
        obs.unobserve(el);
      }
    });
  }, {threshold:0.5});
  q.forEach(el => obs.observe(el));
}

/* ─────────────────────────────────────────────
   10. BACK TO TOP
   ───────────────────────────────────────────── */
function initBackTop() {
  const b = document.getElementById('back-top');
  if(!b) return;
  window.addEventListener('scroll', () => {
    if(window.scrollY > 500) b.classList.add('on');
    else b.classList.remove('on');
  }, {passive:true});
  b.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
}
