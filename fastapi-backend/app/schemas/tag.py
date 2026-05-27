from pydantic import BaseModel


class TagCreate(BaseModel):
    title: str


class TagResponse(BaseModel):
    id: int
    title: str

    class Config:
        from_attributes = True