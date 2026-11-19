from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.orm import Session

from src.app.models.toy import Toy


class ToyRepository:
    """Único ponto da aplicação que conversa com o banco sobre brinquedos."""

    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        name: str,
        price: Decimal,
        quantity: int,
        description: str | None = None,
        category: str | None = None,
        brand: str | None = None,
        age_range: str | None = None,
    ) -> Toy:
        toy = Toy(
            name=name,
            price=price,
            quantity=quantity,
            description=description,
            category=category,
            brand=brand,
            age_range=age_range,
        )

        self.db.add(toy)
        self.db.commit()
        self.db.refresh(toy)
        return toy

    def get_by_id(self, toy_id: int) -> Toy | None:
        return self.db.get(Toy, toy_id)

    def get_by_name(self, name: str) -> Toy | None:
        return self.db.scalar(select(Toy).where(Toy.name == name))

    def get_all(self, skip: int = 0, limit: int = 100) -> list[Toy]:
        statement = select(Toy).order_by(Toy.id).offset(skip).limit(limit)
        return list(self.db.scalars(statement))

    def update(self, toy: Toy, changes: dict) -> Toy:
        for field, value in changes.items():
            setattr(toy, field, value)
        self.db.commit()
        self.db.refresh(toy)
        return toy

    def delete(self, toy: Toy) -> None:
        self.db.delete(toy)
        self.db.commit()
