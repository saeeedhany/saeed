// Theme Toggle
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = themeToggle.querySelector('i');
const html = document.documentElement;

// Check for saved theme preference or default to 'dark'
const currentTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    if (theme === 'dark') {
        themeIcon.className = 'fas fa-sun';
    } else {
        themeIcon.className = 'fas fa-moon';
    }
}

// Mobile Menu
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileSidebar = document.querySelector('.mobile-sidebar');
const overlay = document.querySelector('.overlay');

mobileMenuBtn.addEventListener('click', () => {
    mobileSidebar.classList.toggle('active');
    overlay.classList.toggle('active');
});

overlay.addEventListener('click', () => {
    mobileSidebar.classList.remove('active');
    overlay.classList.remove('active');
});

// Close mobile sidebar when clicking a link
const mobileSidebarLinks = document.querySelectorAll('.mobile-sidebar a');
mobileSidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileSidebar.classList.remove('active');
        overlay.classList.remove('active');
    });
});

// Active Sidebar Link on Scroll
const sections = document.querySelectorAll('section, h3[id]');
const sidebarLinks = document.querySelectorAll('.sidebar-nav a, .mobile-sidebar .sidebar-nav a');

function setActiveLink() {
    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 100) {
            currentSection = section.getAttribute('id');
        }
    });

    sidebarLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', setActiveLink);
window.addEventListener('load', setActiveLink);

// Clickable Headings - Copy anchor link
const headingsWithId = document.querySelectorAll('h1[id], h2[id], h3[id]');
headingsWithId.forEach(heading => {
    heading.style.cursor = 'pointer';
    heading.addEventListener('click', function() {
        const id = this.getAttribute('id');
        const url = window.location.origin + window.location.pathname + '#' + id;

        // Copy to clipboard
        navigator.clipboard.writeText(url).then(() => {
            // Optional: Show a brief notification
            const originalText = this.textContent;
            // You can add a toast notification here if desired
        }).catch(err => {
                console.error('Failed to copy: ', err);
            });

        // Update URL without scrolling
        history.pushState(null, null, '#' + id);
    });
});
