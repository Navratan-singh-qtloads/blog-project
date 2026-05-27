from fastapi import (
    APIRouter,
    HTTPException,
    UploadFile,
    File,
    Form,
    Depends,
)

from sqlalchemy.orm import Session

from typing import Optional

import os
import json

from uuid import uuid4

from fastapi.encoders import jsonable_encoder

from app.db.session import SessionLocal

from app.db.models.post import Post
from app.db.models.category import Category
from app.db.models.tag import Tag

router = APIRouter()

# ================= UPLOAD DIRECTORY =================
UPLOAD_DIR = "uploads"

os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
)

# ================= DB =================
def get_db():

    db = SessionLocal()

    try:

        yield db

    finally:

        db.close()


# ================= CREATE POST =================
@router.post("/")
async def create_post(

    title: str = Form(...),

    body: str = Form(...),

    excerpt: Optional[str] = Form(None),

    status: str = Form(...),

    author_id: int = Form(...),

    category_id: int = Form(...),

    # MULTIPLE TAGS JSON
    tag_ids: str = Form(...),

    image: Optional[UploadFile] = File(None),

    db: Session = Depends(get_db)

):

    # ================= IMAGE UPLOAD =================
    image_path = None

    if image:

        filename = f"{uuid4()}_{image.filename}"

        file_path = os.path.join(
            UPLOAD_DIR,
            filename
        )

        with open(file_path, "wb") as buffer:

            buffer.write(
                await image.read()
            )

        image_path = file_path

    # ================= CATEGORY CHECK =================
    category = db.query(Category).filter(
        Category.id == category_id
    ).first()

    if not category:

        raise HTTPException(
            status_code=404,
            detail="Category not found"
        )

    # ================= TAG IDS PARSE =================
    try:

        parsed_tag_ids = json.loads(tag_ids)

        # SINGLE VALUE FIX
        if isinstance(parsed_tag_ids, int):

            parsed_tag_ids = [parsed_tag_ids]

    except:

        raise HTTPException(
            status_code=400,
            detail="Invalid tag_ids format"
        )

    # ================= TAG VALIDATION =================
    for tag_id in parsed_tag_ids:

        tag = db.query(Tag).filter(
            Tag.id == tag_id
        ).first()

        if not tag:

            raise HTTPException(
                status_code=404,
                detail=f"Tag ID {tag_id} not found"
            )

    # ================= CREATE POST =================
    new_post = Post(

        title=title,

        body=body,

        excerpt=excerpt,

        status=status,

        author_id=author_id,

        category_id=category_id,

        # SAVE JSON ARRAY
        tag_ids=parsed_tag_ids,

        image=image_path
    )

    db.add(new_post)

    db.commit()

    db.refresh(new_post)

    return {

        "success": True,

        "message": "Post created successfully",

        "data": jsonable_encoder(new_post)
    }


# ================= GET ALL POSTS =================
@router.get("/")
def get_posts(
    db: Session = Depends(get_db)
):

    posts = db.query(Post).all()

    return jsonable_encoder(posts)


# ================= GET SINGLE POST =================
@router.get("/{id}")
def get_post(
    id: int,
    db: Session = Depends(get_db)
):

    post = db.query(Post).filter(
        Post.id == id
    ).first()

    if not post:

        raise HTTPException(
            status_code=404,
            detail="Post not found"
        )

    return jsonable_encoder(post)


# ================= UPDATE POST =================
@router.put("/{id}")
async def update_post(

    id: int,

    title: str = Form(...),

    body: str = Form(...),

    excerpt: Optional[str] = Form(None),

    status: str = Form(...),

    author_id: int = Form(...),

    category_id: int = Form(...),

    # MULTIPLE TAGS JSON
    tag_ids: str = Form(...),

    image: Optional[UploadFile] = File(None),

    db: Session = Depends(get_db)

):

    # ================= FIND POST =================
    post = db.query(Post).filter(
        Post.id == id
    ).first()

    if not post:

        raise HTTPException(
            status_code=404,
            detail="Post not found"
        )

    # ================= CATEGORY CHECK =================
    category = db.query(Category).filter(
        Category.id == category_id
    ).first()

    if not category:

        raise HTTPException(
            status_code=404,
            detail="Category not found"
        )

    # ================= TAG IDS PARSE =================
    try:

        parsed_tag_ids = json.loads(tag_ids)

        # SINGLE VALUE FIX
        if isinstance(parsed_tag_ids, int):

            parsed_tag_ids = [parsed_tag_ids]

    except:

        raise HTTPException(
            status_code=400,
            detail="Invalid tag_ids format"
        )

    # ================= TAG VALIDATION =================
    for tag_id in parsed_tag_ids:

        tag = db.query(Tag).filter(
            Tag.id == tag_id
        ).first()

        if not tag:

            raise HTTPException(
                status_code=404,
                detail=f"Tag ID {tag_id} not found"
            )

    # ================= UPDATE POST =================
    post.title = title

    post.body = body

    post.excerpt = excerpt

    post.status = status

    post.author_id = author_id

    post.category_id = category_id

    # SAVE JSON ARRAY
    post.tag_ids = parsed_tag_ids

    # ================= IMAGE UPDATE =================
    if image:

        filename = f"{uuid4()}_{image.filename}"

        file_path = os.path.join(
            UPLOAD_DIR,
            filename
        )

        with open(file_path, "wb") as buffer:

            buffer.write(
                await image.read()
            )

        post.image = file_path

    db.commit()

    db.refresh(post)

    return {

        "success": True,

        "message": "Post updated successfully",

        "data": jsonable_encoder(post)
    }


# ================= DELETE POST =================
@router.delete("/{id}")
def delete_post(
    id: int,
    db: Session = Depends(get_db)
):

    post = db.query(Post).filter(
        Post.id == id
    ).first()

    if not post:

        raise HTTPException(
            status_code=404,
            detail="Post not found"
        )

    db.delete(post)

    db.commit()

    return {

        "success": True,

        "message": "Post deleted successfully"
    }