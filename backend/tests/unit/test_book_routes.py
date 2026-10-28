from unittest.mock import Mock

import pytest
from fastapi import HTTPException, Response, status

from src.app.api.routes import books as book_router
from src.app.schemas.book import BookCreate, BookUpdate
from src.app.services.book import BookAlreadyExistsError, BookNotFoundError

BOOK = {
    "id": 1,
    "name": "A Vida Invisível de Addie LaRue",
    "author": "V. E. Schwab",
    "publisher": "Galera Record",
}


# Teste de listagem de livros (GET "/books/")
def test_list_books():
    books = [BOOK]
    service = Mock()
    service.list_books.return_value = books

    result = book_router.list_books(service)

    assert result == books
    service.list_books.assert_called_once_with(0, 100)


# Testes de busca de um livro (GET "/books/{book_id}")
def test_get_book():
    service = Mock()
    service.get_book.return_value = BOOK

    result = book_router.get_book(1, service)

    assert result == BOOK
    service.get_book.assert_called_once_with(1)


@pytest.mark.parametrize("book_id", [0, 1000])
def test_get_book_not_found(book_id):
    service = Mock()
    service.get_book.side_effect = BookNotFoundError(book_id)

    with pytest.raises(HTTPException) as exception:
        book_router.get_book(book_id, service)

    assert exception.value.status_code == status.HTTP_404_NOT_FOUND
    assert exception.value.detail == "Livro não encontrado!"


# Testes de criação de um livro (POST "/books")
def test_create_book():
    book_data = BookCreate(
        name="Lugar errado, hora errada",
        author="Gillian McAllister",
        publisher="Record",
    )
    created_book = {**BOOK, **book_data.model_dump()}
    service = Mock()
    service.create_book.return_value = created_book

    result = book_router.create_book(book_data, service)

    assert result == created_book
    service.create_book.assert_called_once_with(book_data)


def test_create_book_already_exists():
    book_data = BookCreate(
        name=BOOK["name"],
        author=BOOK["author"],
        publisher=BOOK["publisher"],
    )
    service = Mock()
    service.create_book.side_effect = BookAlreadyExistsError(BOOK["name"])

    with pytest.raises(HTTPException) as exception:
        book_router.create_book(book_data, service)

    assert exception.value.status_code == status.HTTP_409_CONFLICT
    assert exception.value.detail == "Já existe um livro com esse nome!"


# Testes de atualização de um livro (PUT "/books/{book_id}")
def test_update_book():
    book_data = BookCreate(
        name="Novo Nome",
        author="Novo Autor",
        publisher="Nova Editora",
    )
    updated_book = {**BOOK, **book_data.model_dump()}
    service = Mock()
    service.update_book.return_value = updated_book

    result = book_router.update_book(1, book_data, service)

    assert result == updated_book
    service.update_book.assert_called_once_with(1, book_data)


def test_update_book_not_found():
    book_data = BookCreate(
        name="Novo Nome",
        author="Novo Autor",
        publisher="Nova Editora",
    )
    service = Mock()
    service.update_book.side_effect = BookNotFoundError(1000)

    with pytest.raises(HTTPException) as exception:
        book_router.update_book(1000, book_data, service)

    assert exception.value.status_code == status.HTTP_404_NOT_FOUND
    assert exception.value.detail == "Livro não encontrado!"


def test_update_book_already_exists():
    book_data = BookCreate(
        name="Nome existente",
        author="Novo Autor",
        publisher="Nova Editora",
    )
    service = Mock()
    service.update_book.side_effect = BookAlreadyExistsError(book_data.name)

    with pytest.raises(HTTPException) as exception:
        book_router.update_book(1, book_data, service)

    assert exception.value.status_code == status.HTTP_409_CONFLICT
    assert exception.value.detail == "Já existe um livro com esse nome!"


# Testes de atualização parcial de um livro (PATCH "/books/{book_id}")
def test_patch_book():
    book_data = BookUpdate(name="Novo Nome")
    updated_book = {**BOOK, "name": "Novo Nome"}
    service = Mock()
    service.patch_book.return_value = updated_book

    result = book_router.patch_book(1, book_data, service)

    assert result == updated_book
    service.patch_book.assert_called_once_with(1, book_data)


def test_patch_book_not_found():
    book_data = BookUpdate(name="Novo Nome")
    service = Mock()
    service.patch_book.side_effect = BookNotFoundError(1000)

    with pytest.raises(HTTPException) as exception:
        book_router.patch_book(1000, book_data, service)

    assert exception.value.status_code == status.HTTP_404_NOT_FOUND
    assert exception.value.detail == "Livro não encontrado!"


def test_patch_book_already_exists():
    book_data = BookUpdate(name="Nome Existente")
    service = Mock()
    service.patch_book.side_effect = BookAlreadyExistsError(book_data.name)

    with pytest.raises(HTTPException) as exception:
        book_router.patch_book(1, book_data, service)

    assert exception.value.status_code == status.HTTP_409_CONFLICT
    assert exception.value.detail == "Já existe um livro com esse nome!"


# Testes de exclusão de um livro (DELETE "/books/{book_id}")
def test_delete_book():
    service = Mock()

    result = book_router.delete_book(1, service)

    assert isinstance(result, Response)
    assert result.status_code == status.HTTP_204_NO_CONTENT
    assert result.body == b""
    service.delete_book.assert_called_once_with(1)


def test_delete_book_not_found():
    service = Mock()
    service.delete_book.side_effect = BookNotFoundError(1000)

    with pytest.raises(HTTPException) as exception:
        book_router.delete_book(1000, service)

    assert exception.value.status_code == status.HTTP_404_NOT_FOUND
    assert exception.value.detail == "Livro não encontrado!"
