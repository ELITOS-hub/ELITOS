import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '../index';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Address schema
const addressSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  addressLine1: z.string().min(5),
  addressLine2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().length(6),
  isDefault: z.boolean().optional(),
});

// Get user profile
router.get('/profile', authenticate, async (req: AuthRequest, res) => {
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
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update profile
router.put('/profile', authenticate, async (req: AuthRequest, res) => {
  try {
    const { name, phone } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: { name, phone },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
      },
    });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Change password
router.put('/password', authenticate, async (req: AuthRequest, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: req.user!.id },
      data: { password: hashedPassword },
    });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Get addresses
router.get('/addresses', authenticate, async (req: AuthRequest, res) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.user!.id },
      orderBy: { isDefault: 'desc' },
    });

    res.json(addresses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch addresses' });
  }
});

// Add address
router.post('/addresses', authenticate, async (req: AuthRequest, res) => {
  try {
    const data = addressSchema.parse(req.body);

    // If this is the first address or marked as default, update others
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.user!.id },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        name: data.name,
        phone: data.phone,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        isDefault: data.isDefault || false,
        user: {
          connect: { id: req.user!.id }
        }
      },
    });

    res.status(201).json(address);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to add address' });
  }
});

// Update address
router.put('/addresses/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const data = addressSchema.parse(req.body);

    const address = await prisma.address.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
    });

    if (!address) {
      return res.status(404).json({ error: 'Address not found' });
    }

    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.user!.id, id: { not: req.params.id } },
        data: { isDefault: false },
      });
    }

    const updated = await prisma.address.update({
      where: { id: req.params.id },
      data,
    });

    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to update address' });
  }
});

// Delete address
router.delete('/addresses/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const address = await prisma.address.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
    });

    if (!address) {
      return res.status(404).json({ error: 'Address not found' });
    }

    await prisma.address.delete({ where: { id: req.params.id } });

    res.json({ message: 'Address deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete address' });
  }
});

// Get wishlist
router.get('/wishlist', authenticate, async (req: AuthRequest, res) => {
  try {
    const wishlist = await prisma.wishlistItem.findMany({
      where: { userId: req.user!.id },
      include: { product: true },
    });

    res.json(wishlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

// Add to wishlist
router.post('/wishlist/:productId', authenticate, async (req: AuthRequest, res) => {
  try {
    const item = await prisma.wishlistItem.create({
      data: {
        userId: req.user!.id,
        productId: req.params.productId,
      },
      include: { product: true },
    });

    res.status(201).json(item);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Already in wishlist' });
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to add to wishlist' });
  }
});

// Remove from wishlist
router.delete('/wishlist/:productId', authenticate, async (req: AuthRequest, res) => {
  try {
    await prisma.wishlistItem.deleteMany({
      where: {
        userId: req.user!.id,
        productId: req.params.productId,
      },
    });

    res.json({ message: 'Removed from wishlist' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to remove from wishlist' });
  }
});

export default router;
