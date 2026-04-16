# MOCA Art India: Design System & Subpage Guide

This guide documents the premium design language, components, and animation patterns used in the MOCA homepage. Use these standards to maintain consistency across all subpages.

---

## 🎨 1. Color Palette

Use these CSS variables (defined in `assets/css/input.css`) for all elements.

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
- **Subtitles**: `text-[10px] font-black uppercase tracking-[0.5em] text-gold mb-6`
- **Card Titles**: `font-serif text-2xl mb-1`

---

## 🧱 3. UI Components

### 3.1 Standard Buttons
#### The Text Button (with Animated Line)
```html
<button class="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.4em] text-primary group/btn transition-all about-btn">
    <span>VIEW ALL</span>
    <div class="w-12 h-px bg-gold transform group-hover/btn:translate-x-3 transition-transform duration-500"></div>
</button>
```

#### The Filled Button (Premium)
```html
<button class="bg-primary px-8 py-4 rounded-full text-sm font-medium text-white hover:bg-gold transition-all flex items-center gap-2 shadow-lg">
    <span>GET TICKETS</span>
    <i class="fas fa-arrow-right text-[10px]"></i>
</button>
```

### 3.2 Content Cards
- **Radius**: `rounded-4xl` (2rem) or `rounded-[2.5rem]`
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

---

## ✨ 4. Animation Patterns (GSAP)

The following classes are automatically picked up by `assets/js/animations.js` to animate elements as they enter the viewport.

| Class | Effect | Applied to... |
| :--- | :--- | :--- |
| `reveal-subtitle` | Fade in + Tracking expand | Small uppercase labels |
| `reveal-title` | Word-by-word reveal | Main section headings |
| `reveal-line` | Width expansion | Decorative gold lines |
| `reveal-text` | Fade in + Slide up | Paragraphs |
| `reveal-btn` | Fade in + Slide up | Call to action buttons |
| `reveal-card` | Staggered slide up + Scale | Image cards/Grid items |

### Custom CSS Transitions (Utility)
- **Hover Scale**: `.hover-scale { @apply transition-transform duration-700 hover:scale-[1.02]; }`
- **Ken Burns**: `.animate-ken-burns` (Apply to hero images for slow zoom)

---

## 📄 5. Subpage Starter Template

Use this structure for every new page to ensure the header and layout remain consistent.

```html
<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <!-- Standard Meta/Scripts from index.html -->
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body class="font-sans antialiased text-primary selection:bg-primary selection:text-white bg-surface">

    <!-- Header (Copy from index.html) -->
    
    <main class="pt-32"> <!-- Offset for fixed header -->
        
        <!-- Hero Section -->
        <section class="py-20 md:py-32">
            <div class="max-w-[1440px] mx-auto px-6 lg:px-12">
                <span class="reveal-subtitle">CATEGORY</span>
                <h1 class="reveal-title font-serif text-5xl md:text-7xl mb-8">Page Title</h1>
                <p class="reveal-text text-xl max-w-2xl text-secondary">Introduction text goes here.</p>
            </div>
        </section>

        <!-- Content Section -->
        <section class="py-20 bg-white">
            <div class="max-w-[1440px] mx-auto px-6 lg:px-12">
                <!-- Grid of reveal-cards -->
            </div>
        </section>

    </main>

    <!-- Footer (Copy from index.html) -->

    <!-- Scripts -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
    <script src="assets/js/animations.js"></script>
</body>
</html>
```

---

## 🚀 6. Best Practices

1. **Section Spacing**: Always use `py-16 md:py-24` or `py-24` for sections to maintain "breathability."
2. **Image Quality**: Use high-resolution images. Apply `object-cover` and `rounded-4xl` for consistent visual weight.
3. **Typography Tracking**: For uppercase text, always use `tracking-widest` or specific `tracking-[0.5em]` to match the premium aesthetic.
4. **Interactive States**: Every interactive element should have a transition (usually `duration-500` or `duration-700`).
