from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    ForeignKey,
    Table,
    DateTime
)
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db.base import Base

post_tags = Table(
    "post_tags",
    Base.metadata,
    Column("post_id", ForeignKey("posts.id")),
    Column("tag_id", ForeignKey("tags.id")),
)

class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True)
    title = Column(String)
    excerpt = Column(Text)
    body = Column(Text)

    status = Column(String, default="draft")

    author_id = Column(Integer, ForeignKey("users.id"))
    category_id = Column(Integer, ForeignKey("categories.id"))

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    tags = relationship("Tag", secondary=post_tags)