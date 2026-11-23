from decimal import Decimal
from unittest.mock import Mock

import pytest
from fastapi import HTTPException, Response, status

from src.app.api.routes import toys as toy_router
from src.app.schemas.toy import ToyCreate, ToyUpdate
from src.app.services.toy import ToyAlreadyExistsError, ToyNotFoundError

TOY = {
    "id": 1,
    "name": "Carro Hot Wheels Vermelho",
    "price": Decimal("19.90"),
    "quantity": 30,
    "description": "Carrinho em miniatura vermelho para brincar e colecionar.",
    "category": "Carrinhos",
    "brand": "Hot Wheels",
    "age_range": "3 a 12 anos",
}


# Teste de listagem de brinquedos (GET "/toys/")
def test_list_toys():
    toys = [TOY]
    service = Mock()
    service.list_toys.return_value = toys

    result = toy_router.list_toys(service)

    assert result == toys
    service.list_toys.assert_called_once_with(0, 100)


# Testes de busca de um brinquedo (GET "/toys/{toy_id}")
def test_get_toy():
    service = Mock()
    service.get_toy.return_value = TOY

    result = toy_router.get_toy(1, service)

    assert result == TOY
    service.get_toy.assert_called_once_with(1)


@pytest.mark.parametrize("toy_id", [0, 1000])
def test_get_toy_not_found(toy_id):
    service = Mock()
    service.get_toy.side_effect = ToyNotFoundError(toy_id)

    with pytest.raises(HTTPException) as exception:
        toy_router.get_toy(toy_id, service)

    assert exception.value.status_code == status.HTTP_404_NOT_FOUND
    assert exception.value.detail == "Brinquedo não encontrado!"


# Testes de criação de um brinquedo (POST "/toys/")
def test_create_toy():
    toy_data = ToyCreate(
        name="Boneca Barbie Bailarina",
        price=Decimal("129.90"),
        quantity=10,
        description="Boneca Barbie com roupa de bailarina.",
        category="Bonecas",
        brand="Barbie",
        age_range="3 a 10 anos",
    )
    created_toy = {**TOY, **toy_data.model_dump()}
    service = Mock()
    service.create_toy.return_value = created_toy

    result = toy_router.create_toy(toy_data, service)

    assert result == created_toy
    service.create_toy.assert_called_once_with(toy_data)


def test_create_toy_already_exists():
    toy_data = ToyCreate(
        name=TOY["name"],
        price=Decimal("19.90"),
        quantity=30,
    )
    service = Mock()
    service.create_toy.side_effect = ToyAlreadyExistsError(TOY["name"])

    with pytest.raises(HTTPException) as exception:
        toy_router.create_toy(toy_data, service)

    assert exception.value.status_code == status.HTTP_409_CONFLICT
    assert exception.value.detail == "Já existe um brinquedo com esse nome!"


# Testes de atualização de um brinquedo (PUT "/toys/{toy_id}")
def test_update_toy():
    toy_data = ToyCreate(
        name="Carro Hot Wheels Azul",
        price=Decimal("24.90"),
        quantity=25,
        description="Carrinho esportivo em miniatura azul.",
        category="Carrinhos",
        brand="Hot Wheels",
        age_range="3 a 12 anos",
    )
    updated_toy = {**TOY, **toy_data.model_dump()}
    service = Mock()
    service.update_toy.return_value = updated_toy

    result = toy_router.update_toy(1, toy_data, service)

    assert result == updated_toy
    service.update_toy.assert_called_once_with(1, toy_data)


def test_update_toy_not_found():
    toy_data = ToyCreate(
        name="Carro Hot Wheels Azul",
        price=Decimal("24.90"),
        quantity=25,
    )
    service = Mock()
    service.update_toy.side_effect = ToyNotFoundError(1000)

    with pytest.raises(HTTPException) as exception:
        toy_router.update_toy(1000, toy_data, service)

    assert exception.value.status_code == status.HTTP_404_NOT_FOUND
    assert exception.value.detail == "Brinquedo não encontrado!"


def test_update_toy_already_exists():
    toy_data = ToyCreate(
        name="Nome existente",
        price=Decimal("24.90"),
        quantity=25,
    )
    service = Mock()
    service.update_toy.side_effect = ToyAlreadyExistsError(toy_data.name)

    with pytest.raises(HTTPException) as exception:
        toy_router.update_toy(1, toy_data, service)

    assert exception.value.status_code == status.HTTP_409_CONFLICT
    assert exception.value.detail == "Já existe um brinquedo com esse nome!"


# Testes de atualização parcial de um brinquedo (PATCH "/toys/{toy_id}")
def test_patch_toy():
    toy_data = ToyUpdate(name="Carro Hot Wheels Azul")
    updated_toy = {**TOY, "name": "Carro Hot Wheels Azul"}
    service = Mock()
    service.patch_toy.return_value = updated_toy

    result = toy_router.patch_toy(1, toy_data, service)

    assert result == updated_toy
    service.patch_toy.assert_called_once_with(1, toy_data)


def test_patch_toy_not_found():
    toy_data = ToyUpdate(name="Carro Hot Wheels Azul")
    service = Mock()
    service.patch_toy.side_effect = ToyNotFoundError(1000)

    with pytest.raises(HTTPException) as exception:
        toy_router.patch_toy(1000, toy_data, service)

    assert exception.value.status_code == status.HTTP_404_NOT_FOUND
    assert exception.value.detail == "Brinquedo não encontrado!"


def test_patch_toy_already_exists():
    toy_data = ToyUpdate(name="Nome existente")
    service = Mock()
    service.patch_toy.side_effect = ToyAlreadyExistsError(toy_data.name)

    with pytest.raises(HTTPException) as exception:
        toy_router.patch_toy(1, toy_data, service)

    assert exception.value.status_code == status.HTTP_409_CONFLICT
    assert exception.value.detail == "Já existe um brinquedo com esse nome!"


# Testes de exclusão de um brinquedo (DELETE "/toys/{toy_id}")
def test_delete_toy():
    service = Mock()

    result = toy_router.delete_toy(1, service)

    assert isinstance(result, Response)
    assert result.status_code == status.HTTP_204_NO_CONTENT
    assert result.body == b""
    service.delete_toy.assert_called_once_with(1)


def test_delete_toy_not_found():
    service = Mock()
    service.delete_toy.side_effect = ToyNotFoundError(1000)

    with pytest.raises(HTTPException) as exception:
        toy_router.delete_toy(1000, service)

    assert exception.value.status_code == status.HTTP_404_NOT_FOUND
    assert exception.value.detail == "Brinquedo não encontrado!"
