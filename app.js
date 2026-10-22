'use strict';

// A short, quiet tone generated locally after a user click; no audio download.
(() => {
  let audioContext;
  let lastClick = -Infinity;

  function playClick() {
    const now = audioContext.currentTime;
    if (now - lastClick < 0.06) return;
    lastClick = now;

    const tone = audioContext.createOscillator();
    const volume = audioContext.createGain();
    tone.type = 'sine';
    tone.frequency.setValueAtTime(740, now);
    tone.frequency.exponentialRampToValueAtTime(520, now + 0.085);
    volume.gain.setValueAtTime(0, now);
    volume.gain.linearRampToValueAtTime(0.025, now + 0.006);
    volume.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
    volume.gain.linearRampToValueAtTime(0, now + 0.09);
    tone.connect(volume);
    volume.connect(audioContext.destination);
    tone.onended = () => {
      tone.disconnect();
      volume.disconnect();
    };
    tone.start(now);
    tone.stop(now + 0.09);
  }

  document.addEventListener('click', (event) => {
    if (!event.isTrusted || event.button !== 0) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    try {
      if (!audioContext) audioContext = new AudioContext();
      if (audioContext.state === 'suspended') {
        audioContext.resume().then(playClick).catch(() => {});
      } else if (audioContext.state === 'running') {
        playClick();
      }
    } catch (_) {
      // Audio restrictions must never interrupt navigation or product selection.
    }
  }, { passive: true });
})();

const INSTAGRAM_INBOX = 'https://ig.me/m/drawlove.shop.226';
const categoryNames = ['Locket Gold', 'CapCut', 'ChatGPT', 'Meitu', 'Wink', 'Gemini', 'Netflix', 'YouTube Premium', 'Spotify iOS'];
let catalog = Object.fromEntries(categoryNames.map(name => [name, []]));
let selectedCategory = 'Locket Gold';
let loadFailed = false;

const container = document.getElementById('products');
const empty = document.getElementById('empty-state');
const toastEl = document.getElementById('toast');
let toastTimer = null;

// Helper create element
function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

// Toast notification helper
function showToast(message) {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.classList.remove('show');
  }, 2600);
}

// Clipboard copy helper
function copyText(text, successMessage) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMessage || 'Đã sao chép tin nhắn ♡');
    }).catch(() => {
      fallbackCopy(text, successMessage);
    });
  } else {
    fallbackCopy(text, successMessage);
  }
}

function fallbackCopy(text, successMessage) {
  try {
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    tempInput.style.position = 'fixed';
    tempInput.style.opacity = '0';
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showToast(successMessage || 'Đã sao chép tin nhắn ♡');
  } catch (err) {
    showToast('Hãy giữ và sao chép tin nhắn bạn nhé ♡');
  }
}

// Render product list with animations
function renderCategory(name) {
  selectedCategory = name;

  // Update tabs
  document.querySelectorAll('[data-category]').forEach(button => {
    const active = button.dataset.category === name;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });

  const titleEl = document.getElementById('collection-title');
  if (titleEl) titleEl.textContent = name;

  container.replaceChildren();

  const products = Array.isArray(catalog[name]) ? catalog[name] : [];
  const validProducts = products.filter(product =>
    product &&
    typeof product.name === 'string' && product.name.trim() &&
    typeof product.image === 'string' && product.image.trim()
  );

  empty.hidden = validProducts.length > 0;
  
  const statusEl = document.getElementById('collection-status');
  if (statusEl) {
    statusEl.textContent = validProducts.length
      ? `${validProducts.length} gói để bạn khám phá`
      : 'Thông tin gói đang được cập nhật';
  }

  const copy = document.getElementById('empty-copy');
  if (copy) {
    copy.replaceChildren(
      document.createTextNode(
        loadFailed
          ? 'Chưa tải được danh mục sản phẩm. Bạn có thể thử tải lại trang.'
          : `Thông tin các gói ${name} đang được cập nhật.`
      ),
      document.createElement('br'),
      document.createTextNode('Inbox DrawLove để được tư vấn về gói bạn quan tâm.')
    );
  }

  // Render cards with staggered delay
  validProducts.forEach((product, index) => {
    const card = element('article', 'product');
    card.style.animationDelay = `${index * 0.07}s`;

    // Image container with shimmer sweep
    const imgWrap = element('div', 'product-img-wrap');
    const image = element('img');
    image.src = product.image;
    image.alt = product.name;
    image.loading = 'lazy';
    imgWrap.append(image);
    card.append(imgWrap);

    // Title
    card.append(element('h4', '', product.name));

    // Description
    if (typeof product.description === 'string' && product.description.trim()) {
      card.append(element('p', '', product.description));
    }

    // Specifications List
    const list = element('ul');
    const specFields = [
      ['videoDuration', 'Thời lượng video'],
      ['validity', 'Hạn sử dụng'],
      ['warranty', 'Bảo hành']
    ];

    for (const [key, label] of specFields) {
      if (typeof product[key] === 'string' && product[key].trim()) {
        list.append(element('li', '', `${label}: ${product[key]}`));
      }
    }

    if (Array.isArray(product.features)) {
      product.features
        .filter(item => typeof item === 'string' && item.trim())
        .forEach(feature => list.append(element('li', '', feature)));
    }

    if (list.children.length) {
      card.append(list);
    }

    // Interactive message hint with quick copy
    const hintMsg = `Chào DrawLove, mình muốn tư vấn gói ${product.name}.`;
    const hintBox = element('div', 'message-hint-box');
    const hintText = element('p', 'message-hint-text', `Tin nhắn gợi ý: “${hintMsg}”`);
    
    const copyBtn = element('button', 'copy-hint-btn', 'Sao chép tin nhắn ♡');
    copyBtn.type = 'button';
    copyBtn.setAttribute('aria-label', `Sao chép tin nhắn gợi ý cho gói ${product.name}`);
    copyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      copyText(hintMsg, `Đã chép: “${hintMsg}” ♡`);
    });

    hintBox.append(hintText, copyBtn);
    card.append(hintBox);

    // Action button
    const choose = element('a', 'button button-glow', 'Chọn gói ↗');
    choose.href = INSTAGRAM_INBOX;
    choose.target = '_blank';
    choose.rel = 'noopener noreferrer';
    choose.setAttribute('aria-label', `Chọn gói ${product.name} — mở inbox Instagram`);
    card.append(choose);

    container.append(card);
  });
}

// Bind category switch clicks
document.querySelectorAll('[data-category]').forEach(button => {
  button.addEventListener('click', () => {
    const cat = button.dataset.category;
    if (cat !== selectedCategory) {
      renderCategory(cat);
    }
  });
});

// Fetch catalog
fetch('products.json')
  .then(response => {
    if (!response.ok) throw new Error('Catalog unavailable');
    return response.json();
  })
  .then(data => {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      throw new Error('Invalid catalog');
    }
    catalog = data;
    renderCategory(selectedCategory);
  })
  .catch(() => {
    loadFailed = true;
    renderCategory(selectedCategory);
  });

// Initial render
renderCategory(selectedCategory);

/* ==========================================================================
   CANVAS AMBIENT FLOATING HEARTS & MAGIC CURSOR DUST (SIÊU LUNG LINH)
   ========================================================================== */
const canvas = document.getElementById('ambient-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const symbols = ['♥', '♡', '✧', '✦', '🌸'];
  const colors = [
    'rgba(231, 123, 160, 0.45)',
    'rgba(244, 143, 177, 0.45)',
    'rgba(240, 98, 146, 0.35)',
    'rgba(255, 182, 193, 0.5)',
    'rgba(255, 209, 220, 0.5)'
  ];

  // 1. Ambient Floating Hearts
  const ambientCount = Math.min(28, Math.floor(width / 45));
  const particles = [];

  class AmbientHeart {
    constructor() {
      this.reset(true);
    }
    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 20;
      this.size = 12 + Math.random() * 16;
      this.speed = 0.4 + Math.random() * 0.7;
      this.symbol = symbols[Math.floor(Math.random() * symbols.length)];
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.drift = (Math.random() - 0.5) * 0.6;
      this.wobbleSpeed = 0.02 + Math.random() * 0.03;
      this.wobble = Math.random() * Math.PI * 2;
      this.rotation = (Math.random() - 0.5) * 0.4;
    }
    update() {
      this.y -= this.speed;
      this.wobble += this.wobbleSpeed;
      this.x += Math.sin(this.wobble) * 0.7 + this.drift;
      if (this.y < -30) {
        this.reset();
      }
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.font = `${this.size}px Georgia, serif`;
      ctx.fillStyle = this.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.symbol, 0, 0);
      ctx.restore();
    }
  }

  for (let i = 0; i < ambientCount; i++) {
    particles.push(new AmbientHeart());
  }

  // 2. Cursor Dust & Click Burst Particles
  const bursts = [];

  class BurstParticle {
    constructor(x, y, vx, vy, symbol, color, size, life = 1) {
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.symbol = symbol;
      this.color = color;
      this.size = size;
      this.life = life;
      this.maxLife = life;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.15;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.04; // light gravity
      this.life -= 0.02;
      this.rotation += this.rotSpeed;
    }
    draw() {
      const alpha = Math.max(0, this.life / this.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.font = `${this.size}px Georgia, serif`;
      ctx.fillStyle = this.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.symbol, 0, 0);
      ctx.restore();
    }
  }

  // Trigger burst at x, y
  function triggerBurst(x, y, count = 10, speedMult = 1) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = (2 + Math.random() * 3.5) * speedMult;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed - 1.5;
      const sym = symbols[Math.floor(Math.random() * symbols.length)];
      const col = ['#e77ba0', '#f06292', '#ba68c8', '#ff80ab', '#ffb74d'][Math.floor(Math.random() * 5)];
      const sz = 14 + Math.random() * 12;
      bursts.push(new BurstParticle(x, y, vx, vy, sym, col, sz, 1.2));
    }
  }

  // Mouse move: magic fairy trail
  let lastSpawn = 0;
  window.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastSpawn > 45) { // every 45ms
      lastSpawn = now;
      const sym = ['✧', '✦', '♡'][Math.floor(Math.random() * 3)];
      const col = ['#e77ba0', '#f48fb1', '#ffb2c9'][Math.floor(Math.random() * 3)];
      const vx = (Math.random() - 0.5) * 1.5;
      const vy = -1 - Math.random() * 1.5;
      bursts.push(new BurstParticle(e.clientX, e.clientY, vx, vy, sym, col, 13 + Math.random() * 8, 0.7));
    }
  });

  // Global click: heart burst
  window.addEventListener('click', (e) => {
    triggerBurst(e.clientX, e.clientY, 8, 1);
  });

  // FAB "Thả tim" button click: massive heart burst
  const fabBurstBtn = document.getElementById('fab-burst-btn');
  if (fabBurstBtn) {
    fabBurstBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const rect = fabBurstBtn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      triggerBurst(centerX, centerY, 28, 1.6);
      showToast('Đã thả một bầu trời tim yêu thương ♡');
    });
  }

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw ambient
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    // Draw bursts
    for (let i = bursts.length - 1; i >= 0; i--) {
      bursts[i].update();
      bursts[i].draw();
      if (bursts[i].life <= 0) {
        bursts.splice(i, 1);
      }
    }

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}

/* ==========================================================================
   Hero 3D Card Interactive Parallax / Tilt
   ========================================================================== */
const heroBox = document.getElementById('hero-art-box');
const loveCard = document.getElementById('love-card');

if (heroBox && loveCard && window.matchMedia('(hover: hover)').matches) {
  heroBox.addEventListener('mousemove', (e) => {
    const rect = heroBox.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateY = (x / (rect.width / 2)) * 14;
    const rotateX = -(y / (rect.height / 2)) * 14;
    loveCard.style.transform = `rotate(-7deg) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
  });

  heroBox.addEventListener('mouseleave', () => {
    loveCard.style.transform = '';
  });
}

/* ==========================================================================
   Sticky Header Blur on Scroll
   ========================================================================== */
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  if (header) {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
}, { passive: true });
