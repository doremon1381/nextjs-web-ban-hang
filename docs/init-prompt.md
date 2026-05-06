Create a modern, high-converting agriculture e-commerce web application using **Next.js (React)** and **Tailwind CSS**, fully optimized for SEO, performance, and scalability.

---

# 1. PROJECT CONTEXT

The platform sells:

* Fresh fruits and vegetables
* Herbs and organic products
* Regional agricultural specialties (Vietnam-focused)

Target users:

* Urban consumers (age 25–45)
* Health-conscious buyers
* Families purchasing daily food

Primary goals:

* Maximize organic search traffic (SEO-first architecture)
* Build strong trust (food safety, origin transparency)
* Achieve high conversion rate

---

# 2. TECH STACK (MANDATORY)

* Framework: Next.js (App Router)
* Styling: Tailwind CSS
* Rendering strategy:

  * SSR for product pages
  * SSG for category pages
  * ISR for scalability
* Image handling: next/image
* State: lightweight (React hooks or Zustand)
* Deployment-ready structure

---

# 3. DESIGN SYSTEM

## Color Palette

* Primary: Green (#16A34A)
* Light green: (#DCFCE7)
* Accent CTA: Orange (#F97316)
* Earth tone: Brown (#92400E)
* Neutral: White + Gray scale

## Typography

* Headings: Inter / Poppins (bold, modern)
* Body: clean, readable

## Style Direction

* Minimalist (Apple-like)
* Clean grocery UI (Instacart-inspired)
* Organic/natural branding (Whole Foods style)

---

# 4. CORE LAYOUT STRUCTURE

## HEADER

* Logo (farm/leaf icon)
* Search bar (central focus, autocomplete enabled)
* Navigation:

  * Fruits
  * Vegetables
  * Organic
  * Specialties
* Cart icon
* User login
* Sticky on scroll

---

## HERO SECTION

* Large farm-to-table imagery
* Headline: “From Farm to Your Table”
* CTA buttons:

  * Shop Now
  * Explore Products

---

## TRUST SECTION

Display icons + short text:

* 100% Fresh Guarantee
* Certified Safe / Organic
* Fast Delivery (2–4 hours)
* Direct from Farmers

---

## CATEGORY GRID

* Visual cards with images
* Hover animations
* Mobile responsive grid

---

## FEATURED PRODUCTS

Product card must include:

* Image (high quality)
* Name
* Price
* Rating
* CTA: Add to Cart
* Wishlist button

---

## STORY SECTION (IMPORTANT)

* Farm storytelling
* Farmer images
* Emotional branding

---

## PRODUCT DETAIL PAGE

* Image gallery
* Price + weight selector
* Sticky Add-to-Cart (mobile)
* Tabs:

  * Description
  * Nutrition
  * Origin
  * Reviews

---

## SOCIAL PROOF

* Customer reviews
* Real user images

---

## FOOTER

* Contact info
* Policies
* Social links

---

# 5. SEO & TECHNICAL REQUIREMENTS (CRITICAL)

## 5.1 RENDERING STRATEGY

* Use:

  * SSR for dynamic product pages
  * SSG for categories
  * ISR for updates

---

## 5.2 URL STRUCTURE (STRICT RULES)

Use clean, keyword-rich URLs:

* /trai-cay/[product-slug]
* /rau-cu/[product-slug]
* /dac-san/[product-slug]

Rules:

* Lowercase
* Hyphen-separated
* No query params for indexable pages

---

## 5.3 META TAG SYSTEM

Each page MUST dynamically generate:

* <title> (Product name + category)
* Meta description (150–160 chars)
* Open Graph:

  * og:title
  * og:description
  * og:image
* Twitter card metadata

---

## 5.4 STRUCTURED DATA (JSON-LD)

Implement schema.org markup:

### Product Schema:

* name
* image
* description
* brand
* price
* availability
* aggregateRating

### Additional schemas:

* BreadcrumbList
* Organization

---

## 5.5 INTERNAL LINKING

* Related products section
* “Customers also bought”
* Breadcrumb navigation
* Category linking on product pages

---

## 5.6 CONTENT SEO BLOCKS

Each category page must include:

* 300–800 words SEO content:

  * Benefits
  * Usage
  * Storage tips

* FAQ section:

  * With structured data (FAQ schema)

---

## 5.7 IMAGE SEO

* Use next/image
* WebP format
* Lazy loading
* Descriptive alt text (Vietnamese keywords)

---

## 5.8 PERFORMANCE (CORE WEB VITALS)

Target:

* LCP < 2.5s
* CLS < 0.1
* INP < 200ms

Techniques:

* Code splitting
* Lazy loading
* CDN-ready assets

---

## 5.9 SITEMAP & ROBOTS

* Auto-generate sitemap.xml
* Include:

  * Categories
  * Products
* robots.txt optimized for indexing

---

## 5.10 FILTER & PAGINATION SEO

* Use canonical tags
* Noindex filtered URLs

---

## 5.11 MULTILINGUAL SEO (OPTIONAL)

* Support:

  * Vietnamese (primary)
  * English (secondary)
* Add hreflang tags

---

## 5.12 BLOG / CONTENT HUB

Create blog system:

* Recipes
* Health benefits
* Farming stories

Optimize for:

* Long-tail keywords
* Topic clusters

---

# 6. UX & CONVERSION OPTIMIZATION

* Large clickable buttons
* Clear CTA hierarchy
* Minimal clutter
* Mobile-first design
* Sticky cart drawer
* Fast checkout flow

---

# 7. COMPONENT ARCHITECTURE

Organize code into:

/components

* Navbar
* ProductCard
* CategoryCard
* Footer

/pages or /app

* Home
* Category
* Product
* Blog

/layouts

* MainLayout

---

# 8. ADVANCED FEATURES (BONUS)

* Search autocomplete
* Filter sidebar:

  * Price
  * Category
  * Origin
* Wishlist system
* Recently viewed products

---

# 9. OUTPUT REQUIREMENTS

The AI must:

1. Generate full component structure
2. Include Tailwind classes
3. Implement:

   * SEO metadata logic
   * JSON-LD schema example
   * Dynamic routing (Next.js)
4. Provide example:

   * Product page
   * Category page
5. Ensure code is clean, reusable, and scalable

---

# 10. FINAL GOAL

Build a website that:

* Outperforms traditional agriculture e-commerce sites
* Ranks highly on Google (SEO-first)
* Feels modern, trustworthy, and premium
* Maximizes conversion and user engagement
