// Sample data for standalone/preview mode.
// In production, data comes dynamically from bridge.toolResult.
const SAMPLE_DATA = [
  {
    name: 'Air Jordan 1 Low SE',
    description: 'Iconic low-top Air Jordan 1 sneaker in a special edition colorway.',
    image_url: 'https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/52388c3f-04cc-4058-b9c9-cc8584ca28de/AIR+JORDAN+1+LOW+SE.png',
    price: 'S$189',
    category: "Men's Shoes",
  },
  {
    name: 'Nike Air Max 95 Big Bubble SE',
    description: 'Air Max 95 with visible Big Bubble cushioning in a special edition finish.',
    image_url: 'https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/9ab80620-f2d0-4e98-89fe-3ee608773d60/NIKE+AIR+MAX+95+BIG+BUBBLE+SE.png',
    price: 'S$269',
    category: "Men's Shoes",
  },
  {
    name: 'Nike Dunk Low Retro Premium',
    description: 'Classic Dunk Low silhouette with premium materials.',
    image_url: 'https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/b010b543-7ed4-489e-bbd0-96cd4539d958/NIKE+DUNK+LOW+RETRO+PRM.png',
    price: 'S$179',
    category: "Men's Shoes",
  },
  {
    name: 'Nike SB Code 58',
    description: 'Skateboarding shoe built for board feel and durability.',
    image_url: 'https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/dedc3d1f-bd3e-476c-a313-1d54122a555f/NIKE+SB+CODE+58.png',
    price: 'S$129',
    category: 'Skate Shoes',
  },
  {
    name: 'Nike ACG LDV',
    description: 'ACG-inspired trail lifestyle shoe with rugged suede detailing.',
    image_url: 'https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/14cbcdef-49ea-4b6e-bfa7-91a011ddecb1/NIKE+ACG+LDV.png',
    price: 'S$199',
    category: "Men's Shoes",
  },
  {
    name: "Nike Air Force 1 '07 LV8",
    description: 'The classic Air Force 1 in an elevated LV8 build.',
    image_url: 'https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/06769520-f154-4b37-ae0b-9dec6c6f5356/AIR+FORCE+1+%2707+LV8.png',
    price: 'S$179',
    category: "Men's Shoes",
  },
  {
    name: "Nike Air Max 95 Big Bubble 'OG'",
    description: 'Original Air Max 95 Big Bubble now on sale.',
    image_url: 'https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/7843533c-dd6c-4258-95b0-266c783b3e06/NIKE+AIR+MAX+95+BIG+BUBBLE.png',
    price: 'S$181.30',
    original_price: 'S$259',
    discount_percentage: '30% off',
    category: "Men's Shoes",
    is_deal: true,
  },
  {
    name: 'Air Jordan 1 Low G Spiked',
    description: 'Air Jordan 1 Low golf shoe with spiked traction, now discounted.',
    image_url: 'https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/46cb6b9d-c022-4706-a6a5-e26a5818aa00/AIR+JORDAN+1+LOW+G+SPK.png',
    price: 'S$181.30',
    original_price: 'S$259',
    discount_percentage: '30% off',
    category: 'Golf Shoes',
    is_deal: true,
  },
  {
    name: 'Nike Terra Manta Suede',
    description: 'Trail-inspired suede sneaker at a reduced price.',
    image_url: 'https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/41a2233a-701b-405f-935d-1b05730ecffe/NIKE+TERRA+MANTA+SDE.png',
    price: 'S$87.50',
    original_price: 'S$125',
    discount_percentage: '30% off',
    category: "Men's Shoes",
    is_deal: true,
  },
];

// Brand palette from BuildWidgetRequest (empty here → fallback background used).
const PALETTE = [];

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
      // structuredContent.products — bare array outputSchema; key derived from actionName "search_products"
      items = structuredContent?.products || [];
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
  const list = (items || []).filter((it) => !it.is_deal).slice(0, 10);

  const wrapper = document.createElement('div');
  wrapper.className = 'search-products-wrapper';

  const track = document.createElement('div');
  track.className = 'search-products-track';

  list.forEach((item, i) => {
    const card = document.createElement('div');
    card.className = 'search-products-card';

    const imageBox = document.createElement('div');
    imageBox.className = 'search-products-image';

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
      img.loading = 'lazy';
      img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
      img.onerror = () => img.parentNode && img.parentNode.replaceChild(colorDiv(), img);
      imageBox.appendChild(img);
    } else {
      imageBox.appendChild(colorDiv());
    }
    card.appendChild(imageBox);

    const info = document.createElement('div');
    info.className = 'search-products-info';
    info.style.cssText = `background:${theme?.bg ?? '#1a1a1a'};color:${theme?.fg ?? '#fff'};`;

    if (item.category) {
      const badge = document.createElement('span');
      badge.className = 'search-products-badge';
      badge.textContent = item.category;
      info.appendChild(badge);
    }

    const title = document.createElement('h3');
    title.className = 'search-products-name';
    title.textContent = item.name || '';
    info.appendChild(title);

    if (item.price) {
      const price = document.createElement('div');
      price.className = 'search-products-price';
      price.textContent = item.price;
      info.appendChild(price);
    }

    const btn = document.createElement('button');
    btn.className = 'search-products-cta';
    btn.type = 'button';
    btn.textContent = 'View Details';
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
  fade.className = 'search-products-fade';
  fade.style.cssText = `position:absolute;top:0;right:0;height:100%;width:60px;background:linear-gradient(to right,transparent,${theme?.bg ?? '#1a1a1a'}cc);pointer-events:none;border-radius:0 10px 10px 0;`;
  wrapper.appendChild(fade);

  const cardStep = 236; // 220 card + 16 gap
  const mkArrow = (dir) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = `search-products-arrow search-products-arrow-${dir}`;
    b.setAttribute('aria-label', dir === 'left' ? 'Scroll left' : 'Scroll right');
    b.textContent = dir === 'left' ? '◀' : '▶';
    const scroll = () => track.scrollBy({ left: dir === 'left' ? -cardStep : cardStep, behavior: 'smooth' });
    b.addEventListener('click', scroll);
    b.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); scroll(); }
    });
    return b;
  };
  const leftArrow = mkArrow('left');
  const rightArrow = mkArrow('right');
  wrapper.appendChild(leftArrow);
  wrapper.appendChild(rightArrow);

  const updateArrows = () => {
    const atStart = track.scrollLeft <= 2;
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
    leftArrow.style.display = atStart ? 'none' : 'flex';
    rightArrow.style.display = atEnd ? 'none' : 'flex';
    fade.style.display = atEnd ? 'none' : 'block';
  };
  track.addEventListener('scroll', updateArrows);
  requestAnimationFrame(updateArrows);

  block.appendChild(wrapper);
}
