from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.db.models.user import User

from app.schemas.auth import RegisterSchema, LoginSchema
from app.core.security import hash_password, verify_password, create_access_token

router = APIRouter(tags=["Auth"])  # ✅ NO PREFIX HERE


# =========================
# DATABASE DEPENDENCY
# =========================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# =========================
# REGISTER API
# =========================
@router.post("/register")
def register(data: RegisterSchema, db: Session = Depends(get_db)):

    email = data.email.lower().strip()

    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exists")

    user = User(
        name=data.name,
        email=email,
        hashed_password=hash_password(data.password)
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "message": "User Registered Successfully",
        "user_id": user.id
    }


# =========================
# LOGIN API
# =========================
@router.post("/login")
def login(data: LoginSchema, db: Session = Depends(get_db)):

    email = data.email.lower().strip()

    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=401, detail="Email not found")

    if not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Password not match")

    token = create_access_token({
        "user_id": user.id,
        "email": user.email
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email
        }
    }