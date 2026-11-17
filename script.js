        // Lenis smooth scrolling (skipped if the library failed to load or the user prefers reduced motion)
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const hasGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
        let lenis = null;

        if (hasGsap) gsap.registerPlugin(ScrollTrigger);

        if (typeof Lenis !== 'undefined' && !prefersReducedMotion) {
            lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                smoothWheel: true,
                anchors: true, // smooth-scroll in-page #anchor links
            });

            if (hasGsap) {
                // One clock for both: Lenis advances on GSAP's ticker and tells ScrollTrigger when it moves
                lenis.on('scroll', ScrollTrigger.update);
                gsap.ticker.add((time) => lenis.raf(time * 1000));
                gsap.ticker.lagSmoothing(0);
            } else {
                function raf(time) {
                    lenis.raf(time);
                    requestAnimationFrame(raf);
                }
                requestAnimationFrame(raf);
            }
        }

        // Images and the Credly badge change the page height after load; re-measure so scroll math stays right
        window.addEventListener('load', () => {
            if (lenis) lenis.resize();
            if (hasGsap) ScrollTrigger.refresh();
        });

        // Scroll-to-top button: show after scrolling down, scroll smoothly on click
        const scrollTopBtn = document.getElementById('scroll-top');
        if (scrollTopBtn) {
            const toggleScrollTop = () => {
                scrollTopBtn.classList.toggle('hidden', window.scrollY < 400);
            };
            if (lenis) {
                lenis.on('scroll', toggleScrollTop);
            } else {
                window.addEventListener('scroll', toggleScrollTop, { passive: true });
            }
            toggleScrollTop();

            scrollTopBtn.addEventListener('click', () => {
                if (lenis) {
                    lenis.scrollTo(0);
                } else {
                    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
                }
            });
        }

        const skills = [
            { name: 'Java', category: 'Core Languages' },
            { name: 'Python', category: 'Core Languages' },
            { name: 'React.js', category: 'Libraries' },
            { name: 'Spring Boot', category: 'Frameworks' },
            { name: 'MySQL', category: 'Tools' },
            { name: 'Neural Networks', category: 'Interests' },
            { name: 'LangChain', category: 'Libraries' },
            { name: 'FastAPI', category: 'Frameworks' },
            { name: 'Apache Kafka', category: 'Tools' },
            { name: 'AWS', category: 'Tools' },
            { name: 'SageMaker', category: 'Tools' },
            { name: 'Bedrock', category: 'Tools' },
            { name: 'OpenSearch', category: 'Tools' },
            { name: 'System Design and Architecture', category: 'Interests' },
            { name: 'MongoDB', category: 'Tools' },
            { name: 'RabbitMQ', category: 'Tools' },
            { name: 'TensorFlow', category: 'Libraries' },
            { name: 'llama.cpp', category: 'Libraries' },
            { name: 'JavaScript', category: 'Core Languages' },
            { name: 'Scikit-learn', category: 'Libraries' },
            { name: 'AI deployments and monitoring', category: 'Interests' },
            { name: 'Model Training and Fine-tuning', category: 'Tools' },
        ];

        const skillsContainer = document.getElementById('skills-container');

        skills.forEach(skill => {
            const skillElement = document.createElement('div');
            skillElement.className = 'px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold bg-gray-700 text-gray-300 hover:bg-cyan-500 hover:text-white transition-colors cursor-pointer';
            skillElement.textContent = skill.name;
            skillsContainer.appendChild(skillElement);
        });

        const cursor = document.getElementById('cursor-tracker');
        const dot = cursor.querySelector('.cursor-dot');
        const outline = cursor.querySelector('.cursor-outline');
        const trail = cursor.querySelector('.cursor-trail');
        
        let mouseX = 0;
        let mouseY = 0;
        let outlineX = 0;
        let outlineY = 0;
        let trailX = 0;
        let trailY = 0;

        // Smooth cursor animation
        function animate() {
            let distX = mouseX - outlineX;
            let distY = mouseY - outlineY;
            
            outlineX += distX * 0.15;
            outlineY += distY * 0.15;
            
            let trailDistX = mouseX - trailX;
            let trailDistY = mouseY - trailY;
            
            trailX += trailDistX * 0.1;
            trailY += trailDistY * 0.1;

            dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
            outline.style.transform = `translate(${outlineX}px, ${outlineY}px)`;
            trail.style.transform = `translate(${trailX}px, ${trailY}px)`;
            
            requestAnimationFrame(animate);
        }

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Magnetic effect on interactive elements
        const magneticElements = document.querySelectorAll('a, button, .flip-card, .cursor-hover');
        
        magneticElements.forEach(elem => {
            elem.addEventListener('mouseenter', () => {
                outline.style.animation = 'magnetic 0.8s ease-in-out infinite';
            });
            
            elem.addEventListener('mouseleave', () => {
                outline.style.animation = 'none';
            });
        });

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            cursor.style.display = 'none';
        });

        document.addEventListener('mouseenter', () => {
            cursor.style.display = 'block';
        });

        // Start animation
        animate();

        // Add click animation
        document.addEventListener('mousedown', () => {
            cursor.classList.add('cursor-clicking');
            outline.style.transform = `translate(${outlineX}px, ${outlineY}px) scale(0.8)`;
        });

        document.addEventListener('mouseup', () => {
            cursor.classList.remove('cursor-clicking');
            outline.style.transform = `translate(${outlineX}px, ${outlineY}px) scale(1)`;
        });

        // Add check for mobile devices
        function isMobile() {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        }

        // Only initialize cursor effects if not on mobile
        if (!isMobile()) {
            // ... existing cursor animation code ...
        } else {
            // Hide cursor elements on mobile
            document.getElementById('cursor-tracker').style.display = 'none';
        }

        // ---------- Scroll effects (GSAP + ScrollTrigger, driven by Lenis) ----------
        (function initScrollEffects() {
            if (!hasGsap) return;

            // Statement: split into words that light up one by one
            const statement = document.querySelector('.statement-text');
            const accentWords = /^(AI|code,|design|production\.)$/;
            const words = [];
            if (statement) {
                const text = statement.textContent.trim().split(/\s+/);
                statement.textContent = '';
                text.forEach((w) => {
                    const span = document.createElement('span');
                    span.className = 'word' + (accentWords.test(w) ? ' is-accent' : '');
                    span.textContent = w;
                    statement.appendChild(span);
                    statement.appendChild(document.createTextNode(' '));
                    words.push(span);
                });
            }

            // Marquee rows: fill each row with copies so the loop never shows a gap
            const marqueeRows = gsap.utils.toArray('.marquee-row');
            marqueeRows.forEach((row) => {
                const track = row.querySelector('.marquee-track');
                row.appendChild(track.cloneNode(true));
                row.appendChild(track.cloneNode(true));
            });

            const mm = gsap.matchMedia();

            // Desktop: projects become a pinned horizontal gallery.
            // Created FIRST so every trigger below it accounts for the extra scroll the pin adds.
            mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
                const section = document.getElementById('projects');
                const track = document.getElementById('projects-track');
                section.classList.add('is-horizontal');
                const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

                gsap.to(track, {
                    x: () => -distance(),
                    ease: 'none',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top top',
                        end: () => '+=' + distance(),
                        pin: true,
                        scrub: 1,
                        invalidateOnRefresh: true,
                        refreshPriority: 1,
                    },
                });

                return () => section.classList.remove('is-horizontal');
            });

            mm.add('(prefers-reduced-motion: reduce)', () => {
                words.forEach((w) => w.classList.add('is-lit'));
            });

            mm.add('(prefers-reduced-motion: no-preference)', () => {
                // Hero: intro on load, then drifts up, shrinks and fades as you scroll away
                gsap.from('#hero-inner > *', {
                    y: 60,
                    opacity: 0,
                    duration: 1.2,
                    ease: 'power4.out',
                    stagger: 0.12,
                    delay: 0.1,
                });
                gsap.to('#hero-inner', {
                    yPercent: -25,
                    scale: 0.88,
                    opacity: 0,
                    ease: 'none',
                    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
                });
                gsap.to('#scroll-hint', {
                    opacity: 0,
                    ease: 'none',
                    scrollTrigger: { trigger: '#hero', start: 'top top', end: '15% top', scrub: true },
                });

                // Marquee: constant drift that speeds up, reverses and skews with scroll velocity
                const rowState = marqueeRows.map((row) => ({
                    row,
                    track: row.querySelector('.marquee-track'),
                    dir: Number(row.dataset.direction) || -1,
                    x: 0,
                }));
                let skew = 0;
                let scrollDir = 1;
                const tickMarquee = (time, deltaTime) => {
                    const v = lenis ? lenis.velocity : 0;
                    if (v > 0.1) scrollDir = 1;
                    else if (v < -0.1) scrollDir = -1;
                    const frame = deltaTime / 16.67;
                    const speed = (1 + Math.min(Math.abs(v) * 0.35, 25)) * frame;
                    skew += (gsap.utils.clamp(-12, 12, v * -0.4) - skew) * 0.1;
                    rowState.forEach((s) => {
                        const w = s.track.offsetWidth;
                        if (!w) return;
                        s.x = gsap.utils.wrap(-w, 0, s.x + s.dir * scrollDir * speed);
                        s.row.style.transform = `translate3d(${s.x}px,0,0) skewX(${skew}deg)`;
                    });
                };
                gsap.ticker.add(tickMarquee);

                // Section headings: letters rise into place
                gsap.utils.toArray('main h2:not(.bg-clip-text)').forEach((h2) => {
                    const label = h2.textContent.trim();
                    h2.setAttribute('aria-label', label);
                    h2.textContent = '';
                    label.split('').forEach((c) => {
                        const span = document.createElement('span');
                        span.className = 'split-char';
                        span.setAttribute('aria-hidden', 'true');
                        span.textContent = c === ' ' ? ' ' : c;
                        h2.appendChild(span);
                    });
                    gsap.from(h2.children, {
                        yPercent: 120,
                        rotate: 8,
                        opacity: 0,
                        duration: 0.9,
                        ease: 'power3.out',
                        stagger: 0.025,
                        scrollTrigger: { trigger: h2, start: 'top 88%' },
                    });
                });

                // Statement words light up with scroll position
                if (statement) {
                    ScrollTrigger.create({
                        trigger: statement,
                        start: 'top 80%',
                        end: 'bottom 40%',
                        scrub: true,
                        onUpdate: (self) => {
                            const lit = Math.round(self.progress * words.length);
                            words.forEach((w, i) => w.classList.toggle('is-lit', i < lit));
                        },
                    });
                }

                // Experience + certification cards and contact rows: rise in one by one
                gsap.utils.toArray('section .max-w-5xl > .group, section .max-w-4xl:not(#skills-container) > div').forEach((card) => {
                    gsap.from(card, {
                        y: 70,
                        opacity: 0,
                        duration: 1,
                        ease: 'power3.out',
                        scrollTrigger: { trigger: card, start: 'top 90%' },
                    });
                });

                // Skills: chips fly in from a scattered cloud once the section comes into view
                gsap.from('#skills-container > div', {
                    x: () => gsap.utils.random(-250, 250),
                    y: () => gsap.utils.random(60, 220),
                    rotation: () => gsap.utils.random(-40, 40),
                    opacity: 0,
                    duration: 1.1,
                    ease: 'power3.out',
                    stagger: { each: 0.03, from: 'random' },
                    scrollTrigger: { trigger: '#skills-container', start: 'top 85%', once: true },
                });

                return () => gsap.ticker.remove(tickMarquee);
            });

            // Smaller screens: project cards just rise in
            mm.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
                gsap.utils.toArray('#projects-track > .flip-card').forEach((card) => {
                    gsap.from(card, {
                        y: 60,
                        opacity: 0,
                        duration: 0.9,
                        ease: 'power3.out',
                        scrollTrigger: { trigger: card, start: 'top 90%' },
                    });
                });
            });
        })();
