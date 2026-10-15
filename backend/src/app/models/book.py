from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from src.app.database.base import Base


class Book(Base):
    __tablename__ = "books"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    author: Mapped[str] = mapped_column(String(255), nullable=False)
    publisher: Mapped[str] = mapped_column(String(255), nullable=False)
