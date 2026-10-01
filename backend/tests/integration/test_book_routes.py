from copy import deepcopy

import pytest
from fastapi import status
from fastapi.testclient import TestClient

from src.app.main import app
from src.app.services import book as book_service


@pytest.fixture
def client():
    return TestClient(app)


# Restaura a lista após cada teste
@pytest.fixture(autouse=True)
def reset_books():
    original_books = deepcopy(book_service.books)

    yield

    book_service.books.clear()
    book_service.books.extend(original_books)


# Teste de listagem de livros (GET "/books/")
def test_list_books(client):
    response = client.get("/books/")

    assert response.status_code == status.HTTP_200_OK
    assert response.json() == book_service.books


# Testes de busca de um livro (GET "/books/{book_id}")
def test_get_book_existing(client):
    response = client.get("/books/1")

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["id"] == 1
    assert response.json()["name"] == "A Vida Invisível de Addie LaRue"
    assert response.json()["author"] == "V. E. Schwab"
    assert response.json()["publisher"] == "Galera Record"


@pytest.mark.parametrize("book_id", [0, 1000])
def test_get_book_not_found(client, book_id):
    response = client.get(f"/books/{book_id}")

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json()["detail"] == "Book not found"


# Testes de criação de um livro (POST "/books")
def test_create_book(client):
    book_data = {
        "name": "Lugar errado, hora errada",
        "author": "Gillian McAllister",
        "publisher": "Record",
    }

    response = client.post("/books/", json=book_data)

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["id"] == 3
    assert response.json()["name"] == book_data["name"]
    assert response.json()["author"] == book_data["author"]
    assert response.json()["publisher"] == book_data["publisher"]


def test_create_book_invalid_data(client):
    book_data = {
        "name": "Lugar errado, hora errada",
        "author": "Gillian McAllister",
    }

    response = client.post("/books/", json=book_data)

    assert response.status_code == status.HTTP_422_UNPROCESSABLE_CONTENT


# Testes de atualização de um livro (PUT "/books/{book_id}")
def test_update_book(client):
    book_data = {
        "name": "Novo Nome",
        "author": "Novo Autor",
        "publisher": "Nova Editora",
    }

    response = client.put("/books/1", json=book_data)

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["id"] == 1
    assert response.json()["name"] == book_data["name"]
    assert response.json()["author"] == book_data["author"]
    assert response.json()["publisher"] == book_data["publisher"]


def test_update_book_not_found(client):
    book_data = {
        "name": "Novo Nome",
        "author": "Novo Autor",
        "publisher": "Nova Editora",
    }

    response = client.put("/books/1000", json=book_data)

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json()["detail"] == "Book not found"


def test_update_book_invalid_data(client):
    book_data = {
        "name": "Novo Nome",
        "author": "Novo Autor",
    }

    response = client.put("/books/1", json=book_data)

    assert response.status_code == status.HTTP_422_UNPROCESSABLE_CONTENT


# Testes de atualização parcial de um livro (PATCH "/books/{book_id}")
def test_patch_book(client):
    response = client.patch(
        "/books/1",
        json={"name": "Novo Nome"},
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["id"] == 1
    assert response.json()["name"] == "Novo Nome"
    assert response.json()["author"] == "V. E. Schwab"
    assert response.json()["publisher"] == "Galera Record"


def test_patch_book_not_found(client):
    response = client.patch(
        "/books/1000",
        json={"name": "Novo Nome"},
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json()["detail"] == "Book not found"


# Testes de exclusão de um livro (DELETE "/books/{book_id}")
def test_delete_book(client):
    response = client.delete("/books/1")

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["id"] == 1
    assert response.json()["name"] == "A Vida Invisível de Addie LaRue"
    assert response.json()["author"] == "V. E. Schwab"
    assert response.json()["publisher"] == "Galera Record"

    response = client.get("/books/1")

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json()["detail"] == "Book not found"


def test_delete_book_not_found(client):
    response = client.delete("/books/1000")

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json()["detail"] == "Book not found"
