from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

class ToyCreate(BaseModel):
    # Nome, preço e quantidade são obrigatórios
    name: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=1000)
    price: Decimal = Field(gt=0, max_digits=10, decimal_places=2)
    category: str | None = Field(default=None, max_length=255)
    brand: str | None = Field(default=None, max_length=255)
    age_range: str | None = Field(default=None, max_length=50)
    quantity: int = Field(ge=0, le=999999)

class ToyUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=1000)
    price: Decimal | None = Field(default=None, gt=0, max_digits=10, decimal_places=2)
    category: str | None = Field(default=None, max_length=255)
    brand: str | None = Field(default=None, max_length=255)
    age_range: str | None = Field(default=None, max_length=50)
    quantity: int | None = Field(default=None, ge=0, le=999999)

class ToyRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: str | None = None
    price: Decimal
    category: str | None = None
    brand: str | None = None
    age_range: str | None = None
    quantity: int
