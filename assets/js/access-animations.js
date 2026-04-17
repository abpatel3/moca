/**
 * Access Section Animations
 * Uses GSAP for smooth entrance and hover effects
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check if GSAP is loaded
    if (typeof gsap === 'undefined') return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Initial State (Hidden)
    gsap.set('.access-welcome', { opacity: 0, y: 20 });
    gsap.set('.access-title', { opacity: 0, x: -50 });
    gsap.set('.access-location', { opacity: 0, y: 20 });
    gsap.set('.access-right', { opacity: 0, x: 50, scale: 0.95 });
    gsap.set('.form-group', { opacity: 0, y: 15 });
    gsap.set('.access-btn', { opacity: 0, y: 20 });

    // Animation Sequence
    tl.to('.access-welcome', { 
        opacity: 1, 
        y: 0, 
        duration: 1, 
        delay: 0.5 
    })
    .to('.access-title', { 
        opacity: 1, 
        x: 0, 
        duration: 1.2 
    }, '-=0.7')
    .to('.access-location', { 
        opacity: 1, 
        y: 0, 
        duration: 1 
    }, '-=0.8')
    .to('.access-right', { 
        opacity: 1, 
        x: 0, 
        scale: 1, 
        duration: 1.2,
        ease: 'expo.out'
    }, '-=1')
    .to('.form-group', { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        stagger: 0.1 
    }, '-=0.8')
    .to('.access-btn', { 
        opacity: 1, 
        y: 0, 
        duration: 0.8 
    }, '-=0.4');

    // Input Focus Interactions (Subtle enhancement)
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            gsap.to(input.parentElement, { x: 5, duration: 0.3, ease: 'power2.out' });
        });
        input.addEventListener('blur', () => {
            gsap.to(input.parentElement, { x: 0, duration: 0.3, ease: 'power2.out' });
        });
    });
});
