from pydantic import BaseModel
from typing import Optional, Literal


# =========================
# CREATE POST
# =========================
class PostCreate(BaseModel):
    title: str
    description: str
    category_id: int
    tag_id: int
  


# =========================
# UPDATE POST
# =========================
class PostUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    tag_id: Optional[int] = None
  


# =========================
# RESPONSE SCHEMA
# =========================
class PostResponse(BaseModel):
    id: int
    title: str
    description: str
    category_id: int
    tag_id: int
    

    class Config:
        from_attributes = True