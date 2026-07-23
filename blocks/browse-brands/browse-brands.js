// Sample data for standalone/preview mode.
// In production, data comes dynamically from bridge.toolResult.
const SAMPLE_DATA = [
  {
    name: 'COLORBOND® steel',
    description: 'Iconic pre-painted steel building material trusted since the 1960s for durable, low-maintenance roofing and walling across residential, commercial and industrial builds.',
    category: 'Coated & Painted Steel',
  },
  {
    name: 'ZINCALUME® steel',
    description: 'Strong, durable and cost-effective aluminium-zinc coated steel used by architects for modern roof sheeting and a wide range of commercial and industrial applications.',
    category: 'Coated Steel',
  },
  {
    name: 'BlueScope Zacs®',
    description: "Corrosion-resistant coated steel tailored for Southeast Asia's tropical climate, offering durability and a wide range of colours for residential and small-to-medium commercial buildings.",
    category: 'Coated Steel',
  },
  {
    name: 'TRUECORE® steel',
    description: "High-strength steel framing that stays straight and true, won't catch fire and resists warping, enabling wide spans and lightweight designs for residential and commercial builds.",
    category: 'Steel Framing',
  },
  {
    name: 'SuperDyma®',
    description: 'Premium zinc-aluminium-magnesium coated steel made with Nippon Steel technology for exceptional corrosion resistance in harsh environments, ideal for structural and industrial fabrication.',
    image_url: 'https://assets.nsbluescope.com/f/247285/4032x3024/89a903e4fe/superdyma-decking.jpg/m/1440x0/filters:no_upscale():quality(80)',
    category: 'Coated Steel',
  },
  {
    name: 'LYSAGHT®',
    description: 'An extensive range of prefabricated building solutions for roofing, walling, structural decking and steel framing systems for architectural, industrial, commercial and residential projects.',
    category: 'Building Solutions',
  },
];

// Brand palette from BuildWidgetRequest. getThemedCardBg() darkens palette[0]
// to luminance <= 0.12 so white text meets WCAG AA contrast.
const PALETTE = ['#0044b4'];

function getThemedCardBg(palette) {
  if (!palette || !palette[0]) return null;
  let hex = palette[0].replace('#', '');
  if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  if (hex.length !== 6) return null;
  let [r, g, b] = [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
  if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
  const lum = (c) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
  const relLum = (rr, gg, bb) => 0.2126 * lum(rr) + 0.7152 * lum(gg) + 0.0722 * lum(bb);
  if (relLum(r, g, b) <= 0.12) return { bg: `#${hex}`, fg: '#ffffff' };
  let lo = 0, hi = 1;
  for (let i = 0; i < 20; i++) {
    const m = (lo + hi) / 2;
    if (relLum(Math.round(r * m), Math.round(g * m), Math.round(b * m)) > 0.12) hi = m; else lo = m;
  }
  const dr = Math.round(r * lo), dg = Math.round(g * lo), db = Math.round(b * lo);
  return { bg: `#${dr.toString(16).padStart(2, '0')}${dg.toString(16).padStart(2, '0')}${db.toString(16).padStart(2, '0')}`, fg: '#ffffff' };
}
const theme = getThemedCardBg(PALETTE);

const CARD_COLORS = ['#378ef0', '#9256d9', '#0fb5ae', '#e68619', '#d83790', '#2dca72', '#4046ca', '#72b340'];

export default async function decorate(block, bridge) {
  let items;

  if (bridge) {
    bridge.applyHostStyles();
    const isPreview = bridge.hostContext?.preview === true;
    if (isPreview) {
      items = SAMPLE_DATA;
    } else {
      const _result = await bridge.toolResult;
      const structuredContent = _result?.structuredContent || _result;
      // structuredContent.brands — bare array outputSchema; key derived from actionName "browse_brands"
      items = structuredContent?.brands || [];
    }
  } else {
    items = SAMPLE_DATA;
  }

  block.textContent = '';
  renderItems(block, items, bridge);

  if (bridge) {
    bridge.reportSize(block.offsetWidth, block.offsetHeight);
    let resizeTimer;
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => bridge.reportSize(block.offsetWidth, block.offsetHeight), 150);
    });
    ro.observe(block);
  }
}

function renderItems(block, items, bridge) {
  const wrapper = document.createElement('div');
  wrapper.className = 'browse-brands-wrapper';

  const track = document.createElement('div');
  track.className = 'browse-brands-track';

  items.forEach((item, i) => {
    const card = document.createElement('div');
    card.className = 'browse-brands-card';

    const imageContainer = document.createElement('div');
    imageContainer.className = 'browse-brands-image';
    const fallbackColor = CARD_COLORS[i % CARD_COLORS.length];
    const colorDiv = () => {
      const d = document.createElement('div');
      d.style.cssText = `width:100%;height:100%;background-color:${fallbackColor};`;
      return d;
    };
    if (item.image_url) {
      const img = document.createElement('img');
      img.src = item.image_url;
      img.alt = item.name || '';
      img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
      img.onerror = () => img.parentNode.replaceChild(colorDiv(), img);
      imageContainer.appendChild(img);
    } else {
      imageContainer.appendChild(colorDiv());
    }
    card.appendChild(imageContainer);

    const info = document.createElement('div');
    info.className = 'browse-brands-info';
    info.style.cssText = `background:${theme?.bg ?? '#1a1a1a'};color:${theme?.fg ?? '#fff'};`;

    const title = document.createElement('h3');
    title.className = 'browse-brands-title';
    title.textContent = item.name || '';
    info.appendChild(title);

    const desc = document.createElement('p');
    desc.className = 'browse-brands-desc';
    desc.textContent = item.description || '';
    info.appendChild(desc);

    if (item.category) {
      const badge = document.createElement('span');
      badge.className = 'browse-brands-badge';
      badge.textContent = item.category;
      info.appendChild(badge);
    }

    const btn = document.createElement('button');
    btn.className = 'browse-brands-cta';
    btn.type = 'button';
    btn.textContent = 'Learn More';
    if (bridge) {
      btn.addEventListener('click', () => {
        bridge.sendMessage(`Tell me more about ${item.name}`);
      });
    }
    info.appendChild(btn);

    card.appendChild(info);
    track.appendChild(card);
  });

  wrapper.appendChild(track);

  const fade = document.createElement('div');
  fade.className = 'browse-brands-fade';
  fade.style.cssText = `position:absolute;top:0;right:0;height:100%;width:60px;background:linear-gradient(to right,transparent,${theme?.bg ?? '#1a1a1a'}cc);pointer-events:none;border-radius:0 10px 10px 0;`;
  wrapper.appendChild(fade);

  const scrollByCard = (dir) => {
    const card = track.querySelector('.browse-brands-card');
    const delta = (card ? card.offsetWidth : 220) + 16;
    track.scrollBy({ left: dir * delta, behavior: 'smooth' });
  };

  const leftBtn = document.createElement('button');
  leftBtn.className = 'browse-brands-nav browse-brands-nav-left';
  leftBtn.type = 'button';
  leftBtn.setAttribute('aria-label', 'Scroll left');
  leftBtn.textContent = '◀';
  leftBtn.addEventListener('click', () => scrollByCard(-1));

  const rightBtn = document.createElement('button');
  rightBtn.className = 'browse-brands-nav browse-brands-nav-right';
  rightBtn.type = 'button';
  rightBtn.setAttribute('aria-label', 'Scroll right');
  rightBtn.textContent = '▶';
  rightBtn.addEventListener('click', () => scrollByCard(1));

  const updateNav = () => {
    const atStart = track.scrollLeft <= 4;
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    leftBtn.style.display = atStart ? 'none' : 'flex';
    rightBtn.style.display = atEnd ? 'none' : 'flex';
    fade.style.display = atEnd ? 'none' : 'block';
  };
  track.addEventListener('scroll', updateNav);
  requestAnimationFrame(updateNav);

  wrapper.appendChild(leftBtn);
  wrapper.appendChild(rightBtn);

  block.appendChild(wrapper);
}
