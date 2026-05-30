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
- ✅ Hero3D: Spline 3D interactive scene + Aceternity spotlight + premium gradient typography (KATEY in white→grey gradient, Elinam. in cyan italic with glow)
- ✅ Hero CTAs: View My Work / Ask My AI (opens chat) / Download CV
- ✅ AI Features showcase: 6 cards highlighting chat assistant, polish, summarizer, visitor intelligence, grounded responses, ship-ready stack
- ✅ About: orbiting skill badges, animated counters
- ✅ Skills: tabbed categories + marquee certifications
- ✅ Experience: scroll-animated timeline
- ✅ Projects: 9 cards total — 3 with REAL live screenshots (flowitec.com, greendevassociates.com, flowitecgoandgrow.com via thum.io), 6 mockup projects (Stock Hub, EstateView, PulsePOS, OrbitCRM, MediTrack, FleetOps) using Unsplash dashboard imagery
- ✅ 3D tilt + glow on hover, AI Summary button per project
- ✅ Contact: dark form, AI polish button, Resend integration ready
- ✅ Floating chat assistant: Claude Sonnet 4.5 with full CV context, multi-turn
- ✅ Visitor personalization via document.referrer
- ✅ Removed Made-with-Emergent badge
- ✅ Dark/light toggle, SEO meta + JSON-LD Person schema, OG tags
- ✅ Backend tests: 10/10 pass

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
