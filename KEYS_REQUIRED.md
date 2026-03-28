# 🔑 ELITOS - Required API Keys & Configuration

## 🌐 Live URL: https://elitos.ragspro.com

## ⚡ Quick Setup (5 Minutes)

### Step 1: Restore Supabase Database
1. Go to https://supabase.com/dashboard
2. Select your project (ragspro's Project)
3. If paused, click **"Restore project"**
4. Wait 2-3 minutes

### Step 2: Get Razorpay LIVE Keys
1. Go to https://dashboard.razorpay.com
2. Navigate to **Settings → API Keys**
3. Generate **LIVE** keys (not test!)
4. Copy Key ID and Secret

### Step 3: Configure Razorpay Webhook
1. Go to **Razorpay Dashboard → Webhooks**
2. Click **"Add New Webhook"**
3. URL: `https://api.elitos.ragspro.com/api/payment/webhook` (or your backend URL)
4. Select events:
   - `payment.captured`
   - `payment.failed`
   - `refund.processed`
5. Copy the **Webhook Secret**

### Step 4: Enable Google Login (Optional)
1. Go to https://supabase.com/dashboard
2. Select your project → **Settings → API**
3. Copy the **anon public** key
4. Go to **Authentication → Providers → Google**
5. Enable Google and add your Google OAuth credentials
6. Add the anon key to your frontend `.env`

---

## 📝 Update backend/.env

Open `backend/.env` and update these values:

```env
# ============================================
# RAZORPAY (REQUIRED FOR PAYMENTS)
# ============================================
RAZORPAY_KEY_ID="rzp_live_YOUR_KEY_ID"
RAZORPAY_KEY_SECRET="YOUR_SECRET_KEY"
RAZORPAY_WEBHOOK_SECRET="YOUR_WEBHOOK_SECRET"

# ============================================
# FRONTEND URL (Update for production)
# ============================================
FRONTEND_URL="https://elitos.ragspro.com"
```

---

## 📝 Update Frontend .env (for Google Login)

Create `.env` file in root folder:

```env
VITE_API_URL=http://localhost:4000/api
VITE_SUPABASE_URL=https://whsjvigxahblmlvleiut.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-from-supabase
```

**To get Supabase Anon Key:**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **Settings → API**
4. Copy the **anon public** key (starts with `eyJ...`)

---

## ✅ Already Configured

These are already set up in your `.env`:

| Service | Status | Details |
|---------|--------|---------|
| Database | ✅ Ready | Supabase PostgreSQL (restore if paused) |
| JWT Secret | ✅ Secure | Strong random secret generated |
| Gmail SMTP | ✅ Ready | elitos.contact@gmail.com |
| Cloudinary | ✅ Ready | Image uploads configured |
| Admin WhatsApp | ✅ Ready | 919811736143 |

---

## 🚀 After Adding Keys

1. **Restart Backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Test Health Check:**
   ```bash
   curl http://localhost:4000/health
   ```
   
   Should show:
   ```json
   {
     "database": "connected",
     "razorpay": "configured",
     "email": "configured"
   }
   ```

3. **Test Login:**
   - Email: `admin@elitos.com`
   - Password: `admin123`

---

## 🔒 Security Checklist

- [x] Strong JWT secret (auto-generated)
- [x] Rate limiting enabled
- [x] Password hashing (bcrypt)
- [x] Admin routes protected
- [ ] Razorpay webhook secret (YOU ADD)
- [ ] HTTPS in production (Vercel handles)

---

## 📞 Support

If you face any issues:
- WhatsApp: +91 98117 36143
- Email: elitos.contact@gmail.com
