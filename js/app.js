/**
 * Tech Crafter - Main Application
 * Dynamically renders content from JSON data files and handles form submission
 */

// Global state
const APP_STATE = {
    config: null,
    projects: null,
    experience: null,
    skills: null,
    certificates: null,
    isFormSubmitting: false
};

/**
 * Initialize the application
 */
async function initializeApp() {
    try {
        // Load all data files
        await Promise.all([
            loadConfigData(),
            loadProjectsData(),
            loadExperienceData(),
            loadSkillsData(),
            loadCertificatesData()
        ]);

        // Render all sections
        renderHeroSection();
        renderAboutSection();
        renderExperienceSection();
        renderSkillsSection();
        renderProjectsSection();
        renderCertificatesSection();
        renderFooter();
        setupFormHandling();

        // Set current year
        document.getElementById('current-year').textContent = new Date().getFullYear();
    } catch (error) {
        console.error('Error initializing app:', error);
        showError('Failed to load website data. Please refresh the page.');
    }
}

/**
 * Load configuration data
 */
async function loadConfigData() {
    APP_STATE.config = await fetch('data/config.json').then(r => r.json());

    // Update dynamic meta tags with config values
    document.querySelector('meta[property="og:url"]').setAttribute('content', APP_STATE.config.siteUrl);
    document.querySelector('link[rel="canonical"]').setAttribute('href', APP_STATE.config.siteUrl);
}

/**
 * Load projects data
 */
async function loadProjectsData() {
    APP_STATE.projects = await fetch('data/projects.json').then(r => r.json());
}

/**
 * Load experience data
 */
async function loadExperienceData() {
    APP_STATE.experience = await fetch('data/experience.json').then(r => r.json());
}

/**
 * Load skills data
 */
async function loadSkillsData() {
    APP_STATE.skills = await fetch('data/skills.json').then(r => r.json());
}

/**
 * Load certificates data
 */
async function loadCertificatesData() {
    APP_STATE.certificates = await fetch('data/certificates.json').then(r => r.json());
}

/**
 * Render hero section with dynamic content
 */
function renderHeroSection() {
    document.getElementById('hero-tagline').textContent = APP_STATE.config.heroTagline;
    document.getElementById('cta-primary').textContent = APP_STATE.config.cta.primary.text;
    document.getElementById('cta-primary').href = APP_STATE.config.cta.primary.url;
    document.getElementById('cta-secondary').textContent = APP_STATE.config.cta.secondary.text;
    document.getElementById('cta-secondary').href = APP_STATE.config.cta.secondary.url;
}

/**
 * Render about section
 */
function renderAboutSection() {
    document.getElementById('about-description').textContent = APP_STATE.config.aboutDescription;
}

/**
 * Render experience section
 */
function renderExperienceSection() {
    const container = document.getElementById('experience-list');
    container.innerHTML = '';

    APP_STATE.experience.forEach(job => {
        const jobHTML = `
      <div class="experience-item">
        <h4>${job.position}</h4>
        <div class="meta">${job.company} • ${job.startDate} - ${job.endDate}</div>
        <p>${job.description}</p>
      </div>
    `;
        container.innerHTML += jobHTML;
    });
}

/**
 * Render skills section with categories
 */
function renderSkillsSection() {
    const container = document.getElementById('skills-container');
    container.innerHTML = '';

    // Map categories to icons
    const iconMap = {
        'Programming Languages': 'fas fa-code',
        'Web Frameworks': 'fas fa-network-wired',
        'Version Control': 'fab fa-git-alt',
        'Database Systems': 'fas fa-database',
        'ORM': 'fas fa-cog',
        'Server Infrastructure': 'fas fa-server',
        'Containerization': 'fab fa-docker',
        'Data Analysis & Manipulation': 'fas fa-chart-bar',
        'ETL Tools': 'fas fa-arrows-alt',
        'Cloud Automation': 'fas fa-cloud',
        'Soft Skills': 'fas fa-handshake'
    };

    APP_STATE.skills.categories.forEach(category => {
        const icon = iconMap[category.name] || 'fas fa-star';
        const categoryHTML = `
      <div class="skill-category">
        <h4><i class="${icon}"></i> ${category.name}</h4>
        <div class="skill-grid">
          ${category.skills.map(skill => `<div class="skill-item">${skill}</div>`).join('')}
        </div>
      </div>
    `;
        container.innerHTML += categoryHTML;
    });
}

/**
 * Render projects grid
 */
function renderProjectsSection() {
    const container = document.getElementById('projects-grid');
    container.innerHTML = '';

    APP_STATE.projects.forEach(project => {
        const projectHTML = `
      <div class="project-card">
        <img src="${project.image}" alt="${project.title}" class="project-image">
        <div class="project-content">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <div class="project-tags">
            ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
          <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="project-link">
            <i class="fab fa-github"></i>
            <span>Github</span>
          </a>
        </div>
      </div>
    `;
        container.innerHTML += projectHTML;
    });
}

/**
 * Render certificates list
 */
function renderCertificatesSection() {
    const container = document.getElementById('certificates-list');
    container.innerHTML = '';

    APP_STATE.certificates.forEach(cert => {
        const certHTML = `
      <div class="certificate-item">
        <div class="certificate-info">
          <h4>${cert.title}</h4>
          <div class="certificate-issuer">${cert.issuer}</div>
        </div>
        <a href="${cert.url}" target="_blank" rel="noopener noreferrer" class="certificate-link">View Certificate</a>
      </div>
    `;
        container.innerHTML += certHTML;
    });
}

/**
 * Render footer with social links
 */
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

    socialLinks.forEach(link => {
        const linkHTML = `<a href="${link.url}" target="_blank" rel="noopener noreferrer" title="${link.name}"><i class="${link.icon}"></i></a>`;
        container.innerHTML += linkHTML;
    });
}

/**
 * Setup form handling with AJAX submission
 */
function setupFormHandling() {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('form-submit');

    // Update Formspree action if formspreeId is set
    if (APP_STATE.config.contact.formspreeId !== 'YOUR_FORMSPREE_ID') {
        form.action = `https://formspree.io/f/${APP_STATE.config.contact.formspreeId}`;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Prevent multiple submissions
        if (APP_STATE.isFormSubmitting) return;
        APP_STATE.isFormSubmitting = true;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        try {
            const formData = new FormData(form);

            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Show success message
                showSuccess('Thank you for your message. I will respond to you as soon as possible.');

                // Reset form
                form.reset();
            } else {
                // Show error message
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

/**
 * Show success message overlay
 */
function showSuccess(message) {
    const overlay = document.getElementById('message-overlay');
    const box = document.getElementById('message-box');
    const title = document.getElementById('message-title');
    const content = document.getElementById('message-content');
    const closeBtn = document.getElementById('message-close');

    // Update message
    title.textContent = 'Success!';
    title.style.color = '#27ae60';
    content.textContent = message;

    // Update box styling
    box.classList.add('success');
    box.classList.remove('error');

    // Show overlay
    overlay.classList.add('show');

    // Close button handler
    closeBtn.onclick = () => {
        overlay.classList.remove('show');
    };

    // Auto-close after 5 seconds
    setTimeout(() => {
        overlay.classList.remove('show');
    }, 5000);
}

/**
 * Show error message overlay
 */
function showError(message) {
    const overlay = document.getElementById('message-overlay');
    const box = document.getElementById('message-box');
    const title = document.getElementById('message-title');
    const content = document.getElementById('message-content');
    const closeBtn = document.getElementById('message-close');

    // Update message
    title.textContent = 'Error';
    title.style.color = '#e74c3c';
    content.textContent = message;

    // Update box styling
    box.classList.add('error');
    box.classList.remove('success');

    // Show overlay
    overlay.classList.add('show');

    // Close button handler
    closeBtn.onclick = () => {
        overlay.classList.remove('show');
    };

    // Auto-close after 5 seconds
    setTimeout(() => {
        overlay.classList.remove('show');
    }, 5000);
}

/**
 * Smooth scroll for navigation links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Only prevent default for internal anchor links
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/**
 * Initialize app when DOM is ready
 */
document.addEventListener('DOMContentLoaded', initializeApp);

// Fallback for older browsers
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
