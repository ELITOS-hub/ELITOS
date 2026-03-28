# 🚀 ELITOS E-Commerce - Complete Setup Guide

## 📋 Required Keys & Accounts

Before going live, you need to set up the following services and get their API keys:

---

## 1️⃣ SUPABASE (Database) - FREE

### Steps:
1. Go to [supabase.com](https://supabase.com) and create account
2. Click "New Project"
3. Choose organization, enter project name: `elitos-db`
4. Set a strong database password (SAVE THIS!)
5. Select region: `ap-south-1` (Mumbai) for India
6. Wait for project to be created (~2 minutes)

### Get Connection Strings:
1. Go to **Project Settings** → **Database**
2. Scroll to **Connection String**
3. Copy **Transaction** mode URL → This is `DATABASE_URL`
4. Copy **Session** mode URL → This is `DIRECT_URL`
5. Replace `[YOUR-PASSWORD]` with your database password

### Example:
```
DATABASE_URL="postgresql://postgres.abcdefgh:YourPassword@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.abcdefgh:YourPassword@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"
```

---

## 2️⃣ RAZORPAY (Payments) - FREE to Start

### Steps:
1. Go to [razorpay.com](https://razorpay.com) and sign up
2. Complete KYC verification (takes 1-2 days)
3. Go to **Settings** → **API Keys**
4. Generate API Keys

### Get Keys:
- **Key ID**: `rzp_live_xxxxxxxxxxxxx` (starts with `rzp_live_` for production)
- **Key Secret**: Your secret key (keep this safe!)

### Setup Webhook:
1. Go to **Settings** → **Webhooks**
2. Click "Add New Webhook"
3. URL: `https://your-backend-url.com/api/payment/webhook`
4. Select events:
   - `payment.captured`
   - `payment.failed`
   - `refund.created`
   - `refund.processed`
5. Copy the **Webhook Secret**

### Keys Needed:
```
RAZORPAY_KEY_ID="rzp_live_xxxxxxxxxxxxx"
RAZORPAY_KEY_SECRET="your-secret-key"
RAZORPAY_WEBHOOK_SECRET="your-webhook-secret"
```

---

## 3️⃣ GMAIL SMTP (Emails) - FREE

### Steps:
1. Use your Gmail account (elitos.contact@gmail.com)
2. Enable 2-Factor Authentication on Gmail
3. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
4. Select app: "Mail"
5. Select device: "Other" → Enter "ELITOS Backend"
6. Click "Generate"
7. Copy the 16-character password (format: xxxx xxxx xxxx xxxx)

### Keys Needed:
```
GMAIL_USER="elitos.contact@gmail.com"
GMAIL_APP_PASSWORD="xxxx xxxx xxxx xxxx"
EMAIL_FROM="ELITOS <elitos.contact@gmail.com>"
```

---

## 4️⃣ CLOUDINARY (Image Storage) - FREE Tier

### Steps:
1. Go to [cloudinary.com](https://cloudinary.com) and sign up
2. Go to Dashboard
3. Copy your credentials

### Keys Needed:
```
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

---

## 5️⃣ GOOGLE ANALYTICS (Optional) - FREE

### Steps:
1. Go to [analytics.google.com](https://analytics.google.com)
2. Create new property for elitos.in
3. Go to **Admin** → **Data Streams** → **Web**
4. Copy Measurement ID

### Key Needed:
```
VITE_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```

---

## 6️⃣ META PIXEL (Optional) - FREE

### Steps:
1. Go to [business.facebook.com/events_manager](https://business.facebook.com/events_manager)
2. Create new Pixel
3. Copy Pixel ID

### Key Needed:
```
VITE_META_PIXEL_ID="XXXXXXXXXXXXXXX"
```

---

## 📁 Environment Files Setup

### Backend (`backend/.env`):
```env
# Database
DATABASE_URL="postgresql://postgres.xxxxx:PASSWORD@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xxxxx:PASSWORD@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"

# JWT
JWT_SECRET="generate-a-random-32-character-string-here"

# Razorpay
RAZORPAY_KEY_ID="rzp_live_xxxxxxxxxxxxx"
RAZORPAY_KEY_SECRET="your-secret"
RAZORPAY_WEBHOOK_SECRET="your-webhook-secret"

# Email
GMAIL_USER="elitos.contact@gmail.com"
GMAIL_APP_PASSWORD="xxxx xxxx xxxx xxxx"
EMAIL_FROM="ELITOS <elitos.contact@gmail.com>"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Admin
ADMIN_WHATSAPP="919811736143"
ADMIN_EMAIL="elitos.contact@gmail.com"

# Server
PORT=4000
NODE_ENV=production
FRONTEND_URL="https://elitos.in"
```

### Frontend (`.env`):
```env
VITE_API_URL="https://your-backend.vercel.app/api"
VITE_RAZORPAY_KEY="rzp_live_xxxxxxxxxxxxx"
VITE_SITE_URL="https://elitos.in"
VITE_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
VITE_META_PIXEL_ID="XXXXXXXXXXXXXXX"
```

---

## 🛠️ Setup Commands

### 1. Install Dependencies
```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

### 2. Setup Database
```bash
cd backend

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed initial data (products, admin user)
npm run db:seed
```

### 3. Run Locally
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

### 4. Test Everything
- Open http://localhost:3000
- Try adding products to cart
- Test checkout flow
- Login as admin: admin@elitos.com / admin123
- Check admin dashboard

---

## 🚀 Deployment

### Backend (Vercel/Railway):
1. Push code to GitHub
2. Connect to Vercel/Railway
3. Add all environment variables
4. Deploy

### Frontend (Vercel):
1. Push code to GitHub
2. Connect to Vercel
3. Set Framework Preset: **Vite**
4. Add environment variables
5. Deploy

### Post-Deployment:
1. Update `FRONTEND_URL` in backend to your frontend URL
2. Update `VITE_API_URL` in frontend to your backend URL
3. Add webhook URL to Razorpay dashboard
4. Test a real payment (use ₹1 test)

---

## ✅ Checklist Before Going Live

- [ ] Supabase database connected
- [ ] Prisma migrations applied
- [ ] Admin user created (seed)
- [ ] Products added
- [ ] Razorpay LIVE keys added (not test)
- [ ] Razorpay webhook configured
- [ ] Gmail SMTP working
- [ ] Test order placed successfully
- [ ] Test payment completed
- [ ] Order confirmation email received
- [ ] Admin notification received
- [ ] SSL certificate active (https)

---

## 🆘 Troubleshooting

### Database Connection Error
- Check DATABASE_URL format
- Ensure password has no special characters that need encoding
- Try DIRECT_URL for migrations

### Payment Not Working
- Ensure using LIVE keys (not test)
- Check webhook URL is correct
- Verify webhook secret matches

### Emails Not Sending
- Check Gmail App Password (not regular password)
- Ensure 2FA is enabled on Gmail
- Check spam folder

### Images Not Uploading
- Verify Cloudinary credentials
- Check upload preset settings

---

## 📞 Support

- WhatsApp: +91 98117 36143
- Email: elitos.contact@gmail.com

---

**Made with ❤️ for ELITOS**
