from src.app.models.toy import Toy
from src.app.repositories.toy import ToyRepository
from src.app.schemas.toy import ToyCreate, ToyUpdate


class ToyNotFoundError(Exception):
    pass


class ToyAlreadyExistsError(Exception):
    pass


class ToyService:
    """Regras de negócio dos brinquedos. Não conhece HTTP nem SQL."""

    def __init__(self, repository: ToyRepository):
        self.repository = repository

    def list_toys(self, skip: int = 0, limit: int = 100) -> list[Toy]:
        return self.repository.get_all(skip, limit)

    def get_toy(self, toy_id: int) -> Toy:
        toy = self.repository.get_by_id(toy_id)
        if toy is None:
            raise ToyNotFoundError(toy_id)
        return toy

    def create_toy(self, toy_data: ToyCreate) -> Toy:
        # O nome do brinquedo deve ser único
        if self.repository.get_by_name(toy_data.name):
            raise ToyAlreadyExistsError(toy_data.name)
        return self.repository.create(
            toy_data.name,
            toy_data.price,
            toy_data.quantity,
            toy_data.description,
            toy_data.category,
            toy_data.brand,
            toy_data.age_range,
        )

    def update_toy(self, toy_id: int, toy_data: ToyCreate) -> Toy:
        # Atualização total do brinquedo
        toy = self.get_toy(toy_id)
        changes = toy_data.model_dump()

        # O nome do brinquedo deve ser único
        if changes["name"] != toy.name and self.repository.get_by_name(changes["name"]):
            raise ToyAlreadyExistsError(changes["name"])

        return self.repository.update(toy, changes)

    def patch_toy(self, toy_id: int, toy_data: ToyUpdate) -> Toy:
        # Atualização parcial do brinquedo
        toy = self.get_toy(toy_id)
        changes = toy_data.model_dump(exclude_unset=True)

        # Atributos obrigatórios no banco
        for field in ("name", "price", "quantity"):
            if changes.get(field) is None:
                changes.pop(field, None)

        # O nome do brinquedo deve ser único
        if (
            "name" in changes
            and changes["name"] != toy.name
            and self.repository.get_by_name(changes["name"])
        ):
            raise ToyAlreadyExistsError(changes["name"])

        return self.repository.update(toy, changes)

    def delete_toy(self, toy_id: int) -> None:
        self.repository.delete(self.get_toy(toy_id))
