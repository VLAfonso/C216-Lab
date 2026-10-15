import pytest
from fastapi import status
from fastapi.testclient import TestClient

BOOK_DATA = {
    "name": "A Vida Invisível de Addie LaRue",
    "author": "V. E. Schwab",
    "publisher": "Galera Record",
}


# Cria um livro para ser usado nos testes
def create_book_for_test(client: TestClient, book_data: dict | None = None) -> dict:
    data = book_data or BOOK_DATA
    response = client.post("/books/", json=data)
    assert response.status_code == status.HTTP_201_CREATED
    return response.json()


# Teste de listagem de livros (GET "/books/")
def test_list_books(client):
    created_book = create_book_for_test(client)

    response = client.get("/books/")

    assert response.status_code == status.HTTP_200_OK
    assert response.json() == [created_book]


# Testes de busca de um livro (GET "/books/{book_id}")
def test_get_book(client):
    created_book = create_book_for_test(client)

    response = client.get(f"/books/{created_book['id']}")

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["id"] == created_book["id"]
    assert response.json()["name"] == BOOK_DATA["name"]
    assert response.json()["author"] == BOOK_DATA["author"]
    assert response.json()["publisher"] == BOOK_DATA["publisher"]


@pytest.mark.parametrize("book_id", [0, 1000])
def test_get_book_not_found(client, book_id):
    response = client.get(f"/books/{book_id}")

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json()["detail"] == "Livro não encontrado!"


# Testes de criação de um livro (POST "/books")
def test_create_book(client):
    book_data = {
        "name": "Lugar errado, hora errada",
        "author": "Gillian McAllister",
        "publisher": "Record",
    }

    response = client.post("/books/", json=book_data)

    assert response.status_code == status.HTTP_201_CREATED
    assert response.json()["id"] > 0
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


def test_create_book_already_exists(client):
    book_data = {
        "name": BOOK_DATA["name"],
        "author": BOOK_DATA["author"],
        "publisher": BOOK_DATA["publisher"],
    }

    client.post("/books/", json=book_data)
    response = client.post("/books/", json=book_data)

    assert response.status_code == status.HTTP_409_CONFLICT
    assert response.json()["detail"] == "Já existe um livro com esse nome!"


# Testes de atualização de um livro (PUT "/books/{book_id}")
def test_update_book(client):
    created_book = create_book_for_test(client)
    book_data = {
        "name": "Novo Nome",
        "author": "Novo Autor",
        "publisher": "Nova Editora",
    }

    response = client.put(f"/books/{created_book['id']}", json=book_data)

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["id"] == created_book["id"]
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
    assert response.json()["detail"] == "Livro não encontrado!"


def test_update_book_invalid_data(client):
    book_data = {
        "name": "Novo Nome",
        "author": "Novo Autor",
    }

    response = client.put("/books/1", json=book_data)

    assert response.status_code == status.HTTP_422_UNPROCESSABLE_CONTENT


def test_update_book_already_exists(client):
    existing_book = {
        "name": BOOK_DATA["name"],
        "author": BOOK_DATA["author"],
        "publisher": BOOK_DATA["publisher"],
    }
    book_data = {
        "name": "Novo Nome",
        "author": "Novo Autor",
        "publisher": "Nova Editora",
    }

    client.post("/books/", json=existing_book)
    response = client.post("/books/", json=book_data)
    book_id = response.json()["id"]

    response = client.put(f"/books/{book_id}", json=existing_book)

    assert response.status_code == status.HTTP_409_CONFLICT
    assert response.json()["detail"] == "Já existe um livro com esse nome!"


# Testes de atualização parcial de um livro (PATCH "/books/{book_id}")
def test_patch_book(client):
    created_book = create_book_for_test(client)

    response = client.patch(
        f"/books/{created_book['id']}",
        json={"name": "Novo Nome"},
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["id"] == created_book["id"]
    assert response.json()["name"] == "Novo Nome"
    assert response.json()["author"] == "V. E. Schwab"
    assert response.json()["publisher"] == "Galera Record"


def test_patch_book_not_found(client):
    response = client.patch(
        "/books/1000",
        json={"name": "Novo Nome"},
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json()["detail"] == "Livro não encontrado!"


def test_patch_book_already_exists(client):
    existing_book = {
        "name": BOOK_DATA["name"],
        "author": BOOK_DATA["author"],
        "publisher": BOOK_DATA["publisher"],
    }
    book_data = {
        "name": "Novo Nome",
        "author": "Novo Autor",
        "publisher": "Nova Editora",
    }

    client.post("/books/", json=existing_book)
    response = client.post("/books/", json=book_data)
    book_id = response.json()["id"]

    response = client.patch(f"/books/{book_id}", json={"name": BOOK_DATA["name"]})

    assert response.status_code == status.HTTP_409_CONFLICT
    assert response.json()["detail"] == "Já existe um livro com esse nome!"


# Testes de exclusão de um livro (DELETE "/books/{book_id}")
def test_delete_book(client):
    created_book = create_book_for_test(client)

    response = client.delete(f"/books/{created_book['id']}")

    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert response.content == b""

    response = client.get(f"/books/{created_book['id']}")

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json()["detail"] == "Livro não encontrado!"


def test_delete_book_not_found(client):
    response = client.delete("/books/1000")

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json()["detail"] == "Livro não encontrado!"
