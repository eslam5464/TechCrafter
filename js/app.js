/**
 * Tech Crafter - Main Application
 * Dynamically renders data-driven sections and controls UI interactions.
 */

const APP_STATE = {
    config: null,
    projects: null,
    experience: null,
    skills: null,
    certificates: null,
    isFormSubmitting: false,
    typingTimer: null
};

function getPreferredTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function syncThemeMetaColor(theme) {
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (!themeMeta) {
        return;
    }

    themeMeta.setAttribute('content', theme === 'dark' ? '#000000' : '#ffffff');
}

function updateThemeToggleButton(theme) {
    const toggleButton = document.getElementById('theme-toggle');
    if (!toggleButton) {
        return;
    }

    const icon = toggleButton.querySelector('i');
    const isDark = theme === 'dark';

    if (icon) {
        icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    }

    toggleButton.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    toggleButton.setAttribute('title', isDark ? 'Switch to light theme' : 'Switch to dark theme');
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    syncThemeMetaColor(theme);
    updateThemeToggleButton(theme);
}

function initializeThemeToggle() {
    const toggleButton = document.getElementById('theme-toggle');
    if (!toggleButton) {
        return;
    }

    const initialTheme = getPreferredTheme();
    applyTheme(initialTheme);

    toggleButton.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
    });
}

function initializeMobileNavigation() {
    const menuButton = document.getElementById('menu-toggle');
    const nav = document.getElementById('header-nav');
    const backdrop = document.getElementById('nav-backdrop');

    if (!menuButton || !nav || !backdrop) {
        return;
    }

    const closeMenu = () => {
        nav.classList.remove('open');
        backdrop.classList.remove('show');
        menuButton.setAttribute('aria-expanded', 'false');
    };

    const openMenu = () => {
        nav.classList.add('open');
        backdrop.classList.add('show');
        menuButton.setAttribute('aria-expanded', 'true');
    };

    menuButton.addEventListener('click', () => {
        if (nav.classList.contains('open')) {
            closeMenu();
            return;
        }

        openMenu();
    });

    backdrop.addEventListener('click', closeMenu);

    nav.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeMenu();
        }
    });
}

function initializeScrollReveal() {
    const revealItems = document.querySelectorAll('[data-reveal]');
    if (!revealItems.length) {
        return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        revealItems.forEach((item) => item.classList.add('revealed'));
        return;
    }

    document.body.classList.add('enable-reveal');

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
}

function typeHeroTagline(text) {
    const output = document.getElementById('hero-tagline-text');
    const cursor = document.querySelector('.typing-cursor');

    if (!output) {
        return;
    }

    if (APP_STATE.typingTimer) {
        clearTimeout(APP_STATE.typingTimer);
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        output.textContent = text;
        if (cursor) {
            cursor.style.display = 'none';
        }
        return;
    }

    output.textContent = '';
    let index = 0;

    const step = () => {
        output.textContent += text.charAt(index);
        index += 1;

        if (index < text.length) {
            APP_STATE.typingTimer = setTimeout(step, 22);
        }
    };

    step();
}

async function loadConfigData() {
    APP_STATE.config = await fetch('data/config.json').then((response) => response.json());

    document.querySelector('meta[property="og:url"]').setAttribute('content', APP_STATE.config.siteUrl);
    document.querySelector('link[rel="canonical"]').setAttribute('href', APP_STATE.config.siteUrl);
}

async function loadProjectsData() {
    APP_STATE.projects = await fetch('data/projects.json').then((response) => response.json());
}

async function loadExperienceData() {
    APP_STATE.experience = await fetch('data/experience.json').then((response) => response.json());
}

async function loadSkillsData() {
    APP_STATE.skills = await fetch('data/skills.json').then((response) => response.json());
}

async function loadCertificatesData() {
    APP_STATE.certificates = await fetch('data/certificates.json').then((response) => response.json());
}

function setHeroCta(buttonId, iconClass, text, url) {
    const button = document.getElementById(buttonId);
    if (!button) {
        return;
    }

    button.innerHTML = '';

    const icon = document.createElement('i');
    icon.className = iconClass;
    icon.setAttribute('aria-hidden', 'true');

    const label = document.createElement('span');
    label.textContent = text;

    button.append(icon, label);
    button.href = url;
}

function renderHeroSection() {
    setHeroCta('cta-primary', 'fab fa-linkedin', APP_STATE.config.cta.primary.text, APP_STATE.config.cta.primary.url);
    setHeroCta('cta-secondary', 'fas fa-envelope', APP_STATE.config.cta.secondary.text, APP_STATE.config.cta.secondary.url);

    typeHeroTagline(APP_STATE.config.heroTagline);
}

function renderAboutSection() {
    document.getElementById('about-description').textContent = APP_STATE.config.aboutDescription;
}

function renderExperienceSection() {
    const container = document.getElementById('experience-list');
    container.innerHTML = '';

    APP_STATE.experience.forEach((job) => {
        container.innerHTML += `
      <div class="experience-item">
        <h4>${job.position}</h4>
        <div class="meta">${job.company} • ${job.startDate} - ${job.endDate}</div>
        <p>${job.description}</p>
      </div>
    `;
    });
}

function renderSkillsSection() {
    const container = document.getElementById('skills-container');
    container.innerHTML = '';

    const iconMap = {
        'Programming Languages': 'fas fa-code',
        'Web Frameworks': 'fas fa-network-wired',
        'Version Control': 'fab fa-git-alt',
        'Database Systems': 'fas fa-database',
        ORM: 'fas fa-cog',
        'Server Infrastructure': 'fas fa-server',
        Containerization: 'fab fa-docker',
        'Data Analysis & Manipulation': 'fas fa-chart-bar',
        'ETL Tools': 'fas fa-arrows-alt',
        'Cloud Automation': 'fas fa-cloud',
        'Soft Skills': 'fas fa-handshake'
    };

    APP_STATE.skills.categories.forEach((category) => {
        const icon = iconMap[category.name] || 'fas fa-star';
        container.innerHTML += `
      <div class="skill-category">
        <h4><i class="${icon}"></i> ${category.name}</h4>
        <div class="skill-grid">
          ${category.skills.map((skill) => `<div class="skill-item">${skill}</div>`).join('')}
        </div>
      </div>
    `;
    });
}

function renderProjectsSection() {
    const container = document.getElementById('projects-grid');
    container.innerHTML = '';

    APP_STATE.projects.forEach((project, index) => {
        const reverseClass = index % 2 !== 0 ? 'reverse' : '';
        const githubLink = project.github
            ? `<a href="${project.github}" target="_blank" rel="noopener noreferrer" class="project-link">
                <i class="fab fa-github"></i>
                <span>GitHub</span>
              </a>`
            : '';

        container.innerHTML += `
      <article class="project-card ${reverseClass}">
        <div class="project-image-wrap">
          <img src="${project.image}" alt="${project.title}" class="project-image" loading="lazy">
        </div>
        <div class="project-content">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <div class="project-tags">
            ${project.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}
          </div>
          ${githubLink}
        </div>
      </article>
    `;
    });
}

function renderCertificatesSection() {
    const container = document.getElementById('certificates-list');
    container.innerHTML = '';

    APP_STATE.certificates.forEach((cert) => {
        container.innerHTML += `
      <div class="certificate-item">
        <div class="certificate-info">
          <h4>${cert.title}</h4>
          <div class="certificate-issuer">${cert.issuer}</div>
        </div>
        <a href="${cert.url}" target="_blank" rel="noopener noreferrer" class="certificate-link">View Certificate</a>
      </div>
    `;
    });
}

function renderFooter() {
    const container = document.getElementById('footer-social');
    container.innerHTML = '';

    const socialLinks = [
        {
            name: 'LinkedIn',
            url: APP_STATE.config.social.linkedin,
            icon: 'fab fa-linkedin-in'
        },
        {
            name: 'GitHub',
            url: APP_STATE.config.social.github,
            icon: 'fab fa-github'
        },
        {
            name: 'Email',
            url: APP_STATE.config.social.email,
            icon: 'fas fa-envelope'
        }
    ];

    socialLinks.forEach((link) => {
        container.innerHTML += `<a href="${link.url}" target="_blank" rel="noopener noreferrer" title="${link.name}"><i class="${link.icon}"></i></a>`;
    });
}

function showSuccess(message) {
    const overlay = document.getElementById('message-overlay');
    const box = document.getElementById('message-box');
    const title = document.getElementById('message-title');
    const content = document.getElementById('message-content');
    const closeBtn = document.getElementById('message-close');

    title.textContent = 'Success!';
    title.style.color = '#27ae60';
    content.textContent = message;

    box.classList.add('success');
    box.classList.remove('error');
    overlay.classList.add('show');

    closeBtn.onclick = () => {
        overlay.classList.remove('show');
    };

    setTimeout(() => {
        overlay.classList.remove('show');
    }, 5000);
}

function showError(message) {
    const overlay = document.getElementById('message-overlay');
    const box = document.getElementById('message-box');
    const title = document.getElementById('message-title');
    const content = document.getElementById('message-content');
    const closeBtn = document.getElementById('message-close');

    title.textContent = 'Error';
    title.style.color = '#e74c3c';
    content.textContent = message;

    box.classList.add('error');
    box.classList.remove('success');
    overlay.classList.add('show');

    closeBtn.onclick = () => {
        overlay.classList.remove('show');
    };

    setTimeout(() => {
        overlay.classList.remove('show');
    }, 5000);
}

function setupFormHandling() {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('form-submit');

    if (APP_STATE.config.contact.formspreeId !== 'YOUR_FORMSPREE_ID') {
        form.action = `https://formspree.io/f/${APP_STATE.config.contact.formspreeId}`;
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (APP_STATE.isFormSubmitting) {
            return;
        }

        APP_STATE.isFormSubmitting = true;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        try {
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    Accept: 'application/json'
                }
            });

            if (response.ok) {
                showSuccess('Thank you for your message. I will respond to you as soon as possible.');
                form.reset();
            } else {
                showError('Something went wrong. Please try again later.');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showError('An error occurred. Please try again later.');
        } finally {
            APP_STATE.isFormSubmitting = false;
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit';
        }
    });
}

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
            const href = anchor.getAttribute('href');
            if (!href || href === '#') {
                return;
            }

            const target = document.querySelector(href);
            if (!target) {
                return;
            }

            event.preventDefault();

            const header = document.querySelector('header');
            const headerOffset = header ? header.offsetHeight + 8 : 0;
            const targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset;
            window.scrollTo({ top: targetTop, behavior: 'smooth' });
        });
    });
}

async function initializeApp() {
    try {
        initializeThemeToggle();
        initializeMobileNavigation();

        await Promise.all([
            loadConfigData(),
            loadProjectsData(),
            loadExperienceData(),
            loadSkillsData(),
            loadCertificatesData()
        ]);

        renderHeroSection();
        renderAboutSection();
        renderExperienceSection();
        renderSkillsSection();
        renderProjectsSection();
        renderCertificatesSection();
        renderFooter();
        setupFormHandling();
        setupSmoothScroll();
        initializeScrollReveal();

        document.getElementById('current-year').textContent = new Date().getFullYear();
    } catch (error) {
        console.error('Error initializing app:', error);
        showError('Failed to load website data. Please refresh the page.');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}