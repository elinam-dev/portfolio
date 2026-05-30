from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
import uuid
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime, timezone

import resend
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# Logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("portfolio")

# Mongo
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

# Resend
RESEND_API_KEY = os.environ.get("RESEND_API_KEY", "").strip()
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "onboarding@resend.dev")
CONTACT_RECIPIENT = os.environ.get("CONTACT_RECIPIENT", "kateyelinam@gmail.com")
if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

# LLM
EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY", "")
CLAUDE_MODEL = "claude-sonnet-4-5-20250929"

# CV CONTEXT (loaded once)
CV_CONTEXT = """
You are an AI assistant representing KATEY ELINAM on his personal portfolio website.
Always answer ONLY based on the CV details below. Be concise, friendly, professional,
and write in first-person plural ("Katey has..." / "He's worked with..."). If asked
something not in the CV, politely say it isn't covered and offer to connect via the
contact form. Keep replies under 120 words unless asked for detail. Never invent facts.

=== CV: KATEY ELINAM ===
Title: Full Stack Web Developer | Entrepreneur
Location: Accra, Ghana
Email: kateyelinam@gmail.com
Phone: +233 50 366 7746
LinkedIn: linkedin.com/in/kateyelinam
GitHub: github.com/elinam-dev

PROFESSIONAL SUMMARY:
Self-taught full stack web developer with 3+ years of freelance experience building
responsive websites and custom web applications for real clients. Proficient in
React, Next.js, TypeScript, JavaScript, Python, and Node.js. Founder of Watch Hub,
a retail business in Ghana, demonstrating strong entrepreneurial, sales, and
operational skills. Delivered 4 live production projects including a Learning
Management System and an AI-powered inventory management platform. Currently
pursuing a BSc in Earth Science at the University of Ghana.

SKILLS:
- Languages: JavaScript, TypeScript, Python, Java, C/C++, SQL, HTML5, CSS3
- Frontend: React, Next.js, Angular, React Native, Tailwind CSS, Responsive Design, UI/UX
- Backend: Node.js, REST APIs, Database Integration, Web Application Development
- DevOps: Docker, Docker Compose, CI/CD (GitHub Actions), Vercel, Railway
- Tools: Git, GitHub, VS Code, Google Workspace, Google Analytics, HubSpot
- Mobile: React Native, Expo
- Other: Inventory Systems, LMS Development, AI-powered Automation, Digital Marketing

EXPERIENCE:
1) Watch Hub - Founder & CEO (2025 - Present, Tema, Ghana)
   - Founded and operate a retail watch business managing sourcing, pricing, sales, customer relationships
   - Pitches & closes clients through direct outreach and relationship-driven sales
   - Implements digital marketing and promotional strategies
   - Oversees inventory control, financial recordkeeping, supplier coordination

2) Self-Employed - Freelance Web Developer (2022 - Present, Remote)
   - Delivered 4+ production websites and web apps for clients in Ghana using React, Next.js, TypeScript
   - Built an AI-powered inventory management system, corporate websites, and a full LMS
   - Manages full project lifecycle: scoping, design, development, deployment, support
   - Integrates RESTful APIs and AI-powered automation
   - Containerizes apps with Docker & Docker Compose
   - Implements CI/CD with GitHub Actions
   - Deploys to Vercel and Railway

PROJECTS:
- Stock Hub (AI-Powered Inventory Management System) - React, Next.js, AI automation, Docker, CI/CD, Railway
- GreenDev Associates - Corporate website with responsive design and custom CMS
- Flowitec LMS - Learning Management System with course management & auth, deployed on Vercel
- Flowitec Company Website - Official company site

EDUCATION:
- BSc Earth Science, University of Ghana (01/2025 - Present)
- Senior High School Certificate (General Science), Adisadel College (2022-2024)

CERTIFICATIONS:
- HubSpot Content Marketing Certification (May 2026, valid to Jun 2028)
- HubSpot Social Media Certification (May 2026, valid to Jun 2028)
- Google Analytics Certification (May 2026, valid to May 2027)

AVAILABILITY: Open to freelance projects and full-time opportunities (remote or Accra-based).
"""

# ----- App setup -----
app = FastAPI(title="Katey Elinam Portfolio API")
api_router = APIRouter(prefix="/api")


# ===== Models =====
class ContactMessage(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    subject: str = Field(min_length=1, max_length=200)
    message: str = Field(min_length=1, max_length=5000)


class ChatRequest(BaseModel):
    session_id: Optional[str] = None
    message: str = Field(min_length=1, max_length=2000)
    referrer: Optional[str] = None


class ChatResponse(BaseModel):
    session_id: str
    reply: str


class PolishRequest(BaseModel):
    text: str = Field(min_length=1, max_length=5000)


class SummarizeRequest(BaseModel):
    name: str
    description: str
    tech_stack: List[str] = []


# ===== Helpers =====
def make_chat(session_id: str, system_message: str) -> LlmChat:
    return LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=session_id,
        system_message=system_message,
    ).with_model("anthropic", CLAUDE_MODEL)


# ===== Routes =====
@api_router.get("/")
async def root():
    return {"message": "Katey Elinam Portfolio API", "status": "ok"}


@api_router.get("/health")
async def health():
    return {
        "status": "ok",
        "llm": bool(EMERGENT_LLM_KEY),
        "resend": bool(RESEND_API_KEY),
        "time": datetime.now(timezone.utc).isoformat(),
    }


@api_router.post("/chat", response_model=ChatResponse)
async def chat_with_assistant(req: ChatRequest):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=500, detail="LLM not configured")

    session_id = req.session_id or str(uuid.uuid4())

    # Pull prior conversation from db to maintain memory across requests
    prior = await db.chat_messages.find({"session_id": session_id}, {"_id": 0}).sort("ts", 1).to_list(100)

    # Build system message with optional visitor context
    visitor_hint = ""
    if req.referrer:
        visitor_hint = f"\n[Visitor context]: They arrived via {req.referrer}. Personalize if relevant."

    system_msg = CV_CONTEXT + visitor_hint

    chat = make_chat(session_id, system_msg)

    # Replay prior messages to maintain context (LlmChat handles new conv each call)
    try:
        # Compose conversation: replay history then current message
        history_blob = ""
        if prior:
            lines = []
            for m in prior[-10:]:
                role = m.get("role", "user")
                lines.append(f"{role.upper()}: {m.get('content','')}")
            history_blob = "\n\nRecent conversation so far:\n" + "\n".join(lines) + "\n\nNow respond to the user's next message."

        user_msg = UserMessage(text=(history_blob + "\nUSER: " + req.message) if history_blob else req.message)
        reply_text = await chat.send_message(user_msg)
    except Exception as e:
        logger.exception("LLM chat error")
        raise HTTPException(status_code=500, detail=f"Chat failed: {e}")

    # Persist
    now = datetime.now(timezone.utc).isoformat()
    await db.chat_messages.insert_many([
        {"session_id": session_id, "role": "user", "content": req.message, "ts": now},
        {"session_id": session_id, "role": "assistant", "content": reply_text, "ts": now},
    ])

    return ChatResponse(session_id=session_id, reply=reply_text)


@api_router.post("/polish")
async def polish_message(req: PolishRequest):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=500, detail="LLM not configured")

    system = (
        "You are a writing assistant. Rewrite the user's message to be more professional, "
        "warm, and clear while preserving meaning, length within ~30%, and voice. "
        "Return ONLY the rewritten text, no preface, no quotes."
    )
    chat = make_chat(f"polish-{uuid.uuid4()}", system)
    try:
        polished = await chat.send_message(UserMessage(text=req.text))
    except Exception as e:
        logger.exception("polish error")
        raise HTTPException(status_code=500, detail=f"Polish failed: {e}")

    return {"polished": polished.strip()}


@api_router.post("/summarize")
async def summarize_project(req: SummarizeRequest):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=500, detail="LLM not configured")

    stack = ", ".join(req.tech_stack) if req.tech_stack else "Modern web stack"
    system = (
        "You are an expert technical copywriter. Given a project name, stack, and description, "
        "write exactly 2 punchy sentences that highlight what was built and the impact. "
        "Plain text only, no markdown, no quotes."
    )
    prompt = f"Project: {req.name}\nTech Stack: {stack}\nContext: {req.description}"
    chat = make_chat(f"sum-{uuid.uuid4()}", system)
    try:
        summary = await chat.send_message(UserMessage(text=prompt))
    except Exception as e:
        logger.exception("summarize error")
        raise HTTPException(status_code=500, detail=f"Summarize failed: {e}")

    return {"summary": summary.strip()}


@api_router.post("/contact")
async def submit_contact(req: ContactMessage):
    record = {
        "id": str(uuid.uuid4()),
        "name": req.name,
        "email": req.email,
        "subject": req.subject,
        "message": req.message,
        "ts": datetime.now(timezone.utc).isoformat(),
        "delivered": False,
    }

    # Always store in MongoDB
    delivered = False
    if RESEND_API_KEY:
        html = f"""
        <table style="font-family: Arial, sans-serif; color:#111;">
          <tr><td><h2 style="color:#0A0A0E;">New portfolio contact</h2></td></tr>
          <tr><td><b>Name:</b> {req.name}</td></tr>
          <tr><td><b>Email:</b> {req.email}</td></tr>
          <tr><td><b>Subject:</b> {req.subject}</td></tr>
          <tr><td style="padding-top:12px;"><b>Message:</b><br/><pre style="white-space:pre-wrap;font-family:inherit;">{req.message}</pre></td></tr>
        </table>
        """
        try:
            params = {
                "from": SENDER_EMAIL,
                "to": [CONTACT_RECIPIENT],
                "reply_to": req.email,
                "subject": f"[Portfolio] {req.subject}",
                "html": html,
            }
            await asyncio.to_thread(resend.Emails.send, params)
            delivered = True
        except Exception:
            logger.exception("Resend failure")

    record["delivered"] = delivered
    await db.contact_messages.insert_one(record)

    return {
        "ok": True,
        "stored": True,
        "delivered": delivered,
        "id": record["id"],
    }


@api_router.get("/cv")
async def get_cv():
    """Returns the structured CV content for frontend rendering."""
    return {
        "name": "Katey Elinam",
        "title": "Full Stack Web Developer | Entrepreneur",
        "location": "Accra, Ghana",
        "email": "kateyelinam@gmail.com",
        "phone": "+233 50 366 7746",
        "linkedin": "https://linkedin.com/in/kateyelinam",
        "github": "https://github.com/elinam-dev",
        "available": True,
        "years_experience": 3,
        "projects_count": 9,
        "tech_count": 25,
        "bio": (
            "Self-taught full stack web developer with 3+ years of freelance experience "
            "building responsive websites and custom web applications for real clients. "
            "Proficient in React, Next.js, TypeScript, Python, and Node.js. Founder of "
            "Watch Hub, demonstrating strong entrepreneurial, sales, and operational skills."
        ),
        "roles": [
            "Full Stack Web Developer",
            "Entrepreneur",
            "Founder & CEO",
            "Freelance Web Developer",
            "React / Next.js Specialist",
        ],
        "skills": {
            "Languages": ["JavaScript", "TypeScript", "Python", "Java", "C/C++", "SQL", "HTML5", "CSS3"],
            "Frontend": ["React", "Next.js", "Angular", "React Native", "Tailwind CSS", "UI/UX"],
            "Backend": ["Node.js", "REST APIs", "FastAPI", "Database Integration"],
            "DevOps": ["Docker", "Docker Compose", "GitHub Actions", "Vercel", "Railway"],
            "Tools": ["Git", "GitHub", "VS Code", "Google Analytics", "HubSpot"],
        },
        "experience": [
            {
                "company": "Watch Hub",
                "role": "Founder & CEO",
                "start": "2025",
                "end": "Present",
                "location": "Tema, Ghana",
                "bullets": [
                    "Founded and operate a retail watch business: sourcing, pricing, sales, CRM.",
                    "Closed clients through direct outreach and relationship-driven sales.",
                    "Implemented digital marketing strategies driving brand growth.",
                    "Oversee inventory, financial records, and supplier coordination.",
                ],
            },
            {
                "company": "Self-Employed",
                "role": "Freelance Web Developer",
                "start": "2022",
                "end": "Present",
                "location": "Remote",
                "bullets": [
                    "Delivered 4+ production sites using React, Next.js, and TypeScript.",
                    "Built an AI-powered inventory system, corporate sites, and a full LMS.",
                    "Owned the full lifecycle: scoping → design → dev → deploy → support.",
                    "Integrated REST APIs and AI-powered automation in production.",
                    "Containerized with Docker & shipped via GitHub Actions to Vercel/Railway.",
                ],
            },
        ],
        "projects": [
            {
                "name": "Flowitec — LMS",
                "tagline": "Learning Management System",
                "description": "End-to-end LMS featuring course management, role-based authentication, and a clean learning UX. Live and in active client use, deployed to Vercel.",
                "stack": ["Next.js", "Auth", "Vercel", "Tailwind"],
                "image": "https://image.thum.io/get/width/1280/crop/800/noanimate/https://flowitec.com",
                "date": "2026",
                "live": "https://flowitec.com",
                "github": "https://github.com/elinam-dev",
            },
            {
                "name": "GreenDev Associates",
                "tagline": "Corporate Website",
                "description": "Responsive, brand-led corporate website with custom content management. Cross-device performance and a fast, accessible UI.",
                "stack": ["React", "Tailwind", "CMS", "Responsive"],
                "image": "https://image.thum.io/get/width/1280/crop/800/noanimate/https://greendevassociates.com",
                "date": "2026",
                "live": "https://greendevassociates.com",
                "github": "https://github.com/elinam-dev",
            },
            {
                "name": "Flowitec — Go & Grow",
                "tagline": "Product Launch Site",
                "description": "Marketing site for Flowitec's flagship Go & Grow product with crisp animations, conversion-tuned copy, and mobile-first design.",
                "stack": ["Next.js", "Tailwind", "Framer Motion", "Vercel"],
                "image": "https://image.thum.io/get/width/1280/crop/800/noanimate/https://flowitecgoandgrow.com",
                "date": "2026",
                "live": "https://flowitecgoandgrow.com",
                "github": "https://github.com/elinam-dev",
            },
            {
                "name": "Stock Hub",
                "tagline": "AI-Powered Inventory Management",
                "description": "Full-stack inventory + sales platform with AI-driven restock recommendations, real-time dashboards, and CI/CD pipelines on Railway.",
                "stack": ["React", "Next.js", "AI", "Docker", "Railway"],
                "image": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1280&q=80&auto=format&fit=crop",
                "date": "2026 — Present",
                "live": None,
                "github": "https://github.com/elinam-dev",
            },
            {
                "name": "EstateView",
                "tagline": "Real Estate Listings Platform",
                "description": "Property listings marketplace with map-based search, agent dashboards, AI-generated property descriptions, and Stripe-powered featured listings.",
                "stack": ["Next.js", "PostgreSQL", "Mapbox", "Stripe", "AI"],
                "image": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1280&q=80&auto=format&fit=crop",
                "date": "2025",
                "live": None,
                "github": "https://github.com/elinam-dev",
            },
            {
                "name": "PulsePOS",
                "tagline": "Point-of-Sale System",
                "description": "Tablet-first POS for retail with inventory sync, multi-cashier sessions, daily Z-reports, and offline-first transaction queueing.",
                "stack": ["React", "Node.js", "SQLite", "PWA", "Tailwind"],
                "image": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1280&q=80&auto=format&fit=crop",
                "date": "2025",
                "live": None,
                "github": "https://github.com/elinam-dev",
            },
            {
                "name": "OrbitCRM",
                "tagline": "Sales & Pipeline CRM",
                "description": "Lightweight CRM with Kanban pipelines, deal forecasting, email sync, and an AI assistant that drafts follow-ups based on conversation context.",
                "stack": ["Next.js", "FastAPI", "Postgres", "Claude AI"],
                "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1280&q=80&auto=format&fit=crop",
                "date": "2025",
                "live": None,
                "github": "https://github.com/elinam-dev",
            },
            {
                "name": "MediTrack",
                "tagline": "Clinic Inventory & Patient Records",
                "description": "HIPAA-mindful clinic platform tracking stock of medications, patient records, prescriptions, and automated low-stock alerts.",
                "stack": ["React", "Node.js", "MongoDB", "Express"],
                "image": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1280&q=80&auto=format&fit=crop",
                "date": "2024",
                "live": None,
                "github": "https://github.com/elinam-dev",
            },
            {
                "name": "FleetOps",
                "tagline": "Logistics & Delivery Tracking",
                "description": "Real-time fleet tracking dashboard with driver routes, fuel tracking, delivery proofs, and a mobile app for couriers built in React Native.",
                "stack": ["React Native", "Next.js", "Mapbox", "WebSockets"],
                "image": "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?w=1280&q=80&auto=format&fit=crop",
                "date": "2024",
                "live": None,
                "github": "https://github.com/elinam-dev",
            },
        ],
        "education": [
            {"school": "University of Ghana", "degree": "BSc Earth Science", "dates": "01/2025 – Present"},
            {"school": "Adisadel College", "degree": "Senior High — General Science", "dates": "2022 – 2024"},
        ],
        "certifications": [
            "HubSpot Content Marketing Certification",
            "HubSpot Social Media Certification",
            "Google Analytics Certification",
        ],
    }


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
