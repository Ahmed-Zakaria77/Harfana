# حرفنة | Harfana

لعبة كلمات عربية جماعية مبنية بـ Vue 3 وFirebase. الواجهة بالكامل RTL وباللهجة المصرية.

## التشغيل المحلي

```bash
npm install
cp .env.example .env.local
npm run dev
```

المشروع يحتوي الآن على واجهة Vue كاملة وربط Firebase حقيقي: دخول مجهول، إنشاء ودخول القعدات، لوبي لحظي، جولات بموعد من السيرفر، حفظ آمن للإجابات، تصحيح الأدمن، ونتائج لحظية. لا يوجد multiplayer وهمي.

## نظام التصحيح المعتمد

- الأدمن وحده يراجع الإجابات ويختار 0 أو 5 أو 10 نقط.
- التطبيع العربي واكتشاف الإجابات المتكررة ينتجان **اقتراحاً فقط**، ولا يعتمدان النتيجة.
- لا يوجد تصويت لاعبين أو اعتراضات أو قرار بالأغلبية.
- أثناء التصحيح يرى اللاعبون شاشة انتظار للقراءة فقط.
- في Firebase ستتم عملية اعتماد الجولة عبر callable Cloud Function تتحقق من UID الأدمن، وحالة الجولة، وعدم اعتمادها سابقاً. العملية تحسب إجماليات الجولة وتحدّث الترتيب داخل transaction واحدة.
- قواعد Firestore تمنع كل client writes على حقول `approvedScore` و`roundTotal` و`totalScore`، وتمنع تعديل إجابات مقفولة. النتيجة المعتمدة immutable، والأدمن وحده يبدأ الجولة التالية.

## إعداد Firebase المطلوب

1. أنشئ مشروع Firebase وفعّل **Anonymous Authentication**.
2. أنشئ Cloud Firestore في وضع Production، ولا تستخدم test mode.
3. من Project settings > Your apps أنشئ Web App وانسخ القيم الست إلى `.env.local` باستخدام أسماء المتغيرات الموجودة في `.env.example`.
4. شغّل `firebase login` ثم `firebase use --add` لاختيار المشروع. أو انسخ `.firebaserc.example` إلى `.firebaserc` واستبدل Project ID.
5. أضف نطاق الإنتاج وقيمة `PROJECT_ID.web.app` إلى Authentication > Settings > Authorized domains.
6. رقِّ المشروع إلى Blaze قبل نشر Cloud Functions. الاستضافة وحدها لا تحتاج Admin SDK credentials، ولا يجب تنزيل أو حفظ service-account key.

الدوال في `functions/index.js` هي المسؤولة عن بدء الجولة، الموعد النهائي، قفلها، اعتماد النقاط، وتحديث الترتيب داخل transactions. GitHub Pages يستضيف الواجهة فقط؛ يجب نشر Functions وFirestore Rules إلى Firebase حتى لو كانت الواجهة على Pages.

## المحاكيات

```bash
npm install
npm --prefix functions install
cp .env.example .env.local
# ضع Project ID تجريبي وقيم Web App، ثم:
npm run emulators
```

لربط الواجهة بالمحاكيات اجعل `VITE_USE_FIREBASE_EMULATORS=true`. لا تستخدم هذا المتغير في production.

## أوامر التحقق

```bash
npm run build
npm run test
npm run test:rules
```

`test:rules` يشغّل Firestore Emulator ثم يختبر إخفاء الإجابات، ملكية اللاعب، ومنع تعديل النقاط والجولات من العميل.

## النشر

```bash
npm run build
firebase deploy --only firestore:rules,firestore:indexes,functions
firebase deploy --only hosting
```

عند النشر على GitHub Pages، اضبط `VITE_BASE_PATH` على مسار المستودع (مثلاً `/harfana/`) وأضف نطاق Pages إلى Firebase Authorized Domains.
