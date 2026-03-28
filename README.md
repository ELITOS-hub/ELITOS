# ELITOS - Affordable Luxe. For Everyone.

A modern, responsive e-commerce website built with React, TypeScript, and Tailwind CSS. ELITOS specializes in premium footwear and winter essentials that combine style, comfort, and accessibility.

## 🚀 Features

### ✨ **Complete E-commerce Experience**
- **Product Catalog**: Curated footwear and winterwear collections
- **Shopping Cart**: Full cart functionality with add/remove/update operations
- **Responsive Design**: Mobile-first approach with seamless desktop experience
- **Interactive UI**: Smooth animations, hover effects, and micro-interactions

### 🛒 **Shopping Features**
- **Quick Add**: One-click product addition to cart
- **Cart Management**: Real-time cart updates with quantity controls
- **Product Categories**: Organized footwear and winterwear sections
- **Featured Collections**: Curated product collections and bestsellers
- **Wishlist**: Save favorite products (UI ready)
- **User Authentication**: Complete login/signup system with Google & Apple ID
- **User Profiles**: Personal account management and order history

### 🔐 **Authentication System**
- **Multiple Login Options**: Email/password, Google OAuth, Apple ID
- **Secure Registration**: Email validation and password strength requirements
- **Password Recovery**: Forgot password functionality with email reset
- **Session Management**: Persistent login with localStorage
- **User Profiles**: Account settings, order history, and preferences
- **Social Login**: One-click authentication with Google and Apple

### 🎨 **Design & UX**
- **Premium Aesthetics**: Clean, minimalist design with ELITOS brand colors
- **Smooth Navigation**: Sticky header with scroll effects and smooth scrolling
- **Mobile Menu**: Responsive hamburger menu for mobile devices
- **Loading States**: Elegant loading animations and feedback
- **Error Handling**: Graceful error states and user feedback

### 📱 **Responsive & Accessible**
- **Mobile-First**: Optimized for all screen sizes
- **Touch-Friendly**: 44px minimum touch targets
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: ARIA labels and semantic HTML
- **Performance Optimized**: Fast loading with image lazy loading

## 🛠️ **Tech Stack**

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React
- **Build Tool**: Vite
- **State Management**: React Context API
- **Package Manager**: npm

## 🎨 **Brand Colors**

```css
--elitos-cream: #F4E7E1
--elitos-orange: #FF9B45
--elitos-red: #D5451B
--elitos-brown: #521C0D
```

## 🚀 **Getting Started**

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/raghavshahhh/elitos.git
   cd elitos
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 **Project Structure**

```
elitos/
├── src/
│   ├── components/          # React components
│   │   ├── Header.tsx       # Navigation header
│   │   ├── ProductCard.tsx  # Product display card
│   │   ├── CartIcon.tsx     # Shopping cart icon & dropdown
│   │   └── ...
│   ├── context/            # React Context providers
│   │   └── CartContext.tsx # Shopping cart state management
│   ├── data/               # Static data and mock content
│   │   └── products.ts     # Product catalog data
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts        # Core interfaces and types
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles and Tailwind imports
├── public/                 # Static assets
├── .kiro/                  # Kiro spec files (development artifacts)
└── ...config files
```

## 🛒 **Key Components**

### **ProductCard**
- Product image with hover effects
- Quick Add functionality
- Wishlist toggle
- Price formatting (₹ INR)
- Category badges

### **CartContext**
- Global cart state management
- Add/remove/update operations
- Cart persistence during session
- Real-time total calculations

### **Header**
- Sticky navigation with scroll effects
- Mobile hamburger menu
- Cart icon with item count
- Smooth scroll navigation

### **Responsive Sections**
- Hero section with CTA buttons
- Featured collections grid
- Product category sections
- Trust badges and brand messaging

## 🎯 **Features in Detail**

### **Shopping Cart System**
- **Real-time Updates**: Cart count and totals update immediately
- **Quantity Management**: Increase/decrease product quantities
- **Item Removal**: Remove individual items or clear entire cart
- **Price Calculation**: Automatic total price calculation with INR formatting
- **Session Persistence**: Cart state maintained during user session

### **Product Management**
- **Dynamic Product Loading**: Products loaded from structured data
- **Category Filtering**: Separate sections for footwear and winterwear
- **Image Optimization**: Lazy loading with Unsplash integration
- **Search Ready**: Structure prepared for search functionality

### **Navigation & UX**
- **Smooth Scrolling**: Animated scroll to sections
- **Mobile-First**: Responsive design for all devices
- **Loading States**: Visual feedback for user actions
- **Error Handling**: Graceful error states and recovery

## 🔧 **Development**

### **Available Scripts**

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### **Code Style**
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Tailwind CSS for styling

## 🌟 **Brand Philosophy**

**"Affordable Luxe. For Everyone."**

ELITOS bridges the gap between premium quality and accessibility. We believe great style should feel effortless and accessible, offering modern design, reliable quality, and everyday comfort without compromise.

## 📱 **Responsive Breakpoints**

- **Mobile**: < 768px (1 column layouts)
- **Tablet**: 768px - 1023px (2 column layouts)  
- **Desktop**: ≥ 1024px (4 column layouts)

## 🎨 **Design System**

### **Typography**
- **Headings**: Inter font family, bold weights
- **Body**: Inter font family, regular weights
- **Hierarchy**: Consistent heading and text sizing

### **Spacing**
- **Sections**: 64px - 96px vertical padding
- **Components**: 16px - 24px internal spacing
- **Grid**: 24px gaps for product grids

### **Colors**
- **Primary**: ELITOS Orange (#FF9B45)
- **Secondary**: ELITOS Brown (#521C0D)
- **Accent**: ELITOS Red (#D5451B)
- **Background**: ELITOS Cream (#F4E7E1)

## 🚀 **Performance**

- **Bundle Size**: < 175KB gzipped
- **First Load**: Optimized for fast initial render
- **Images**: Lazy loading with proper sizing
- **Animations**: Hardware-accelerated CSS transitions

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 **Contributing**

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 **Contact**

**ELITOS Team**
- Website: [elitos.com](https://elitos.com)
- Email: hello@elitos.com
- GitHub: [@raghavshahhh](https://github.com/raghavshahhh)

---

**Built with ❤️ by the ELITOS team**

*Affordable Luxe. For Everyone.*