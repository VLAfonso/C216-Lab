from pydantic import BaseModel

class BookCreate(BaseModel):
    name: str
    author: str
    publisher: str

class BookUpdate(BaseModel):
    name: str | None = None
    author: str | None = None
    publisher: str | None = None
