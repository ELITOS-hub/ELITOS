import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../index';

const router = Router();

const applicationSchema = z.object({
  businessName: z.string().min(2),
  ownerName: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email(),
  gstNumber: z.string().optional(),
  expectedMonthlyQty: z.string(),
  notes: z.string().optional(),
});

// Submit wholesale application
router.post('/apply', async (req: Request, res: Response) => {
  try {
    const data = applicationSchema.parse(req.body);

    // Check if application already exists
    const existing = await prisma.wholesaleApplication.findFirst({
      where: { email: data.email },
    });

    if (existing) {
      return res.status(400).json({ error: 'Application already submitted with this email' });
    }

    const application = await prisma.wholesaleApplication.create({
      data: {
        businessName: data.businessName,
        ownerName: data.ownerName,
        phone: data.phone,
        email: data.email,
        gstNumber: data.gstNumber,
        expectedMonthlyQty: data.expectedMonthlyQty,
        notes: data.notes,
      },
    });

    res.status(201).json({ 
      message: 'Application submitted successfully',
      application 
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

// Check application status
router.get('/status/:email', async (req: Request, res: Response) => {
  try {
    const application = await prisma.wholesaleApplication.findFirst({
      where: { email: req.params.email },
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json({
      status: application.status,
      submittedAt: application.createdAt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch status' });
  }
});

export default router;
