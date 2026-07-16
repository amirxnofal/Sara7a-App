# Sara7a App 💬

منصة رسائل مجهولة الهوية (Anonymous Messaging Platform) — تقدر أي حد يبعت رسالة لمستخدم من غير ما يكشف هويته، مبنية بـ Node.js وExpress وMongoDB.

## المميزات

- **تسجيل دخول وتسجيل حساب** مع تفعيل البريد الإلكتروني عن طريق OTP
- **تسجيل دخول بجوجل (Google OAuth)** بجانب تسجيل الدخول العادي
- **JWT Authentication** مع نظام Refresh Token
- **إلغاء صلاحية التوكن (Token Revocation)** باستخدام Redis عند تسجيل الخروج
- **إدارة الملف الشخصي**: عرض، تعديل، رفع صورة شخصية، تفعيل/تعطيل/حذف الحساب
- **رسائل مجهولة الهوية**: إرسال رسالة (نص أو صورة) لأي مستخدم بدون تسجيل دخول
- **صندوق وارد مقسّم على صفحات (Paginated Inbox)** لعرض الرسائل المستلمة
- **حذف الرسائل**
- **تشفير كلمات المرور** باستخدام bcrypt

## التقنيات المستخدمة

| التقنية | الاستخدام |
|---|---|
| Node.js + Express 5 | السيرفر والـ API |
| MongoDB + Mongoose | قاعدة البيانات |
| Redis | تخزين وإلغاء التوكنات |
| JWT (jsonwebtoken) | المصادقة |
| bcrypt | تشفير كلمات المرور |
| Joi | التحقق من صحة المدخلات (Validation) |
| Multer | رفع الملفات (الصور) |
| Nodemailer | إرسال إيميلات الـ OTP |
| Google Auth Library | تسجيل الدخول بجوجل |
| CORS | التعامل مع الطلبات من مصادر مختلفة |

## هيكل المشروع

```
Sara7a_App/
├── config/
│   └── env.service.js          # إعدادات متغيرات البيئة
├── src/
│   ├── common/
│   │   ├── middleware/
│   │   │   ├── auth/           # التوكن والمصادقة
│   │   │   ├── security/       # التشفير
│   │   │   ├── validation/     # التحقق من المدخلات
│   │   │   └── multer.middleware.js
│   │   └── utils/
│   │       ├── Error/          # معالجة الأخطاء
│   │       ├── Responses/      # صيغة الردود الموحدة
│   │       └── sendEmail.utils.js
│   ├── database/
│   │   ├── models/              # نماذج MongoDB (User, Message)
│   │   ├── redis/                # اتصال وخدمات Redis
│   │   └── connection.js         # اتصال MongoDB
│   ├── modules/
│   │   ├── auth/                 # تسجيل الدخول والتسجيل
│   │   ├── users/                # إدارة المستخدمين
│   │   └── messages/              # الرسائل
│   ├── app.controller.js         # إعداد التطبيق والراوترز
│   └── main.js                    # نقطة تشغيل السيرفر
├── uploads/                       # الملفات المرفوعة
└── package.json
```

## متطلبات التشغيل

- Node.js (يدعم `--watch`، الإصدار 18 أو أحدث)
- MongoDB
- Redis
- حساب Gmail (لإرسال OTP عن طريق Nodemailer) — أو أي SMTP آخر
- Google Client ID (لو هتستخدم تسجيل الدخول بجوجل)

## التثبيت والتشغيل

1. **استنساخ المشروع**

```bash
git clone https://github.com/amirxnofal/Sara7a-App.git
cd Sara7a_App
```

2. **تثبيت الحزم**

```bash
npm install
```

3. **إعداد متغيرات البيئة**

أنشئ ملف `.env` داخل مجلد `config/` بالمتغيرات التالية:

```env
PORT=0000
MOOD=development

# Database
MONGOOSE_URL=mongodb://localhost:27017/sara7a_app

# Security
SALT_ROUNDS=0
SECRET_KEY=your_jwt_secret_key
REFRESH_SECRET_KEY=your_jwt_refresh_secret_key

# Server
SERVER_URI=http://localhost:0000

# Email (Nodemailer via Gmail)
GOOGLE_APP_EMAIL=your_email@gmail.com
GOOGLE_APP_PASSWORD=your_app_password

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id

# Redis
REDIS_URL=redis://localhost:0000
```

4. **تشغيل المشروع (وضع التطوير)**

```bash
npm run dev
```

السيرفر هيشتغل على `http://localhost:3000` (أو الـ PORT اللي حددته).

للتأكد إن السيرفر شغال:

```
GET /check-health
```

## نقاط الوصول (API Endpoints)

### Auth `/auth`

| Method | Endpoint | الوصف |
|---|---|---|
| POST | `/auth/register` | تسجيل حساب جديد |
| POST | `/auth/verify` | تفعيل الحساب عن طريق OTP |
| POST | `/auth/login` | تسجيل الدخول بالإيميل وكلمة المرور |
| POST | `/auth/google-login` | تسجيل الدخول بجوجل |
| GET | `/auth/token` | الحصول على access token جديد |
| POST | `/auth/logout` | تسجيل الخروج (يتطلب مصادقة) |

### Users `/users`

| Method | Endpoint | الوصف |
|---|---|---|
| GET | `/users/profile` | عرض الملف الشخصي (يتطلب مصادقة) |
| PUT | `/users/profile` | تعديل الملف الشخصي وصورة البروفايل (يتطلب مصادقة) |
| PUT | `/users/profile/active` | تفعيل الحساب (يتطلب مصادقة) |
| PUT | `/users/profile/inactive` | تعطيل الحساب (يتطلب مصادقة) |
| PUT | `/users/profile/delete` | حذف الحساب (يتطلب مصادقة) |

### Messages `/messages`

| Method | Endpoint | الوصف |
|---|---|---|
| POST | `/messages/:receiverId` | إرسال رسالة مجهولة (نص أو صورة) لمستخدم |
| GET | `/messages` | عرض صندوق الوارد (مقسّم على صفحات، يتطلب مصادقة) |
| GET | `/messages/:messageId` | عرض رسالة واحدة (يتطلب مصادقة) |
| DELETE | `/messages/:messageId` | حذف رسالة (يتطلب مصادقة) |

> 💡 مجموعة Postman جاهزة موجودة في المشروع (`Sara7a App.postman_collection.json`) لتجربة كل الـ endpoints مباشرة.

## المصادقة (Authentication)

الـ API بيستخدم **Bearer Token** في الـ header:

```
Authorization: Bearer <your_access_token>
```

التوكن بيتم التحقق منه، وبيتفحص كمان ضد قايمة التوكنات الملغية (Revoked) المخزنة في Redis، عشان يضمن إن أي توكن بعد تسجيل الخروج يبقى غير صالح فورًا.

## ملاحظات

- الرسائل بتقبل صورة اختيارية بجانب النص، وبيتم رفعها عن طريق Multer وتخزينها في مجلد `uploads/`.
- كلمات المرور بيتم تشفيرها بـ bcrypt قبل التخزين، ومفيش أي بيانات حساسة (زي الباسورد أو الـ OTP) بترجع في الردود بفضل `toJSON` transform على الـ User model.
- حالة المستخدم (`active` / `inactive` / `deleted`) بتتحكم في الوصول للحساب.

