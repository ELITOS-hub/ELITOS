import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../index';
import { authenticate, AuthRequest, optionalAuth } from '../middleware/auth';

const router = Router();

// Create review schema
const createReviewSchema = z.object({
  productId: z.string(),
  rating: z.number().min(1).max(5),
  title: z.string().optional(),
  text: z.string().min(10),
  images: z.array(z.string()).optional(),
});

// Get all reviews (public)
router.get('/', async (req, res) => {
  try {
    const { productId, limit = '10', page = '1' } = req.query;
    
    const where = productId ? { productId: productId as string } : {};
    const take = parseInt(limit as string);
    const skip = (parseInt(page as string) - 1) * take;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          user: { select: { name: true } },
          product: { select: { name: true, images: true } },
        },
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),
      prisma.review.count({ where }),
    ]);

    // Calculate average rating
    const avgRating = await prisma.review.aggregate({
      where,
      _avg: { rating: true },
    });

    res.json({
      reviews,
      total,
      avgRating: avgRating._avg.rating || 0,
      pagination: {
        page: parseInt(page as string),
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Get reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    
    const reviews = await prisma.review.findMany({
      where: { productId },
      include: {
        user: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const avgRating = await prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
    });

    const ratingDistribution = await prisma.review.groupBy({
      by: ['rating'],
      where: { productId },
      _count: true,
    });

    res.json({
      reviews,
      avgRating: avgRating._avg.rating || 0,
      totalReviews: reviews.length,
      ratingDistribution: ratingDistribution.reduce((acc, curr) => {
        acc[curr.rating] = curr._count;
        return acc;
      }, {} as Record<number, number>),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Create review (authenticated)
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const data = createReviewSchema.parse(req.body);

    // Check if user already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: req.user!.id,
        productId: data.productId,
      },
    });

    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this product' });
    }

    // Check if user has purchased this product (for verified badge)
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId: data.productId,
        order: {
          userId: req.user!.id,
          status: 'DELIVERED',
        },
      },
    });

    const review = await prisma.review.create({
      data: {
        userId: req.user!.id,
        productId: data.productId,
        rating: data.rating,
        title: data.title,
        text: data.text,
        images: data.images || [],
        verified: !!hasPurchased,
      },
      include: {
        user: { select: { name: true } },
      },
    });

    res.status(201).json(review);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// Update review
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { rating, title, text, images } = req.body;

    const review = await prisma.review.findFirst({
      where: { id, userId: req.user!.id },
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        rating: rating ?? review.rating,
        title: title ?? review.title,
        text: text ?? review.text,
        images: images ?? review.images,
      },
      include: {
        user: { select: { name: true } },
      },
    });

    res.json(updatedReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update review' });
  }
});

// Delete review
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const review = await prisma.review.findFirst({
      where: { id, userId: req.user!.id },
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    await prisma.review.delete({ where: { id } });

    res.json({ message: 'Review deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

// Get featured reviews (for homepage)
router.get('/featured', async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        rating: { gte: 4 },
        verified: true,
      },
      include: {
        user: { select: { name: true } },
        product: { select: { name: true, images: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch featured reviews' });
  }
});

export default router;
