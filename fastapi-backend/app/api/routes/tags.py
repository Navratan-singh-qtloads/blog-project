from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models.tag import Tag
from pydantic import BaseModel

router = APIRouter()

# =========================
# SCHEMA
# =========================
class TagCreate(BaseModel):
    name: str


# =========================
# CREATE TAG
# =========================
@router.post("/")
def create_tag(payload: TagCreate, db: Session = Depends(get_db)):
    tag = Tag(name=payload.name)

    db.add(tag)
    db.commit()
    db.refresh(tag)

    return tag


# =========================
# GET ALL TAGS
# =========================
@router.get("/")
def get_tags(db: Session = Depends(get_db)):
    return db.query(Tag).all()


# =========================
# GET SINGLE TAG (IMPORTANT FOR EDIT PAGE)
# =========================
@router.get("/{tag_id}")
def get_tag(tag_id: int, db: Session = Depends(get_db)):
    tag = db.query(Tag).filter(Tag.id == tag_id).first()

    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")

    return tag


# =========================
# UPDATE TAG (EDIT PAGE)
# =========================
@router.put("/{tag_id}")
def update_tag(tag_id: int, payload: TagCreate, db: Session = Depends(get_db)):
    tag = db.query(Tag).filter(Tag.id == tag_id).first()

    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")

    tag.name = payload.name

    db.commit()
    db.refresh(tag)

    return tag


# =========================
# DELETE TAG
# =========================
@router.delete("/{tag_id}")
def delete_tag(tag_id: int, db: Session = Depends(get_db)):
    tag = db.query(Tag).filter(Tag.id == tag_id).first()

    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")

    db.delete(tag)
    db.commit()

    return {"message": "Tag deleted successfully"}