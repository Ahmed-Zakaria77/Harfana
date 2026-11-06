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
- اعتماد الجولة يتم في Firestore transaction من Web SDK وتتحقق منه Security Rules: UID الأدمن، حالة الجولة، كل اللاعبين والتصنيفات، والقيم 0/5/10.
- مستند نتيجة الجولة يُنشأ مرة واحدة ولا يقبل update أو delete. الترتيب التراكمي مشتق للعرض من نتائج الجولات غير القابلة للتعديل، ولا يوجد حقل إجمالي قابل للكتابة.

## إعداد Firebase المطلوب

1. أنشئ مشروع Firebase وفعّل **Anonymous Authentication**.
2. أنشئ Cloud Firestore في وضع Production، ولا تستخدم test mode.
3. من Project settings > Your apps أنشئ Web App وانسخ القيم الست إلى `.env.local` باستخدام أسماء المتغيرات الموجودة في `.env.example`.
4. شغّل `firebase login` ثم `firebase use --add` لاختيار المشروع. أو انسخ `.firebaserc.example` إلى `.firebaserc` واستبدل Project ID.
5. أضف نطاق الإنتاج وقيمة `PROJECT_ID.web.app` إلى Authentication > Settings > Authorized domains.
6. الخطة المجانية Spark كافية لهذا التصميم؛ لا توجد Cloud Functions ولا service-account keys.

بدء الجولة، القفل، حرفنة، والاعتماد تستخدم Firestore transactions من العميل، وتفرض القواعد الانتقالات الذرية عبر `getAfter()` و`request.time`. يجب نشر Firestore Rules حتى عند استضافة الواجهة على GitHub Pages.

حدود Spark المهمة: لا يوجد scheduler داخل Firestore. لو انتهى الوقت وكل الأجهزة غير متصلة، تظل الكتابة ممنوعة بعد `deadline` فوراً بالقواعد، وتنتقل الحالة إلى التصحيح عند أول عميل متصل يحاول القفل. اختيار الحرف العشوائي يتم في واجهة الأدمن؛ القواعد تمنع حرفاً غير صالح أو مكرراً لكن لا تستطيع إثبات العشوائية بدون backend موثوق.

## المحاكيات

```bash
npm install
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
firebase deploy --only firestore:rules,firestore:indexes
firebase deploy --only hosting
```

عند النشر على GitHub Pages، اضبط `VITE_BASE_PATH` على مسار المستودع (مثلاً `/harfana/`) وأضف نطاق Pages إلى Firebase Authorized Domains.
