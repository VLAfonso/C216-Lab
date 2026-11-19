from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from src.app.database.session import get_db
from src.app.repositories.toy import ToyRepository
from src.app.schemas.toy import ToyCreate, ToyRead, ToyUpdate
from src.app.services.toy import ToyAlreadyExistsError, ToyNotFoundError, ToyService

router = APIRouter(prefix="/toys", tags=["Toys"])

NOT_FOUND = "Brinquedo não encontrado!"
ALREADY_EXISTS = "Já existe um brinquedo com esse nome!"


def get_toy_service(db: Annotated[Session, Depends(get_db)]) -> ToyService:
    return ToyService(ToyRepository(db))


ServiceDep = Annotated[ToyService, Depends(get_toy_service)]


@router.get("/", response_model=list[ToyRead])
def list_toys(service: ServiceDep, skip: int = 0, limit: int = 100):
    return service.list_toys(skip, limit)


@router.get("/{toy_id}", response_model=ToyRead)
def get_toy(toy_id: int, service: ServiceDep):
    try:
        return service.get_toy(toy_id)
    except ToyNotFoundError:
        raise HTTPException(status.HTTP_404_NOT_FOUND, NOT_FOUND) from None


@router.post("/", response_model=ToyRead, status_code=status.HTTP_201_CREATED)
def create_toy(toy_data: ToyCreate, service: ServiceDep):
    try:
        return service.create_toy(toy_data)
    except ToyAlreadyExistsError:
        raise HTTPException(status.HTTP_409_CONFLICT, ALREADY_EXISTS) from None


@router.put("/{toy_id}", response_model=ToyRead)
def update_toy(toy_id: int, toy_data: ToyCreate, service: ServiceDep):
    try:
        return service.update_toy(toy_id, toy_data)
    except ToyNotFoundError:
        raise HTTPException(status.HTTP_404_NOT_FOUND, NOT_FOUND) from None
    except ToyAlreadyExistsError:
        raise HTTPException(status.HTTP_409_CONFLICT, ALREADY_EXISTS) from None


@router.patch("/{toy_id}", response_model=ToyRead)
def patch_toy(toy_id: int, toy_data: ToyUpdate, service: ServiceDep):
    try:
        return service.patch_toy(toy_id, toy_data)
    except ToyNotFoundError:
        raise HTTPException(status.HTTP_404_NOT_FOUND, NOT_FOUND) from None
    except ToyAlreadyExistsError:
        raise HTTPException(status.HTTP_409_CONFLICT, ALREADY_EXISTS) from None


@router.delete("/{toy_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_toy(toy_id: int, service: ServiceDep):
    try:
        service.delete_toy(toy_id)
    except ToyNotFoundError:
        raise HTTPException(status.HTTP_404_NOT_FOUND, NOT_FOUND) from None
    return Response(status_code=status.HTTP_204_NO_CONTENT)
