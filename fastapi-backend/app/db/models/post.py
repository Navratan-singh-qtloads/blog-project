from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    ForeignKey,
    DateTime,
    JSON
)

from sqlalchemy.orm import relationship

from datetime import datetime

from app.db.base import Base


class Post(Base):
    __tablename__ = "posts"

    # ================= ID =================
    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    # ================= POST DATA =================
    title = Column(
        String,
        nullable=False
    )

    excerpt = Column(Text)

    body = Column(Text)

    image = Column(
        String,
        nullable=True
    )

    status = Column(
        String,
        default="draft"
    )

    # ================= USER =================
    author_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True
    )

    # ================= CATEGORY =================
    category_id = Column(
        Integer,
        ForeignKey("categories.id")
    )

    # ================= MULTIPLE TAGS =================
    # Example:
    # [1,2,3]
    tag_ids = Column(
        JSON,
        nullable=True,
        default=[]
    )

    # ================= DATES =================
    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    # ================= RELATION =================
    category = relationship("Category")