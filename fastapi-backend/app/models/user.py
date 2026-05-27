from sqlalchemy import Column, Integer, String
from app.db.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(String)

    email = Column(
        String,
        unique=True,
        nullable=False
    )

    hashed_password = Column(String)

    # USER STATUS
    status = Column(
        String,
        default="Active"
    )