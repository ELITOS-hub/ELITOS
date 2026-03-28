# ELITOS Backend API

Production-ready Node.js/Express backend with PostgreSQL (Supabase) database.

## Features

- 🔐 JWT Authentication (Register, Login, Password Reset)
- 📦 Product Management (CRUD, Categories, Search, Filters)
- 🛒 Order Management (COD + Razorpay with Webhooks)
- 👥 Customer Management
- ⭐ Reviews & Ratings (Verified Purchase Badge)
- 📧 Email Notifications (Order confirmation, Status updates, Refunds)
- 📱 WhatsApp Notifications (Admin alerts, Customer updates)
- 🏢 Wholesale Applications with Approval Flow
- 📰 Newsletter Subscriptions
- 🖼️ Image Upload (Cloudinary)
- 📊 Admin Analytics Dashboard

## Tech Stack

- **Runtime:** Node.js + Express
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma
- **Auth:** JWT + bcrypt
- **Payments:** Razorpay (with Webhook support)
- **Storage:** Cloudinary
- **Email:** Nodemailer (Gmail/SMTP)

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Environment

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required variables:
- `DATABASE_URL` - Supabase PostgreSQL connection string
- `JWT_SECRET` - Random 32+ character string
- `RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET` - From Razorpay dashboard
- `RAZORPAY_WEBHOOK_SECRET` - For webhook verification (optional)
- `CLOUDINARY_*` - From Cloudinary console
- `SMTP_*` or `GMAIL_*` - For email notifications
- `ADMIN_WHATSAPP` - Admin phone number for notifications

### 3. Setup Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# (Optional) Seed with sample data
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Server runs at `http://localhost:4000`

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List products with filters (gender, category, subcategory, sizes, price range, tags, search)
- `GET /api/products/slug/:slug` - Get product by slug with reviews
- `GET /api/products/id/:id` - Get product by ID
- `GET /api/products/:slug/related` - Get related products
- `GET /api/products/meta/categories` - Get categories with counts

### Orders
- `GET /api/orders` - Get user orders (auth required)
- `GET /api/orders/:id` - Get single order (auth required)
- `GET /api/orders/track/:orderNumber` - Track order by number (public)
- `POST /api/orders` - Create order (supports guest checkout)
- `POST /api/orders/:id/cancel` - Cancel order

### Reviews
- `GET /api/reviews` - Get all reviews
- `GET /api/reviews/product/:productId` - Get product reviews with stats
- `GET /api/reviews/featured` - Get featured reviews (verified, 4+ stars)
- `POST /api/reviews` - Create review (auth required)
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### User
- `GET /api/users/profile` - Get profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/password` - Change password
- `GET /api/users/addresses` - Get addresses
- `POST /api/users/addresses` - Add address
- `PUT /api/users/addresses/:id` - Update address
- `DELETE /api/users/addresses/:id` - Delete address
- `GET /api/users/wishlist` - Get wishlist
- `POST /api/users/wishlist/:productId` - Add to wishlist
- `DELETE /api/users/wishlist/:productId` - Remove from wishlist

### Payment
- `GET /api/payment/key` - Get Razorpay public key
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify` - Verify payment signature
- `POST /api/payment/webhook` - Razorpay webhook handler

### Wholesale
- `POST /api/wholesale/apply` - Submit wholesale application
- `GET /api/wholesale/status/:email` - Check application status

### Newsletter
- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `POST /api/newsletter/unsubscribe` - Unsubscribe

### Admin (requires admin role)
- `GET /api/admin/stats` - Dashboard stats
- `GET /api/admin/analytics` - Detailed analytics (orders by day, top products, etc.)
- `GET /api/admin/products` - All products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Soft delete product
- `GET /api/admin/orders` - All orders with filters
- `PUT /api/admin/orders/:id/status` - Update order status + tracking
- `PUT /api/admin/orders/:id/payment` - Update payment status (refunds)
- `GET /api/admin/customers` - All customers
- `GET /api/admin/reviews` - All reviews with moderation
- `PUT /api/admin/reviews/:id/visibility` - Show/hide review
- `PUT /api/admin/reviews/:id/verify` - Verify/unverify review
- `DELETE /api/admin/reviews/:id` - Delete review
- `GET /api/admin/wholesale-applications` - Wholesale applications
- `PUT /api/admin/wholesale-applications/:id` - Approve/reject application
- `GET /api/admin/subscribers` - Newsletter subscribers

## Database Schema

See `prisma/schema.prisma` for full schema.

Key models:
- **User** - Customers, Wholesale, Admin
- **Product** - Products with variants
- **Order** - Orders with items
- **Review** - Product reviews
- **Address** - User addresses
- **Newsletter** - Email subscribers
- **WholesaleApplication** - B2B inquiries

## Deployment

### Supabase Setup

1. Create project at [supabase.com](https://supabase.com)
2. Go to Settings > Database > Connection string
3. Copy the URI and add to `DATABASE_URL`

### Deploy to Railway/Render

1. Connect GitHub repo
2. Set environment variables
3. Build command: `npm run build`
4. Start command: `npm start`

### Deploy to Vercel (Serverless)

Note: For Vercel, you may need to adapt to serverless functions.

## Notifications

### Email Setup (Gmail)

1. Enable 2FA on Google account
2. Generate App Password: Google Account > Security > App Passwords
3. Use in `GMAIL_APP_PASSWORD`

### WhatsApp Setup

Currently uses WhatsApp URL scheme. For production:
- Integrate WhatsApp Business API
- Or use Twilio WhatsApp API

## Support

Contact: elitos.contact@gmail.com
