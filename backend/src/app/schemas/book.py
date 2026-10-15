from pydantic import BaseModel, ConfigDict, Field


class BookCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    author: str = Field(min_length=1, max_length=255)
    publisher: str = Field(min_length=1, max_length=255)


class BookUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    author: str | None = Field(default=None, min_length=1, max_length=255)
    publisher: str | None = Field(default=None, min_length=1, max_length=255)


class BookRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    author: str
    publisher: str
