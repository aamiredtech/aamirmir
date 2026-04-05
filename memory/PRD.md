# Aamir Mir Consulting Website - PRD

## Original Problem Statement
Build a premium, global-standard personal + consulting website for Aamir Mir — Execution & Capability Architect. Brand: Aamir Mir Consulting / CertScope Labs. Theme: Dark/Light (Orange & Black like altrdtech.com). Full CMS with admin panel.

## Architecture
- **Frontend**: React + Tailwind CSS + Shadcn UI + Framer Motion
- **Backend**: FastAPI + MongoDB (Motor async driver)
- **Auth**: Emergent Google OAuth for admin
- **Email**: SendGrid (MOCKED for now)
- **Fonts**: Cabinet Grotesk (headings) + Satoshi (body)

## User Personas
1. **Business Owners** (primary) - seeking growth systems
2. **Coaches & Trainers** - capability building
3. **Senior Executives** - delivery transformation
4. **EdTech Founders** - AdTech and marketing systems
5. **Growth-stage Startups** - automation systems

## Core Requirements
- Hero section with authority positioning
- About section with stats and bio
- 5 Services (Problem → System → Outcome)
- Systems Thinking visual framework
- Case Studies with metrics
- Blog CMS with categories
- Lead capture (Book Call, Audit, Newsletter)
- Admin Panel (Blog, Leads, Subscribers, Content management)
- Dark/Light theme toggle

## What's Been Implemented (April 5, 2026)
- [x] Full homepage: Hero, About, Services, Systems Thinking, Case Studies, CTA, FAQ, Footer
- [x] Dark/Light theme toggle
- [x] Blog listing page with categories
- [x] Blog post detail page
- [x] Admin panel: Dashboard, Blog CMS, Leads, Subscribers, Content editor
- [x] Emergent Google OAuth for admin
- [x] Lead capture forms (Book Call + Newsletter)
- [x] All content editable via admin panel
- [x] Backend: 23+ API endpoints all functional
- [x] Testing: 98% pass rate

## Prioritized Backlog
### P0 (Next)
- Replace placeholder portrait with actual Aamir Mir photo
- Add SendGrid API key for email automation
- Add more blog posts as content

### P1
- Rich text editor (WYSIWYG) for blog content
- Image upload for blog featured images
- SEO meta tags per page
- Contact page / standalone form

### P2
- Courses / Cohorts section (future scalability)
- Paid newsletter integration
- Analytics dashboard in admin
- Social media links / integrations
- Client testimonials section

## Next Tasks
1. Connect SendGrid for email automation
2. Add actual content/photos
3. Deploy to production domain
