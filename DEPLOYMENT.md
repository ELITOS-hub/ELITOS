# ELITOS Deployment Guide

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Razorpay account (for payments)
- Cloudinary account (for image uploads)

## Local Development

### 1. Frontend Setup
```bash
npm install
cp .env.example .env
npm run dev
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

## Production Deployment

### Backend Deployment

#### Database Setup (PostgreSQL)
Use a managed PostgreSQL service:
- Railway.app (recommended)
- Supabase
- Neon
- AWS RDS

#### Environment Variables
```env
DATABASE_URL="postgresql://user:pass@host:5432/elitos_db"
JWT_SECRET="generate-strong-secret-key-32-chars"
RAZORPAY_KEY_ID="rzp_live_xxx"
RAZORPAY_KEY_SECRET="live-secret"
CLOUDINARY_CLOUD_NAME="your-cloud"
CLOUDINARY_API_KEY="your-key"
CLOUDINARY_API_SECRET="your-secret"
PORT=4000
NODE_ENV=production
FRONTEND_URL="https://elitos.in"
```

#### Deploy Options
- Railway.app (recommended - auto-deploy from GitHub)
- Render.com
- Heroku
- AWS EC2/ECS
- DigitalOcean App Platform

```bash
cd backend
npm run build
npm start
```

### Frontend Deployment

#### Environment Variables
```env
VITE_API_URL=https://api.elitos.in/api
VITE_RAZORPAY_KEY=rzp_live_xxx
VITE_SITE_URL=https://elitos.in
```

#### Build & Deploy
```bash
npm run build
```

Deploy `dist/` folder to:
- Vercel (recommended)
- Netlify
- Cloudflare Pages
- AWS S3 + CloudFront

### Vercel Deployment (Frontend)
1. Connect GitHub repository
2. Set environment variables
3. Deploy with default Vite settings

### Railway Deployment (Backend)
1. Connect GitHub repository
2. Add PostgreSQL database
3. Set environment variables
4. Deploy

## Security Checklist

- [ ] Use HTTPS everywhere
- [ ] Set strong JWT_SECRET (32+ characters)
- [ ] Enable CORS only for your domain
- [ ] Use Razorpay live keys in production
- [ ] Enable database SSL
- [ ] Configure CSP headers
- [ ] Set up rate limiting

## Post-Deployment

1. Run database migrations: `npm run db:push`
2. Seed initial data: `npm run db:seed`
3. Test all payment flows with real cards
4. Verify WhatsApp notifications work
5. Test admin dashboard functionality
6. Submit sitemap to Google Search Console

## Default Admin Credentials
After seeding:
- Email: admin@elitos.com
- Password: admin123

**Change this immediately in production!**

## Monitoring

- Set up uptime monitoring (UptimeRobot)
- Configure error tracking (Sentry)
- Set up analytics (Google Analytics)
- Monitor database performance

## Support

For issues, contact the development team or check the backend README for API documentation.
