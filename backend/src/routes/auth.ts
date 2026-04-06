import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { z } from 'zod';
import { prisma } from '../index';
import { authenticate, AuthRequest } from '../middleware/auth';
import { sendEmail } from '../services/notifications';

const router = Router();

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(6),
});

// Store reset tokens temporarily (in production, use Redis or DB)
const resetTokens = new Map<string, { email: string; expires: Date }>();

// Register
router.post('/register', async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);
    
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        phone: data.phone,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.status(201).json({ user, token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if this is a Google-only user (password starts with hashed google_ prefix)
    const validPassword = await bcrypt.compare(data.password, user.password);

    if (!validPassword) {
      // Check if password looks like a Google-synced random password
      const isGoogleUser = user.password && !(await bcrypt.compare(data.password, user.password));
      // Try to detect Google users by checking if any common password works
      const isLikelyGoogleAccount = user.password.length > 50; // bcrypt hashes are 60 chars
      
      // If user exists but password fails, check if they might be a Google user
      if (isLikelyGoogleAccount) {
        return res.status(401).json({ error: 'This account uses Google Sign-In. Please click "Continue with Google" to login.' });
      }
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user
router.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        businessName: true,
        isApproved: true,
        createdAt: true,
      },
    });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Forgot Password - Send reset email
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({ message: 'If an account exists, a reset link has been sent' });
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store token
    resetTokens.set(token, { email, expires });

    // Clean up expired tokens
    for (const [key, value] of resetTokens.entries()) {
      if (value.expires < new Date()) {
        resetTokens.delete(key);
      }
    }

    // Send reset email
    const resetUrl = `${process.env.FRONTEND_URL || 'https://elitos.ragspro.com'}?reset=${token}`;
    
    await sendEmail(
      email,
      'Reset Your Password | ELITOS',
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #8B4513;">ELITOS</h1>
          <h2>Reset Your Password</h2>
          <p>Hi ${user.name},</p>
          <p>You requested to reset your password. Click the button below to set a new password:</p>
          <a href="${resetUrl}" style="display: inline-block; background: #E65100; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0;">Reset Password</a>
          <p>This link expires in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <p style="color: #666; font-size: 12px;">© 2023 ELITOS. All rights reserved.</p>
        </div>
      `
    );

    res.json({ message: 'If an account exists, a reset link has been sent' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid email address' });
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

// Reset Password - Set new password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = resetPasswordSchema.parse(req.body);

    const tokenData = resetTokens.get(token);
    
    if (!tokenData) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    if (tokenData.expires < new Date()) {
      resetTokens.delete(token);
      return res.status(400).json({ error: 'Reset token has expired' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password
    await prisma.user.update({
      where: { email: tokenData.email },
      data: { password: hashedPassword },
    });

    // Delete used token
    resetTokens.delete(token);

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// Google OAuth Sync - Create or get user from Google login
router.post('/google-sync', async (req, res) => {
  try {
    const { email, name, googleId, avatar } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email },
    });

    // Admin emails list
    const adminEmails = ['admin@elitos.com', 'ragsproai@gmail.com'];

    if (!user) {
      // Create new user with Google ID as password (they can't login with password anyway)
      const hashedPassword = await bcrypt.hash(`google_${googleId}_${Date.now()}`, 10);
      
      user = await prisma.user.create({
        data: {
          email,
          name: name || email.split('@')[0],
          password: hashedPassword,
          role: adminEmails.includes(email.toLowerCase()) ? 'ADMIN' : 'CUSTOMER',
        },
      });
    } else if (adminEmails.includes(email.toLowerCase()) && user.role !== 'ADMIN') {
      // Update existing user to admin if they're in admin list
      user = await prisma.user.update({
        where: { email },
        data: { role: 'ADMIN' },
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    console.error('Google sync error:', error);
    res.status(500).json({ error: 'Failed to sync Google user' });
  }
});

export default router;
