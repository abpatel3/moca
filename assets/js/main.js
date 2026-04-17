/**
 * MOCA Gandhinagar - Main JavaScript
 * Optimized for performance, modularity, and modern standards.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration & DOM Caching ---
    const CONFIG = {
        scrollThreshold: 20,
        selectors: {
            header: '#header',
            headerContainer: '#header-container',
            navLinks: '#header nav a, #header .flex.items-center.gap-4 button:first-child, .header-text',
            hamburger: '#header .md\\:hidden',
            mobileMenu: '#mobile-menu',
            mobileMenuBtn: '#mobile-menu-btn',
            closeMenuBtn: '#close-menu-btn',
            mobileLinks: '.mobile-link'
        }
    };

    const elements = {
        header: document.querySelector(CONFIG.selectors.header),
        headerContainer: document.querySelector(CONFIG.selectors.headerContainer),
        navLinks: document.querySelectorAll(CONFIG.selectors.navLinks),
        hamburger: document.querySelector(CONFIG.selectors.hamburger),
        mobileMenu: document.querySelector(CONFIG.selectors.mobileMenu),
        mobileMenuBtn: document.querySelector(CONFIG.selectors.mobileMenuBtn),
        closeMenuBtn: document.querySelector(CONFIG.selectors.closeMenuBtn),
        mobileLinks: document.querySelectorAll(CONFIG.selectors.mobileLinks)
    };

    // --- Mobile Menu Toggle ---
    const toggleMobileMenu = (isOpen) => {
        if (!elements.mobileMenu) return;

        if (isOpen) {
            elements.mobileMenu.classList.remove('translate-x-full');
            document.body.classList.add('overflow-hidden');
        } else {
            elements.mobileMenu.classList.add('translate-x-full');
            document.body.classList.remove('overflow-hidden');
        }
    };

    elements.mobileMenuBtn?.addEventListener('click', () => toggleMobileMenu(true));
    elements.closeMenuBtn?.addEventListener('click', () => toggleMobileMenu(false));

    // Close menu when a link is clicked
    elements.mobileLinks.forEach(link => {
        link.addEventListener('click', () => toggleMobileMenu(false));
    });

    // --- Header Scroll Effect ---
    let lastScrollY = window.scrollY;

    const updateHeaderState = () => {
        const { header } = elements;
        if (!header) return;

        const currentScrollY = window.scrollY;
        const isScrollingDown = currentScrollY > lastScrollY && currentScrollY > 100;
        const shouldBeSlim = currentScrollY > CONFIG.scrollThreshold;

        // Sticky visual state (Shadow/Blur)
        if (shouldBeSlim) {
            header.classList.add('shadow-xl', 'bg-white/80', 'backdrop-blur-md', 'py-1');
            header.classList.remove('bg-surface');
        } else {
            header.classList.remove('shadow-xl', 'bg-white/80', 'backdrop-blur-md', 'py-1');
            header.classList.add('bg-surface');
        }

        // Hide/Show logic
        if (isScrollingDown) {
            header.classList.add('-translate-y-full');
        } else {
            header.classList.remove('-translate-y-full');
        }

        lastScrollY = currentScrollY;
    };

    // Optimized scroll listener with requestAnimationFrame
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateHeaderState();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Initial check
    updateHeaderState();

    // --- Swiper Utilities ---
    const initSwipers = () => {
        // Shared config for content swipers
        const contentSwiperConfig = (next, prev, breakpoints) => ({
            slidesPerView: 1,
            spaceBetween: 24,
            loop: true,
            observer: true,
            observeParents: true,
            watchSlidesProgress: true,
            autoplay: { delay: 5000, disableOnInteraction: false },
            navigation: { nextEl: next, prevEl: prev },
            breakpoints
        });

        // Events Swiper
        if (document.querySelector('.events-swiper')) {
            new Swiper('.events-swiper', contentSwiperConfig('.events-next', '.events-prev', {
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
            }));
        }

        // Shop Swiper
        if (document.querySelector('.shop-swiper')) {
            new Swiper('.shop-swiper', contentSwiperConfig('.shop-next', '.shop-prev', {
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
            }));
        }

        // Team Swiper
        if (document.querySelector('.team-swiper')) {
            new Swiper('.team-swiper', contentSwiperConfig('.team-next', '.team-prev', {
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
            }));
        }
    };

    initSwipers();

    // --- Library Resize Handlers (Plotly, Apex, Chartjs) ---
    const initLibraryResizers = () => {
        const resizeCharts = () => {
            // Plotly
            if (window.Plotly) {
                document.querySelectorAll('.plot-container.plotly').forEach(pc => {
                    const gd = pc.parentElement;
                    if (gd) {
                        const rect = gd.getBoundingClientRect();
                        if (rect.width > 0 && rect.height > 0) {
                            try { window.Plotly.relayout(gd, { width: Math.round(rect.width), height: Math.round(rect.height) }); } catch (e) { }
                        }
                    }
                });
            }
            // ApexCharts
            if (window.ApexCharts && window.Apex?._chartInstances) {
                window.Apex._chartInstances.forEach(inst => {
                    try { (inst.chart || inst).updateOptions({}, false, false); } catch (e) { }
                });
            }
            // Chart.js
            if (window.Chart?.instances) {
                Object.values(window.Chart.instances).forEach(c => {
                    try { c.resize(); } catch (e) { }
                });
            }
        };

        window.addEventListener('load', () => {
            setTimeout(() => {
                resizeCharts();
                setTimeout(resizeCharts, 500);
            }, 300);

            if (window.ResizeObserver) {
                let lastW = 0, lastH = 0, timer = 0;
                new ResizeObserver(() => {
                    const w = document.documentElement.clientWidth;
                    const h = document.documentElement.clientHeight;
                    if (w === lastW && h === lastH) return;
                    lastW = w; lastH = h;
                    clearTimeout(timer);
                    timer = setTimeout(resizeCharts, 150);
                }).observe(document.documentElement);
            }
        });
    };

    initLibraryResizers();
});