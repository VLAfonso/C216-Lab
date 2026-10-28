from sqlalchemy import select
from sqlalchemy.orm import Session

from src.app.models.book import Book


class BookRepository:
    """Único ponto da aplicação que conversa com o banco sobre livros."""

    def __init__(self, db: Session):
        self.db = db

    def create(self, name: str, author: str, publisher: str) -> Book:
        book = Book(name=name, author=author, publisher=publisher)
        self.db.add(book)
        self.db.commit()
        self.db.refresh(book)
        return book

    def get_by_id(self, book_id: int) -> Book | None:
        return self.db.get(Book, book_id)

    def get_by_name(self, name: str) -> Book | None:
        return self.db.scalar(select(Book).where(Book.name == name))

    def get_all(self, skip: int = 0, limit: int = 100) -> list[Book]:
        statement = select(Book).order_by(Book.id).offset(skip).limit(limit)
        return list(self.db.scalars(statement))

    def update(self, book: Book, changes: dict) -> Book:
        for field, value in changes.items():
            setattr(book, field, value)
        self.db.commit()
        self.db.refresh(book)
        return book

    def delete(self, book: Book) -> None:
        self.db.delete(book)
        self.db.commit()
