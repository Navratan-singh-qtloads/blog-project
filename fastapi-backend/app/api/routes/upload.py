import os
import shutil

from fastapi import (
    APIRouter,
    UploadFile,
    File
)

router = APIRouter(
    prefix="/upload",
    tags=["Upload"]
)

UPLOAD_DIR = "uploads"

os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
)

@router.post("/")
def upload_image(
    file: UploadFile = File(...)
):

    file_path = f"{UPLOAD_DIR}/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer
        )

    return {
        "image_url": file_path
    }