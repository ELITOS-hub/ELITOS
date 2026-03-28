# Design Document: ELITOS E-commerce Website

## Overview

The ELITOS e-commerce website is a modern, React-based single-page application that embodies the brand's "Affordable Luxe. For Everyone." philosophy. The design prioritizes clean aesthetics, intuitive navigation, and seamless user experience across all devices. Built with React and Tailwind CSS, the website features a comprehensive shopping cart system, responsive design, and premium visual presentation that appeals to Gen-Z consumers seeking accessible luxury.

## Architecture

### Component Architecture

The application follows a modular React component architecture with clear separation of concerns:

```
ELITOSApp (Root Component)
├── Header (Navigation + Cart)
├── HeroSection
├── TrustStrip
├── WhyUsSection
├── FeaturedCollections
├── BestSellers
├── BrandPromise
├── AboutUs
└── Footer
```

### State Management

The application uses React's built-in state management with useState and useContext for cart functionality:

- **Local Component State**: Individual component interactions (hover states, mobile menu toggle)
- **Cart Context**: Global cart state shared across components using React Context API
- **Session State**: Cart persists during user session without external storage

### Data Flow

1. **Product Data**: Static product data defined as constants within components
2. **Cart Operations**: Actions flow through CartContext provider to update global cart state
3. **UI Updates**: Components subscribe to cart state changes via useContext hook
4. **Event Handling**: User interactions trigger state updates through event handlers

## Components and Interfaces

### Header Component
- **Purpose**: Primary navigation and cart access
- **State**: Mobile menu toggle, cart count display
- **Responsive Behavior**: Transforms to hamburger menu on mobile
- **Sticky Behavior**: Adds shadow on scroll, remains fixed at top

### Cart System
- **CartContext**: Provides cart state and operations globally
- **CartItem Interface**: `{ id: string, name: string, price: number, quantity: number, image: string }`
- **Cart Operations**: `addToCart(product)`, `removeFromCart(id)`, `updateQuantity(id, quantity)`
- **Cart State**: `{ items: CartItem[], totalItems: number, totalPrice: number }`

### Product Components
- **ProductCard**: Displays individual products with hover interactions
- **CollectionCard**: Shows featured collections with zoom effects
- **QuickAdd**: Overlay button for instant cart addition

### Layout Components
- **Section**: Reusable container with consistent spacing
- **Grid**: Responsive grid system for products and collections
- **Container**: Max-width wrapper with responsive padding

## Data Models

### Product Model
```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: 'footwear' | 'winterwear';
  featured?: boolean;
  bestseller?: boolean;
}
```

### Collection Model
```typescript
interface Collection {
  id: string;
  name: string;
  image: string;
  description?: string;
}
```

### Cart Item Model
```typescript
interface CartItem extends Product {
  quantity: number;
  addedAt: Date;
}
```

### User Interface State
```typescript
interface UIState {
  mobileMenuOpen: boolean;
  cartOpen: boolean;
  loading: boolean;
  error: string | null;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing all acceptance criteria, several properties can be consolidated to eliminate redundancy:

- Responsive grid properties (2.2, 2.3, 2.4) can be combined into a single comprehensive responsive behavior property
- Hover effect properties (3.5, 4.2, 4.4, 6.2) can be consolidated into one comprehensive hover interaction property
- Cart update properties (5.2, 5.4) can be combined since immediate updates are part of the increment behavior

### Correctness Properties

#### Core Functional Properties

Property 1: Scroll shadow application
*For any* scroll position greater than 0, the navigation component should have a shadow class applied
**Validates: Requirements 1.2**

Property 2: Responsive grid behavior
*For any* viewport width, the collection grid should display the correct number of columns: 4 columns for desktop (≥1024px), 2 columns for tablet (768px-1023px), and 1 column for mobile (<768px)
**Validates: Requirements 2.2, 2.3, 2.4**

Property 3: Hover interaction feedback
*For any* interactive element (collection cards, product cards, buttons), hovering should trigger a visual change (transform, opacity, or color change)
**Validates: Requirements 3.5, 4.2, 4.4, 6.2**

Property 4: Product card content completeness
*For any* product card, it should display a product image, product name, and price formatted with ₹ symbol
**Validates: Requirements 4.5**

Property 5: Cart increment and immediate update
*For any* product, clicking the "Quick Add" button should increment the cart count and update the badge display immediately
**Validates: Requirements 5.2, 5.4**

Property 6a: Cart state persistence during session
*For any* cart operation (add, remove, update), the cart state should persist throughout the user session without external storage
**Validates: Requirements 5.5**

Property 6b: Cart state integrity
*For any* cart state, the totalItems should equal the sum of all item quantities and totalPrice should equal the sum of all (price × quantity)
**Validates: Requirements 5.5**

Property 7: Mobile menu functionality
*For any* mobile viewport (<768px), clicking the hamburger menu should toggle the mobile navigation menu visibility
**Validates: Requirements 6.3**

Property 8: Error-free execution
*For any* user interaction or component rendering, no console errors should be produced during normal operation
**Validates: Requirements 8.4**

#### Accessibility Properties

Property 9: Keyboard navigation completeness
*For any* interactive element, it should be reachable and operable using only keyboard navigation (Tab, Enter, Escape, Arrow keys)
**Validates: Requirements 6.1, 6.2**

Property 10: Screen reader announcements
*For any* state change (cart updates, menu toggles, form submissions), appropriate ARIA announcements should be made for screen readers
**Validates: Requirements 6.2**

Property 11: Focus management
*For any* modal or overlay (mobile menu, cart dropdown), focus should be trapped within the component and return to the trigger element on close
**Validates: Requirements 6.3**

Property 12: Color contrast compliance
*For any* text element, the color contrast ratio should meet WCAG 2.1 AA standards (4.5:1 for normal text, 3:1 for large text)
**Validates: Requirements 3.1**

Property 13: Touch target accessibility
*For any* interactive element on touch devices, the minimum touch target size should be 44x44px
**Validates: Requirements 2.1**

#### Performance Properties

Property 14: Cumulative Layout Shift optimization
*For any* page load, the Cumulative Layout Shift (CLS) score should be less than 0.1
**Validates: Requirements 8.4**

Property 15: First Contentful Paint performance
*For any* initial page load, the First Contentful Paint (FCP) should occur within 1.8 seconds
**Validates: Requirements 8.4**

Property 16: Time to Interactive performance
*For any* page load, the Time to Interactive (TTI) should be less than 3.5 seconds
**Validates: Requirements 8.4**

Property 17: Image lazy loading behavior
*For any* product image below the fold, it should only load when within 200px of the viewport
**Validates: Requirements 3.4**

Property 18: Cart operation performance
*For any* cart operation (add, remove, update), the operation should complete within 100ms
**Validates: Requirements 5.2, 5.4**

#### Edge Case Properties

Property 19: Concurrent cart operations integrity
*For any* two cart operations occurring within 100ms of each other, the final cart state should be consistent without corruption
**Validates: Requirements 5.5**

Property 20: Extreme quantity handling
*For any* cart item with quantity greater than 999, the UI should display the quantity gracefully without layout breaking
**Validates: Requirements 5.2**

Property 21: Network failure resilience
*For any* network timeout or offline state, the application should display appropriate error messages and maintain functionality where possible
**Validates: Requirements 8.4**

Property 22: Race condition prevention
*For any* asynchronous cart update, subsequent operations should wait for completion to prevent race conditions
**Validates: Requirements 5.5**

#### Security Properties

Property 23: XSS prevention in user input
*For any* user-generated content (newsletter email, form inputs), the input should be sanitized to prevent XSS attacks
**Validates: Requirements 6.4**

Property 24: Price tampering prevention
*For any* product price display, the values should be validated against server-side data to prevent client-side tampering
**Validates: Requirements 4.5**

## Error Handling

### Cart Operations
- **Invalid Product Addition**: Gracefully handle attempts to add invalid or undefined products with specific error codes (CART_001: Invalid Product, CART_002: Out of Stock)
- **Quantity Validation**: Ensure cart quantities remain positive integers with automatic correction and user notification
- **State Corruption**: Implement safeguards against cart state corruption with automatic recovery and error logging
- **Concurrent Operations**: Queue cart operations to prevent race conditions with operation timeout of 5 seconds
- **Storage Failures**: Handle session storage failures with fallback to memory-only cart state

### UI Interactions
- **Image Loading Failures**: Provide fallback images for failed product image loads with retry mechanism (3 attempts)
- **Responsive Breakpoint Edge Cases**: Handle viewport size changes gracefully with debounced resize handlers
- **Touch Event Conflicts**: Prevent hover states from persisting on touch devices using pointer media queries
- **Animation Failures**: Gracefully degrade animations on low-performance devices using `prefers-reduced-motion`
- **Focus Loss**: Implement focus restoration after dynamic content updates

### Form Validation
- **Newsletter Email**: Validate email format using RFC 5322 compliant regex with real-time feedback
- **Empty Form Submission**: Prevent submission of empty newsletter forms with visual error indicators
- **Network Failures**: Handle newsletter subscription failures with retry mechanism and offline queue
- **Rate Limiting**: Implement client-side rate limiting for form submissions (1 per 30 seconds)

### Network and Performance
- **API Timeouts**: Handle API timeouts with exponential backoff retry strategy
- **Offline Mode**: Detect offline state and provide appropriate user feedback with cached content
- **Memory Leaks**: Prevent memory leaks from event listeners and subscriptions with proper cleanup
- **Bundle Loading**: Handle JavaScript bundle loading failures with fallback error page

### Security Error Handling
- **XSS Attempts**: Log and sanitize potential XSS attempts without exposing sensitive information
- **CSRF Protection**: Validate request origins and provide clear error messages for invalid requests
- **Content Security Policy**: Handle CSP violations with appropriate fallbacks and error reporting

## Testing Strategy

### Dual Testing Approach

The testing strategy employs both unit tests and property-based tests to ensure comprehensive coverage:

**Unit Tests**: Focus on specific examples, edge cases, and integration points
- Component rendering with specific props
- Cart operations with known products
- Responsive breakpoint behavior at exact pixel values
- Error conditions and edge cases

**Property-Based Tests**: Verify universal properties across all inputs
- Cart operations with randomly generated products
- Responsive behavior across random viewport sizes
- Hover interactions on randomly selected elements
- Form validation with various input combinations

### Property-Based Testing Configuration

- **Testing Library**: React Testing Library with Jest and fast-check for property-based testing
- **Minimum Iterations**: 100 iterations per property test
- **Test Tagging**: Each property test tagged with format: **Feature: elitos-ecommerce-website, Property {number}: {property_text}**
- **Generator Strategy**: Smart generators that constrain to valid input spaces (valid products, realistic viewport sizes, appropriate user interactions)

### Test Tooling and Infrastructure

#### Core Testing Stack
- **Unit Testing**: Jest 29+ with React Testing Library
- **Property-Based Testing**: fast-check for comprehensive input generation
- **E2E Testing**: Playwright for cross-browser automation
- **Visual Regression**: Percy or Chromatic for UI consistency
- **Performance Testing**: Lighthouse CI for Core Web Vitals monitoring
- **Accessibility Testing**: axe-core with jest-axe for automated a11y checks

#### Test Coverage Targets
- **Line Coverage**: Minimum 90% for all source files
- **Branch Coverage**: Minimum 85% for conditional logic
- **Function Coverage**: 100% for public API methods
- **Statement Coverage**: Minimum 90% overall
- **Property Test Coverage**: All 24 correctness properties must have corresponding tests

#### CI/CD Integration Strategy
```yaml
# Example GitHub Actions workflow
test-pipeline:
  - unit-tests: Jest with coverage reporting
  - property-tests: fast-check with 1000 iterations in CI
  - e2e-tests: Playwright across Chrome, Firefox, Safari
  - visual-tests: Percy snapshots on PR
  - performance-tests: Lighthouse CI with budget enforcement
  - accessibility-tests: axe-core audit with WCAG 2.1 AA compliance
```

#### Test Data Generation Approach
```typescript
// Property-based test generators
const productGenerator = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 50 }),
  price: fc.integer({ min: 100, max: 50000 }),
  category: fc.constantFrom('footwear', 'winterwear'),
  image: fc.webUrl()
});

const viewportGenerator = fc.record({
  width: fc.integer({ min: 320, max: 1920 }),
  height: fc.integer({ min: 568, max: 1080 })
});
```

### Testing Coverage Areas

#### Component Integration Testing
- Header navigation and cart integration with mock cart context
- Product grid and cart system interaction with state verification
- Mobile menu and responsive behavior coordination across breakpoints
- Form submission and validation with various input scenarios

#### State Management Testing
- Cart context provider functionality with concurrent operations
- State updates and UI synchronization with React Testing Library
- Session persistence without external storage using memory mocks
- Error boundary behavior with intentional component failures

#### User Experience Testing
- Smooth animations and transitions with reduced-motion preferences
- Touch and mouse interaction compatibility using pointer events
- Accessibility compliance with axe-core automated testing
- Keyboard navigation completeness with focus management verification

#### Performance Testing Methodology
```typescript
// Performance budget enforcement
const performanceBudgets = {
  FCP: 1800, // First Contentful Paint < 1.8s
  TTI: 3500, // Time to Interactive < 3.5s
  CLS: 0.1,  // Cumulative Layout Shift < 0.1
  bundleSize: 250000, // Initial bundle < 250KB
  cartOperationTime: 100 // Cart operations < 100ms
};
```

#### Cross-Browser Compatibility Matrix
- **Chrome**: Latest 2 versions + Chrome 90+ (90% market share)
- **Safari**: Latest 2 versions + Safari 14+ (iOS compatibility)
- **Firefox**: Latest 2 versions + Firefox 88+
- **Edge**: Latest 2 versions (Chromium-based)
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+

#### Mobile Device Testing
- **iOS**: iPhone 12/13/14 (Safari), iPad Air (Safari)
- **Android**: Pixel 5/6 (Chrome), Samsung Galaxy S21/S22 (Samsung Internet)
- **Responsive Testing**: 320px to 1920px width range
- **Touch Testing**: Minimum 44x44px touch targets verification

#### Visual Regression Testing
- **Tool**: Percy for automated visual comparisons
- **Baseline Strategy**: Main branch snapshots as baseline
- **Failure Threshold**: 0.1% pixel difference tolerance
- **Coverage**: All major UI states and responsive breakpoints

#### Load Testing Benchmarks
- **Concurrent Users**: 100 simultaneous cart operations
- **Response Time**: 95th percentile < 200ms for cart operations
- **Throughput**: 1000 requests per minute sustained
- **Memory Usage**: < 50MB heap size after 1000 operations

#### Internationalization Testing Readiness
- **Currency Formatting**: ₹ symbol with proper number formatting
- **RTL Support**: CSS logical properties for future Arabic/Hebrew support
- **Text Expansion**: 30% buffer for translated content
- **Date/Time**: Locale-aware formatting preparation

## Non-Functional Requirements

### Performance Budgets

#### Load Time Requirements
- **First Contentful Paint (FCP)**: < 1.8 seconds on 3G connection
- **Largest Contentful Paint (LCP)**: < 2.5 seconds for above-the-fold content
- **Time to Interactive (TTI)**: < 3.5 seconds for full interactivity
- **First Input Delay (FID)**: < 100ms for user interactions
- **Cumulative Layout Shift (CLS)**: < 0.1 for visual stability

#### Bundle Size Constraints
- **Initial Bundle**: < 250KB gzipped for critical path
- **Total JavaScript**: < 500KB for complete application
- **CSS Bundle**: < 50KB for all styles
- **Image Assets**: WebP format with < 100KB per product image
- **Font Loading**: < 30KB for custom fonts with font-display: swap

#### Runtime Performance
- **Cart Operations**: < 100ms for add/remove/update operations
- **Search/Filter**: < 200ms for product filtering
- **Page Transitions**: < 16ms frame time for 60fps animations
- **Memory Usage**: < 50MB heap size after 1000 cart operations
- **CPU Usage**: < 30% on mid-range mobile devices

### Accessibility Compliance

#### WCAG 2.1 AA Standards
- **Color Contrast**: 4.5:1 ratio for normal text, 3:1 for large text
- **Keyboard Navigation**: Full functionality without mouse
- **Screen Reader Support**: ARIA labels and announcements
- **Focus Management**: Visible focus indicators and logical tab order
- **Touch Targets**: Minimum 44x44px for interactive elements
- **Text Scaling**: Readable at 200% zoom without horizontal scrolling

#### Assistive Technology Support
- **Screen Readers**: NVDA, JAWS, VoiceOver compatibility
- **Voice Control**: Dragon NaturallySpeaking support
- **Switch Navigation**: Single-switch and dual-switch support
- **High Contrast**: Windows High Contrast mode compatibility
- **Reduced Motion**: Respect prefers-reduced-motion settings

### Browser Support Matrix

#### Desktop Browsers (Minimum Versions)
- **Chrome**: 90+ (Released April 2021)
- **Firefox**: 88+ (Released April 2021)
- **Safari**: 14+ (Released September 2020)
- **Edge**: 90+ (Chromium-based, Released April 2021)

#### Mobile Browsers
- **iOS Safari**: 14+ (iOS 14+)
- **Chrome Mobile**: 90+ (Android 7+)
- **Samsung Internet**: 14+ (Android 7+)
- **Firefox Mobile**: 88+ (Android 7+)

#### Progressive Enhancement Strategy
- **Core Functionality**: Works without JavaScript (server-side rendering)
- **Enhanced Experience**: Full interactivity with JavaScript enabled
- **Modern Features**: Advanced animations and interactions on supported browsers
- **Graceful Degradation**: Fallbacks for unsupported features

### SEO Requirements

#### Technical SEO
- **Meta Tags**: Title, description, Open Graph, Twitter Cards
- **Structured Data**: JSON-LD for products, organization, breadcrumbs
- **Sitemap**: XML sitemap with product and category pages
- **Robots.txt**: Proper crawling directives
- **Canonical URLs**: Prevent duplicate content issues

#### Performance SEO
- **Core Web Vitals**: Meet Google's performance thresholds
- **Mobile-First Indexing**: Optimized for mobile crawling
- **Page Speed**: < 3 seconds load time for SEO ranking
- **Image Optimization**: Alt text, proper sizing, lazy loading
- **Internal Linking**: Logical site structure and navigation

#### Content SEO
- **Semantic HTML**: Proper heading hierarchy (H1-H6)
- **URL Structure**: Clean, descriptive URLs
- **Content Quality**: Unique product descriptions and category content
- **Local SEO**: Business information and location data
- **Social Sharing**: Open Graph and Twitter Card optimization

### Security Considerations

#### Client-Side Security
- **Content Security Policy (CSP)**: Strict CSP headers to prevent XSS
- **Input Sanitization**: All user inputs sanitized and validated
- **HTTPS Enforcement**: All traffic over secure connections
- **Secure Cookies**: HttpOnly and Secure flags for session cookies
- **Subresource Integrity**: SRI for external scripts and stylesheets

#### Data Protection
- **Privacy Compliance**: GDPR and CCPA compliance for user data
- **Cookie Consent**: Clear consent mechanism for tracking cookies
- **Data Minimization**: Collect only necessary user information
- **Secure Storage**: No sensitive data in localStorage or sessionStorage
- **Third-Party Scripts**: Audit and minimize external dependencies

#### API Security (Future Backend Integration)
- **Authentication**: JWT tokens with proper expiration
- **Authorization**: Role-based access control for admin functions
- **Rate Limiting**: Prevent abuse of API endpoints
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Proper cross-origin resource sharing setup

## Deployment & Monitoring

### Deployment Strategy

#### Environment Configuration
```yaml
# Environment hierarchy
development:
  - Local development with hot reload
  - Mock data and services
  - Debug logging enabled
  - Source maps included

staging:
  - Production-like environment
  - Real data subset for testing
  - Performance monitoring enabled
  - User acceptance testing

production:
  - Optimized builds with minification
  - CDN distribution for static assets
  - Error tracking and monitoring
  - A/B testing infrastructure
```

#### Continuous Integration/Continuous Deployment
```yaml
# CI/CD Pipeline stages
build:
  - Install dependencies (npm ci)
  - Run linting (ESLint, Prettier)
  - Type checking (TypeScript)
  - Unit tests with coverage
  - Build optimization

test:
  - Property-based tests (1000 iterations)
  - E2E tests (Playwright)
  - Visual regression tests (Percy)
  - Performance audits (Lighthouse)
  - Accessibility tests (axe-core)

deploy:
  - Staging deployment for QA
  - Production deployment with blue-green strategy
  - CDN cache invalidation
  - Health checks and rollback capability
```

#### Deployment Infrastructure
- **Hosting**: Vercel or Netlify for static site deployment
- **CDN**: CloudFlare for global content distribution
- **DNS**: Route 53 or CloudFlare DNS with health checks
- **SSL/TLS**: Automatic certificate management
- **Monitoring**: Uptime monitoring with 99.9% SLA target

### Error Tracking and Monitoring

#### Error Tracking Configuration
```typescript
// Sentry configuration for error tracking
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  beforeSend(event) {
    // Filter out non-critical errors
    if (event.exception) {
      const error = event.exception.values[0];
      if (error.type === 'ChunkLoadError') {
        return null; // Ignore chunk loading errors
      }
    }
    return event;
  }
});
```

#### LogRocket Session Replay
```typescript
// LogRocket configuration for user session recording
import LogRocket from 'logrocket';

LogRocket.init('app-id', {
  shouldCaptureIP: false,
  console: {
    shouldAggregateConsoleErrors: true,
  },
  network: {
    requestSanitizer: request => {
      // Sanitize sensitive data from network requests
      if (request.headers['authorization']) {
        request.headers['authorization'] = '[REDACTED]';
      }
      return request;
    }
  }
});
```

### Performance Monitoring

#### Core Web Vitals Tracking
```typescript
// Web Vitals monitoring with Google Analytics
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  gtag('event', metric.name, {
    event_category: 'Web Vitals',
    event_label: metric.id,
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    non_interaction: true,
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

#### Real User Monitoring (RUM)
- **Performance Metrics**: Track actual user experience data
- **Error Rates**: Monitor JavaScript errors and failed requests
- **User Flows**: Track conversion funnel and cart abandonment
- **Device Performance**: Monitor performance across different devices
- **Geographic Performance**: Track performance by user location

#### Synthetic Monitoring
- **Uptime Monitoring**: Pingdom or StatusCake for 24/7 availability
- **Performance Monitoring**: Lighthouse CI for continuous performance audits
- **Functional Monitoring**: Automated tests for critical user journeys
- **API Monitoring**: Health checks for backend services (future)

### A/B Testing Infrastructure

#### Feature Flag System
```typescript
// Feature flag configuration with LaunchDarkly or similar
interface FeatureFlags {
  newCheckoutFlow: boolean;
  enhancedProductCards: boolean;
  personalizedRecommendations: boolean;
  cartAbandonmentPopup: boolean;
}

const useFeatureFlag = (flagName: keyof FeatureFlags): boolean => {
  return featureFlagClient.variation(flagName, false);
};
```

#### A/B Test Framework
- **Test Planning**: Hypothesis-driven testing with success metrics
- **Statistical Significance**: Minimum 95% confidence level
- **Sample Size**: Calculated based on expected effect size
- **Test Duration**: Minimum 2 weeks for statistical validity
- **Segmentation**: User cohorts based on device, location, behavior

#### Experimentation Metrics
- **Conversion Rate**: Cart additions, checkout completions
- **User Engagement**: Time on site, pages per session
- **Performance Impact**: Core Web Vitals during experiments
- **Revenue Impact**: Average order value, total revenue
- **User Experience**: Bounce rate, task completion rate

### Analytics and Business Intelligence

#### Google Analytics 4 Configuration
```typescript
// Enhanced ecommerce tracking
gtag('event', 'add_to_cart', {
  currency: 'INR',
  value: product.price,
  items: [{
    item_id: product.id,
    item_name: product.name,
    category: product.category,
    quantity: 1,
    price: product.price
  }]
});
```

#### Custom Analytics Events
- **User Interactions**: Button clicks, form submissions, scroll depth
- **Product Performance**: View rates, add-to-cart rates, conversion rates
- **Search Behavior**: Search queries, result interactions, refinements
- **Error Tracking**: User-facing errors, recovery actions
- **Performance Events**: Slow page loads, failed requests, timeouts

#### Business Intelligence Dashboard
- **Key Performance Indicators**: Conversion rate, average order value, cart abandonment
- **User Behavior Analysis**: Heat maps, user journey analysis, funnel visualization
- **Product Performance**: Best sellers, low performers, category trends
- **Technical Health**: Error rates, performance trends, uptime statistics
- **Marketing Attribution**: Traffic sources, campaign effectiveness, ROI tracking