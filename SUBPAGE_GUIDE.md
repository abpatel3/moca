# MOCA Art India: Design System & Subpage Guide

This guide documents the premium design language, components, and animation patterns used in the MOCA website. Use these standards to maintain consistency across all subpages.

---

## 🎨 1. Color Palette

Use these CSS variables (defined in `assets/css/input.css` via Tailwind 4.0 `@theme`) for all elements.

| Role | Color | Hex | Tailwind Class |
| :--- | :--- | :--- | :--- |
| **Background/Surface** | Beige/Ecru | `#faf5ef` | `bg-surface` |
| **Primary Text/Dark** | Black | `#000000` | `text-primary` |
| **Secondary Text** | Dark Gray | `#333333` | `text-secondary` |
| **Accent/Gold** | Muted Gold | `#b4924c` | `text-gold` / `bg-gold` |
| **Border** | Soft Gray | `#e0e0e0` | `border-border` |
| **White** | True White | `#ffffff` | `bg-white` |

---

## 🏗️ 2. Typography

MOCA uses a sophisticated pairing of Serif and Sans-Serif fonts.

- **Primary Headings**: `font-serif` (Playfair Display)
- **Body & Metadata**: `font-sans` (Inter)

### Heading Standards
- **Section Titles**: `font-serif text-3xl md:text-5xl text-primary leading-tight`
- **Subtitles (Uppercase)**: `text-[10px] font-black uppercase tracking-[0.5em] text-gold mb-6`
- **Card Titles**: `font-serif text-2xl mb-1`
- **Hero Titles**: `font-serif text-5xl md:text-7xl mb-8 leading-tight` (often with `italic` spans)

---

## 🧱 3. UI Components

### 3.1 Standard Buttons
#### The Action Button (Premium)
```html
<a href="..." class="bg-primary text-white px-8 py-4 rounded-full text-sm font-medium hover:bg-gold transition-all flex items-center gap-3 w-fit">
    <span>GET TICKETS</span>
    <i class="fas fa-arrow-right text-[10px]"></i>
</a>
```

#### The Outline/Secondary Button
```html
<a href="..." class="bg-surface text-primary px-8 py-4 rounded-full text-[12px] font-semibold uppercase tracking-[0.2em] border border-black/5 hover:border-gold transition-all flex items-center gap-3 w-fit">
    <span>LEARN MORE</span>
</a>
```

### 3.2 Content Cards
- **Radius**: `rounded-4xl` (2rem)
- **Shadow**: `shadow-xl` or `shadow-2xl`
- **Animation Class**: `reveal-card`

```html
<div class="group cursor-pointer reveal-card">
    <div class="rounded-4xl overflow-hidden aspect-4/3 mb-8 relative shadow-xl">
        <img class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" src="..." alt="...">
    </div>
    <div class="px-4">
        <h3 class="font-serif text-3xl mb-4">Title</h3>
        <p class="text-secondary text-sm">Description...</p>
    </div>
</div>
```

### 3.3 Breadcrumbs
Used at the top of detail pages for navigation.
```html
<nav class="mb-12 flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.2em] text-secondary">
    <a href="./index.html" class="hover:text-gold transition-colors">Museum</a>
    <i class="fas fa-chevron-right text-[7px] opacity-30"></i>
    <span class="text-gold">Current Page</span>
</nav>
```

---

## ✨ 4. Animation Patterns (GSAP)

The following classes are automatically picked up by `assets/js/gsap.js` to animate elements using ScrollTrigger.

| Class | Effect | Applied to... |
| :--- | :--- | :--- |
| `reveal-subtitle` | Fade in + Slide Up | Small uppercase labels |
| `reveal-title` | Word-by-word reveal (SplitType) | Main section headings |
| `reveal-line` | Width expansion (0% to 100%) | Decorative gold lines |
| `reveal-text` | Fade in + Slide up | Paragraphs / Block text |
| `reveal-btn` | Fade in + Slide up | Call to action buttons |
| `reveal-card` | Staggered slide up + Scale | Image cards / Grid items |

### Custom CSS Utilities
- **Ken Burns**: `.animate-ken-burns` (Apply to hero images for a slow, premium zoom)
- **Hover Scale**: `transition-transform duration-1000 group-hover:scale-105`

---

## 📄 5. Subpage Starter Template

Use this structure for every new subpage to ensure consistency.

```html
<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Title | MOCA Gandhinagar</title>
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="./assets/css/style.css">
</head>
<body class="font-sans antialiased text-primary selection:bg-primary selection:text-white bg-surface">

    <!-- Header (Copy from index.html) -->
    
    <main id="main-content">
        
        <!-- Subpage Hero/Banner -->
        <section class="relative h-[60vh] flex items-center justify-center overflow-hidden bg-primary text-white subpage-banner">
            <div class="absolute inset-0 opacity-20">
                <img class="w-full h-full object-cover animate-ken-burns" src="./assets/img/hero-placeholder.webp" alt="Banner">
            </div>
            <div class="relative container mx-auto px-3 text-center">
                <span class="sp-subtitle text-gold! mb-6 block reveal-subtitle">CATEGORY</span>
                <h1 class="sp-title font-serif text-5xl md:text-7xl mb-8 leading-tight reveal-title">
                    Page <span class="italic font-light">Title</span>
                </h1>
            </div>
        </section>

        <!-- Main Content Section -->
        <section class="py-24 bg-white">
            <div class="container mx-auto px-3">
                <!-- Content goes here -->
            </div>
        </section>

    </main>

    <!-- Footer (Copy from index.html) -->

    <!-- Scripts -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
    <script src="https://unpkg.com/split-type"></script>
    <script src="./assets/js/main.js"></script>
    <script src="./assets/js/gsap.js"></script>
</body>
</html>
```

---

## 🚀 6. Best Practices

1. **Section Spacing**: Always use `py-24` or `py-32` for sections to maintain "breathability" and a premium institutional feel.
2. **Container Consistency**: Always wrap content in `<div class="container mx-auto px-3">` for alignment.
3. **Interactive States**: Use `transition-all duration-500` or `duration-1000` for all hover effects.
4. **Image Treatments**: Apply `rounded-4xl` and `shadow-2xl` to large featured images.
5. **Color Usage**: Stick to the `@theme` variables. Avoid hardcoded hex codes.
6. **Responsive Design**: Use Tailwind's `md:` and `lg:` prefixes to ensure layouts adapt beautifully to tablet and mobile.
