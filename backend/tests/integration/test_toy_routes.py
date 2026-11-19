import pytest
from fastapi import status
from fastapi.testclient import TestClient

TOY_DATA = {
    "name": "Carro Hot Wheels Vermelho",
    "price": 19.90,
    "quantity": 30,
    "description": "Carrinho em miniatura vermelho para brincar e colecionar.",
    "category": "Carrinhos",
    "brand": "Hot Wheels",
    "age_range": "3 a 12 anos",
}


# Cria um brinquedo para ser usado nos testes
def create_toy_for_test(client: TestClient, toy_data: dict | None = None) -> dict:
    data = toy_data or TOY_DATA
    response = client.post("/toys/", json=data)
    assert response.status_code == status.HTTP_201_CREATED
    return response.json()


# Teste de listagem de brinquedos (GET "/toys/")
def test_list_toys(client):
    created_toy = create_toy_for_test(client)

    response = client.get("/toys/")

    assert response.status_code == status.HTTP_200_OK
    assert response.json() == [created_toy]


# Testes de busca de um brinquedo (GET "/toys/{toy_id}")
def test_get_toy(client):
    created_toy = create_toy_for_test(client)

    response = client.get(f"/toys/{created_toy['id']}")

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["id"] == created_toy["id"]
    assert response.json()["name"] == TOY_DATA["name"]
    assert response.json()["price"] == f"{TOY_DATA['price']:.2f}"
    assert response.json()["quantity"] == TOY_DATA["quantity"]
    assert response.json()["description"] == TOY_DATA["description"]
    assert response.json()["category"] == TOY_DATA["category"]
    assert response.json()["brand"] == TOY_DATA["brand"]
    assert response.json()["age_range"] == TOY_DATA["age_range"]


@pytest.mark.parametrize("toy_id", [0, 1000])
def test_get_toy_not_found(client, toy_id):
    response = client.get(f"/toys/{toy_id}")

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json()["detail"] == "Brinquedo não encontrado!"


# Testes de criação de um brinquedo (POST "/toys/")
def test_create_toy(client):
    toy_data = {
        "name": "Boneca Barbie Bailarina",
        "price": 129.90,
        "quantity": 10,
        "description": "Boneca Barbie com roupa de bailarina.",
        "category": "Bonecas",
        "brand": "Barbie",
        "age_range": "3 a 10 anos",
    }

    response = client.post("/toys/", json=toy_data)

    assert response.status_code == status.HTTP_201_CREATED
    assert response.json()["id"] > 0
    assert response.json()["name"] == toy_data["name"]
    assert response.json()["price"] == f"{toy_data['price']:.2f}"
    assert response.json()["quantity"] == toy_data["quantity"]
    assert response.json()["description"] == toy_data["description"]
    assert response.json()["category"] == toy_data["category"]
    assert response.json()["brand"] == toy_data["brand"]
    assert response.json()["age_range"] == toy_data["age_range"]


def test_create_toy_invalid_data(client):
    toy_data = {
        "name": "Boneca Barbie Bailarina",
        "quantity": 10,
    }

    response = client.post("/toys/", json=toy_data)

    assert response.status_code == status.HTTP_422_UNPROCESSABLE_CONTENT


def test_create_toy_already_exists(client):
    client.post("/toys/", json=TOY_DATA)
    response = client.post("/toys/", json=TOY_DATA)

    assert response.status_code == status.HTTP_409_CONFLICT
    assert response.json()["detail"] == "Já existe um brinquedo com esse nome!"


# Testes de atualização de um brinquedo (PUT "/toys/{toy_id}")
def test_update_toy(client):
    created_toy = create_toy_for_test(client)
    toy_data = {
        "name": "Carro Hot Wheels Azul",
        "price": 24.90,
        "quantity": 25,
        "description": "Carrinho esportivo em miniatura azul.",
        "category": "Carrinhos",
        "brand": "Hot Wheels",
        "age_range": "3 a 12 anos",
    }

    response = client.put(f"/toys/{created_toy['id']}", json=toy_data)

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["id"] == created_toy["id"]
    assert response.json()["name"] == toy_data["name"]
    assert response.json()["price"] == f"{toy_data['price']:.2f}"
    assert response.json()["quantity"] == toy_data["quantity"]
    assert response.json()["description"] == toy_data["description"]
    assert response.json()["category"] == toy_data["category"]
    assert response.json()["brand"] == toy_data["brand"]
    assert response.json()["age_range"] == toy_data["age_range"]


def test_update_toy_not_found(client):
    toy_data = {
        "name": "Carro Hot Wheels Azul",
        "price": 24.90,
        "quantity": 25,
        "description": "Carrinho esportivo em miniatura azul.",
        "category": "Carrinhos",
        "brand": "Hot Wheels",
        "age_range": "3 a 12 anos",
    }

    response = client.put("/toys/1000", json=toy_data)

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json()["detail"] == "Brinquedo não encontrado!"


def test_update_toy_invalid_data(client):
    response = client.put(
        "/toys/1",
        json={"name": "Carro Hot Wheels Azul"},
    )

    assert response.status_code == status.HTTP_422_UNPROCESSABLE_CONTENT


def test_update_toy_already_exists(client):
    existing_toy = TOY_DATA.copy()
    toy_data = {
        "name": "Carro Hot Wheels Azul",
        "price": 24.90,
        "quantity": 25,
        "description": "Carrinho esportivo em miniatura azul.",
        "category": "Carrinhos",
        "brand": "Hot Wheels",
        "age_range": "3 a 12 anos",
    }

    client.post("/toys/", json=existing_toy)
    response = client.post("/toys/", json=toy_data)
    toy_id = response.json()["id"]

    response = client.put(f"/toys/{toy_id}", json=existing_toy)

    assert response.status_code == status.HTTP_409_CONFLICT
    assert response.json()["detail"] == "Já existe um brinquedo com esse nome!"


# Testes de atualização parcial de um brinquedo (PATCH "/toys/{toy_id}")
def test_patch_toy(client):
    created_toy = create_toy_for_test(client)

    response = client.patch(
        f"/toys/{created_toy['id']}",
        json={"name": "Carro Hot Wheels Azul"},
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["id"] == created_toy["id"]
    assert response.json()["name"] == "Carro Hot Wheels Azul"
    assert response.json()["price"] == f"{TOY_DATA['price']:.2f}"
    assert response.json()["quantity"] == TOY_DATA["quantity"]
    assert response.json()["description"] == TOY_DATA["description"]
    assert response.json()["category"] == TOY_DATA["category"]
    assert response.json()["brand"] == TOY_DATA["brand"]
    assert response.json()["age_range"] == TOY_DATA["age_range"]


def test_patch_toy_not_found(client):
    response = client.patch(
        "/toys/1000",
        json={"name": "Carro Hot Wheels Azul"},
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json()["detail"] == "Brinquedo não encontrado!"


def test_patch_toy_already_exists(client):
    existing_toy = TOY_DATA.copy()
    toy_data = {
        "name": "Carro Hot Wheels Azul",
        "price": 24.90,
        "quantity": 25,
        "description": "Carrinho esportivo em miniatura azul.",
        "category": "Carrinhos",
        "brand": "Hot Wheels",
        "age_range": "3 a 12 anos",
    }

    client.post("/toys/", json=existing_toy)
    response = client.post("/toys/", json=toy_data)
    toy_id = response.json()["id"]

    response = client.patch(
        f"/toys/{toy_id}",
        json={"name": existing_toy["name"]},
    )

    assert response.status_code == status.HTTP_409_CONFLICT
    assert response.json()["detail"] == "Já existe um brinquedo com esse nome!"


# Testes de exclusão de um brinquedo (DELETE "/toys/{toy_id}")
def test_delete_toy(client):
    created_toy = create_toy_for_test(client)

    response = client.delete(f"/toys/{created_toy['id']}")

    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert response.content == b""

    response = client.get(f"/toys/{created_toy['id']}")

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json()["detail"] == "Brinquedo não encontrado!"


def test_delete_toy_not_found(client):
    response = client.delete("/toys/1000")

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json()["detail"] == "Brinquedo não encontrado!"


# Testes de CORS
def test_cors_allowed_origin(client):
    response = client.options(
        "/toys/",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "GET",
        },
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.headers["access-control-allow-origin"] == "http://localhost:5173"


def test_cors_disallowed_origin(client):
    response = client.options(
        "/toys/",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "GET",
        },
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "access-control-allow-origin" not in response.headers
