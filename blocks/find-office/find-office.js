// Sample data for standalone/preview mode.
// In production, data comes dynamically from bridge.toolResult.
const SAMPLE_DATA = [
  {
    name: 'NS BlueScope Head Office',
    address: '238B Thomson Road, #17-01 Novena Square Tower B, Singapore 307685',
    phone: '+65 6333 3378',
    country: 'Singapore',
  },
  {
    name: 'PT NS BlueScope Indonesia (Head Office)',
    address: 'South Quarter Tower A 10th Floor, Jl. RA Kartini Kav 8, Cilandak Barat, Jakarta Selatan 12430',
    phone: '+62 21 5098-2030',
    country: 'Indonesia',
  },
];

// Brand palette from BuildWidgetRequest — used to derive card background.
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
const ACCENT = PALETTE[0] || '#0044b4';

function pinSvg(size, color) {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', String(size));
  svg.setAttribute('height', String(size));
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', color);
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  const p1 = document.createElementNS(ns, 'path');
  p1.setAttribute('d', 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z');
  const c1 = document.createElementNS(ns, 'circle');
  c1.setAttribute('cx', '12');
  c1.setAttribute('cy', '10');
  c1.setAttribute('r', '3');
  svg.appendChild(p1);
  svg.appendChild(c1);
  return svg;
}

function renderEmptyState(block, bridge) {
  const card = document.createElement('div');
  card.className = 'find-office-search';
  card.style.cssText = `background:${theme?.bg ?? '#1a3a5c'};color:${theme?.fg ?? '#fff'}`;

  const pinWrap = document.createElement('div');
  pinWrap.className = 'find-office-search-pin';
  pinWrap.appendChild(pinSvg(36, theme?.fg ?? '#fff'));
  card.appendChild(pinWrap);

  const heading = document.createElement('h3');
  heading.className = 'find-office-search-title';
  heading.textContent = 'Find an office near you';
  card.appendChild(heading);

  const input = document.createElement('input');
  input.className = 'find-office-input';
  input.type = 'text';
  input.placeholder = 'Enter country…';
  input.setAttribute('aria-label', 'Country');
  card.appendChild(input);

  const btn = document.createElement('button');
  btn.className = 'find-office-btn';
  btn.type = 'button';
  btn.textContent = 'Find Office';
  btn.style.background = ACCENT;
  const submit = () => {
    const val = input.value.trim();
    if (bridge) {
      bridge.sendMessage(val
        ? `Find the nearest NS BlueScope office in ${val}`
        : 'Find the nearest NS BlueScope office');
    }
  };
  btn.addEventListener('click', submit);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
  card.appendChild(btn);

  block.appendChild(card);
}

function renderOffices(block, offices, bridge) {
  const row = document.createElement('div');
  row.className = 'find-office-row';

  offices.forEach((office) => {
    const card = document.createElement('div');
    card.className = 'find-office-card';
    card.style.cssText = `background:${theme?.bg ?? '#1a3a5c'};color:${theme?.fg ?? '#fff'}`;

    const pinWrap = document.createElement('div');
    pinWrap.className = 'find-office-card-pin';
    pinWrap.appendChild(pinSvg(18, theme?.fg ?? '#fff'));
    card.appendChild(pinWrap);

    const name = document.createElement('div');
    name.className = 'find-office-name';
    name.textContent = office.name || '';
    card.appendChild(name);

    if (office.address) {
      const addr = document.createElement('div');
      addr.className = 'find-office-address';
      addr.textContent = office.address;
      card.appendChild(addr);
    }

    if (office.phone) {
      const phone = document.createElement('div');
      phone.className = 'find-office-phone';
      phone.textContent = office.phone;
      phone.style.color = ACCENT;
      card.appendChild(phone);
    }

    row.appendChild(card);
  });

  block.appendChild(row);
}

function render(block, offices, bridge) {
  block.textContent = '';
  if (offices && offices.length) {
    renderOffices(block, offices, bridge);
  } else {
    renderEmptyState(block, bridge);
  }
}

export default async function decorate(block, bridge) {
  let offices;

  if (bridge) {
    bridge.applyHostStyles();
    const isPreview = bridge.hostContext?.preview === true;
    if (isPreview) {
      offices = SAMPLE_DATA;
    } else {
      const _result = await bridge.toolResult;
      const structuredContent = _result?.structuredContent || _result;
      // structuredContent.offices — bare array outputSchema; key derived from actionName "find_office"
      offices = structuredContent?.offices || [];
    }
    render(block, offices, bridge);
    bridge.reportSize(block.offsetWidth, block.offsetHeight);
    let resizeTimer;
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => bridge.reportSize(block.offsetWidth, block.offsetHeight), 150);
    });
    ro.observe(block);
  } else {
    offices = SAMPLE_DATA;
    render(block, offices, bridge);
  }
}
