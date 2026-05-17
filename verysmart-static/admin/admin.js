/* ============================================================
   Very Smart — Admin Panel
   - Loads content from /api/content
   - Edits in-memory, saves to /api/content
   - CRUD for: services, features, products, projects, stats, why
   - Image upload via /api/upload → /api/image/:id
============================================================ */

const ICON_OPTIONS = [
  ['shield','🛡️ درع/حماية'], ['bulb','💡 إضاءة'], ['speaker','🔊 صوت'],
  ['home','🏠 منزل'], ['climate','🌡️ مناخ'], ['gear','⚙️ ترس/إعدادات'],
  ['users','👥 فريق'], ['building','🏢 مبنى'], ['award','🏆 جائزة'],
  ['headset','🎧 دعم'], ['blinds','🪟 ستائر'], ['mic','🎙️ ميكروفون'],
  ['camera','📹 كاميرا'], ['phone','📱 جوال'], ['bolt','⚡ سرعة'],
];

const SECTION_LABELS = {
  topbar:'الشريط العلوي', hero:'القسم الرئيسي', stats:'الأرقام',
  services:'الخدمات', about:'من نحن', features:'المميزات',
  products:'المنتجات', projects:'المشاريع', why:'لماذا نحن',
  contact:'تواصل', footer:'التذييل'
};

let state = { content: null, dirty: false };

/* ---------- Auth check ---------- */
async function checkAuth() {
  try {
    const r = await fetch('/api/login');
    const j = await r.json();
    if (!j.authed) location.href = 'login.html';
  } catch {
    // If API not available locally, allow continued use with localStorage demo
  }
}

/* ---------- Toast ---------- */
const toastEl = () => document.getElementById('toast');
function toast(msg, kind='info'){
  const t = toastEl(); t.className = 'toast show ' + kind; t.textContent = msg;
  clearTimeout(toast._h); toast._h = setTimeout(()=>t.classList.remove('show'), 2800);
}

/* ---------- Path get/set ---------- */
function gp(obj, path){
  return path.split('.').reduce((o,k)=> (o && o[k] != null) ? o[k] : '', obj);
}
function sp(obj, path, val){
  const ks = path.split('.');
  let o = obj;
  for (let i=0;i<ks.length-1;i++){
    if (!o[ks[i]] || typeof o[ks[i]] !== 'object') o[ks[i]] = {};
    o = o[ks[i]];
  }
  o[ks[ks.length-1]] = val;
}

/* ---------- Load content ---------- */
async function loadContent(){
  try {
    const r = await fetch('/api/content', {cache:'no-store'});
    if (r.ok) state.content = await r.json();
  } catch {}
  if (!state.content){
    // fallback: fetch the static content.json bundled with site
    try {
      const r = await fetch('../content.json', {cache:'no-store'});
      state.content = await r.json();
    } catch (e) {
      toast('تعذّر تحميل المحتوى', 'error');
      state.content = { brand:{}, hero:{}, stats:[], services:[], features:[], products:[], projects:[], why:[], sectionTitles:{}, visibility:{} };
    }
  }
  renderAll();
  updateMeta();
}

function updateMeta(){
  const el = document.getElementById('lastUpdated');
  if (state.content.updatedAt){
    el.textContent = 'آخر حفظ: ' + new Date(state.content.updatedAt).toLocaleString('ar-SA');
  } else {
    el.textContent = 'لم يتم الحفظ بعد';
  }
  document.getElementById('cnt-services').textContent = (state.content.services||[]).length + ' خدمة';
  document.getElementById('cnt-products').textContent = (state.content.products||[]).length + ' منتج';
  document.getElementById('cnt-projects').textContent = (state.content.projects||[]).length + ' مشروع';
}

/* ---------- Render bindings (text fields) ---------- */
function renderBindings(){
  document.querySelectorAll('[data-path]').forEach(el => {
    el.value = gp(state.content, el.dataset.path);
    el.oninput = () => {
      sp(state.content, el.dataset.path, el.value);
      state.dirty = true;
    };
  });
}

/* ---------- Render list items ---------- */
function renderList(key, opts={}){
  const container = document.getElementById('list-' + key);
  if (!container) return;
  const items = state.content[key] || [];
  container.innerHTML = '';
  if (!items.length){
    container.innerHTML = `<div class="empty"><span class="emoji">📭</span>لا توجد عناصر بعد. اضغط <b>إضافة</b> أعلاه.</div>`;
    return;
  }
  items.forEach((it, idx) => {
    const card = document.createElement('div');
    card.className = 'item-card';
    const title = it.name?.ar || it.title?.ar || it.label?.ar || it.num || '—';
    const desc  = it.desc?.ar || it.location?.ar || it.category?.ar || it.icon || '';
    const img   = it.image ? `<img src="${escapeAttr(it.image)}" alt="">` : `<span class="ph">${escapeHtml(it.icon || '—')}</span>`;
    card.innerHTML = `
      <div class="thumb">${img}</div>
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(desc)}</p>
      <div class="ops">
        <button class="btn-icon" title="تعديل" data-edit="${idx}">
          <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button class="btn-icon" title="نسخ" data-dup="${idx}">
          <svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        </button>
        <button class="btn-icon" title="أعلى" data-up="${idx}">
          <svg viewBox="0 0 24 24"><polyline points="18,15 12,9 6,15"/></svg>
        </button>
        <button class="btn-icon" title="أسفل" data-down="${idx}">
          <svg viewBox="0 0 24 24"><polyline points="6,9 12,15 18,9"/></svg>
        </button>
        <button class="btn-icon" title="حذف" data-del="${idx}" style="color:var(--red)">
          <svg viewBox="0 0 24 24"><polyline points="3,6 5,6 21,6"/><path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6"/></svg>
        </button>
      </div>
    `;
    container.appendChild(card);
  });

  // Wire up
  container.querySelectorAll('[data-edit]').forEach(b => b.onclick = () => openEditor(key, +b.dataset.edit));
  container.querySelectorAll('[data-dup]').forEach(b => b.onclick = () => {
    const i = +b.dataset.dup;
    const clone = JSON.parse(JSON.stringify(state.content[key][i]));
    clone.id = randId();
    state.content[key].splice(i+1, 0, clone);
    state.dirty = true; renderList(key); updateMeta();
  });
  container.querySelectorAll('[data-up]').forEach(b => b.onclick = () => {
    const i = +b.dataset.up;
    if (i === 0) return;
    [state.content[key][i-1], state.content[key][i]] = [state.content[key][i], state.content[key][i-1]];
    state.dirty = true; renderList(key);
  });
  container.querySelectorAll('[data-down]').forEach(b => b.onclick = () => {
    const i = +b.dataset.down;
    if (i >= state.content[key].length - 1) return;
    [state.content[key][i+1], state.content[key][i]] = [state.content[key][i], state.content[key][i+1]];
    state.dirty = true; renderList(key);
  });
  container.querySelectorAll('[data-del]').forEach(b => b.onclick = () => {
    const i = +b.dataset.del;
    const name = state.content[key][i].name?.ar || state.content[key][i].title?.ar || state.content[key][i].label?.ar || '—';
    if (!confirm(`هل أنت متأكد من حذف "${name}"؟`)) return;
    state.content[key].splice(i, 1);
    state.dirty = true; renderList(key); updateMeta();
    toast('تم الحذف', 'success');
  });
}

/* ---------- Visibility list ---------- */
function renderVisibility(){
  const c = document.getElementById('visibility-list');
  if (!c) return;
  c.innerHTML = '';
  Object.keys(SECTION_LABELS).forEach(k => {
    const cur = state.content.visibility?.[k] !== false;
    const row = document.createElement('label');
    row.className = 'toggle';
    row.innerHTML = `
      <div>
        <div class="toggle-label">${SECTION_LABELS[k]}
          <span class="section-hidden-badge ${cur?'shown':''}">${cur ? 'ظاهر':'مخفي'}</span>
        </div>
        <div class="toggle-desc">القسم سيظهر/يختفي مباشرة على الموقع</div>
      </div>
      <span class="switch"><input type="checkbox" ${cur?'checked':''}><span class="slider"></span></span>
    `;
    const input = row.querySelector('input');
    input.onchange = () => {
      if (!state.content.visibility) state.content.visibility = {};
      state.content.visibility[k] = input.checked;
      state.dirty = true;
      const badge = row.querySelector('.section-hidden-badge');
      badge.textContent = input.checked ? 'ظاهر' : 'مخفي';
      badge.classList.toggle('shown', input.checked);
    };
    c.appendChild(row);
  });
}

/* ---------- Render everything ---------- */
function renderAll(){
  renderBindings();
  renderList('stats');
  renderList('services');
  renderList('features');
  renderList('products');
  renderList('projects');
  renderList('why');
  renderVisibility();
}

/* ---------- Editor modal ---------- */
function fieldRow(label, value, oninput, type='input'){
  const wrap = document.createElement('div');
  wrap.className = 'field';
  const lab = document.createElement('label'); lab.textContent = label;
  wrap.appendChild(lab);
  const el = document.createElement(type === 'textarea' ? 'textarea' : 'input');
  if (type === 'textarea') el.rows = 2;
  el.value = value || '';
  el.oninput = () => oninput(el.value);
  wrap.appendChild(el);
  return wrap;
}

function iconSelect(value, oninput){
  const wrap = document.createElement('div');
  wrap.className = 'field';
  const lab = document.createElement('label'); lab.textContent = 'أيقونة'; wrap.appendChild(lab);
  const sel = document.createElement('select');
  ICON_OPTIONS.forEach(([k,v]) => {
    const o = document.createElement('option');
    o.value = k; o.textContent = v;
    if (k === value) o.selected = true;
    sel.appendChild(o);
  });
  sel.onchange = () => oninput(sel.value);
  wrap.appendChild(sel);
  return wrap;
}

function imageUpload(value, oninput){
  const wrap = document.createElement('div');
  wrap.className = 'field';
  const lab = document.createElement('label'); lab.textContent = 'صورة المنتج/المشروع'; wrap.appendChild(lab);
  const box = document.createElement('div');
  box.className = 'img-upload' + (value ? ' has-image' : '');
  box.innerHTML = `
    <div class="preview">${value ? `<img src="${escapeAttr(value)}">` : '<span class="placeholder">لا توجد صورة</span>'}</div>
    <div class="controls">
      <label class="img-upload-btn">
        📤 رفع صورة جديدة
        <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml">
      </label>
      ${value ? '<button type="button" class="img-upload-btn" data-remove>🗑️ إزالة</button>' : ''}
      <div class="hint" style="font-size:11px;color:var(--muted);margin-top:4px">الحد الأقصى 2 ميجابايت</div>
    </div>
  `;
  const file = box.querySelector('input[type=file]');
  file.onchange = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    if (f.size > 2*1024*1024) { toast('الصورة كبيرة جداً (>2MB)', 'error'); return; }
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result;
      // Try server upload first
      try {
        const r = await fetch('/api/upload', {
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ name: f.name, type: f.type, dataBase64: dataUrl }),
        });
        const j = await r.json();
        if (r.ok && j.ok) {
          oninput(j.url);
          box.querySelector('.preview').innerHTML = `<img src="${j.url}">`;
          box.classList.add('has-image');
          toast('تم رفع الصورة', 'success');
          return;
        }
        throw new Error(j.error || 'upload failed');
      } catch (err) {
        // Fallback: embed as data URL (large but works without backend)
        oninput(dataUrl);
        box.querySelector('.preview').innerHTML = `<img src="${dataUrl}">`;
        box.classList.add('has-image');
        toast('تم الحفظ كصورة محلية', 'info');
      }
    };
    reader.readAsDataURL(f);
  };
  const rm = box.querySelector('[data-remove]');
  if (rm) rm.onclick = () => { oninput(''); box.querySelector('.preview').innerHTML = '<span class="placeholder">لا توجد صورة</span>'; box.classList.remove('has-image'); };
  wrap.appendChild(box);
  return wrap;
}

function openEditor(key, idx){
  const item = state.content[key][idx];
  const modal = document.getElementById('itemModal');
  const body = document.getElementById('modalBody');
  const title = document.getElementById('modalTitle');
  const KEY_TITLE = { services:'خدمة', features:'ميزة', products:'منتج', projects:'مشروع', why:'سبب', stats:'رقم/إحصائية' };
  title.textContent = 'تعديل ' + (KEY_TITLE[key] || 'عنصر');
  body.innerHTML = '';

  const local = JSON.parse(JSON.stringify(item));

  if (key === 'stats'){
    body.appendChild(fieldRow('الرقم (مثل +500 أو 24/7)', local.num, v => local.num = v));
    body.appendChild(iconSelect(local.icon || 'users', v => local.icon = v));
    const row = document.createElement('div'); row.className = 'row';
    row.appendChild(fieldRow('التسمية (عربي)', local.label?.ar, v => { local.label = local.label||{}; local.label.ar = v; }));
    row.appendChild(fieldRow('Label (English)', local.label?.en, v => { local.label = local.label||{}; local.label.en = v; }));
    body.appendChild(row);
  }
  else if (key === 'services' || key === 'features' || key === 'why'){
    body.appendChild(iconSelect(local.icon || 'shield', v => local.icon = v));
    const r1 = document.createElement('div'); r1.className = 'row';
    r1.appendChild(fieldRow('العنوان (عربي)', local.title?.ar, v => { local.title = local.title||{}; local.title.ar = v; }));
    r1.appendChild(fieldRow('Title (English)', local.title?.en, v => { local.title = local.title||{}; local.title.en = v; }));
    body.appendChild(r1);
    const r2 = document.createElement('div'); r2.className = 'row';
    r2.appendChild(fieldRow('الوصف (عربي)', local.desc?.ar, v => { local.desc = local.desc||{}; local.desc.ar = v; }, 'textarea'));
    r2.appendChild(fieldRow('Description (English)', local.desc?.en, v => { local.desc = local.desc||{}; local.desc.en = v; }, 'textarea'));
    body.appendChild(r2);
  }
  else if (key === 'products'){
    const r1 = document.createElement('div'); r1.className = 'row';
    r1.appendChild(fieldRow('الفئة (عربي)', local.category?.ar, v => { local.category = local.category||{}; local.category.ar = v; }));
    r1.appendChild(fieldRow('Category (English)', local.category?.en, v => { local.category = local.category||{}; local.category.en = v; }));
    body.appendChild(r1);
    const r2 = document.createElement('div'); r2.className = 'row';
    r2.appendChild(fieldRow('اسم المنتج (عربي)', local.name?.ar, v => { local.name = local.name||{}; local.name.ar = v; }));
    r2.appendChild(fieldRow('Product Name (English)', local.name?.en, v => { local.name = local.name||{}; local.name.en = v; }));
    body.appendChild(r2);
    const r3 = document.createElement('div'); r3.className = 'row';
    r3.appendChild(fieldRow('الوصف (عربي)', local.desc?.ar, v => { local.desc = local.desc||{}; local.desc.ar = v; }, 'textarea'));
    r3.appendChild(fieldRow('Description (English)', local.desc?.en, v => { local.desc = local.desc||{}; local.desc.en = v; }, 'textarea'));
    body.appendChild(r3);
    body.appendChild(imageUpload(local.image, v => local.image = v));
  }
  else if (key === 'projects'){
    const r0 = document.createElement('div'); r0.className = 'row';
    r0.appendChild(fieldRow('التصنيف (عربي)', local.tag?.ar, v => { local.tag = local.tag||{}; local.tag.ar = v; }));
    r0.appendChild(fieldRow('Tag (English)', local.tag?.en, v => { local.tag = local.tag||{}; local.tag.en = v; }));
    body.appendChild(r0);
    const r1 = document.createElement('div'); r1.className = 'row';
    r1.appendChild(fieldRow('اسم المشروع (عربي)', local.name?.ar, v => { local.name = local.name||{}; local.name.ar = v; }));
    r1.appendChild(fieldRow('Project Name (English)', local.name?.en, v => { local.name = local.name||{}; local.name.en = v; }));
    body.appendChild(r1);
    const r2 = document.createElement('div'); r2.className = 'row';
    r2.appendChild(fieldRow('الموقع (عربي)', local.location?.ar, v => { local.location = local.location||{}; local.location.ar = v; }));
    r2.appendChild(fieldRow('Location (English)', local.location?.en, v => { local.location = local.location||{}; local.location.en = v; }));
    body.appendChild(r2);
    const r3 = document.createElement('div'); r3.className = 'row';
    r3.appendChild(fieldRow('التفاصيل (عربي)', local.meta?.ar, v => { local.meta = local.meta||{}; local.meta.ar = v; }));
    r3.appendChild(fieldRow('Details (English)', local.meta?.en, v => { local.meta = local.meta||{}; local.meta.en = v; }));
    body.appendChild(r3);
    body.appendChild(imageUpload(local.image, v => local.image = v));
  }

  modal.classList.add('show');
  document.getElementById('modalSave').onclick = () => {
    state.content[key][idx] = local;
    state.dirty = true;
    renderList(key);
    updateMeta();
    modal.classList.remove('show');
    toast('تم التحديث (لا تنسى الحفظ)', 'success');
  };
}
function closeModal(){ document.getElementById('itemModal').classList.remove('show'); }

/* ---------- Add new item ---------- */
function addItem(key){
  if (!state.content[key]) state.content[key] = [];
  const templates = {
    stats:    { id: randId(), num:'+0', icon:'users', label:{ar:'تسمية',en:'Label'} },
    services: { id: randId(), icon:'shield', title:{ar:'خدمة جديدة',en:'New Service'}, desc:{ar:'وصف الخدمة',en:'Service description'} },
    features: { id: randId(), icon:'bulb',  title:{ar:'ميزة جديدة',en:'New Feature'}, desc:{ar:'وصف الميزة',en:'Feature description'} },
    why:      { id: randId(), icon:'award', title:{ar:'سبب جديد',en:'New Reason'},  desc:{ar:'وصف السبب',en:'Reason description'} },
    products: { id: randId(), category:{ar:'فئة',en:'Category'}, name:{ar:'منتج جديد',en:'New Product'}, desc:{ar:'وصف المنتج',en:'Product description'}, image:'' },
    projects: { id: randId(), tag:{ar:'فيلا',en:'Villa'}, name:{ar:'مشروع جديد',en:'New Project'}, location:{ar:'الرياض',en:'Riyadh'}, meta:{ar:'',en:''}, image:'' },
  };
  state.content[key].push(templates[key]);
  state.dirty = true;
  renderList(key);
  updateMeta();
  openEditor(key, state.content[key].length - 1);
}

/* ---------- Save to server ---------- */
async function saveToServer(){
  if (!state.content) return;
  const allSaveBtns = document.querySelectorAll('[data-save],#saveBtn');
  allSaveBtns.forEach(b => { b.disabled = true; b.textContent = '⏳ جاري الحفظ...'; });
  try {
    const r = await fetch('/api/content', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(state.content),
    });
    const j = await r.json();
    if (r.ok && j.ok) {
      state.dirty = false;
      state.content.updatedAt = j.updatedAt || new Date().toISOString();
      updateMeta();
      toast('تم الحفظ ✓', 'success');
    } else {
      throw new Error(j.error || 'فشل الحفظ');
    }
  } catch (e) {
    toast('فشل الحفظ: ' + e.message, 'error');
  } finally {
    allSaveBtns.forEach(b => {
      b.disabled = false;
      b.textContent = b.id === 'saveBtn' ? '💾 حفظ كل التغييرات' : '💾 حفظ';
    });
  }
}

/* ---------- Logout ---------- */
async function logout(){
  if (!confirm('تأكيد تسجيل الخروج؟')) return;
  try { await fetch('/api/logout', {method:'POST'}); } catch {}
  location.href = 'login.html';
}

/* ---------- Navigation ---------- */
function go(view){
  document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.id === 'view-'+view));
  document.querySelectorAll('.nav-item[data-view]').forEach(n => n.classList.toggle('active', n.dataset.view === view));
  document.getElementById('sidebar').classList.remove('open');
  window.scrollTo({top:0,behavior:'smooth'});
}

/* ---------- Init ---------- */
async function init(){
  await checkAuth();
  await loadContent();

  // Sidebar nav
  document.querySelectorAll('.nav-item[data-view]').forEach(b => b.onclick = () => go(b.dataset.view));
  document.querySelectorAll('[data-go]').forEach(b => b.onclick = () => go(b.dataset.go));

  // Add buttons
  document.querySelectorAll('[data-add]').forEach(b => b.onclick = () => addItem(b.dataset.add));

  // Save buttons
  document.querySelectorAll('[data-save],#saveBtn').forEach(b => b.onclick = saveToServer);

  // Logout
  document.getElementById('logoutBtn').onclick = logout;
  document.getElementById('reloadBtn').onclick = async () => {
    if (state.dirty && !confirm('لديك تغييرات غير محفوظة. إعادة التحميل ستفقدها. متأكد؟')) return;
    await loadContent();
    toast('تم التحديث', 'info');
  };

  // Modal
  document.getElementById('modalClose').onclick = closeModal;
  document.getElementById('modalCancel').onclick = closeModal;
  document.getElementById('itemModal').onclick = (e) => { if (e.target.id === 'itemModal') closeModal(); };

  // Mobile sidebar
  document.getElementById('mobileToggle').onclick = () => document.getElementById('sidebar').classList.toggle('open');

  // Warn on unload
  window.addEventListener('beforeunload', (e) => {
    if (state.dirty){ e.preventDefault(); e.returnValue = ''; }
  });

  // Ctrl/Cmd+S
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's'){ e.preventDefault(); saveToServer(); }
  });
}

/* ---------- Helpers ---------- */
function randId(){ return Math.random().toString(36).slice(2, 10); }
function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c])); }
function escapeAttr(s){ return String(s||'').replace(/"/g, '&quot;'); }

document.addEventListener('DOMContentLoaded', init);
