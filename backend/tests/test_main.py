import pytest
from fastapi import status
from fastapi.testclient import TestClient

from src.app.main import app


@pytest.fixture
def client():
    return TestClient(app)


def test_home(client):
    response = client.get("/")

    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"message": "Olá, Sistemas Distribuídos!"}


@pytest.mark.parametrize("name", ["Virgínia", "Letícia", "Afonso"])
def test_hello(client, name):
    response = client.get(f"/hello/{name}")

    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"message": f"Olá, {name}!"}


def test_hello_empty_name(client):
    response = client.get("/hello/")

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json()["detail"] == "Not Found"


def test_home_wrong_method(client):
    response = client.post("/")

    assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED


def test_route_not_found(client):
    response = client.get("/rota-inexistente")

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json()["detail"] == "Not Found"
