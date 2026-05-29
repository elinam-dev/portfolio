# Katey Elinam — AI Portfolio (PRD)

## Original Problem
World-class AI-powered personal portfolio for Katey Elinam (Full Stack Web Dev | Entrepreneur, Accra Ghana). Dark Awwwards-level aesthetic, cinematic motion, AI chat assistant + project summarizer + contact message polish, visitor personalization, hero with photo + scramble name + particle mesh, vertical timeline, project tilt cards, smart contact form (Resend email).

## Stack
- React 19 + CRA + Tailwind utilities + custom CSS
- FastAPI + MongoDB (motor)
- emergentintegrations → Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Resend (optional; falls back to Mongo storage)
- Phosphor Icons, custom canvas particle mesh + scramble + typewriter (no Three.js/GSAP needed; vanilla canvas + React)

## Implemented (Dec 2025)
- ✅ Hero: animated grain, custom magnetic cursor, particle mesh, scramble name, role typewriter, photo with cinematic mask, CTAs
- ✅ About: orbiting skill badges around photo, animated counters (years/projects/tech)
- ✅ Skills: tabbed categories from CV with hover-glow bubbles + marquee certifications
- ✅ Experience: scroll-driven animated vertical timeline with drawing connector
- ✅ Projects: 4 project cards with 3D mouse-tracked tilt, glow overlay, AI Summary button (Claude)
- ✅ Contact: dark form, "Let AI polish this" (Claude), Resend email when key set, MongoDB fallback
- ✅ Floating chat assistant: Claude Sonnet 4.5 with full CV context, multi-turn via session_id
- ✅ Visitor personalization: document.referrer → headline variant
- ✅ Loader, dark/light toggle, SEO meta + JSON-LD Person schema, OG tags
- ✅ Backend tests: 10/10 pass (`/app/backend/tests/backend_test.py`)

## API Surface (all /api prefix)
- GET /api/health
- GET /api/cv → structured CV (used by frontend)
- POST /api/chat {session_id?, message, referrer?} → multi-turn Claude
- POST /api/polish {text} → professional rewrite
- POST /api/summarize {name, description, tech_stack[]} → 2-sentence summary
- POST /api/contact {name, email, subject, message} → store + (optional) email

## Pending / Backlog
- P1: Resend API key from user → enable real email delivery (`RESEND_API_KEY` in /app/backend/.env)
- P1: Real project screenshots from user (currently using generated covers)
- P2: GSAP/Three.js upgrade if user wants heavier motion (current canvas mesh is performant + sharp)
- P2: Replace CV PDF download link if user wants a re-uploaded version
- P2: Admin view of contact submissions (currently in `contact_messages` collection)

## Personas
- **Hiring manager / recruiter**: scans hero → projects → contact. Personalized headline kicks in via referrer.
- **Fellow developer**: explores skills & GitHub. AI chat answers tech questions.
- **Client / freelance lead**: uses contact form with AI polish for clean inquiry.

## Test Credentials
None — public site. See `/app/memory/test_credentials.md`.
