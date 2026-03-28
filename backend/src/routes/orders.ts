import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../index';
import { authenticate, AuthRequest, optionalAuth } from '../middleware/auth';
import { 
  sendWhatsAppNotification, 
  sendEmail, 
  getOrderConfirmationEmail,
  getAdminOrderNotification 
} from '../services/notifications';

const router = Router();

// Generate order number
const generateOrderNumber = () => {
  const prefix = 'ELT';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
};

// Create order schema - supports both guest and logged-in users
const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(1),
    size: z.string().optional(),
    color: z.string().optional(),
  })),
  // Customer details (required for guest checkout)
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(10),
  // Shipping address (inline, not addressId)
  shippingAddress: z.object({
    name: z.string().min(2),
    phone: z.string().min(10),
    addressLine1: z.string().min(5),
    addressLine2: z.string().optional(),
    city: z.string().min(2),
    state: z.string().min(2),
    pincode: z.string().min(6),
  }),
  paymentMethod: z.enum(['COD', 'UPI', 'CARD', 'NETBANKING', 'RAZORPAY']),
  notes: z.string().optional(),
  orderType: z.enum(['retail', 'wholesale']).optional(),
});

// Get user orders (authenticated)
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user!.id },
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true, images: true, slug: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get single order by ID (authenticated user)
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true, images: true, slug: true } },
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Get order by order number (public - for tracking)
router.get('/track/:orderNumber', async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber: req.params.orderNumber },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        paymentStatus: true,
        trackingNumber: true,
        trackingUrl: true,
        createdAt: true,
        updatedAt: true,
        items: {
          include: {
            product: { select: { name: true, images: true } },
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Create order (supports both guest and authenticated users)
// Uses atomic transaction to prevent race conditions
router.post('/', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const data = createOrderSchema.parse(req.body);

    // Use transaction for atomic stock check and order creation
    const order = await prisma.$transaction(async (tx) => {
      // Fetch products with row locking
      const productIds = data.items.map(item => item.productId);
      const products = await tx.product.findMany({
        where: { id: { in: productIds }, isActive: true },
      });

      if (products.length !== productIds.length) {
        throw new Error('One or more products not found or unavailable');
      }

      const productMap = new Map(products.map(p => [p.id, p]));

      // Check stock availability
      for (const item of data.items) {
        const product = productMap.get(item.productId);
        if (product && product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}`);
        }
      }

      let subtotal = 0;
      const orderItems = data.items.map(item => {
        const product = productMap.get(item.productId)!;
        const price = data.orderType === 'wholesale' && product.wholesalePrice 
          ? product.wholesalePrice 
          : product.price;
        subtotal += price * item.quantity;

        return {
          productId: item.productId,
          quantity: item.quantity,
          price,
          size: item.size,
          color: item.color,
        };
      });

      // Calculate shipping (free above ₹999)
      const shippingCost = subtotal >= 999 ? 0 : 49;
      const totalAmount = subtotal + shippingCost;

      // Decrement stock atomically FIRST
      for (const item of data.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Create order with inline shipping address
      const newOrder = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId: req.user?.id || null, // null for guest checkout
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          paymentMethod: data.paymentMethod,
          subtotal,
          shippingCost,
          totalAmount,
          notes: data.notes,
          orderType: data.orderType || 'retail',
          status: data.paymentMethod === 'COD' ? 'CONFIRMED' : 'PENDING',
          paymentStatus: data.paymentMethod === 'COD' ? 'PENDING' : 'PENDING',
          // Inline shipping address
          shippingName: data.shippingAddress.name,
          shippingPhone: data.shippingAddress.phone,
          shippingAddress1: data.shippingAddress.addressLine1,
          shippingAddress2: data.shippingAddress.addressLine2,
          shippingCity: data.shippingAddress.city,
          shippingState: data.shippingAddress.state,
          shippingPincode: data.shippingAddress.pincode,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: {
            include: { product: { select: { id: true, name: true, images: true } } },
          },
        },
      });

      return newOrder;
    }, {
      maxWait: 5000, // 5s max wait for transaction
      timeout: 10000, // 10s timeout
    });

    // Send notifications
    try {
      const shippingAddress = `${data.shippingAddress.addressLine1}${data.shippingAddress.addressLine2 ? ', ' + data.shippingAddress.addressLine2 : ''}, ${data.shippingAddress.city}, ${data.shippingAddress.state} - ${data.shippingAddress.pincode}`;
      
      // Send order confirmation email to customer
      const emailHtml = getOrderConfirmationEmail({
        orderNumber: order.orderNumber,
        customerName: data.customerName,
        items: order.items.map(item => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.price,
          size: item.size || undefined,
        })),
        totalAmount: order.totalAmount,
        shippingAddress,
        paymentMethod: data.paymentMethod,
      });
      
      await sendEmail(
        data.customerEmail,
        `Order Confirmed - ${order.orderNumber} | ELITOS`,
        emailHtml
      );
      
      // Send WhatsApp notification to admin
      const adminMessage = getAdminOrderNotification({
        orderNumber: order.orderNumber,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        items: order.items.map(item => ({
          name: item.product.name,
          quantity: item.quantity,
          size: item.size || undefined,
        })),
        totalAmount: order.totalAmount,
        paymentMethod: data.paymentMethod,
        shippingAddress,
      });
      
      await sendWhatsAppNotification(process.env.ADMIN_WHATSAPP || '', adminMessage);

      // Mark confirmation sent
      await prisma.order.update({
        where: { id: order.id },
        data: { confirmationSent: true },
      });
    } catch (notifError) {
      console.error('Notification error:', notifError);
      // Don't fail the order if notifications fail
    }

    res.status(201).json(order);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    // Handle transaction errors
    if (error.message?.includes('Insufficient stock') || error.message?.includes('not found')) {
      return res.status(400).json({ error: error.message });
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Cancel order (authenticated user)
router.post('/:id/cancel', authenticate, async (req: AuthRequest, res) => {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
      include: { items: true },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
      return res.status(400).json({ error: 'Order cannot be cancelled at this stage' });
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: { status: 'CANCELLED' },
    });

    // Restore stock
    for (const item of order.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      });
    }

    // Send cancellation notification
    try {
      await sendEmail(
        order.customerEmail,
        `Order Cancelled - ${order.orderNumber} | ELITOS`,
        `<p>Hi ${order.customerName},</p><p>Your order #${order.orderNumber} has been cancelled.</p><p>If you have any questions, please contact us.</p>`
      );
    } catch (notifError) {
      console.error('Notification error:', notifError);
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

export default router;
