from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional

from app.db.session import get_db
from app.db.models.user import User

router = APIRouter()

# =========================
# SCHEMAS
# =========================
class UserResponse(BaseModel):

    id: int
    name: str
    email: str
    status: Optional[str] = "Active"

    class Config:
        from_attributes = True


# =========================
# UPDATE USER SCHEMA
# =========================
class UserUpdate(BaseModel):

    name: Optional[str] = None

    email: Optional[EmailStr] = None

    status: Optional[str] = None


# =========================
# GET ALL USERS
# =========================
@router.get("/", response_model=list[UserResponse])
def get_users(
    db: Session = Depends(get_db)
):

    users = (
        db.query(User)
        .order_by(User.id.asc())
        .all()
    )

    return users


# =========================
# GET SINGLE USER
# =========================
@router.get("/{id}", response_model=UserResponse)
def get_user(
    id: int,
    db: Session = Depends(get_db)
):

    user = (
        db.query(User)
        .filter(User.id == id)
        .first()
    )

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user


# =========================
# UPDATE USER
# =========================
@router.put("/{id}", response_model=UserResponse)
def update_user(
    id: int,
    user_data: UserUpdate,
    db: Session = Depends(get_db)
):

    # FIND USER
    user = (
        db.query(User)
        .filter(User.id == id)
        .first()
    )

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # UPDATE NAME
    if user_data.name is not None:
        user.name = user_data.name

    # UPDATE EMAIL
    if user_data.email is not None:
        user.email = user_data.email

    # UPDATE STATUS
    if user_data.status is not None:
        user.status = user_data.status

    # SAVE DATABASE
    db.commit()

    # REFRESH DATA
    db.refresh(user)

    return user