from decimal import Decimal
from unittest.mock import MagicMock

import pytest

from src.app.models.toy import Toy
from src.app.repositories.toy import ToyRepository
from src.app.schemas.toy import ToyCreate, ToyUpdate
from src.app.services.toy import (
    ToyAlreadyExistsError,
    ToyNotFoundError,
    ToyService,
)


@pytest.fixture
def repository():
    return MagicMock(spec=ToyRepository)


@pytest.fixture
def service(repository):
    return ToyService(repository)


@pytest.fixture
def existing_toy():
    return Toy(
        id=1,
        name="Carro Hot Wheels Vermelho",
        price=Decimal("19.90"),
        quantity=30,
        description="Carrinho em miniatura vermelho para brincar e colecionar.",
        category="Carrinhos",
        brand="Hot Wheels",
        age_range="3 a 12 anos",
    )


# Testes de listagem de brinquedos (list_toys)
def test_list_toys(service, repository, existing_toy):
    repository.get_all.return_value = [existing_toy]

    toys = service.list_toys()

    assert toys == [existing_toy]
    repository.get_all.assert_called_once_with(0, 100)


# Testes de busca de um brinquedo (get_toy)
def test_get_toy_existing(service, repository, existing_toy):
    repository.get_by_id.return_value = existing_toy

    toy = service.get_toy(1)

    assert toy == existing_toy
    assert toy.id == 1
    assert toy.name == "Carro Hot Wheels Vermelho"
    assert toy.price == Decimal("19.90")
    assert toy.quantity == 30
    assert toy.description == (
        "Carrinho em miniatura vermelho para brincar e colecionar."
    )
    assert toy.category == "Carrinhos"
    assert toy.brand == "Hot Wheels"
    assert toy.age_range == "3 a 12 anos"
    repository.get_by_id.assert_called_once_with(1)


def test_get_toy_not_found(service, repository):
    repository.get_by_id.return_value = None

    with pytest.raises(ToyNotFoundError):
        service.get_toy(1000)


# Testes de criação de um brinquedo (create_toy)
def test_create_toy(service, repository):
    toy_data = ToyCreate(
        name="Boneca Barbie Bailarina",
        price=Decimal("129.90"),
        quantity=10,
        description="Boneca Barbie com roupa de bailarina.",
        category="Bonecas",
        brand="Barbie",
        age_range="3 a 10 anos",
    )
    created_toy = Toy(id=3, **toy_data.model_dump())

    repository.get_by_name.return_value = None
    repository.create.return_value = created_toy

    toy = service.create_toy(toy_data)

    assert toy == created_toy
    repository.get_by_name.assert_called_once_with(toy_data.name)
    repository.create.assert_called_once_with(
        toy_data.name,
        toy_data.price,
        toy_data.quantity,
        toy_data.description,
        toy_data.category,
        toy_data.brand,
        toy_data.age_range,
    )


def test_create_toy_duplicate_name(service, repository):
    toy_data = ToyCreate(
        name="Carro Hot Wheels Vermelho",
        price=Decimal("19.90"),
        quantity=30,
    )
    repository.get_by_name.return_value = Toy(
        id=1,
        name=toy_data.name,
        price=Decimal("19.90"),
        quantity=30,
    )

    with pytest.raises(ToyAlreadyExistsError):
        service.create_toy(toy_data)

    repository.create.assert_not_called()


# Testes de atualização total (update_toy)
def test_update_toy(service, repository, existing_toy):
    toy_data = ToyCreate(
        name="Novo Brinquedo",
        price=Decimal("49.90"),
        quantity=15,
        description="Nova descrição.",
        category="Jogos",
        brand="Hasbro",
        age_range="8 anos ou mais",
    )
    repository.get_by_id.return_value = existing_toy
    repository.get_by_name.return_value = None
    repository.update.return_value = existing_toy

    toy = service.update_toy(1, toy_data)

    assert toy == existing_toy
    repository.update.assert_called_once_with(
        existing_toy,
        toy_data.model_dump(),
    )


def test_update_toy_not_found(service, repository):
    toy_data = ToyCreate(
        name="Novo Brinquedo",
        price=Decimal("49.90"),
        quantity=15,
    )
    repository.get_by_id.return_value = None

    with pytest.raises(ToyNotFoundError):
        service.update_toy(1000, toy_data)

    repository.update.assert_not_called()


def test_update_toy_duplicate_name(service, repository, existing_toy):
    toy_data = ToyCreate(
        name="Nome de outro brinquedo",
        price=Decimal("49.90"),
        quantity=15,
    )
    repository.get_by_id.return_value = existing_toy
    repository.get_by_name.return_value = Toy(
        id=2,
        name=toy_data.name,
        price=Decimal("29.90"),
        quantity=20,
    )

    with pytest.raises(ToyAlreadyExistsError):
        service.update_toy(1, toy_data)

    repository.update.assert_not_called()


# Testes de atualização parcial (patch_toy)
def test_patch_toy_name(service, repository, existing_toy):
    toy_data = ToyUpdate(name="Novo Nome")
    repository.get_by_id.return_value = existing_toy
    repository.get_by_name.return_value = None
    repository.update.return_value = existing_toy

    toy = service.patch_toy(1, toy_data)

    assert toy == existing_toy
    repository.update.assert_called_once_with(
        existing_toy,
        {"name": "Novo Nome"},
    )


def test_patch_toy_price(service, repository, existing_toy):
    toy_data = ToyUpdate(price=Decimal("29.90"))
    repository.get_by_id.return_value = existing_toy
    repository.update.return_value = existing_toy

    service.patch_toy(1, toy_data)

    repository.update.assert_called_once_with(
        existing_toy,
        {"price": Decimal("29.90")},
    )
    repository.get_by_name.assert_not_called()


def test_patch_toy_not_found(service, repository):
    toy_data = ToyUpdate(name="Novo Nome")
    repository.get_by_id.return_value = None

    with pytest.raises(ToyNotFoundError):
        service.patch_toy(1000, toy_data)

    repository.update.assert_not_called()


def test_patch_toy_duplicate_name(service, repository, existing_toy):
    toy_data = ToyUpdate(name="Nome de outro brinquedo")
    repository.get_by_id.return_value = existing_toy
    repository.get_by_name.return_value = Toy(
        id=2,
        name=toy_data.name,
        price=Decimal("29.90"),
        quantity=20,
    )

    with pytest.raises(ToyAlreadyExistsError):
        service.patch_toy(1, toy_data)

    repository.update.assert_not_called()


# Testes de exclusão de brinquedos (delete_toy)
def test_delete_toy(service, repository, existing_toy):
    repository.get_by_id.return_value = existing_toy

    result = service.delete_toy(1)

    assert result is None
    repository.get_by_id.assert_called_once_with(1)
    repository.delete.assert_called_once_with(existing_toy)


def test_delete_toy_not_found(service, repository):
    repository.get_by_id.return_value = None

    with pytest.raises(ToyNotFoundError):
        service.delete_toy(1000)

    repository.delete.assert_not_called()
