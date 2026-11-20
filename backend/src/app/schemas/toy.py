from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field, field_validator


class ToyCreate(BaseModel):
    # Nome, preço e quantidade são obrigatórios
    name: str = Field(min_length=1, max_length=255)

    @field_validator("name", mode="before")
    @classmethod
    def strip_name(cls, value):
        return value.strip() if isinstance(value, str) else value

    price: Decimal = Field(gt=0, max_digits=10, decimal_places=2)
    quantity: int = Field(ge=0, le=999999)
    description: str | None = Field(default=None, max_length=1000)
    category: str | None = Field(default=None, max_length=255)
    brand: str | None = Field(default=None, max_length=255)
    age_range: str | None = Field(default=None, max_length=50)


class ToyUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)

    @field_validator("name", mode="before")
    @classmethod
    def strip_name(cls, value):
        return value.strip() if isinstance(value, str) else value

    price: Decimal | None = Field(default=None, gt=0, max_digits=10, decimal_places=2)
    quantity: int | None = Field(default=None, ge=0, le=999999)
    description: str | None = Field(default=None, max_length=1000)
    category: str | None = Field(default=None, max_length=255)
    brand: str | None = Field(default=None, max_length=255)
    age_range: str | None = Field(default=None, max_length=50)


class ToyRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    price: Decimal
    quantity: int
    description: str | None = None
    category: str | None = None
    brand: str | None = None
    age_range: str | None = None
