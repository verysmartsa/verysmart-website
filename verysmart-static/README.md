# Very Smart — Static Landing Page

موقع هبوط فاخر ثنائي اللغة (عربي/إنجليزي) لشركة Very Smart.
ملفات HTML/CSS/JS ثابتة — بدون أي build خطوات، ترفعه مباشرة.

## بنية المجلد
```
verysmart-static/
├── index.html         ← الصفحة الرئيسية
├── style.css          ← كل التنسيقات
├── app.js             ← اللغة + الفورم + التأثيرات
├── assets/
│   ├── logo.svg       ← اللوقو (استبدله بـ PNG/SVG الأصلي)
│   ├── favicon.svg
│   ├── hero-bg.svg
│   └── tablet.svg
├── _headers           ← أمان وكاش لـ Cloudflare Pages
├── _redirects         ← SPA fallback
├── robots.txt
└── sitemap.xml
```

## التشغيل محلياً (للمعاينة)
افتح الملف مباشرة بالمتصفح، أو شغّل سيرفر بسيط:
```bash
# Python
python3 -m http.server 8080
# Node
npx serve .
```

## النشر على Cloudflare Pages

### الطريقة 1 — Drag & Drop (الأسرع)
1. ادخل على https://dash.cloudflare.com → Workers & Pages → Create → Pages
2. اختر **Upload assets**
3. ادخل اسم المشروع: `verysmart`
4. اسحب مجلد `verysmart-static` كاملاً
5. Deploy → خلاص. الموقع شغّال.

### الطريقة 2 — عبر Git
1. ارفع المجلد على GitHub
2. Cloudflare → Pages → Connect to Git
3. **Build command:** اتركه فاضي
4. **Build output directory:** `/` (نفس المجلد)
5. Deploy

### ربط الدومين verysmart.sa
بعد النشر:
1. في صفحة المشروع → Custom domains → Set up a custom domain
2. اكتب `verysmart.sa` و `www.verysmart.sa`
3. حدّث DNS عند مزود الدومين بالقيم اللي يعطيك إياها Cloudflare

## التخصيص

### تغيير بيانات التواصل
كل البيانات في **مكان واحد** في `app.js` أعلى الملف:
```js
const BRAND = {
  phone: '+966570914700',
  whatsapp: '966570914700',
  email: 'info@verysmart.sa',
  instagram: 'verysmart.sa',
  tiktok: 'verysmart.sa',
  // ...
};
```
وكذلك في `index.html` ابحث عن:
- `+966570914700` لاستبدال الرقم
- `info@verysmart.sa` لاستبدال الإيميل
- `verysmart.sa` لاستبدال الدومين/السوشيال

### تغيير اللوقو
استبدل `assets/logo.svg` بملفك الأصلي (PNG شفاف أو SVG).

### تغيير الألوان
في `style.css` أعلى الملف:
```css
:root{
  --blue:#1B5FBF;
  --orange:#E8842B;
  --navy:#0E1F3D;
}
```

### إضافة منتجات
في `index.html` ابحث عن `<!-- ============= PRODUCTS =============`
انسخ بطاقة `.p-card` واملأ بيانات المنتج الجديد.

## الميزات
- ثنائي اللغة عربي/إنجليزي مع RTL/LTR تلقائي
- زر WhatsApp عائم + نموذج تواصل يرسل عبر واتساب
- زر "استفسر الآن" لكل منتج يفتح واتساب برسالة جاهزة
- متجاوب على الجوال والتابلت والديسكتوب
- SEO جاهز (Open Graph + Schema.org LocalBusiness)
- تحميل سريع — صفر مكتبات JS خارجية
- متوافق مع Cloudflare Pages + Netlify + Vercel + GitHub Pages
