from fastapi import FastAPI, APIRouter, HTTPException, Request, Response
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from slugify import slugify
import httpx

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ==================== MODELS ====================

class UserOut(BaseModel):
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None

class LeadCreate(BaseModel):
    name: str
    email: str
    designation: Optional[str] = ""
    need_help_with: Optional[str] = ""
    message: Optional[str] = ""
    lead_type: str = "book_call"

class LeadOut(BaseModel):
    lead_id: str
    name: str
    email: str
    designation: Optional[str] = ""
    need_help_with: Optional[str] = ""
    message: Optional[str] = ""
    lead_type: str
    status: str = "new"
    created_at: str

class NewsletterSubscribe(BaseModel):
    email: str

class BlogPostCreate(BaseModel):
    title: str
    content: str
    excerpt: Optional[str] = ""
    category: str = "Strategy"
    tags: List[str] = []
    featured_image: Optional[str] = ""
    published: bool = False

class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    excerpt: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    featured_image: Optional[str] = None
    published: Optional[bool] = None

class SiteContentUpdate(BaseModel):
    section: str
    content: dict

# ==================== AUTH HELPERS ====================

async def get_current_user(request: Request) -> dict:
    session_token = request.cookies.get("session_token")
    if not session_token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            session_token = auth_header.split(" ")[1]
    if not session_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    session_doc = await db.user_sessions.find_one({"session_token": session_token}, {"_id": 0})
    if not session_doc:
        raise HTTPException(status_code=401, detail="Invalid session")
    expires_at = session_doc["expires_at"]
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Session expired")
    user_doc = await db.users.find_one({"user_id": session_doc["user_id"]}, {"_id": 0})
    if not user_doc:
        raise HTTPException(status_code=401, detail="User not found")
    return user_doc

# ==================== AUTH ROUTES ====================

@api_router.post("/auth/session")
async def exchange_session(request: Request, response: Response):
    body = await request.json()
    session_id = body.get("session_id")
    if not session_id:
        raise HTTPException(status_code=400, detail="session_id required")
    async with httpx.AsyncClient() as http_client:
        resp = await http_client.get(
            "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
            headers={"X-Session-ID": session_id}
        )
    if resp.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid session_id")
    data = resp.json()
    email = data.get("email")
    name = data.get("name", "")
    picture = data.get("picture", "")
    session_token = data.get("session_token", str(uuid.uuid4()))
    existing_user = await db.users.find_one({"email": email}, {"_id": 0})
    if existing_user:
        user_id = existing_user["user_id"]
        await db.users.update_one({"email": email}, {"$set": {"name": name, "picture": picture}})
    else:
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        await db.users.insert_one({
            "user_id": user_id,
            "email": email,
            "name": name,
            "picture": picture,
            "created_at": datetime.now(timezone.utc).isoformat()
        })
    await db.user_sessions.insert_one({
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": (datetime.now(timezone.utc) + timedelta(days=7)).isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    resp_data = {"user_id": user_id, "email": email, "name": name, "picture": picture}
    json_response = JSONResponse(content=resp_data)
    json_response.set_cookie(
        key="session_token",
        value=session_token,
        path="/",
        secure=True,
        httponly=True,
        samesite="none",
        max_age=7 * 24 * 3600
    )
    return json_response

@api_router.get("/auth/me")
async def get_me(request: Request):
    user = await get_current_user(request)
    return {"user_id": user["user_id"], "email": user["email"], "name": user["name"], "picture": user.get("picture", "")}

@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    session_token = request.cookies.get("session_token")
    if session_token:
        await db.user_sessions.delete_one({"session_token": session_token})
    json_response = JSONResponse(content={"message": "Logged out"})
    json_response.delete_cookie(key="session_token", path="/", secure=True, httponly=True, samesite="none")
    return json_response

# ==================== SITE CONTENT ROUTES ====================

@api_router.get("/content/{section}")
async def get_content(section: str):
    doc = await db.site_content.find_one({"section": section}, {"_id": 0})
    if not doc:
        defaults = get_default_content(section)
        return {"section": section, "content": defaults}
    return doc

@api_router.get("/content")
async def get_all_content():
    docs = await db.site_content.find({}, {"_id": 0}).to_list(100)
    if not docs:
        return {"sections": get_all_default_content()}
    result = {d["section"]: d["content"] for d in docs}
    defaults = get_all_default_content()
    for key in defaults:
        if key not in result:
            result[key] = defaults[key]
    return {"sections": result}

@api_router.put("/content/{section}")
async def update_content(section: str, body: SiteContentUpdate, request: Request):
    await get_current_user(request)
    await db.site_content.update_one(
        {"section": section},
        {"$set": {"section": section, "content": body.content, "updated_at": datetime.now(timezone.utc).isoformat()}},
        upsert=True
    )
    return {"message": "Content updated", "section": section}

# ==================== BLOG ROUTES ====================

@api_router.get("/blog")
async def get_blog_posts(category: Optional[str] = None, published_only: bool = True):
    query = {}
    if published_only:
        query["published"] = True
    if category:
        query["category"] = category
    posts = await db.blog_posts.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
    return {"posts": posts}

@api_router.get("/blog/{slug}")
async def get_blog_post(slug: str):
    post = await db.blog_posts.find_one({"slug": slug}, {"_id": 0})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@api_router.post("/blog")
async def create_blog_post(post: BlogPostCreate, request: Request):
    await get_current_user(request)
    slug = slugify(post.title)
    existing = await db.blog_posts.find_one({"slug": slug}, {"_id": 0})
    if existing:
        slug = f"{slug}-{uuid.uuid4().hex[:6]}"
    post_doc = {
        "post_id": f"post_{uuid.uuid4().hex[:12]}",
        "slug": slug,
        **post.model_dump(),
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    await db.blog_posts.insert_one(post_doc)
    doc = await db.blog_posts.find_one({"post_id": post_doc["post_id"]}, {"_id": 0})
    return doc

@api_router.put("/blog/{post_id}")
async def update_blog_post(post_id: str, post: BlogPostUpdate, request: Request):
    await get_current_user(request)
    update_data = {k: v for k, v in post.model_dump().items() if v is not None}
    if "title" in update_data:
        update_data["slug"] = slugify(update_data["title"])
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    result = await db.blog_posts.update_one({"post_id": post_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    doc = await db.blog_posts.find_one({"post_id": post_id}, {"_id": 0})
    return doc

@api_router.delete("/blog/{post_id}")
async def delete_blog_post(post_id: str, request: Request):
    await get_current_user(request)
    result = await db.blog_posts.delete_one({"post_id": post_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"message": "Post deleted"}

# ==================== LEAD ROUTES ====================

@api_router.post("/leads")
async def create_lead(lead: LeadCreate):
    lead_doc = {
        "lead_id": f"lead_{uuid.uuid4().hex[:12]}",
        **lead.model_dump(),
        "status": "new",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.leads.insert_one(lead_doc)
    # MOCKED: SendGrid welcome email would be sent here
    logger.info(f"MOCKED EMAIL: Welcome email sent to {lead.email}")
    return {"message": "Thank you! We'll be in touch soon.", "lead_id": lead_doc["lead_id"]}

@api_router.get("/leads")
async def get_leads(request: Request, status: Optional[str] = None):
    await get_current_user(request)
    query = {}
    if status:
        query["status"] = status
    leads = await db.leads.find(query, {"_id": 0}).sort("created_at", -1).to_list(500)
    return {"leads": leads}

@api_router.put("/leads/{lead_id}/status")
async def update_lead_status(lead_id: str, request: Request):
    await get_current_user(request)
    body = await request.json()
    new_status = body.get("status", "contacted")
    result = await db.leads.update_one({"lead_id": lead_id}, {"$set": {"status": new_status}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    return {"message": "Status updated"}

# ==================== NEWSLETTER ROUTES ====================

@api_router.post("/newsletter")
async def subscribe_newsletter(sub: NewsletterSubscribe):
    existing = await db.newsletter_subscribers.find_one({"email": sub.email}, {"_id": 0})
    if existing:
        return {"message": "Already subscribed!"}
    await db.newsletter_subscribers.insert_one({
        "sub_id": f"sub_{uuid.uuid4().hex[:12]}",
        "email": sub.email,
        "subscribed_at": datetime.now(timezone.utc).isoformat(),
        "active": True
    })
    # MOCKED: SendGrid confirmation email would be sent here
    logger.info(f"MOCKED EMAIL: Newsletter confirmation sent to {sub.email}")
    return {"message": "Subscribed successfully!"}

@api_router.get("/newsletter")
async def get_subscribers(request: Request):
    await get_current_user(request)
    subs = await db.newsletter_subscribers.find({}, {"_id": 0}).to_list(1000)
    return {"subscribers": subs}

# ==================== ADMIN STATS ====================

@api_router.get("/admin/stats")
async def get_admin_stats(request: Request):
    await get_current_user(request)
    total_leads = await db.leads.count_documents({})
    new_leads = await db.leads.count_documents({"status": "new"})
    total_posts = await db.blog_posts.count_documents({})
    published_posts = await db.blog_posts.count_documents({"published": True})
    total_subs = await db.newsletter_subscribers.count_documents({"active": True})
    return {
        "total_leads": total_leads,
        "new_leads": new_leads,
        "total_posts": total_posts,
        "published_posts": published_posts,
        "total_subscribers": total_subs
    }

# ==================== BLOG ADMIN (ALL POSTS) ====================

@api_router.get("/admin/blog")
async def get_all_blog_posts(request: Request):
    await get_current_user(request)
    posts = await db.blog_posts.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return {"posts": posts}

# ==================== DEFAULT CONTENT ====================

def get_default_content(section):
    defaults = get_all_default_content()
    return defaults.get(section, {})

def get_all_default_content():
    return {
        "hero": {
            "overline": "EXECUTION & CAPABILITY ARCHITECT",
            "heading": "I build systems that turn strategy into measurable outcomes.",
            "subheading": "Business Strategy. AdTech. Automation. Capability Building. 12+ years of building execution systems across APAC & Middle East.",
            "cta_primary": "Book Strategy Call",
            "cta_secondary": "Request Audit"
        },
        "about": {
            "overline": "ABOUT",
            "heading": "Operator. Execution Leader. Capability Architect.",
            "paragraphs": [
                "I've spent 12+ years inside the machine\u2014not advising from the outside. From enterprise delivery at IBM and Standard Chartered to building growth engines at Simplilearn and EC-Council, I've operated at the intersection of strategy, technology, and execution.",
                "Today, through Aamir Mir Consulting and CertScope, I help business owners, coaches, and senior executives build the systems that actually drive growth\u2014not just the slides that promise it.",
                "My approach is simple: Strategy without execution is a hobby. I build systems that execute."
            ],
            "stats": [
                {"value": "12+", "label": "Years of Enterprise Execution"},
                {"value": "50+", "label": "Systems Built & Deployed"},
                {"value": "6", "label": "Countries Operated In"},
                {"value": "100M+", "label": "Revenue Influenced"}
            ]
        },
        "services": [
            {
                "number": "01",
                "title": "Business Strategy & Growth Consulting",
                "problem": "Most businesses have a vision but lack the structured system to get there. Growth stalls because strategy stays on slides.",
                "system": "I build execution roadmaps with clear milestones, accountability loops, and growth levers specific to your business model.",
                "outcome": "A repeatable growth system that turns strategy into quarterly results."
            },
            {
                "number": "02",
                "title": "AdTech & Performance Marketing Systems",
                "problem": "Ad spend is increasing but ROI keeps declining. Campaigns run without systems, leading to wasted budgets and fragmented data.",
                "system": "End-to-end performance marketing architecture\u2014from attribution modeling to campaign automation and real-time optimization loops.",
                "outcome": "Scalable ad systems that deliver predictable, measurable returns at scale."
            },
            {
                "number": "03",
                "title": "Business Automation & Funnel Systems",
                "problem": "Manual processes are bleeding time and money. Leads fall through cracks. Follow-ups are inconsistent.",
                "system": "Automated lead capture, nurture sequences, CRM workflows, and conversion funnels\u2014designed to run without constant intervention.",
                "outcome": "A self-running funnel system that captures, nurtures, and converts\u202024/7."
            },
            {
                "number": "04",
                "title": "Capability Building & L&D",
                "problem": "Teams lack the skills to execute modern strategies. Traditional training doesn't stick.",
                "system": "Custom capability programs built around your team's actual gaps\u2014practical, project-based, with measurable skill progression.",
                "outcome": "Teams that can independently execute complex strategies without external dependency."
            },
            {
                "number": "05",
                "title": "Execution & Delivery Transformation",
                "problem": "Projects are consistently late, over budget, or misaligned with business goals. Delivery governance is broken.",
                "system": "Operating models, delivery frameworks, and governance structures that ensure consistent, quality execution at scale.",
                "outcome": "Predictable delivery with clear ownership, reduced waste, and aligned output."
            }
        ],
        "systems_thinking": {
            "overline": "SYSTEMS THINKING",
            "heading": "Strategy is worthless without systems. Systems are useless without execution.",
            "steps": [
                {"number": "01", "title": "Strategy", "description": "Define the objective, the market position, and the growth levers."},
                {"number": "02", "title": "Systems", "description": "Architect the processes, tools, and workflows that make strategy executable."},
                {"number": "03", "title": "Execution", "description": "Deploy with clear ownership, accountability, and feedback loops."},
                {"number": "04", "title": "Scale", "description": "Optimize, automate, and expand what works. Remove what doesn't."}
            ],
            "quote": "I don't just advise \u2014 I build systems that execute."
        },
        "case_studies": [
            {
                "title": "EdTech Growth Engine",
                "client": "Leading EdTech Platform",
                "metric": "+240%",
                "metric_label": "Revenue Growth",
                "description": "Built an end-to-end performance marketing system that transformed scattered campaigns into a predictable growth engine.",
                "tags": ["AdTech", "Strategy", "Automation"]
            },
            {
                "title": "Enterprise Delivery Transformation",
                "client": "Global Financial Services",
                "metric": "40%",
                "metric_label": "Faster Delivery",
                "description": "Redesigned the operating model and delivery governance for a 200+ person technology team across 3 countries.",
                "tags": ["Execution", "Strategy"]
            },
            {
                "title": "Automation-First Sales System",
                "client": "B2B SaaS Company",
                "metric": "3x",
                "metric_label": "Lead Conversion",
                "description": "Designed and deployed automated funnel systems that tripled conversion rates while reducing manual effort by 60%.",
                "tags": ["Automation", "Strategy"]
            }
        ],
        "faq": [
            {"question": "Who do you typically work with?", "answer": "Business owners, coaches, senior executives, EdTech founders, and growth-stage startups who need systems that execute\u2014not just strategy decks."},
            {"question": "How is this different from traditional consulting?", "answer": "I don't leave you with a 100-page report. I build the actual systems, set up the automation, and ensure your team can run them independently."},
            {"question": "What industries do you work in?", "answer": "EdTech, SaaS, professional services, financial services, and any growth-stage business that needs structured execution systems."},
            {"question": "How does an engagement typically start?", "answer": "It starts with a strategy call where we diagnose your current bottlenecks. From there, I propose a system-level solution with clear deliverables and timelines."},
            {"question": "Do you offer ongoing advisory?", "answer": "Yes. After building the initial systems, I offer advisory retainers for ongoing optimization, scaling, and new system development."}
        ],
        "companies": [
            {"name": "IBM", "role": "Enterprise Delivery"},
            {"name": "Standard Chartered", "role": "Operating Systems"},
            {"name": "Simplilearn", "role": "Growth & AdTech"},
            {"name": "EC-Council", "role": "Capability Building"}
        ]
    }

# ==================== SEED DEFAULT CONTENT ====================

@api_router.post("/seed")
async def seed_content():
    defaults = get_all_default_content()
    for section, content in defaults.items():
        existing = await db.site_content.find_one({"section": section})
        if not existing:
            await db.site_content.insert_one({
                "section": section,
                "content": content,
                "updated_at": datetime.now(timezone.utc).isoformat()
            })
    return {"message": "Content seeded"}

# ==================== ROOT ====================

@api_router.get("/")
async def root():
    return {"message": "Aamir Mir Consulting API"}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
