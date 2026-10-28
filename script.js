document.addEventListener('DOMContentLoaded', () => {
    const year = document.getElementById('year');
    if (year) {
        year.textContent = new Date().getFullYear();
    }

    const menuToggle = document.querySelector('.menu-toggle');
    const navigation = document.querySelector('.nav-links');
    const navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));

    const closeMenu = () => {
        menuToggle?.setAttribute('aria-expanded', 'false');
        navigation?.classList.remove('is-open');
    };

    if (menuToggle && navigation) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', String(!isExpanded));
            navigation.classList.toggle('is-open', !isExpanded);
        });

        navigation.addEventListener('click', (event) => {
            if (event.target instanceof Element && event.target.closest('a')) {
                closeMenu();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeMenu();
                menuToggle.focus();
            }
        });
    }

    const sections = navLinks
        .map((link) => document.querySelector(link.getAttribute('href')))
        .filter((section) => section instanceof HTMLElement);

    if ('IntersectionObserver' in window && sections.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            const visibleSection = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

            if (!visibleSection) {
                return;
            }

            const activeLink = navLinks.find(
                (link) => link.getAttribute('href') === `#${visibleSection.target.id}`
            );

            navLinks.forEach((link) => {
                if (link === activeLink) {
                    link.classList.add('active');
                    link.setAttribute('aria-current', 'location');
                } else {
                    link.classList.remove('active');
                    link.removeAttribute('aria-current');
                }
            });
        }, { rootMargin: '-20% 0px -65% 0px' });

        sections.forEach((section) => observer.observe(section));
    }
});
