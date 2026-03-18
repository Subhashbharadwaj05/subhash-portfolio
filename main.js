/* =============================================================
   SUBHASH BHARADWAJ — ULTRA-PREMIUM JS ENGINE
   ============================================================= */

// --- WAIT FOR DOM ---
document.addEventListener('DOMContentLoaded', () => {
  initLenis();
  initPreloader();
  initGridCanvas();
  initFlashlight();
  initGSAP();
});

/* ─────────────────────────────────────────────
   1. LENIS SMOOTH SCROLL (God-Tier Feel)
   ───────────────────────────────────────────── */
let lenis;
function initLenis() {
  if (typeof Lenis === 'undefined') return;
  
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential ease out
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  // GSAP Integration
  if (typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  } else {
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }
}

/* ─────────────────────────────────────────────
   2. PRELOADER
   ───────────────────────────────────────────── */
function initPreloader() {
  const loader = document.getElementById('loader');
  if(!loader) return;
  
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.classList.remove('loading');
    
    // Trigger Hero Reveal Timeline
    if(typeof gsap !== 'undefined') {
      gsap.fromTo('.fade-el', 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: "power3.out", delay: 0.2 }
      );
    }
  }, 1600);
}

/* ─────────────────────────────────────────────
   3. BACKGROUND GRID (Electromagnetic Tech Ripple)
   ───────────────────────────────────────────── */
function initGridCanvas() {
  const cvs = document.getElementById('grid-canvas');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  
  let w, h, cols, rows;
  const spacing = 40; // Grid cell size
  const points = [];
  
  function resize() {
    w = cvs.width = window.innerWidth;
    h = cvs.height = window.innerHeight;
    cols = Math.floor(w / spacing) + 1;
    rows = Math.floor(h / spacing) + 1;
    
    points.length = 0;
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        points.push({
          ox: x * spacing, oy: y * spacing, // Origin
          x: x * spacing, y: y * spacing,   // Current
          vx: 0, vy: 0                      // Velocity
        });
      }
    }
  }
  
  window.addEventListener('resize', resize);
  resize();

  let mx = -1000, my = -1000;
  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  
  // Custom cursor wrapper also syncs with mouse
  const glow = document.getElementById('cursor-glow');

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    
    if(glow) {
      glow.style.transform = `translate(${mx}px, ${my}px)`;
    }

    const repelDist = 120;
    const force = 0.05;
    const friction = 0.85;
    const returnSpeed = 0.1;

    for (let i = 0; i < points.length; i++) {
      let p = points[i];
      
      // Calculate mouse repel
      const dx = mx - p.x;
      const dy = my - p.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      
      if (dist < repelDist) {
        p.vx -= (dx / dist) * force * (repelDist - dist);
        p.vy -= (dy / dist) * force * (repelDist - dist);
      }
      
      // Calculate return to origin
      p.vx += (p.ox - p.x) * returnSpeed;
      p.vy += (p.oy - p.y) * returnSpeed;
      
      // Apply friction
      p.vx *= friction;
      p.vy *= friction;
      
      // Update pos
      p.x += p.vx;
      p.y += p.vy;
      
      // Draw point
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    
    requestAnimationFrame(draw);
  }
  draw();
}

/* ─────────────────────────────────────────────
   4. FLASHLIGHT MASK INTERACTION
   ───────────────────────────────────────────── */
function initFlashlight() {
  const cards = document.querySelectorAll('.has-glow');
  
  document.body.addEventListener('mousemove', e => {
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* ─────────────────────────────────────────────
   5. GSAP TIMELINES & HORIZONTAL HIJACK
   ───────────────────────────────────────────── */
function initGSAP() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // Nav Hide/Show on scroll
  const nav = document.getElementById('nav');
  let lastScroll = 0;
  ScrollTrigger.create({
    onUpdate: (self) => {
      if(self.scroll() > lastScroll && self.scroll() > 100) nav.classList.add('hide');
      else nav.classList.remove('hide');
      lastScroll = self.scroll();
    }
  });

  // Hero Parallax Fade
  gsap.to('.hero-inner', {
    yPercent: 30,
    opacity: 0,
    ease: "none",
    scrollTrigger: { trigger: '.hero', start: "top top", end: "bottom top", scrub: true }
  });

  // Identity Parallax (Sticky logic is CSS, GSAP handles elegant fade up of each block)
  gsap.utils.toArray('.id-block').forEach((block) => {
    gsap.fromTo(block, 
      { opacity: 0.1, y: 50 },
      { opacity: 1, y: 0, ease: "power2.out", duration: 1,
        scrollTrigger: {
          trigger: block,
          start: "top 80%",
          end: "top 40%",
          scrub: 1
        }
      }
    );
  });

  // Projects Horizontal Hijack (The Crown Jewel)
  const track = document.querySelector('.proj-track');
  const trackWrapper = document.querySelector('.proj-track-wrapper');
  
  if(track && trackWrapper) {
    const getScrollAmount = () => {
      let trackWidth = track.scrollWidth;
      return -(trackWidth - window.innerWidth + (window.innerWidth * 0.1)); // allow 5vw padding on ends
    };

    const tween = gsap.to(track, {
      x: getScrollAmount,
      ease: "none"
    });

    ScrollTrigger.create({
      trigger: ".projects",
      start: "top top",
      end: () => `+=${track.scrollWidth}`, // Scroll duration matches physical width
      pin: true,
      animation: tween,
      scrub: 1,
      invalidateOnRefresh: true
    });
  }

  // Bento Capabilities Fade Ups
  gsap.from('.c-bento', {
    y: 60, opacity: 0, duration: 1, stagger: 0.1, ease: "power3.out",
    scrollTrigger: { trigger: '.capabilities', start: "top 75%" }
  });
}
