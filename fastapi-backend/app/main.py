from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os

# =========================
# DATABASE
# =========================
from app.db.base import Base
from app.db.session import engine


# =========================
# ROUTES
# =========================
from app.api.routes.auth import router as auth_router
from app.api.routes.posts import router as posts_router
from app.api.routes.categories import router as categories_router
from app.api.routes.tags import router as tags_router
from app.api.routes.users import router as users_router
from app.api.routes.admin import router as admin_router
from app.api.routes.upload import router as upload_router

# =========================
# LIFESPAN
# =========================
@asynccontextmanager
async def lifespan(app: FastAPI):

    # print("🚀 Starting FastAPI application...")

    # CREATE TABLES
    Base.metadata.create_all(bind=engine)

    # print("✅ Database tables created successfully")

    yield

    # print("👋 Shutting down FastAPI application...")


# =========================
# FASTAPI APP
# =========================
app = FastAPI(
    title="Blog CMS API",
    version="1.0.0",
    lifespan=lifespan
)

# =========================
# CORS CONFIGURATION
# =========================
app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)

# =========================
# BASE DIRECTORY
# =========================
BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

# =========================
# UPLOAD DIRECTORY
# =========================
UPLOAD_DIR = os.path.join(
    BASE_DIR,
    "..",
    "uploads"
)

# CREATE uploads FOLDER
os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
)

# =========================
# STATIC FILES
# =========================
app.mount(
    "/uploads",
    StaticFiles(directory=UPLOAD_DIR),
    name="uploads"
)

# print("📁 Upload folder:", UPLOAD_DIR)

# =========================
# ROUTE REGISTRATION
# =========================
app.include_router(
    auth_router,
    prefix="/auth",
    tags=["Auth"]
)

app.include_router(
    posts_router,
    prefix="/posts",
    tags=["Posts"]
)

app.include_router(
    categories_router,
    prefix="/categories",
    tags=["Categories"]
)

app.include_router(
    tags_router,
    prefix="/tags",
    tags=["Tags"]
)

app.include_router(
    admin_router,
    prefix="/admin",
    tags=["Admin"]
)

app.include_router(
    upload_router,
    prefix="/upload",
    tags=["Upload"]
)

app.include_router(
    users_router,
    prefix="/users",
    tags=["Users"]
)

# =========================
# ROOT ENDPOINT
# =========================
@app.get("/")
def root():

    return {
        "success": True,
        "message": "Blog API is running successfully 🚀"
    }


# =========================
# HEALTH CHECK
# =========================
@app.get("/health")
def health_check():

    return {
        "status": "ok",
        "server": "running"
    }