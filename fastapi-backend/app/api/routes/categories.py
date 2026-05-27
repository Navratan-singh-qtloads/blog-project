from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.db.models.category import Category
from app.schemas.category import CategoryCreate, CategoryUpdate

router = APIRouter()

# =========================
# CREATE CATEGORY
# =========================
@router.post("/")
def create_category(data: CategoryCreate, db: Session = Depends(get_db)):

    existing = db.query(Category).filter(Category.title == data.title).first()
    if existing:
        raise HTTPException(status_code=400, detail="Category already exists")

    category = Category(title=data.title)
    db.add(category)
    db.commit()
    db.refresh(category)

    return category


# =========================
# LIST CATEGORIES
# =========================
@router.get("/")
def list_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()


# =========================
# GET SINGLE CATEGORY
# =========================
@router.get("/{id}")
def get_category(id: int, db: Session = Depends(get_db)):

    category = db.query(Category).filter(Category.id == id).first()

    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    return category


# =========================
# UPDATE CATEGORY
# =========================
@router.put("/{id}")
def update_category(id: int, data: CategoryUpdate, db: Session = Depends(get_db)):

    category = db.query(Category).filter(Category.id == id).first()

    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    existing = db.query(Category).filter(
        Category.title == data.title,
        Category.id != id
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Category already exists")

    category.title = data.title

    db.commit()
    db.refresh(category)

    return category


# =========================
# DELETE CATEGORY
# =========================
@router.delete("/{id}")
def delete_category(id: int, db: Session = Depends(get_db)):

    category = db.query(Category).filter(Category.id == id).first()

    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    db.delete(category)
    db.commit()

    return {"message": "Category deleted successfully"}