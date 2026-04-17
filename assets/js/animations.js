/**
 * ============================================================================
 * MOCA Art India — Unified GSAP Animations
 * ============================================================================
 *
 * This single file consolidates ALL animation logic for the entire MOCA site.
 * It replaces the previously separate files:
 *   - gsap-core.js       (core utilities & shared animation helpers)
 *   - page-index.js      (homepage hero slider + about section)
 *   - page-about.js      (about page — shared reveal only)
 *   - page-contact.js    (contact page + team swiper)
 *   - page-events.js     (events page + category filtering)
 *   - page-event-detail.js
 *   - page-gallery.js
 *   - page-press.js      (press page + category filtering)
 *   - page-residency.js
 *   - page-shop.js       (shop page + category filtering)
 *   - page-shop-detail.js (lightbox functionality)
 *   - page-workshop.js
 *
 * MOBILE FIX NOTES:
 *   1. ScrollTrigger.refresh() is called multiple times with staggered delays
 *      to handle mobile browser viewport changes (address bar show/hide).
 *   2. All fromTo animations use `clearProps: "all"` to prevent leftover
 *      inline styles from breaking layout on resize/orientation changes.
 *   3. A `prefers-reduced-motion` check is included to skip heavy animations
 *      on devices that request reduced motion.
 *   4. `ScrollTrigger.config({ ignoreMobileResize: true })` prevents
 *      unnecessary recalculations when the mobile address bar toggles.
 *
 * Dependencies (loaded via CDN in each HTML page's <head>):
 *   - GSAP 3.12.5+
 *   - ScrollTrigger plugin
 *   - Swiper 11+ (for sliders — loaded separately)
 *
 * ============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================================
     * SECTION 1: CONFIGURATION & HELPERS
     * ========================================================================= */

    /**
     * Check if the user prefers reduced motion (accessibility).
     * If true, we'll skip scroll-triggered animations and use instant reveals.
     */
    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    /**
     * Detect if the device is a touch/mobile device.
     * Used to apply mobile-specific animation optimizations.
     */
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
        || (navigator.maxTouchPoints && navigator.maxTouchPoints > 1);


    /* =========================================================================
     * SECTION 2: GSAP & SCROLLTRIGGER INITIALIZATION
     * ========================================================================= */

    /**
     * Register ScrollTrigger and configure it for smooth mobile behavior.
     * - `limitCallbacks: true` prevents excessive callback firing during scroll.
     * - `ignoreMobileResize: true` prevents jank when the mobile browser's
     *   address bar shows/hides (which changes viewport height).
     */
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({
        limitCallbacks: true,
        ignoreMobileResize: true,
        autoRefreshEvents: "visibilitychange,DOMContentLoaded,load,resize" // More robust refresh
    });

    // iOS Safari Fix: Normalize scroll behavior to prevent address bar jank
    if (isMobile) {
        ScrollTrigger.normalizeScroll(true);
    }

    /**
     * Refresh ScrollTrigger positions after all assets are loaded.
     * Multiple staggered refreshes ensure images, fonts, and lazy content
     * have settled — especially important on slower mobile connections.
     */
    window.addEventListener("load", () => {
        ScrollTrigger.refresh();

        // Second refresh after 500ms — catches late-loading images
        setTimeout(() => ScrollTrigger.refresh(), 500);

        // Third refresh after 1.5s — final safety net for mobile browsers
        if (isMobile) {
            setTimeout(() => ScrollTrigger.refresh(), 1500);
        }
    });

    /**
     * Re-refresh on orientation change (mobile devices rotating).
     * Without this, trigger positions can be completely wrong after rotation.
     */
    window.addEventListener("orientationchange", () => {
        setTimeout(() => ScrollTrigger.refresh(), 300);
    });


    /* =========================================================================
     * SECTION 3: TEXT SPLITTING UTILITIES
     * ========================================================================= */

    /**
     * splitLetters(selector)
     * ---------------------
     * Splits text inside matching elements into individual <span> characters.
     * Used for the hero title animation where each letter animates in.
     *
     * DOM structure after splitting:
     *   <span class="word">
     *     <span class="char">H</span>
     *     <span class="char">e</span>
     *     <span class="char">l</span>
     *     ...
     *   </span>
     *   <span class="char">&nbsp;</span>   ← space between words
     *
     * @param {string} selector - CSS selector for elements to split
     */
    const splitLetters = (selector) => {
        const elements = document.querySelectorAll(selector);

        elements.forEach(el => {
            // Skip if already split (prevents double-processing)
            if (el.dataset.split) return;
            el.dataset.split = "true";

            const nodes = Array.from(el.childNodes);

            /**
             * Recursively process each DOM node:
             *   - Text nodes → split into word spans > char spans
             *   - Element nodes → recurse into children (except <br>)
             */
            const processNode = (node, index, total) => {
                if (node.nodeType === 3) {
                    // --- Text Node ---
                    let text = node.textContent
                        .replace(/[\n\r]/g, "")  // Remove line breaks
                        .replace(/\s+/g, " ");   // Collapse whitespace

                    // Trim leading/trailing spaces on first/last nodes
                    if (index === 0) text = text.trimStart();
                    if (index === total - 1) text = text.trimEnd();
                    if (!text) return;

                    const fragment = document.createDocumentFragment();
                    const words = text.split(" ");

                    words.forEach((word, wIdx) => {
                        if (word) {
                            // Create a wrapper span for the whole word
                            const wordSpan = document.createElement("span");
                            wordSpan.className = "word inline-block whitespace-nowrap";

                            // Create individual character spans
                            Array.from(word).forEach(char => {
                                const charSpan = document.createElement("span");
                                charSpan.className = "char inline-block pointer-events-none";
                                charSpan.textContent = char;
                                wordSpan.appendChild(charSpan);
                            });

                            fragment.appendChild(wordSpan);

                            // Add a non-breaking space between words
                            if (wIdx < words.length - 1) {
                                const space = document.createElement("span");
                                space.className = "char inline-block";
                                space.innerHTML = "&nbsp;";
                                fragment.appendChild(space);
                            }
                        }
                    });

                    node.parentNode.replaceChild(fragment, node);

                } else if (node.nodeType === 1) {
                    // --- Element Node --- (recurse, but skip <br> tags)
                    if (node.tagName !== "BR") {
                        Array.from(node.childNodes).forEach((child, i, arr) =>
                            processNode(child, i, arr.length)
                        );
                    }
                }
            };

            nodes.forEach((node, i) => processNode(node, i, nodes.length));
        });
    };


    /**
     * splitWords(selector)
     * --------------------
     * Splits text into word-level spans with an overflow-hidden container.
     * This enables the "words slide up from behind a mask" reveal effect.
     *
     * DOM structure after splitting:
     *   <span class="word-container" style="overflow:hidden">
     *     <span class="word-inner">Hello</span>
     *   </span>
     *
     * @param {string} selector - CSS selector for elements to split
     */
    const splitWords = (selector) => {
        const elements = document.querySelectorAll(selector);

        elements.forEach(el => {
            // Skip if already split
            if (el.dataset.split) return;
            el.dataset.split = "true";

            const processNode = (node) => {
                if (node.nodeType === 3) {
                    // --- Text Node ---
                    const text = node.textContent.trim().replace(/\s+/g, " ");
                    
                    if (!text) {
                        // Pure whitespace node - remove it to prevent double spacing
                        // between word-containers and elements
                        node.parentNode.removeChild(node);
                        return;
                    }

                    const fragment = document.createDocumentFragment();
                    const words = text.split(" ");

                    words.forEach((word) => {
                        // Outer container (clips the word during animation)
                        const wordSpan = document.createElement("span");
                        wordSpan.className = "word-container inline-block overflow-hidden align-bottom";

                        // FIX: Apply margin-right for spacing.
                        // We use 0.28em as a standard 'natural' space width.
                        // We've removed whitespace nodes above to avoid double spaces.
                        wordSpan.style.marginRight = "0.28em";

                        // Inner span (this is what moves during animation)
                        const innerSpan = document.createElement("span");
                        innerSpan.className = "word-inner inline-block";
                        innerSpan.textContent = word;

                        wordSpan.appendChild(innerSpan);
                        fragment.appendChild(wordSpan);
                    });

                    node.parentNode.replaceChild(fragment, node);

                } else if (
                    node.nodeType === 1 &&
                    node.tagName !== "BR" &&
                    !node.classList.contains("word-container")
                ) {
                    // --- Element Node --- (recurse into children)
                    Array.from(node.childNodes).forEach(processNode);
                }
            };

            Array.from(el.childNodes).forEach(processNode);

            // Remove trailing margin from the very last word-container
            // in the entire element to avoid extra space at the end
            const allContainers = el.querySelectorAll(".word-container");
            if (allContainers.length) {
                allContainers[allContainers.length - 1].style.marginRight = "0";
            }
        });
    };


    /* =========================================================================
     * SECTION 4: SHARED SCROLL-REVEAL ANIMATIONS
     * These run on every page that has `.reveal-*` classes in the HTML.
     * ========================================================================= */

    /**
     * revealSections()
     * ----------------
     * Finds all <section> elements (except #hero and #about, which have
     * custom animations) and animates their child elements when scrolled
     * into view.
     *
     * Animatable child classes:
     *   .reveal-subtitle  → Fades in + letter-spacing shrinks
     *   .reveal-title     → Word-by-word slide up (via splitWords)
     *   .section-title    → Same as reveal-title
     *   .reveal-line      → Width expands from 0
     *   .reveal-text      → Fades in + slides up
     *   .reveal-btn       → Fades in + slides up
     *   .reveal-card      → Fades in + slides up + slight scale
     */
    const revealSections = () => {
        // Pre-split title text into animated word spans
        splitWords(".reveal-title");
        splitWords(".section-title");

        // Select all sections except hero and about (they have custom logic)
        const sections = document.querySelectorAll(
            "section:not(#hero):not(#about)"
        );

        sections.forEach((section, index) => {
            // Skip if already animated (prevents re-running on hot-reload)
            if (section.dataset.animated) return;

            // Query animatable child elements within this section
            const subtitle = section.querySelector(".reveal-subtitle");
            const titleWords = section.querySelectorAll(
                ".reveal-title .word-inner, .section-title .word-inner"
            );
            const line = section.querySelector(".reveal-line");
            const text = section.querySelector(".reveal-text");
            const btn = section.querySelector(".reveal-btn");
            const cards = section.querySelectorAll(".reveal-card");

            /**
             * Build and play the reveal timeline.
             * Uses negative offsets (e.g. "-=0.8") to overlap animations
             * for a more fluid, cinematic feel.
             */
            const runAnimation = () => {
                // Guard against double execution
                if (section.dataset.animated === "done") return;
                section.dataset.animated = "done";

                // For users who prefer no animations, just reveal instantly
                if (prefersReducedMotion) {
                    [subtitle, ...titleWords, line, text, btn, ...cards]
                        .filter(Boolean)
                        .forEach(el => { gsap.set(el, { opacity: 1, y: 0, scale: 1, width: "auto", clearProps: "all" }); });
                    return;
                }

                const tl = gsap.timeline();

                // Subtitle: fade in + letter-spacing squeeze
                if (subtitle) {
                    tl.fromTo(subtitle,
                        { opacity: 0, y: 15, letterSpacing: "1em" },
                        { opacity: 1, y: 0, letterSpacing: "0.5em", duration: 1.2, ease: "power2.out", clearProps: "transform", force3D: true }
                    );
                }

                // Section title words: slide up with stagger
                if (titleWords.length) {
                    tl.fromTo(titleWords,
                        { opacity: 0, y: 40 },
                        { opacity: 1, y: 0, duration: 1, stagger: 0.08, ease: "expo.out", clearProps: "transform", force3D: true },
                        "-=0.8"
                    );
                }

                // Decorative line: width expansion
                if (line) {
                    tl.fromTo(line,
                        { width: 0 },
                        { width: 64, duration: 0.8, ease: "power2.inOut" },
                        "-=0.6"
                    );
                }

                // Body text: fade in + slide up
                if (text) {
                    tl.fromTo(text,
                        { opacity: 0, y: 20 },
                        { opacity: 1, y: 0, duration: 1, ease: "power2.out", clearProps: "transform", force3D: true },
                        "-=0.6"
                    );
                }

                // CTA button: fade in + slide up
                if (btn) {
                    tl.fromTo(btn,
                        { opacity: 0, y: 20 },
                        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", clearProps: "transform", force3D: true },
                        "-=0.8"
                    );
                }

                // Cards: fade in + slide up + slight scale pop
                if (cards.length) {
                    tl.fromTo(cards,
                        { opacity: 0, y: 60, scale: 0.95 },
                        { opacity: 1, y: 0, scale: 1, duration: 1.2, stagger: 0.15, ease: "power3.out", clearProps: "transform", force3D: true },
                        "-=1.2"
                    );
                }
            };

            /*
             * Determine if this section is already visible in the viewport.
             * If so, animate immediately (above-the-fold sections).
             * Otherwise, set up a ScrollTrigger to animate on scroll.
             */
            const rect = section.getBoundingClientRect();
            const isInView = rect.top < window.innerHeight && rect.bottom > 0;

            if (isInView && index === 0) {
                // First visible section: animate with a short delay
                setTimeout(runAnimation, 250);
            } else {
                // Below-the-fold: trigger when 85% of viewport is reached
                ScrollTrigger.create({
                    trigger: section,
                    start: "top 85%",
                    once: true,
                    onEnter: () => runAnimation()
                });
            }
        });
    };


    /**
     * initNewsletter()
     * ----------------
     * Adds a parallax background effect and fade-in reveal to the
     * #newsletter section (present on most pages).
     */
    const initNewsletter = () => {
        const section = document.querySelector("#newsletter");
        if (!section || section.dataset.animated) return;

        const bg = section.querySelector("img");
        const content = section.querySelector(".max-w-2xl");

        // Parallax: background image moves slower than scroll
        if (bg) {
            gsap.to(bg, {
                y: -100,
                ease: "none",
                scrollTrigger: {
                    trigger: section,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true      // Ties animation progress to scroll position
                }
            });
        }

        // Content fade-in on scroll
        if (content) {
            if (prefersReducedMotion) {
                gsap.set(content, { opacity: 1, y: 0 });
            } else {
                gsap.fromTo(content,
                    { opacity: 0, y: 40 },
                    {
                        opacity: 1, y: 0, duration: 1.5, ease: "power3.out",
                        clearProps: "transform",
                        scrollTrigger: {
                            trigger: section,
                            start: "top 75%",
                            once: true,
                            onEnter: () => { section.dataset.animated = "done"; }
                        }
                    }
                );
            }
        }
    };


    /**
     * initHovers()
     * ------------
     * Adds hover animations to CTA buttons with expanding underlines.
     * On hover, the decorative line under the button expands; on leave,
     * it shrinks back.
     */
    const initHovers = () => {
        document.querySelectorAll(".reveal-btn, .about-btn").forEach(btn => {
            const line = btn.querySelector("div:last-child");
            if (!line) return;

            btn.addEventListener("mouseenter", () => {
                gsap.to(line, { width: 64, duration: 0.4, ease: "power2.out" });
            });

            btn.addEventListener("mouseleave", () => {
                gsap.to(line, { width: 48, duration: 0.4, ease: "power2.out" });
            });
        });
    };


    /* =========================================================================
     * SECTION 5: PAGE-SPECIFIC ANIMATIONS
     * Each page auto-detects which context it's in and runs only
     * the relevant code. No manual page-type configuration needed.
     * ========================================================================= */


    /* -------------------------------------------------------------------------
     * 5A: HOMEPAGE — Hero Slider + About Section
     * Runs only if .hero-swiper exists (i.e., we're on index.html)
     * ------------------------------------------------------------------------ */

    const initHomepage = () => {
        const heroSwiper = document.querySelector(".hero-swiper");
        if (!heroSwiper) return;   // Not on homepage — bail out

        // Split hero title text into individual characters for animation
        splitLetters(".hero-title");

        // Split about section title into words for word-reveal animation
        splitWords(".about-title");

        /**
         * animateHeroSlide(slide)
         * Animates text and button when a hero slide becomes active.
         * Characters fly in from below, text fades in, button pops.
         */
        const animateHeroSlide = (slide) => {
            const titleChars = slide.querySelectorAll(".hero-title .char");
            const text = slide.querySelector(".hero-text");
            const btn = slide.querySelector(".hero-btn");

            if (prefersReducedMotion) {
                gsap.set([titleChars, text, btn], { opacity: 1, y: 0, scale: 1 });
                return;
            }

            const tl = gsap.timeline();

            // Characters stagger in from below
            tl.fromTo(titleChars,
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 0.8, stagger: 0.05, ease: "power3.out", clearProps: "transform", force3D: true }
            );

            // Description text fades in
            tl.fromTo(text,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 1, ease: "power2.out", clearProps: "transform", force3D: true },
                "-=0.6"
            );

            // Button pops in with a bounce
            tl.fromTo(btn,
                { opacity: 0, scale: 0.95 },
                { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)", clearProps: "transform", force3D: true },
                "-=0.8"
            );
        };

        /**
         * resetHeroSlide(slide)
         * Hides all animated elements in a slide so they can re-animate
         * when the slide becomes active again.
         */
        const resetHeroSlide = (slide) => {
            const titleChars = slide.querySelectorAll(".hero-title .char");
            const text = slide.querySelector(".hero-text");
            const btn = slide.querySelector(".hero-btn");

            gsap.set([titleChars, text, btn], { opacity: 0, y: 40 });
            gsap.set(btn, { scale: 0.95 });
        };

        // Initialize the Swiper hero slider with GSAP hooks
        if (typeof Swiper !== "undefined") {
            new Swiper(".hero-swiper", {
                loop: true,
                speed: 1200,
                parallax: true,
                autoplay: { delay: 5000, disableOnInteraction: false },
                pagination: { el: ".hero-pagination", clickable: true },
                navigation: { nextEl: ".hero-next", prevEl: ".hero-prev" },
                on: {
                    // Animate the first slide on init
                    init: function () {
                        animateHeroSlide(this.slides[this.activeIndex]);
                    },
                    // Reset all slides when transition starts
                    slideChangeTransitionStart: function () {
                        this.slides.forEach(slide => resetHeroSlide(slide));
                    },
                    // Animate the new active slide when transition ends
                    slideChangeTransitionEnd: function () {
                        animateHeroSlide(this.slides[this.activeIndex]);
                    }
                }
            });
        }

        /**
         * Homepage About Section Animation
         * --------------------------------
         * Custom timeline for the #about section (not handled by revealSections
         * because it has unique image + text layout animations).
         */
        const initAboutAnimation = () => {
            const section = document.querySelector("#about");
            if (!section || section.dataset.animated) return;

            const mainImg   = section.querySelector(".about-img");
            const smallImg  = section.querySelector(".about-img-small");
            const subtitle  = section.querySelector(".about-subtitle");
            const titleWords = section.querySelectorAll(".word-inner");
            const infoText  = section.querySelector(".about-text");
            const btn       = section.querySelector(".about-btn");

            if (prefersReducedMotion) {
                [mainImg, smallImg, subtitle, ...titleWords, infoText, btn]
                    .filter(Boolean)
                    .forEach(el => gsap.set(el, { opacity: 1, y: 0, scale: 1, clearProps: "all" }));
                return;
            }

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                    once: true,
                    onEnter: () => { section.dataset.animated = "true"; }
                }
            });

            // Main image: scale down + fade in (photo zoom-out feel)
            tl.fromTo(mainImg,
                { opacity: 0, y: 50, scale: 1.1 },
                { opacity: 1, y: 0, scale: 1, duration: 1.4, ease: "power3.out", clearProps: "transform", force3D: true }
            );

            // Small accent image: slides up
            tl.fromTo(smallImg,
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 1.2, ease: "power2.out", clearProps: "transform", force3D: true },
                "-=1"
            );

            // Subtitle: letter-spacing squeeze effect
            tl.fromTo(subtitle,
                { opacity: 0, letterSpacing: "1em" },
                { opacity: 1, letterSpacing: "0.6em", duration: 1.2, ease: "power2.out" },
                "-=1.4"
            );

            // Title words: staggered slide up
            tl.fromTo(titleWords,
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 1, stagger: 0.08, ease: "expo.out", clearProps: "transform", force3D: true },
                "-=1"
            );

            // Body text: fade in
            tl.fromTo(infoText,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 1, ease: "power2.out", clearProps: "transform", force3D: true },
                "-=0.8"
            );

            // CTA button: slide up
            tl.fromTo(btn,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", clearProps: "transform", force3D: true },
                "-=0.6"
            );
        };

        initAboutAnimation();
    };


    /* -------------------------------------------------------------------------
     * 5B: CONTACT PAGE — Team Swiper
     * Runs only if .team-swiper exists AND we're NOT on the homepage
     * (homepage has its own team swiper in main.js)
     * ------------------------------------------------------------------------ */

    const initContactPage = () => {
        const teamSwiper = document.querySelector(".team-swiper");
        // Only init if we're on the contact page (no hero-swiper = not homepage)
        if (!teamSwiper || document.querySelector(".hero-swiper")) return;
        if (typeof Swiper === "undefined") return;

        new Swiper(".team-swiper", {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            pagination: { el: ".swiper-pagination", clickable: true },
            breakpoints: {
                768:  { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
            }
        });
    };


    /* -------------------------------------------------------------------------
     * 5C: CATEGORY TAB FILTERING (Events, Press, Shop pages)
     * A single reusable function handles all tab-based filtering with
     * GSAP item reveal animations.
     * ------------------------------------------------------------------------ */

    /**
     * initCategoryFilter(config)
     * -------------------------
     * Sets up tab buttons to filter a grid of items with smooth GSAP reveals.
     *
     * @param {Object} config
     * @param {string} config.itemSelector  - CSS selector for filterable items
     * @param {string} config.tabActiveClass - Space-separated classes to add to active tab
     * @param {string} config.tabInactiveClass - Space-separated classes for inactive tabs
     * @param {Object} config.animation     - GSAP fromTo values for the reveal
     */
    const initCategoryFilter = (config) => {
        const tabs = document.querySelectorAll(".tab-btn");
        const items = document.querySelectorAll(config.itemSelector);

        if (!tabs.length || !items.length) return;

        tabs.forEach(tab => {
            tab.addEventListener("click", () => {
                const target = tab.getAttribute("data-tab");

                // Update tab button styles
                tabs.forEach(b => {
                    // Remove all active classes
                    config.tabActiveClass.split(" ").forEach(cls => b.classList.remove(cls));
                    // Add inactive classes
                    if (config.tabInactiveClass) {
                        config.tabInactiveClass.split(" ").forEach(cls => b.classList.add(cls));
                    }
                });

                // Apply active classes to clicked tab
                config.tabActiveClass.split(" ").forEach(cls => tab.classList.add(cls));
                if (config.tabInactiveClass) {
                    config.tabInactiveClass.split(" ").forEach(cls => tab.classList.remove(cls));
                }

                // Filter items with GSAP animation
                items.forEach(item => {
                    const category = item.getAttribute("data-category");

                    if (target === "all" || category === target) {
                        item.classList.remove("hidden");

                        if (!prefersReducedMotion) {
                            gsap.fromTo(item,
                                config.animation.from,
                                { ...config.animation.to, clearProps: "all" }
                            );
                        }
                    } else {
                        item.classList.add("hidden");
                    }
                });
            });
        });
    };


    /**
     * Auto-detect which filter page we're on and initialize accordingly.
     */

    // Events page: rounded pill-style active tabs
    if (document.querySelector(".event-item")) {
        initCategoryFilter({
            itemSelector: ".event-item",
            tabActiveClass: "active bg-primary text-white! border-primary",
            tabInactiveClass: "",
            animation: {
                from: { opacity: 0, scale: 0.95 },
                to:   { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out", force3D: true }
            }
        });
    }

    // Press page: underline-style active tabs
    if (document.querySelector(".press-item")) {
        initCategoryFilter({
            itemSelector: ".press-item",
            tabActiveClass: "text-primary border-b-2 border-gold",
            tabInactiveClass: "text-secondary hover:text-primary",
            animation: {
                from: { opacity: 0, scale: 0.98 },
                to:   { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out", force3D: true }
            }
        });
    }

    // Shop page: underline-style active tabs with slide-up reveal
    if (document.querySelector(".shop-item") && document.querySelector(".tab-btn")) {
        initCategoryFilter({
            itemSelector: ".shop-item",
            tabActiveClass: "text-primary border-b-2 border-gold",
            tabInactiveClass: "text-secondary",
            animation: {
                from: { opacity: 0, y: 20 },
                to:   { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", force3D: true }
            }
        });
    }


    /* -------------------------------------------------------------------------
     * 5D: SHOP DETAIL — Lightbox
     * Simple fullscreen image viewer for product pages.
     * ------------------------------------------------------------------------ */

    const initLightbox = () => {
        const lightbox    = document.getElementById("lightbox");
        const openBtn     = document.getElementById("open-lightbox");
        const closeBtn    = document.getElementById("close-lightbox");
        const lightboxImg = document.getElementById("lightbox-img");

        if (!lightbox || !openBtn) return;

        /** Show the lightbox with a scale-up + fade transition */
        const openLightbox = () => {
            lightbox.classList.remove("opacity-0", "pointer-events-none");
            lightboxImg.classList.remove("scale-95");
            document.body.style.overflow = "hidden";  // Lock page scroll
        };

        /** Hide the lightbox */
        const closeLightbox = () => {
            lightbox.classList.add("opacity-0", "pointer-events-none");
            lightboxImg.classList.add("scale-95");
            document.body.style.overflow = "";  // Restore page scroll
        };

        openBtn.addEventListener("click", openLightbox);
        closeBtn?.addEventListener("click", closeLightbox);

        // Close when clicking the backdrop (not the image itself)
        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        // Close on Escape key
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") closeLightbox();
        });
    };

    initLightbox();


    /* =========================================================================
     * SECTION 6: RUN ALL SHARED ANIMATIONS
     * These execute on every page.
     * ========================================================================= */

    // Homepage-specific (hero slider + about section)
    initHomepage();

    // Contact page team swiper
    initContactPage();

    // Scroll-triggered section reveals (all pages)
    revealSections();

    // Newsletter parallax + reveal (all pages)
    initNewsletter();

    // Button hover effects (all pages)
    initHovers();

});
