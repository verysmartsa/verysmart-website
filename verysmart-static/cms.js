/* ============================================================
   Very Smart — CMS Bridge
   Fetches /api/content (or fallback /content.json) and applies it
   to the live site. Runs AFTER app.js so it can override.
============================================================ */
(function(){
  const ICON_MAP = {
    shield:   '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    bulb:     '<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7l1 1.3v2h6v-2l1-1.3A7 7 0 0 0 12 2z"/>',
    speaker:  '<path d="M3 18v3M21 18v3M5 18a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3"/><circle cx="8" cy="11" r="2"/><circle cx="16" cy="11" r="2"/><path d="M12 3v6"/>',
    home:     '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/>',
    climate:  '<path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44"/><path d="M4 14h14a2 2 0 1 0 0-4H4"/>',
    gear:     '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    users:    '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/>',
    building: '<path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/>',
    award:    '<circle cx="12" cy="8" r="7"/><polyline points="8.21,13.89 7,23 12,20 17,23 15.79,13.88"/>',
    headset:  '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1v-7h3z"/><path d="M3 19a2 2 0 0 0 2 2h1v-7H3z"/>',
    blinds:   '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>',
    mic:      '<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>',
    camera:   '<path d="M23 7l-7 5 7 5z"/><rect x="1" y="5" width="15" height="14" rx="2"/>',
    phone:    '<rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/>',
    bolt:     '<polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/>',
  };
  function icon(name, attrs=''){
    const path = ICON_MAP[name] || ICON_MAP.shield;
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${attrs}>${path}</svg>`;
  }

  /* ---------- BRAND map override ---------- */
  function applyBrand(brand){
    if (!brand || !window.BRAND) return;
    window.BRAND.phone = brand.phone || window.BRAND.phone;
    window.BRAND.whatsapp = (brand.whatsapp || window.BRAND.whatsapp || '').replace(/[^0-9]/g,'');
    window.BRAND.email = brand.email || window.BRAND.email;
    window.BRAND.instagram = brand.instagram || window.BRAND.instagram;
    window.BRAND.tiktok = brand.tiktok || window.BRAND.tiktok;
    window.BRAND.domain = brand.domain || window.BRAND.domain;

    // Update all links
    document.querySelectorAll('a[href^="tel:"]').forEach(a => a.href = 'tel:' + window.BRAND.phone);
    document.querySelectorAll('a[href^="mailto:"]').forEach(a => a.href = 'mailto:' + window.BRAND.email);
    document.querySelectorAll('a[href*="wa.me/"]').forEach(a => {
      a.href = a.href.replace(/wa\.me\/[0-9]+/, 'wa.me/' + window.BRAND.whatsapp);
    });
    document.querySelectorAll('a[href*="instagram.com/"]').forEach(a => {
      a.href = 'https://instagram.com/' + window.BRAND.instagram;
    });
    document.querySelectorAll('a[href*="tiktok.com/"]').forEach(a => {
      a.href = 'https://tiktok.com/@' + window.BRAND.tiktok;
    });
    // Visible phone numbers
    document.querySelectorAll('.info-card[href^="tel:"] .info-value, .topbar-contact a[href^="tel:"] span').forEach(el => {
      el.textContent = brand.phone || el.textContent;
    });
  }

  /* ---------- Merge content into I18N + apply ---------- */
  function applyTexts(c){
    if (!window.I18N) return;
    const map = {
      'hero.eyebrow':       'hero.eyebrow',
      'hero.title1':        'hero.title1',
      'hero.title2':        'hero.title2',
      'hero.desc':          'hero.desc',
      'hero.cta1':          'hero.cta1',
      'hero.cta2':          'hero.cta2',
      'services.tag':       'sectionTitles.services.tag',
      'services.title':     'sectionTitles.services.title',
      'services.sub':       'sectionTitles.services.sub',
      'features.tag':       'sectionTitles.features.tag',
      'features.title':     'sectionTitles.features.title',
      'features.sub':       'sectionTitles.features.sub',
      'products.tag':       'sectionTitles.products.tag',
      'products.title':     'sectionTitles.products.title',
      'products.sub':       'sectionTitles.products.sub',
      'projects.tag':       'sectionTitles.projects.tag',
      'projects.title':     'sectionTitles.projects.title',
      'projects.sub':       'sectionTitles.projects.sub',
      'why.tag':            'sectionTitles.why.tag',
      'why.title':          'sectionTitles.why.title',
      'why.sub':            'sectionTitles.why.sub',
      'about.tag':          'sectionTitles.about.tag',
      'about.title':        'sectionTitles.about.title',
      'about.p1':           'sectionTitles.about.p1',
      'about.p2':           'sectionTitles.about.p2',
      'contact.tag':        'sectionTitles.contact.tag',
      'contact.title':      'sectionTitles.contact.title',
      'contact.sub':        'sectionTitles.contact.sub',
      'contact.addr':       'brand.address',
      'topbar.hours':       'brand.hours',
    };
    const get = (path) => path.split('.').reduce((o,k)=> (o && o[k]!=null) ? o[k] : null, c);
    Object.entries(map).forEach(([i18nKey, path]) => {
      const val = get(path);
      if (val && val.ar) window.I18N.ar[i18nKey] = val.ar;
      if (val && val.en) window.I18N.en[i18nKey] = val.en;
    });
    if (typeof window.applyLang === 'function') {
      window.applyLang(document.documentElement.lang || 'ar');
    }
  }

  /* ---------- Render Stats ---------- */
  function renderStats(stats){
    const grid = document.querySelector('.stats-grid');
    if (!grid || !Array.isArray(stats)) return;
    const lang = document.documentElement.lang || 'ar';
    grid.innerHTML = stats.map(s => `
      <div class="stat-card reveal show">
        <div class="stat-icon">${icon(s.icon)}</div>
        <div class="stat-num">${escapeHtml(s.num || '')}</div>
        <div class="stat-label">${escapeHtml(s.label?.[lang] || s.label?.ar || '')}</div>
      </div>
    `).join('');
  }

  /* ---------- Render Services ---------- */
  function renderServices(items){
    const grid = document.querySelector('#services .cards-grid');
    if (!grid || !Array.isArray(items)) return;
    const lang = document.documentElement.lang || 'ar';
    grid.innerHTML = items.map(s => `
      <div class="s-card reveal show">
        <div class="icon-wrap">${icon(s.icon)}</div>
        <h3>${escapeHtml(s.title?.[lang] || s.title?.ar || '')}</h3>
        <p>${escapeHtml(s.desc?.[lang] || s.desc?.ar || '')}</p>
      </div>
    `).join('');
  }

  /* ---------- Render Features ---------- */
  function renderFeatures(items){
    const grid = document.querySelector('#features .features-grid');
    if (!grid || !Array.isArray(items)) return;
    const lang = document.documentElement.lang || 'ar';
    grid.innerHTML = items.map(f => `
      <div class="f-card reveal show">
        <div class="icon-sm">${icon(f.icon)}</div>
        <h4>${escapeHtml(f.title?.[lang] || f.title?.ar || '')}</h4>
        <p>${escapeHtml(f.desc?.[lang] || f.desc?.ar || '')}</p>
      </div>
    `).join('');
  }

  /* ---------- Render Products ---------- */
  function renderProducts(items){
    const grid = document.querySelector('#products .p-grid');
    if (!grid || !Array.isArray(items)) return;
    const lang = document.documentElement.lang || 'ar';
    const ctaText = (lang === 'ar') ? 'استفسر الآن' : 'Inquire Now';
    grid.innerHTML = items.map(p => {
      const name = p.name?.[lang] || p.name?.ar || '';
      const cat  = p.category?.[lang] || p.category?.ar || '';
      const desc = p.desc?.[lang] || p.desc?.ar || '';
      const img  = p.image ? `<img src="${escapeAttr(p.image)}" alt="${escapeAttr(name)}" style="width:100%;height:100%;object-fit:cover">`
                           : defaultProductSvg();
      return `
        <div class="p-card reveal show">
          <div class="p-thumb">${img}</div>
          <div class="p-body">
            <div class="p-cat">${escapeHtml(cat)}</div>
            <h4>${escapeHtml(name)}</h4>
            <p>${escapeHtml(desc)}</p>
            <a class="btn btn-primary" data-wa-product="${escapeAttr(name)}">${ctaText}</a>
          </div>
        </div>
      `;
    }).join('');
    // Wire WA buttons
    grid.querySelectorAll('[data-wa-product]').forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        const product = btn.getAttribute('data-wa-product');
        const text = (lang === 'ar')
          ? `مرحباً، أرغب بالاستفسار عن: *${product}*`
          : `Hello, I'd like to inquire about: *${product}*`;
        window.open(`https://wa.me/${window.BRAND.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
      };
    });
  }

  /* ---------- Render Projects ---------- */
  function renderProjects(items){
    const grid = document.querySelector('#projects .proj-grid');
    if (!grid || !Array.isArray(items)) return;
    const lang = document.documentElement.lang || 'ar';
    grid.innerHTML = items.map((p, i) => {
      const name = p.name?.[lang] || p.name?.ar || '';
      const tag  = p.tag?.[lang]  || p.tag?.ar || '';
      const loc  = p.location?.[lang] || p.location?.ar || '';
      const meta = p.meta?.[lang] || p.meta?.ar || '';
      const img  = p.image
        ? `<img src="${escapeAttr(p.image)}" alt="${escapeAttr(name)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">`
        : defaultProjectSvg(i);
      return `
        <article class="proj-card reveal show">
          <div class="proj-thumb">
            ${img}
            <span class="proj-tag">${escapeHtml(tag)}</span>
          </div>
          <div class="proj-body">
            <h4>${escapeHtml(name)}</h4>
            <div class="proj-loc">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>${escapeHtml(loc)}</span>
            </div>
            <div class="proj-meta">${escapeHtml(meta)}</div>
          </div>
        </article>
      `;
    }).join('');
  }

  /* ---------- Render Why ---------- */
  function renderWhy(items){
    const grid = document.querySelector('#why .why-grid');
    if (!grid || !Array.isArray(items)) return;
    const lang = document.documentElement.lang || 'ar';
    grid.innerHTML = items.map((w, i) => `
      <div class="why-card reveal show">
        <span class="num">${i+1}</span>
        <div class="big-icon">${icon(w.icon)}</div>
        <h4>${escapeHtml(w.title?.[lang] || w.title?.ar || '')}</h4>
        <p>${escapeHtml(w.desc?.[lang] || w.desc?.ar || '')}</p>
      </div>
    `).join('');
  }

  /* ---------- Visibility ---------- */
  function applyVisibility(vis){
    if (!vis) return;
    const map = {
      topbar:   '.topbar',
      hero:     '#home',
      stats:    '.stats-strip',
      services: '#services',
      about:    '#about',
      features: '#features',
      products: '#products',
      projects: '#projects',
      why:      '#why',
      contact:  '#contact',
      footer:   'footer',
    };
    Object.entries(map).forEach(([k, sel]) => {
      const el = document.querySelector(sel);
      if (!el) return;
      el.style.display = (vis[k] === false) ? 'none' : '';
    });
  }

  /* ---------- Default SVG fallbacks ---------- */
  function defaultProductSvg(){
    return '<svg viewBox="0 0 100 100" style="width:64%;height:64%"><rect x="20" y="25" width="60" height="40" rx="4" fill="#0E1F3D"/><rect x="25" y="30" width="50" height="30" rx="2" fill="#1B5FBF"/><circle cx="50" cy="45" r="6" fill="#E8842B"/></svg>';
  }
  function defaultProjectSvg(i){
    const bg = ['#0E1F3D','#142845','#1B3B6F','#0E1F3D','#1B3B6F','#0E1F3D'][i % 6];
    return `<svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%">
      <rect width="400" height="250" fill="${bg}"/>
      <rect x="80" y="100" width="240" height="120" fill="#1B5FBF"/>
      <rect x="100" y="120" width="50" height="60" fill="#E8842B" opacity=".8"/>
      <rect x="170" y="120" width="50" height="60" fill="#E8842B" opacity=".8"/>
      <rect x="240" y="120" width="60" height="60" fill="#E8842B" opacity=".8"/>
      <polygon points="60,100 200,40 340,100" fill="#08152C"/>
    </svg>`;
  }

  /* ---------- Helpers ---------- */
  function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c])); }
  function escapeAttr(s){ return String(s||'').replace(/"/g, '&quot;'); }

  /* ---------- Main: fetch & apply ---------- */
  async function loadAndApply(){
    let content = null;
    try {
      const r = await fetch('/api/content', { cache: 'no-store' });
      if (r.ok) content = await r.json();
    } catch {}
    if (!content){
      // Fallback to bundled static
      try {
        const r = await fetch('content.json', { cache: 'no-store' });
        if (r.ok) content = await r.json();
      } catch {}
    }
    if (!content) return;

    applyBrand(content.brand);
    applyTexts(content);
    if (content.stats)    renderStats(content.stats);
    if (content.services) renderServices(content.services);
    if (content.features) renderFeatures(content.features);
    if (content.products) renderProducts(content.products);
    if (content.projects) renderProjects(content.projects);
    if (content.why)      renderWhy(content.why);
    applyVisibility(content.visibility);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAndApply);
  } else {
    loadAndApply();
  }
})();
