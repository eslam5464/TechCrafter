# Tech Crafter - Dynamic Portfolio Website

## 🌐 Live Demo

<https://techcrafter.dev>

> Note: The `siteUrl` in `data/config.json` is the source of truth. Update it there when switching domains.

A modern, dynamic portfolio website built with vanilla JavaScript and JSON-based content management. Hosted on GitHub Pages with easy-to-update content files.

## Features

✨ **Fully Dynamic Content** - Update all portfolio content by editing JSON files  
📱 **Responsive Design** - Beautiful on desktop, tablet, and mobile devices  
⚡ **Zero Build Process** - No build tools needed, works directly on GitHub Pages  
🎨 **Modern Styling** - Clean, professional design with smooth animations  
📧 **Contact Form** - Formspree integration for easy form submissions  
📊 **Google Analytics** - Built-in analytics tracking  
🔍 **SEO Optimized** - Meta tags, Open Graph, and structured data

## Project Structure

```text
techcrafter/
├── index.html           # Main HTML template
├── css/
│   └── style.css       # Complete stylesheet
├── js/
│   └── app.js          # Main application logic
├── data/
│   ├── config.json     # Site configuration & social links
│   ├── projects.json   # Portfolio projects
│   ├── experience.json # Work experience
│   ├── skills.json     # Technical skills
│   └── certificates.json # Courses & certifications
├── assets/
│   └── images/
│       ├── logo.webp
│       ├── profile.jpg
│       └── projects/   # Project images
├── .gitignore
└── README.md
```

## Data Files

### config.json

Contains site-wide configuration:

- Site URL (dynamic for domain changes)
- Author information
- Social media links
- CTA buttons
- About description

### projects.json

Array of project objects with:

- Title and description
- GitHub links
- Project images (local paths)
- Technology tags

### experience.json

Array of job experience with:

- Position and company
- Date range
- Job description

### skills.json

Grouped skills by category:

- Programming languages
- Frameworks & tools
- Databases
- Other technical skills

### certificates.json

Array of certifications with:

- Certificate title
- Issuing organization
- External links to credentials

## How to Use

### 1. Set Up GitHub Repository

```bash
# Create a new repository named eslam5464.github.io
git clone https://github.com/eslam5464/eslam5464.github.io.git
cd eslam5464.github.io

# Copy all files from this project
cp -r techcrafter/* .

# Initialize git and push
git add .
git commit -m "Initial commit: Tech Crafter portfolio"
git push origin main
```

### 2. Enable GitHub Pages

1. Go to repository Settings
2. Scroll to "GitHub Pages"
3. Select "main" branch as source
4. Your site will be live at `https://eslam5464.github.io`

### 3. Set Up Formspree

1. Go to [formspree.io](https://formspree.io)
2. Sign up or log in
3. Create a new form for `eslam@techcrafter.dev`
4. Get your Form ID (looks like: `f/xxxxxxxx`)
5. Update `data/config.json` with your Form ID:

   ```json
   "contact": {
     "formEmail": "eslam@techcrafter.dev",
     "formspreeId": "YOUR_ACTUAL_FORM_ID"
   }
   ```

### 4. Set Up Google Analytics (Optional)

1. Go to [analytics.google.com](https://analytics.google.com)
2. Create a new property for your website
3. Get your GA ID (looks like: `G-XXXXXXXXXX`)
4. Replace `G-XXXXXXXXXX` in `index.html` with your actual ID

### 5. Update Content

Simply edit the JSON files in the `data/` folder:

**To add a new project:**

```json
// data/projects.json
{
  "id": 6,
  "title": "New Project",
  "description": "Project description",
  "image": "assets/images/projects/new-project.jpg",
  "github": "https://github.com/eslam5464/project",
  "tags": ["Technology", "Stack"]
}
```

**To update experience:**

```json
// data/experience.json
{
  "id": 1,
  "position": "Your Position",
  "company": "Company Name",
  "startDate": "Jan 2025",
  "endDate": "Present",
  "description": "Job description"
}
```

**To add a new certificate:**

```json
// data/certificates.json
{
  "id": 6,
  "title": "New Certificate",
  "issuer": "Issuing Organization",
  "url": "https://certificate-url",
  "date": "2025"
}
```

## Customization

### Colors & Typography

Edit `css/style.css` to customize:

- Color scheme (variables at the top)
- Typography and font sizes
- Spacing and padding
- Responsive breakpoints

### Adding Your Own Images

1. Add images to `assets/images/`
2. Reference them in JSON files with relative paths
3. Supported formats: JPG, PNG, WebP

### Making It Your Own Domain

When ready to use your own domain (e.g., techcrafter.dev):

1. Purchase domain from registrar
2. In GitHub repo Settings → Pages → Custom domain
3. Add your domain name
4. Update `data/config.json` `siteUrl` to your domain
5. Configure DNS settings at your registrar

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android)

## Performance

- Lighthouse Score: 90+
- Zero external dependencies
- ~30KB total size (minified)
- Fast page load times

## Maintenance

- **Update content**: Edit JSON files directly on GitHub
- **Change styling**: Modify CSS in `css/style.css`
- **Add sections**: Edit HTML in `index.html` and add rendering in `js/app.js`

## Troubleshooting

**Form not receiving emails?**

- Verify Formspree Form ID in config.json
- Check spam folder
- Ensure email is verified in Formspree

**Images not loading?**

- Check image paths in JSON files are correct
- Verify images exist in `assets/images/` folder
- Use relative paths starting with `assets/`

**Analytics not tracking?**

- Verify GA ID is correct in index.html
- Wait 24 hours for first data to appear
- Check Google Analytics property settings

## License

This project is free to use and customize for personal use.

## Support

For issues or questions, check the following:

- GitHub Issues in the repository
- Formspree documentation: <https://formspree.io/docs>
- Google Analytics Help: <https://support.google.com/analytics>
