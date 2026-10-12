'use strict';
const INSTAGRAM_INBOX = 'https://ig.me/m/drawlove.shop.226';
const categoryNames = ['Locket Gold', 'CapCut', 'ChatGPT', 'Meitu', 'Wink', 'Gemini'];
let catalog = Object.fromEntries(categoryNames.map(name => [name, []]));
let selectedCategory = 'Locket Gold';
let loadFailed = false;
const container = document.getElementById('products');
const empty = document.getElementById('empty-state');

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function renderCategory(name) {
  selectedCategory = name;
  document.querySelectorAll('[data-category]').forEach(button => {
    const active = button.dataset.category === name;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  document.getElementById('collection-title').textContent = name;
  container.replaceChildren();
  const products = Array.isArray(catalog[name]) ? catalog[name] : [];
  const validProducts = products.filter(product => product && typeof product.name === 'string' && product.name.trim() && typeof product.image === 'string' && product.image.trim());
  empty.hidden = validProducts.length > 0;
  document.getElementById('collection-status').textContent = validProducts.length ? `${validProducts.length} gói để bạn khám phá` : 'Thông tin gói đang được cập nhật';
  const copy = document.getElementById('empty-copy');
  copy.replaceChildren(document.createTextNode(loadFailed ? 'Chưa tải được danh mục sản phẩm. Bạn có thể thử tải lại trang.' : `Thông tin các gói ${name} đang được cập nhật.`), document.createElement('br'), document.createTextNode('Inbox DrawLove để được tư vấn về gói bạn quan tâm.'));
  for (const product of validProducts) {
    const card = element('article', 'product');
    const image = element('img');
    image.src = product.image;
    image.alt = product.name;
    image.loading = 'lazy';
    card.append(image, element('h4', '', product.name));
    if (typeof product.description === 'string') card.append(element('p', '', product.description));
    const list = element('ul');
    for (const [key, label] of [['videoDuration', 'Thời lượng video'], ['validity', 'Hạn sử dụng'], ['warranty', 'Bảo hành']]) {
      if (typeof product[key] === 'string' && product[key].trim()) list.append(element('li', '', `${label}: ${product[key]}`));
    }
    if (Array.isArray(product.features)) product.features.filter(item => typeof item === 'string' && item.trim()).forEach(feature => list.append(element('li', '', feature)));
    if (list.children.length) card.append(list);
    card.append(element('p', 'message-hint', `Tin nhắn gợi ý: “Chào DrawLove, mình muốn tư vấn gói ${product.name}.”`));
    const choose = element('a', 'button', 'Chọn gói ↗');
    choose.href = INSTAGRAM_INBOX;
    choose.target = '_blank';
    choose.rel = 'noopener noreferrer';
    choose.setAttribute('aria-label', `Chọn gói ${product.name} — mở inbox Instagram`);
    card.append(choose);
    container.append(card);
  }
}

document.querySelectorAll('[data-category]').forEach(button => button.addEventListener('click', () => renderCategory(button.dataset.category)));
renderCategory(selectedCategory);
fetch('products.json').then(response => {
  if (!response.ok) throw new Error('Catalog unavailable');
  return response.json();
}).then(data => {
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Invalid catalog');
  catalog = data;
  renderCategory(selectedCategory);
}).catch(() => {
  loadFailed = true;
  renderCategory(selectedCategory);
});
