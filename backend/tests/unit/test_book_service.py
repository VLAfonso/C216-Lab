from copy import deepcopy
import pytest

from src.app.schemas.book import BookCreate, BookUpdate
from src.app.services import book as book_service


# Restaura a lista após cada teste
@pytest.fixture(autouse=True)
def reset_books():
    original_books = deepcopy(book_service.books)

    yield

    book_service.books.clear()
    book_service.books.extend(original_books)


# Teste de listagem de livros (list_books)
def test_list_books():
    books = book_service.list_books()

    assert books == book_service.books


# Testes de busca de um livro (get_book)
def test_get_book_existing():
    book = book_service.get_book(1)

    assert book is not None
    assert book["id"] == 1
    assert book["name"] == "A Vida Invisível de Addie LaRue"
    assert book["author"] == "V. E. Schwab"
    assert book["publisher"] == "Galera Record"

def test_get_book_not_found():
    book = book_service.get_book(1000)

    assert book is None


# Teste de criação de um livro (create_book)
def test_create_book():
    book_data = BookCreate(
        name="Lugar errado, hora errada",
        author="Gilliann McAllister",
        publisher="Record",
    )

    book = book_service.create_book(book_data)

    assert book["id"] == 3
    assert book["name"] == book_data.name
    assert book["author"] == book_data.author
    assert book["publisher"] == book_data.publisher
    assert book in book_service.books


# Testes de atualização de um livro (update_book)
def test_update_book():
    book_data = BookCreate(
        name="Lugar errado, hora errada",
        author="Gilliann McAllister",
        publisher="Record",
    )

    book = book_service.update_book(1, book_data)

    assert book["id"] == 1
    assert book["name"] == book_data.name
    assert book["author"] == book_data.author
    assert book["publisher"] == book_data.publisher
    assert book in book_service.books

def test_update_book_not_found():
    book_data = BookCreate(
        name="Lugar errado, hora errada",
        author="Gilliann McAllister",
        publisher="Record",
    )

    book = book_service.update_book(1000, book_data)

    assert book is None


# Testes de atualização parcial de um livro (patch_book)
def test_patch_book():
    book_data = BookUpdate(
        name="Novo Nome",
    )

    book = book_service.patch_book(1, book_data)

    assert book["id"] == 1
    assert book["name"] == book_data.name
    assert book["author"] == "V. E. Schwab"
    assert book["publisher"] == "Galera Record"

def test_patch_book_not_found():
    book_data = BookUpdate(
        name="Novo Nome",
    )

    book = book_service.patch_book(1000, book_data)

    assert book is None


# Testes de exclusão de um livro (delete_book)
def test_delete_book():
    book = book_service.delete_book(1)

    assert book is not None
    assert book["id"] == 1
    assert book["name"] == "A Vida Invisível de Addie LaRue"
    assert book["author"] == "V. E. Schwab"
    assert book["publisher"] == "Galera Record"
    assert book_service.get_book(1) is None

def test_delete_book_not_found():
    book = book_service.delete_book(1000)

    assert book is None
