import { PrismaClient, Gender } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@elitos.com' },
    update: {},
    create: {
      email: 'admin@elitos.com',
      password: adminPassword,
      name: 'ELITOS Admin',
      role: 'ADMIN',
      phone: '9811736143',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create test customer
  const customerPassword = await bcrypt.hash('test123', 10);
  const customer = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      password: customerPassword,
      name: 'Test Customer',
      role: 'CUSTOMER',
    },
  });
  console.log('✅ Test customer created:', customer.email);

  // Sample products with gender
  const products = [
    {
      name: 'Premium Leather Sneaker',
      slug: 'premium-leather-sneaker-men',
      description: 'Premium leather sneakers crafted for everyday comfort and style. Features cushioned insole and durable rubber outsole.',
      price: 3499,
      originalPrice: 4999,
      images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600'],
      category: 'footwear',
      subcategory: 'sneakers',
      gender: Gender.MEN,
      sizes: ['6', '7', '8', '9', '10', '11'],
      colors: ['Black', 'White', 'Brown'],
      tags: ['leather', 'premium', 'casual'],
      stock: 25,
      featured: true,
      bestseller: true,
    },
    {
      name: 'Classic Canvas Low',
      slug: 'classic-canvas-low-unisex',
      description: 'Timeless canvas sneakers perfect for casual everyday wear.',
      price: 2299,
      originalPrice: 2999,
      images: ['https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600'],
      category: 'footwear',
      subcategory: 'sneakers',
      gender: Gender.UNISEX,
      sizes: ['6', '7', '8', '9', '10'],
      colors: ['White', 'Navy', 'Red'],
      tags: ['canvas', 'casual', 'everyday'],
      stock: 40,
      bestseller: true,
    },
    {
      name: 'Winter Puffer Jacket',
      slug: 'winter-puffer-jacket-men',
      description: 'Premium puffer jacket with synthetic down fill. Water-resistant and windproof.',
      price: 5999,
      originalPrice: 7999,
      images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600'],
      category: 'winterwear',
      subcategory: 'jackets',
      gender: Gender.MEN,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Black', 'Navy', 'Olive'],
      tags: ['winter', 'puffer', 'warm'],
      stock: 15,
      featured: true,
      bestseller: true,
    },
    {
      name: 'Urban Runner',
      slug: 'urban-runner-men',
      description: 'Lightweight running shoes with responsive cushioning for all-day comfort.',
      price: 4299,
      originalPrice: 5499,
      images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'],
      category: 'footwear',
      subcategory: 'sneakers',
      gender: Gender.MEN,
      sizes: ['6', '7', '8', '9', '10', '11'],
      colors: ['Red', 'Black', 'Blue'],
      tags: ['running', 'sports', 'lightweight'],
      stock: 30,
      featured: true,
    },
    {
      name: 'Cozy Winter Hoodie',
      slug: 'cozy-winter-hoodie-unisex',
      description: 'Ultra-soft fleece hoodie perfect for layering in cold weather.',
      price: 3999,
      originalPrice: 4999,
      images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600'],
      category: 'winterwear',
      subcategory: 'hoodies',
      gender: Gender.UNISEX,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Grey', 'Black', 'Navy'],
      tags: ['hoodie', 'fleece', 'cozy'],
      stock: 35,
      featured: true,
    },
    {
      name: 'Minimalist High-Top',
      slug: 'minimalist-high-top-men',
      description: 'Clean minimalist high-top sneakers with premium leather upper.',
      price: 3799,
      originalPrice: 4499,
      images: ['https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600'],
      category: 'footwear',
      subcategory: 'sneakers',
      gender: Gender.MEN,
      sizes: ['7', '8', '9', '10', '11'],
      colors: ['White', 'Black'],
      tags: ['high-top', 'minimalist', 'leather'],
      stock: 20,
      bestseller: true,
    },
    {
      name: 'Women\'s Casual Sneaker',
      slug: 'womens-casual-sneaker',
      description: 'Stylish and comfortable sneakers designed for women.',
      price: 2999,
      originalPrice: 3999,
      images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600'],
      category: 'footwear',
      subcategory: 'sneakers',
      gender: Gender.WOMEN,
      sizes: ['4', '5', '6', '7', '8'],
      colors: ['Pink', 'White', 'Black'],
      tags: ['women', 'casual', 'comfortable'],
      stock: 25,
      featured: true,
    },
    {
      name: 'Kids Sports Shoes',
      slug: 'kids-sports-shoes',
      description: 'Durable and comfortable sports shoes for active kids.',
      price: 1999,
      originalPrice: 2499,
      images: ['https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=600'],
      category: 'footwear',
      subcategory: 'sneakers',
      gender: Gender.KIDS,
      sizes: ['1', '2', '3', '4', '5'],
      colors: ['Blue', 'Red', 'Green'],
      tags: ['kids', 'sports', 'durable'],
      stock: 30,
      bestseller: true,
    },
    {
      name: 'Women\'s Winter Coat',
      slug: 'womens-winter-coat',
      description: 'Elegant winter coat with warm lining for women.',
      price: 6999,
      originalPrice: 8999,
      images: ['https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600'],
      category: 'winterwear',
      subcategory: 'jackets',
      gender: Gender.WOMEN,
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Beige', 'Black', 'Grey'],
      tags: ['women', 'coat', 'elegant'],
      stock: 15,
      featured: true,
    },
    {
      name: 'Classic Leather Boots',
      slug: 'classic-leather-boots-men',
      description: 'Timeless leather boots perfect for any occasion.',
      price: 5499,
      originalPrice: 6999,
      images: ['https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600'],
      category: 'footwear',
      subcategory: 'boots',
      gender: Gender.MEN,
      sizes: ['7', '8', '9', '10', '11'],
      colors: ['Brown', 'Black'],
      tags: ['boots', 'leather', 'classic'],
      stock: 20,
      bestseller: true,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }
  console.log('✅ Products seeded:', products.length);

  console.log('🎉 Seeding complete!');
  console.log('');
  console.log('📝 Login credentials:');
  console.log('   Admin: admin@elitos.com / admin123');
  console.log('   Customer: test@example.com / test123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
