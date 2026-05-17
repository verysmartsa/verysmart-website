/* ============================================================
   Very Smart — app.js
   - Bilingual toggle (AR/EN) with RTL/LTR
   - Mobile menu
   - Reveal on scroll
   - Lead form → WhatsApp
   - Product "Inquire" buttons → WhatsApp
============================================================ */

/* ---------- BRAND CONFIG (single source of truth) ---------- */
const BRAND = {
  name: 'Very Smart',
  phone: '+966570914700',
  phoneIntl: '+966 57 091 4700',
  whatsapp: '966570914700',
  email: 'info@verysmart.sa',
  domain: 'verysmart.sa',
  instagram: 'verysmart.sa',
  tiktok: 'verysmart.sa',
  city: { ar: 'الرياض، المملكة العربية السعودية', en: 'Riyadh, Saudi Arabia' },
};

/* ---------- Translations ---------- */
const I18N = {
  ar: {
    'topbar.hours':'السبت – الخميس · 9 ص – 10 م',
    'nav.home':'الرئيسية','nav.about':'من نحن','nav.services':'خدماتنا',
    'nav.products':'المنتجات','nav.projects':'مشاريعنا','nav.why':'لماذا نحن',
    'nav.contact':'تواصل معنا','nav.cta':'احصل على عرض',

    'hero.eyebrow':'الرائد في أنظمة المنزل الذكي بالمملكة',
    'hero.title1':'منزلك الذكي','hero.title2':'يستحق الأفضل',
    'hero.desc':'في Very Smart، نحوّل منزلك إلى تحفة تقنية فاخرة — إضاءة، صوتيات، أمن، وتحكم كامل بلمسة واحدة أو بصوتك. أنظمة عالمية، تنفيذ محترف، تجربة لا تُنسى.',
    'hero.cta1':'احجز استشارة مجانية','hero.cta2':'تعرف على باقاتنا',

    'stats.clients':'عميل سعيد','stats.projects':'مشروع مكتمل',
    'stats.years':'سنوات خبرة','stats.support':'دعم فني',

    'services.tag':'خدماتنا','services.title':'حلول ذكية لمستقبل أفضل',
    'services.sub':'نقدم حلول متكاملة تجمع بين الجودة والتقنية لتناسب احتياجاتك وتجعل حياتك أكثر راحة وأماناً.',
    'services.s1.t':'أنظمة الأمن والمراقبة','services.s1.d':'كاميرات مراقبة، أنظمة إنذار، تحكم بالدخول والخروج وحماية متكاملة.',
    'services.s2.t':'التحكم بالإضاءة','services.s2.d':'إضاءة ذكية قابلة للتحكم عن بعد وتوفير الطاقة والمشاهد المخصصة.',
    'services.s3.t':'أنظمة الصوت','services.s3.d':'تجربة صوتية محيطية عالية الجودة في جميع أنحاء المنزل.',
    'services.s4.t':'التحكم المركزي','services.s4.d':'تحكم بجميع أجهزة المنزل الذكي من تطبيق واحد وبسهولة تامة.',
    'services.s5.t':'التحكم بالمناخ','services.s5.d':'تحكم ذكي بالتكييف والتدفئة لراحة مثالية وتوفير في الطاقة.',
    'services.s6.t':'حلول مخصصة','services.s6.d':'نصمم حلول ذكية مخصصة تناسب احتياجاتك ونمط حياتك.',

    'about.tag':'من نحن','about.title':'نحوّل البيوت إلى تجارب ذكية',
    'about.p1':'Very Smart شركة سعودية متخصصة في مقاولات الكهرباء وتصميم وتنفيذ أنظمة المنزل الذكي الفاخرة. نوفّر حلولاً متكاملة من الإضاءة الذكية إلى أنظمة الصوت والأمن والتحكم المركزي.',
    'about.p2':'فريقنا يضم مهندسين معتمدين على أحدث أنظمة KNX، Control4، Crestron — لنقدّم لك حلولاً موثوقة، أنيقة، وقابلة للتوسعة في أي وقت.',
    'about.b1':'تصميم مخصص لكل عميل','about.b2':'أنظمة عالمية معتمدة',
    'about.b3':'تنفيذ بأعلى معايير الجودة','about.b4':'دعم وصيانة طويلة المدى',
    'about.cta':'تواصل معنا الآن',

    'features.tag':'مميزات المنزل الذكي','features.title':'تحكم كامل بلمسة واحدة',
    'features.sub':'تقنيات عالمية تجعل حياتك أسهل، أأمن، وأكثر فخامة.',
    'f.1.t':'إضاءة ذكية','f.1.d':'سيناريوهات لانهائية بألوان ودرجات تناسب كل لحظة.',
    'f.2.t':'ستائر آلية','f.2.d':'فتح وإغلاق برمجي حسب الوقت أو الإضاءة الطبيعية.',
    'f.3.t':'تكييف ذكي','f.3.d':'تحكم بالحرارة في كل غرفة وتوفير في الفاتورة حتى 30%.',
    'f.4.t':'تحكم صوتي','f.4.d':'Alexa, Google, Siri — تحكم بكل شيء بصوتك.',
    'f.5.t':'كاميرات 4K','f.5.d':'مراقبة مباشرة من أي مكان مع تخزين سحابي آمن.',
    'f.6.t':'تطبيق موحّد','f.6.d':'كل أنظمة منزلك في تطبيق أنيق وسهل.',
    'f.7.t':'إنذار وأمن','f.7.d':'تنبيهات فورية وتكامل مع شركات الحراسة.',
    'f.8.t':'سيناريوهات ذكية','f.8.d':'"وضع النوم", "وضع الخروج", "وضع السينما" بضغطة.',

    'products.tag':'منتجاتنا','products.title':'منتجات أصلية بضمان شامل',
    'products.sub':'أحدث منتجات المنزل الذكي من أفضل العلامات العالمية. اضغط للاستفسار.',
    'p.cta':'استفسر الآن',
    'p.1.c':'شاشات تحكم','p.1.t':'شاشة تحكم مركزية','p.1.d':'شاشة لمس فاخرة لإدارة جميع أنظمة منزلك.',
    'p.2.c':'أمن ومراقبة','p.2.t':'كاميرا 4K ذكية','p.2.d':'رؤية ليلية، رصد حركة، وتخزين سحابي.',
    'p.3.c':'إضاءة','p.3.t':'مفتاح إضاءة ذكي','p.3.d':'تحكم باللمس والصوت بكل إضاءة في المنزل.',
    'p.4.c':'صوتيات','p.4.t':'مكبر صوت سقفي','p.4.d':'صوت Hi-Fi نقي يغمر كل غرفة بسلاسة.',
    'p.5.c':'مناخ','p.5.t':'منظّم حرارة ذكي','p.5.d':'يتعلم عاداتك ويوفّر حتى 30% من فاتورة الكهرباء.',
    'p.6.c':'أمن','p.6.t':'قفل ذكي للأبواب','p.6.d':'دخول ببصمة، رمز، أو من التطبيق عن بُعد.',
    'p.7.c':'ستائر','p.7.t':'موتور ستائر ذكي','p.7.d':'تحكم لاسلكي بكل ستائر منزلك بصمت تام.',
    'p.8.c':'حساسات','p.8.t':'حساسات الحركة والوجود','p.8.d':'أتمتة كاملة تتفاعل مع وجودك في كل غرفة.',

    'projects.tag':'مشاريعنا','projects.title':'فلل وقصور تحوّلت إلى تحف ذكية',
    'projects.sub':'نخبة من أحدث مشاريعنا في الرياض، جدة، والخبر.',
    'pr.1.t':'فيلا الياسمين','pr.1.loc':'الرياض — حي الياسمين','pr.1.tag':'فيلا فاخرة','pr.1.meta':'420م² · 14 غرفة',
    'pr.2.t':'قصر الواجهة','pr.2.loc':'جدة — الكورنيش','pr.2.tag':'قصر','pr.2.meta':'780م² · 22 غرفة',
    'pr.3.t':'شاليه السيف','pr.3.loc':'الخبر — نصف القمر','pr.3.tag':'شاليه','pr.3.meta':'300م² · 9 غرف',
    'pr.4.t':'مكتب الإدارة','pr.4.loc':'الرياض — العليا','pr.4.tag':'تجاري','pr.4.meta':'650م² · 3 طوابق',
    'pr.5.t':'استراحة النخيل','pr.5.loc':'الرياض — العمارية','pr.5.tag':'استراحة','pr.5.meta':'900م² · مسبح + مسرح',
    'pr.6.t':'فيلا الروابي','pr.6.loc':'الرياض — الروابي','pr.6.tag':'فيلا','pr.6.meta':'380م² · 12 غرفة',

    'why.tag':'لماذا نحن','why.title':'لماذا تختار Very Smart ؟','why.sub':'لأن منزلك يستحق ما هو أبعد من العادي.',
    'w.1.t':'جودة عالية','w.1.d':'نستخدم أفضل المنتجات وأحدث التقنيات العالمية المعتمدة.',
    'w.2.t':'فريق محترف','w.2.d':'مهندسون وفنيون بخبرة عالية لتنفيذ مشاريعك بدقة.',
    'w.3.t':'ضمان شامل','w.3.d':'ضمان على جميع أعمالنا ومنتجاتنا حتى 5 سنوات.',
    'w.4.t':'دعم مستمر','w.4.d':'دعم فني متواصل على مدار الساعة طوال الأسبوع.',

    'contact.tag':'تواصل معنا','contact.title':'جاهزون لتحويل منزلك',
    'contact.sub':'استشارة مجانية خلال 24 ساعة. أرسل لنا تفاصيلك وسنعاود الاتصال.',
    'contact.name':'الاسم الكامل','contact.phone':'رقم الجوال','contact.email':'البريد الإلكتروني',
    'contact.service':'نوع الخدمة','contact.msg':'تفاصيل المشروع','contact.send':'إرسال الطلب عبر واتساب',
    'contact.s1':'منزل ذكي متكامل','contact.s2':'إضاءة ذكية','contact.s3':'أنظمة أمن وكاميرات',
    'contact.s4':'صوتيات وسينما منزلية','contact.s5':'استشارة فقط',
    'contact.callUs':'اتصل بنا','contact.emailUs':'راسلنا','contact.visitUs':'موقعنا',
    'contact.addr':'الرياض، المملكة العربية السعودية',

    'footer.about':'شركة سعودية متخصصة في مقاولات الكهرباء وأنظمة المنزل الذكي الفاخرة.',
    'footer.links':'روابط سريعة','footer.services':'خدماتنا','footer.contact':'تواصل','footer.rights':'جميع الحقوق محفوظة',
  },

  en: {
    'topbar.hours':'Sat – Thu · 9 AM – 10 PM',
    'nav.home':'Home','nav.about':'About','nav.services':'Services',
    'nav.products':'Products','nav.projects':'Projects','nav.why':'Why Us',
    'nav.contact':'Contact','nav.cta':'Get a Quote',

    'hero.eyebrow':'Saudi Arabia’s Premier Smart Home Integrator',
    'hero.title1':'Your Smart Home','hero.title2':'Deserves The Best',
    'hero.desc':'At Very Smart, we transform your home into a luxury tech masterpiece — lighting, audio, security, and full control with a single touch or your voice. World-class systems. Flawless execution. An unforgettable experience.',
    'hero.cta1':'Book Free Consultation','hero.cta2':'Explore Our Packages',

    'stats.clients':'Happy Clients','stats.projects':'Projects Done',
    'stats.years':'Years Experience','stats.support':'Support',

    'services.tag':'Our Services','services.title':'Smart Solutions For A Better Future',
    'services.sub':'Integrated solutions combining quality and technology for your comfort, safety, and lifestyle.',
    'services.s1.t':'Security & Surveillance','services.s1.d':'HD cameras, alarms, access control, and full protection.',
    'services.s2.t':'Lighting Control','services.s2.d':'Remote-controlled smart lighting with energy savings and scenes.',
    'services.s3.t':'Audio Systems','services.s3.d':'High-quality surround audio throughout your home.',
    'services.s4.t':'Central Control','services.s4.d':'Control every smart device from one elegant app.',
    'services.s5.t':'Climate Control','services.s5.d':'Smart HVAC for ideal comfort and energy savings.',
    'services.s6.t':'Custom Solutions','services.s6.d':'Tailored smart solutions that fit your lifestyle.',

    'about.tag':'About Us','about.title':'We Turn Houses Into Smart Experiences',
    'about.p1':'Very Smart is a Saudi company specialized in electrical contracting and luxury smart home systems. From smart lighting to audio, security, and central control — fully integrated.',
    'about.p2':'Our certified engineers work with KNX, Control4, Crestron — delivering reliable, elegant, and future-proof solutions.',
    'about.b1':'Tailored design per client','about.b2':'Globally certified systems',
    'about.b3':'Top-tier execution','about.b4':'Long-term support & maintenance',
    'about.cta':'Contact Us Now',

    'features.tag':'Smart Home Features','features.title':'Total Control, One Touch',
    'features.sub':'World-class technology that makes life easier, safer, and more luxurious.',
    'f.1.t':'Smart Lighting','f.1.d':'Infinite scenes with custom colors and dimming.',
    'f.2.t':'Motorized Blinds','f.2.d':'Auto open/close by time or daylight.',
    'f.3.t':'Smart Climate','f.3.d':'Per-room temperature. Save up to 30% on bills.',
    'f.4.t':'Voice Control','f.4.d':'Alexa, Google, Siri — control everything by voice.',
    'f.5.t':'4K Cameras','f.5.d':'Live monitoring with secure cloud storage.',
    'f.6.t':'Unified App','f.6.d':'Every system in one elegant, easy app.',
    'f.7.t':'Alarm & Security','f.7.d':'Instant alerts and monitoring integrations.',
    'f.8.t':'Smart Scenes','f.8.d':'"Sleep", "Away", "Cinema" mode in one tap.',

    'products.tag':'Our Products','products.title':'Genuine Products with Full Warranty',
    'products.sub':'Latest smart home products from the world’s best brands. Tap to inquire.',
    'p.cta':'Inquire Now',
    'p.1.c':'Control Panels','p.1.t':'Central Touch Panel','p.1.d':'Luxury touchscreen to manage all your home systems.',
    'p.2.c':'Security','p.2.t':'4K Smart Camera','p.2.d':'Night vision, motion alerts, cloud storage.',
    'p.3.c':'Lighting','p.3.t':'Smart Light Switch','p.3.d':'Touch + voice control for every light in the house.',
    'p.4.c':'Audio','p.4.t':'In-Ceiling Speaker','p.4.d':'Pure Hi-Fi sound that fills every room seamlessly.',
    'p.5.c':'Climate','p.5.t':'Smart Thermostat','p.5.d':'Learns your habits. Saves up to 30% on electricity.',
    'p.6.c':'Security','p.6.t':'Smart Door Lock','p.6.d':'Fingerprint, code, or remote access via app.',
    'p.7.c':'Blinds','p.7.t':'Smart Blind Motor','p.7.d':'Wireless control of all blinds — completely silent.',
    'p.8.c':'Sensors','p.8.t':'Motion & Presence Sensors','p.8.d':'Full automation that reacts to your presence.',

    'projects.tag':'Our Projects','projects.title':'Villas & Palaces Transformed Into Smart Masterpieces',
    'projects.sub':'A selection of our latest projects in Riyadh, Jeddah, and Khobar.',
    'pr.1.t':'Yasmin Villa','pr.1.loc':'Riyadh — Al Yasmin','pr.1.tag':'Luxury Villa','pr.1.meta':'420m² · 14 rooms',
    'pr.2.t':'Corniche Palace','pr.2.loc':'Jeddah — Corniche','pr.2.tag':'Palace','pr.2.meta':'780m² · 22 rooms',
    'pr.3.t':'Saif Chalet','pr.3.loc':'Khobar — Half Moon','pr.3.tag':'Chalet','pr.3.meta':'300m² · 9 rooms',
    'pr.4.t':'Admin Office','pr.4.loc':'Riyadh — Olaya','pr.4.tag':'Commercial','pr.4.meta':'650m² · 3 floors',
    'pr.5.t':'Palms Retreat','pr.5.loc':'Riyadh — Ammariyah','pr.5.tag':'Resort','pr.5.meta':'900m² · pool + theater',
    'pr.6.t':'Rawabi Villa','pr.6.loc':'Riyadh — Al Rawabi','pr.6.tag':'Villa','pr.6.meta':'380m² · 12 rooms',

    'why.tag':'Why Us','why.title':'Why Choose Very Smart?','why.sub':'Because your home deserves beyond ordinary.',
    'w.1.t':'High Quality','w.1.d':'We use the best products and the latest certified technologies.',
    'w.2.t':'Pro Team','w.2.d':'Highly experienced engineers and technicians.',
    'w.3.t':'Full Warranty','w.3.d':'Up to 5-year warranty on all work and products.',
    'w.4.t':'Ongoing Support','w.4.d':'Round-the-clock technical support, all week.',

    'contact.tag':'Contact Us','contact.title':'Ready To Transform Your Home',
    'contact.sub':'Free consultation within 24 hours. Send your details and we’ll get back to you.',
    'contact.name':'Full Name','contact.phone':'Phone Number','contact.email':'Email Address',
    'contact.service':'Service Type','contact.msg':'Project Details','contact.send':'Send via WhatsApp',
    'contact.s1':'Full Smart Home','contact.s2':'Smart Lighting','contact.s3':'Security & Cameras',
    'contact.s4':'Audio & Home Cinema','contact.s5':'Consultation Only',
    'contact.callUs':'Call Us','contact.emailUs':'Email Us','contact.visitUs':'Our Location',
    'contact.addr':'Riyadh, Saudi Arabia',

    'footer.about':'A Saudi company specialized in electrical contracting and luxury smart home systems.',
    'footer.links':'Quick Links','footer.services':'Services','footer.contact':'Contact','footer.rights':'All Rights Reserved',
  }
};

/* ---------- Language switcher ---------- */
function applyLang(lang){
  const dict = I18N[lang];
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] != null) el.textContent = dict[key];
  });
  const tog = document.getElementById('langToggle');
  if (tog) tog.textContent = lang === 'ar' ? 'EN' : 'ع';
  try { localStorage.setItem('vs_lang', lang); } catch(e){}
}
function initLang(){
  let saved = 'ar';
  try { saved = localStorage.getItem('vs_lang') || 'ar'; } catch(e){}
  applyLang(saved);
  const tog = document.getElementById('langToggle');
  if (tog) tog.addEventListener('click', () => {
    const next = document.documentElement.lang === 'ar' ? 'en' : 'ar';
    applyLang(next);
  });
}

/* ---------- Mobile menu ---------- */
function initMenu(){
  const btn = document.getElementById('menuToggle');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => menu.classList.toggle('open'));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
}

/* ---------- Active nav link on scroll ---------- */
function initActiveLink(){
  const links = document.querySelectorAll('.nav-links a');
  const ids = Array.from(links).map(a => a.getAttribute('href').replace('#',''));
  const sections = ids.map(id => document.getElementById(id)).filter(Boolean);
  const setActive = (id) => {
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
  };
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
  }, { rootMargin: '-50% 0px -45% 0px' });
  sections.forEach(s => obs.observe(s));
}

/* ---------- Reveal on scroll ---------- */
function initReveal(){
  const els = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
}

/* ---------- Lead form → WhatsApp ---------- */
function initForm(){
  const form = document.getElementById('leadForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const lang = document.documentElement.lang;
    const labels = lang === 'ar'
      ? { head:'طلب جديد — Very Smart', name:'الاسم', phone:'الجوال', email:'البريد', service:'الخدمة', msg:'الرسالة' }
      : { head:'New Lead — Very Smart', name:'Name', phone:'Phone', email:'Email', service:'Service', msg:'Message' };
    const text =
      `*${labels.head}*\n\n` +
      `*${labels.name}:* ${fd.get('name') || '-'}\n` +
      `*${labels.phone}:* ${fd.get('phone') || '-'}\n` +
      `*${labels.email}:* ${fd.get('email') || '-'}\n` +
      `*${labels.service}:* ${fd.get('service') || '-'}\n` +
      `*${labels.msg}:* ${fd.get('message') || '-'}`;
    window.open(`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  });
}

/* ---------- Product inquire buttons ---------- */
function initProductButtons(){
  document.querySelectorAll('[data-wa-product]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const lang = document.documentElement.lang;
      const product = btn.getAttribute('data-wa-product');
      const text = lang === 'ar'
        ? `مرحباً، أرغب بالاستفسار عن: *${product}*`
        : `Hello, I'd like to inquire about: *${product}*`;
      window.open(`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
    });
  });
}

/* ---------- Year ---------- */
function initYear(){
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
}

/* ---------- Expose for CMS bridge ---------- */
window.BRAND = BRAND;
window.I18N = I18N;
window.applyLang = applyLang;

/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initLang();
  initMenu();
  initActiveLink();
  initReveal();
  initForm();
  initProductButtons();
  initYear();
});
