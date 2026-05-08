/* ===================================================
   Muhammad Akif Naveed — Portfolio JavaScript
   =================================================== */

// ===== TYPED EFFECT =====
const typedPhrases = [
  'AI Engineering',
  'Intelligent Systems',
  'NLP & Automation',
  'Research & Innovation',
  'Systems Development',
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typedTimeout;

function typeLoop() {
  const el = document.getElementById('typedText');
  if (!el) return;

  const currentPhrase = typedPhrases[phraseIndex];

  if (isDeleting) {
    charIndex--;
    el.textContent = currentPhrase.slice(0, charIndex);
  } else {
    charIndex++;
    el.textContent = currentPhrase.slice(0, charIndex);
  }

  let delay = isDeleting ? 45 : 90;

  if (!isDeleting && charIndex === currentPhrase.length) {
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % typedPhrases.length;
    delay = 300;
  }

  typedTimeout = setTimeout(typeLoop, delay);
}

// ===== CANVAS PARTICLE FIELD =====
function initCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles, animId;
  const COUNT = 60;
  const SPEED = 0.25;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function makeParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * SPEED,
      vy: (Math.random() - 0.5) * SPEED,
      r: Math.random() * 1.5 + 0.4,
      alpha: Math.random() * 0.4 + 0.1,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, makeParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          const opacity = (1 - dist / 130) * 0.08;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(91,139,247,${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(91,139,247,${p.alpha})`;
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
    });

    animId = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animId);
    init();
    draw();
  });

  init();
  draw();
}

// ===== NAVIGATION =====
function initNav() {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const mobile = document.getElementById('navMobile');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  toggle.addEventListener('click', () => {
    mobile.classList.toggle('open');
  });

  // Close mobile nav on link click
  mobile.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mobile.classList.remove('open'));
  });

  // Smooth scroll for all nav anchors
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 70;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

// ===== SCROLL REVEAL =====
function initReveal() {
  const items = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay ? parseInt(entry.target.dataset.delay) : 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach(item => observer.observe(item));
}

// ===== MODAL =====
window.openModal = function(imgSrc, title) {
  const overlay = document.getElementById('modalOverlay');
  const img = document.getElementById('modalImg');
  const titleEl = document.getElementById('modalTitle');
  const placeholder = document.getElementById('modalPlaceholder');

  titleEl.textContent = title;
  img.src = imgSrc;
  img.style.display = 'block';
  placeholder.style.display = 'none';

  img.onerror = function() {
    img.style.display = 'none';
    placeholder.style.display = 'block';
    placeholder.innerHTML = `
      📁 Image not found.<br>
      Add your file at: <code style="background:rgba(255,255,255,0.05);padding:2px 6px;border-radius:4px;font-size:0.75rem">${imgSrc}</code><br>
      See the HTML comments for exact paths.
    `;
  };

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeModal = function() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
};

// Close modal on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// ===== ACTIVE NAV LINK ON SCROLL =====
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = link.getAttribute('href') === `#${entry.target.id}`
            ? 'var(--text)'
            : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(section => observer.observe(section));
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initCanvas();
  initNav();
  initReveal();
  initActiveNav();
  setTimeout(typeLoop, 600);
});
