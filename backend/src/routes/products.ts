import { Router, Request, Response } from 'express';
import { prisma } from '../index';
import { Prisma } from '@prisma/client';

const router = Router();

// Get all products with advanced filtering (public)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { 
      category, 
      subcategory,
      gender,
      featured, 
      bestseller, 
      search,
      sizes,
      minPrice,
      maxPrice,
      tags,
      limit = '20', 
      page = '1',
      sort = 'newest'
    } = req.query;
    
    const where: Prisma.ProductWhereInput = { isActive: true };
    
    // Category filter (exact match)
    if (category && typeof category === 'string') {
      where.category = category;
    }
    
    // Subcategory filter (exact match)
    if (subcategory && typeof subcategory === 'string') {
      where.subcategory = subcategory;
    }
    
    // Gender filter (include UNISEX products)
    if (gender && typeof gender === 'string') {
      const genderValue = gender.toUpperCase();
      if (genderValue !== 'UNISEX') {
        where.OR = [
          { gender: genderValue as any },
          { gender: 'UNISEX' }
        ];
      } else {
        where.gender = 'UNISEX';
      }
    }
    
    // Featured/Bestseller filters
    if (featured === 'true') where.featured = true;
    if (bestseller === 'true') where.bestseller = true;
    
    // Search filter
    if (search && typeof search === 'string') {
      const searchConditions: Prisma.ProductWhereInput[] = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ];
      
      if (where.OR) {
        // Combine with existing OR conditions (gender)
        where.AND = [{ OR: where.OR }, { OR: searchConditions }];
        delete where.OR;
      } else {
        where.OR = searchConditions;
      }
    }
    
    // Size filter (has any of the sizes)
    if (sizes && typeof sizes === 'string') {
      const sizeArray = sizes.split(',');
      where.sizes = { hasSome: sizeArray };
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice as string);
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
    }
    
    // Tags filter
    if (tags && typeof tags === 'string') {
      const tagArray = tags.split(',');
      where.tags = { hasSome: tagArray };
    }

    // Sorting
    let orderBy: Prisma.ProductOrderByWithRelationInput | Prisma.ProductOrderByWithRelationInput[] = { createdAt: 'desc' };
    switch (sort) {
      case 'price-low':
        orderBy = { price: 'asc' };
        break;
      case 'price-high':
        orderBy = { price: 'desc' };
        break;
      case 'name':
        orderBy = { name: 'asc' };
        break;
      case 'bestseller':
        orderBy = [{ bestseller: 'desc' }, { createdAt: 'desc' }];
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
    }

    const take = parseInt(limit as string);
    const skip = (parseInt(page as string) - 1) * take;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        take,
        skip,
        orderBy,
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          originalPrice: true,
          images: true,
          category: true,
          subcategory: true,
          gender: true,
          sizes: true,
          colors: true,
          stock: true,
          featured: true,
          bestseller: true,
          tags: true,
          _count: {
            select: { reviews: true }
          }
        }
      }),
      prisma.product.count({ where }),
    ]);

    // Get average ratings for products
    const productIds = products.map(p => p.id);
    
    let ratingsMap = new Map<string, { avg: number | null; count: number }>();
    
    if (productIds.length > 0) {
      const ratings = await prisma.review.groupBy({
        by: ['productId'],
        where: { 
          productId: { in: productIds }, 
          isVisible: true 
        },
        _avg: { rating: true },
        _count: { rating: true },
      });
      
      ratingsMap = new Map(
        ratings.map(r => [r.productId, { avg: r._avg.rating, count: r._count.rating }])
      );
    }

    const productsWithRatings = products.map(p => ({
      ...p,
      avgRating: ratingsMap.get(p.id)?.avg || 0,
      reviewCount: ratingsMap.get(p.id)?.count || 0,
    }));

    res.json({
      products: productsWithRatings,
      pagination: {
        total,
        page: parseInt(page as string),
        limit: take,
        pages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    console.error('Products fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});


// Get single product by slug (public)
router.get('/slug/:slug', async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.findFirst({
      where: { slug: req.params.slug, isActive: true },
      include: {
        reviews: {
          where: { isVisible: true },
          include: {
            user: { select: { name: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Calculate rating stats
    const ratingStats = await prisma.review.aggregate({
      where: { productId: product.id, isVisible: true },
      _avg: { rating: true },
      _count: true,
    });

    const ratingDistribution = await prisma.review.groupBy({
      by: ['rating'],
      where: { productId: product.id, isVisible: true },
      _count: true,
    });

    const distribution: Record<number, number> = {};
    ratingDistribution.forEach(r => {
      distribution[r.rating] = r._count;
    });

    res.json({
      ...product,
      avgRating: ratingStats._avg.rating || 0,
      reviewCount: ratingStats._count,
      ratingDistribution: distribution,
    });
  } catch (error) {
    console.error('Product fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Get single product by ID (public)
router.get('/id/:id', async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.findFirst({
      where: { id: req.params.id, isActive: true },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Product fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Get related products
router.get('/:slug/related', async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.findFirst({
      where: { slug: req.params.slug },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const relatedConditions: Prisma.ProductWhereInput = {
      category: product.category,
      id: { not: product.id },
      isActive: true,
    };

    // Include products of same gender or unisex
    if (product.gender && product.gender !== 'UNISEX') {
      relatedConditions.OR = [
        { gender: product.gender },
        { gender: 'UNISEX' },
      ];
    }

    const related = await prisma.product.findMany({
      where: relatedConditions,
      take: 4,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        originalPrice: true,
        images: true,
        category: true,
        gender: true,
      },
    });

    res.json(related);
  } catch (error) {
    console.error('Related products error:', error);
    res.status(500).json({ error: 'Failed to fetch related products' });
  }
});

// Get categories with counts
router.get('/meta/categories', async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.product.groupBy({
      by: ['category'],
      where: { isActive: true },
      _count: true,
    });

    const subcategories = await prisma.product.groupBy({
      by: ['subcategory', 'category'],
      where: { isActive: true, subcategory: { not: null } },
      _count: true,
    });

    const genders = await prisma.product.groupBy({
      by: ['gender'],
      where: { isActive: true },
      _count: true,
    });

    res.json({ categories, subcategories, genders });
  } catch (error) {
    console.error('Categories fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

export default router;
