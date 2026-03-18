/* =============================================================
   SUBHASH BHARADWAJ — SB//CORE (Z-Axis Warp Engine)
   ============================================================= */

// --- WAIT FOR DOM ---
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initBootSequence();
});

/* ─────────────────────────────────────────────
   1. HUD CURSOR TARGETING
   ───────────────────────────────────────────── */
function initCursor() {
  const dot = document.getElementById('cursor-dot');
  const target = document.getElementById('cursor-target');
  if(!dot || !target) return;
  
  let tx = 0, ty = 0, cx = 0, cy = 0;
  
  document.addEventListener('mousemove', e => {
    tx = e.clientX; ty = e.clientY;
    dot.style.left = tx + 'px';
    dot.style.top = ty + 'px';
  });
  
  function loop() {
    cx += (tx - cx) * 0.2;
    cy += (ty - cy) * 0.2;
    target.style.left = cx + 'px';
    target.style.top = cy + 'px';
    requestAnimationFrame(loop);
  }
  loop();

  const interactives = 'a, button, .htag, .s-pill, .nd, .ab-pane, .c-btn';
  document.querySelectorAll(interactives).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hov-target'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hov-target'));
  });
}

/* ─────────────────────────────────────────────
   2. HACKER BOOT SEQUENCE
   ───────────────────────────────────────────── */
function initBootSequence() {
  const term = document.getElementById('boot-terminal');
  const inputLine = document.getElementById('bt-input');
  if(!term || !inputLine) {
    startEngine(); return;
  }
  
  // Prevent scrolling until boot complete
  window.scrollTo(0, 0);
  document.body.style.overflow = 'hidden';

  const targetCmd = "run portfolio_init --force";
  let cmdIndex = 0;
  let isBooting = false;
  
  function typeChar() {
    if(isBooting) return;
    if(cmdIndex < targetCmd.length) {
      inputLine.textContent += targetCmd.charAt(cmdIndex);
      cmdIndex++;
    } else {
      isBooting = true;
      executeBoot();
    }
  }

  // Whatever they type, type our command
  const keyHandler = (e) => {
    // Prevent default actions to stop scrolling or weirdness
    if(e.key !== 'F5' && e.key !== 'F12' && !e.ctrlKey) e.preventDefault();
    typeChar();
    // Simulate fast typing if they smash keys
    if(cmdIndex < targetCmd.length && Math.random() > 0.5) setTimeout(typeChar, 30);
  };
  
  document.addEventListener('keydown', keyHandler);
  
  // Auto-complete if they are slow (timeout 4s)
  const autoType = setInterval(() => {
    if(!isBooting && cmdIndex === 0) {
      const slowBoot = setInterval(() => {
        if(!isBooting) typeChar();
        else clearInterval(slowBoot);
      }, 80);
      clearInterval(autoType);
    }
  }, 4000);

  function executeBoot() {
    document.removeEventListener('keydown', keyHandler);
    
    const termBody = document.getElementById('bt-output');
    const p1 = document.createElement('p');
    p1.textContent = '> OVERRIDE ACCEPTED. BYPASSING SECURITY PROTOCOLS...';
    p1.style.color = '#ff3366';
    termBody.appendChild(p1);
    
    setTimeout(() => {
      const p2 = document.createElement('p');
      p2.textContent = '> DECRYPTING DATA CORE... 100%';
      p2.style.color = '#27c93f';
      termBody.appendChild(p2);
    }, 400);

    setTimeout(() => {
      term.classList.add('unlocked');
      document.body.style.overflow = ''; // allow scroll proxy to work
      startEngine();
    }, 1200);
  }
}

/* ─────────────────────────────────────────────
   3. THE WARP CORE (Engine Start)
   ───────────────────────────────────────────── */
function startEngine() {
  initWarpCanvas();
  initZAxisScroll();
  initGlitchPhysics();
}

/* ─────────────────────────────────────────────
   4. WARP BACKGROUND SIMULATOR
   ───────────────────────────────────────────── */
function initWarpCanvas() {
  const cvs = document.getElementById('warp-bg');
  if(!cvs) return;
  const ctx = cvs.getContext('2d');
  let W, H;
  
  function resize() { W = cvs.width = window.innerWidth; H = cvs.height = window.innerHeight; }
  window.addEventListener('resize', resize);
  resize();

  const stars = [];
  const count = 300;
  for(let i=0; i<count; i++) {
    stars.push({
      x: (Math.random() - 0.5) * 2000,
      y: (Math.random() - 0.5) * 2000,
      z: Math.random() * 2000,
      prevZ: Math.random() * 2000
    });
  }

  let scrollVel = 0;
  let lastScroll = window.scrollY;
  // Track scroll speed to stretch lines into warp drive effect
  window.addEventListener('scroll', () => {
    scrollVel += Math.abs(window.scrollY - lastScroll) * 0.05;
    lastScroll = window.scrollY;
  }, {passive:true});

  function draw() {
    ctx.fillStyle = 'rgba(1,3,8,0.8)'; // slight trail effect
    ctx.fillRect(0,0,W,H);
    
    // Friction
    scrollVel = Math.max(1, scrollVel * 0.92); // baseline speed is 1

    const cx = W/2, cy = H/2;
    for(let i=0; i<count; i++) {
      let s = stars[i];
      s.z -= scrollVel * 1.5;
      
      if(s.z <= 0) {
        s.z = 2000;
        s.prevZ = 2000;
        s.x = (Math.random() - 0.5) * 2000;
        s.y = (Math.random() - 0.5) * 2000;
      }

      // 3D to 2D project
      const fov = 350;
      const scale = fov / Math.max(s.z, 0.1);
      const px = s.x * scale + cx;
      const py = s.y * scale + cy;
      
      const pScale = fov / Math.max(s.prevZ, 0.1);
      const ppx = s.x * pScale + cx;
      const ppy = s.y * pScale + cy;
      
      ctx.beginPath();
      ctx.moveTo(ppx, ppy);
      ctx.lineTo(px, py);
      
      // Color and stretch based on velocity and proximity
      const cval = Math.floor(255 - (s.z/2000)*200);
      const r = Math.min(0 + scrollVel*10, 0); // cyan hue
      const g = 255;
      const b = 204;
      
      ctx.lineWidth = Math.min(scrollVel * 0.2, 5);
      if(ctx.lineWidth < 0.5) ctx.lineWidth = 0.5;
      ctx.strokeStyle = `rgba(${r},${g},${b},${Math.max(0.1, 1 - (s.z/2000))})`;
      ctx.stroke();
      
      s.prevZ = s.z;
    }
    requestAnimationFrame(draw);
  }
  draw();
}

/* ─────────────────────────────────────────────
   5. GSAP Z-AXIS TIMELINE & HUD SYNCHRONIZATION
   ───────────────────────────────────────────── */
function initZAxisScroll() {
  if(typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  const panels = gsap.utils.toArray('.panel');
  const camera = document.getElementById('camera');
  const zStep = 3500; // Distance between panels
  
  // Arrange panels absolutely in 3D space
  panels.forEach((p, i) => {
    // Add custom rotation for chaotic layout, snapping flat as camera approaches
    const rx = (Math.random()-0.5) * 30;
    const ry = (Math.random()-0.5) * 30;
    
    // We store base data via GSAP
    gsap.set(p, { 
      z: -i * zStep,
      rotationX: rx,
      rotationY: ry,
      opacity: i === 0 ? 1 : 0 
    });
    // Store original random rotation for math parsing
    p.origRX = rx; p.origRY = ry;
  });

  // Calculate total depth
  const maxZ = (panels.length - 1) * zStep;
  
  // HUD Elements
  const hudCoords = document.getElementById('hud-coords');
  const navDots = gsap.utils.toArray('.nd');

  // GSAP ScrollTrigger to move the camera forward
  const st = ScrollTrigger.create({
    trigger: '#scroll-proxy',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1.2,
    onUpdate: (self) => {
      const currentCamZ = self.progress * maxZ;
      gsap.set(camera, { z: currentCamZ });
      
      // Update HUD
      hudCoords.textContent = `Z: -${Math.floor(currentCamZ).toString().padStart(5, '0')} | V: ${(self.getVelocity() / 100).toFixed(2)}`;

      // Calculate proximity per panel
      let activeIndex = 0;
      panels.forEach((p, i) => {
        const pZ = i * zStep;
        const dist = Math.abs(currentCamZ - pZ);
        
        // Active dot logic (nearest panel)
        if(dist < (zStep / 2)) activeIndex = i;

        // Visual Math: 
        // Opacity peaks when dist < 500, fades out until dist > 2000
        let op = 1 - (dist / 1800);
        if(op < 0) op = 0; if(op > 1) op = 1;
        
        // Snap rotations flat as it approaches
        let progressToCenter = 1 - (dist / zStep); // 1 when exact, 0 when far
        if(progressToCenter < 0) progressToCenter = 0;
        
        // Apply physics
        gsap.set(p, {
          opacity: op,
          rotationX: p.origRX * (1 - progressToCenter),
          rotationY: p.origRY * (1 - progressToCenter),
        });
        
        // Enable pointer events only if strictly readable
        if(dist < 500) p.classList.add('active');
        else p.classList.remove('active');
      });
      
      // Update nav dots
      navDots.forEach((dot, idx) => {
        if(idx === activeIndex) dot.classList.add('active');
        else dot.classList.remove('active');
      });
    }
  });

  // Init dots click to jump to section
  navDots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      // Calculate target scroll percentage
      const pct = (i * zStep) / maxZ;
      const targetScroll = pct * (document.body.scrollHeight - window.innerHeight);
      window.scrollTo({top: targetScroll, behavior: 'smooth'});
    });
  });
}

/* ─────────────────────────────────────────────
   6. MICRO-INTERACTIONS & PHYSICS
   ───────────────────────────────────────────── */
function initGlitchPhysics() {
  const tiltCards = document.querySelectorAll('.ab-pane, .s-pill, .c-btn');
  
  tiltCards.forEach(c => {
    c.addEventListener('mousemove', e => {
      const rect = c.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const w = rect.width;
      const h = rect.height;
      
      const rx = (y / h - 0.5) * -15; // 15deg tilt
      const ry = (x / w - 0.5) * 15;
      
      gsap.to(c, { rotationX: rx, rotationY: ry, duration: 0.4, ease: "power2.out" });
    });
    
    c.addEventListener('mouseleave', () => {
      gsap.to(c, { rotationX: 0, rotationY: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
    });
  });
}
