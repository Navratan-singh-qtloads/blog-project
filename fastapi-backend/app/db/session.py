from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

# Load .env
load_dotenv()

# Get DATABASE URL
DATABASE_URL = os.getenv("DATABASE_URL")

# Create Engine
engine = create_engine(
    DATABASE_URL,
    echo=False
)

# Session
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base
Base = declarative_base()

# DB Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()