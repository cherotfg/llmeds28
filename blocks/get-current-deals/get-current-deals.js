// Sample data for standalone/preview mode.
// In production, data comes dynamically from bridge.toolResult.
const SAMPLE_DATA = [
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

// Brand palette from BuildWidgetRequest (empty here — falls back to default dark strip).
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
      // structuredContent.deals — bare array outputSchema; key derived from actionName "get_current_deals"
      items = structuredContent?.deals || [];
    }
  } else {
    items = SAMPLE_DATA;
  }

  // Only show items flagged as deals when the flag is present.
  const deals = items.filter((it) => it && (it.is_deal === undefined || it.is_deal));

  block.textContent = '';
  renderDeals(block, deals, bridge);

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

function renderDeals(block, deals, bridge) {
  const wrapper = document.createElement('div');
  wrapper.className = 'get-current-deals-wrapper';

  const track = document.createElement('div');
  track.className = 'get-current-deals-track';

  deals.forEach((item, i) => {
    const card = document.createElement('div');
    card.className = 'get-current-deals-card';

    const media = document.createElement('div');
    media.className = 'get-current-deals-media';

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
      img.onerror = () => img.parentNode && img.parentNode.replaceChild(colorDiv(), img);
      media.appendChild(img);
    } else {
      media.appendChild(colorDiv());
    }

    if (item.discount_percentage) {
      const badge = document.createElement('span');
      badge.className = 'get-current-deals-badge';
      badge.textContent = item.discount_percentage;
      media.appendChild(badge);
    }

    card.appendChild(media);

    const info = document.createElement('div');
    info.className = 'get-current-deals-info';
    info.style.cssText = `background:${theme?.bg ?? '#1a1a1a'};color:${theme?.fg ?? '#fff'}`;

    const name = document.createElement('h3');
    name.className = 'get-current-deals-name';
    name.textContent = item.name || '';
    info.appendChild(name);

    const priceRow = document.createElement('div');
    priceRow.className = 'get-current-deals-price-row';
    if (item.original_price) {
      const orig = document.createElement('span');
      orig.className = 'get-current-deals-orig';
      orig.textContent = item.original_price;
      priceRow.appendChild(orig);
    }
    if (item.price) {
      const sale = document.createElement('span');
      sale.className = 'get-current-deals-sale';
      sale.textContent = item.price;
      priceRow.appendChild(sale);
    }
    info.appendChild(priceRow);

    const cta = document.createElement('button');
    cta.className = 'get-current-deals-cta';
    cta.type = 'button';
    cta.textContent = 'View Deal';
    if (bridge) {
      cta.addEventListener('click', () => {
        bridge.sendMessage(`Tell me more about ${item.name}`);
      });
    }
    info.appendChild(cta);

    card.appendChild(info);
    track.appendChild(card);
  });

  wrapper.appendChild(track);

  const fade = document.createElement('div');
  fade.className = 'get-current-deals-fade';
  fade.style.cssText = `position:absolute;top:0;right:0;height:100%;width:60px;background:linear-gradient(to right,transparent,${theme?.bg ?? '#1a1a1a'}cc);pointer-events:none;border-radius:0 10px 10px 0;`;
  wrapper.appendChild(fade);

  const mkArrow = (dir) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `get-current-deals-arrow get-current-deals-arrow-${dir}`;
    btn.setAttribute('aria-label', dir === 'left' ? 'Scroll left' : 'Scroll right');
    btn.textContent = dir === 'left' ? '◀' : '▶';
    btn.addEventListener('click', () => {
      track.scrollBy({ left: dir === 'left' ? -236 : 236, behavior: 'smooth' });
    });
    return btn;
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
  };
  track.addEventListener('scroll', updateArrows);
  requestAnimationFrame(updateArrows);

  block.appendChild(wrapper);
}
