// ELITOS Contact Configuration
// Update these values as needed

export const CONTACT = {
  // WhatsApp
  whatsapp: '919811736143', // With country code for wa.me links
  whatsappDisplay: '+91 98117 36143',
  
  // Email
  email: 'contactus.elitos@gmail.com',
  wholesaleEmail: 'contactus.elitos@gmail.com',
  
  // Social Media (update when available)
  instagram: 'elitos.official',
  facebook: 'elitos.official',
  
  // Business Info
  businessName: 'ELITOS',
  tagline: 'Affordable Luxe. For Everyone.',
  
  // Address
  address: 'A-111 Amar Colony, Lajpat Nagar 4, New Delhi 110024',
};

// Pre-filled WhatsApp Messages
export const WHATSAPP_MESSAGES = {
  general: 'Hi ELITOS Team! I have a question.',
  wholesale: (productName?: string) => 
    `Hi ELITOS Team,\n\nI am interested in wholesale purchase.\n${productName ? `Product: ${productName}\n` : ''}\nPlease share pricing and minimum order details.\n\nThank you!`,
  orderHelp: (orderId: string) => 
    `Hi! I need help with my order #${orderId}`,
  productEnquiry: (productName: string) => 
    `Hi! I'm interested in ${productName}. Can you share more details?`,
};

// Email Subjects
export const EMAIL_SUBJECTS = {
  wholesale: 'Wholesale Enquiry – ELITOS',
  support: 'Customer Support – ELITOS',
  feedback: 'Feedback – ELITOS',
};
