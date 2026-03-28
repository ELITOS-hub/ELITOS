import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../index';

const router = Router();

const subscribeSchema = z.object({
  email: z.string().email(),
});

// Subscribe to newsletter
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = subscribeSchema.parse(req.body);

    const existing = await prisma.newsletter.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.isActive) {
        return res.status(400).json({ error: 'Already subscribed' });
      }
      // Reactivate subscription
      await prisma.newsletter.update({
        where: { email },
        data: { isActive: true },
      });
      return res.json({ message: 'Subscription reactivated' });
    }

    await prisma.newsletter.create({
      data: { email },
    });

    res.status(201).json({ message: 'Successfully subscribed!' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid email address' });
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

// Unsubscribe
router.post('/unsubscribe', async (req, res) => {
  try {
    const { email } = subscribeSchema.parse(req.body);

    await prisma.newsletter.updateMany({
      where: { email },
      data: { isActive: false },
    });

    res.json({ message: 'Successfully unsubscribed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to unsubscribe' });
  }
});

export default router;
