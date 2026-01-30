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

// Active Sidebar Link on Scroll - Enhanced
const sidebarLinks = document.querySelectorAll('.sidebar-nav a, .mobile-sidebar .sidebar-nav a');

function setActiveLink() {
    let currentSection = '';
    const scrollPos = window.pageYOffset + 200; // Offset for better detection

    // Get all elements with IDs (sections and h3s)
    const allTargets = [];
    document.querySelectorAll('[id]').forEach(el => {
        // Check if this ID is referenced in sidebar
        const hasLink = Array.from(sidebarLinks).some(link => 
            link.getAttribute('href') === `#${el.id}`
        );
        if (hasLink) {
            allTargets.push({
                id: el.id,
                top: el.offsetTop,
                bottom: el.offsetTop + el.offsetHeight
            });
        }
    });

    // Sort by position
    allTargets.sort((a, b) => a.top - b.top);

    // Find current section
    for (let i = allTargets.length - 1; i >= 0; i--) {
        if (scrollPos >= allTargets[i].top - 100) {
            currentSection = allTargets[i].id;
            break;
        }
    }

    // Update active states
    sidebarLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        
        if (href === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Throttle scroll event for better performance
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(() => {
        setActiveLink();
    });
});

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
            // Optional: You can add a toast notification here
            console.log('Link copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });

        // Update URL without scrolling
        history.pushState(null, null, '#' + id);
    });
});

// Smooth scroll enhancement for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Skip if it's just "#"
        if (href === '#') return;
        
        e.preventDefault();
        
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            const headerOffset = 100;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Update URL
            history.pushState(null, null, href);
        }
    });
});

// Blog Filter Functionality
document.addEventListener('DOMContentLoaded', function() {
    const filterTags = document.querySelectorAll('.filter-tag');
    const blogPosts = document.querySelectorAll('.blog-post');
    
    if (filterTags.length === 0 || blogPosts.length === 0) {
        return; // Not on blog page
    }

    filterTags.forEach(tag => {
        tag.addEventListener('click', function() {
            const selectedTag = this.getAttribute('data-tag');
            
            // Update active state
            filterTags.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Filter posts
            let visibleCount = 0;
            blogPosts.forEach(post => {
                const postTags = post.getAttribute('data-tags');
                
                if (selectedTag === 'all' || postTags.includes(selectedTag)) {
                    post.classList.remove('hidden');
                    visibleCount++;
                } else {
                    post.classList.add('hidden');
                }
            });
            
            // Handle empty state
            handleEmptyState(visibleCount);
        });
    });
    
    function handleEmptyState(visibleCount) {
        // Remove existing empty state message
        const existingMessage = document.querySelector('.no-posts-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        if (visibleCount === 0) {
            // Add empty state message
            const message = document.createElement('div');
            message.className = 'no-posts-message';
            message.textContent = 'No posts found with this tag.';
            document.querySelector('main').appendChild(message);
        }
    }
});
