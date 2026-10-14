import pytest
from fastapi import HTTPException, status

from src.app.api.routes import books as book_router
from src.app.schemas.book import BookCreate, BookUpdate


# Teste de listagem de livros (GET "/")
def test_list_books(monkeypatch):
    books = [
        {
            "id": 1,
            "name": "A Vida Invisível de Addie LaRue",
            "author": "V. E. Schwab",
            "publisher": "Galera Record",
        }
    ]

    monkeypatch.setattr(
        book_router.book_service,
        "list_books",
        lambda: books,
    )

    result = book_router.list_books()

    assert result == books


# Testes de busca de um livro (GET "/{book_id}")
def test_get_book(monkeypatch):
    book = {
        "id": 1,
        "name": "A Vida Invisível de Addie LaRue",
        "author": "V. E. Schwab",
        "publisher": "Galera Record",
    }

    monkeypatch.setattr(
        book_router.book_service,
        "get_book",
        lambda book_id: book,
    )

    result = book_router.get_book(1)

    assert result == book


def test_get_book_not_found(monkeypatch):
    monkeypatch.setattr(
        book_router.book_service,
        "get_book",
        lambda book_id: None,
    )

    with pytest.raises(HTTPException) as exception:
        book_router.get_book(1000)

    assert exception.value.status_code == status.HTTP_404_NOT_FOUND
    assert exception.value.detail == "Book not found"


# Testes de criação de um livro (POST "/")
def test_create_book(monkeypatch):
    book_data = BookCreate(
        name="Lugar errado, hora errada",
        author="Gillian McAllister",
        publisher="Record",
    )

    created_book = {
        "id": 3,
        "name": book_data.name,
        "author": book_data.author,
        "publisher": book_data.publisher,
    }

    monkeypatch.setattr(
        book_router.book_service,
        "create_book",
        lambda book: created_book,
    )

    book = book_router.create_book(book_data)

    assert book == created_book


# Testes de atualização de um livro (PUT "/{book_id}")
def test_update_book(monkeypatch):
    book_data = BookCreate(
        name="Lugar errado, hora errada",
        author="Gilliann McAllister",
        publisher="Record",
    )

    updated_book = {
        "id": 1,
        "name": book_data.name,
        "author": book_data.author,
        "publisher": book_data.publisher,
    }

    monkeypatch.setattr(
        book_router.book_service,
        "update_book",
        lambda book_id, book: updated_book,
    )

    book = book_router.update_book(1, book_data)

    assert book == updated_book


def test_update_book_not_found(monkeypatch):
    book_data = BookCreate(
        name="Lugar errado, hora errada",
        author="Gilliann McAllister",
        publisher="Record",
    )

    monkeypatch.setattr(
        book_router.book_service,
        "update_book",
        lambda book_id, book: None,
    )

    with pytest.raises(HTTPException) as exception:
        book_router.update_book(1000, book_data)

    assert exception.value.status_code == status.HTTP_404_NOT_FOUND
    assert exception.value.detail == "Book not found"


# Testes de atualização parcial de um livro (PATCH "/{book_id}")
def test_patch_book(monkeypatch):
    book_data = BookUpdate(
        name="Novo Nome",
    )

    updated_book = {
        "id": 1,
        "name": book_data.name,
        "author": "V. E. Schwab",
        "publisher": "Galera Record",
    }

    monkeypatch.setattr(
        book_router.book_service,
        "patch_book",
        lambda book_id, book: updated_book,
    )

    book = book_router.patch_book(1, book_data)

    assert book == updated_book


def test_patch_book_not_found(monkeypatch):
    book_data = BookUpdate(
        name="Novo Nome",
    )

    monkeypatch.setattr(
        book_router.book_service,
        "patch_book",
        lambda book_id, book: None,
    )

    with pytest.raises(HTTPException) as exception:
        book_router.patch_book(1000, book_data)

    assert exception.value.status_code == status.HTTP_404_NOT_FOUND
    assert exception.value.detail == "Book not found"


# Testes de exclusão de um livro (DELETE "/{book_id}")
def test_delete_book(monkeypatch):
    deleted_book = {
        "id": 1,
        "name": "A Vida Invisível de Addie LaRue",
        "author": "V. E. Schwab",
        "publisher": "Galera Record",
    }

    monkeypatch.setattr(
        book_router.book_service,
        "delete_book",
        lambda book_id: deleted_book,
    )

    book = book_router.delete_book(1)

    assert book == deleted_book


def test_delete_book_not_found(monkeypatch):
    monkeypatch.setattr(
        book_router.book_service,
        "delete_book",
        lambda book_id: None,
    )

    with pytest.raises(HTTPException) as exception:
        book_router.delete_book(1000)

    assert exception.value.status_code == status.HTTP_404_NOT_FOUND
    assert exception.value.detail == "Book not found"
