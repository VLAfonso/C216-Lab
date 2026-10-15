from unittest.mock import MagicMock

import pytest

from src.app.models.book import Book
from src.app.repositories.book import BookRepository
from src.app.schemas.book import BookCreate, BookUpdate
from src.app.services.book import (
    BookAlreadyExistsError,
    BookNotFoundError,
    BookService,
)


@pytest.fixture
def repository():
    return MagicMock(spec=BookRepository)


@pytest.fixture
def service(repository):
    return BookService(repository)


@pytest.fixture
def existing_book():
    return Book(
        id=1,
        name="A Vida Invisível de Addie LaRue",
        author="V. E. Schwab",
        publisher="Galera Record",
    )


# Testes de listagem de livros (list_books)
def test_list_books(service, repository, existing_book):
    repository.get_all.return_value = [existing_book]

    books = service.list_books()

    assert books == [existing_book]
    repository.get_all.assert_called_once_with(0, 100)


# Testes de busca de um livro (get_book)
def test_get_book_existing(service, repository, existing_book):
    repository.get_by_id.return_value = existing_book

    book = service.get_book(1)

    assert book == existing_book
    assert book.id == 1
    assert book.name == "A Vida Invisível de Addie LaRue"
    assert book.author == "V. E. Schwab"
    assert book.publisher == "Galera Record"
    repository.get_by_id.assert_called_once_with(1)


def test_get_book_not_found(service, repository):
    repository.get_by_id.return_value = None

    with pytest.raises(BookNotFoundError):
        service.get_book(1000)


# Testes de criação de um livro (create_book)
def test_create_book(service, repository):
    book_data = BookCreate(
        name="Lugar errado, hora errada",
        author="Gillian McAllister",
        publisher="Record",
    )
    created_book = Book(id=3, **book_data.model_dump())

    repository.get_by_name.return_value = None
    repository.create.return_value = created_book

    book = service.create_book(book_data)

    assert book == created_book
    repository.get_by_name.assert_called_once_with(book_data.name)
    repository.create.assert_called_once_with(
        book_data.name,
        book_data.author,
        book_data.publisher,
    )


def test_create_book_duplicate_name(service, repository):
    book_data = BookCreate(
        name="A Vida Invisível de Addie LaRue",
        author="Outro Autor",
        publisher="Outra Editora",
    )
    repository.get_by_name.return_value = Book(
        id=1,
        name=book_data.name,
        author="V. E. Schwab",
        publisher="Galera Record",
    )

    with pytest.raises(BookAlreadyExistsError):
        service.create_book(book_data)

    repository.create.assert_not_called()


# Testes de atualização total (update_book)
def test_update_book(service, repository, existing_book):
    book_data = BookCreate(
        name="Novo Nome",
        author="Novo Autor",
        publisher="Nova Editora",
    )
    repository.get_by_id.return_value = existing_book
    repository.get_by_name.return_value = None
    repository.update.return_value = existing_book

    book = service.update_book(1, book_data)

    assert book == existing_book
    repository.update.assert_called_once_with(
        existing_book,
        book_data.model_dump(),
    )


def test_update_book_not_found(service, repository):
    book_data = BookCreate(
        name="Novo Nome",
        author="Novo Autor",
        publisher="Nova Editora",
    )
    repository.get_by_id.return_value = None

    with pytest.raises(BookNotFoundError):
        service.update_book(1000, book_data)

    repository.update.assert_not_called()


def test_update_book_duplicate_name(service, repository, existing_book):
    book_data = BookCreate(
        name="Nome de outro livro",
        author="Novo Autor",
        publisher="Nova Editora",
    )
    repository.get_by_id.return_value = existing_book
    repository.get_by_name.return_value = Book(
        id=2,
        name=book_data.name,
        author="Outro Autor",
        publisher="Outra Editora",
    )

    with pytest.raises(BookAlreadyExistsError):
        service.update_book(1, book_data)

    repository.update.assert_not_called()


# Testes de atualização parcial (patch_book)
def test_patch_book_name(service, repository, existing_book):
    book_data = BookUpdate(name="Novo Nome")
    repository.get_by_id.return_value = existing_book
    repository.get_by_name.return_value = None
    repository.update.return_value = existing_book

    book = service.patch_book(1, book_data)

    assert book == existing_book
    repository.update.assert_called_once_with(
        existing_book,
        {"name": "Novo Nome"},
    )


def test_patch_book_author(service, repository, existing_book):
    book_data = BookUpdate(author="Novo Autor")
    repository.get_by_id.return_value = existing_book
    repository.update.return_value = existing_book

    service.patch_book(1, book_data)

    repository.update.assert_called_once_with(
        existing_book,
        {"author": "Novo Autor"},
    )
    repository.get_by_name.assert_not_called()


def test_patch_book_not_found(service, repository):
    book_data = BookUpdate(name="Novo Nome")
    repository.get_by_id.return_value = None

    with pytest.raises(BookNotFoundError):
        service.patch_book(1000, book_data)

    repository.update.assert_not_called()


def test_patch_book_duplicate_name(service, repository, existing_book):
    book_data = BookUpdate(name="Nome de outro livro")
    repository.get_by_id.return_value = existing_book
    repository.get_by_name.return_value = Book(
        id=2,
        name=book_data.name,
        author="Outro Autor",
        publisher="Outra Editora",
    )

    with pytest.raises(BookAlreadyExistsError):
        service.patch_book(1, book_data)

    repository.update.assert_not_called()


# Testes de exclusão de livros (delete_book)
def test_delete_book(service, repository, existing_book):
    repository.get_by_id.return_value = existing_book

    result = service.delete_book(1)

    assert result is None
    repository.get_by_id.assert_called_once_with(1)
    repository.delete.assert_called_once_with(existing_book)


def test_delete_book_not_found(service, repository):
    repository.get_by_id.return_value = None

    with pytest.raises(BookNotFoundError):
        service.delete_book(1000)

    repository.delete.assert_not_called()
