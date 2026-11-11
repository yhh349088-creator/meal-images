# YAZOO DST AI — Production Deployment Guide

منصة **YAZOO DST AI** المتخصصة في تحويل الصور والتصاميم إلى ملفات تطريز Tajima DST باستخدام الذكاء الاصطناعي وخوارزميات المعالجة الرقمية.

النطاق المقترح: `yazoo-dst-ai.com`

---

## 🏗️ هيكلية المشروع (Architecture Overview)

- **Frontend (الواجهة الأمامية):** 
  - React 19 + TypeScript + Vite + Tailwind CSS v4.
  - جاهز للنشر على **Vercel** أو **Netlify**.
- **Backend (سيرفر المعالجة):** 
  - FastAPI + `stitch_engine.py`.
  - نقطة الاتصال الرئيسية: `POST /convert/image`.
  - جاهز للنشر على **Render** (ملف `render.yaml` مدمج).
- **Database & Storage (قاعدة البيانات والتخزين):** 
  - مشروع **Supabase** الحالي.
  - حماية كاملة عبر Row Level Security (RLS).
  - استخدام المفتاح العام (`VITE_SUPABASE_PUBLISHABLE_KEY`) فقط في الواجهة.

---

## 🔑 متغيرات البيئة (Environment Variables)

قم بضبط المتغيرات التالية في لوحة تحكم استضافة الواجهة (Vercel أو Netlify):

```env
# رابط النطاق الفعلي
APP_URL="https://yazoo-dst-ai.com"

# إعدادات Supabase الحالية
VITE_SUPABASE_URL="https://crtjhvwawoygqobsbjmw.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="sb_publishable_INW0Oln4M-1yH89Zs69gaQ_UpYfmgmJ"

# رابط سيرفر الخلفية على Render (بدون شرطة مائلة في النهاية)
VITE_API_BASE_URL="https://yazoo-dst-ai-backend.onrender.com"
```

> **ملاحظة أمنية هامة:** لا تضع `Service Role Key` أو `GEMINI_API_KEY` داخل متغيرات الـ Frontend. تظل هذه المفاتيح في سيرفر Backend على Render فقط.

---

## 🚀 خطوات الرفع إلى GitHub (Step-by-Step GitHub Setup)

1. افتح الطرفية (Terminal) في مجلد المشروع بعد فك الضغط.
2. أنشئ مستودعاً جديداً (New Repository) على حسابك في GitHub باسم: `yazoo-dst-ai`.
3. نفذ الأوامر التالية بالترتيب:

```bash
# 1. تهيئة مستودع Git محلي
git init

# 2. إضافة جميع الملفات
git add .

# 3. حفظ أول Commit للنشر
git commit -m "feat: production release for YAZOO DST AI"

# 4. تغيير اسم الفرع الرئيسي إلى main
git branch -M main

# 5. ربط المستودع بحسابك على GitHub (استبدل YOUR-USERNAME باسم حسابك)
git remote add origin https://github.com/YOUR-USERNAME/yazoo-dst-ai.git

# 6. رفع الكود إلى GitHub
git push -u origin main
```

---

## 🌐 نشر الواجهة الأمامية على Vercel أو Netlify

### الخيار 1: النشر على Vercel (موصى به)
1. سجل الدخول إلى [vercel.com](https://vercel.com).
2. اضغط على **"Add New Project"** واختر مستودع `yazoo-dst-ai` من GitHub.
3. يتعرف Vercel تلقائياً على Vite.
4. في قسم **"Environment Variables"**، أضف المتغيرات المذكورة أعلاه (`VITE_SUPABASE_URL`، `VITE_SUPABASE_PUBLISHABLE_KEY`، `VITE_API_BASE_URL`).
5. اضغط **Deploy**. سيعتمد Vercel إعدادات `vercel.json` المرفقة للتوجيه والحماية.

### الخيار 2: النشر على Netlify
1. سجل الدخول إلى [netlify.com](https://netlify.com).
2. اختر **"Import from Git"** واختر المستودع.
3. ملف `netlify.toml` المرفق مجهز تلقائياً بأوامر البناء والتوجيه (`/* -> /index.html`).
4. أضف متغيرات البيئة واضغط **Deploy Site**.

---

## ⚙️ نشر سيرفر الخلفية على Render (YAZOO-DST-AI Backend)

1. سجل الدخول إلى [render.com](https://render.com).
2. اختر **"New +" -> "Web Service"** أو **"Blueprint"** مستخدماً ملف `render.yaml` المرفق.
3. في حال الإنشاء اليدوي:
   - **Environment:** Python
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. تأكد أن تطبيق FastAPI يستقبل الطلبات على المسار:
   - `POST /convert/image`
   - يستقبل حقول: `file` أو `image`، و `width_mm`، `height_mm`، `stitch_density`، `fabric`، `pull_comp_mm`، `primary_stitch`.
   - يمكنه إرجاع كائن JSON يحتوي على `dst_download_url` أو إرجاع ملف الـ DST الثنائي مباشرة (`application/octet-stream`).
5. بعد نجاح النشر على Render، انسخ رابط السيرفر (مثال: `https://yazoo-dst-ai-backend.onrender.com`) وضعه في متغير `VITE_API_BASE_URL` في إعدادات الواجهة.

---

## 🔗 ربط النطاق المخصص (Custom Domain Setup)

عند حجز نطاق `yazoo-dst-ai.com`:
1. في لوحة تحكم Vercel أو Netlify، توجه إلى **Domains**.
2. أضف `yazoo-dst-ai.com` و `www.yazoo-dst-ai.com`.
3. اضبط سجلات الـ DNS في مزود النطاق الخاص بك (Namecheap, GoDaddy, Cloudflare):
   - سجل **CNAME** لـ `www` يوجه إلى `cname.vercel-dns.com` (أو مسار Netlify المعطى).
   - سجل **A** للنطاق الرئيسي `@` حسب تعليمات مزود الاستضافة.
