from src.app.models.book import Book
from src.app.repositories.book import BookRepository
from src.app.schemas.book import BookCreate, BookUpdate


class BookNotFoundError(Exception):
    pass


class BookAlreadyExistsError(Exception):
    pass


class BookService:
    """Regras de negócio dos itens. Não conhece HTTP nem SQL."""

    def __init__(self, repository: BookRepository):
        self.repository = repository

    def list_books(self, skip: int = 0, limit: int = 100) -> list[Book]:
        return self.repository.get_all(skip, limit)

    def get_book(self, book_id: int) -> Book:
        book = self.repository.get_by_id(book_id)
        if book is None:
            raise BookNotFoundError(book_id)
        return book

    def create_book(self, book_data) -> Book:
        # Regra de negócio: o nome do livro deve ser único.
        if self.repository.get_by_name(book_data.name):
            raise BookAlreadyExistsError(book_data.name)
        return self.repository.create(
            book_data.name, book_data.author, book_data.publisher
        )

    def update_book(self, book_id: int, book_data: BookCreate) -> Book:
        # Atualização total
        book = self.get_book(book_id)
        changes = book_data.model_dump()

        if changes["name"] != book.name and self.repository.get_by_name(
            changes["name"]
        ):
            raise BookAlreadyExistsError(changes["name"])

        return self.repository.update(book, changes)

    def patch_book(self, book_id: int, book_data: BookUpdate) -> Book:
        # Atualização parcial
        book = self.get_book(book_id)
        changes = book_data.model_dump(exclude_unset=True)

        for field in ("name", "author", "publisher"):
            if changes.get(field) is None:
                changes.pop(field, None)

        if "name" in changes and changes["name"] != book.name:
            if self.repository.get_by_name(changes["name"]):
                raise BookAlreadyExistsError(changes["name"])

        return self.repository.update(book, changes)

    def delete_book(self, book_id: int) -> None:
        self.repository.delete(self.get_book(book_id))
