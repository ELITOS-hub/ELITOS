// Notification Services for ELITOS
// WhatsApp via WhatsApp Business API / Twilio
// Email via Nodemailer / SendGrid

import nodemailer from 'nodemailer';

// WhatsApp notification (using WhatsApp Business API URL scheme for now)
export const sendWhatsAppNotification = async (
  phone: string,
  message: string,
  adminPhone?: string
) => {
  // Format phone number
  const formattedPhone = phone.replace(/\D/g, '');
  const adminNumber = adminPhone || process.env.ADMIN_WHATSAPP || '919811736143';
  
  // For now, we'll generate the WhatsApp URL
  // In production, integrate with WhatsApp Business API or Twilio
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
  
  console.log('📱 WhatsApp Notification:', {
    to: formattedPhone,
    message: message.substring(0, 100) + '...',
    url: whatsappUrl,
  });
  
  return { success: true, url: whatsappUrl };
};

// Email transporter setup
const createTransporter = () => {
  // Use environment variables for email config
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  
  // Fallback to Gmail (for development)
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }
  
  return null;
};

// Send email
export const sendEmail = async (
  to: string,
  subject: string,
  html: string,
  text?: string
) => {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.log('📧 Email (not configured):', { to, subject });
    return { success: false, error: 'Email not configured' };
  }
  
  try {
    const fromEmail = process.env.GMAIL_USER || process.env.SMTP_USER || 'noreply@elitos.in';
    const info = await transporter.sendMail({
      from: `"ELITOS" <${fromEmail}>`,
      to,
      subject,
      text: text || subject,
      html,
    });
    
    console.log('📧 Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('📧 Email error:', error);
    return { success: false, error };
  }
};

// Order confirmation email template
export const getOrderConfirmationEmail = (order: {
  orderNumber: string;
  customerName: string;
  items: { name: string; quantity: number; price: number; size?: string }[];
  totalAmount: number;
  shippingAddress: string;
  paymentMethod: string;
}) => {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name} ${item.size ? `(${item.size})` : ''}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toLocaleString()}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #8B4513; margin: 0;">ELITOS</h1>
        <p style="color: #666; margin: 5px 0;">Affordable Luxe. For Everyone.</p>
      </div>
      
      <div style="background: #f9f9f9; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
        <h2 style="color: #333; margin-top: 0;">Order Confirmed! 🎉</h2>
        <p>Hi ${order.customerName},</p>
        <p>Thank you for your order! We're getting it ready for you.</p>
      </div>
      
      <div style="background: #fff; border: 1px solid #eee; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
        <h3 style="margin-top: 0; color: #8B4513;">Order #${order.orderNumber}</h3>
        
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f5f5f5;">
              <th style="padding: 10px; text-align: left;">Item</th>
              <th style="padding: 10px; text-align: center;">Qty</th>
              <th style="padding: 10px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding: 10px; font-weight: bold;">Total</td>
              <td style="padding: 10px; text-align: right; font-weight: bold; color: #E65100;">₹${order.totalAmount.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      <div style="background: #fff; border: 1px solid #eee; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
        <h4 style="margin-top: 0;">Delivery Address</h4>
        <p style="margin: 0; color: #666;">${order.shippingAddress}</p>
        
        <h4>Payment Method</h4>
        <p style="margin: 0; color: #666;">${order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Paid Online'}</p>
      </div>
      
      <div style="text-align: center; color: #666; font-size: 14px;">
        <p>Questions? Contact us on WhatsApp: +91 98117 36143</p>
        <p>Email: contactus.elitos@gmail.com</p>
        <p style="margin-top: 20px;">© 2023 ELITOS. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
};

// Order status update email template
export const getOrderStatusEmail = (order: {
  orderNumber: string;
  customerName: string;
  status: string;
  trackingNumber?: string;
}) => {
  const statusMessages: Record<string, { title: string; message: string; emoji: string }> = {
    CONFIRMED: { title: 'Order Confirmed', message: 'Your order has been confirmed and is being prepared.', emoji: '✅' },
    PROCESSING: { title: 'Order Processing', message: 'Your order is being packed and will be shipped soon.', emoji: '📦' },
    SHIPPED: { title: 'Order Shipped', message: 'Your order is on its way!', emoji: '🚚' },
    DELIVERED: { title: 'Order Delivered', message: 'Your order has been delivered. Enjoy!', emoji: '🎉' },
    CANCELLED: { title: 'Order Cancelled', message: 'Your order has been cancelled.', emoji: '❌' },
  };

  const statusInfo = statusMessages[order.status] || { title: 'Order Update', message: 'Your order status has been updated.', emoji: '📋' };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #8B4513; margin: 0;">ELITOS</h1>
      </div>
      
      <div style="background: #f9f9f9; padding: 20px; border-radius: 10px; text-align: center;">
        <h2 style="margin-top: 0;">${statusInfo.emoji} ${statusInfo.title}</h2>
        <p>Hi ${order.customerName},</p>
        <p>${statusInfo.message}</p>
        <p style="font-weight: bold; color: #8B4513;">Order #${order.orderNumber}</p>
        ${order.trackingNumber ? `<p>Tracking Number: <strong>${order.trackingNumber}</strong></p>` : ''}
      </div>
      
      <div style="text-align: center; color: #666; font-size: 14px; margin-top: 30px;">
        <p>Questions? Contact us on WhatsApp: +91 98117 36143</p>
      </div>
    </body>
    </html>
  `;
};

// Admin notification for new order
export const getAdminOrderNotification = (order: {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  items: { name: string; quantity: number; size?: string }[];
  totalAmount: number;
  paymentMethod: string;
  shippingAddress: string;
}) => {
  const itemsList = order.items.map(item => 
    `• ${item.name} ${item.size ? `(${item.size})` : ''} x${item.quantity}`
  ).join('\n');

  return `🛒 *NEW ORDER - ${order.orderNumber}*

👤 *Customer:* ${order.customerName}
📱 *Phone:* ${order.customerPhone}

📦 *Items:*
${itemsList}

💰 *Total:* ₹${order.totalAmount.toLocaleString()}
💳 *Payment:* ${order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Paid Online'}

📍 *Address:*
${order.shippingAddress}`;
};
