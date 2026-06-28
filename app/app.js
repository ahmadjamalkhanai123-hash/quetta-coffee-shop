/* ═══════════════════════════════════════════════════════════
   QUETTA COFFEE SHOP — App Logic
   ═══════════════════════════════════════════════════════════ */

// ── PARTICLES ─────────────────────────────────────────────
(function spawnParticles() {
  const container = document.getElementById('particles');
  const count = 40;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${Math.random() * 3 + 1}px;
      height: ${Math.random() * 3 + 1}px;
      animation-duration: ${Math.random() * 20 + 15}s;
      animation-delay: ${Math.random() * 20}s;
      opacity: ${Math.random() * 0.5 + 0.1};
    `;
    container.appendChild(p);
  }
})();

// ── NAVBAR SCROLL ──────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ── HAMBURGER (MOBILE) ─────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
  navLinks.style.flexDirection = 'column';
  navLinks.style.position = 'fixed';
  navLinks.style.top = '70px';
  navLinks.style.right = '24px';
  navLinks.style.background = 'rgba(14, 9, 0, 0.98)';
  navLinks.style.border = '1px solid rgba(212,175,55,0.2)';
  navLinks.style.borderRadius = '16px';
  navLinks.style.padding = '20px';
  navLinks.style.gap = '16px';
  navLinks.style.zIndex = '999';
});

// ── REVEAL ON SCROLL ───────────────────────────────────────
const reveals = document.querySelectorAll('.reveal-up');
const observer = new IntersectionObserver(
  (entries) => entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 120);
    }
  }),
  { threshold: 0.1 }
);
reveals.forEach(el => observer.observe(el));

// Trigger hero reveals immediately
window.addEventListener('load', () => {
  document.querySelectorAll('.hero .reveal-up').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 300 + i * 180);
  });
});

// ── MENU TABS ──────────────────────────────────────────────
const tabs      = document.querySelectorAll('.tab');
const menuCards = document.querySelectorAll('.menu-card');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const category = tab.dataset.tab;
    menuCards.forEach(card => {
      if (card.dataset.category === category) {
        card.classList.remove('hidden');
        card.style.animation = 'fadeSlideIn 0.4s ease forwards';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// Inject menu card animation
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);

// ── ADD TO CART BUTTONS ────────────────────────────────────
let cartCount = 0;
document.querySelectorAll('.add-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    cartCount++;
    const orig = this.textContent;
    this.textContent = '✓ Added!';
    this.style.background = 'var(--gold-primary)';
    this.style.color = 'var(--bg-black)';
    setTimeout(() => {
      this.textContent = orig;
      this.style.background = '';
      this.style.color = '';
    }, 1200);
  });
});

// ── TESTIMONIAL CAROUSEL ───────────────────────────────────
const dots = document.querySelectorAll('.dot');
let currentDot = 0;
let autoSlide;

function activateDot(idx) {
  dots.forEach(d => d.classList.remove('active'));
  dots[idx].classList.add('active');
  currentDot = idx;
}

dots.forEach(dot => {
  dot.addEventListener('click', () => activateDot(parseInt(dot.dataset.idx)));
});

autoSlide = setInterval(() => {
  activateDot((currentDot + 1) % dots.length);
}, 4000);

// ── CONTACT FORM ───────────────────────────────────────────
const contactForm    = document.getElementById('contact-form');
const formSuccess    = document.getElementById('form-success');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('.btn-gold');
  btn.textContent = 'Sending…';
  btn.style.opacity = '0.7';

  setTimeout(() => {
    contactForm.classList.add('hidden');
    formSuccess.classList.remove('hidden');
  }, 1200);
});

// ── NEWSLETTER FORM ────────────────────────────────────────
const newsletterBtn = document.querySelector('.newsletter-form button');
if (newsletterBtn) {
  newsletterBtn.addEventListener('click', () => {
    const input = document.querySelector('.newsletter-form input');
    if (input.value) {
      const orig = newsletterBtn.textContent;
      newsletterBtn.textContent = '✓';
      newsletterBtn.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
      setTimeout(() => {
        newsletterBtn.textContent = orig;
        newsletterBtn.style.background = '';
        input.value = '';
      }, 2000);
    }
  });
}

// ── SMOOTH SCROLL FOR NAV LINKS ────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (navLinks.style.display === 'flex') {
        navLinks.style.display = 'none';
      }
    }
  });
});

// ── ACTIVE NAV HIGHLIGHT ───────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => {
          a.style.color = a.getAttribute('href') === `#${entry.target.id}`
            ? 'var(--gold-primary)'
            : '';
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(s => sectionObserver.observe(s));

// ── GALLERY HOVER TILT ─────────────────────────────────────
document.querySelectorAll('.gallery-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 10;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -10;
    card.style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ── INTERSECTION OBSERVER FOR ALL CARDS ────────────────────
const cardObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 80);
        cardObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll('.menu-card, .exp-item, .testimonial-card, .gallery-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  cardObserver.observe(el);
});
