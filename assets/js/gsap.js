/**
 * MOCA — About Page Animations (Refined)
 * Focused on precise element-level triggering for maximum reliability.
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Setup GSAP & ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Helper to check if motion is reduced
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* =========================================================================
     * 1. INTRO ANIMATIONS (Banner)
     * Runs immediately on load.
     * ========================================================================= */

    const initSubpageBanner = () => {
        const banner = document.querySelector(".subpage-banner");
        if (!banner) return;

        // Split text for immediate reveal
        const title = banner.querySelector(".sp-title");
        const subtitle = banner.querySelector(".sp-subtitle");
        const text = banner.querySelector(".sp-text");

        if (prefersReducedMotion) return;

        const tl = gsap.timeline({ delay: 0.3 });

        if (subtitle) {
            const splitSub = new SplitType(subtitle, { types: "words" });
            tl.from(splitSub.words, {opacity: 0, y: "100%", duration: 0.8, stagger: 0.2, ease: "power3.out" });
        }

        if (title) {
            const splitTitle = new SplitType(title, { types: "lines, words" });
            gsap.set(title.querySelectorAll(".line"), { overflow: "hidden" });
            tl.from(splitTitle.words, {opacity: 0, y: "100%", duration: 1, stagger: 0.2, ease: "expo.out" }, "-=0.6");
        }

        if (text) {
            // Check if it has child elements (not just text nodes)
            if (text.children.length > 0) {
                // If it has children (like icons/metadata), animate the children as items
                tl.from(text.children, {
                    opacity: 0,
                    y: 20,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power2.out"
                }, "-=0.8");
            } else {
                // If it's simple text, use SplitType for a clean reveal
                const splitText = new SplitType(text, { types: "lines, words" });
                gsap.set(text.querySelectorAll(".line"), { overflow: "hidden" });
                tl.from(splitText.words, { opacity: 0, y: 20, duration: 1, stagger: 0.05, ease: "power2.out" }, "-=0.8");
            }
        }
    };
    
    /* =========================================================================
     * 1B. HOME PAGE HERO (Swiper Integration)
     * Animates text precisely when slides change.
     * ========================================================================= */
    
    const initHomeHero = () => {
        const heroSwiperEl = document.querySelector(".hero-swiper");
        if (!heroSwiperEl || typeof Swiper === "undefined") return;

        // Split text for all slides initially
        const titles = heroSwiperEl.querySelectorAll(".hero-title");
        const texts = heroSwiperEl.querySelectorAll(".hero-text");
        
        titles.forEach(t => new SplitType(t, { types: "chars, words" }));
        texts.forEach(t => new SplitType(t, { types: "lines" }));

        const animateSlide = (slide) => {
            const chars = slide.querySelectorAll(".char");
            const lines = slide.querySelectorAll(".line");
            const btn = slide.querySelector(".hero-btn");

            if (prefersReducedMotion) {
                gsap.set([chars, lines, btn], { opacity: 1, y: 0 });
                return;
            }

            const tl = gsap.timeline();
            
            if (chars.length) {
                tl.fromTo(chars, 
                    { opacity: 0, y: 30 }, 
                    { opacity: 1, y: 0, duration: 0.8, stagger: 0.02, ease: "power3.out" }
                );
            }

            if (lines.length) {
                tl.fromTo(lines, 
                    { opacity: 0, y: 20 }, 
                    { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" }, 
                    "-=0.6"
                );
            }

            if (btn) {
                tl.fromTo(btn, 
                    { opacity: 0, y: 20 }, 
                    { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 
                    "-=0.4"
                );
            }
        };

        const resetSlide = (slide) => {
            const chars = slide.querySelectorAll(".char");
            const lines = slide.querySelectorAll(".line");
            const btn = slide.querySelector(".hero-btn");
            gsap.set([chars, lines, btn], { opacity: 0, y: 30 });
        };

        // Initialize Swiper with GSAP hooks
        const swiper = new Swiper(".hero-swiper", {
            loop: true,
            speed: 1000,
            parallax: true,
            autoplay: { delay: 6000, disableOnInteraction: false },
            navigation: { nextEl: ".hero-next", prevEl: ".hero-prev" },
            on: {
                init: function() {
                    animateSlide(this.slides[this.activeIndex]);
                },
                slideChangeTransitionStart: function() {
                    this.slides.forEach(s => resetSlide(s));
                },
                slideChangeTransitionEnd: function() {
                    animateSlide(this.slides[this.activeIndex]);
                }
            }
        });
    };

    /* =========================================================================
     * 1C. HOME PAGE ABOUT (Custom Reveal)
     * Handles the specialized image and text layout of the homepage about section.
     * ========================================================================= */

    const initHomeAbout = () => {
        const section = document.querySelector("#about");
        if (!section || !section.querySelector(".about-title")) return;

        const mainImg = section.querySelector(".about-img");
        const smallImg = section.querySelector(".about-img-small");
        const title = section.querySelector(".about-title");
        const subtitle = section.querySelector(".about-subtitle");
        const text = section.querySelector(".about-text");
        const btn = section.querySelector(".about-btn");

        if (prefersReducedMotion) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top 75%",
                once: true
            }
        });

        if (mainImg) {
            tl.from(mainImg, { opacity: 0, y: 60, scale: 1.05, duration: 1.5, ease: "power3.out" });
        }

        if (smallImg) {
            tl.from(smallImg, { opacity: 0, y: 40, x: 20, duration: 1.2, ease: "power2.out" }, "-=1");
        }

        if (subtitle) {
            tl.from(subtitle, { opacity: 0, x: -20, duration: 1, ease: "power2.out" }, "-=1.2");
        }

        if (title) {
            const splitTitle = new SplitType(title, { types: "words, lines" });
            tl.from(splitTitle.words, { opacity: 0, y: 30, duration: 1, stagger: 0.1, ease: "expo.out" }, "-=1");
        }

        if (text) {
            tl.from(text, { opacity: 0, y: 20, duration: 1, ease: "power2.out" }, "-=0.8");
        }

        if (btn) {
            tl.from(btn, { opacity: 0, y: 15, duration: 0.8, ease: "power2.out" }, "-=0.6");
        }
    };


    /* =========================================================================
     * 2. SCROLL REVEAL ANIMATIONS (Element-based)
     * These trigger exactly when the element enters the viewport.
     * ========================================================================= */

    const initScrollReveals = () => {
        
        // --- Titles (.reveal-title) ---
        document.querySelectorAll(".reveal-title").forEach(title => {
            const split = new SplitType(title, { types: "lines, words" });
            gsap.set(title.querySelectorAll(".line"), { overflow: "hidden" });

            gsap.from(split.words, {
                scrollTrigger: {
                    trigger: title,
                    start: "top 85%",
                    once: true
                },
                y: "110%",
                stagger: 0.07,
                duration: 1,
                ease: "expo.out",
                clearProps: "all"
            });
        });

        // --- Subtitles (.reveal-subtitle) ---
        document.querySelectorAll(".reveal-subtitle").forEach(el => {
            gsap.from(el, {
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    once: true
                },
                opacity: 0,
                y: 15,
                duration: 2,
                letterSpacing: "0.4em",
                ease: "power2.out"
            });
        });

        // --- Decorative Lines (.reveal-line) ---
        document.querySelectorAll(".reveal-line").forEach(line => {
            gsap.from(line, {
                scrollTrigger: {
                    trigger: line,
                    start: "top 85%",
                    once: true
                },
                width: 0,
                duration: 0.8,
                ease: "power2.inOut"
            });
        });

        // --- Text Blocks (.reveal-text) ---
        document.querySelectorAll(".reveal-text").forEach(text => {
            gsap.from(text, {
                scrollTrigger: {
                    trigger: text,
                    start: "top 85%",
                    once: true
                },
                opacity: 0,
                y: 20,
                duration: 1,
                ease: "power2.out"
            });
        });

        // --- Cards (.reveal-card) ---
        // We cluster these to stagger them if they are in the same block, or animate separately
        document.querySelectorAll(".reveal-card").forEach(card => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    once: true
                },
                opacity: 0,
                y: 40,
                scale: 0.98,
                duration: 1.2,
                ease: "power3.out"
            });
        });

        // --- Buttons (.reveal-btn) ---
        document.querySelectorAll(".reveal-btn").forEach(btn => {
            gsap.from(btn, {
                scrollTrigger: {
                    trigger: btn,
                    start: "top 95%",
                    once: true
                },
                opacity: 0,
                y: 15,
                duration: 0.8,
                ease: "power2.out"
            });
        });

        // Final safety refresh
        ScrollTrigger.refresh();
    };


    /* =========================================================================
     * 3. EXECUTION
     * ========================================================================= */

    initSubpageBanner();
    initHomeHero();
    initHomeAbout();
    initScrollReveals();

});
