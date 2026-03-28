import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../index';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';
import { sendEmail, getOrderStatusEmail, sendWhatsAppNotification } from '../services/notifications';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate, requireAdmin);

// Product schema with gender
const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  price: z.number().positive(),
  originalPrice: z.number().positive().optional(),
  wholesalePrice: z.number().positive().optional(),
  moq: z.number().int().positive().optional(),
  images: z.array(z.string()),
  category: z.string(),
  subcategory: z.string().optional(),
  gender: z.enum(['MEN', 'WOMEN', 'KIDS', 'UNISEX']).optional(),
  sizes: z.array(z.string()),
  colors: z.array(z.string()),
  material: z.string().optional(),
  tags: z.array(z.string()).optional(),
  stock: z.number().int().min(0),
  featured: z.boolean().optional(),
  bestseller: z.boolean().optional(),
  isActive: z.boolean().optional(),
  specifications: z.record(z.string()).optional(),
});

// Dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const [
      totalOrders,
      totalRevenue,
      totalProducts,
      totalCustomers,
      recentOrders,
      pendingOrders,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { paymentStatus: 'PAID' },
      }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
        },
      }),
      prisma.order.count({ where: { status: 'PENDING' } }),
    ]);

    res.json({
      totalOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      totalProducts,
      totalCustomers,
      pendingOrders,
      recentOrders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Products CRUD
router.get('/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.post('/products', async (req, res) => {
  try {
    const data = productSchema.parse(req.body);
    const product = await prisma.product.create({ 
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        originalPrice: data.originalPrice,
        wholesalePrice: data.wholesalePrice,
        moq: data.moq,
        images: data.images,
        category: data.category,
        subcategory: data.subcategory,
        gender: data.gender,
        sizes: data.sizes,
        colors: data.colors,
        material: data.material,
        tags: data.tags || [],
        stock: data.stock,
        featured: data.featured,
        bestseller: data.bestseller,
        isActive: data.isActive ?? true,
        specifications: data.specifications,
      }
    });
    res.status(201).json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

router.put('/products/:id', async (req, res) => {
  try {
    const data = productSchema.partial().parse(req.body);
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data,
    });
    res.json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    await prisma.product.update({
      where: { id: req.params.id },
      data: { isActive: false },
    });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Orders management
router.get('/orders', async (req, res) => {
  try {
    const { status, paymentStatus, page = '1', limit = '20' } = req.query;
    
    const where: any = {};
    if (status) where.status = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: { select: { name: true, email: true, phone: true } },
        items: { include: { product: { select: { id: true, name: true, images: true } } } },
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string),
      skip: (parseInt(page as string) - 1) * parseInt(limit as string),
    });

    const total = await prisma.order.count({ where });

    res.json({ orders, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Update order status with tracking
router.put('/orders/:id/status', async (req, res) => {
  try {
    const { status, trackingNumber, trackingUrl, adminNotes } = req.body;
    
    const existingOrder = await prisma.order.findUnique({
      where: { id: req.params.id },
    });

    if (!existingOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const updateData: any = { status };
    if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber;
    if (trackingUrl !== undefined) updateData.trackingUrl = trackingUrl;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
    
    // Auto-mark COD as paid when delivered
    if (status === 'DELIVERED' && existingOrder.paymentMethod === 'COD') {
      updateData.paymentStatus = 'PAID';
      updateData.deliveredNotifSent = false; // Will send notification
    }

    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        items: { include: { product: { select: { name: true } } } },
      },
    });

    // Send notification to customer
    try {
      // Send email notification
      const emailHtml = getOrderStatusEmail({
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        status: order.status,
        trackingNumber: order.trackingNumber || undefined,
      });
      
      await sendEmail(
        order.customerEmail,
        `Order ${status} - ${order.orderNumber} | ELITOS`,
        emailHtml
      );

      // Send WhatsApp notification for shipped orders
      if (status === 'SHIPPED' && !existingOrder.shippedNotifSent) {
        const trackingInfo = trackingNumber ? `\n📦 Tracking: ${trackingNumber}` : '';
        const trackingLink = trackingUrl ? `\n🔗 Track: ${trackingUrl}` : '';
        const message = `🚚 Hi ${order.customerName}!\n\nYour ELITOS order #${order.orderNumber} has been shipped!${trackingInfo}${trackingLink}\n\nThank you for shopping with us! 🧡`;
        await sendWhatsAppNotification(order.customerPhone, message);
        
        await prisma.order.update({
          where: { id: order.id },
          data: { shippedNotifSent: true },
        });
      }

      // Send WhatsApp for delivered
      if (status === 'DELIVERED' && !existingOrder.deliveredNotifSent) {
        const message = `🎉 Hi ${order.customerName}!\n\nYour ELITOS order #${order.orderNumber} has been delivered!\n\nWe hope you love your purchase. Please leave a review! ⭐\n\nThank you! 🧡`;
        await sendWhatsAppNotification(order.customerPhone, message);
        
        await prisma.order.update({
          where: { id: order.id },
          data: { deliveredNotifSent: true },
        });
      }
    } catch (notifError) {
      console.error('Notification error:', notifError);
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// Update payment status (for refunds, etc.)
router.put('/orders/:id/payment', async (req, res) => {
  try {
    const { paymentStatus, adminNotes } = req.body;
    
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { 
        paymentStatus,
        ...(adminNotes ? { adminNotes } : {}),
      },
    });

    // Notify customer about refund
    if (paymentStatus === 'REFUNDED') {
      try {
        await sendEmail(
          order.customerEmail,
          `Refund Processed - ${order.orderNumber} | ELITOS`,
          `<p>Hi ${order.customerName},</p><p>Your refund for order #${order.orderNumber} has been processed.</p><p>Amount: ₹${order.totalAmount.toLocaleString()}</p><p>It may take 5-7 business days to reflect in your account.</p>`
        );
      } catch (e) {
        console.error('Refund notification error:', e);
      }
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update payment status' });
  }
});

// Customers
router.get('/customers', async (req, res) => {
  try {
    const customers = await prisma.user.findMany({
      where: { role: { in: ['CUSTOMER', 'WHOLESALE'] } },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        businessName: true,
        isApproved: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Wholesale applications
router.get('/wholesale-applications', async (req, res) => {
  try {
    const applications = await prisma.wholesaleApplication.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

router.put('/wholesale-applications/:id', async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const application = await prisma.wholesaleApplication.update({
      where: { id: req.params.id },
      data: { status, notes },
    });

    // If approved, update user role and notify
    if (status === 'approved') {
      await prisma.user.updateMany({
        where: { email: application.email },
        data: { role: 'WHOLESALE', isApproved: true },
      });

      // Send approval notification
      try {
        await sendEmail(
          application.email,
          'Wholesale Application Approved | ELITOS',
          `<p>Hi ${application.ownerName},</p><p>Great news! Your wholesale application for <strong>${application.businessName}</strong> has been approved.</p><p>You can now access wholesale pricing on our website.</p><p>Welcome to the ELITOS family! 🧡</p>`
        );
        
        await sendWhatsAppNotification(
          application.phone,
          `🎉 Hi ${application.ownerName}!\n\nYour ELITOS wholesale application has been APPROVED!\n\nYou can now access wholesale pricing. Login to your account to start ordering.\n\nWelcome to the family! 🧡`
        );
      } catch (e) {
        console.error('Wholesale approval notification error:', e);
      }
    }

    // If rejected, notify
    if (status === 'rejected') {
      try {
        await sendEmail(
          application.email,
          'Wholesale Application Update | ELITOS',
          `<p>Hi ${application.ownerName},</p><p>Thank you for your interest in ELITOS wholesale program.</p><p>Unfortunately, we are unable to approve your application at this time.</p>${notes ? `<p>Notes: ${notes}</p>` : ''}<p>Feel free to reach out if you have any questions.</p>`
        );
      } catch (e) {
        console.error('Wholesale rejection notification error:', e);
      }
    }

    res.json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update application' });
  }
});

// Reviews management
router.get('/reviews', async (req, res) => {
  try {
    const { isVisible, verified, page = '1', limit = '20' } = req.query;
    
    const where: any = {};
    if (isVisible !== undefined) where.isVisible = isVisible === 'true';
    if (verified !== undefined) where.verified = verified === 'true';

    const reviews = await prisma.review.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        product: { select: { name: true, images: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string),
      skip: (parseInt(page as string) - 1) * parseInt(limit as string),
    });

    const total = await prisma.review.count({ where });

    res.json({ reviews, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Toggle review visibility
router.put('/reviews/:id/visibility', async (req, res) => {
  try {
    const { isVisible } = req.body;
    
    const review = await prisma.review.update({
      where: { id: req.params.id },
      data: { isVisible },
      include: {
        user: { select: { name: true } },
        product: { select: { name: true } },
      },
    });

    res.json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update review visibility' });
  }
});

// Verify/unverify review
router.put('/reviews/:id/verify', async (req, res) => {
  try {
    const { verified } = req.body;
    
    const review = await prisma.review.update({
      where: { id: req.params.id },
      data: { verified },
    });

    res.json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update review verification' });
  }
});

// Delete review
router.delete('/reviews/:id', async (req, res) => {
  try {
    await prisma.review.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Review deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

// Newsletter subscribers
router.get('/subscribers', async (req, res) => {
  try {
    const subscribers = await prisma.newsletter.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(subscribers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch subscribers' });
  }
});

// Dashboard analytics
router.get('/analytics', async (req, res) => {
  try {
    const { days = '30' } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days as string));

    const [
      ordersByDay,
      revenueByDay,
      topProducts,
      ordersByStatus,
      paymentMethods,
    ] = await Promise.all([
      // Orders by day
      prisma.order.groupBy({
        by: ['createdAt'],
        where: { createdAt: { gte: daysAgo } },
        _count: true,
      }),
      // Revenue by day
      prisma.order.groupBy({
        by: ['createdAt'],
        where: { createdAt: { gte: daysAgo }, paymentStatus: 'PAID' },
        _sum: { totalAmount: true },
      }),
      // Top selling products
      prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 10,
      }),
      // Orders by status
      prisma.order.groupBy({
        by: ['status'],
        _count: true,
      }),
      // Payment methods distribution
      prisma.order.groupBy({
        by: ['paymentMethod'],
        _count: true,
      }),
    ]);

    // Get product details for top products
    const productIds = topProducts.map(p => p.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, images: true },
    });
    const productMap = new Map(products.map(p => [p.id, p]));

    res.json({
      ordersByDay,
      revenueByDay,
      topProducts: topProducts.map(p => ({
        ...p,
        product: productMap.get(p.productId),
      })),
      ordersByStatus,
      paymentMethods,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

export default router;
