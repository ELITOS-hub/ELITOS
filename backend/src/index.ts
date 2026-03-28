import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';

// Routes
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import paymentRoutes from './routes/payment';
import userRoutes from './routes/users';
import adminRoutes from './routes/admin';
import newsletterRoutes from './routes/newsletter';
import wholesaleRoutes from './routes/wholesale';
import uploadRoutes from './routes/upload';
import reviewRoutes from './routes/reviews';

dotenv.config();

const app = express();

// Prisma client with connection pooling for serverless
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

const PORT = process.env.PORT || 4000;

// Track database connection status
let dbConnected = false;

// Test database connection with retry
const testDbConnection = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      dbConnected = true;
      console.log('✅ Database connected');
      return;
    } catch (error) {
      console.log(`⚠️ Database connection attempt ${i + 1}/${retries} failed`);
      if (i < retries - 1) {
        await new Promise(r => setTimeout(r, 2000)); // Wait 2s before retry
      }
    }
  }
  dbConnected = false;
  console.log('⚠️ Database not connected - running in demo mode');
};

testDbConnection();

// Rate limiting - protect against brute force
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 login attempts per window
  message: { error: 'Too many login attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

const paymentLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 payment requests per minute
  message: { error: 'Too many payment requests, please try again later' },
});

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'https://elitos.ragspro.com',
    'https://elitos.ragspro.com',
    'http://localhost:3000',
    'http://localhost:5173',
  ],
  credentials: true,
}));
app.use(express.json());

// Apply rate limiting
app.use('/api/', generalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/payment/', paymentLimiter);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'ELITOS Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api/*'
    }
  });
});

// Health check with detailed status
app.get('/health', async (req, res) => {
  // Re-check database connection
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbConnected = true;
  } catch {
    dbConnected = false;
  }
  
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: dbConnected ? 'connected' : 'not_connected',
    razorpay: process.env.RAZORPAY_KEY_ID ? 'configured' : 'not_configured',
    email: process.env.GMAIL_APP_PASSWORD ? 'configured' : 'not_configured',
    cloudinary: process.env.CLOUDINARY_CLOUD_NAME ? 'configured' : 'not_configured',
  });
});

// Status endpoint for frontend
app.get('/api/status', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbConnected = true;
  } catch {
    dbConnected = false;
  }
  
  res.json({
    api: true,
    database: dbConnected,
    payments: !!process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_ID !== 'rzp_test_xxxxxxxxxxxxx',
    email: !!process.env.GMAIL_APP_PASSWORD && process.env.GMAIL_APP_PASSWORD !== 'xxxx xxxx xxxx xxxx',
    mode: dbConnected ? 'production' : 'demo',
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/wholesale', wholesaleRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/reviews', reviewRoutes);

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server (only in non-serverless environment)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 ELITOS Backend running on http://localhost:${PORT}`);
  });
}

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

// Export for Vercel serverless
export default app;
export { prisma };
