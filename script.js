
console.log("💡 Pro tip: Check out the terminal-style interactions!");
console.log("🚀 Built with vanilla JS, CSS, and a lot of coffee.");
console.log("🎯 Looking for the source code? Check out the GitHub link!");

// Dark mode functionality
function initDarkMode() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const darkModeIcon = document.querySelector('.dark-mode-icon');
    
    // Check for saved theme preference or default to dark mode
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Update icon based on current theme
    updateDarkModeIcon(currentTheme);
    
    // Add click event listener
    darkModeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Update theme
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update icon
        updateDarkModeIcon(newTheme);
    });
}

function updateDarkModeIcon(theme) {
    const darkModeIcon = document.querySelector('.dark-mode-icon');
    if (darkModeIcon) {
        darkModeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
}


// Boot animation and terminal effects
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dark mode
    initDarkMode();

    // Project comment typing animation
    setTimeout(() => {
        const projectCards = document.querySelectorAll('.project-terminal');
        
        projectCards.forEach((card) => {
            const commentElement = card.querySelector('.proj-comment');
            const cursorElement = card.querySelector('.cursor-blink');
            if (!commentElement) return;

            const commentText = commentElement.getAttribute('data-comment');
            if (!commentText) return;

            let hasTyped = false;

            function typeComment() {
                if (hasTyped) return;
                hasTyped = true;

                // Check for reduced motion preference
                const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                
                if (prefersReducedMotion) {
                    commentElement.textContent = `// ${commentText}`;
                    commentElement.classList.add('visible');
                    if (cursorElement) {
                        cursorElement.classList.add('complete');
                    }
                    return;
                }

                commentElement.classList.add('typing');
                commentElement.textContent = '// ';
                
                if (cursorElement) {
                    cursorElement.classList.add('typing');
                }
                
                let i = 0;
                const typeInterval = setInterval(() => {
                    if (i < commentText.length) {
                        commentElement.textContent += commentText.charAt(i);
                        i++;
                    } else {
                        clearInterval(typeInterval);
                        commentElement.classList.remove('typing');
                        commentElement.classList.add('visible');
                        if (cursorElement) {
                            cursorElement.classList.remove('typing');
                            cursorElement.classList.add('complete');
                        }
                    }
                }, 35); // 30-45ms per character
            }

            // Mouse events
            card.addEventListener('mouseenter', typeComment);
            card.addEventListener('touchstart', typeComment, { passive: true });

            // Keyboard focus
            card.addEventListener('focus', () => {
                commentElement.textContent = `// ${commentText}`;
                commentElement.classList.add('visible');
                if (cursorElement) {
                    cursorElement.classList.add('complete');
                }
                hasTyped = true;
            });
        });
    }, 100);


    // Session-based boot screen logic
    const bootContainer = document.getElementById('boot-container');
    const bootScreen = document.getElementById('boot-screen');
    const homeTerminal = document.querySelector('.home-terminal');
    
    // Check if boot has been seen in this session
    const bootSeen = sessionStorage.getItem('bootSeen');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (bootSeen || prefersReducedMotion) {
        // Skip boot sequence - show terminal immediately
        if (prefersReducedMotion) {
            sessionStorage.setItem('bootSeen', '1');
        }
        showTerminalImmediately();
    } else {
        // Show boot sequence
        bootContainer.removeAttribute('hidden');
        runBootSequence();
    }
    
    function showTerminalImmediately() {
        if (homeTerminal) {
            homeTerminal.classList.add('visible', 'intro-complete');
            startTerminalTyping();
        }
    }
    
    function runBootSequence() {
        // Hide boot screen and show terminal after 2 seconds
        setTimeout(() => {
            bootScreen.classList.add('fade-out');
            bootScreen.setAttribute('aria-hidden', 'true');
            setTimeout(() => {
                bootScreen.style.display = 'none';
                sessionStorage.setItem('bootSeen', '1');
                if (homeTerminal) {
                    homeTerminal.classList.add('visible');
                    startTerminalTyping();
                }
            }, 800);
        }, 2000);
    }

    // Terminal typing effect
    function startTerminalTyping() {
        const mainLine = document.querySelector('.main-line .command-text');
        const cursor = document.querySelector('.main-line .cursor-blink');
        const staticLines = document.querySelectorAll('.static-line');
        const commentLine = document.querySelector('.comment-line');
        
        if (!mainLine || !cursor) return;

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            // Show all lines instantly
            staticLines.forEach((line, index) => {
                setTimeout(() => {
                    line.style.opacity = '1';
                }, index * 100);
            });
            if (commentLine) {
                setTimeout(() => {
                    commentLine.style.opacity = '1';
                }, 200);
            }
            return;
        }

        // Hide cursor initially
        cursor.style.opacity = '0';
        
        // Start typing effect
        setTimeout(() => {
            const text = mainLine.textContent;
            mainLine.textContent = '';
            cursor.style.opacity = '1';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    mainLine.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 50); // 40-60ms per character
                } else {
                    // Hide cursor after typing completes
                    cursor.style.opacity = '0';
                    
                    // Show static lines after typing completes
                    setTimeout(() => {
                        staticLines.forEach((line, index) => {
                            setTimeout(() => {
                                line.style.opacity = '1';
                            }, index * 200);
                        });
                        if (commentLine) {
                            setTimeout(() => {
                                commentLine.style.opacity = '1';
                            }, 400);
                        }
                    }, 500);
                }
            };
            
            typeWriter();
        }, 300);
    }
    // Intersection Observer for scroll-triggered animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Stagger animations for project cards
                if (entry.target.classList.contains('project-card')) {
                    entry.target.style.animationDelay = `${index * 0.1}s`;
                }
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.section-title, .about-content, .projects-grid, .experience-content, .leadership-content, .contact-links, .footer');
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Observe individual project cards for staggered animations
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        observer.observe(card);
    });

    // Add enhanced hover effects to project cards
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.boxShadow = '0 15px 40px rgba(0, 71, 171, 0.2)';
            this.style.borderColor = '#0047ab';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            this.style.borderColor = '#e9ecef';
        });
    });

    // Add glow effect to contact links
    const contactLinks = document.querySelectorAll('.contact-link');
    contactLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.animation = 'glow 1.5s ease-in-out infinite';
        });

        link.addEventListener('mouseleave', function() {
            this.style.animation = 'none';
        });
    });

    // Add subtle parallax effect to hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    });

    // Add smooth reveal animation for section titles
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        title.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.color = '#0047ab';
        });
        
        title.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.color = '';
        });
    });


    // Add floating animation to logo items
    const logoItems = document.querySelectorAll('.logo-item');
    logoItems.forEach((item, index) => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
            this.style.boxShadow = '0 8px 25px var(--accent-glow)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 5px 15px var(--accent-glow)';
        });
    });


    // Navigation functionality
    const navLinks = document.querySelectorAll('.nav-link');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    // Hamburger menu toggle
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        this.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Staggered animation for stats row
    const statsItems = document.querySelectorAll('.stat-item');
    if (statsItems.length > 0) {
        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            // Show all stats immediately without animation
            statsItems.forEach(item => {
                item.classList.add('animate');
            });
        } else {
            // Animate stats with stagger
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const delay = parseInt(entry.target.getAttribute('data-delay')) || 0;
                        setTimeout(() => {
                            entry.target.classList.add('animate');
                        }, delay);
                    }
                });
            }, { threshold: 0.3 });

            statsItems.forEach(item => {
                observer.observe(item);
            });
        }
    }

});
